// Importació local. Una futura lectura d'imatges pot produir el mateix esborrany;
// ni el parser ni els suggeriments escriuen dades o fan connexions externes.
const menuImportEngine = (() => {
    const { days, meals } = weeklyPlannerEngine;
    const key = (day, meal) => `${day}:${meal}`;
    const normalized = text => recipeCatalog.normalize(text).replace(/[^a-z0-9]+/g, ' ').trim();
    const cleanTitle = text => String(text || '').trim();
    const emptyTitle = text => !text || /^(?:[-–—]|buit|sense assignar)$/i.test(text);

    function matchRecipe(title, adopted = []) {
        const matches = weeklyPlannerEngine.ownRecipes(adopted).filter(recipe => normalized(recipe.title) === normalized(title));
        return matches.length === 1 ? matches[0] : null;
    }

    function parseText(text, adopted = []) {
        if (typeof text !== 'string' || text.length > 12000) throw new Error('El menú pot tenir com a màxim 12.000 caràcters.');
        const entries = new Map();
        const warnings = [];
        let day = null;
        function add(meal, value, line) {
            const title = cleanTitle(value);
            if (emptyTitle(title)) return;
            if (title.length > 160) { warnings.push(`Línia ${line}: plat massa llarg; introdueix-lo a la previsualització (màxim 160 caràcters).`); return; }
            if (!day || !meals.includes(meal)) { warnings.push(`Línia ${line}: falta indicar el dia o si és dinar o sopar: ${title}`); return; }
            if (entries.has(key(day, meal))) { warnings.push(`Línia ${line}: ${day} ja té aquest àpat. No s’ha afegit: ${title}`); return; }
            entries.set(key(day, meal), { day, meal, title, recipeId: matchRecipe(title, adopted)?.id || null, replace: false });
        }
        text.split(/\r?\n/).forEach((raw, index) => {
            let line = raw.trim().replace(/^[-*•]\s*/, '');
            if (!line) return;
            // Taules copiades: Dia | Dinar | Sopar, també separades per tabuladors.
            const columns = line.replace(/^\|\s*|\s*\|$/g, '').split(/\s*\|\s*|\t+/);
            if (columns.length > 1) {
                if (/^(dia|dies)$/.test(normalized(columns[0])) || columns.every(part => /^[-: ]*$/.test(part))) return;
                if (days.includes(normalized(columns[0])) && columns.length === 3) {
                    day = normalized(columns[0]); add('lunch', columns[1], index + 1); add('dinner', columns[2], index + 1); return;
                }
            }
            const dayMatch = line.match(/^(dilluns|dimarts|dimecres|dijous|divendres|dissabte|diumenge)\b\s*[:\-–—]?\s*/i);
            if (dayMatch) { day = dayMatch[1].toLowerCase(); line = line.slice(dayMatch[0].length); if (!line) return; }
            const markers = [...line.matchAll(/\b(dinar|sopar)\s*[:\-–—]\s*/gi)];
            if (!markers.length) { warnings.push(`Línia ${index + 1}: no s’ha interpretat: ${raw.trim()}`); return; }
            if (line.slice(0, markers[0].index).trim()) warnings.push(`Línia ${index + 1}: text sense àpat: ${line.slice(0, markers[0].index).trim()}`);
            markers.forEach((marker, i) => {
                const end = markers[i + 1]?.index ?? line.length;
                add(marker[1].toLowerCase() === 'dinar' ? 'lunch' : 'dinner', line.slice(marker.index + marker[0].length, end).replace(/[;|\s]+$/, ''), index + 1);
            });
        });
        return { entries: [...entries.values()], warnings };
    }

    function apply(raw, entries, adopted = []) {
        const state = weeklyPlannerEngine.normalizeState(raw);
        if (!Array.isArray(entries) || entries.length > 14) throw new Error('Revisa els 14 àpats de la setmana.');
        const own = weeklyPlannerEngine.ownRecipes(adopted);
        const seen = new Set();
        let added = 0, replaced = 0, skipped = 0, notes = 0;
        for (const entry of entries) {
            if (!days.includes(entry.day) || !meals.includes(entry.meal) || seen.has(key(entry.day, entry.meal))) throw new Error('Hi ha un dia o àpat invàlid o duplicat.');
            seen.add(key(entry.day, entry.meal));
            const title = cleanTitle(entry.title);
            if (emptyTitle(title)) continue; // Un camp buit mai no esborra un àpat existent.
            if (title.length > 160) throw new Error('Cada plat pot tenir com a màxim 160 caràcters.');
            const previous = state.days[entry.day][entry.meal];
            if (previous && entry.replace !== true) { skipped++; continue; }
            const recipe = entry.recipeId == null ? null : own.find(item => item.id === entry.recipeId);
            if (entry.recipeId != null && !recipe) throw new Error('Una recepta ja no és a «Les meves». Revisa la previsualització.');
            const batch = typeof entry.batchKey === 'string' && /^import:[a-z]+:(lunch|dinner):\d+$/.test(entry.batchKey) ? { batchKey: entry.batchKey.slice(0, 100) } : {};
            state.days[entry.day][entry.meal] = recipe ? { kind: 'recipe', id: recipe.id, title: recipe.title, locked: true, ...batch } : { kind: 'note', title, locked: true };
            if (previous) replaced++; else added++;
            if (!recipe) notes++;
        }
        return { state, added, replaced, skipped, notes };
    }

    // Només grups identificables pels ingredients/títol; cap càlcul de nutrients.
    function foodGroups(text) {
        const value = normalized(text);
        const definitions = {
            'proteïna:tofu': /\btofu\b/, 'proteïna:seitan': /\bseitan\b/,
            'proteïna:ou': /\bous?\b/, 'proteïna:peix': /\b(salmo|lluc|bacalla|peix|tonyina|sardina)\b/,
            'proteïna:carn': /\b(pollastre|carn|gall dindi|llom|porc)\b/, 'proteïna:lactis': /\b(cottage|paneer|parmesa|formatge)\b/,
            llegums: /\b(cigrons?|llenties|mongetes?|fesols?|fasols?|edamame)\b/,
            'verdura:fulles': /\b(espinacs|bledes|col|kale)\b/,
            'verdura:crucíferes': /\b(broquil|coliflor)\b/,
            'verdura:bolets': /\b(bolets?|xampinyons?)\b/,
            'verdura:arrels': /\b(pastanagues?|carbassa)\b/,
            'verdura:altres': /\b(carbasso|pebrots?|tomaquets?|esparrecs)\b/,
            'verdura:ceba': /\b(ceba|porro)\b/,
            cereals: /\b(arros|pa|noodles|pasta)\b/, tubercles: /\b(patates?|moniato|nyoquis)\b/
        };
        return Object.entries(definitions).filter(([, pattern]) => pattern.test(value)).map(([group]) => group);
    }

    function suggest(raw, entries, { adopted = [], fridge = [], date = new Date() } = {}) {
        const preview = apply(raw, entries, adopted);
        const state = preview.state;
        const pool = weeklyPlannerEngine.eligible(state.settings, adopted, date);
        const additions = [];
        const recipeText = recipe => recipe.ingredients.map(recipeCatalog.ingredientName).join(' ');
        for (let start = 0; start < days.length; start += state.settings.batchDays || 1) {
            const block = days.slice(start, start + (state.settings.batchDays || 1));
            for (const meal of meals) {
                const targets = block.filter(day => !state.days[day][meal]);
                if (!targets.length || !pool.length) continue;
                const existing = days.flatMap(day => meals.map(kind => state.days[day][kind])).filter(Boolean);
                const counts = new Map();
                existing.forEach(slot => {
                    const recipe = slot.kind === 'recipe' && recipeCatalog.recipes.find(item => item.id === slot.id);
                    foodGroups(recipe ? recipeText(recipe) : slot.title).forEach(group => counts.set(group, (counts.get(group) || 0) + 1));
                });
                const otherIds = block.flatMap(day => meals.filter(kind => kind !== meal).map(kind => state.days[day][kind]?.id));
                let candidates = pool.filter(recipe => !otherIds.includes(recipe.id));
                if (!candidates.length) candidates = pool;
                const recipe = candidates.map(item => {
                    const groups = foodGroups(recipeText(item));
                    const usage = existing.filter(slot => slot.kind === 'recipe' && slot.id === item.id).length;
                    const variety = groups.reduce((sum, group) => sum + ((counts.get(group) || 0) ? Math.min(counts.get(group), 4) * 2 : -5), 0);
                    const overlap = state.settings.preferFridge ? recipeCatalog.fridgeMatch(item, fridge).matchCount : 0;
                    return { recipe: item, score: usage * 100 + variety - overlap };
                }).sort((a, b) => a.score - b.score || a.recipe.id - b.recipe.id)[0].recipe;
                for (const day of targets) {
                    const entry = { day, meal, title: recipe.title, recipeId: recipe.id, replace: false,
                        ...(state.settings.batchDays ? { batchKey: `import:${block[0]}:${meal}:${recipe.id}` } : {}) };
                    additions.push(entry);
                    state.days[day][meal] = { kind: 'recipe', id: recipe.id, title: recipe.title, locked: true };
                }
            }
        }
        const bySlot = new Map(entries.map(entry => [key(entry.day, entry.meal), { ...entry }]));
        additions.forEach(entry => bySlot.set(key(entry.day, entry.meal), entry));
        return { entries: [...bySlot.values()], count: additions.length, emptyPool: !pool.length };
    }

    return { parseText, matchRecipe, apply, suggest, foodGroups };
})();
