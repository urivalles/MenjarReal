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
        return recipeCatalog.recipes.filter(recipe => recipeCatalog.collectionOf(recipe, adopted) === 'mine' && recipeClassification.canPlan(recipe));
    }

    function eligible(settings, adopted = [], date = new Date()) {
        const options = settingsFor(settings);
        const season = options.season === 'auto' ? currentSeason(date) : options.season;
        return ownRecipes(adopted).filter(recipe =>
            !recipeClassification.profile(recipe).types.includes('side') && !recipeClassification.isFestive(recipe) &&
            (!options.seasonEnabled || (recipe.seasons || []).includes(season)) &&
            (!options.maxMinutes || recipeCatalog.minutesFor(recipe) <= options.maxMinutes));
    }

    function proteinGroup(recipe) {
        const protein = recipeClassification.profile(recipe).protein;
        return protein === 'seafood' ? 'fish' : protein || 'other';
    }

    function weekdayPreference(recipe) {
        const { parts } = recipeClassification.profile(recipe);
        const fullPlate = ['carbs', 'protein', 'veg'].every(part => parts.includes(part));
        return Math.min(recipeCatalog.minutesFor(recipe) / 8, 7) - (fullPlate ? 7 : 0);
    }

    function snapshot(slots) {
        return slots.flatMap(day => meals.map(meal => day[meal])).filter(slot => slot?.kind === 'recipe');
    }

    function recipePairs(dayValues) {
        return dayValues.filter(day => day.lunch?.kind === 'recipe' && day.dinner?.kind === 'recipe')
            .map(day => [day.lunch.id, day.dinner.id]);
    }

    function pickRecipe(pool, { assigned, sameDayIds = [], nearbyIds = [], previousPairs = [], oldIds = [], fridge = [], preferFridge = false, exclude = null, random = Math.random }) {
        let candidates = pool.filter(recipe => recipe.id !== exclude);
        if (!candidates.length) return null;
        const distinct = candidates.filter(recipe => !sameDayIds.includes(recipe.id));
        if (distinct.length) candidates = distinct;
        const newPairs = candidates.filter(recipe => !previousPairs.some(pair =>
            pair.includes(recipe.id) && pair.some(id => sameDayIds.includes(id))));
        if (newPairs.length) candidates = newPairs;
        const usage = new Map();
        const groups = new Map();
        const varieties = new Map();
        const byId = new Map(recipeCatalog.recipes.map(recipe => [recipe.id, recipe]));
        for (const slot of assigned) {
            usage.set(slot.id, (usage.get(slot.id) || 0) + 1);
            const recipe = byId.get(slot.id);
            if (!recipe) continue;
            const group = proteinGroup(recipe);
            groups.set(group, (groups.get(group) || 0) + 1);
            if (recipe.proteinVariety) varieties.set(recipe.proteinVariety, (varieties.get(recipe.proteinVariety) || 0) + 1);
        }
        const groupsFor = ids => new Set(ids.map(id => byId.get(id)).filter(Boolean).map(proteinGroup));
        const sameDayGroups = groupsFor(sameDayIds);
        const nearbyGroups = groupsFor(nearbyIds);
        return candidates.map(recipe => {
            const group = proteinGroup(recipe);
            const groupCount = groups.get(group) || 0;
            const varietyBonus = (group === 'fish' || group === 'legumes') && groupCount < 3 ? 12 : 0;
            const match = preferFridge ? recipeCatalog.fridgeMatch(recipe, fridge) : null;
            const fridgeBonus = match?.matchCount ? 12 * match.matchCount / (match.matchCount + match.missingCount) : 0;
            const score = (usage.get(recipe.id) || 0) * 100 +
                (nearbyIds.includes(recipe.id) ? 35 : 0) + (sameDayGroups.has(group) ? 24 : 0) +
                (nearbyGroups.has(group) ? 9 : 0) + groupCount * 5 + (varieties.get(recipe.proteinVariety) || 0) * 11 +
                (oldIds.includes(recipe.id) ? 8 : 0) + weekdayPreference(recipe) - varietyBonus - fridgeBonus + random() * 4;
            return { recipe, score };
        }).sort((a, b) => a.score - b.score)[0].recipe;
    }

    function generate(raw, { adopted = [], fridge = [], date = new Date(), random = Math.random,
        selectedDays = days, selectedMeals = meals, onlyEmpty = true } = {}) {
        const state = normalizeState(raw);
        const targets = new Map();
        for (const day of days) {
            if (!selectedDays.includes(day)) continue;
            const openMeals = meals.filter(meal => {
                const slot = state.days[day][meal];
                return selectedMeals.includes(meal) && (!slot || (!onlyEmpty && !slot.locked));
            });
            if (openMeals.length) targets.set(day, openMeals);
        }
        if (!targets.size) return { ok: false, reason: 'no-targets', state, count: 0 };
        const pool = eligible(state.settings, adopted, date);
        if (!pool.length) return { ok: false, reason: 'empty-pool', state, count: 0 };
        const original = normalizeState(raw);
        for (const [day, openMeals] of targets) for (const meal of openMeals) state.days[day][meal] = null;
        let filled = 0;
        const width = state.settings.batchDays || 1;
        for (let start = 0; start < days.length; start += width) {
            const block = days.slice(start, start + width);
            for (const meal of meals) {
                const blockTargets = block.filter(day => targets.get(day)?.includes(meal));
                if (!blockTargets.length) continue;
                const sameDayIds = blockTargets.flatMap(day => meals.filter(other => other !== meal)
                    .map(other => state.days[day][other]).filter(slot => slot?.kind === 'recipe').map(slot => slot.id));
                const neighbors = [days[start - 1], days[start + block.length]].filter(Boolean);
                const nearbyIds = snapshot(neighbors.map(day => state.days[day])).map(slot => slot.id);
                const recipe = pickRecipe(pool, {
                    assigned: snapshot(Object.values(state.days)), sameDayIds, nearbyIds,
                    previousPairs: recipePairs(days.slice(0, start).map(day => state.days[day])),
                    oldIds: blockTargets.map(day => original.days[day][meal]?.id).filter(Number.isInteger),
                    fridge, preferFridge: state.settings.preferFridge, random
                });
                for (const day of blockTargets) {
                    filled++;
                    state.days[day][meal] = { kind: 'recipe', id: recipe.id, title: recipe.title, locked: false,
                        ...(state.settings.batchDays ? { batchKey: `${block[0]}:${meal}:${recipe.id}` } : {}) };
                }
            }
        }
        return { ok: true, state, count: pool.length, filled };
    }

    function replaceMeal(raw, day, meal, options = {}) {
        const state = normalizeState(raw);
        if (!days.includes(day) || !meals.includes(meal)) return { ok: false, reason: 'invalid-slot', state };
        const pool = eligible(state.settings, options.adopted, options.date);
        const current = state.days[day][meal];
        const others = days.flatMap(key => meals.filter(kind => key !== day || kind !== meal).map(kind => state.days[key][kind])).filter(slot => slot?.kind === 'recipe');
        const dayIndex = days.indexOf(day);
        const neighbors = [days[dayIndex - 1], days[dayIndex + 1]].filter(Boolean);
        const recipe = pickRecipe(pool, {
            assigned: others,
            sameDayIds: snapshot([state.days[day]]).filter(slot => slot !== current).map(slot => slot.id),
            nearbyIds: snapshot(neighbors.map(key => state.days[key])).map(slot => slot.id),
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

    return { days, meals, defaults, currentSeason, settingsFor, normalizeState, ownRecipes, eligible, proteinGroup, weekdayPreference, generate, replaceMeal, preparations };
})();
