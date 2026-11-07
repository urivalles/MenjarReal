const menuImportUI = (() => {
    function mount({ getState, getAdopted, getFridge, commit }) {
        const node = id => document.getElementById(id);
        const dialog = node('menu-import-dialog');
        const input = node('menu-import-text');
        const preview = node('menu-import-preview');
        const rows = node('menu-import-rows');
        const status = node('menu-import-status');
        const warnings = node('menu-import-warnings');
        const summary = node('menu-import-summary');
        const save = node('menu-import-save');
        const suggest = node('menu-import-suggest');
        const mealName = { lunch: 'Dinar', dinner: 'Sopar' };
        let base, draft = [], fields = [], trigger, parsedWarnings = [], dirty = false;
        const dayName = day => day.charAt(0).toUpperCase() + day.slice(1);
        function message(text, error = false) { status.textContent = text; status.setAttribute('data-error', String(error)); }
        function collect() {
            return fields.map(({ day, meal, title, choice, replace, source }) => ({ day, meal, title: title.value.trim(), recipeId: choice.value ? Number(choice.value) : null, replace: replace.checked,
                ...(source?.batchKey && Number(choice.value) === source.recipeId && title.value.trim() === source.title ? { batchKey: source.batchKey } : {}) }));
        }
        function updateSummary() {
            try {
                const result = menuImportEngine.apply(base, collect(), getAdopted());
                summary.textContent = `${result.added} àpats nous · ${result.replaced} substitucions marcades · ${result.skipped} àpats existents conservats. ${result.notes ? `${result.notes} plats escrits sense recepta: afegeix-ne els ingredients manualment a la compra.` : ''}`;
                save.disabled = dirty || !(result.added + result.replaced);
            } catch (error) { save.disabled = true; message(error.message, true); }
        }
        function render(entries) {
            draft = entries;
            rows.replaceChildren(); fields = [];
            const own = weeklyPlannerEngine.ownRecipes(getAdopted());
            for (const day of weeklyPlannerEngine.days) {
                const card = document.createElement('section'); card.className = 'menu-import-day';
                const heading = document.createElement('h3'); heading.textContent = dayName(day); card.appendChild(heading);
                for (const meal of weeklyPlannerEngine.meals) {
                    const entry = draft.find(item => item.day === day && item.meal === meal);
                    const previous = base.days[day][meal];
                    const row = document.createElement('div'); row.className = 'menu-import-meal';
                    const titleId = `menu-import-${day}-${meal}`;
                    const label = document.createElement('label'); label.htmlFor = titleId; label.textContent = mealName[meal];
                    const title = document.createElement('input'); title.id = titleId; title.type = 'text'; title.maxLength = 160; title.value = entry?.title || ''; title.placeholder = previous ? 'Deixa buit per conservar l’àpat' : 'Escriu un plat o deixa’l buit';
                    const choiceLabel = document.createElement('label'); choiceLabel.className = 'sr-only'; choiceLabel.htmlFor = titleId + '-recipe'; choiceLabel.textContent = `Recepta vinculada · ${dayName(day)} · ${mealName[meal]}`;
                    const choice = document.createElement('select'); choice.id = titleId + '-recipe';
                    const option = document.createElement('option'); option.value = ''; option.textContent = 'Plat escrit · sense ingredients automàtics'; choice.appendChild(option);
                    own.forEach(recipe => { const option = document.createElement('option'); option.value = String(recipe.id); option.textContent = recipe.title; choice.appendChild(option); });
                    choice.value = entry?.recipeId ? String(entry.recipeId) : '';
                    const replace = document.createElement('input'); replace.type = 'checkbox'; replace.checked = entry?.replace === true; replace.disabled = !previous;
                    row.appendChild(label); row.appendChild(title); row.appendChild(choiceLabel); row.appendChild(choice);
                    if (previous) {
                        const existing = document.createElement('p'); existing.className = 'planner-help';
                        existing.textContent = `Ja hi ha: ${previous.kind === 'out' ? 'Menjo fora' : previous.kind === 'leftovers' ? 'Aprofito restes' : previous.title}${previous.locked ? ' · fixat' : ''}`;
                        const check = document.createElement('label'); check.className = 'planner-check'; check.appendChild(replace); check.appendChild(document.createTextNode('Substitueix aquest àpat'));
                        row.appendChild(existing); row.appendChild(check);
                    }
                    fields.push({ day, meal, title, choice, replace, source: entry });
                    title.addEventListener('input', () => { choice.value = String(menuImportEngine.matchRecipe(title.value, getAdopted())?.id || ''); updateSummary(); });
                    choice.addEventListener('change', () => { const recipe = own.find(item => item.id === Number(choice.value)); if (recipe) title.value = recipe.title; updateSummary(); });
                    replace.addEventListener('change', updateSummary);
                    card.appendChild(row);
                }
                rows.appendChild(card);
            }
            warnings.replaceChildren();
            parsedWarnings.forEach(text => { const item = document.createElement('li'); item.textContent = text; warnings.appendChild(item); });
            node('menu-import-warnings-box').hidden = !parsedWarnings.length;
            preview.hidden = false; dirty = false; suggest.disabled = false; updateSummary();
        }
        function open() {
            base = weeklyPlannerEngine.normalizeState(getState()); trigger = document.activeElement;
            input.value = ''; draft = []; parsedWarnings = []; fields = []; dirty = false;
            preview.hidden = true; rows.replaceChildren(); message(''); save.disabled = true;
            dialog.showModal(); input.focus();
        }
        function close() { dialog.close(); }
        node('open-menu-import').addEventListener('click', open);
        node('close-menu-import').addEventListener('click', close);
        node('menu-import-cancel').addEventListener('click', close);
        dialog.addEventListener('close', () => trigger?.focus({ preventScroll: true }));
        input.addEventListener('input', () => {
            if (!preview.hidden) { dirty = true; save.disabled = true; suggest.disabled = true; message('El text ha canviat. Prem «Previsualitza» per tornar-lo a interpretar abans de confirmar.'); }
        });
        node('menu-import-form').addEventListener('submit', event => {
            event.preventDefault();
            if (!preview.hidden && !window.confirm('Tornar a interpretar el text substituirà els canvis de la previsualització. Vols continuar?')) return;
            try {
                const parsed = menuImportEngine.parseText(input.value, getAdopted()); parsedWarnings = parsed.warnings;
                render(parsed.entries);
                message(parsed.entries.length ? 'Revisa els plats i les receptes vinculades. Encara no s’ha desat res.' : 'No s’han detectat àpats. Pots omplir directament la previsualització.');
                node('menu-import-preview-title').focus();
            } catch (error) { message(error.message, true); }
        });
        suggest.addEventListener('click', () => {
            try {
                const result = menuImportEngine.suggest(base, collect(), { adopted: getAdopted(), fridge: getFridge() });
                render(result.entries);
                message(result.emptyPool ? 'No hi ha receptes teves amb les preferències actuals. Pots ajustar-les al Menú o escriure els plats.' : result.count ? `${result.count} suggeriments afegits a la previsualització. Revisa’ls abans de confirmar.` : 'No queden espais lliures. Els àpats existents es conserven.');
            } catch (error) { message(error.message, true); }
        });
        save.addEventListener('click', () => {
            if (dirty) { message('El text ha canviat. Torna a previsualitzar-lo.', true); return; }
            if (JSON.stringify(weeklyPlannerEngine.normalizeState(getState())) !== JSON.stringify(base)) { message('El menú ha canviat mentre el revisaves. Tanca i torna a obrir la importació; no s’ha substituït res.', true); return; }
            try {
                const result = menuImportEngine.apply(base, collect(), getAdopted());
                if (!(result.added + result.replaced)) { message('No hi ha canvis per confirmar.'); return; }
                const text = `Menú importat: ${result.added} àpats nous i ${result.replaced} substitucions confirmades. Els altres àpats es conserven.${result.notes ? ` ${result.notes} plats sense recepta vinculada: afegeix-ne els ingredients manualment a la compra.` : ''}`;
                if (commit(result.state, text)) close();
                else message('No s’ha pogut desar. El menú anterior es conserva i pots tornar-ho a provar.', true);
            } catch (error) { message(error.message, true); }
        });
    }
    return { mount };
})();
