// Quantitats orientatives: només se sumen numèricament unitats compatibles.
const shoppingListEngine = (() => {
    const empty = () => ({ version: 1, items: [], dismissed: [] });
    const nameKey = name => recipeCatalog.normalize(name).replace(/[’']/g, '').replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
    const format = value => new Intl.NumberFormat('ca', { maximumFractionDigits: 2 }).format(value);

    function validate(value) {
        if (!value || value.version !== 1 || !Array.isArray(value.items) || value.items.length > 2000 || !Array.isArray(value.dismissed) || value.dismissed.length > 2000) throw new Error('La llista de la compra no té un format vàlid.');
        const text = (input, limit, required = false) => {
            if (typeof input !== 'string' || input.length > limit || (required && !input.trim())) throw new Error('Revisa el nom i la quantitat dels ingredients.');
            return input.trim();
        };
        const items = value.items.map(item => {
            if (!item || !['manual', 'menu'].includes(item.origin) || typeof item.checked !== 'boolean') throw new Error('Hi ha un ingredient de compra no vàlid.');
            const result = { id: text(item.id, 1000, true), name: text(item.name, 150, true), quantity: text(item.quantity, 500), checked: item.checked, origin: item.origin };
            if (item.origin === 'menu') {
                if (!Array.isArray(item.sources) || item.sources.length > 1400) throw new Error('Les receptes d’origen no són vàlides.');
                Object.assign(result, { key: text(item.key, 200, true), menuName: text(item.menuName, 150, true), menuQuantity: text(item.menuQuantity, 500), edited: item.edited === true, needsReview: item.needsReview === true });
                result.sources = item.sources.map(source => {
                    if (!source || !Number.isSafeInteger(source.recipeId) || !Number.isFinite(source.factor) || source.factor <= 0 || source.factor > 112) throw new Error('Una quantitat d’origen no és vàlida.');
                    return { recipeId: source.recipeId, title: text(source.title, 120, true), quantity: text(source.quantity, 150), factor: source.factor };
                });
            }
            return result;
        });
        if (new Set(items.map(item => item.id)).size !== items.length || new Set(items.filter(item => item.origin === 'menu').map(item => item.key)).size !== items.filter(item => item.origin === 'menu').length) throw new Error('Hi ha ingredients duplicats a la llista.');
        const dismissed = value.dismissed.map(item => ({ key: text(item.key, 200, true), quantity: text(item.quantity, 500) }));
        return { version: 1, items, dismissed };
    }

    function parseQuantity(quantity) {
        const raw = String(quantity || '').trim().replace(/(\d)\s*([½¼¾])/g, '$1 $2').replace(/½/g, '1/2').replace(/¼/g, '1/4').replace(/¾/g, '3/4');
        // Un punt amb tres xifres pot indicar milers o decimals: conserva el text.
        if (/^[1-9]\d*\.\d{3}(?=\D|$)/.test(raw)) return null;
        const match = raw.match(/^(?:(\d+)\s+(\d+)\/(\d+)|(\d+)\/(\d+)|(\d+(?:[.,]\d+)?))\s*(.*)$/);
        if (!match) return null;
        let amount = match[1] ? Number(match[1]) + Number(match[2]) / Number(match[3]) : match[4] ? Number(match[4]) / Number(match[5]) : Number(match[6].replace(',', '.'));
        let tail = match[7].trim();
        if (!Number.isFinite(amount) || amount < 0 || amount > 1e9 || /^[–—\-\/+\d.,]/.test(tail)) return null;
        const units = [
            [/^(kg|quilograms?|quilos?)\b\s*/i, 'g', 1000], [/^(g|grams?)\b\s*/i, 'g', 1],
            [/^(ml|mil·lilitres?|mililitres?)\b\s*/i, 'ml', 1], [/^(l|litres?)\b\s*/i, 'ml', 1000],
            [/^(unitats?\b|u\.(?=\s|$))\s*/i, 'unitats', 1], [/^(culleradeta|culleradetes)\b\s*/i, 'culleradetes', 1],
            [/^(cullerada|cullerades)\b\s*/i, 'cullerades', 1], [/^(grans|gra|dents|dent)\b\s*/i, 'grans', 1],
            [/^filets?\b\s*/i, 'filets', 1], [/^lloms?\b\s*/i, 'lloms', 1], [/^grapats?\b\s*/i, 'grapats', 1],
            [/^(llauna|llaunes)\b\s*/i, 'llaunes', 1], [/^(tros|trossos)\b\s*/i, 'trossos', 1],
            [/^gots?\b\s*/i, 'gots', 1], [/^(tassa|tasses)\b\s*/i, 'tasses', 1]
        ];
        let unit = 'unitats';
        for (const [pattern, label, factor] of units) {
            if (pattern.test(tail)) { unit = label; amount *= factor; tail = tail.replace(pattern, ''); break; }
        }
        // Un descriptor desconegut es manté separat: no inventem equivalències.
        const suffix = tail.replace(/^[,;\s]+/, '').trim();
        // Intervals, sumes i equivalències necessiten revisar-se com un conjunt.
        if (/[\d+–—]/.test(suffix) || /\b(i|o)\b/i.test(suffix)) return null;
        return { amount, unit, suffix, key: `${unit}|${recipeCatalog.normalize(suffix)}` };
    }

    function requirements(rawPlanner) {
        const planner = weeklyPlannerEngine.normalizeState(rawPlanner);
        const occurrences = new Map();
        const missing = [];
        let mealCount = 0;
        for (const day of weeklyPlannerEngine.days) for (const meal of weeklyPlannerEngine.meals) {
            const slot = planner.days[day][meal];
            if (slot?.kind !== 'recipe') continue;
            mealCount++;
            const recipe = recipeCatalog.recipes.find(item => item.id === slot.id);
            if (!recipe) { missing.push(slot.title); continue; }
            if (!occurrences.has(recipe.id)) occurrences.set(recipe.id, { recipe, times: 0 });
            occurrences.get(recipe.id).times++;
        }
        const grouped = new Map();
        const unscaled = [];
        for (const { recipe, times } of occurrences.values()) {
            const factor = recipe.servings ? times * planner.settings.people / recipe.servings : times;
            if (!recipe.servings) unscaled.push(recipe.title);
            for (const ingredient of recipe.ingredients) {
                const name = recipeCatalog.ingredientName(ingredient).trim();
                const quantity = typeof ingredient === 'string' ? '' : ingredient.qty;
                const key = nameKey(name);
                if (!grouped.has(key)) grouped.set(key, { key, name, parts: new Map(), free: new Map(), sources: [] });
                const row = grouped.get(key);
                row.sources.push({ recipeId: recipe.id, title: recipe.title, quantity: String(quantity || ''), factor });
                const parsed = parseQuantity(quantity);
                if (parsed) {
                    if (!row.parts.has(parsed.key)) row.parts.set(parsed.key, { ...parsed, amount: 0 });
                    row.parts.get(parsed.key).amount += parsed.amount * factor;
                } else {
                    const description = String(quantity || 'Quantitat segons recepta');
                    const plain = /^(al gust|un pessic|una mica|unes gotes|fins cobrir)$/i.test(description);
                    if (!row.free.has(description)) row.free.set(description, { description, factor: 0, plain });
                    row.free.get(description).factor += factor;
                }
            }
        }
        const rows = [...grouped.values()].map(row => {
            const singular = { unitats: 'unitat', culleradetes: 'culleradeta', cullerades: 'cullerada', grans: 'gra', filets: 'filet', lloms: 'llom', grapats: 'grapat', llaunes: 'llauna', trossos: 'tros', gots: 'got', tasses: 'tassa' };
            const quantities = [...row.parts.values()].sort((a, b) => a.key.localeCompare(b.key)).map(part => `${format(part.amount)} ${part.amount === 1 ? singular[part.unit] || part.unit : part.unit}${part.suffix ? ` · ${part.suffix}` : ''}`);
            quantities.push(...[...row.free.values()].sort((a, b) => a.description.localeCompare(b.description)).map(part => part.plain || part.factor === 1 ? part.description : `${part.description} × ${format(part.factor)} (revisa)`));
            let quantity = quantities.join(' + ');
            if (quantity.length > 500) quantity = 'Quantitats diverses: consulta les receptes d’origen';
            return { id: `menu:${row.key}`, key: row.key, name: row.name, menuName: row.name, quantity, menuQuantity: quantity, origin: 'menu', checked: false, edited: false, needsReview: false, sources: row.sources };
        });
        return { rows, mealCount, missing: [...new Set(missing)], unscaled: [...new Set(unscaled)] };
    }

    function merge(rawList, required) {
        const current = validate(rawList);
        const generated = new Map(required.rows.map(row => [row.key, row]));
        const dismissed = current.dismissed.filter(item => generated.get(item.key)?.quantity === item.quantity);
        const skipped = new Set(dismissed.map(item => item.key));
        const items = [];
        for (const previous of current.items) {
            if (previous.origin === 'manual') { items.push(previous); continue; }
            const next = generated.get(previous.key);
            if (next && !skipped.has(previous.key)) {
                const changed = previous.menuQuantity !== next.quantity;
                items.push(previous.edited ? { ...next, id: previous.id, name: previous.name, quantity: previous.quantity, edited: true, needsReview: changed || previous.needsReview, checked: changed ? false : previous.checked } : { ...next, id: previous.id, checked: changed ? false : previous.checked });
                generated.delete(previous.key);
            } else if (!next && previous.edited) {
                items.push({ id: previous.id, name: previous.name, quantity: previous.quantity, checked: previous.checked, origin: 'manual' });
            }
        }
        for (const row of generated.values()) if (!skipped.has(row.key)) {
            let id = row.id;
            while (items.some(item => item.id === id)) id += ':new';
            items.push({ ...row, id });
        }
        return validate({ version: 1, items, dismissed });
    }

    function remove(rawList, id) {
        const list = validate(rawList);
        const item = list.items.find(row => row.id === id);
        if (!item) return list;
        list.items = list.items.filter(row => row.id !== id);
        if (item.origin === 'menu') list.dismissed = [...list.dismissed.filter(row => row.key !== item.key), { key: item.key, quantity: item.menuQuantity }];
        return list;
    }

    function edit(rawList, id, name, quantity) {
        const list = validate(rawList);
        const item = list.items.find(row => row.id === id);
        if (!item) throw new Error('Aquest ingredient ja no és a la llista.');
        item.name = name.trim(); item.quantity = quantity.trim();
        if (item.origin === 'menu') { item.edited = item.name !== item.menuName || item.quantity !== item.menuQuantity; item.needsReview = false; }
        return validate(list);
    }

    return { empty, validate, nameKey, parseQuantity, requirements, merge, remove, edit };
})();
