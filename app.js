document.addEventListener('DOMContentLoaded', () => {
    const recipes = recipeCatalog.recipes;

    function escapeHtml(value) {
        return String(value ?? '').replace(/[&<>"']/g, char => ({
            '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
        })[char]);
    }

    function ingredientLabel(ingredient) {
        return typeof ingredient === 'string' ? ingredient :
            [ingredient.item, ingredient.qty].filter(Boolean).join(' — ');
    }

    function hasIngredient(ingredient) {
        return myFridge.some(food => recipeCatalog.matchesIngredient(ingredient, food));
    }

    function readStored(key, fallback, validate) {
        try {
            const value = JSON.parse(appData.getItem(key));
            return validate(value) ? value : fallback;
        } catch {
            return fallback;
        }
    }

    // --- State ---
    let customRecipes = readStored('customRecipes', [], Array.isArray);
    recipeCatalog.replaceCustomRecipes(customRecipes);
    let myFridge = readStored('myFridge', [], value =>
        Array.isArray(value) && value.every(food => typeof food === 'string' && food.trim()));
    let fridgePreferences = recipeCatalog.fridgeSettings(readStored('fridgePreferences', null, value => value && typeof value === 'object'));
    let weeklyPlanner = weeklyPlannerEngine.normalizeState(readStored('weeklyPlanner', null,
        value => value && typeof value === 'object' && !Array.isArray(value)));
    let adoptedRecipes = readStored('adoptedRecipes', [], value => Array.isArray(value) &&
        value.every(id => Number.isInteger(id) && recipes.some(recipe =>
            recipe.id === id && recipe.collection === 'recommended')));
    let shoppingList = readStored('shoppingList', shoppingListEngine.empty(), value => value?.version === 1);
    let shoppingUndo = null;
    let editingShoppingId = null;
    let selectedCollection = 'all';
    let editingRecipeId = null;
    let customPhoto = '';
    let photoVersion = 0;
    let photoBusy = false;
    let pendingBackup = null;

    const daysOfWeek = ['Dilluns', 'Dimarts', 'Dimecres', 'Dijous', 'Divendres', 'Dissabte', 'Diumenge'];
    const fridgeModeNames = { any: 'algun ingredient', available: 'només el que tinc', all: 'tots els triats', exact: 'exactament aquests' };

    // --- DOM Elements ---
    const navLinks = document.querySelectorAll('.nav-links li');
    const views = document.querySelectorAll('.view');
    const pageTitle = document.getElementById('page-title');
    
    // Recipes DOM
    const recipesContainer = document.getElementById('recipes-container');
    const filterChips = document.querySelectorAll('.filter-chips .chip:not(#filter-by-fridge-btn)');
    const filterByFridgeBtn = document.getElementById('filter-by-fridge-btn');
    const searchInput = document.getElementById('search-recipe');
    const collectionButtons = document.querySelectorAll('.collection-chip');
    const seasonFilter = document.getElementById('season-filter');
    const quickFilter = document.getElementById('quick-filter');
    const glutenFilter = document.getElementById('gluten-filter');
    const recipeResults = document.getElementById('recipe-results');
    const collectionSummary = document.getElementById('collection-summary');
    const catalogNotice = document.getElementById('catalog-notice');
    const pantryHelp = document.getElementById('pantry-help');
    const recipeSort = document.getElementById('recipe-sort');
    const activeFilterCount = document.getElementById('active-filter-count');
    const activeFilterSummary = document.getElementById('active-filter-summary');
    const recipeFilterPanel = document.getElementById('recipe-filter-panel');
    const toggleRecipeFilters = document.getElementById('toggle-recipe-filters');
    recipeFilterPanel.hidden = true;
    toggleRecipeFilters.addEventListener('click', () => {
        recipeFilterPanel.hidden = !recipeFilterPanel.hidden;
        toggleRecipeFilters.setAttribute('aria-expanded', String(!recipeFilterPanel.hidden));
    });
    
    // Fridge DOM
    const ingredientInput = document.getElementById('ingredient-input');
    const addIngredientBtn = document.getElementById('add-ingredient-btn');
    const ingredientsList = document.getElementById('ingredients-list');
    const fridgeRecipeList = document.getElementById('fridge-recipes');
    const fridgeRecipeSummary = document.getElementById('fridge-recipe-summary');
    const fridgeMatchMode = document.getElementById('fridge-match-mode');
    const fridgeMatchHelp = document.getElementById('fridge-match-help');
    const planRecipeModal = document.getElementById('plan-recipe-modal');
    const planRecipeDay = document.getElementById('plan-recipe-day');
    const planRecipeMeal = document.getElementById('plan-recipe-meal');
    const planRecipeFeedback = document.getElementById('plan-recipe-feedback');
    const planRecipeAlternatives = document.getElementById('plan-recipe-alternatives');
    const savePlanRecipe = document.getElementById('save-plan-recipe');
    let recipeToPlan = null;
    let planRecipeTrigger = null;
    
    // Planner DOM
    const plannerGrid = document.querySelector('.planner-grid');
    const clearPlannerBtn = document.getElementById('clear-planner-btn');
    const generatePlannerBtn = document.getElementById('generate-planner-btn');
    const plannerStatus = document.getElementById('planner-status');
    const plannerPoolInfo = document.getElementById('planner-pool-info');
    const plannerModeHelp = document.getElementById('planner-mode-help');
    const plannerBatchSummary = document.getElementById('planner-batch-summary');
    const plannerPreparations = document.getElementById('planner-preparations');
    const plannerSettingsPanel = document.getElementById('planner-settings-panel');
    const togglePlannerFilters = document.getElementById('toggle-planner-filters');
    const plannerPreferencesSummary = document.getElementById('planner-preferences-summary');
    plannerSettingsPanel.hidden = true;
    togglePlannerFilters.addEventListener('click', () => {
        plannerSettingsPanel.hidden = !plannerSettingsPanel.hidden;
        togglePlannerFilters.setAttribute('aria-expanded', String(!plannerSettingsPanel.hidden));
    });
    const plannerControls = {
        seasonEnabled: document.getElementById('planner-season-enabled'),
        season: document.getElementById('planner-season'),
        batchDays: document.getElementById('planner-cooking'),
        people: document.getElementById('planner-people'),
        maxMinutes: document.getElementById('planner-max-time'),
        preferFridge: document.getElementById('planner-fridge')
    };
    const mealModal = document.getElementById('planner-meal-modal');
    const closeMealBtn = document.getElementById('close-planner-meal');
    const mealForm = document.getElementById('planner-meal-form');
    const mealDay = document.getElementById('planner-meal-day');
    const mealType = document.getElementById('planner-meal-type');
    const mealChoice = document.getElementById('planner-meal-choice');
    const mealNote = document.getElementById('planner-meal-note');
    const mealFeedback = document.getElementById('planner-meal-feedback');
    let mealTrigger = null;
    
    // Modal DOM
    const modal = document.getElementById('recipe-modal');
    const closeModalBtn = document.getElementById('close-modal');
    const modalBody = document.getElementById('modal-body');
    let modalTrigger = null;
    const customModal = document.getElementById('add-recipe-modal');
    const customForm = document.getElementById('add-recipe-form');
    const addRecipeBtn = document.getElementById('add-custom-recipe-btn');
    const closeCustomBtn = document.getElementById('close-add-modal');
    const customStatus = document.getElementById('custom-recipe-status');
    const customSaveBtn = document.getElementById('custom-save-btn');
    const customPantry = document.getElementById('custom-pantry');
    const customFields = Object.fromEntries(['title', 'desc', 'diff', 'time', 'servings', 'seasons', 'ingredients', 'instructions', 'batch'].map(name => [name, document.getElementById(`custom-${name}`)]));
    const photoFile = document.getElementById('custom-photo-file');
    const photoUrl = document.getElementById('custom-photo-url');
    const photoPreview = document.getElementById('custom-photo-preview');
    const photoStatus = document.getElementById('custom-photo-status');
    const photoClear = document.getElementById('custom-photo-clear');
    const dataModal = document.getElementById('data-modal');
    const openDataBtn = document.getElementById('open-data-btn');
    const closeDataBtn = document.getElementById('close-data-modal');
    const exportDataBtn = document.getElementById('export-data-btn');
    const importDataFile = document.getElementById('import-data-file');
    const restoreDataBtn = document.getElementById('restore-data-btn');
    const dataSummary = document.getElementById('data-summary');
    const importPreview = document.getElementById('import-data-preview');
    const dataStatus = document.getElementById('data-status');
    const shoppingContainer = document.getElementById('shopping-list-container');
    const generateShoppingBtn = document.getElementById('generate-shopping-btn');
    const plannerToShoppingBtn = document.getElementById('planner-to-shopping-btn');
    const shoppingAddForm = document.getElementById('shopping-add-form');
    const shoppingName = document.getElementById('shopping-name');
    const shoppingQuantity = document.getElementById('shopping-quantity');
    const shoppingStatus = document.getElementById('shopping-status');
    const shoppingSummary = document.getElementById('shopping-summary');
    const shoppingClearBought = document.getElementById('shopping-clear-bought');
    const shoppingClearAll = document.getElementById('shopping-clear-all');
    const shoppingUndoBtn = document.getElementById('shopping-undo');
    const shoppingModal = document.getElementById('shopping-item-modal');
    const shoppingEditForm = document.getElementById('shopping-edit-form');
    const shoppingEditName = document.getElementById('shopping-edit-name');
    const shoppingEditQuantity = document.getElementById('shopping-edit-quantity');
    const shoppingEditStatus = document.getElementById('shopping-edit-status');
    const closeShoppingBtn = document.getElementById('close-shopping-item');

    // --- Navigation Logic ---
    const scrollPositions = new Map();
    let activeView = 'recipes-view';
    const viewTitles = { 'recipes-view': 'El meu receptari', 'fridge-view': 'La meva nevera',
        'planner-view': 'El menú de la setmana', 'shopping-view': 'Llista de la compra', 'tips-view': 'Consells' };
    function showView(targetId, updateHistory = false) {
        if (!Object.hasOwn(viewTitles, targetId)) targetId = 'recipes-view';
        scrollPositions.set(activeView, window.scrollY || 0);
        navLinks.forEach(link => {
            const active = link.getAttribute('data-target') === targetId;
            link.classList.toggle('active', active);
            if (active) link.setAttribute('aria-current', 'page');
            else link.removeAttribute('aria-current');
        });
        views.forEach(view => view.classList.toggle('active-view', view === document.getElementById(targetId)));
        pageTitle.textContent = viewTitles[targetId];
        document.getElementById('app-options').open = false;
        activeView = targetId;
        if (updateHistory && window.location?.hash !== '#' + targetId) window.history?.pushState(null, '', '#' + targetId);
        window.scrollTo?.({ top: scrollPositions.get(targetId) || 0, behavior: 'instant' });
    }
    navLinks.forEach(link => {
        link.setAttribute('role', 'button');
        link.setAttribute('tabindex', '0');
        link.setAttribute('aria-label', link.querySelector('span').textContent);
        link.setAttribute('aria-controls', link.getAttribute('data-target'));
        link.addEventListener('keydown', event => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                link.click();
            }
        });
        link.addEventListener('click', () => showView(link.getAttribute('data-target'), true));
    });
    window.addEventListener('popstate', () => showView(window.location?.hash.slice(1)));
    window.addEventListener('hashchange', () => showView(window.location?.hash.slice(1)));

    // --- Recipes Logic ---
    function collectionLabel(recipe) {
        const kind = recipeCatalog.collectionOf(recipe, adoptedRecipes);
        return kind === 'mine' ? recipe.category === 'dessert' ? 'La meva recepta · Postres' : recipe.testedByUser ? 'La meva recepta · Provada per mi' : recipe.pantry ? 'La meva recepta · Rebost' : 'La meva recepta' : kind === 'recommended' ? 'Per provar' : 'Exemple anterior';
    }

    function coverHtml(recipe, large = false) {
        const className = large ? 'modal-img' : 'recipe-img';
        if (recipe.image) {
            return `<div class="${className} recipe-photo-wrap"><span class="photo-fallback" aria-hidden="true">🍽️</span><img class="recipe-photo" src="${escapeHtml(recipe.image)}" alt="${escapeHtml(recipe.photoCredit?.note || recipe.title)}" loading="${large ? 'eager' : 'lazy'}" decoding="async" referrerpolicy="no-referrer"></div>`;
        }
        if (recipe.emoji) {
            return `<div class="${className} recipe-cover" aria-hidden="true"><span>${escapeHtml(recipe.emoji)}</span></div>`;
        }
        return `<div class="${className} recipe-cover" aria-hidden="true"><span>🍽️</span></div>`;
    }

    function bindPhotoFallback(container) {
        container.querySelectorAll('.recipe-photo').forEach(photo => photo.addEventListener('error', () => { photo.hidden = true; }));
    }

    function adoptionButton(recipe) {
        if (recipe.collection !== 'recommended') return '';
        const adopted = adoptedRecipes.includes(recipe.id);
        return `<button type="button" class="btn-adopt" data-id="${recipe.id}" aria-pressed="${adopted}"
            aria-label="${adopted ? 'Torna a Descobrir' : 'Fes teva'}: ${escapeHtml(recipe.title)}">
            ${adopted ? '✓ Meva · Torna a Descobrir' : '+ Fer-la meva'}</button>`;
    }

    function toggleAdoption(recipeId) {
        const recipe = recipes.find(item => item.id === recipeId && item.collection === 'recommended');
        if (!recipe) return;
        const next = adoptedRecipes.includes(recipeId) ? adoptedRecipes.filter(id => id !== recipeId) : [...adoptedRecipes, recipeId];
        try {
            appData.setItem('adoptedRecipes', JSON.stringify(next));
            adoptedRecipes = next;
            catalogNotice.hidden = false;
            catalogNotice.textContent = next.includes(recipeId) ? `«${recipe.title}» ja és a Les meves.` : `«${recipe.title}» ha tornat a Descobrir.`;
            filterRecipes();
            renderPlanner();
        } catch (error) {
            catalogNotice.hidden = false;
            catalogNotice.textContent = `No s’ha pogut desar el canvi: ${error.message}`;
        }
    }

    function renderRecipes(recipesToRender) {
        recipesContainer.innerHTML = '';
        
        if (recipesToRender.length === 0) {
            recipesContainer.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--clr-text-muted);">
                    <i class='bx bx-sad' style="font-size: 3rem; margin-bottom: 1rem;"></i>
                    <p>No hem trobat cap recepta amb aquests filtres.</p>
                </div>
            `;
            return;
        }

        recipesToRender.forEach(recipe => {
            const card = document.createElement('div');
            card.className = 'recipe-card';
            
            card.innerHTML = `
                <button type="button" class="btn-view recipe-open" data-id="${recipe.id}" aria-label="Veure ${escapeHtml(recipe.title)}"><span class="sr-only">Obre la recepta</span></button>
                ${coverHtml(recipe)}
                <div class="recipe-content">
                    <h3 class="recipe-title">${escapeHtml(recipe.title)}</h3>
                    <p class="recipe-card-time"><i class='bx bx-time' aria-hidden="true"></i> ${escapeHtml(recipe.time)} totals</p>
                    <div class="recipe-actions">
                        ${recipe.collection !== 'legacy' && recipe.category !== 'dessert' ? `<button type="button" class="btn-add-planner" data-id="${recipe.id}"><i class='bx bx-calendar-plus'></i> Afegir al menú</button>` : ''}
                        ${adoptionButton(recipe)}
                    </div>
                </div>
            `;
            recipesContainer.appendChild(card);
        });

        bindPhotoFallback(recipesContainer);

        // Add event listeners to newly created buttons
        recipesContainer.querySelectorAll('.btn-view').forEach(btn => {
            btn.addEventListener('click', (e) => openRecipeModal(parseInt(e.currentTarget.dataset.id)));
        });
        recipesContainer.querySelectorAll('.btn-adopt').forEach(btn => {
            btn.addEventListener('click', () => toggleAdoption(Number(btn.dataset.id)));
        });

        recipesContainer.querySelectorAll('.btn-add-planner').forEach(btn => btn.addEventListener('click', () => openRecipePlan(Number(btn.dataset.id))));
    }

    function filterRecipes() {
        pantryHelp.hidden = selectedCollection !== 'pantry';
        const activeDifficulty = document.querySelector('.filter-chips .chip.active:not(#filter-by-fridge-btn)')?.dataset.filter || 'all';
        const useFridgeFilter = filterByFridgeBtn.classList.contains('active');
        const filtered = recipeCatalog.select({
            query: searchInput.value, difficulty: activeDifficulty, collection: selectedCollection,
            season: seasonFilter.value, quick: quickFilter.checked, gluten: glutenFilter.value || 'all',
            useFridge: useFridgeFilter, fridge: myFridge, adopted: adoptedRecipes, fridgeOptions: fridgePreferences, sort: recipeSort.value || 'default'
        });
        const mine = recipes.filter(recipe => recipeCatalog.collectionOf(recipe, adoptedRecipes) === 'mine').length;
        const recommended = recipes.filter(recipe => recipeCatalog.collectionOf(recipe, adoptedRecipes) === 'recommended').length;
        collectionSummary.textContent = `${mine} receptes teves · ${recommended} idees per descobrir`;
        const applied = [];
        const collections = { dessert: 'Postres', mine: 'Les meves', pantry: 'Nevera buida', recommended: 'Descobrir', legacy: 'Exemples anteriors' };
        if (selectedCollection !== 'all') applied.push(collections[selectedCollection]);
        if (activeDifficulty !== 'all') applied.push(activeDifficulty);
        if (seasonFilter.value !== 'all') applied.push(seasonFilter.value);
        if (quickFilter.checked) applied.push('Màxim 30 min');
        if (glutenFilter.value && glutenFilter.value !== 'all') applied.push(glutenFilter.value === 'ingredients' ? 'Sense ingredients amb gluten · revisa etiquetes' : 'Adaptació sense gluten');
        document.getElementById('gluten-filter-notice').hidden = !glutenFilter.value || glutenFilter.value === 'all';
        if (useFridgeFilter) applied.push('Nevera: ' + fridgeModeNames[fridgePreferences.mode]);
        const sortNames = { time: 'menys temps', name: 'nom A–Z', fridge: 'coincidències de nevera' };
        if (sortNames[recipeSort.value]) applied.push('Ordre: ' + sortNames[recipeSort.value]);
        activeFilterCount.textContent = applied.length ? String(applied.length) : '';
        toggleRecipeFilters.setAttribute('aria-label', `Filtres i ordre${applied.length ? ` · ${applied.length} opcions aplicades` : ''}`);
        activeFilterSummary.hidden = !applied.length;
        activeFilterSummary.textContent = applied.join(' · ');
        recipeResults.textContent = `${filtered.length} ${filtered.length === 1 ? 'recepta' : 'receptes'}${selectedCollection === 'legacy' ? ' · Exemples anteriors' : ''}`;
        renderRecipes(filtered);
    }

    // Filter Event Listeners
    searchInput.addEventListener('input', filterRecipes);
    seasonFilter.addEventListener('change', filterRecipes);
    quickFilter.addEventListener('change', filterRecipes);
    glutenFilter.addEventListener('change', filterRecipes);
    recipeSort.addEventListener('change', filterRecipes);
    document.getElementById('reset-recipe-filters').addEventListener('click', () => {
        selectedCollection = 'all'; seasonFilter.value = 'all'; seasonFilter.disabled = false; quickFilter.checked = false; recipeSort.value = 'default';
        glutenFilter.value = 'all';
        filterByFridgeBtn.classList.remove('active'); filterByFridgeBtn.setAttribute('aria-pressed', 'false');
        collectionButtons.forEach(button => { const active = button.dataset.collection === 'all'; button.classList.toggle('active', active); button.setAttribute('aria-pressed', String(active)); });
        filterChips.forEach(chip => { const active = chip.dataset.filter === 'all'; chip.classList.toggle('active', active); chip.setAttribute('aria-pressed', String(active)); });
        filterRecipes();
    });
    collectionButtons.forEach(button => button.addEventListener('click', () => {
        selectedCollection = button.dataset.collection;
        if (selectedCollection === 'pantry') {
            // El filtre de nevera deixaria buit precisament aquest recurs de rebost.
            filterByFridgeBtn.classList.remove('active');
            filterByFridgeBtn.setAttribute('aria-pressed', 'false');
        }
        collectionButtons.forEach(item => {
            const active = item === button;
            item.classList.toggle('active', active);
            item.setAttribute('aria-pressed', String(active));
        });
        // Les demostracions antigues no tenen dades de temporada.
        seasonFilter.disabled = selectedCollection === 'legacy';
        if (seasonFilter.disabled) seasonFilter.value = 'all';
        filterRecipes();
    }));

    filterChips.forEach(chip => {
        chip.addEventListener('click', () => {
            filterChips.forEach(c => c.classList.remove('active'));
            filterChips.forEach(c => c.setAttribute('aria-pressed', 'false'));
            chip.classList.add('active');
            chip.setAttribute('aria-pressed', 'true');
            filterRecipes();
        });
    });

    filterByFridgeBtn.addEventListener('click', () => {
        filterByFridgeBtn.classList.toggle('active');
        if (filterByFridgeBtn.classList.contains('active') && myFridge.length === 0) {
            alert("La teva nevera està buida! Afegeix ingredients primer.");
            filterByFridgeBtn.classList.remove('active');
            return;
        }
        filterByFridgeBtn.setAttribute('aria-pressed', String(filterByFridgeBtn.classList.contains('active')));
        filterRecipes();
    });

    // --- Modal Logic ---
    function openRecipeModal(recipeId) {
        const recipe = recipes.find(r => r.id === recipeId);
        if (!recipe) return;
        const gluten = glutenGuide.review(recipe);

        modalBody.innerHTML = `
            ${coverHtml(recipe, true)}
            ${recipe.photoCredit ? `<p class="photo-credit">Foto de referència: ${escapeHtml(recipe.photoCredit.note)}<br>
                <a href="${escapeHtml(recipe.photoCredit.source)}" target="_blank" rel="noopener noreferrer">${escapeHtml(recipe.photoCredit.author)} · Wikimedia Commons</a> ·
                <a href="${escapeHtml(recipe.photoCredit.licenseUrl)}" target="_blank" rel="noopener noreferrer">${escapeHtml(recipe.photoCredit.license)}</a>. Imatge reduïda; retall visual a les targetes.</p>` : ''}
            <span class="recipe-collection ${recipeCatalog.collectionOf(recipe, adoptedRecipes)}">${collectionLabel(recipe)}</span>
            <h2 class="modal-title" id="recipe-detail-title">${escapeHtml(recipe.title)}</h2>
            <p>${escapeHtml(recipe.description)}</p>
            <div class="modal-section detail-note"><h4>${escapeHtml(gluten.title)}</h4><p>${escapeHtml(gluten.note)}</p><details><summary>Etiquetes i preparació</summary><p>Comprova els productes i els opcionals que facis servir. Si cal evitar traces, també cal evitar el contacte amb gluten en utensilis, superfícies, aigua o oli compartits. Aquesta guia no certifica el plat ni canvia els ingredients de la compra.</p><ul class="detail-list">${glutenGuide.sources.map(source => `<li><a href="${escapeHtml(source.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(source.title)}</a></li>`).join('')}</ul></details></div>
            <div class="detail-facts"><span>${escapeHtml(recipe.time)} totals</span>
                ${recipe.activeMinutes ? `<span>${recipe.activeMinutes} min de feina</span>` : ''}
                ${recipe.servings ? `<span>Ingredients per a ${recipe.servings} racions</span>` : ''}
                ${recipe.equipment ? `<span>${recipe.equipment.map(escapeHtml).join(' · ')}</span>` : ''}</div>
            
            <div class="modal-section">
                <h4>Ingredients</h4>
                ${myFridge.length ? '<p class="planner-help">En verd, els ingredients que has anotat a la nevera. Comprova què et falta de la resta abans de cuinar.</p>' : ''}
                <ul class="modal-ingredients-list">
                    ${recipe.ingredients.map(ing => {
                        // Highlight if in fridge
                        const hasIng = hasIngredient(ing);
                        return `<li ${hasIng ? 'style="color: var(--clr-primary-dark); font-weight: 500;"' : ''}>
                                    ${hasIng ? "<i class='bx bx-check'></i>" : ""} ${escapeHtml(ingredientLabel(ing))}
                                </li>`;
                    }).join('')}
                </ul>
            </div>
            ${recipe.optionalIngredients ? `<div class="modal-section"><h4>Ingredients opcionals</h4><ul class="detail-list">${recipe.optionalIngredients.map(ingredient => `<li>${escapeHtml(ingredientLabel(ingredient))}</li>`).join('')}</ul><p class="planner-help">No s’afegeixen automàticament a la compra ni es necessiten per a la coincidència amb la nevera.</p></div>` : ''}
            ${recipe.nutritionNote ? `<div class="modal-section detail-note"><h4>Nutrició orientativa · sense verificar</h4><p>${escapeHtml(recipe.nutritionNote)}</p></div>` : ''}
            <div class="modal-section">
                <h4>Preparació</h4>
                <p class="modal-instructions">${escapeHtml(recipe.instructions)}</p>
            </div>
            ${recipe.balanceNote ? `<div class="modal-section detail-note"><h4>Com queda el plat</h4><p>${escapeHtml(recipe.balanceNote)}</p></div>` : ''}
            ${recipe.variations ? `<div class="modal-section"><h4>Alternatives fàcils</h4><ul class="detail-list">${recipe.variations.map(note => `<li>${escapeHtml(note)}</li>`).join('')}</ul></div>` : ''}
            ${recipe.batchNote ? `<div class="modal-section"><h4>Per avançar feina</h4><p>${escapeHtml(recipe.batchNote)}</p></div>` : ''}
            ${recipe.adaptationNote ? `<div class="modal-section detail-source"><h4>Origen i adaptació</h4><p>${escapeHtml(recipe.adaptationNote)}</p>
                <ul class="detail-list">${(recipe.sourceIds || []).map(id => recipeSources[id]).filter(Boolean).map(source => `<li><a href="${escapeHtml(source.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(source.title)}</a></li>`).join('')}</ul>
                <p>${recipe.testedByUser ? 'Recepta ja provada per tu.' : 'Preparació adaptada, pendent de prova casolana.'} ${recipe.nutritionNote ? 'Les xifres nutricionals indicades no s’han verificat ni recalculat.' : 'No s’han calculat calories ni nutrients d’aquesta versió.'}</p></div>` : ''}
            ${recipe.collection !== 'legacy' && recipe.category !== 'dessert' ? '<button type="button" class="btn-primary btn-plan-detail">Afegir al menú</button>' : ''}
            ${adoptionButton(recipe)}
            ${recipe.custom ? `<button type="button" class="btn-edit-recipe btn-outline" data-id="${recipe.id}">Edita aquesta recepta</button>` : ''}
        `;
        bindPhotoFallback(modalBody);
        const planDetail = modalBody.querySelector('.btn-plan-detail');
        if (planDetail) planDetail.addEventListener('click', () => openRecipePlan(recipe.id));
        const edit = modalBody.querySelector('.btn-edit-recipe');
        if (edit) edit.addEventListener('click', () => {
            modal.classList.remove('show');
            openCustomRecipe(recipeId);
        });
        const adopt = modalBody.querySelector('.btn-adopt');
        if (adopt) adopt.addEventListener('click', () => {
            toggleAdoption(recipeId);
            openRecipeModal(recipeId);
        });
        if (!modal.classList.contains('show')) modalTrigger = document.activeElement;
        modal.classList.add('show');
        closeModalBtn.focus();
    }

    function closeRecipeModal() {
        modal.classList.remove('show');
        if (modalTrigger?.isConnected) modalTrigger.focus();
        else if (document.getElementById('planner-view').classList.contains('active-view')) generatePlannerBtn.focus();
        else searchInput.focus();
    }
    closeModalBtn.addEventListener('click', closeRecipeModal);

    window.addEventListener('click', (e) => {
        if (e.target === modal) closeRecipeModal();
        if (e.target === mealModal) closeMealPicker();
        if (e.target === customModal) closeCustomRecipe();
        if (e.target === dataModal) closeDataModal();
        if (e.target === shoppingModal) closeShoppingEditor();
        if (e.target === planRecipeModal) closeRecipePlan();
    });
    document.addEventListener('keydown', event => {
        const dialog = [planRecipeModal, shoppingModal, dataModal, customModal, mealModal, modal].find(item => item.classList.contains('show'));
        if (!dialog) return;
        if (event.key === 'Escape') {
            if (dialog === planRecipeModal) closeRecipePlan();
            else if (dialog === shoppingModal) closeShoppingEditor();
            else if (dialog === dataModal) closeDataModal();
            else if (dialog === customModal) closeCustomRecipe();
            else if (dialog === mealModal) closeMealPicker();
            else closeRecipeModal();
        }
        if (event.key !== 'Tab') return;
        const focusable = Array.from(dialog.querySelectorAll('button, a[href], input, select, textarea, [tabindex="0"]')).filter(item => !item.disabled && !item.hidden);
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
            event.preventDefault(); last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault(); first.focus();
        }
    });

    // --- Receptes personals ---
    function updatePhotoPreview() {
        photoPreview.hidden = !customPhoto;
        if (customPhoto) photoPreview.src = customPhoto;
        else photoPreview.removeAttribute('src');
    }

    function openCustomRecipe(id = null) {
        const recipe = customRecipes.find(item => item.id === id);
        editingRecipeId = recipe?.id ?? null;
        document.getElementById('custom-modal-title').textContent = recipe ? 'Edita la teva recepta' : 'Afegeix una recepta';
        customFields.title.value = recipe?.title || '';
        customPantry.checked = recipe?.pantry === true;
        document.getElementById('custom-category').value = recipe?.category || (selectedCollection === 'dessert' ? 'dessert' : 'main');
        customFields.desc.value = recipe?.description || '';
        customFields.diff.value = recipe?.difficulty || 'Fàcil';
        customFields.time.value = recipe?.totalMinutes || '';
        customFields.servings.value = recipe?.servings || 2;
        const seasons = recipe?.seasons || [];
        let seasonChoice = seasons.length === 4 || !seasons.length ? 'all' : seasons.join(',');
        if (seasons.length === 2 && seasons.includes('Tardor') && seasons.includes('Hivern')) seasonChoice = 'Tardor,Hivern';
        if (seasons.length === 2 && seasons.includes('Primavera') && seasons.includes('Estiu')) seasonChoice = 'Primavera,Estiu';
        customFields.seasons.querySelector('option[data-personal-season]')?.remove();
        if (!['all', 'Tardor,Hivern', 'Primavera,Estiu', 'Hivern', 'Primavera', 'Estiu', 'Tardor'].includes(seasonChoice)) {
            const option = document.createElement('option'); option.value = seasonChoice; option.textContent = seasons.join(' · ');
            option.setAttribute('data-personal-season', 'true'); customFields.seasons.appendChild(option);
        }
        customFields.seasons.value = seasonChoice;
        customFields.ingredients.value = recipe?.ingredients.map(ingredient => `${ingredient.item} - ${ingredient.qty}`).join('\n') || '';
        customFields.instructions.value = recipe?.instructions || '';
        customFields.batch.value = recipe?.batchNote || '';
        customPhoto = recipe?.image || '';
        photoVersion++;
        photoBusy = false;
        customSaveBtn.disabled = false;
        photoFile.value = '';
        photoUrl.value = customPhoto.startsWith('https:') ? customPhoto : '';
        photoStatus.textContent = '';
        customStatus.textContent = '';
        updatePhotoPreview();
        customModal.classList.add('show');
        customFields.title.focus();
    }

    function closeCustomRecipe() {
        photoVersion++;
        customModal.classList.remove('show');
        addRecipeBtn.focus();
    }
    addRecipeBtn.addEventListener('click', () => openCustomRecipe());
    closeCustomBtn.addEventListener('click', closeCustomRecipe);
    photoPreview.addEventListener('error', () => {
        photoPreview.hidden = true;
        photoStatus.textContent = 'No es pot mostrar aquesta foto. Revisa l’enllaç o tria un fitxer.';
    });
    photoClear.addEventListener('click', () => {
        photoVersion++; photoBusy = false; customSaveBtn.disabled = false;
        customPhoto = ''; photoFile.value = ''; photoUrl.value = ''; photoStatus.textContent = '';
        updatePhotoPreview();
    });
    photoUrl.addEventListener('change', () => {
        photoVersion++; photoBusy = false; customSaveBtn.disabled = false; photoFile.value = '';
        const value = photoUrl.value.trim();
        try {
            if (value) {
                const url = new URL(value);
                if (url.protocol !== 'https:' || url.username || url.password) throw new Error();
            }
            customPhoto = value; photoStatus.textContent = ''; updatePhotoPreview();
        } catch {
            photoStatus.textContent = 'Utilitza un enllaç HTTPS de la imatge, sense credencials.';
        }
    });
    photoFile.addEventListener('change', async () => {
        const file = photoFile.files?.[0];
        if (!file) return;
        const version = ++photoVersion;
        photoBusy = true; customSaveBtn.disabled = true; photoStatus.textContent = 'Preparant la foto…';
        try {
            if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 8 * 1024 * 1024) throw new Error('Tria una foto JPEG, PNG o WebP de menys de 8 MB.');
            const source = await new Promise((resolve, reject) => {
                const reader = new FileReader(); reader.onload = () => resolve(reader.result); reader.onerror = () => reject(new Error('No es pot llegir la foto.')); reader.readAsDataURL(file);
            });
            const image = await new Promise((resolve, reject) => {
                const img = new Image(); img.onload = () => resolve(img); img.onerror = () => reject(new Error('No es pot obrir aquesta imatge.')); img.src = source;
            });
            const scale = Math.min(1, 960 / Math.max(image.naturalWidth, image.naturalHeight));
            const canvas = document.createElement('canvas');
            canvas.width = Math.max(1, Math.round(image.naturalWidth * scale)); canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
            const ctx = canvas.getContext('2d'); ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, canvas.width, canvas.height); ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
            let data = canvas.toDataURL('image/jpeg', .78);
            for (const quality of [.65, .5, .35]) { if (data.length * .75 <= 200 * 1024) break; data = canvas.toDataURL('image/jpeg', quality); }
            if (data.length * .75 > 200 * 1024) throw new Error('La foto encara és massa gran. Tria una imatge més petita.');
            if (version !== photoVersion) return;
            customPhoto = data; photoUrl.value = ''; updatePhotoPreview(); photoStatus.textContent = 'Foto preparada. Es desarà quan desis la recepta.';
        } catch (error) {
            if (version === photoVersion) photoStatus.textContent = error.message;
        } finally {
            if (version === photoVersion) { photoBusy = false; customSaveBtn.disabled = false; }
        }
    });
    customForm.addEventListener('submit', event => {
        event.preventDefault();
        if (photoBusy) { customStatus.textContent = 'Espera que s’acabi de preparar la foto.'; return; }
        try {
            const ingredients = customFields.ingredients.value.split(/\r?\n/).filter(line => line.trim()).map(line => {
                const match = line.match(/^(.+?)\s+[-–—]\s+(.+)$/);
                if (!match) throw new Error('Escriu cada ingredient en una línia amb el format «Nom - Quantitat».');
                return { item: match[1].trim(), qty: match[2].trim() };
            });
            let id = editingRecipeId ?? Date.now();
            while (editingRecipeId === null && recipes.some(recipe => recipe.id === id)) id++;
            const typedUrl = photoUrl.value.trim();
            const recipe = recipeCatalog.customRecipe({ id, title: customFields.title.value, description: customFields.desc.value,
                difficulty: customFields.diff.value, totalMinutes: Number(customFields.time.value), servings: Number(customFields.servings.value),
                seasons: customFields.seasons.value === 'all' ? ['Hivern', 'Primavera', 'Estiu', 'Tardor'] : customFields.seasons.value.split(','),
                ingredients, instructions: customFields.instructions.value, batchNote: customFields.batch.value,
                image: typedUrl || customPhoto, category: document.getElementById('custom-category').value, pantry: customPantry.checked });
            const next = [...customRecipes.filter(item => item.id !== id), recipe];
            appData.setItem('customRecipes', JSON.stringify(next));
            customRecipes = next; recipeCatalog.replaceCustomRecipes(next);
            closeCustomRecipe();
            selectedCollection = 'mine'; searchInput.value = ''; seasonFilter.value = 'all'; quickFilter.checked = false;
            filterByFridgeBtn.classList.remove('active'); filterByFridgeBtn.setAttribute('aria-pressed', 'false');
            filterChips.forEach(chip => { const active = chip.dataset.filter === 'all'; chip.classList.toggle('active', active); chip.setAttribute('aria-pressed', String(active)); });
            collectionButtons.forEach(button => { const active = button.dataset.collection === 'mine'; button.classList.toggle('active', active); button.setAttribute('aria-pressed', String(active)); });
            seasonFilter.disabled = false;
            Array.from(navLinks).find(link => link.getAttribute('data-target') === 'recipes-view')?.click();
            filterRecipes(); renderPlanner();
            catalogNotice.hidden = false; catalogNotice.textContent = `«${recipe.title}» desada a Les meves. Recorda descarregar una còpia per conservar-la fora del dispositiu.`;
        } catch (error) { customStatus.textContent = `${error.message} Si l’espai local és ple, descarrega una còpia o prova una foto més petita.`; }
    });

    // --- Còpies completes: exportació i restauració revisada ---
    function dataDescription(data) {
        const meals = Object.values(data.weeklyPlanner.days).flatMap(day => [day.lunch, day.dinner]).filter(Boolean).length;
        return `${data.customRecipes.length} receptes personals · ${data.adoptedRecipes.length} adoptades · ${data.myFridge.length} aliments · ${meals} àpats planificats · ${data.shoppingList.items.length} elements de compra`;
    }
    function closeDataModal() { dataModal.classList.remove('show'); openDataBtn.focus(); }
    openDataBtn.addEventListener('click', () => {
        dataSummary.textContent = dataDescription(appData.snapshot()); dataStatus.textContent = appData.warning;
        pendingBackup = null; importDataFile.value = ''; restoreDataBtn.disabled = true;
        importPreview.textContent = 'Tria una còpia per revisar-ne el contingut abans de restaurar.';
        dataModal.classList.add('show'); exportDataBtn.focus();
    });
    closeDataBtn.addEventListener('click', closeDataModal);
    exportDataBtn.addEventListener('click', () => {
        try {
            const blob = new Blob([appData.backup()], { type: 'application/json' });
            const url = URL.createObjectURL(blob); const link = document.createElement('a');
            link.href = url; link.download = `realfood-copia-${new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Paris' }).format(new Date())}.json`;
            document.body.appendChild(link); link.click(); link.remove();
            setTimeout(() => URL.revokeObjectURL(url), 1000);
            dataStatus.textContent = 'Còpia preparada per descarregar. Guarda el fitxer també fora d’aquest dispositiu.';
        } catch { dataStatus.textContent = 'No s’ha pogut preparar la descàrrega. Torna-ho a provar en aquest navegador.'; }
    });
    importDataFile.addEventListener('change', async () => {
        pendingBackup = null; restoreDataBtn.disabled = true;
        const file = importDataFile.files?.[0];
        if (!file) return;
        try {
            if (file.size > 12000000) throw new Error('La còpia supera els 12 MB.');
            const next = appData.parseBackup(await file.text());
            if (importDataFile.files?.[0] !== file) return;
            pendingBackup = next; importPreview.textContent = `Contingut de la còpia: ${dataDescription(next)}. Encara no s’ha modificat res.`;
            dataStatus.textContent = ''; restoreDataBtn.disabled = false;
        } catch (error) { if (importDataFile.files?.[0] === file) importPreview.textContent = error.message; }
    });
    restoreDataBtn.addEventListener('click', () => {
        if (!pendingBackup) return;
        try {
            const restored = appData.restore(pendingBackup);
            customRecipes = restored.customRecipes; recipeCatalog.replaceCustomRecipes(customRecipes);
            myFridge = restored.myFridge; fridgePreferences = restored.fridgePreferences; weeklyPlanner = restored.weeklyPlanner; adoptedRecipes = restored.adoptedRecipes;
            shoppingList = restored.shoppingList; shoppingUndo = null;
            pendingBackup = null; restoreDataBtn.disabled = true; importDataFile.value = '';
            filterRecipes(); renderFridge(); renderPlanner(); dataSummary.textContent = dataDescription(restored);
            dataStatus.textContent = 'Còpia restaurada en aquest navegador. No s’ha activat cap sincronització al núvol.';
            importPreview.textContent = 'Restauració completada.';
        } catch (error) { dataStatus.textContent = `No s’ha restaurat la còpia: ${error.message} Les dades anteriors es conserven.`; }
    });

    // --- Compra: càlcul des del menú i canvis individuals ---
    function commitShopping(next, message, undoable = false) {
        try {
            const validated = shoppingListEngine.validate(next);
            appData.setItem('shoppingList', JSON.stringify(validated));
            shoppingUndo = undoable ? shoppingListEngine.validate(shoppingList) : null;
            shoppingList = validated;
            renderShopping();
            shoppingStatus.textContent = message;
            return true;
        } catch (error) {
            renderShopping();
            shoppingStatus.textContent = `No s’ha pogut desar la compra: ${error.message} La llista anterior es conserva.`;
            return false;
        }
    }

    function generateShopping(goToList = false) {
        const required = shoppingListEngine.requirements(weeklyPlanner);
        const writtenMeals = weeklyPlannerEngine.days.flatMap(day => weeklyPlannerEngine.meals.map(meal => weeklyPlanner.days[day][meal])).filter(slot => slot?.kind === 'note');
        const writtenWarning = writtenMeals.length ? ` Hi ha ${writtenMeals.length} plats escrits sense recepta vinculada: els seus ingredients no s’han inclòs. Afegeix-los manualment.` : '';
        if (!required.mealCount) {
            const message = 'Afegeix primer receptes al menú. Els àpats fora de casa i les restes no generen ingredients.' + writtenWarning;
            shoppingStatus.textContent = message;
            if (goToList) plannerFeedback(message, true);
            return;
        }
        if (required.missing.length) {
            const message = `No s’han trobat aquestes receptes: ${required.missing.join(', ')}. Revisa el menú; la compra es conserva.`;
            shoppingStatus.textContent = message;
            if (goToList) plannerFeedback(message, true);
            return;
        }
        try {
            const next = shoppingListEngine.merge(shoppingList, required);
            const reviews = next.items.filter(item => item.needsReview).length;
            const message = `Ingredients actualitzats a partir de ${required.mealCount} àpats per a ${weeklyPlanner.settings.people} ${weeklyPlanner.settings.people === 1 ? 'persona' : 'persones'}. S’han conservat els canvis manuals.${reviews ? ` Revisa ${reviews} quantitats editades: el menú ha canviat.` : ''}${required.unscaled.length ? ' Algunes receptes antigues no indiquen racions: n’hem comptat les quantitats de base per cada ús, sense ajustar-les a persones. Revisa-les a les receptes d’origen.' : ''}${writtenWarning}`;
            if (commitShopping(next, message, true) && goToList) {
                Array.from(navLinks).find(link => link.getAttribute('data-target') === 'shopping-view')?.click();
            } else if (goToList) plannerFeedback(shoppingStatus.textContent, true);
        } catch (error) {
            shoppingStatus.textContent = `No s’ha pogut preparar la llista: ${error.message}`;
            if (goToList) plannerFeedback(shoppingStatus.textContent, true);
        }
    }
    generateShoppingBtn.addEventListener('click', () => generateShopping());
    plannerToShoppingBtn.addEventListener('click', () => generateShopping(true));

    shoppingAddForm.addEventListener('submit', event => {
        event.preventDefault();
        let id = `manual:${Date.now()}`;
        while (shoppingList.items.some(item => item.id === id)) id += ':new';
        const next = shoppingListEngine.validate(shoppingList);
        next.items.push({ id, name: shoppingName.value.trim(), quantity: shoppingQuantity.value.trim(), checked: false, origin: 'manual' });
        if (commitShopping(next, 'Ingredient afegit a la compra.')) {
            shoppingName.value = ''; shoppingQuantity.value = ''; shoppingName.focus();
        }
    });

    function closeShoppingEditor() { shoppingModal.classList.remove('show'); shoppingName.focus(); }
    closeShoppingBtn.addEventListener('click', closeShoppingEditor);
    shoppingEditForm.addEventListener('submit', event => {
        event.preventDefault();
        try {
            const next = shoppingListEngine.edit(shoppingList, editingShoppingId, shoppingEditName.value, shoppingEditQuantity.value);
            if (commitShopping(next, 'Ingredient modificat.')) closeShoppingEditor();
            else shoppingEditStatus.textContent = shoppingStatus.textContent;
        } catch (error) { shoppingEditStatus.textContent = error.message; }
    });
    shoppingUndoBtn.addEventListener('click', () => { if (shoppingUndo) commitShopping(shoppingUndo, 'Últim canvi desfet.'); });
    shoppingClearBought.addEventListener('click', () => {
        const bought = shoppingList.items.filter(item => item.checked);
        if (!bought.length) return;
        const next = bought.reduce((list, item) => shoppingListEngine.remove(list, item.id), shoppingList);
        commitShopping(next, `${bought.length} elements comprats eliminats. Pots desfer aquest canvi.`, true);
    });
    shoppingClearAll.addEventListener('click', () => {
        if (!confirm('Vols buidar tota la llista de la compra? El menú es conservarà. Podràs desfer aquest canvi.')) return;
        commitShopping(shoppingListEngine.empty(), 'Llista buidada. El menú es conserva. Pots desfer-ho o tornar-hi a passar els ingredients del menú.', true);
    });

    function renderShopping() {
        const bought = shoppingList.items.filter(item => item.checked).length;
        const writtenCount = weeklyPlannerEngine.days.flatMap(day => weeklyPlannerEngine.meals.map(meal => weeklyPlanner.days[day][meal])).filter(slot => slot?.kind === 'note').length;
        shoppingSummary.textContent = `${shoppingList.items.length - bought} pendents · ${bought} comprats${writtenCount ? ` · ${writtenCount} plats escrits al menú: cal afegir-ne els ingredients manualment` : ''}`;
        shoppingClearBought.disabled = !bought;
        shoppingClearAll.disabled = !shoppingList.items.length && !shoppingList.dismissed.length;
        shoppingUndoBtn.hidden = !shoppingUndo;
        shoppingContainer.innerHTML = '';
        if (!shoppingList.items.length) {
            shoppingContainer.innerHTML = '<p class="shopping-empty">Encara no tens ingredients a la compra. Passa-hi el menú o afegeix-ne un manualment.</p>';
            return;
        }
        const ordered = [...shoppingList.items].sort((a, b) => Number(a.checked) - Number(b.checked));
        ordered.forEach(item => {
            const row = document.createElement('article');
            row.className = `shopping-row${item.checked ? ' is-bought' : ''}`;
            const inFridge = myFridge.some(food => recipeCatalog.matchesIngredient({ item: item.name }, food));
            row.innerHTML = `<div class="shopping-row-main"><label class="shopping-check-label"><input type="checkbox" class="shopping-check" data-id="${escapeHtml(item.id)}" ${item.checked ? 'checked' : ''} aria-label="Marca ${escapeHtml(item.name)} com a ${item.checked ? 'pendent' : 'comprat'}"><span><strong>${escapeHtml(item.name)}</strong><span class="shopping-row-quantity">${escapeHtml(item.quantity || 'Quantitat lliure')}</span></span></label>
                <div class="shopping-row-actions"><button type="button" class="shopping-edit" data-id="${escapeHtml(item.id)}" aria-label="Edita ${escapeHtml(item.name)}">Edita</button><button type="button" class="shopping-remove" data-id="${escapeHtml(item.id)}" aria-label="Elimina ${escapeHtml(item.name)}">Elimina</button></div></div>
                <div class="shopping-row-tags"><span>${item.origin === 'manual' ? 'Afegit per mi' : item.edited ? 'Editat per mi' : 'Del menú'}</span>${inFridge ? '<span>A la nevera · revisa quantitat</span>' : ''}</div>
                ${item.needsReview ? `<p class="shopping-review">El menú ara proposa: ${escapeHtml(item.menuQuantity)}. Hem conservat la teva quantitat.</p>` : ''}
                ${item.origin === 'menu' ? `<details class="shopping-sources"><summary>Receptes d’origen</summary><ul>${item.sources.map(source => `<li>${escapeHtml(source.title)} · ${escapeHtml(source.quantity || 'Quantitat segons recepta')} × ${new Intl.NumberFormat('ca', { maximumFractionDigits: 2 }).format(source.factor)}</li>`).join('')}</ul></details>` : ''}`;
            shoppingContainer.appendChild(row);
        });
        shoppingContainer.querySelectorAll('.shopping-check').forEach(control => control.addEventListener('change', () => {
            const next = shoppingListEngine.validate(shoppingList);
            const item = next.items.find(row => row.id === control.dataset.id);
            if (!item) return;
            item.checked = control.checked;
            commitShopping(next, item.checked ? 'Marcat com a comprat.' : 'Marcat com a pendent.');
            Array.from(shoppingContainer.querySelectorAll('.shopping-check')).find(input => input.dataset.id === control.dataset.id)?.focus();
        }));
        shoppingContainer.querySelectorAll('.shopping-edit').forEach(button => button.addEventListener('click', () => {
            const item = shoppingList.items.find(row => row.id === button.dataset.id);
            editingShoppingId = item.id; shoppingEditName.value = item.name; shoppingEditQuantity.value = item.quantity; shoppingEditStatus.textContent = '';
            shoppingModal.classList.add('show'); shoppingEditName.focus();
        }));
        shoppingContainer.querySelectorAll('.shopping-remove').forEach(button => button.addEventListener('click', () => {
            const position = { left: window.scrollX || 0, top: window.scrollY || 0, behavior: 'instant' };
            const index = Array.from(shoppingContainer.querySelectorAll('.shopping-remove')).indexOf(button);
            const item = shoppingList.items.find(row => row.id === button.dataset.id);
            commitShopping(shoppingListEngine.remove(shoppingList, button.dataset.id), `Ingredient eliminat. Pots desfer aquest canvi.${item?.origin === 'menu' ? ' No reapareixerà en actualitzar el mateix menú mentre la quantitat necessària no canviï.' : ''}`, true);
            const remaining = Array.from(shoppingContainer.querySelectorAll('.shopping-remove'));
            remaining[Math.min(index, remaining.length - 1)]?.focus({ preventScroll: true });
            window.scrollTo?.(position);
            // Manté també la posició després del reajust de la llista al següent frame.
            window.requestAnimationFrame?.(() => window.scrollTo?.(position));
        }));
    }

    // --- Fridge Logic ---
    function renderFridge() {
        ingredientsList.innerHTML = '';
        renderFridgeRecipes();
        if (myFridge.length === 0) {
            ingredientsList.innerHTML = '';
            return;
        }

        myFridge.forEach((ing, index) => {
            const tag = document.createElement('div');
            tag.className = 'ingredient-tag';
            tag.innerHTML = `
                ${escapeHtml(ing)}
                <button type="button" class="remove-fridge-ingredient" data-index="${index}" aria-label="Elimina ${escapeHtml(ing)} de la nevera"><i class="bx bx-x" aria-hidden="true"></i></button>
            `;
            ingredientsList.appendChild(tag);
        });

        // Delete events
        ingredientsList.querySelectorAll('.remove-fridge-ingredient').forEach(btn => {
            btn.addEventListener('click', () => {
                const idx = btn.dataset.index;
                saveFridge(myFridge.filter((_, index) => index !== Number(idx)));
            });
        });
    }

    function renderFridgeRecipes() {
        fridgeRecipeList.innerHTML = '';
        fridgeMatchMode.value = fridgePreferences.mode;
        const explanations = {
            any: 'La recepta aprofita un o més aliments dels que has anotat. Pot necessitar-ne d’altres.',
            available: 'Tots els ingredients de la recepta són disponibles. No cal que faci servir tots els aliments de la nevera.',
            all: 'La recepta fa servir tots els aliments que has anotat, però pot necessitar-ne d’altres.',
            exact: 'La recepta fa servir tots els aliments anotats i cap altre, excepte els bàsics habituals.'
        };
        fridgeMatchHelp.textContent = explanations[fridgePreferences.mode];
        if (!myFridge.length) {
            fridgeRecipeSummary.textContent = 'Afegeix aliments per veure receptes relacionades aquí mateix.';
            return;
        }
        const matches = recipeCatalog.select({ useFridge: true, fridge: myFridge, adopted: adoptedRecipes, fridgeOptions: fridgePreferences });
        fridgeRecipeSummary.textContent = matches.length
            ? `${matches.length} receptes · ${fridgeModeNames[fridgePreferences.mode]}. Les que més aliments aprofiten apareixen primer.`
            : 'No hi ha coincidències amb aquesta tria. Prova «Amb algun ingredient», revisa els bàsics o afegeix més aliments.';
        matches.forEach(recipe => {
            const row = document.createElement('article');
            row.className = 'fridge-recipe';
            row.innerHTML = `${coverHtml(recipe)}<div><h4>${escapeHtml(recipe.title)}</h4>
                <p>${escapeHtml(recipe.time)} · Aprofita: ${recipe.ingredients.filter(hasIngredient).map(ingredient => escapeHtml(recipeCatalog.ingredientName(ingredient))).join(', ')}</p>
                <div class="fridge-recipe-actions"><button type="button" class="btn-outline fridge-open-recipe" data-id="${recipe.id}">Veure recepta</button>
                ${recipe.category !== 'dessert' ? `<button type="button" class="btn-primary fridge-plan-recipe" data-id="${recipe.id}">Afegir al menú</button>` : '<span class="planner-help">Postres</span>'}</div></div>`;
            fridgeRecipeList.appendChild(row);
        });
        bindPhotoFallback(fridgeRecipeList);
        fridgeRecipeList.querySelectorAll('.fridge-open-recipe').forEach(button => button.addEventListener('click', () => openRecipeModal(Number(button.dataset.id))));
        fridgeRecipeList.querySelectorAll('.fridge-plan-recipe').forEach(button => button.addEventListener('click', () => openRecipePlan(Number(button.dataset.id))));
    }
    function saveFridgePreferences() {
        try {
            const next = recipeCatalog.fridgeSettings({ mode: fridgeMatchMode.value });
            appData.setItem('fridgePreferences', JSON.stringify(next)); fridgePreferences = next;
            renderFridgeRecipes(); filterRecipes();
            document.getElementById('fridge-status').textContent = 'Opcions de coincidència desades.';
        } catch (error) {
            renderFridgeRecipes();
            document.getElementById('fridge-status').textContent = `No s’han pogut desar les opcions: ${error.message}`;
        }
    }
    fridgeMatchMode.addEventListener('change', saveFridgePreferences);

    function addIngredient(event) {
        event?.preventDefault();
        const val = ingredientInput.value.trim();
        if (val) {
            const myFridgeBeforeAdd = myFridge.length;
            const items = val.split(/[,;\n]+|\s+i\s+/i).map(i => i.trim()).filter(Boolean);
            const next = [...myFridge];
            items.forEach(item => {
                // Capitalize first letter
                const formatted = item.charAt(0).toUpperCase() + item.slice(1).toLowerCase();
                if (!next.some(food => recipeCatalog.normalize(food) === recipeCatalog.normalize(formatted))) {
                    next.push(formatted);
                }
            });
            if (saveFridge(next)) {
                ingredientInput.value = '';
                const added = next.length - myFridgeBeforeAdd;
                document.getElementById('fridge-status').textContent = added ? '' : 'Aquests aliments ja eren a la nevera.';
            }
        } else document.getElementById('fridge-status').textContent = 'Escriu almenys un aliment abans d’afegir-lo.';
    }

    addIngredientBtn.addEventListener('click', addIngredient);
    document.getElementById('fridge-add-form').addEventListener('submit', addIngredient);
    ingredientInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.isComposing) addIngredient(e);
    });

    function saveFridge(next) {
        try {
            appData.setItem('myFridge', JSON.stringify(next)); myFridge = next;
            renderFridge(); renderPlanner(); filterRecipes();
            document.getElementById('fridge-status').textContent = '';
            return true;
        } catch (error) {
            document.getElementById('fridge-status').textContent = `No s’ha pogut desar el canvi: ${error.message} La nevera anterior es conserva.`;
            return false;
        }
    }


    // --- Planner Logic ---
    const mealNames = { lunch: 'Dinar', dinner: 'Sopar' };
    const dayName = day => daysOfWeek[weeklyPlannerEngine.days.indexOf(day)];

    function plannerFeedback(message, error = false) {
        plannerStatus.textContent = message;
        plannerStatus.setAttribute('data-error', String(error));
    }

    function commitPlanner(next, message) {
        try {
            appData.setItem('weeklyPlanner', JSON.stringify(next));
            weeklyPlanner = next;
            renderPlanner();
            if (message) plannerFeedback(message);
            return true;
        } catch (error) {
            plannerFeedback(`No s’ha pogut desar: ${error.message} El menú anterior es conserva.`, true);
            renderPlanner();
            return false;
        }
    }

    function openRecipePlan(recipeId) {
        const recipe = recipes.find(item => item.id === recipeId && item.collection !== 'legacy' && item.category !== 'dessert');
        if (!recipe) return;
        recipeToPlan = recipe;
        planRecipeTrigger = document.activeElement;
        const adopting = recipe.collection === 'recommended' && !adoptedRecipes.includes(recipe.id);
        document.getElementById('plan-recipe-name').textContent = recipe.title + (adopting ? ' · En desar-la, també s’afegirà a «Les meves».' : '');
        if (glutenFilter.value && glutenFilter.value !== 'all' && glutenGuide.review(recipe).status === 'adapt') document.getElementById('plan-recipe-name').textContent += ' · Cal adaptar-la sense gluten: la compra conserva els ingredients originals. Consulta la fitxa i edita la compra.';
        planRecipeDay.innerHTML = '<option value="">Tria un dia</option>' + weeklyPlannerEngine.days.map(day => {
            const free = weeklyPlannerEngine.meals.filter(meal => !weeklyPlanner.days[day][meal]).length;
            return `<option value="${day}">${dayName(day)} · ${free ? `${free} ${free === 1 ? 'àpat lliure' : 'àpats lliures'}` : 'ple'}</option>`;
        }).join('');
        planRecipeDay.value = ''; planRecipeMeal.value = '';
        savePlanRecipe.textContent = adopting ? 'Fes-la meva i afegeix al menú' : 'Afegir al menú';
        updateRecipePlanDay();
        planRecipeModal.classList.add('show'); planRecipeDay.focus();
    }
    function updateRecipePlanDay() {
        const day = planRecipeDay.value;
        const free = weeklyPlannerEngine.days.includes(day) ? weeklyPlannerEngine.meals.filter(meal => !weeklyPlanner.days[day][meal]) : [];
        const previousMeal = planRecipeMeal.value;
        planRecipeAlternatives.innerHTML = '';
        planRecipeMeal.innerHTML = '<option value="">Tria un àpat</option>' + (weeklyPlannerEngine.days.includes(day) ?
            weeklyPlannerEngine.meals.map(meal => `<option value="${meal}"${free.includes(meal) ? '' : ' disabled'}>${mealNames[meal]}${free.includes(meal) ? ' · lliure' : ' · ocupat'}</option>`).join('') : '');
        planRecipeMeal.disabled = !free.length;
        planRecipeMeal.value = free.includes(previousMeal) ? previousMeal : free.length === 1 ? free[0] : '';
        savePlanRecipe.disabled = !free.includes(planRecipeMeal.value);
        if (!weeklyPlannerEngine.days.includes(day)) { planRecipeFeedback.textContent = 'Tria el dia on vols afegir-la.'; return; }
        if (free.length) { planRecipeFeedback.textContent = `${dayName(day)} té ${free.length === 1 ? 'un àpat lliure' : 'dinar i sopar lliures'}.`; return; }
        const alternatives = weeklyPlannerEngine.days.filter(key => weeklyPlannerEngine.meals.some(meal => !weeklyPlanner.days[key][meal]));
        planRecipeFeedback.textContent = alternatives.length ? `${dayName(day)} és ple. Pots triar un d’aquests dies amb lloc:` : 'Tota la setmana és plena. Allibera un àpat al menú abans d’afegir-hi aquesta recepta.';
        planRecipeAlternatives.innerHTML = alternatives.map(key => `<button type="button" class="btn-outline plan-suggest-day" data-day="${key}">${dayName(key)} · ${weeklyPlannerEngine.meals.filter(meal => !weeklyPlanner.days[key][meal]).map(meal => mealNames[meal].toLowerCase()).join(' i ')}</button>`).join('');
        planRecipeAlternatives.querySelectorAll('.plan-suggest-day').forEach(button => button.addEventListener('click', () => { planRecipeDay.value = button.dataset.day; updateRecipePlanDay(); planRecipeMeal.focus(); }));
    }
    function closeRecipePlan() {
        planRecipeModal.classList.remove('show'); recipeToPlan = null;
        if (planRecipeTrigger?.isConnected) planRecipeTrigger.focus();
    }
    planRecipeDay.addEventListener('change', updateRecipePlanDay);
    planRecipeMeal.addEventListener('change', updateRecipePlanDay);
    document.getElementById('close-plan-recipe').addEventListener('click', closeRecipePlan);
    document.getElementById('plan-recipe-form').addEventListener('submit', event => {
        event.preventDefault();
        const day = planRecipeDay.value, meal = planRecipeMeal.value;
        if (!recipeToPlan || !weeklyPlannerEngine.days.includes(day) || !weeklyPlannerEngine.meals.includes(meal)) { planRecipeFeedback.textContent = 'Tria un dia i un àpat lliure.'; return; }
        if (weeklyPlanner.days[day][meal]) { updateRecipePlanDay(); return; }
        try {
            const next = weeklyPlannerEngine.normalizeState(weeklyPlanner);
            next.days[day][meal] = { kind: 'recipe', id: recipeToPlan.id, title: recipeToPlan.title, locked: true };
            const adopted = recipeToPlan.collection === 'recommended' && !adoptedRecipes.includes(recipeToPlan.id) ? [...adoptedRecipes, recipeToPlan.id] : [...adoptedRecipes];
            appData.update({ weeklyPlanner: next, adoptedRecipes: adopted });
            weeklyPlanner = next; adoptedRecipes = adopted;
            const message = `${recipeToPlan.title}: afegida a ${dayName(day).toLowerCase()} · ${mealNames[meal].toLowerCase()}.`;
            filterRecipes(); renderPlanner(); renderFridgeRecipes();
            if (modal.classList.contains('show')) openRecipeModal(recipeToPlan.id);
            catalogNotice.hidden = false; catalogNotice.textContent = message;
            document.getElementById('fridge-status').textContent = message;
            closeRecipePlan();
        } catch (error) { planRecipeFeedback.textContent = `No s’ha pogut desar: ${error.message} El menú anterior es conserva.`; }
    });

    function openMealPicker(day, meal, recipeId = null) {
        if (!weeklyPlannerEngine.days.includes(day) || !weeklyPlannerEngine.meals.includes(meal)) return;
        mealTrigger = document.activeElement;
        mealDay.value = day;
        mealType.value = meal;
        updateMealChoices(recipeId);
        mealFeedback.textContent = '';
        mealModal.classList.add('show');
        mealChoice.focus();
    }

    function updateMealChoices(preselected = null) {
        const current = weeklyPlanner.days[mealDay.value]?.[mealType.value];
        const own = weeklyPlannerEngine.ownRecipes(adoptedRecipes);
        mealChoice.innerHTML = `<option value="empty">Sense assignar</option><option value="leftovers">Aprofito restes</option><option value="out">Menjo fora</option><option value="note">Plat escrit · sense recepta</option>` +
            own.map(recipe => `<option value="${recipe.id}">${escapeHtml(recipe.title)} · ${escapeHtml(recipe.time)}</option>`).join('') +
            (current?.kind === 'recipe' && !own.some(recipe => recipe.id === current.id) ?
                `<option value="${current.id}">${escapeHtml(current.title)} · Àpat ja desat</option>` : '');
        mealChoice.value = preselected != null ? String(preselected) : current?.kind === 'recipe' ? String(current.id) : current?.kind || 'empty';
        mealNote.value = ['out', 'leftovers', 'note'].includes(current?.kind) ? current.title : '';
        mealNote.disabled = !['leftovers', 'out', 'note'].includes(mealChoice.value);
    }

    function closeMealPicker() {
        mealModal.classList.remove('show');
        if (mealTrigger?.isConnected) mealTrigger.focus(); else generatePlannerBtn.focus();
    }

    mealDay.addEventListener('change', () => updateMealChoices());
    mealType.addEventListener('change', () => updateMealChoices());
    mealChoice.addEventListener('change', () => { mealNote.disabled = !['leftovers', 'out', 'note'].includes(mealChoice.value); });
    closeMealBtn.addEventListener('click', closeMealPicker);
    mealForm.addEventListener('submit', event => {
        event.preventDefault();
        const day = mealDay.value;
        const meal = mealType.value;
        if (!weeklyPlannerEngine.days.includes(day) || !weeklyPlannerEngine.meals.includes(meal)) return;
        const next = weeklyPlannerEngine.normalizeState(weeklyPlanner);
        const choice = mealChoice.value;
        if (choice === 'empty') next.days[day][meal] = null;
        else if (['out', 'leftovers', 'note'].includes(choice)) {
            if (choice === 'note' && !mealNote.value.trim()) { mealFeedback.textContent = 'Escriu el nom del plat al camp de nota.'; return; }
            next.days[day][meal] = { kind: choice, title: mealNote.value.trim(), locked: true };
        } else {
            const id = Number(choice);
            const recipe = weeklyPlannerEngine.ownRecipes(adoptedRecipes).find(item => item.id === id);
            const previous = weeklyPlanner.days[day][meal];
            if (!recipe && !(previous?.kind === 'recipe' && previous.id === id)) return;
            next.days[day][meal] = { kind: 'recipe', id, title: recipe?.title || previous.title, locked: true };
        }
        if (commitPlanner(next, `${dayName(day)} · ${mealNames[meal]}: ${choice === 'empty' ? 'àpat buidat' : 'tria desada i fixada'}.`)) closeMealPicker();
        else mealFeedback.textContent = 'No s’ha pogut desar. La tria anterior es conserva; comprova l’emmagatzematge del navegador.';
    });

    Object.values(plannerControls).forEach(control => control.addEventListener('change', () => {
        const people = Number(plannerControls.people.value);
        if (!Number.isInteger(people) || people < 1 || people > 8) {
            plannerFeedback('Tria entre 1 i 8 persones per àpat.', true);
            renderPlanner();
            return;
        }
        const next = weeklyPlannerEngine.normalizeState(weeklyPlanner);
        next.settings = weeklyPlannerEngine.settingsFor({
            seasonEnabled: plannerControls.seasonEnabled.checked, season: plannerControls.season.value,
            batchDays: Number(plannerControls.batchDays.value), people,
            maxMinutes: Number(plannerControls.maxMinutes.value), preferFridge: plannerControls.preferFridge.checked
        });
        commitPlanner(next, 'Preferències desades. Prem «Regenera la setmana» per aplicar-les als àpats; els fixats es conservaran.');
    }));

    generatePlannerBtn.addEventListener('click', () => {
        const slots = Object.values(weeklyPlanner.days).flatMap(day => weeklyPlannerEngine.meals.map(meal => day[meal]));
        if (slots.every(slot => slot?.locked)) {
            plannerFeedback('Tots els àpats estan fixats. Desfixa els que vulguis que canviïn.');
            return;
        }
        const result = weeklyPlannerEngine.generate(weeklyPlanner, { adopted: adoptedRecipes, fridge: myFridge });
        if (!result.ok) {
            plannerFeedback('No hi ha receptes teves amb aquests filtres. Desactiva la temporada, amplia el temps o adopta més receptes. El menú es conserva.', true);
            return;
        }
        commitPlanner(result.state, 'Setmana suggerida. Hem conservat els àpats fixats; pots canviar o triar qualsevol dels altres individualment.');
    });

    function renderPlanner() {
        plannerGrid.innerHTML = '';
        const settings = weeklyPlanner.settings;
        for (const [key, control] of Object.entries(plannerControls)) {
            if (typeof settings[key] === 'boolean') control.checked = settings[key];
            else control.value = String(settings[key]);
        }
        plannerControls.season.disabled = !settings.seasonEnabled;
        const season = settings.season === 'auto' ? weeklyPlannerEngine.currentSeason() : settings.season;
        plannerPreferencesSummary.textContent = [
            `${settings.people} ${settings.people === 1 ? 'persona' : 'persones'}`,
            settings.batchDays ? `Batch cooking · ${settings.batchDays} ${settings.batchDays === 1 ? 'dia' : 'dies'}` : 'Dia a dia',
            settings.seasonEnabled ? season : 'Totes les temporades',
            ...(settings.maxMinutes ? [`Màxim ${settings.maxMinutes} min`] : []),
            ...(settings.preferFridge ? ['Prioritzar nevera'] : [])
        ].join(' · ');
        plannerControls.season.querySelector?.('option[value="auto"]')?.replaceChildren(`Estació actual · ${season}`);
        const pool = weeklyPlannerEngine.eligible(settings, adoptedRecipes);
        const ownCount = weeklyPlannerEngine.ownRecipes(adoptedRecipes).length;
        plannerPoolInfo.textContent = pool.length ? `${pool.length} de ${ownCount} receptes teves disponibles${settings.seasonEnabled ? ` · ${season}` : ' · Totes les estacions'}. ${!settings.batchDays && pool.length < 14 ? 'Per omplir 14 àpats caldrà repetir alguns plats; evitarem dinar i sopar iguals sempre que hi hagi alternatives.' : ''}` :
            'Cap recepta teva compleix els filtres. Prova de desactivar la temporada, ampliar el temps o adoptar més receptes. No s’ompliran àpats amb receptes fora dels filtres.';
        generatePlannerBtn.disabled = !pool.length;
        generatePlannerBtn.textContent = Object.values(weeklyPlanner.days).some(day => day.lunch || day.dinner) ? 'Regenera la setmana' : 'Suggereix una setmana';
        plannerModeHelp.textContent = settings.batchDays ? `Blocs de ${settings.batchDays} ${settings.batchDays === 1 ? 'dia' : 'dies'}: proposem un dinar i un sopar per bloc, amb repeticions per avançar feina. ${settings.batchDays === 1 ? 'Amb un dia no es repeteixen plats entre dies expressament.' : ''} Les decisions fixades i els canvis individuals poden trencar el bloc.` :
            'Dia a dia: prioritzem plats diferents, alternem la proteïna principal i evitem repetir el mateix plat en dies seguits quan la llista ho permet. La nevera només es compara per nom, sense comprovar existències ni caducitats.';
        weeklyPlannerEngine.days.forEach(dayKey => {
            const dayEl = document.createElement('div');
            dayEl.className = 'planner-day';
            dayEl.innerHTML = `<h3>${dayName(dayKey)}</h3>` + weeklyPlannerEngine.meals.map(meal => {
                const slot = weeklyPlanner.days[dayKey][meal];
                const recipe = slot?.kind === 'recipe' ? recipes.find(item => item.id === slot.id) : null;
                const label = `${dayName(dayKey)} ${mealNames[meal].toLowerCase()}`;
                const title = slot?.kind === 'recipe' ? recipe?.title || slot.title : slot?.kind === 'note' ? slot.title : slot?.kind === 'out' ? 'Menjo fora' : slot?.kind === 'leftovers' ? 'Aprofito restes' : 'Sense assignar';
                return `<section class="planner-meal${slot?.locked ? ' is-locked' : ''}">
                    <div class="planner-meal-heading"><h4>${mealNames[meal]}</h4>${slot ? `<button type="button" class="planner-lock" data-day="${dayKey}" data-meal="${meal}" aria-pressed="${slot.locked}" aria-label="${slot.locked ? 'Desfixa' : 'Fixa'} ${label}">${slot.locked ? 'Fixat ✓' : 'Fixa'}</button>` : ''}</div>
                    ${recipe ? `<button type="button" class="planner-view-recipe" data-id="${recipe.id}">${escapeHtml(title)}</button>` : `<p class="planner-meal-title">${escapeHtml(title)}</p>`}
                    ${recipe ? `<p class="planner-meal-meta">${escapeHtml(recipe.time)} · ${settings.people} ${settings.people === 1 ? 'persona' : 'persones'}${slot.batchKey ? ' · Bloc batch cooking' : ''}</p>` : slot?.kind === 'note' ? '<p class="planner-meal-meta">Plat escrit · ingredients a la compra manualment</p>' : slot?.title ? `<p class="planner-meal-meta">${escapeHtml(slot.title)}</p>` : ''}
                    <div class="planner-meal-actions"><button type="button" class="planner-choose" data-day="${dayKey}" data-meal="${meal}" aria-label="Tria ${label}">${slot ? 'Tria un altre' : 'Tria un àpat'}</button>
                        ${!slot || slot.kind === 'recipe' ? `<button type="button" class="planner-replace" data-day="${dayKey}" data-meal="${meal}" aria-label="Suggereix una alternativa per a ${label}">↻ Canvia</button>` : ''}
                    </div></section>`;
            }).join('');
            plannerGrid.appendChild(dayEl);
        });
        document.querySelectorAll('.planner-choose').forEach(button => button.addEventListener('click', () => openMealPicker(button.dataset.day, button.dataset.meal)));
        document.querySelectorAll('.planner-view-recipe').forEach(button => button.addEventListener('click', () => openRecipeModal(Number(button.dataset.id))));
        document.querySelectorAll('.planner-lock').forEach(button => button.addEventListener('click', () => {
            const next = weeklyPlannerEngine.normalizeState(weeklyPlanner);
            const slot = next.days[button.dataset.day][button.dataset.meal];
            slot.locked = !slot.locked;
            commitPlanner(next, slot.locked ? 'Àpat fixat: es conservarà quan regeneris la setmana.' : 'Àpat desfixat: la pròxima regeneració el podrà canviar.');
        }));
        document.querySelectorAll('.planner-replace').forEach(button => button.addEventListener('click', () => {
            const result = weeklyPlannerEngine.replaceMeal(weeklyPlanner, button.dataset.day, button.dataset.meal, { adopted: adoptedRecipes, fridge: myFridge });
            if (!result.ok) {
                plannerFeedback(result.reason === 'no-alternative' ? 'No hi ha una altra recepta teva amb aquests filtres. El teu àpat es conserva.' : 'No hi ha cap recepta teva disponible amb aquests filtres. El teu àpat es conserva.', true);
                return;
            }
            commitPlanner(result.state, 'Àpat canviat. La resta del menú es conserva, també les altres racions del bloc.');
        }));
        const preparations = weeklyPlannerEngine.preparations(weeklyPlanner);
        plannerBatchSummary.hidden = !settings.batchDays || !preparations.length;
        plannerPreparations.innerHTML = preparations.map(group => {
            const base = recipes.find(recipe => recipe.id === group.id)?.servings;
            const factor = base ? new Intl.NumberFormat('ca', { maximumFractionDigits: 2 }).format(group.portions / base) : null;
            return `<div class="planner-preparation"><span><strong>${escapeHtml(group.title)}</strong><small>Des de ${dayName(group.firstDay).toLowerCase()} · ${group.uses} ${group.uses === 1 ? 'àpat' : 'àpats'}${base ? ` · Fitxa de ${base} racions: quantitats × ${factor}` : ''}</small></span><span>${group.portions} ${group.portions === 1 ? 'ració' : 'racions'}</span></div>`;
        }).join('');
        renderShopping();
    }

    clearPlannerBtn.addEventListener('click', () => {
        if(confirm("Segur que vols netejar tota la setmana?")) {
            const next = weeklyPlannerEngine.normalizeState(null);
            next.settings = { ...weeklyPlanner.settings };
            commitPlanner(next, 'Menú buidat. Hem conservat les preferències, la nevera i el receptari.');
        }
    });

    // --- Init ---
    menuImportUI.mount({ getState: () => weeklyPlanner, getAdopted: () => adoptedRecipes, getFridge: () => myFridge, commit: commitPlanner });
    filterRecipes();
    renderFridge();
    renderPlanner();
    showView(window.location?.hash.slice(1));
    if (appData.warning) { catalogNotice.hidden = false; catalogNotice.textContent = appData.warning; }
});
