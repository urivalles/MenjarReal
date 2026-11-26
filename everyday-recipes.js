const everydayRecipes = (() => {
    const allSeasons = ['Hivern', 'Primavera', 'Estiu', 'Tardor'];
    const complete = ['carbs', 'protein', 'veg'];
    const fishSafety = 'Cou el peix fins que el centre arribi a 63 °C o la carn sigui opaca i se separi fàcilment amb una forquilla.';
    const fish = [
        {
            id: 701, title: 'Salmó a la planxa amb patata i amanida', totalMinutes: 16,
            proteinVariety: 'salmo', equipment: ['Paella', 'Microones'],
            description: 'Tres coses senzilles al plat. La patata es cou mentre fas l’amanida i el salmó.',
            ingredients: [['Salmó', '140 g'], ['Patata', '200 g'], ['Enciam', '75 g'], ['Tomàquet', '100 g'],
                ['Oli d’oliva verge extra', '10 g'], ['Llimona', '¼ unitat'], ['Pebre', 'Al gust']],
            steps: ['Talla la patata a daus. Posa-la en un recipient apte per a microones amb un rajolí d’aigua i tapa’l amb una tapa ventilada. Cou-la 6–8 minuts a 800 W, remenant a mitja cocció, fins que sigui tendra.',
                'Renta l’enciam i talla el tomàquet. Amaneix-los amb la meitat de l’oli i una mica de llimona.',
                'Eixuga el salmó i cuina’l en una paella amb la resta de l’oli. Comença pel costat de la pell i gira’l a mitja cocció. Serveix-lo amb la patata i l’amanida.']
        },
        {
            id: 702, title: 'Lluç al vapor amb arròs integral i mongeta verda', totalMinutes: 18,
            proteinVariety: 'lluc', equipment: ['Cassola amb tapa', 'Microones'],
            description: 'La mongeta i el lluç es couen a la mateixa cassola. L’arròs integral ja cuit estalvia temps.',
            ingredients: [['Lluç descongelat', '150 g'], ['Mongeta verda congelada', '200 g'], ['Arròs integral cuit', '150 g'],
                ['Oli d’oliva verge extra', '10 g'], ['Llimona', '¼ unitat'], ['Julivert', 'Al gust']],
            steps: ['Posa la mongeta verda amb un dit d’aigua en una cassola tapada i cou-la uns 5 minuts.',
                'Col·loca el lluç sobre les mongetes. Tapa i deixa que es cogui al vapor uns 5–7 minuts, segons el gruix.',
                'Escalfa l’arròs segons l’envàs i serveix-lo amb el lluç i les mongetes. Acaba amb oli, llimona i julivert.']
        },
        {
            id: 703, title: 'Verat a la planxa amb patata i pebrot escalivat', totalMinutes: 16,
            proteinVariety: 'verat', equipment: ['Paella', 'Microones'],
            description: 'El pebrot escalivat de pot fa que aquest plat de peix blau es pugui fer qualsevol dia.',
            ingredients: [['Filets de verat', '140 g'], ['Patata', '200 g'], ['Pebrot escalivat de pot', '150 g escorregut'],
                ['Oli d’oliva verge extra', '10 g'], ['Vinagre de vi', '5 ml'], ['Julivert', 'Al gust']],
            steps: ['Talla la patata a daus i cou-la al microones amb un rajolí d’aigua, en un recipient apte i amb la tapa ventilada, durant 6–8 minuts a 800 W o fins que sigui tendra.',
                'Escorre el pebrot i amaneix-lo amb la meitat de l’oli, el vinagre i el julivert.',
                'Eixuga els filets i cuina’ls amb la resta de l’oli en una paella ben calenta. Comença pel costat de la pell i gira’ls quan es desprenguin fàcilment. Serveix amb la patata i el pebrot.']
        },
        {
            id: 704, title: 'Amanida de sardines, mongeta blanca i tomàquet', totalMinutes: 8,
            proteinVariety: 'sardina', equipment: ['Bol'],
            description: 'Plat de rebost sense cocció. La mongeta blanca hi fa de base i les sardines hi fan de peix blau.',
            pantry: true,
            ingredients: [['Sardines en conserva', '90 g escorregudes'], ['Mongeta blanca cuita', '160 g escorreguda'],
                ['Tomàquet', '150 g'], ['Pebrot escalivat de pot', '50 g escorregut'], ['Oli d’oliva verge extra', '5 g'],
                ['Vinagre de vi', '5 ml'], ['Julivert', 'Al gust']],
            steps: ['Renta la mongeta de pot i deixa-la escórrer. Talla el tomàquet i el pebrot.',
                'Barreja-ho en un bol i afegeix les sardines. Amaneix amb l’oli, el vinagre i el julivert.'],
            variations: ['Quan el tomàquet fresc té poc gust, fes servir més pebrot escalivat i un cogombre, o tomàquet de pot ben escorregut.']
        },
        {
            id: 705, title: 'Bacallà amb cigrons i espinacs en una paella', totalMinutes: 18,
            proteinVariety: 'bacalla', equipment: ['Paella amb tapa'],
            description: 'Una paella, llegum de pot i espinacs congelats. El bacallà es cou damunt del guisat.',
            ingredients: [['Bacallà fresc o descongelat', '150 g'], ['Cigrons cuits', '150 g escorreguts'],
                ['Espinacs congelats', '150 g'], ['Tomàquet triturat', '80 g'], ['All', '1 gra'],
                ['Oli d’oliva verge extra', '10 g'], ['Pebre vermell dolç', 'Al gust']],
            steps: ['Pica l’all i escalfa’l amb l’oli a foc mitjà uns segons. Afegeix-hi el tomàquet, els espinacs i el pebre vermell. Cou-ho uns 6 minuts o fins que els espinacs siguin tous.',
                'Afegeix-hi els cigrons esbandits i un rajolí d’aigua si la barreja queda seca. Col·loca el bacallà a sobre.',
                'Tapa la paella i cou uns 6–8 minuts a foc suau, segons el gruix del bacallà.']
        },
        {
            id: 706, title: 'Truita de riu amb cuscús integral i carbassó', totalMinutes: 16,
            proteinVariety: 'truita', equipment: ['Paella', 'Bol'],
            description: 'El cuscús s’hidrata mentre es cou el carbassó. El peix es fa a la mateixa paella.',
            seasons: ['Primavera', 'Estiu', 'Tardor'],
            ingredients: [['Filet de truita de riu', '150 g'], ['Cuscús integral', '60 g'], ['Carbassó', '200 g'],
                ['Oli d’oliva verge extra', '10 g'], ['Llimona', '¼ unitat'], ['Julivert', 'Al gust']],
            steps: ['Hidrata el cuscús amb aigua molt calenta segons el paquet. Tapa el bol i, al cap d’uns minuts, separa el gra amb una forquilla.',
                'Talla el carbassó a mitges llunes fines i salta’l amb la meitat de l’oli uns 5–6 minuts.',
                'Retira el carbassó. Cuina el filet amb l’altre mig raig d’oli, primer per la pell. Serveix-ho amb el cuscús, llimona i julivert.']
        },
        {
            id: 707, title: 'Seitons al forn amb patata i tomàquet', totalMinutes: 20,
            proteinVariety: 'seito', equipment: ['Forn', 'Microones'],
            description: 'Amb seitons ja nets, la feina és tallar la verdura i muntar la safata.',
            seasons: ['Primavera', 'Estiu', 'Tardor'],
            ingredients: [['Seitons nets', '150 g'], ['Patata', '200 g'], ['Tomàquets cherry', '175 g'],
                ['Oli d’oliva verge extra', '10 g'], ['Llimona', '¼ unitat'], ['Orenga', 'Al gust']],
            steps: ['Preescalfa el forn a 220 °C. Talla la patata a rodanxes fines i cou-la al microones amb una mica d’aigua i tapa ventilada uns 5–6 minuts a 800 W.',
                'Posa la patata i els tomàquets tallats per la meitat a la safata. Col·loca-hi els seitons i reparteix-hi l’oli i l’orenga.',
                'Enforna-ho uns 6–8 minuts. Acaba amb unes gotes de llimona.']
        },
        {
            id: 708, title: 'Orada a la paella amb moniato al microones', totalMinutes: 17,
            proteinVariety: 'orada', equipment: ['Paella', 'Microones'],
            parts: ['carbs', 'protein'],
            description: 'Un filet d’orada i moniato per completar la verdura que ja tens feta.',
            balanceNote: 'Serveix-ho amb la guarnició de verdura que tinguis a mà, com albergínia al microones o bròquil amb llimona.',
            ingredients: [['Filet d’orada', '150 g'], ['Moniato', '200 g'], ['Oli d’oliva verge extra', '10 g'],
                ['Llimona', '¼ unitat'], ['Pebre', 'Al gust']],
            steps: ['Pela el moniato i talla’l a daus. Cou-lo al microones en un recipient apte amb un rajolí d’aigua i la tapa ventilada, uns 6–8 minuts a 800 W. Comprova que sigui tendre.',
                'Eixuga el filet i cuina’l en una paella calenta amb l’oli, primer per la pell i després per l’altra banda. Amaneix amb llimona i pebre.']
        }
    ].map(recipe => ({
        collection: 'mine', types: ['lunch', 'dinner'], parts: complete, protein: 'fish', emoji: '🐟',
        balanceNote: 'Plat amb una font de proteïna, una base d’hidrats i una ració de verdura.',
        ...recipe,
        steps: recipe.id === 704 ? recipe.steps : [...recipe.steps, fishSafety]
    }));

    const vegetables = [
        {
            id: 711, title: 'Albergínia al microones amb llimona i comí', totalMinutes: 10,
            seasons: ['Estiu', 'Tardor'], equipment: ['Microones'],
            description: 'Albergínia melosa amb un amaniment de llimona i comí. Només embrutes un recipient.',
            ingredients: [['Albergínia', '250 g'], ['Oli d’oliva verge extra', '5 g'], ['Llimona', '¼ unitat'], ['Comí', 'Al gust']],
            steps: ['Talla l’albergínia a daus d’uns 2 cm. Posa-la en un recipient apte per a microones amb una cullerada d’aigua i tapa’l deixant sortir el vapor.',
                'Cou-la 5–7 minuts a 800 W. Remena a mitja cocció i allarga-la de minut en minut si encara ofereix resistència quan la punxes.',
                'Obre la tapa amb cura, escorre l’aigua que quedi i amaneix amb oli, llimona i comí.']
        },
        {
            id: 712, title: 'Bròquil al microones amb llimona i pebre', totalMinutes: 8, equipment: ['Microones'],
            ingredients: [['Bròquil', '200 g'], ['Oli d’oliva verge extra', '5 g'], ['Llimona', '¼ unitat'], ['Pebre negre', 'Al gust']],
            steps: ['Separa el bròquil en ramells i talla la part tendra del tronc ben fina. Posa-ho en un recipient apte amb dues cullerades d’aigua i una tapa ventilada.',
                'Cou-ho 4–5 minuts a 800 W. Comprova el punt i, si cal, dona-li un minut més. Escorre-ho i amaneix amb oli, llimona i pebre.'],
            variations: ['Pots fer servir bròquil congelat. Segueix el temps de cocció del paquet.']
        },
        {
            id: 713, title: 'Mongeta verda saltada amb all i ametlles', totalMinutes: 12, equipment: ['Paella amb tapa'],
            ingredients: [['Mongeta verda congelada', '200 g'], ['All', '1 gra'], ['Ametlles laminades sense sal', '10 g'], ['Oli d’oliva verge extra', '5 g']],
            steps: ['Posa les mongetes a la paella amb un rajolí d’aigua, tapa-la i cou-les 5–7 minuts, fins que siguin tendres.',
                'Destapa i deixa evaporar l’aigua. Afegeix-hi l’oli, l’all picat i les ametlles. Salta-ho uns 2 minuts, remenant perquè l’all no es cremi.']
        },
        {
            id: 714, title: 'Coliflor i pastanaga al microones amb pebre vermell', totalMinutes: 11, equipment: ['Microones'],
            ingredients: [['Coliflor', '140 g'], ['Pastanaga', '80 g'], ['Oli d’oliva verge extra', '5 g'],
                ['Pebre vermell dolç', 'Al gust'], ['Vinagre de poma', '5 ml']],
            steps: ['Talla la pastanaga a rodanxes fines i la coliflor en ramells petits. Posa-ho en un recipient apte amb un rajolí d’aigua i una tapa ventilada.',
                'Cou-ho 6–8 minuts a 800 W, remenant a mitja cocció. Escorre-ho i amaneix amb oli, vinagre i pebre vermell.']
        },
        {
            id: 715, title: 'Xampinyons saltats amb all i julivert', totalMinutes: 10, equipment: ['Paella'],
            ingredients: [['Xampinyons', '220 g'], ['All', '1 gra'], ['Oli d’oliva verge extra', '5 g'], ['Julivert', 'Al gust']],
            steps: ['Neteja i talla els xampinyons a quarts. Salta’ls en una paella ampla amb l’oli a foc mitjà-alt 5–7 minuts, fins que perdin aigua i es daurin.',
                'Afegeix-hi l’all picat durant l’últim minut. Apaga el foc i posa-hi julivert.']
        },
        {
            id: 716, title: 'Carbassó a la planxa amb herbes i llimona', totalMinutes: 10,
            seasons: ['Primavera', 'Estiu', 'Tardor'], equipment: ['Paella'],
            ingredients: [['Carbassó', '220 g'], ['Oli d’oliva verge extra', '5 g'], ['Llimona', '¼ unitat'], ['Farigola', 'Al gust']],
            steps: ['Talla el carbassó a rodanxes d’un dit prim. Barreja’l amb l’oli i daura’l en una sola capa a la paella calenta, 2–3 minuts per banda.',
                'Enretira’l del foc i amaneix-lo amb farigola i unes gotes de llimona.']
        },
        {
            id: 717, title: 'Amanida cruixent de col i poma', totalMinutes: 8,
            seasons: ['Tardor', 'Hivern', 'Primavera'], equipment: ['Bol'],
            ingredients: [['Col blanca', '150 g'], ['Poma', '80 g'], ['Oli d’oliva verge extra', '5 g'],
                ['Vinagre de poma', '5 ml'], ['Mostassa de Dijon', '5 g']],
            steps: ['Talla la col a tires fines i la poma a bastonets.',
                'Barreja l’oli, el vinagre i la mostassa. Amaneix la col, prem-la suaument amb les mans perquè s’estovi una mica i afegeix-hi la poma.']
        },
        {
            id: 718, title: 'Espinacs saltats amb all i llimona', totalMinutes: 8, equipment: ['Paella'],
            ingredients: [['Espinacs frescos', '200 g'], ['All', '1 gra'], ['Oli d’oliva verge extra', '5 g'], ['Llimona', '¼ unitat']],
            steps: ['Escalfa l’all laminat amb l’oli a foc mitjà fins que faci olor.',
                'Afegeix els espinacs rentats en dos cops. Remena 3–4 minuts, fins que s’estovin i s’evapori l’aigua. Acaba amb un raig de llimona.']
        }
    ].map(recipe => ({ collection: 'recommended', types: ['side'], parts: ['veg'], emoji: '🥦', ...recipe }));

    return [...fish, ...vegetables].map(({ ingredients, steps, ...recipe }) => ({
        difficulty: 'Fàcil', sourceName: 'MenjarReal', servings: 1, seasons: allSeasons,
        ...recipe,
        time: `${recipe.totalMinutes} min`,
        ingredients: ingredients.map(([item, qty]) => ({ item, qty })),
        instructions: steps.map((step, index) => `${index + 1}. ${step}`).join('\n')
    }));
})();
