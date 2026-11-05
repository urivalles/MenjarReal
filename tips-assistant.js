// Interfície independent del selector: permet canviar-lo sense canviar el formulari.
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('context-tips-form');
    const input = document.getElementById('context-tips-input');
    const categoryList = document.getElementById('context-tips-categories');
    const feedback = document.getElementById('context-tips-feedback');
    const results = document.getElementById('context-tips-results');
    const clear = document.getElementById('context-tips-clear');
    const microphone = document.getElementById('context-tips-mic');
    const voiceStatus = document.getElementById('context-tips-voice-status');
    const language = 'ca-ES';
    let recognition = null, SpeechType = null, listening = false, voiceReady = false, session = 0;

    function render(result, manual = false) {
        results.replaceChildren();
        const selected = result.categories.map(id => contextTipsEngine.categories.find(category => category.id === id));
        categoryList.querySelectorAll('button').forEach(button => {
            button.setAttribute('aria-pressed', String(result.categories.includes(button.dataset.category)));
        });
        feedback.textContent = selected.length
            ? `${manual ? 'Situació triada' : 'Pot encaixar amb'}: ${selected.map(category => category.label).join(' · ')}. Pots triar una altra situació.`
            : input.value.trim() ? 'No he trobat una coincidència clara. Tria una situació a sota o explica-ho amb altres paraules.'
                : 'Explica breument què et passa o tria una situació.';
        for (const id of result.tips) {
            const source = document.getElementById('tip-' + id);
            if (!source) continue;
            const card = source.cloneNode(true);
            card.removeAttribute('id'); card.removeAttribute('aria-labelledby');
            card.querySelectorAll('[id]').forEach(element => element.removeAttribute('id'));
            card.className = 'tip-card context-tip';
            results.appendChild(card);
        }
    }
    contextTipsEngine.categories.forEach(category => {
        const button = document.createElement('button');
        button.type = 'button'; button.className = 'context-category'; button.dataset.category = category.id;
        button.textContent = category.label; button.setAttribute('aria-pressed', 'false');
        button.addEventListener('click', () => { stopVoice(); render(contextTipsEngine.forCategories([category.id]), true); });
        categoryList.appendChild(button);
    });
    form.addEventListener('submit', event => { event.preventDefault(); stopVoice(); render(contextTipsEngine.suggest(input.value)); });
    clear.addEventListener('click', () => { stopVoice(); input.value = ''; render(contextTipsEngine.forCategories([])); input.focus({ preventScroll: true }); });
    document.querySelectorAll('[data-scroll-tip]').forEach(button => button.addEventListener('click', () => {
        document.getElementById(button.dataset.scrollTip)?.scrollIntoView({ block: 'start', behavior: 'smooth' });
    }));

    function finishVoice(message) {
        listening = false; input.readOnly = false;
        microphone.textContent = '🎙 Dicta'; microphone.setAttribute('aria-pressed', 'false');
        microphone.disabled = !voiceReady;
        if (message) voiceStatus.textContent = message;
    }
    function stopVoice() {
        if (!listening) return;
        session++;
        try { recognition?.abort(); } catch { /* El servei pot haver acabat abans de l'event end. */ }
        finishVoice('Dictat aturat. Pots revisar el text abans de demanar consells.');
    }
    function unavailable(message) {
        voiceReady = false; microphone.disabled = true;
        voiceStatus.textContent = message || 'Aquest navegador no ofereix dictat local en català. Pots escriure o triar una situació.';
    }
    function localRecognizer(Speech) {
        const candidate = new Speech();
        if (!('processLocally' in candidate)) return null;
        candidate.processLocally = true;
        candidate.lang = language; candidate.continuous = false; candidate.interimResults = true;
        return candidate;
    }
    microphone.addEventListener('click', () => {
        if (listening) {
            try { recognition.stop(); } catch { stopVoice(); }
            return;
        }
        if (!voiceReady || !SpeechType) return;
        // Una instància per sessió impedeix que events antics tanquin un dictat nou.
        try { recognition = localRecognizer(SpeechType); }
        catch { unavailable(); return; }
        if (!recognition) { unavailable(); return; }
        const current = ++session, prefix = input.value.trimEnd();
        listening = true; input.readOnly = true;
        microphone.textContent = '■ Atura el dictat'; microphone.setAttribute('aria-pressed', 'true');
        voiceStatus.textContent = 'Escoltant en català…';
        recognition.onresult = event => {
            if (session !== current || !listening) return;
            const transcript = Array.from(event.results).map(result => result[0]?.transcript || '').join(' ');
            input.value = [prefix, transcript].filter(Boolean).join(' ').slice(0, 1000);
        };
        recognition.onend = () => {
            if (session === current) finishVoice('Dictat acabat. Revisa el text i prem «Mostra’m consells».');
        };
        recognition.onerror = event => {
            if (session !== current) return;
            session++;
            const messages = {
                'not-allowed': 'No s’ha autoritzat el micròfon. Pots continuar escrivint.',
                'audio-capture': 'No s’ha pogut accedir al micròfon. Pots continuar escrivint.',
                'no-speech': 'No s’ha detectat veu. Pots tornar-ho a provar o escriure.',
                'language-not-supported': 'El dictat local en català no està disponible. Pots continuar escrivint.'
            };
            if (event.error === 'language-not-supported') voiceReady = false;
            finishVoice(messages[event.error] || 'No s’ha pogut completar el dictat local. Pots continuar escrivint.');
        };
        try { recognition.start(); }
        catch { session++; finishVoice('No s’ha pogut iniciar el dictat local. Pots continuar escrivint.'); }
    });
    async function prepareVoice() {
        microphone.disabled = true;
        const Speech = window.SpeechRecognition;
        if (!window.isSecureContext || typeof Speech !== 'function' || typeof Speech.available !== 'function') { unavailable(); return; }
        try {
            if (!localRecognizer(Speech)) { unavailable(); return; }
            const availability = await Speech.available({ langs: [language], processLocally: true, quality: 'dictation' });
            if (availability !== 'available') { unavailable(); return; }
            SpeechType = Speech; voiceReady = true; microphone.disabled = false;
            voiceStatus.textContent = 'Dictat local en català disponible. S’activarà quan premis el micròfon.';
        } catch { unavailable(); }
    }
    document.addEventListener('visibilitychange', () => { if (document.hidden) stopVoice(); });
    document.addEventListener('click', event => {
        const target = event.target.closest?.('[data-target]');
        if (target?.dataset.target && target.dataset.target !== 'tips-view') stopVoice();
    });
    const stopIfAway = () => { if (!document.getElementById('tips-view').classList.contains('active-view')) stopVoice(); };
    window.addEventListener('hashchange', stopIfAway);
    window.addEventListener('popstate', stopIfAway);
    window.addEventListener('pagehide', stopVoice);
    render(contextTipsEngine.forCategories([]));
    prepareVoice();
});
