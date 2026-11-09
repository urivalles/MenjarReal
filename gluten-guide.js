// Revisió explícita del catàleg incorporat. No certifica marques ni la cuina.
const glutenGuide = (() => {
    const signatures = {
    "1": "[\"Salmó\",\"Carbassó\",\"Pebrot vermell\",\"Ceba\",\"Oli d'oliva verge extra\",\"Sal i pebre\"]",
    "2": "[\"Cigrons cuits\",\"Tonyina al natural\",\"Tomàquets cherry\",\"Cogombre\",\"Ceba tendra\",\"Oli d'oliva i llimona\"]",
    "3": "[\"Ous\",\"Carbassó\",\"Ceba\",\"Oli d'oliva verge extra\",\"Sal\"]",
    "4": "[\"Albergínia\",\"Carn picada (pollastre o vedella)\",\"Ceba\",\"Tomàquet triturat\",\"Formatge ratllat\"]",
    "5": "[\"Quinoa\",\"Tofu ferm\",\"Bròquil\",\"Pastanaga\",\"Salsa de soja\"]",
    "6": "[\"Llenties pardines\",\"Pastanaga\",\"Ceba\",\"Pebrot verd\",\"Tomàquet\",\"Pebre vermell dolç\"]",
    "7": "[\"Pa integral (100%)\",\"Alvocat madur\",\"Ous\",\"Llimona\",\"Sal i pebre\"]",
    "8": "[\"Pit de pollastre\",\"Moniato\",\"All en pols\",\"Oli d'oliva verge extra\"]",
    "9": "[\"Pasta integral\",\"Espinacs frescos\",\"Anous\",\"All\",\"Oli d'oliva i sal\",\"Formatge parmesà (opcional)\"]",
    "10": "[\"Carbassa\",\"Pastanaga\",\"Pebrotes (opcional)\",\"Ceba\",\"Brou de verdures o aigua\"]",
    "101": "[\"Espinacs\",\"Paneer\",\"Ceba\",\"All\",\"Gingebre\",\"Garam masala\",\"Arròs basmati\",\"Oli d’oliva verge extra\",\"Llimona\",\"Sal i pebre\"]",
    "102": "[\"Ous\",\"Cigrons cuits\",\"Porro\",\"Pastanaga\",\"Col\",\"Aigua o brou de verdures baix en sal\",\"Oli d’oliva verge extra\",\"Pebre\"]",
    "103": "[\"Tofu ferm\",\"Bròquil\",\"Pastanaga\",\"Ceba\",\"Patata\",\"Oli d’oliva verge extra\",\"Salsa de soja baixa en sal\",\"Pebre vermell dolç\"]",
    "104": "[\"Seitan cuit\",\"Carbassa\",\"Moniato\",\"Ceba\",\"Coliflor\",\"Oli d’oliva verge extra\",\"Farigola\",\"Llimona\"]",
    "105": "[\"Lluç descongelat\",\"Patata\",\"Porro\",\"Xampinyons\",\"Oli d’oliva verge extra\",\"Llimona\",\"Julivert\"]",
    "106": "[\"Ous\",\"Xampinyons\",\"Bledes\",\"Porro\",\"Pa integral\",\"Oli d’oliva verge extra\",\"All\",\"Pebre\"]",
    "107": "[\"Salmó\",\"Patata\",\"Xampinyons\",\"Espinacs\",\"Oli d’oliva verge extra\",\"Llimona\",\"Pebre\"]",
    "108": "[\"Patata\",\"Tofu ferm\",\"Bròquil\",\"Salsa de soja baixa en sal\",\"Llimona\",\"Oli d’oliva verge extra\",\"All en pols\",\"Pebre vermell dolç\"]",
    "201": "[\"Tofu ferm\",\"Espinacs\",\"Ceba\",\"All\",\"Garam masala\",\"Arròs basmati\",\"Oli d’oliva verge extra\",\"Llimona\"]",
    "202": "[\"Llenties cuites\",\"Carbassa\",\"Espinacs\",\"Ceba\",\"All\",\"Aigua o brou de verdures baix en sal\",\"Oli d’oliva verge extra\",\"Curri\"]",
    "203": "[\"Cigrons cuits\",\"Espinacs\",\"Xampinyons\",\"Tomàquet triturat\",\"All\",\"Oli d’oliva verge extra\",\"Comí\",\"Pebre vermell dolç\"]",
    "204": "[\"Mongeta blanca cuita\",\"Porro\",\"Col\",\"Pastanaga\",\"All\",\"Aigua o brou de verdures baix en sal\",\"Oli d’oliva verge extra\",\"Farigola\"]",
    "205": "[\"Tofu ferm\",\"Xampinyons\",\"Bròquil\",\"Arròs basmati\",\"All\",\"Gingebre\",\"Salsa de soja baixa en sal\",\"Oli d’oliva verge extra\",\"Midó de blat de moro\"]",
    "206": "[\"Ous\",\"Xampinyons\",\"Espinacs\",\"Pa integral\",\"Oli d’oliva verge extra\",\"Julivert\",\"Pebre\"]",
    "207": "[\"Peix blanc descongelat\",\"Coliflor\",\"Llenties cuites\",\"Porro\",\"All\",\"Oli d’oliva verge extra\",\"Aigua o brou de verdures baix en sal\",\"Llimona\"]",
    "208": "[\"Pit de pollastre\",\"Bròquil\",\"Pastanaga\",\"Ceba\",\"Arròs basmati\",\"Oli d’oliva verge extra\",\"Salsa de soja baixa en sal\",\"Llimona\",\"Gingebre\"]",
    "209": "[\"Cigrons cuits\",\"Ous\",\"Mozzarella ratllada\",\"Sal\",\"Pebre negre\",\"Oli d’oliva verge extra en esprai\"]",
    "301": "[\"Noodles secs\",\"Crema de cacauet 100%\",\"Salsa de soja baixa en sal\",\"Oli de sèsam torrat\",\"Vinagre d’arròs sense sucre afegit\",\"Aigua calenta\",\"Ous\",\"Oli d’oliva verge extra\"]",
    "302": "[\"Nyoquis\",\"Cottage\",\"Bolets congelats\",\"Ceba\",\"Parmesà\",\"All\",\"Julivert\",\"Pebre negre\",\"Nou moscada\",\"Farigola\",\"Caiena\",\"Oli d’oliva\",\"Sal\",\"Llimona\",\"Ous\"]",
    "303": "[\"Pit de pollastre\",\"Patata\",\"Ceba\",\"Pastanaga\",\"Ous\",\"Aigua\",\"Curri o cúrcuma\",\"Nou moscada\",\"Pebre negre\",\"Sal\"]",
    "304": "[\"Enciam i ruca\",\"Tomàquet\",\"Cogombre\",\"Ceba morada\",\"Poma\",\"Olives negres\",\"Iogurt natural\",\"Mostassa\",\"Suc de llimona o vinagre\",\"Oli d’oliva\",\"Sal\",\"Nous\",\"Pebre\",\"Ous durs\",\"Tonyina\",\"Cigrons cuits\"]",
    "305": "[\"Fasols negres cuits\",\"Arròs\",\"Ceba\",\"Col\",\"Tomàquet triturat\",\"All\",\"Oli d’oliva\",\"Llorer\",\"Pebre vermell\",\"Aigua o brou\"]",
    "306": "[\"Macarrons integrals\",\"Tofu ferm\",\"Bròquil\",\"Tomàquet triturat\",\"Ceba\",\"Llet desnatada\",\"Grana Padano\",\"Oli d’oliva\",\"Salsa de soja\",\"Vinagre\",\"All\",\"Pebre vermell\"]",
    "307": "[\"Arròs\",\"Llom de porc fresc picat\",\"Ous\",\"Tomàquet triturat\",\"Ceba\",\"Carbassó\",\"Oli d’oliva\",\"All\",\"Pebre\"]",
    "308": "[\"Tofu ferm\",\"Albergínia\",\"Arròs\",\"Midó de blat de moro\",\"Oli d’oliva\",\"Salsa de soja\",\"Llima\",\"All\",\"Gingebre\",\"Pebre vermell\"]",
    "309": "[\"Patata\",\"Ous\",\"Clares pasteuritzades\",\"Ceba\",\"Oli d’oliva\",\"Olives\",\"Pebre\",\"Tomàquet\",\"Vinagre o suc de llimona\",\"Tonyina\"]",
    "310": "[\"Tofu ferm\",\"Patata\",\"Ceba\",\"Verdures variades\",\"Brou desgreixat\",\"All\",\"Oli d’oliva\",\"Salsa de soja\",\"Gingebre\",\"Pebre vermell\"]",
    "401": "[\"Poma\",\"Aigua\",\"Canyella\"]",
    "402": "[\"Pera\",\"Aigua\",\"Canyella\"]"
};
    const changes = {
        5: 'Canvia la salsa de soja per la mateixa quantitat de tamari o salsa de soja etiquetats «sense gluten». Revisa també el tofu.',
        7: 'Fes servir dues llesques de pa etiquetat «sense gluten». Si el torres, evita una torradora amb restes de pa amb gluten.',
        9: 'Canvia els 160 g de pasta integral per 160 g de pasta etiquetada «sense gluten», de blat de moro o arròs. Cou-la segons el paquet.',
        103: 'Canvia la cullerada de salsa de soja per una de tamari o salsa de soja etiquetats «sense gluten». Revisa tofu i espècies.',
        104: 'El seitan conté gluten: substitueix els 250 g per 250 g de tofu ferm senzill, amb etiqueta revisada. Daura el tofu a part i afegeix-lo a les verdures al final; el temps pot variar.',
        106: 'Substitueix els 100 g de pa integral per 100 g de pa etiquetat «sense gluten». La paellada es prepara igual.',
        108: 'Fes servir una cullerada de tamari o salsa de soja etiquetats «sense gluten», en lloc de la soja habitual. Revisa el tofu i les espècies.',
        205: 'Canvia la cullerada de soja per tamari o soja etiquetats «sense gluten». Revisa també el tofu i el midó de blat de moro.',
        206: 'Acompanya la truita amb 100 g de pa etiquetat «sense gluten», en lloc del pa integral habitual.',
        208: 'Substitueix la salsa de soja per la mateixa quantitat de tamari o soja etiquetats «sense gluten».',
        301: 'Utilitza 140 g de noodles d’arròs etiquetats «sense gluten» i una cullerada de tamari o soja també etiquetats «sense gluten». Revisa la crema de cacauet i la resta de salses; cou els noodles segons el paquet.',
        302: 'Tria 200 g de nyoquis etiquetats «sense gluten». Si no en trobes, fes servir 200 g de pasta de blat de moro o arròs etiquetada «sense gluten», cou-la a part segons el paquet i barreja-la amb la crema al final. El temps pot variar.',
        306: 'Canvia els 120 g de macarrons per pasta etiquetada «sense gluten» i els 10 ml de soja per 10 ml de tamari o soja etiquetats «sense gluten». Revisa el tofu, les espècies i el formatge; cou la pasta segons el paquet.',
        308: 'Canvia els 15 ml de soja per 15 ml de tamari o soja etiquetats «sense gluten». Revisa el tofu i el midó de blat de moro, així com els condiments.',
        310: 'Canvia els 10 ml de soja per 10 ml de tamari o soja etiquetats «sense gluten». Revisa també el tofu, el brou i les verdures preparades si les compres congelades.'
    };
    const checks = {
        1: 'Peix senzill sense arrebossat ni salses afegides; revisa els condiments.',
        2: 'Revisa les etiquetes dels cigrons cuits i la tonyina.',
        3: 'Base de verdura, ous i oli. Revisa qualsevol condiment o afegit.',
        4: 'Revisa la carn picada preparada, el tomàquet i el formatge ratllat.',
        6: 'Revisa les llenties i les espècies. No hi afegeixis brou o embotits sense comprovar-ne l’etiqueta.',
        8: 'Pollastre senzill sense marinar i all en pols amb etiqueta revisada.',
        10: 'Si utilitzes brou, comprova que sigui sense gluten; també pots fer servir aigua.',
        101: 'Revisa paneer i la barreja garam masala; l’arròs ha de ser senzill, sense preparats afegits.',
        102: 'Revisa els cigrons cuits i el brou, o fes servir aigua.',
        105: 'Lluç sense arrebossat ni preparats afegits; revisa les etiquetes dels congelats.',
        107: 'Salmó senzill sense marinats o salses afegides; revisa condiments i congelats.',
        201: 'Revisa el tofu i el garam masala. Arròs senzill sense condiments afegits.',
        202: 'Revisa llenties cuites, curri i brou; pots substituir el brou per aigua.',
        203: 'Revisa cigrons, tomàquet triturat i espècies.',
        204: 'Revisa mongetes cuites, condiments i brou; l’aigua és una alternativa.',
        207: 'Peix sense arrebossar. Revisa llenties i brou, o utilitza aigua.',
        209: 'Revisa els cigrons cuits, la mozzarella ratllada, el pebre i l’oli en esprai.',
        303: 'Revisa el curri o la cúrcuma i la resta d’espècies; si hi poses brou, també cal revisar-lo.',
        304: 'Revisa mostassa, iogurt, olives i, si n’hi poses, tonyina o cigrons. Els opcionals també compten.',
        401: 'Poma i aigua. Si hi afegeixes canyella o altres complements, revisa’n l’etiqueta.',
        402: 'Pera i aigua. Si hi afegeixes canyella o altres complements, revisa’n l’etiqueta.',
        305: 'Revisa els fasols cuits, el tomàquet, el brou i les espècies. Pots utilitzar aigua en lloc de brou.',
        307: 'Utilitza llom fresc sense preparats afegits i revisa el tomàquet triturat i els condiments.',
        309: 'Revisa les clares pasteuritzades, les olives i els condiments. Per amanir, pots fer servir llimona o vinagre amb etiqueta revisada. Comprova també la tonyina si hi afegeixes aquest opcional.'
    };
    const signature = recipe => JSON.stringify([...(recipe.ingredients || []), ...(recipe.optionalIngredients || [])].map(item => typeof item === 'string' ? item : item.item));
    function review(recipe) {
        if (recipe.custom || !signatures[recipe.id] || signatures[recipe.id] !== signature(recipe)) return {
            status: 'unreviewed', title: 'Gluten · pendent de revisar',
            note: 'Aquesta llista d’ingredients encara no té una revisió específica. No es classifica com a sense gluten. Comprova tots els ingredients, productes i opcionals.'
        };
        if (changes[recipe.id]) return { status: 'adapt', title: 'Adaptació sense gluten', note: changes[recipe.id] };
        return { status: 'ingredients', title: 'Sense ingredients amb gluten · revisa etiquetes', note: checks[recipe.id] };
    }
    return { review, signature, sources: [
        { title: 'FACE · Etiquetes i aliments sense gluten', url: 'https://celiacos.org/recien-diagnosticados/preguntas-frecuentes/' },
        { title: 'Sant Joan de Déu · Evitar el contacte amb gluten a la cuina', url: 'https://escolasalut-ot.sjdhospitalbarcelona.org/es/enfermedades/medidas-higienicas-en-la-alimentacion-celiaca-como-evitar-la-contaminacion-cruzada' }
    ] };
})();
