// Un sol document local permet restaurar una còpia amb una única escriptura.
// Aquest mòdul es pot substituir per un repositori remot en una fase posterior.
const appData = (() => {
    const key = 'realfood.data.v1';
    const requiredFields = ['customRecipes', 'myFridge', 'weeklyPlanner', 'adoptedRecipes'];
    const fields = [...requiredFields, 'shoppingList', 'fridgePreferences'];
    const empty = () => ({ version: 1, customRecipes: [], myFridge: [], weeklyPlanner: weeklyPlannerEngine.normalizeState(null), adoptedRecipes: [], shoppingList: shoppingListEngine.empty(), fridgePreferences: recipeCatalog.fridgeDefaults() });
    let warning = '';
    let unreadablePrimary = false;
    let lastStoredDocument = null;

    function validate(value) {
        if (!value || value.version !== 1 || !requiredFields.every(field => Object.hasOwn(value, field))) throw new Error('El format de les dades no és compatible.');
        if (!Array.isArray(value.customRecipes) || value.customRecipes.length > 500) throw new Error('La llista de receptes no és vàlida.');
        const customRecipes = value.customRecipes.map(recipeCatalog.customRecipe);
        if (new Set(customRecipes.map(recipe => recipe.id)).size !== customRecipes.length) throw new Error('Hi ha receptes duplicades.');
        if (!Array.isArray(value.myFridge) || value.myFridge.length > 500 || !value.myFridge.every(food => typeof food === 'string' && food.trim() && food.length <= 150)) throw new Error('La nevera de la còpia no és vàlida.');
        if (!Array.isArray(value.adoptedRecipes) || !value.adoptedRecipes.every(id => Number.isInteger(id) && recipeCatalog.recipes.some(recipe => recipe.id === id && recipe.collection === 'recommended'))) throw new Error('La llista de receptes adoptades no és vàlida.');
        const planner = value.weeklyPlanner;
        if (!planner || planner.version !== 2 || !planner.settings || typeof planner.settings !== 'object' || !planner.days || !weeklyPlannerEngine.days.every(day => planner.days[day] && weeklyPlannerEngine.meals.every(meal => Object.hasOwn(planner.days[day], meal)))) throw new Error('El menú de la còpia no és vàlid.');
        const normalizedPlanner = weeklyPlannerEngine.normalizeState(planner);
        for (const day of weeklyPlannerEngine.days) for (const meal of weeklyPlannerEngine.meals) {
            if (planner.days[day][meal] !== null && normalizedPlanner.days[day][meal] === null) throw new Error('Hi ha un àpat no vàlid a la còpia.');
        }
        const shoppingList = shoppingListEngine.validate(Object.hasOwn(value, 'shoppingList') ? value.shoppingList : shoppingListEngine.empty());
        const fridgePreferences = recipeCatalog.fridgeSettings(value.fridgePreferences);
        return { version: 1, customRecipes, myFridge: [...value.myFridge], weeklyPlanner: normalizedPlanner, adoptedRecipes: [...new Set(value.adoptedRecipes)], shoppingList, fridgePreferences };
    }

    function readLegacy(name, fallback) {
        try {
            const raw = localStorage.getItem(name);
            return raw === null ? fallback : JSON.parse(raw);
        } catch {
            warning = 'Algunes dades locals no es poden llegir. Els registres originals es mantenen; comprova la informació abans de desar canvis.';
            return fallback;
        }
    }

    function load() {
        try {
            const raw = localStorage.getItem(key);
            lastStoredDocument = raw;
            if (raw !== null) return validate(JSON.parse(raw));
        } catch {
            unreadablePrimary = true;
            warning = 'No es poden llegir les dades locals noves. No s’han sobreescrit. Revisa les còpies disponibles abans de desar canvis.';
        }
        const candidate = empty();
        const fridge = readLegacy('myFridge', []);
        const adopted = readLegacy('adoptedRecipes', []);
        if (Array.isArray(fridge)) candidate.myFridge = fridge.filter(food => typeof food === 'string' && food.trim() && food.length <= 150);
        if (Array.isArray(adopted)) candidate.adoptedRecipes = adopted.filter(id => recipeCatalog.recipes.some(recipe => recipe.collection === 'recommended' && recipe.id === id));
        candidate.weeklyPlanner = weeklyPlannerEngine.normalizeState(readLegacy('weeklyPlanner', null));
        return validate(candidate);
    }

    let state = load();
    const snapshot = () => JSON.parse(JSON.stringify(state));

    function replace(value, explicitRestore = false) {
        if (unreadablePrimary && !explicitRestore) throw new Error('Les dades locals no es poden llegir. Restaura una còpia vàlida abans de desar canvis.');
        if (!explicitRestore && localStorage.getItem(key) !== lastStoredDocument) throw new Error('Les dades han canviat en una altra finestra. Recarrega l’app abans de continuar; els canvis de l’altra finestra es conserven.');
        const next = validate(value);
        const serialized = JSON.stringify(next);
        localStorage.setItem(key, serialized);
        lastStoredDocument = serialized;
        state = next;
        warning = '';
        unreadablePrimary = false;
        return snapshot();
    }

    function getItem(name) {
        return fields.includes(name) ? JSON.stringify(state[name]) : null;
    }

    function setItem(name, serialized) {
        if (!fields.includes(name)) throw new Error('Camp de dades desconegut.');
        return replace({ ...snapshot(), [name]: JSON.parse(serialized) });
    }
    function update(changes) {
        if (!changes || !Object.keys(changes).every(name => fields.includes(name))) throw new Error('Camp de dades desconegut.');
        return replace({ ...snapshot(), ...changes });
    }

    function backup() {
        return JSON.stringify({ format: 'realfood-personal-backup', version: 1, exportedAt: new Date().toISOString(), data: snapshot() }, null, 2);
    }

    function parseBackup(text) {
        if (typeof text !== 'string' || text.length > 12000000) throw new Error('La còpia és massa gran o no és un fitxer de text vàlid.');
        let value;
        try { value = JSON.parse(text); } catch { throw new Error('El fitxer no és una còpia JSON vàlida.'); }
        if (!value || value.format !== 'realfood-personal-backup' || value.version !== 1) throw new Error('Aquest fitxer no és una còpia compatible de MenjarReal.');
        return validate(value.data);
    }

    return { key, getItem, setItem, update, snapshot, restore: value => replace(value, true), backup, parseBackup, validate, get warning() { return warning; } };
})();
