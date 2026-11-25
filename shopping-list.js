// Quantitats orientatives: només se sumen numèricament unitats compatibles.
const shoppingListEngine = (() => {
    const empty = () => ({ version: 1, items: [], dismissed: [] });
    const nameKey = name => recipeCatalog.normalize(name).replace(/[’']/g, '').replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
    const format = value => new Intl.NumberFormat('ca', { maximumFractionDigits: 2, useGrouping: false }).format(value);

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

    const singular = { unitats: 'unitat', culleradetes: 'culleradeta', cullerades: 'cullerada', grans: 'gra', filets: 'filet', lloms: 'llom', grapats: 'grapat', llaunes: 'llauna', trossos: 'tros', gots: 'got', tasses: 'tassa', llesques: 'llesca', cabeces: 'cabeça', fulles: 'fulla', pessics: 'pessic' };

    function parseQuantity(quantity) {
        const raw = String(quantity || '').trim().replace(/(\d)\s*([½¼¾])/g, '$1 $2').replace(/½/g, '1/2').replace(/¼/g, '1/4').replace(/¾/g, '3/4');
        const range = raw.match(/^(\d+(?:[.,]\d+)?)\s*[–—-]\s*(\d+(?:[.,]\d+)?)(.*)$/);
        if (range) {
            const low = parseQuantity(range[1] + range[3]);
            const high = parseQuantity(range[2] + range[3]);
            if (!low || !high || low.amount > high.amount) return null;
            return { ...low, max: high.amount };
        }
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
            [/^gots?\b\s*/i, 'gots', 1], [/^(tassa|tasses)\b\s*/i, 'tasses', 1], [/^llesc(?:a|ues)\b\s*/i, 'llesques', 1],
            [/^cabe(?:ça|ces)\b\s*/i, 'cabeces', 1]
        ];
        let unit = 'unitats';
        for (const [pattern, label, factor] of units) {
            if (pattern.test(tail)) { unit = label; amount *= factor; tail = tail.replace(pattern, ''); break; }
        }
        // Un descriptor desconegut es manté separat: no inventem equivalències.
        const suffix = tail.replace(/^[,;·\s]+/, '').trim();
        // Intervals, sumes i equivalències necessiten revisar-se com un conjunt.
        if (/[\d+–—]/.test(suffix) || /\b(i|o)\b/i.test(suffix)) return null;
        return { amount, max: amount, unit, suffix, key: `${unit}|${recipeCatalog.normalize(suffix)}` };
    }

    function addPart(parts, parsed, factor = 1) {
        if (!parts.has(parsed.key)) parts.set(parsed.key, { ...parsed, amount: 0, max: 0 });
        const part = parts.get(parsed.key);
        part.amount += parsed.amount * factor;
        part.max += parsed.max * factor;
    }

    function formatPart(part) {
        const amount = format(part.amount);
        const max = format(part.max);
        const unit = part.amount === 1 && part.max === 1 ? singular[part.unit] || part.unit : part.unit;
        return amount + (amount === max ? '' : '–' + max) + ' ' + unit + (part.suffix ? ' · ' + part.suffix : '');
    }

    const recipeCountUnits = { fulla: 'fulles', fulles: 'fulles', llesca: 'llesques', llesques: 'llesques', pessic: 'pessics', pessics: 'pessics' };

    function scaleRecipeQuantity(quantity, factor) {
        if (!quantity || factor === 1) return quantity;
        const note = quantity.match(/\s*·\s*1 per (?:persona|ració)$|,\s+\p{L}[^\d+]*$/iu)?.[0] || '';
        const amount = quantity.slice(0, quantity.length - note.length);
        const perPiece = /^(\d+\s+(?:filets?|lloms?|trossos|tros))((?: de | d[’'])\d.+)$/i.exec(amount);
        const parsed = parseQuantity(perPiece?.[1] ?? amount);
        if (!parsed) return /^\s*[\d½¼¾]/.test(quantity) ? `${quantity} · quantitat original` : quantity;
        if (parsed.unit === 'unitats' && Object.hasOwn(recipeCountUnits, parsed.suffix)) {
            parsed.unit = recipeCountUnits[parsed.suffix];
            parsed.suffix = '';
        }
        return formatPart({ ...parsed, amount: parsed.amount * factor, max: parsed.max * factor }) + (perPiece?.[2] || '') + note;
    }

    function requirements(rawPlanner, recipes = recipeCatalog.recipes) {
        const planner = weeklyPlannerEngine.normalizeState(rawPlanner);
        const occurrences = new Map();
        const missing = [];
        let mealCount = 0;
        for (const day of weeklyPlannerEngine.days) for (const meal of weeklyPlannerEngine.meals) {
            const slot = planner.days[day][meal];
            if (slot?.kind !== 'recipe') continue;
            mealCount++;
            const recipe = recipes.find(item => item.id === slot.id && !item.incomplete);
            if (!recipe) { missing.push(slot.title); continue; }
            if (!occurrences.has(recipe.id)) occurrences.set(recipe.id, { recipe, times: 0 });
            occurrences.get(recipe.id).times++;
        }
        const grouped = new Map();
        const unscaled = [];
        for (const { recipe, times } of occurrences.values()) {
            if (!recipe.servings) unscaled.push(recipe.title);
            for (const ingredient of recipe.ingredients) {
                const servings = ingredient.servings || recipe.servings;
                const factor = servings ? times * planner.settings.people / servings : times;
                const name = recipeCatalog.ingredientName(ingredient).trim();
                const quantity = typeof ingredient === 'string' ? '' : ingredient.qty;
                const key = nameKey(name);
                if (!grouped.has(key)) grouped.set(key, { key, name, parts: new Map(), free: new Map(), sources: [] });
                const row = grouped.get(key);
                row.sources.push({ recipeId: recipe.id, title: recipe.title, quantity: String(quantity || ''), factor });
                const parsed = parseQuantity(quantity);
                if (parsed) {
                    addPart(row.parts, parsed, factor);
                } else {
                    const description = String(quantity || 'Quantitat segons recepta');
                    const plain = /^(al gust|un pessic|una mica|unes gotes|fins cobrir)$/i.test(description);
                    if (!row.free.has(description)) row.free.set(description, { description, factor: 0, plain });
                    row.free.get(description).factor += factor;
                }
            }
        }
        const rows = [...grouped.values()].map(row => {
            const quantities = [...row.parts.values()].sort((a, b) => a.key.localeCompare(b.key)).map(formatPart);
            quantities.push(...[...row.free.values()].sort((a, b) => a.description.localeCompare(b.description)).map(part => part.plain || part.factor === 1 ? part.description : `${part.description} × ${format(part.factor)} (revisa)`));
            let quantity = quantities.join(' + ');
            if (quantity.length > 500) quantity = 'Quantitats diverses: consulta les receptes d’origen';
            return { id: `menu:${row.key}`, key: row.key, name: row.name, menuName: row.name, quantity, menuQuantity: quantity, origin: 'menu', checked: false, edited: false, needsReview: false, sources: row.sources };
        });
        return { rows, mealCount, missing: [...new Set(missing)], unscaled: [...new Set(unscaled)] };
    }

    function coversQuantity(previous, next) {
        const available = previous.split(' + ').map(parseQuantity);
        const needed = next.split(' + ').map(parseQuantity);
        return available.every(Boolean) && needed.every(Boolean) && needed.every(part =>
            available.some(old => old.key === part.key && old.amount >= part.amount && old.max >= part.max));
    }

    function merge(rawList, required) {
        const current = validate(rawList);
        const generated = new Map(required.rows.map(row => [row.key, row]));
        const dismissed = current.dismissed;
        const skipped = new Set(dismissed.map(item => item.key));
        const items = [];
        for (const previous of current.items) {
            if (previous.origin === 'manual') { items.push(previous); continue; }
            const next = generated.get(previous.key);
            if (next && !skipped.has(previous.key)) {
                const changed = previous.menuQuantity !== next.quantity;
                // Si el menú només perd racions d’aquestes receptes, el que ja s’ha comprat encara és suficient.
                const stillCovered = next.sources.every(source => previous.sources.some(old =>
                    old.recipeId === source.recipeId && old.quantity === source.quantity && old.factor >= source.factor));
                const checked = previous.checked && (!changed || stillCovered || coversQuantity(previous.menuQuantity, next.quantity));
                items.push(previous.edited ? { ...next, id: previous.id, name: previous.name, quantity: previous.quantity, edited: true, needsReview: changed || previous.needsReview, checked } : { ...next, id: previous.id, checked });
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

    const categories = [
        ['Verdures i hortalisses', /^(enciam|ruca|tomaquet|cogombre|ceba|all(?! en pols)|patat[ae]|moniato|carbassa|carbasso|porro|col|pastanaga|pebrot|broquil|espinac|bleda|alberginia|verdur|bolet|xampinyo)/],
        ['Fruita i fruita seca', /^(poma|pera|alvocat|llimona|llima|nous?\b|anou|avellan|ametlla)/],
        ['Carn i ous', /^(carn|pit de pollastre|pollastre|gall dindi|llom|porc|vedella|pernil|ou\b|ous\b|clares)/],
        ['Peix i marisc', /^(peix|lluc|salmo|bacalla|tonyina|sardina|marisc|gamba|musclo)/],
        ['Llegums i proteïnes vegetals', /^(cigro|llentia|llenties|mongeta|fesol|fasol|tofu|edamame|pesol)/],
        ['Lactis i formatges', /^(llet|iogurt|cottage|formatge|parmesa|paneer|mozzarella|grana padano)/],
        ['Cereals, pasta i pa', /^(arros|pasta|noodle|nyoqui|macarro|espagueti|pa\b|quinoa|civada|farina)/],
        ['Rebost i condiments', /^(oli|sal|pebre|vinagre|salsa|brou|mid[oó]|curri|mostassa|esp[eè]ci|canyella|farigola|llorer|gingebre|cumi|julivert|aigua|olives)/]
    ];

    function exportText(list, mode) {
        const pending = list.items.filter(item => !item.checked);
        if (mode === 'simple') {
            const unique = new Map(pending.map(item => [nameKey(item.name), item.name]));
            return [...unique.values()].sort((a, b) => a.localeCompare(b, 'ca')).map(name => '• ' + name).join('\n');
        }
        const blocks = ['Llista de la compra'];
        for (const checked of [false, true]) {
            const groups = new Map();
            for (const item of list.items.filter(row => row.checked === checked)) {
                const key = nameKey(item.name);
                if (!groups.has(key)) groups.set(key, { name: item.name, parts: new Map(), other: new Set() });
                const group = groups.get(key);
                // El separador també apareix en quantitats manuscrites. Només dividim si totes les parts són llegibles.
                const quantities = item.quantity.split(' + ');
                const parts = quantities.map(parseQuantity);
                if (parts.every(Boolean)) parts.forEach(part => addPart(group.parts, part));
                else if (item.quantity) group.other.add(item.quantity);
            }
            if (!groups.size) continue;
            if (checked) blocks.push('✓ Comprats');
            const byCategory = new Map();
            for (const [key, group] of groups) {
                const category = categories.find(([, pattern]) => pattern.test(key))?.[0] || 'Altres';
                if (!byCategory.has(category)) byCategory.set(category, []);
                byCategory.get(category).push(group);
            }
            for (const category of [...categories.map(([name]) => name), 'Altres']) {
                if (!byCategory.has(category)) continue;
                const lines = byCategory.get(category).sort((a, b) => a.name.localeCompare(b.name, 'ca')).map(group => {
                    const quantity = [...[...group.parts.values()].map(formatPart), ...group.other].join(' + ');
                    return '• ' + group.name + (quantity ? ' — ' + quantity : '');
                });
                blocks.push([category, ...lines].join('\n'));
            }
        }
        return blocks.length > 1 ? blocks.join('\n\n') : '';
    }

    return { empty, validate, nameKey, parseQuantity, scaleRecipeQuantity, requirements, merge, remove, edit, exportText };
})();
