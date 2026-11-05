// Selector local de recordatoris. No fa peticions ni desa el text de l'usuari.
const contextTipsEngine = (() => {
    const definitions = [
        { id: 'sport', label: 'Després d’esport', tips: ['recovery-calm', 'recovery-dinner', 'recovery-snack'],
            words: ['esport', 'ejercicio', 'entrenament', 'entrenat', 'entrenar', 'gimnas', 'gimnasio', 'he corregut', 'sortir a correr', 'bicicleta', 'natacio'] },
        { id: 'reset', label: 'Un dia difícil', tips: ['reset'],
            words: ['he menjat massa', 'he comido demasiado', 'm he passat', 'culpa', 'culpable', 'he pecat', 'dia dificil', 'mal dia', 'compensar'] },
        { id: 'hunger', label: 'Tinc gana', tips: ['food-option', 'gentle-pause'],
            words: ['gana', 'hambre', 'estomac buit', 'necessito menjar', 'necessito sopar', 'necessito dinar'] },
        { id: 'emotions', label: 'Estrès i emocions', tips: ['gentle-pause', 'mindful-meal', 'reset'],
            words: ['ansietat', 'ansiedad', 'ansios', 'ansiosa', 'estressat', 'estressada', 'estres', 'stress', 'nervis', 'nervios', 'nerviosisme', 'trist', 'trista', 'tristesa', 'solitud', 'gana emocional', 'hambre emocional'] },
        { id: 'boredom', label: 'Avorriment', tips: ['sofa-break', 'food-option'],
            words: ['avorrit', 'avorrida', 'avorreixo', 'avorriment', 'aburrido', 'aburrida', 'aburrimiento', 'sofa', 'per inercia'] },
        { id: 'snacking', label: 'Ganes de picar', tips: ['gentle-pause', 'crunchy', 'food-option', 'choices'],
            words: ['no puc parar de picar', 'no puc parar de menjar', 'no puedo parar de comer', 'picar', 'picoteig', 'picotear', 'pica pica', 'snack', 'snacks', 'dolcos', 'xocolata', 'patates de bossa'] },
        { id: 'meals', label: 'Abans o durant l’àpat', tips: ['water', 'mindful-meal'],
            words: ['abans de menjar', 'durant l apat', 'abans de l apat', 'menjar de pressa', 'menjo de pressa', 'menjar rapid', 'taula', 'dinar', 'sopar'] }
    ];
    const normalize = text => typeof text === 'string' ? text.slice(0, 1000).normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[’']/g, ' ').replace(/[ \t]+/g, ' ') : '';
    const categories = definitions.map(({ id, label, tips }) => ({ id, label, tips: [...tips] }));
    const rules = definitions.map(definition => ({ ...definition,
        patterns: definition.words.map(word => new RegExp(`\\b${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'g')) }));

    function forCategories(ids) {
        const selected = [...new Set(ids)].filter(id => categories.some(category => category.id === id));
        const tips = [...new Set(selected.flatMap(id => categories.find(category => category.id === id).tips))].slice(0, 5);
        return { categories: selected, tips };
    }
    function suggest(text) {
        const clauses = normalize(text).split(/[.!?;,\n]+|\bpero\b/);
        const matched = rules.filter(rule => clauses.some(clause => rule.patterns.some(pattern => {
            pattern.lastIndex = 0;
            for (const match of clause.matchAll(pattern)) {
                const prefix = clause.slice(Math.max(0, match.index - 60), match.index);
                // Evita interpretar «no tinc gana» o «sense ansietat» com afirmacions.
                if (!/\b(?:no|ni|sense|sin|mai)\b(?:\s+\w+){0,3}\s*$/.test(prefix)) return true;
            }
            return false;
        }))).map(rule => rule.id);
        return forCategories(matched);
    }
    return { categories, suggest, forCategories };
})();
