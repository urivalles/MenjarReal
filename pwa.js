// Instal·lació i actualitzacions independents de les dades personals.
document.addEventListener('DOMContentLoaded', () => {
    const installButton = document.getElementById('install-app-btn');
    const help = document.getElementById('install-help');
    const status = document.getElementById('install-status');
    const connection = document.getElementById('app-connection-status');
    const updateNotice = document.getElementById('app-update-notice');
    const updateButton = document.getElementById('update-app-btn');
    const standalone = window.matchMedia('(display-mode: standalone)');
    let installPrompt = null;
    let waitingWorker = null;
    let reloadForUpdate = false;
    let appRegistration = null;
    const iconHelp = document.getElementById('icon-help');
    const iconHelpButton = document.getElementById('open-icon-help-btn');
    const updateCheckButton = document.getElementById('check-app-updates-btn');
    const updateCheckStatus = document.getElementById('app-update-check-status');
    function showIconHelp(visible) {
        iconHelp.hidden = !visible;
        iconHelpButton.setAttribute('aria-expanded', String(visible));
        if (visible) { document.getElementById('app-options').open = false; iconHelp.scrollIntoView?.({ block: 'start', behavior: 'smooth' }); }
    }
    iconHelpButton.addEventListener('click', () => showIconHelp(iconHelp.hidden));
    document.getElementById('close-icon-help-btn').addEventListener('click', () => { showIconHelp(false); iconHelpButton.focus?.({ preventScroll: true }); });
    function waitForInstall(worker) {
        if (!worker || ['installed', 'activated', 'redundant'].includes(worker.state)) return Promise.resolve(worker?.state);
        return new Promise(resolve => {
            const onChange = () => {
                if (['installed', 'activated', 'redundant'].includes(worker.state)) {
                    worker.removeEventListener('statechange', onChange);
                    resolve(worker.state);
                }
            };
            worker.addEventListener('statechange', onChange);
            onChange();
        });
    }
    updateCheckButton.addEventListener('click', async () => {
        if (updateCheckButton.disabled) return;
        updateCheckButton.disabled = true;
        updateCheckStatus.textContent = 'Comprovant si hi ha una versió nova…';
        try {
            if (!navigator.onLine) throw new Error('offline');
            if (!appRegistration) {
                appRegistration = await navigator.serviceWorker.getRegistration('./');
            }
            if (!appRegistration) throw new Error('registration');
            // L'actualització pot estar instal·lant-se encara quan update() acaba.
            await appRegistration.update();
            if (appRegistration.installing) await waitForInstall(appRegistration.installing);
            const pending = appRegistration.waiting;
            if (pending) {
                offerUpdate(pending);
                updateCheckStatus.textContent = 'Actualització disponible! Prem «Actualitza l’app» a l’avís que apareix a la pantalla.';
                document.getElementById('app-options').open = false;
                updateNotice.scrollIntoView?.({ block: 'nearest', behavior: 'smooth' });
            } else {
                updateCheckStatus.textContent = 'No s’ha detectat cap nova versió. Si acabes de publicar canvis, torna-ho a provar d’aquí una estona.';
            }
        } catch (error) {
            updateCheckStatus.textContent = error.message === 'offline'
                ? 'Sense connexió. Connecta’t a internet i torna-ho a provar.'
                : 'No s’ha pogut comprovar la versió. Torna-ho a provar amb connexió.';
        } finally {
            updateCheckButton.disabled = false;
        }
    });

    function showHelp(visible) {
        help.hidden = !visible;
        installButton.setAttribute('aria-expanded', String(visible));
    }
    function installedState() {
        const installed = standalone.matches || window.navigator.standalone === true;
        installButton.hidden = installed;
        if (installed) showHelp(false);
    }
    installedState();
    standalone.addEventListener?.('change', installedState);
    const showConnection = () => { connection.hidden = navigator.onLine !== false; };
    showConnection();
    window.addEventListener('online', showConnection);
    window.addEventListener('offline', showConnection);

    window.addEventListener('beforeinstallprompt', event => {
        event.preventDefault();
        installPrompt = event;
        installButton.textContent = 'Instal·la l’app';
    });
    window.addEventListener('appinstalled', () => {
        installPrompt = null;
        installButton.hidden = true;
        showHelp(false);
    });
    installButton.addEventListener('click', async () => {
        if (!installPrompt) { showHelp(help.hidden); return; }
        const prompt = installPrompt;
        installPrompt = null;
        try {
            await prompt.prompt();
            const result = await prompt.userChoice;
            if (result.outcome !== 'accepted') showHelp(true);
        } catch {
            showHelp(true);
        }
    });

    if (!window.isSecureContext || !['http:', 'https:'].includes(window.location.protocol)) {
        status.textContent = 'Per instal·lar-la al mòbil, obre l’adreça HTTPS publicada de l’app. Un fitxer local o una adreça HTTP de la xarxa de casa no serveix.';
        return;
    }
    if (!('serviceWorker' in navigator)) {
        status.textContent = 'Aquest navegador no permet preparar el mode sense connexió. Prova Chrome a Android o Safari a iPhone.';
        return;
    }
    status.textContent = 'Preparant l’app per fer-la servir sense connexió…';
    function offerUpdate(worker) {
        if (!worker) return;
        waitingWorker = worker;
        updateNotice.hidden = false;
    }
    updateButton.addEventListener('click', () => {
        if (!waitingWorker) return;
        // Una altra finestra pot haver activat ja aquesta versió.
        if (waitingWorker.state === 'activated') { window.location.reload(); return; }
        if (waitingWorker.state === 'redundant') {
            updateNotice.hidden = true;
            status.textContent = 'Aquesta actualització ja no està disponible. Torna a obrir l’app amb connexió per comprovar-ne la versió.';
            return;
        }
        reloadForUpdate = true;
        updateButton.disabled = true;
        waitingWorker.postMessage({ type: 'ACTIVATE_UPDATE' });
    });
    navigator.serviceWorker.addEventListener('controllerchange', () => {
        // No recarregar automàticament: podria haver-hi un formulari a mig fer.
        if (reloadForUpdate) {
            reloadForUpdate = false;
            window.location.reload();
        }
    });
    navigator.serviceWorker.register('./sw.js', { scope: './', updateViaCache: 'none' }).then(registration => {
        appRegistration = registration;
        // Força una comprovació inicial: no depenem només de la política automàtica del navegador.
        registration.update().catch(() => {});
        offerUpdate(registration.waiting);
        function observe(worker) {
            if (!worker) return;
            const onStateChange = () => {
                if (worker.state === 'installed' && navigator.serviceWorker.controller) offerUpdate(registration.waiting || worker);
                if (worker.state === 'redundant' && !navigator.serviceWorker.controller) status.textContent = 'No s’ha pogut preparar el mode sense connexió. Torna a obrir l’app amb internet.';
            };
            worker.addEventListener('statechange', onStateChange);
            onStateChange();
        }
        observe(registration.installing);
        registration.addEventListener('updatefound', () => observe(registration.installing));
        return navigator.serviceWorker.ready;
    }).then(() => {
        status.textContent = 'App preparada per funcionar sense connexió. Les dades continuen guardades en aquest dispositiu.';
    }).catch(() => {
        status.textContent = 'No s’ha pogut preparar el mode sense connexió. Pots continuar fent servir l’app i tornar-ho a provar amb internet.';
    });
});
