// Regles del receptari independents de la pantalla i del desament al navegador.
const recipeCatalog = (() => {
    const recipes = [
        ...defaultRecipes.map(recipe => ({ ...recipe, collection: 'legacy' })),
        ...seasonalRecipes
    ].map(recipe => ({ ...recipe, ...recipePhotos[recipe.id] }));
    const builtInIds = new Set(recipes.map(recipe => recipe.id));

    function customRecipe(value) {
        const text = (input, max, required = false) => {
            if (typeof input !== 'string' || input.length > max || (required && !input.trim())) throw new Error('Revisa els camps de text de la recepta.');
            return input.trim();
        };
        if (!value || !Number.isSafeInteger(value.id) || value.id < 1 || builtInIds.has(value.id)) throw new Error('Identificador de recepta no vàlid.');
        if (!Number.isInteger(value.servings) || value.servings < 1 || value.servings > 20) throw new Error('Indica entre 1 i 20 racions.');
        if (!Number.isInteger(value.totalMinutes) || value.totalMinutes < 1 || value.totalMinutes > 1440) throw new Error('Indica un temps total entre 1 i 1440 minuts.');
        if (!['Fàcil', 'Mitjana', 'Difícil'].includes(value.difficulty)) throw new Error('Tria una dificultat vàlida.');
        const allowedSeasons = ['Hivern', 'Primavera', 'Estiu', 'Tardor'];
        if (!Array.isArray(value.seasons) || !value.seasons.length || !value.seasons.every(season => allowedSeasons.includes(season))) throw new Error('Tria almenys una temporada.');
        if (!Array.isArray(value.ingredients) || !value.ingredients.length || value.ingredients.length > 100) throw new Error('Afegeix entre 1 i 100 ingredients.');
        const ingredients = value.ingredients.map(ingredient => ({ item: text(ingredient.item, 150, true), qty: text(ingredient.qty, 100, true) }));
        let image = value.image || '';
        if (typeof image !== 'string' || image.length > 300000) throw new Error('La foto és massa gran. Tria una imatge més petita.');
        if (image && !/^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/]+={0,2}$/.test(image)) {
            let url;
            try { url = new URL(image); } catch { throw new Error('La foto ha de ser una imatge o un enllaç HTTPS.'); }
            if (url.protocol !== 'https:' || url.username || url.password || image.length > 2000) throw new Error('Utilitza un enllaç HTTPS de foto, sense credencials.');
        }
        return {
            id: value.id, custom: true, collection: 'mine', emoji: '🍽️',
            title: text(value.title, 120, true), description: text(value.description || '', 500),
            difficulty: value.difficulty, servings: value.servings, totalMinutes: value.totalMinutes,
            time: `${value.totalMinutes} min`, seasons: [...new Set(value.seasons)],
            ingredients, instructions: text(value.instructions, 15000, true),
            batchNote: text(value.batchNote || '', 1000), image, pantry: value.pantry === true,
            mealTypes: ['Dinar', 'Sopar'], tags: ['Recepta personal']
        };
    }

    function replaceCustomRecipes(values) {
        if (!Array.isArray(values) || values.length > 500) throw new Error('La llista de receptes personals no és vàlida.');
        const next = values.map(customRecipe);
        if (new Set(next.map(recipe => recipe.id)).size !== next.length) throw new Error('Hi ha receptes amb el mateix identificador.');
        recipes.splice(0, recipes.length, ...recipes.filter(recipe => !recipe.custom), ...next);
    }

    const normalize = value => String(value ?? '').normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '').toLowerCase();
    const ingredientName = ingredient => typeof ingredient === 'string' ? ingredient : ingredient.item;

    function matchesIngredient(ingredient, food) {
        const singular = { ous: 'ou', tomaquets: 'tomaquet', patates: 'patata', pastanagues: 'pastanaga',
            cebes: 'ceba', cigrons: 'cigro', llenties: 'llentia', mongetes: 'mongeta',
            xampinyons: 'xampinyo', bolets: 'bolet', carbassons: 'carbasso',
            pebrots: 'pebrot', espinacs: 'espinac', bledes: 'bleda', pèsols: 'pesol', pesols: 'pesol' };
        const words = value => normalize(value).replace(/[^a-z0-9]+/g, ' ').trim().split(/\s+/)
            .map(word => singular[word] || word).join(' ');
        const candidate = words(food);
        return Boolean(candidate && ` ${words(ingredientName(ingredient))} `.includes(` ${candidate} `));
    }

    function collectionOf(recipe, adopted = []) {
        return recipe.collection === 'recommended' && adopted.includes(recipe.id) ? 'mine' : recipe.collection;
    }

    const fridgeDefaults = () => ({ mode: 'any', basics: ['water', 'salt', 'oil', 'spices'] });
    function fridgeSettings(value) {
        if (value == null) return fridgeDefaults();
        if (!value || !['any', 'available', 'all', 'exact'].includes(value.mode) || !Array.isArray(value.basics) ||
            !value.basics.every(basic => ['water', 'salt', 'oil', 'spices'].includes(basic))) throw new Error('Les opcions de coincidència de la nevera no són vàlides.');
        return { mode: value.mode, basics: [...new Set(value.basics)] };
    }
    function isBasic(ingredient, basics = []) {
        const name = normalize(ingredientName(ingredient)).replace(/[’']/g, ' ').replace(/\s+/g, ' ').trim();
        if (/^sal i pebre$/.test(name)) return basics.includes('salt') && basics.includes('spices');
        return (basics.includes('water') && /^aigua(?:\s|$)/.test(name)) ||
            (basics.includes('salt') && /^sal(?: marina| fina| gruixuda)?$/.test(name)) ||
            (basics.includes('oil') && /^oli(?: d oliva| verge|$)/.test(name)) ||
            (basics.includes('spices') && /^(pebre(?: vermell)?|curri|curry|garam masala|cumi|curcuma|farigola|orenga|romani|canyella|paprika|nou moscada|caiena|all en pols|gingebre en pols)(?:\s|$)/.test(name));
    }
    function fridgeMatch(recipe, fridge, settings = fridgeDefaults()) {
        const { mode, basics } = fridgeSettings(settings);
        const foods = fridge.filter(food => !isBasic(food, basics));
        const ingredients = recipe.ingredients.filter(ingredient => !isBasic(ingredient, basics));
        const matched = ingredients.filter(ingredient => foods.some(food => matchesIngredient(ingredient, food)));
        const allFoodsUsed = foods.every(food => ingredients.some(ingredient => matchesIngredient(ingredient, food)));
        const canMake = ingredients.length > 0 && matched.length === ingredients.length;
        const accepted = foods.length > 0 && (mode === 'any' ? matched.length > 0 : mode === 'available' ? canMake :
            mode === 'all' ? allFoodsUsed : canMake && allFoodsUsed);
        return { accepted, matchCount: matched.length, missingCount: ingredients.length - matched.length };
    }

    function select(options = {}) {
        const { query = '', difficulty = 'all', collection = 'all', season = 'all',
            quick = false, batch = false, gluten = 'all', useFridge = false, fridge = [], adopted = [], fridgeOptions = fridgeDefaults(), sort = 'default' } = options;
        const term = normalize(query.trim());
        let selected = recipes.filter(recipe => {
            const kind = collectionOf(recipe, adopted);
            const matchesCollection = collection === 'all' ? kind !== 'legacy' : collection === 'pantry' ? kind === 'mine' && recipe.pantry === true : kind === collection;
            const matchesQuery = !term || normalize([recipe.title, recipe.description,
                ...recipe.ingredients.map(ingredientName), ...(recipe.tags || [])].join(' ')).includes(term);
            const matchesGluten = gluten === 'all' || (gluten === 'ingredients' ? glutenGuide.review(recipe).status === 'ingredients' : gluten === 'adapt' && glutenGuide.review(recipe).status === 'adapt');
            return matchesCollection && matchesQuery && matchesGluten &&
                (difficulty === 'all' || recipe.difficulty === difficulty) &&
                (season === 'all' || (recipe.seasons || []).includes(season)) &&
                (!quick || (recipe.totalMinutes || parseInt(recipe.time, 10)) <= 30) &&
                (!batch || Boolean(recipe.batchNote));
        });
        if (useFridge || sort === 'fridge') {
            selected = selected.map(recipe => ({ ...recipe, ...fridgeMatch(recipe, fridge, fridgeOptions) }));
            if (useFridge) selected = selected.filter(recipe => recipe.accepted);
            selected.sort((a, b) => b.matchCount - a.matchCount || a.missingCount - b.missingCount);
        }
        if (sort === 'time') selected.sort((a, b) => (a.totalMinutes || parseInt(a.time, 10)) - (b.totalMinutes || parseInt(b.time, 10)));
        if (sort === 'name') selected.sort((a, b) => a.title.localeCompare(b.title, 'ca'));
        return selected;
    }

    return { recipes, normalize, ingredientName, matchesIngredient, collectionOf, select, customRecipe, replaceCustomRecipes, fridgeDefaults, fridgeSettings, fridgeMatch };
})();
