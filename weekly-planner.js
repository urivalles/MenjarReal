// Planificació local: regles de varietat i preferències, sense crides d'IA.
const weeklyPlannerEngine = (() => {
    const days = ['dilluns', 'dimarts', 'dimecres', 'dijous', 'divendres', 'dissabte', 'diumenge'];
    const meals = ['lunch', 'dinner'];
    const seasons = ['Hivern', 'Primavera', 'Estiu', 'Tardor'];
    const defaults = { seasonEnabled: true, season: 'auto', batchDays: 0, people: 1, preferFridge: false, maxMinutes: 0 };

    function currentSeason(date = new Date()) {
        const month = Number(new Intl.DateTimeFormat('en', { month: 'numeric', timeZone: 'Europe/Paris' }).format(date));
        return month <= 2 || month === 12 ? 'Hivern' : month <= 5 ? 'Primavera' : month <= 8 ? 'Estiu' : 'Tardor';
    }

    function settingsFor(value = {}) {
        value = value && typeof value === 'object' ? value : {};
        return {
            seasonEnabled: typeof value.seasonEnabled === 'boolean' ? value.seasonEnabled : defaults.seasonEnabled,
            season: value.season === 'auto' || seasons.includes(value.season) ? value.season : 'auto',
            batchDays: [0, 1, 2, 3, 4].includes(Number(value.batchDays)) ? Number(value.batchDays) : 0,
            people: Number.isInteger(Number(value.people)) && Number(value.people) >= 1 && Number(value.people) <= 8 ? Number(value.people) : 1,
            preferFridge: value.preferFridge === true,
            maxMinutes: [0, 20, 30, 45, 60].includes(Number(value.maxMinutes)) ? Number(value.maxMinutes) : 0
        };
    }

    function cleanSlot(value, legacy = false) {
        if (!value || typeof value !== 'object') return null;
        if (value.kind === 'note' && typeof value.title === 'string' && value.title.trim()) {
            return { kind: 'note', title: value.title.trim().slice(0, 160), locked: value.locked !== false };
        }
        if (value.kind === 'out' || value.kind === 'leftovers') {
            return { kind: value.kind, title: typeof value.title === 'string' ? value.title.slice(0, 160) : '', locked: value.locked !== false };
        }
        if ((value.kind === 'recipe' || legacy) && Number.isInteger(value.id) && typeof value.title === 'string') {
            return { kind: 'recipe', id: value.id, title: value.title.slice(0, 160), locked: legacy || value.locked === true,
                ...(typeof value.batchKey === 'string' ? { batchKey: value.batchKey.slice(0, 100) } : {}) };
        }
        return null;
    }

    function normalizeState(raw) {
        const result = { version: 2, settings: settingsFor(raw?.settings), days: {} };
        for (const day of days) {
            if (raw?.version === 2) {
                result.days[day] = { lunch: cleanSlot(raw.days?.[day]?.lunch), dinner: cleanSlot(raw.days?.[day]?.dinner) };
            } else {
                // L'antic planificador tenia un únic àpat per dia: es conserva al dinar i es fixa.
                result.days[day] = { lunch: cleanSlot(raw?.[day], true), dinner: null };
            }
        }
        return result;
    }

    function ownRecipes(adopted = []) {
        return recipeCatalog.recipes.filter(recipe => recipeCatalog.collectionOf(recipe, adopted) === 'mine');
    }

    function eligible(settings, adopted = [], date = new Date()) {
        const options = settingsFor(settings);
        const season = options.season === 'auto' ? currentSeason(date) : options.season;
        return ownRecipes(adopted).filter(recipe =>
            (!options.seasonEnabled || (recipe.seasons || []).includes(season)) &&
            (!options.maxMinutes || (recipe.totalMinutes || parseInt(recipe.time, 10)) <= options.maxMinutes));
    }

    function proteinGroup(recipe) {
        for (const ingredient of recipe.ingredients) {
            const name = recipeCatalog.normalize(recipeCatalog.ingredientName(ingredient));
            if (/tofu/.test(name)) return 'tofu';
            if (/seitan/.test(name)) return 'seitan';
            if (/ous?\b/.test(name)) return 'egg';
            if (/salmo|lluc|bacalla|peix|tonyina|sardina/.test(name)) return 'fish';
            if (/pollastre|gall dindi|carn/.test(name)) return 'meat';
            if (/cigrons|llenties|mongeta|fesols/.test(name)) return 'legumes';
            if (/paneer|formatge|cottage|parmesa/.test(name)) return 'dairy';
        }
        return 'other';
    }

    function snapshot(slots) {
        return slots.flatMap(day => meals.map(meal => day[meal])).filter(slot => slot?.kind === 'recipe');
    }

    function recipePairs(dayValues) {
        return dayValues.filter(day => day.lunch?.kind === 'recipe' && day.dinner?.kind === 'recipe')
            .map(day => [day.lunch.id, day.dinner.id]);
    }

    function pickRecipe(pool, { assigned, sameDayIds = [], previousDayIds = [], previousPairs = [], oldIds = [], fridge = [], preferFridge = false, exclude = null, random = Math.random }) {
        let candidates = pool.filter(recipe => recipe.id !== exclude);
        if (!candidates.length) return null;
        const distinct = candidates.filter(recipe => !sameDayIds.includes(recipe.id));
        if (distinct.length) candidates = distinct;
        const newPairs = candidates.filter(recipe => !previousPairs.some(pair =>
            pair.includes(recipe.id) && pair.some(id => sameDayIds.includes(id))));
        if (newPairs.length) candidates = newPairs;
        const usage = new Map();
        const groups = new Map();
        for (const slot of assigned) {
            usage.set(slot.id, (usage.get(slot.id) || 0) + 1);
            const recipe = recipeCatalog.recipes.find(item => item.id === slot.id);
            if (recipe) groups.set(proteinGroup(recipe), (groups.get(proteinGroup(recipe)) || 0) + 1);
        }
        const sameDayGroups = sameDayIds.map(id => recipeCatalog.recipes.find(recipe => recipe.id === id)).filter(Boolean).map(proteinGroup);
        return candidates.map(recipe => {
            const group = proteinGroup(recipe);
            const meaningful = recipe.ingredients.filter(ingredient => !/^(oli|sal|pebre|aigua)/.test(recipeCatalog.normalize(recipeCatalog.ingredientName(ingredient))));
            const matches = meaningful.filter(ingredient => fridge.some(food => recipeCatalog.matchesIngredient(ingredient, food))).length;
            const fridgeBonus = preferFridge && meaningful.length ? matches / meaningful.length * 12 : 0;
            const score = (usage.get(recipe.id) || 0) * 100 +
                (previousDayIds.includes(recipe.id) ? 35 : 0) +
                (sameDayGroups.includes(group) ? 18 : 0) +
                (groups.get(group) || 0) * 3 + (oldIds.includes(recipe.id) ? 8 : 0) - fridgeBonus + random() * 5;
            return { recipe, score };
        }).sort((a, b) => a.score - b.score)[0].recipe;
    }

    function generate(raw, { adopted = [], fridge = [], date = new Date(), random = Math.random } = {}) {
        const state = normalizeState(raw);
        const pool = eligible(state.settings, adopted, date);
        if (!pool.length) return { ok: false, reason: 'empty-pool', state, count: 0 };
        const original = normalizeState(raw);
        // Es mantenen exclusivament les decisions fixades; la resta es regenera.
        for (const day of days) for (const meal of meals) {
            if (!state.days[day][meal]?.locked) state.days[day][meal] = null;
        }
        const width = state.settings.batchDays || 1;
        for (let start = 0; start < days.length; start += width) {
            const block = days.slice(start, start + width);
            for (const meal of meals) {
                const targets = block.filter(day => !state.days[day][meal]?.locked);
                if (!targets.length) continue;
                const sameDayIds = block.flatMap(day => meals.filter(other => other !== meal)
                    .map(other => state.days[day][other]).filter(slot => slot?.kind === 'recipe').map(slot => slot.id));
                const previousDayIds = start > 0 ? snapshot([state.days[days[start - 1]]]).map(slot => slot.id) : [];
                const recipe = pickRecipe(pool, {
                    assigned: snapshot(Object.values(state.days)), sameDayIds, previousDayIds,
                    previousPairs: recipePairs(days.slice(0, start).map(day => state.days[day])),
                    oldIds: targets.map(day => original.days[day][meal]?.id).filter(Number.isInteger),
                    fridge, preferFridge: state.settings.preferFridge, random
                });
                for (const day of targets) {
                    state.days[day][meal] = { kind: 'recipe', id: recipe.id, title: recipe.title, locked: false,
                        ...(state.settings.batchDays ? { batchKey: `${block[0]}:${meal}:${recipe.id}` } : {}) };
                }
            }
        }
        return { ok: true, state, count: pool.length };
    }

    function replaceMeal(raw, day, meal, options = {}) {
        const state = normalizeState(raw);
        if (!days.includes(day) || !meals.includes(meal)) return { ok: false, reason: 'invalid-slot', state };
        const pool = eligible(state.settings, options.adopted, options.date);
        const current = state.days[day][meal];
        const others = days.flatMap(key => meals.filter(kind => key !== day || kind !== meal).map(kind => state.days[key][kind])).filter(slot => slot?.kind === 'recipe');
        const dayIndex = days.indexOf(day);
        const recipe = pickRecipe(pool, {
            assigned: others,
            sameDayIds: snapshot([state.days[day]]).filter(slot => slot !== current).map(slot => slot.id),
            previousDayIds: dayIndex ? snapshot([state.days[days[dayIndex - 1]]]).map(slot => slot.id) : [],
            previousPairs: recipePairs(days.filter(key => key !== day).map(key => state.days[key])),
            exclude: current?.kind === 'recipe' ? current.id : null,
            fridge: options.fridge || [], preferFridge: state.settings.preferFridge, random: options.random
        });
        if (!recipe) return { ok: false, reason: pool.length ? 'no-alternative' : 'empty-pool', state };
        // Canviar un àpat és una decisió explícita: conserva la fixació, però surt del bloc.
        state.days[day][meal] = { kind: 'recipe', id: recipe.id, title: recipe.title, locked: current?.locked === true };
        return { ok: true, state };
    }

    function preparations(raw) {
        const state = normalizeState(raw);
        const groups = new Map();
        for (const day of days) for (const meal of meals) {
            const slot = state.days[day][meal];
            if (slot?.kind !== 'recipe') continue;
            const key = `${slot.id}:${slot.batchKey || `${day}:${meal}`}`;
            if (!groups.has(key)) groups.set(key, { id: slot.id, title: slot.title, firstDay: day, portions: 0, uses: 0 });
            const group = groups.get(key);
            group.portions += state.settings.people;
            group.uses++;
        }
        return [...groups.values()];
    }

    return { days, meals, defaults, currentSeason, settingsFor, normalizeState, ownRecipes, eligible, proteinGroup, generate, replaceMeal, preparations };
})();
