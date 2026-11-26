const recipeClassification = (() => {
    const types = {
        lunch: 'Dinar', dinner: 'Sopar', breakfast: 'Esmorzar', snack: 'Berenar o snack',
        dessert: 'Postres', side: 'Guarnició o entrant', base: 'Base o component'
    };
    const parts = { carbs: 'Hidrats', protein: 'Proteïna', veg: 'Verdura' };
    const sourceLists = {
        favorite: 'Les meves favorites', today: 'Avui', snacks: 'Capritxos/snacks', easy: 'Fàcils i pràctiques',
        dinner: 'Sopars', festive: 'Dia festiu', later: 'Quan puguis', hits: 'Triomfs'
    };
    const status = {
        reviewed: 'Revisada per MyRealFood', created: 'Feta per mi', tested: 'Provada per mi',
        favorite: 'Preferida', sourceFavorite: 'Preferida a MyRealFood'
    };
    const mains = ['lunch', 'dinner'];
    const categories = {
        main: mains, dessert: ['dessert'], breakfast: ['breakfast'], snack: ['snack'], side: ['side'], base: ['base']
    };
    const proteinNames = {
        fish: 'Peix', seafood: 'Marisc o cefalòpodes', poultry: 'Pollastre', meat: 'Altres carns o embotits',
        egg: 'Ous', legumes: 'Llegums', tofu: 'Tofu', seitan: 'Seitan', dairy: 'Lactis'
    };
    const full = ['carbs', 'protein', 'veg'];
    const starchAndProtein = ['carbs', 'protein'];
    const proteinAndVeg = ['protein', 'veg'];
    // Els grups indiquen què destaca al plat. Guarnicions opcionals, espècies i condiments es valoren a part.
    const existing = {
        1: [proteinAndVeg, 'fish'], 2: [full, 'fish'], 3: [proteinAndVeg, 'egg'],
        4: [proteinAndVeg, 'meat'], 5: [full, 'tofu'], 6: [full, 'legumes'],
        7: [starchAndProtein, 'egg', ['breakfast', 'snack', 'dinner']], 8: [starchAndProtein, 'poultry'],
        9: [['carbs', 'veg']], 10: [['veg'], null, ['side']],
        101: [full, 'dairy'], 102: [full, 'legumes'], 103: [full, 'tofu'], 104: [full, 'seitan'],
        105: [full, 'fish'], 106: [full, 'egg'], 107: [full, 'fish'], 108: [full, 'tofu'],
        201: [full, 'tofu'], 202: [full, 'legumes'], 203: [full, 'legumes'], 204: [full, 'legumes'],
        205: [full, 'tofu'], 206: [full, 'egg'], 207: [full, 'fish'], 208: [full, 'poultry'],
        209: [starchAndProtein, 'legumes'], 210: [proteinAndVeg, 'seafood'],
        301: [starchAndProtein, 'egg'], 302: [full, 'dairy'], 303: [full, 'poultry'],
        304: [['veg'], null, ['side', ...mains]], 305: [full, 'legumes'], 306: [full, 'tofu'], 307: [full, 'meat'],
        308: [full, 'tofu'], 309: [starchAndProtein, 'egg'], 310: [full, 'tofu'], 311: [proteinAndVeg, 'dairy', ['side', ...mains]],
        401: [[], null, ['dessert', 'snack']], 402: [[], null, ['dessert', 'snack']],
        501: [full, 'poultry'], 502: [starchAndProtein, 'fish'], 503: [full, 'poultry'],
        504: [full, 'egg'], 505: [starchAndProtein, 'meat'], 506: [full, 'meat'], 507: [full, 'seafood'],
        508: [starchAndProtein, 'poultry'], 509: [starchAndProtein, 'meat'], 510: [full, 'legumes']
    };

    function inferredParts(recipe) {
        const rules = {
            carbs: /^(?:patat|moniat|arr[oò]s|pasta|pa(?:\s|$)|espaguet|macarr|nyoqui|quinoa|cusc[uú]s|blat|civada|llenti|cigr|mongeta (?:blanca|vermella)|feso|faso)/i,
            protein: /^(?:ou(?:s|\s|$)|clare|tofu|seitan|tempeh|pollastr|pit de pollastr|gall dindi|vedell|carn|porc|llom|pernil|sal[móo]|llu[cç]|bacall|tony|peix|sardin|verat|s[ií]pi|pop|llagost|gamba|llenti|cigr|mongeta (?:blanca|vermella)|feso|faso|edamame|formatge|mozzarella|cottage|iogurt proteic)/i,
            veg: /^(?:carbass|pastanag|tom[aà]quet(?! triturat)|espinac|br[oò]quil|col(?:\s|$)|coliflor|alberg[ií]ni|enciam|ruca|bled|carxof|cogombr|porro|bolet|xampiny[oó]|esp[aà]rrec|pebrot(?! vermell (?:dol[cç]|fumat|picant|de la vera))|verdur)/i
        };
        const ingredients = recipe.ingredients.map(item => typeof item === 'string' ? item : item.item);
        return Object.keys(rules).filter(part => ingredients.some(item => rules[part].test(item)));
    }

    function profile(recipe) {
        if (recipe.types) return { types: recipe.types, parts: recipe.parts || [], protein: recipe.protein };
        const [plateParts, protein, uses] = existing[recipe.id] || [];
        return { types: uses || categories[recipe.category] || mains, parts: plateParts || inferredParts(recipe), protein };
    }

    function labels(recipe, savedStatus) {
        return {
            reviewed: recipe.sourceReviewed === true,
            created: recipe.createdByUser === true || recipe.custom === true ||
                (recipe.sourceName === 'Recepta pròpia' && recipe.collection === 'mine'),
            tested: savedStatus === 'tested' || (savedStatus !== 'pending' && recipe.testedByUser === true),
            favorite: savedStatus === 'favorite',
            sourceFavorite: Boolean(recipe.sourceLists?.length)
        };
    }

    function canPlan(recipe) {
        return !recipe.incomplete && recipe.collection !== 'legacy' &&
            profile(recipe).types.some(type => mains.includes(type));
    }

    return { types, parts, sourceLists, status, categories, proteinNames, profile, labels, canPlan };
})();
