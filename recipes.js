const defaultRecipes = [
    {
        id: 1,
        title: "Salmó al forn amb verdures",
        description: "Un plat ple d'omega-3 i vitamines, cuinat al forn per mantenir tot el sabor de forma lleugera.",
        difficulty: "Fàcil",
        time: "30 min",
        image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=800&q=80",
        ingredients: [
            { item: "Salmó", qty: "2 lloms" },
            { item: "Carbassó", qty: "1 unitat" },
            { item: "Pebrot vermell", qty: "1 unitat" },
            { item: "Ceba", qty: "1/2 unitat" },
            { item: "Oli d'oliva verge extra", qty: "1 cullerada" },
            { item: "Sal i pebre", qty: "Al gust" }
        ],
        instructions: "1. Preescalfa el forn a 200ºC.\n2. Talla les verdures a tires fines.\n3. Col·loca les verdures a la safata, amaneix-les i forneja 15 minuts.\n4. Posa el salmó a sobre, salpebra i forneja 12-15 minuts més."
    },
    {
        id: 2,
        title: "Amanida de cigrons i tonyina",
        description: "Una opció ràpida, fresca i carregada de proteïna, ideal per emportar-se a la feina o a la platja.",
        difficulty: "Fàcil",
        time: "10 min",
        image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80",
        ingredients: [
            { item: "Cigrons cuits", qty: "200g" },
            { item: "Tonyina al natural", qty: "2 llaunes" },
            { item: "Tomàquets cherry", qty: "10 unitats" },
            { item: "Cogombre", qty: "1/2 unitat" },
            { item: "Ceba tendra", qty: "1/4 unitat" },
            { item: "Oli d'oliva i llimona", qty: "Al gust" }
        ],
        instructions: "1. Renta bé els cigrons si són de pot.\n2. Talla els tomàquets a meitats, el cogombre i la ceba a daus.\n3. Barreja-ho tot en un bol amb la tonyina escorreguda.\n4. Amaneix amb oli, suc de llimona, sal i pebre."
    },
    {
        id: 3,
        title: "Truita de carbassó",
        description: "Una versió més lleugera de la truita de patates clàssica, utilitzant carbassó per aportar suavitat.",
        difficulty: "Mitjana",
        time: "25 min",
        image: "https://images.unsplash.com/photo-1619881589316-56c7f9e6b587?auto=format&fit=crop&w=800&q=80",
        ingredients: [
            { item: "Ous", qty: "4 unitats" },
            { item: "Carbassó", qty: "1 unitat gran" },
            { item: "Ceba", qty: "1 unitat" },
            { item: "Oli d'oliva verge extra", qty: "1 cullerada" },
            { item: "Sal", qty: "Un pessic" }
        ],
        instructions: "1. Talla la ceba ben fina i el carbassó a daus o mitges llunes.\n2. Sofregeix la ceba i després el carbassó fins que estiguin tendres.\n3. Bat els ous i barreja-hi la verdura escorreguda de l'oli.\n4. Qualla la truita a la paella a foc mitjà per les dues bandes."
    },
    {
        id: 4,
        title: "Albergínia farcida de carn",
        description: "Albergínies tendres al forn farcides amb un sofregit casolà de carn picada i verdures.",
        difficulty: "Mitjana",
        time: "50 min",
        image: "https://images.unsplash.com/photo-1599818816823-3db88e583161?auto=format&fit=crop&w=800&q=80",
        ingredients: [
            { item: "Albergínia", qty: "2 unitats" },
            { item: "Carn picada (pollastre o vedella)", qty: "250g" },
            { item: "Ceba", qty: "1/2 unitat" },
            { item: "Tomàquet triturat", qty: "4 cullerades" },
            { item: "Formatge ratllat", qty: "Una mica per gratinar" }
        ],
        instructions: "1. Talla les albergínies per la meitat, fes talls a la polpa i forneja a 200ºC uns 25 min.\n2. Buida-les amb una cullera.\n3. Sofregeix la ceba, la carn i el tomàquet. Afegeix la polpa picada.\n4. Farceix, posa-hi formatge i gratina al forn."
    },
    {
        id: 5,
        title: "Quinoa amb verdures i tofu",
        description: "Plat vegà i complet, combinant la proteïna del tofu i la quinoa amb el cruixent de les verdures saltades.",
        difficulty: "Fàcil",
        time: "35 min",
        image: "https://images.unsplash.com/photo-1623315609348-18eaf3a992cb?auto=format&fit=crop&w=800&q=80",
        ingredients: [
            { item: "Quinoa", qty: "1 tassa" },
            { item: "Tofu ferm", qty: "200g" },
            { item: "Bròquil", qty: "1/2 cap" },
            { item: "Pastanaga", qty: "2 unitats" },
            { item: "Salsa de soja", qty: "2 cullerades" }
        ],
        instructions: "1. Renta la quinoa i bull-la.\n2. Talla el tofu a daus i daura'l a la paella.\n3. Salta les verdures tallades petites.\n4. Barreja-ho tot i amaneix amb la salsa de soja (sense sucre)."
    },
    {
        id: 6,
        title: "Llenties estofades amb verdures",
        description: "El plat de cullera clàssic però només amb verdures, sense embotits, pur 'real food' reconfortant.",
        difficulty: "Fàcil",
        time: "45 min",
        image: "https://images.unsplash.com/photo-1534604973900-c43bad41ea17?auto=format&fit=crop&w=800&q=80",
        ingredients: [
            { item: "Llenties pardines", qty: "200g" },
            { item: "Pastanaga", qty: "2 unitats" },
            { item: "Ceba", qty: "1 unitat" },
            { item: "Pebrot verd", qty: "1/2 unitat" },
            { item: "Tomàquet", qty: "1 unitat" },
            { item: "Pebre vermell dolç", qty: "1 culleradeta" }
        ],
        instructions: "1. Pica la ceba, el pebrot, la pastanaga i el tomàquet.\n2. Fes un bon sofregit amb tot excepte les llenties.\n3. Afegeix el pebre vermell i les llenties netes.\n4. Cobreix d'aigua o brou vegetal i bull a foc lent fins que estiguin tendres (uns 30-40 min)."
    },
    {
        id: 7,
        title: "Tostada d'alvocat i ou poché",
        description: "Esmorzar o sopar ràpid, deliciós i super nutritiu.",
        difficulty: "Mitjana",
        time: "15 min",
        image: "https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?auto=format&fit=crop&w=800&q=80",
        ingredients: [
            { item: "Pa integral (100%)", qty: "2 llesques" },
            { item: "Alvocat madur", qty: "1 unitat" },
            { item: "Ous", qty: "2 unitats" },
            { item: "Llimona", qty: "Unes gotes" },
            { item: "Sal i pebre", qty: "Al gust" }
        ],
        instructions: "1. Xafa l'alvocat amb una forquilla, sal, pebre i unes gotes de llimona.\n2. Torra el pa integral.\n3. Fes els ous poché bullint aigua amb un raig de vinagre i posant-hi l'ou uns 3 minuts.\n4. Munta la torrada amb l'alvocat i l'ou a sobre."
    },
    {
        id: 8,
        title: "Pollastre a la planxa amb moniato",
        description: "Senzill, saciant i amb el toc dolç del moniato al forn.",
        difficulty: "Fàcil",
        time: "35 min",
        image: "https://images.unsplash.com/photo-1598515318246-a59f8a31b4fc?auto=format&fit=crop&w=800&q=80",
        ingredients: [
            { item: "Pit de pollastre", qty: "2 filets" },
            { item: "Moniato", qty: "1 unitat gran" },
            { item: "All en pols", qty: "Al gust" },
            { item: "Oli d'oliva verge extra", qty: "1 cullerada" }
        ],
        instructions: "1. Pela i talla el moniato a bastonets. Forneja'l a 200ºC durant 25-30 minuts amb una mica d'oli i sal.\n2. Amaneix el pollastre amb l'all en pols.\n3. Fes el pollastre a la planxa volta i volta.\n4. Serveix junt."
    },
    {
        id: 9,
        title: "Pasta integral amb pesto d'espinacs",
        description: "Una manera brutal de menjar verdures verdes amagades en una salsa pesto deliciosa.",
        difficulty: "Fàcil",
        time: "20 min",
        image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=800&q=80",
        ingredients: [
            { item: "Pasta integral", qty: "160g" },
            { item: "Espinacs frescos", qty: "2 grapats" },
            { item: "Anous", qty: "1 grapat" },
            { item: "All", qty: "1 dent" },
            { item: "Oli d'oliva i sal", qty: "Al gust" },
            { item: "Formatge parmesà (opcional)", qty: "2 cullerades" }
        ],
        instructions: "1. Bull la pasta segons el fabricant.\n2. A la batedora, posa els espinacs, les anous, l'all, l'oli, la sal i el formatge.\n3. Tritura fins a obtenir una salsa (afegeix una miqueta d'aigua de cocció de la pasta si queda espès).\n4. Barreja la salsa amb la pasta calenta."
    },
    {
        id: 10,
        title: "Cremeta de carbassa i pastanaga",
        description: "Sopar lleuger, calentet per a l'hivern i molt fàcil de digerir.",
        difficulty: "Fàcil",
        time: "35 min",
        image: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=800&q=80",
        ingredients: [
            { item: "Carbassa", qty: "500g" },
            { item: "Pastanaga", qty: "3 unitats" },
            { item: "Pebrotes (opcional)", qty: "Una mica" },
            { item: "Ceba", qty: "1 unitat" },
            { item: "Brou de verdures o aigua", qty: "Fins cobrir" }
        ],
        instructions: "1. Talla la ceba i sofregeix-la a l'olla amb una mica d'oli.\n2. Pela i talla la carbassa i la pastanaga, i afegeix-les a l'olla.\n3. Cobreix-ho d'aigua o brou i bull-ho uns 20 minuts fins que estigui tot molt tou.\n4. Tritura fins que quedi una crema fina. Salpebra."
    }
];

// Recull de postres independent dels dinars i sopars del menú.
const dessertRecipes = [
    {
        "id": 401,
        "title": "Poma al microones",
        "description": "Postres de fruita calenta, senzilles i sense sucre afegit.",
        "collection": "mine",
        "category": "dessert",
        "emoji": "\ud83c\udf4e",
        "difficulty": "Fàcil",
        "time": "7 min",
        "totalMinutes": 7,
        "servings": 1,
        "seasons": [
            "Hivern",
            "Primavera",
            "Estiu",
            "Tardor"
        ],
        "mealTypes": [
            "Postres"
        ],
        "tags": [
            "Postres",
            "Microones"
        ],
        "ingredients": [
            {
                "item": "Poma",
                "qty": "1 unitat"
            },
            {
                "item": "Aigua",
                "qty": "1 cullerada"
            }
        ],
        "optionalIngredients": [
            {
                "item": "Canyella",
                "qty": "Al gust"
            }
        ],
        "instructions": "1. Renta la poma, talla-la per la meitat i retira el cor i les llavors. Deixa-hi la pell si t'agrada.\n2. Posa les meitats en un recipient apte per a microones amb una cullerada d'aigua. Tapa'l amb una tapa apta, deixant sortir el vapor.\n3. Cou a 800 W durant 3 minuts. Comprova la textura amb una forquilla i continua en tandes de 30 segons fins que sigui tendra; el temps depèn de la mida, la maduresa i el microones.\n4. Deixa reposar 1 minut i destapa amb cura pel vapor calent. Si vols, afegeix-hi canyella i serveix-la tèbia."
    },
    {
        "id": 402,
        "title": "Pera al microones",
        "description": "Postres de fruita calenta, senzilles i sense sucre afegit.",
        "collection": "mine",
        "category": "dessert",
        "emoji": "\ud83c\udf50",
        "difficulty": "Fàcil",
        "time": "6 min",
        "totalMinutes": 6,
        "servings": 1,
        "seasons": [
            "Hivern",
            "Primavera",
            "Estiu",
            "Tardor"
        ],
        "mealTypes": [
            "Postres"
        ],
        "tags": [
            "Postres",
            "Microones"
        ],
        "ingredients": [
            {
                "item": "Pera",
                "qty": "1 unitat"
            },
            {
                "item": "Aigua",
                "qty": "1 cullerada"
            }
        ],
        "optionalIngredients": [
            {
                "item": "Canyella",
                "qty": "Al gust"
            }
        ],
        "instructions": "1. Renta la pera, talla-la per la meitat i retira el cor i les llavors. Deixa-hi la pell si t'agrada.\n2. Posa les meitats en un recipient apte per a microones amb una cullerada d'aigua. Tapa'l amb una tapa apta, deixant sortir el vapor.\n3. Cou a 800 W durant 2 minuts. Comprova la textura amb una forquilla i continua en tandes de 30 segons fins que sigui tendra; el temps depèn de la mida, la maduresa i el microones.\n4. Deixa reposar 1 minut i destapa amb cura pel vapor calent. Si vols, afegeix-hi canyella i serveix-la tèbia."
    }
];
