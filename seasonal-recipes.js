// Fotografies reals de referencia. Credits i variants visibles a cada fitxa.
const recipePhotos = {
  "101": {
    "image": "photos/recipe-101.jpg",
    "photoCredit": {
      "author": "Miansari66",
      "source": "https://commons.wikimedia.org/wiki/File:Palak_Paneer.JPG",
      "license": "CC0",
      "licenseUrl": "https://creativecommons.org/publicdomain/zero/1.0/deed.en",
      "note": "Espinacs especiats amb paneer; la nostra versi? se serveix amb arr?s."
    }
  },
  "102": {
    "image": "photos/recipe-102.jpg",
    "photoCredit": {
      "author": "Senjuti Dey",
      "source": "https://commons.wikimedia.org/wiki/File:Egg_soup_restaurant_style.jpg",
      "license": "CC BY-SA 4.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
      "note": "Sopa de verdures amb ou; la nostra versi? tamb? porta cigrons."
    }
  },
  "103": {
    "image": "photos/recipe-103.jpg",
    "photoCredit": {
      "author": "Miscellaneous contributor",
      "source": "https://commons.wikimedia.org/wiki/File:Baked_Tofu_with_Potatoes_and_Broccoli.jpg",
      "license": "CC BY-SA 4.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
      "note": "Tofu al forn amb patata i br?quil."
    }
  },
  "104": {
    "image": "photos/recipe-104.jpg",
    "photoCredit": {
      "author": "Einladung_zum_Essen",
      "source": "https://commons.wikimedia.org/wiki/File:Seitan-vegetables-Pixabay.jpg",
      "license": "CC0",
      "licenseUrl": "https://creativecommons.org/publicdomain/zero/1.0/deed.en",
      "note": "Seitan amb verdures; la guarnici? pot variar."
    }
  },
  "105": {
    "image": "photos/recipe-105.jpg",
    "photoCredit": {
      "author": "Tiia Monto",
      "source": "https://commons.wikimedia.org/wiki/File:Baked_cod_fillet.jpg",
      "license": "CC BY-SA 4.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
      "note": "Filets de peix blanc al forn; la nostra versi? ?s de llu? amb guarnici?."
    }
  },
  "106": {
    "image": "photos/recipe-106.jpg",
    "photoCredit": {
      "author": "Yaron Koren",
      "source": "https://commons.wikimedia.org/wiki/File:Green_shakshuka_from_Oren%27s_Hummus.jpg",
      "license": "CC0",
      "licenseUrl": "https://creativecommons.org/publicdomain/zero/1.0/deed.en",
      "note": "Ous amb verdures verdes; presentaci? de refer?ncia."
    }
  },
  "107": {
    "image": "photos/recipe-107.jpg",
    "photoCredit": {
      "author": "Petar Milošević",
      "source": "https://commons.wikimedia.org/wiki/File:Grilled_salmon.jpg",
      "license": "CC BY-SA 4.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
      "note": "Salm? a la planxa amb patates; la nostra guarnici? inclou xampinyons."
    }
  },
  "108": {
    "image": "photos/recipe-108.jpg",
    "photoCredit": {
      "author": "Josefine Stenudd from Gothenburg, Sweden",
      "source": "https://commons.wikimedia.org/wiki/File:Marinated_tofu,_broccoli,_potatoes,_onions_(3084642155).jpg",
      "license": "CC BY 2.0",
      "licenseUrl": "https://creativecommons.org/licenses/by/2.0",
      "note": "Tofu marinat amb br?quil, patata i ceba."
    }
  },
  "201": {
    "image": "photos/recipe-201.jpg",
    "photoCredit": {
      "author": "BrokenSphere",
      "source": "https://commons.wikimedia.org/wiki/File:Tofu_with_spinach_and_mushrooms.JPG",
      "license": "CC BY-SA 3.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
      "note": "Tofu amb espinacs i bolets; refer?ncia dels ingredients, amb una preparaci? diferent del saag."
    }
  },
  "202": {
    "image": "photos/recipe-202.jpg",
    "photoCredit": {
      "author": "Whoisjohngalt",
      "source": "https://commons.wikimedia.org/wiki/File:Bowl_of_lentil_soup_with_green_and_red_lentils.jpg",
      "license": "CC BY-SA 4.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
      "note": "Guisat de llenties; la nostra variant inclou carbassa i espinacs."
    }
  },
  "203": {
    "image": "photos/recipe-203.jpg",
    "photoCredit": {
      "author": "Kari Sullivan from Austin, TX",
      "source": "https://commons.wikimedia.org/wiki/File:Spinach-Chickpea_Curry_(3117324894).jpg",
      "license": "CC BY 2.0",
      "licenseUrl": "https://creativecommons.org/licenses/by/2.0",
      "note": "Cigrons amb espinacs; la nostra versi? tamb? porta xampinyons."
    }
  },
  "204": {
    "image": "photos/recipe-204.jpg",
    "photoCredit": {
      "author": "Thriving Vegetarian",
      "source": "https://commons.wikimedia.org/wiki/File:Collard_Greens_and_White_Bean_Soup.jpg",
      "license": "CC BY 2.0",
      "licenseUrl": "https://creativecommons.org/licenses/by/2.0",
      "note": "Sopa de mongeta blanca i fulles verdes; la nostra variant porta porro."
    }
  },
  "205": {
    "image": "photos/recipe-205.jpg",
    "photoCredit": {
      "author": "Miscellaneous contributor",
      "source": "https://commons.wikimedia.org/wiki/File:Baked_Tofu_with_Broccoli_and_Rice.jpg",
      "license": "CC BY-SA 4.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
      "note": "Tofu amb br?quil i arr?s; la nostra versi? afegeix bolets."
    }
  },
  "206": {
    "image": "photos/recipe-206.jpg",
    "photoCredit": {
      "author": "Cajsa Lilliehook from Portland",
      "source": "https://commons.wikimedia.org/wiki/File:Hungarian_Mushroom_Omelette_(8414795810).jpg",
      "license": "CC BY-SA 2.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.0",
      "note": "Truita de bolets; la nostra recepta afegeix espinacs i no porta salsa cremosa."
    }
  },
  "207": {
    "image": "photos/recipe-207.jpg",
    "photoCredit": {
      "author": "Mack Male from Edmonton, AB, Canada",
      "source": "https://commons.wikimedia.org/wiki/File:Baked_Cod_%26_Lentils_(38881075884).jpg",
      "license": "CC BY-SA 2.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.0",
      "note": "Peix blanc al forn amb llenties; la nostra versi? afegeix coliflor i no porta crosta."
    }
  },
  "208": {
    "image": "photos/recipe-208.jpg",
    "photoCredit": {
      "author": "HaJunkiyada",
      "source": "https://commons.wikimedia.org/wiki/File:Liat_Portal_for_Foodie_Disorder_-_Grilled_chicken_with_rice_and_vegetables.jpg",
      "license": "CC BY-SA 4.0",
      "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
      "note": "Pollastre amb arr?s i verdures; la nostra versi? fa servir pit i br?quil."
    }
  },
  "301": {
    "image": "photos/recipe-301.jpg",
    "photoCredit": {
      "author": "Karen and Brad Emerson",
      "source": "https://commons.wikimedia.org/wiki/File:Peanut_noodles_(4260867491).jpg",
      "license": "CC BY 2.0",
      "licenseUrl": "https://creativecommons.org/licenses/by/2.0",
      "note": "Noodles amb cacauet; la foto no inclou l?ou ferrat."
    }
  }
};

// Preparacions pròpies adaptades a les preferències personals. Les fonts són
// inspiració culinària: els seus càlculs nutricionals no s'apliquen a les variants.
const recipeSources = {
    saag: { title: 'Elena Silcock · Good Food: Saag paneer', url: 'https://www.bbcgoodfoodme.com/recipes/saag-paneer/' },
    tofuOven: { title: 'Cookie and Kate: Crispy baked tofu', url: 'https://cookieandkate.com/how-to-make-crispy-baked-tofu/' },
    winterSoup: { title: 'Sara Buenfeld · Good Food: Winter vegetable & lentil soup', url: 'https://www.bbcgoodfood.com/recipes/winter-vegetable-lentil-soup' },
    tofuAir: { title: "Maggie Zhu · Omnivore’s Cookbook: Air fryer tofu", url: 'https://omnivorescookbook.com/air-fryer-tofu-recipe/' },
    chips: { title: 'Lulu Grimes · Good Food: Air-fryer chips', url: 'https://www.bbcgoodfood.com/recipes/air-fried-chips' },
    fish: { title: 'Diabetes UK: Fish traybake with cauliflower and lentils', url: 'https://www.diabetes.org.uk/guide-to-diabetes/recipes/fish-traybake-cauliflower-and-lentils' },
    chickpeas: { title: 'Plant Powered Metro New York: Chickpea spinach stew', url: 'https://plantpoweredmetrony.org/recipes/chickpea-spinach-stew/' },
    lentils: { title: 'Esther Clark · Good Food: Curried spinach & lentil soup', url: 'https://www.bbcgoodfood.com/recipes/curried-spinach-lentil-soup' },
    beans: { title: 'California Olive Ranch: White bean, leek and kale soup', url: 'https://www.californiaoliveranch.com/recipes/white-bean-leek-and-kale-soup' },
    mapo: { title: 'Ching-He Huang · Good Food: Mushroom mapo tofu', url: 'https://www.bbcgoodfood.com/recipes/mushroom-mapo-tofu' },
    omelette: { title: 'Good Food: Mushroom omelette', url: 'https://www.bbcgoodfood.com/recipes/1744/cheesy-mushroom-omelette' },
    chicken: { title: 'Sara Buenfeld · Good Food: Healthy chicken stir-fry', url: 'https://www.bbcgoodfood.com/recipes/healthy-chicken-stir-fry' },
    peanutNoodles: { title: 'University of Maryland Extension: Easy Peanut Noodles', url: 'https://extension.umd.edu/programs/family-consumer-sciences/snap-ed/eat-smart/recipes/easy-peanut-noodles' },
    peanutSauce: { title: 'Meghan Splawn · The Kitchn: Creamy Peanut Sauce', url: 'https://www.thekitchn.com/how-to-make-easy-creamy-peanut-sauce-246266' },
    maydenCream: { title: 'MaydenFit · Crema al curri amb pollastre (font indicada per l’usuari)', url: 'https://www.youtube.com/watch?v=g_bthu9MhgI' }
};

function seasonalRecipe(data) {
    return {
        difficulty: 'Fàcil', servings: 2, seasons: ['Tardor', 'Hivern'],
        mealTypes: ['Dinar', 'Sopar'], sourceChecked: '2026-11-02',
        ...data,
        time: `${data.totalMinutes} min`,
        ingredients: data.ingredients.map(([item, qty]) => ({ item, qty })),
        instructions: data.steps.map((step, index) => `${index + 1}. ${step}`).join('\n')
    };
}

const seasonalRecipes = [
    seasonalRecipe({
        id: 301, title: 'Noodles amb salsa de cacauet i ou ferrat', collection: 'mine', emoji: '🍜', pantry: true,
        description: 'Per quan no tens res preparat: noodles amb salsa cremosa de rebost i un ou ferrat per persona.',
        seasons: ['Hivern', 'Primavera', 'Estiu', 'Tardor'], sourceChecked: '2026-11-03',
        totalMinutes: 15, activeMinutes: 8, equipment: ['Olla', 'Bol', 'Paella'],
        tags: ['Rebost', 'Nevera buida', 'Vegetarià', 'Amb ou'], sourceIds: ['peanutNoodles', 'peanutSauce'],
        ingredients: [['Noodles secs', '140 g'], ['Crema de cacauet 100%', '2 cullerades'], ['Salsa de soja baixa en sal', '1 cullerada'], ['Oli de sèsam torrat', '1 culleradeta'], ['Vinagre d’arròs sense sucre afegit', '1 cullerada'], ['Aigua calenta', '60 ml'], ['Ous', '2 unitats'], ['Oli d’oliva verge extra', '1 culleradeta']],
        steps: ['Posa aigua a bullir i cou els noodles el temps que indiqui el paquet. Si no en tens, fes servir espaguetis; el temps total pot variar.', 'Mentrestant, barreja al bol la crema de cacauet, la soja, l’oli de sèsam i el vinagre. Incorpora els 60 ml d’aigua calenta a poc a poc, remenant fins que la salsa quedi llisa.', 'Escalfa una paella antiadherent amb l’oli d’oliva i fes-hi els dos ous ferrats, fins que la clara qualli. Pots tapar-la breument perquè es coguin per sobre.', 'Reserva una mica d’aigua de cocció i escorre els noodles. Barreja’ls amb la salsa; afegeix un raig més d’aigua si queda massa espessa.', 'Reparteix en dos bols i posa un ou ferrat damunt de cadascun. Si et ve de gust, acaba amb all en pols, gingebre en pols o bitxo: són opcionals.'],
        balanceNote: 'Plat de recurs amb noodles, salsa de cacauet i un ou ferrat per persona. Si en tens, completa’l amb verdura congelada o pastanaga; aquests extres no són obligatoris ni entren a la compra de la versió bàsica.',
        variations: ['Si tens llima o llimona, pots substituir el vinagre per una cullerada de suc i ajustar-ho al gust.', 'Amb congelador: bull uns pèsols o edamame amb els noodles seguint el temps del paquet.', 'Amb alguna cosa a la nevera: afegeix pastanaga ratllada o tofu.', 'Per a una persona: 70 g de noodles, 1 cullerada de crema de cacauet, 1/2 cullerada de soja, 1/2 culleradeta d’oli de sèsam, 1/2 cullerada de vinagre, 30 ml d’aigua, 1 ou i 1/2 culleradeta d’oli d’oliva per fregir-lo.'],
        batchNote: 'No necessita preparació prèvia. Guarda noodles, crema de cacauet, soja, oli de sèsam i vinagre d’arròs per tenir aquesta opció a mà; conserva cada producte segons l’etiqueta.',
        adaptationNote: 'Proposta personal de l’usuari, adaptada a dues racions a partir de Maryland Extension i The Kitchn, amb ou ferrat afegit per petició seva. Sense sucre ni mel afegits, amb oli mesurat i vinagre com a alternativa de rebost a la llima. Temps orientatiu; pendent de prova casolana.'
    }),
    seasonalRecipe({
        id: 101, title: 'Saag paneer fàcil amb espinacs', collection: 'mine', emoji: '🥬',
        description: 'La teva proposta índia: espinacs especiats i paneer, amb oli d’oliva i sense nata ni mantega.',
        totalMinutes: 30, activeMinutes: 20, equipment: ['Paella', 'Cassó'],
        tags: ['Vegetarià', 'Amb formatge'], sourceIds: ['saag'],
        ingredients: [['Espinacs', '500 g, frescos o congelats descongelats'], ['Paneer', '200 g'], ['Ceba', '1 petita'], ['All', '1 gra'], ['Gingebre', '1 tros d’1 cm'], ['Garam masala', '1 culleradeta'], ['Arròs basmati', '100 g en cru'], ['Oli d’oliva verge extra', '2 culleradetes'], ['Llimona', '1/2 unitat'], ['Sal i pebre', 'Al gust']],
        steps: ['Bull l’arròs segons el paquet. Pica la ceba, l’all i el gingebre; talla el paneer a daus.', 'Daura el paneer amb una culleradeta d’oli durant 4 minuts i reserva’l. Cou la ceba amb l’oli restant i una mica d’aigua durant 7 minuts.', 'Afegeix all, gingebre i espècies; remena 30 segons. Incorpora els espinacs i cou-los 5–8 minuts, fins que perdin l’aigua.', 'Torna-hi el paneer, escalfa’l 2 minuts i acaba amb llimona. Serveix amb l’arròs.'],
        balanceNote: 'Verdura, proteïna del paneer i arròs. És l’excepció amb formatge de la teva selecció, no el patró de la resta de plats.',
        variations: ['Per reduir formatge, prova la proposta de saag amb tofu de Descobrir.', 'Els espinacs congelats són una opció pràctica; descongela’ls abans per respectar el temps indicat.'],
        batchNote: 'Pots avançar la base d’espinacs i afegir el paneer el dia de menjar.',
        adaptationNote: 'Versió amb racions pròpies, més espinacs i oli d’oliva en lloc de ghee. Arròs inclòs en ingredients i temps.'
    }),
    seasonalRecipe({
        id: 102, title: 'Sopa de verdures amb ou i cigrons', collection: 'mine', emoji: '🥣',
        description: 'Una olla senzilla amb porro, pastanaga i col. Els cigrons cuits la fan més completa.',
        totalMinutes: 25, activeMinutes: 12, equipment: ['Olla'],
        tags: ['Vegetarià', 'Una olla'], sourceIds: ['winterSoup'],
        ingredients: [['Ous', '4 unitats'], ['Cigrons cuits', '200 g escorreguts'], ['Porro', '1 unitat'], ['Pastanaga', '2 unitats'], ['Col', '200 g'], ['Aigua o brou de verdures baix en sal', '900 ml'], ['Oli d’oliva verge extra', '2 culleradetes'], ['Pebre', 'Al gust']],
        steps: ['Renta i talla les verdures ben petites. Estova porro i pastanaga amb l’oli durant 4 minuts.', 'Afegeix la col i l’aigua calenta. Bull suaument 12 minuts, fins que la verdura sigui tendra.', 'Incorpora els cigrons i torna al bull. Bat els ous i aboca’ls en un fil mentre remenes; cou 2–3 minuts fins que quedin completament quallats.', 'Ajusta el brou i el pebre i reparteix-ho en dos bols.'],
        balanceNote: 'Les verdures aporten volum; ou i llegum completen un àpat de cullera sense haver de preparar un segon.',
        variations: ['Pots substituir la col per bledes.', 'Si prefereixes ou dur, cou-lo a part mentre es fa la sopa i afegeix-lo al final.'],
        batchNote: 'Avança o congela la sopa amb cigrons; incorpora l’ou quan la reescalfis.',
        adaptationNote: 'Adaptació de la teva sopa: base de verdures d’hivern inspirada en Good Food, amb cigrons cuits i ou en lloc de llentia seca.'
    }),
    seasonalRecipe({
        id: 103, title: 'Verdures al forn amb tofu i patata', collection: 'mine', emoji: '🥦',
        description: 'Una safata de bròquil, pastanaga i ceba amb tofu daurat. El forn fa gairebé tota la feina.',
        totalMinutes: 45, activeMinutes: 15, equipment: ['Forn'],
        tags: ['Vegetal', 'Safata al forn'], sourceIds: ['tofuOven'],
        ingredients: [['Tofu ferm', '350 g'], ['Bròquil', '300 g'], ['Pastanaga', '200 g'], ['Ceba', '1 petita'], ['Patata', '300 g'], ['Oli d’oliva verge extra', '1 cullerada'], ['Salsa de soja baixa en sal', '1 cullerada'], ['Pebre vermell dolç', '1 culleradeta']],
        steps: ['Preescalfa el forn a 210 °C. Asseca el tofu i talla’l a daus; fes la patata a daus d’1 cm i la verdura a peces petites.', 'Reparteix-ho en una safata ampla. Barreja oli, soja i pebre vermell i amaneix-ho.', 'Forneja 30–35 minuts, remenant a mitja cocció. Evita amuntegar les peces; fes servir dues safates si cal.', 'Comprova que la patata sigui tendra abans de servir.'],
        balanceNote: 'Plat únic amb tofu, verdures i patata; l’oli està mesurat per a tota la safata.',
        variations: ['Canvia el bròquil per coliflor.', 'Per més cruixent, posa el tofu en una segona safata i retira’l quan estigui daurat.'],
        batchNote: 'Fes una safata extra de verdura per reaprofitar-la en una sopa o amb ou.',
        adaptationNote: 'La teva combinació de safata i tofu, amb tècnica de tofu assecat al forn inspirada en Cookie and Kate. Inclou preescalfament.'
    }),
    seasonalRecipe({
        id: 104, title: 'Verdures al forn amb seitan i moniato', collection: 'mine', emoji: '🍠',
        description: 'La variant amb seitan: carbassa i moniato rostits, amb el seitan afegit al final perquè no s’assequi.',
        totalMinutes: 40, activeMinutes: 12, equipment: ['Forn'],
        tags: ['Vegetal', 'Amb gluten'], sourceIds: [],
        ingredients: [['Seitan cuit', '250 g'], ['Carbassa', '350 g'], ['Moniato', '250 g'], ['Ceba', '1 unitat'], ['Coliflor', '250 g'], ['Oli d’oliva verge extra', '1 cullerada'], ['Farigola', '1 culleradeta'], ['Llimona', '1/2 unitat']],
        steps: ['Preescalfa el forn a 210 °C. Talla carbassa i moniato a daus d’1 cm; separa floretes petites de coliflor i talla la ceba.', 'Amaneix les verdures amb oli i farigola i estén-les en una safata ampla. Forneja 25 minuts.', 'Afegeix el seitan a tires amb 2 cullerades d’aigua. Remena i forneja 5–8 minuts més.', 'Comprova que els daus siguin tendres i acaba amb llimona.'],
        balanceNote: 'Seitan com a proteïna, verdures i moniato. Tria seitan senzill i consulta l’etiqueta de sal.',
        variations: ['Pots fer el seitan 4 minuts a la paella mentre acaba la verdura.', 'Si no et ve de gust seitan, fes la safata de tofu de la teva col·lecció.'],
        batchNote: 'Reserva la verdura a part del seitan per combinar-la diferent un altre dia.',
        adaptationNote: 'Desenvolupament propi de la combinació que has proposat. Recepta pendent de la teva prova de cuina.'
    }),
    seasonalRecipe({
        id: 105, title: 'Lluç al forn amb patata, porro i xampinyons', collection: 'mine', emoji: '🐟',
        description: 'Peix blanc i verdures en una safata. Avancem la patata al microones per reduir el temps de forn.',
        totalMinutes: 30, activeMinutes: 12, equipment: ['Forn', 'Microones'],
        tags: ['Peix', 'Safata al forn'], sourceIds: ['fish'],
        ingredients: [['Lluç descongelat', '2 filets de 160–180 g, sense espines'], ['Patata', '350 g'], ['Porro', '1 unitat'], ['Xampinyons', '250 g'], ['Oli d’oliva verge extra', '1 cullerada'], ['Llimona', '1/2 unitat'], ['Julivert', 'Al gust']],
        steps: ['Preescalfa el forn a 200 °C. Talla la patata a rodanxes fines i posa-la amb 2 cullerades d’aigua en un recipient de microones amb tapa ventilada. Cou-la 6–8 minuts, fins que sigui gairebé tendra.', 'Estén patata, porro ben fi i xampinyons en una safata. Afegeix oli i 3 cullerades d’aigua.', 'Posa el lluç a sobre i forneja 12–18 minuts, segons gruix, fins que la carn sigui opaca i se separi fàcilment.', 'Acaba amb llimona i julivert; comprova també que el porro sigui tendre.'],
        balanceNote: 'Verdures, patata i una ració de peix blanc per persona; no cal separar hidrats i proteïna.',
        variations: ['Pots utilitzar bacallà fresc o un altre peix blanc descongelat.', 'Sense microones, cou primer patata i porro al forn 25–30 minuts; el temps total augmentarà.'],
        batchNote: 'Prepara i conserva la guarnició a part; cuina el peix quan l’hagis de menjar.',
        adaptationNote: 'La teva proposta de peix al forn, amb el concepte de safata de Diabetes UK i una guarnició diferent.'
    }),
    seasonalRecipe({
        id: 106, title: 'Paellada de verdures d’hivern amb ou', collection: 'mine', emoji: '🍳',
        description: 'Xampinyons, bledes i porro amb els ous quallats a la mateixa paella. Sopar de poca feina.',
        totalMinutes: 25, activeMinutes: 18, equipment: ['Paella amb tapa'],
        tags: ['Vegetarià', 'Una paella'], sourceIds: ['omelette'],
        ingredients: [['Ous', '4 unitats'], ['Xampinyons', '250 g'], ['Bledes', '300 g'], ['Porro', '1 unitat'], ['Pa integral', '100 g'], ['Oli d’oliva verge extra', '2 culleradetes'], ['All', '1 gra'], ['Pebre', 'Al gust']],
        steps: ['Talla porro, xampinyons i bledes. Salta el porro amb oli 4 minuts i afegeix-hi els bolets 5 minuts.', 'Incorpora all, bledes i 2 cullerades d’aigua. Tapa 3 minuts.', 'Fes quatre espais i trenca-hi els ous. Tapa i cou 5–7 minuts, fins que clara i rovell hagin quallat.', 'Serveix amb pa integral per completar el plat.'],
        balanceNote: 'Ou i pa integral acompanyen una ració generosa de verdura; sense formatge ni embotits.',
        variations: ['Canvia les bledes per espinacs.', 'Si tens verdura ja cuita, afegeix-la al final i escalfa-la bé abans de posar-hi els ous.'],
        batchNote: 'La base de verdura es pot preparar abans. Els ous es fan al moment.',
        adaptationNote: 'La teva paellada, inspirada en la combinació de bolets i ou de Good Food; sense formatge i amb més verdura.'
    }),
    seasonalRecipe({
        id: 107, title: 'Salmó a la planxa amb patata ràpida i xampinyons', collection: 'mine', emoji: '🍽️',
        description: 'La teva combinació de salmó i patata, amb xampinyons en lloc d’espàrrecs per a la tardor-hivern.',
        totalMinutes: 25, activeMinutes: 15, equipment: ['Paella', 'Microones'],
        tags: ['Peix', 'Sense forn'], sourceIds: [],
        ingredients: [['Salmó', '2 lloms de 150 g, sense espines'], ['Patata', '2 mitjanes, uns 350 g'], ['Xampinyons', '350 g'], ['Espinacs', '150 g'], ['Oli d’oliva verge extra', '2 culleradetes'], ['Llimona', '1/2 unitat'], ['Pebre', 'Al gust']],
        steps: ['Punxa les patates rentades i cou-les al microones en un recipient adequat, amb tapa ventilada: 8–12 minuts, girant-les a mig temps. Comprova que el centre sigui tendre i deixa-les reposar 2 minuts.', 'Mentrestant, salta els xampinyons amb l’oli 7 minuts; incorpora espinacs 2 minuts i reserva.', 'Fes el salmó a la paella 3–5 minuts per costat segons gruix, fins que l’interior estigui cuit i se separi fàcilment.', 'Obre les patates i serveix amb salmó, verdura, llimona i pebre.'],
        balanceNote: 'Peix blau, patata amb pell i verdura; el salmó ja aporta greix i no cal afegir mantega.',
        variations: ['A la primavera pots recuperar els espàrrecs.', 'La patata al caliu de forn és una alternativa: calcula uns 50–70 minuts de cocció segons mida, a més del preescalfament.'],
        batchNote: 'Pots deixar bolets i espinacs nets i tallats; prepara el salmó al moment.',
        adaptationNote: 'Desenvolupament propi del teu plat. La versió ràpida utilitza microones: no és patata al caliu tradicional.'
    }),
    seasonalRecipe({
        id: 108, title: 'Patates d’air fryer amb tofu marinat i bròquil', collection: 'mine', emoji: '🥔',
        description: 'Les teves patates «fregides», amb tofu de soja, llimona i pebre vermell i bròquil al vapor.',
        totalMinutes: 40, activeMinutes: 15, equipment: ['Air fryer', 'Paella', 'Cassó'],
        tags: ['Vegetal', 'Air fryer'], sourceIds: ['chips', 'tofuAir'],
        ingredients: [['Patata', '350 g'], ['Tofu ferm', '350 g'], ['Bròquil', '500 g'], ['Salsa de soja baixa en sal', '1 cullerada'], ['Llimona', '1/2 unitat'], ['Oli d’oliva verge extra', '1 cullerada'], ['All en pols', '1/2 culleradeta'], ['Pebre vermell dolç', '1 culleradeta']],
        steps: ['Preescalfa l’air fryer si ho requereix. Talla la patata en bastons fins, esbandeix-los i asseca’ls. Asseca el tofu i barreja’l amb soja, llimona, all i pebre vermell; deixa’l agafar gust mentre es fan les patates.', 'Barreja les patates amb la meitat de l’oli. Cou-les a 190 °C durant 25–30 minuts, sacsejant el cistell dues vegades. Allarga uns minuts si encara són dures.', 'Durant els últims 12 minuts, daura el tofu en una paella amb l’oli restant i fes el bròquil al vapor 6–8 minuts.', 'Serveix-ho junt. El temps pressuposa que les patates caben en una sola tanda sense amuntegar-les.'],
        balanceNote: 'La verdura és una part principal del plat; tofu i patata completen l’àpat. L’oli indicat és per a les dues racions.',
        variations: ['Amb dos calaixos pots fer el tofu a 190 °C uns 12–15 minuts, comprovant-lo i girant-lo.', 'Amb un únic cistell, el tofu es fa a la paella per evitar dues tandes seguides.'],
        batchNote: 'Deixa el tofu marinat i refrigerat per avançar feina. La patata queda millor acabada de fer.',
        adaptationNote: 'Combinació pròpia basada en tècniques de patata i tofu d’air fryer. La versió principal fa el tofu a la paella per donar un temps realista.'
    }),
    seasonalRecipe({
        id: 201, title: 'Saag de tofu amb espinacs i arròs', collection: 'recommended', emoji: '🥬',
        description: 'L’alternativa al paneer amb tofu ferm i una salsa d’espinacs cremosa sense nata ni formatge.',
        totalMinutes: 25, activeMinutes: 18, equipment: ['Paella', 'Cassó'],
        tags: ['Vegetal', 'Alternativa al paneer'], sourceIds: ['saag'],
        ingredients: [['Tofu ferm', '350 g'], ['Espinacs', '500 g descongelats o frescos'], ['Ceba', '1 petita'], ['All', '1 gra'], ['Garam masala', '1 culleradeta'], ['Arròs basmati', '100 g en cru'], ['Oli d’oliva verge extra', '2 culleradetes'], ['Llimona', '1/2 unitat']],
        steps: ['Posa l’arròs a bullir segons el paquet. Asseca el tofu, esmicola’l gros i daura’l amb la meitat de l’oli 5 minuts; reserva’l.', 'Cou la ceba picada amb l’oli restant i una mica d’aigua 6 minuts.', 'Afegeix l’all i el garam masala, després els espinacs; cou 6–8 minuts. Aixafa o tritura parcialment la salsa.', 'Barreja amb el tofu, escalfa 2 minuts i serveix amb arròs i llimona.'],
        balanceNote: 'Alternativa sense formatge que manté la proteïna i una ració abundant de verdura.',
        variations: ['Amb iogurt natural: afegeix-ne 2 cullerades fora del foc si et ve de gust.', 'Pots fer servir bledes picades en part dels espinacs.'],
        batchNote: 'La base de tofu i espinacs es pot congelar a part de l’arròs.',
        adaptationNote: 'Adaptació vegetal del saag paneer de referència; quantitats i passos propis.'
    }),
    seasonalRecipe({
        id: 202, title: 'Llenties ràpides amb carbassa i espinacs', collection: 'recommended', emoji: '🫘',
        description: 'Llenties de pot amb carbassa a daus petits. Una olla de tardor sense embotits ni sofregits llargs.',
        totalMinutes: 25, activeMinutes: 12, equipment: ['Olla'],
        tags: ['Vegetal', 'Llegum cuit', 'Una olla'], sourceIds: ['lentils'],
        ingredients: [['Llenties cuites', '400 g escorregudes'], ['Carbassa', '350 g'], ['Espinacs', '200 g'], ['Ceba', '1 petita'], ['All', '1 gra'], ['Aigua o brou de verdures baix en sal', '450 ml'], ['Oli d’oliva verge extra', '2 culleradetes'], ['Curri', '1 culleradeta']],
        steps: ['Pica ceba i all i talla la carbassa a daus d’1 cm. Estova la ceba amb oli 4 minuts.', 'Afegeix all, curri, carbassa i brou calent. Tapa i cou 12 minuts, fins que la carbassa sigui tendra.', 'Incorpora llenties esbandides i espinacs. Cou 4 minuts més i ajusta la quantitat de brou.'],
        balanceNote: 'El llegum aporta proteïna vegetal i hidrats; no cal afegir carn per completar aquest guisat.',
        variations: ['Canvia curri per comí i pebre vermell.', 'Si tens més gana, acompanya amb una llesca de pa integral.'],
        batchNote: 'Fàcil de duplicar i congelar en racions; refreda i guarda sense deixar l’olla hores al marbre.',
        adaptationNote: 'Inspirada en la sopa especiada de llenties de Good Food; s’utilitzen llenties ja cuites i carbassa per escurçar el procés.'
    }),
    seasonalRecipe({
        id: 203, title: 'Cigrons amb espinacs i xampinyons', collection: 'recommended', emoji: '🍲',
        description: 'Un guisat curt de rebost, amb cigrons cuits, espinacs i bolets, que només necessita una paella fonda.',
        totalMinutes: 20, activeMinutes: 15, equipment: ['Paella fonda'],
        tags: ['Vegetal', 'Llegum cuit', 'Una paella'], sourceIds: ['chickpeas'],
        ingredients: [['Cigrons cuits', '400 g escorreguts'], ['Espinacs', '300 g'], ['Xampinyons', '250 g'], ['Tomàquet triturat', '200 g, sense sucre afegit'], ['All', '2 grans'], ['Oli d’oliva verge extra', '2 culleradetes'], ['Comí', '1/2 culleradeta'], ['Pebre vermell dolç', '1/2 culleradeta']],
        steps: ['Lamina els xampinyons i pica l’all. Salta els bolets amb l’oli 6 minuts.', 'Afegeix all i espècies, remena breument i incorpora el tomàquet. Cou 5 minuts.', 'Afegeix cigrons, espinacs i 100 ml d’aigua. Tapa 5 minuts i serveix quan tot sigui ben calent.'],
        balanceNote: 'Llegum i dos tipus de verdura en un plat únic; permet aprofitar conserves senzilles.',
        variations: ['Pots substituir els espinacs per bledes.', 'Una mica de llimona al final canvia el gust sense afegir salsa.'],
        batchNote: 'Adequat per tàper o per congelar en racions.',
        adaptationNote: 'Inspirada en el guisat de cigrons i espinacs de Plant Powered Metro New York; amb bolets i preparació simplificada.'
    }),
    seasonalRecipe({
        id: 204, title: 'Sopa de porro, mongeta blanca i col', collection: 'recommended', emoji: '🥣',
        description: 'Textura cremosa triturant una part de les mongetes, sense nata i amb ingredients de rebost.',
        totalMinutes: 25, activeMinutes: 10, equipment: ['Olla', 'Batedora opcional'],
        tags: ['Vegetal', 'Llegum cuit', 'Una olla'], sourceIds: ['beans'],
        ingredients: [['Mongeta blanca cuita', '400 g escorreguda'], ['Porro', '2 unitats'], ['Col', '250 g'], ['Pastanaga', '1 unitat'], ['All', '1 gra'], ['Aigua o brou de verdures baix en sal', '700 ml'], ['Oli d’oliva verge extra', '2 culleradetes'], ['Farigola', '1/2 culleradeta']],
        steps: ['Renta i talla el porro a rodanxes fines; pica pastanaga, all i col.', 'Estova porro i all amb l’oli 4 minuts. Afegeix la resta de verdura, farigola i brou calent; cou 12 minuts.', 'Incorpora les mongetes i cou 4 minuts. Aixafa’n una part amb forquilla o tritura un cullerot de sopa i torna’l a l’olla.'],
        balanceNote: 'Sopa amb suficient llegum per ser la base del dinar o sopar, no només una crema de verdura.',
        variations: ['Canvia col per kale, bledes o espinacs; aquests últims s’afegeixen al final.', 'Un raig de llimona o una cullerada de iogurt natural són opcionals.'],
        batchNote: 'Es pot duplicar i congelar. Guarda les racions quan s’hagin refredat, sense deixar-les a temperatura ambient durant hores.',
        adaptationNote: 'Adaptació de la sopa de California Olive Ranch amb menys oli, col i mongetes ja cuites.'
    }),
    seasonalRecipe({
        id: 205, title: 'Tofu amb bolets, bròquil i arròs', collection: 'recommended', emoji: '🥢',
        description: 'Saltat suau d’inspiració mapo, amb ingredients fàcils de trobar i sense necessitat de picant.',
        totalMinutes: 25, activeMinutes: 18, equipment: ['Paella', 'Cassó'],
        tags: ['Vegetal', 'Paella'], sourceIds: ['mapo'],
        ingredients: [['Tofu ferm', '350 g'], ['Xampinyons', '300 g'], ['Bròquil', '300 g'], ['Arròs basmati', '100 g en cru'], ['All', '1 gra'], ['Gingebre', '1 tros d’1 cm'], ['Salsa de soja baixa en sal', '1 cullerada'], ['Oli d’oliva verge extra', '2 culleradetes'], ['Midó de blat de moro', '1 culleradeta']],
        steps: ['Cou l’arròs segons el paquet. Asseca i talla el tofu; separa floretes petites de bròquil i lamina els bolets.', 'Daura el tofu amb l’oli 5 minuts. Afegeix bolets, all i gingebre i salta 5 minuts.', 'Incorpora bròquil, soja i 150 ml d’aigua. Tapa 5–7 minuts. Dissol el midó en una cullerada d’aigua freda, afegeix-lo i cou 1 minut.', 'Serveix amb l’arròs. Afegeix pebre o bitxo només si et ve de gust.'],
        balanceNote: 'Tofu i arròs amb una quantitat generosa de bolets i bròquil; salsa curta i mesurada.',
        variations: ['Canvia el bròquil per coliflor tallada petita.', 'La salsa de soja pot contenir blat; consulta l’etiqueta si algun dia necessites evitar-lo.'],
        batchNote: 'Talla la verdura i deixa la salsa mesurada per cuinar el saltat el dia que el mengis.',
        adaptationNote: 'Inspiració en el mapo tofu vegetal de Ching-He Huang. No és una versió tradicional: sense alcohol ni pasta de bitxo, amb bròquil.'
    }),
    seasonalRecipe({
        id: 206, title: 'Truita de xampinyons i espinacs amb pa integral', collection: 'recommended', emoji: '🍳',
        description: 'Una alternativa a la paellada d’ous: truita prima, sense formatge i amb més verdura al costat.',
        totalMinutes: 25, activeMinutes: 23, equipment: ['Paella antiadherent'],
        tags: ['Vegetarià', 'Una paella'], sourceIds: ['omelette'],
        ingredients: [['Ous', '4 unitats'], ['Xampinyons', '300 g'], ['Espinacs', '250 g'], ['Pa integral', '100 g'], ['Oli d’oliva verge extra', '2 culleradetes'], ['Julivert', 'Al gust'], ['Pebre', 'Al gust']],
        steps: ['Lamina i salta els bolets amb una culleradeta d’oli 6 minuts. Afegeix espinacs i cou-los 3 minuts; reserva la meitat de la verdura.', 'Bat els ous amb julivert i pebre. Barreja’ls amb la verdura restant.', 'Amb l’oli que queda, qualla dues truites fines 2–3 minuts per costat, fins que no hi hagi ou líquid.', 'Serveix amb la verdura reservada i el pa.'],
        balanceNote: 'La guarnició de verdura compta tant com el farcit; el pa forma part de la recepta.',
        variations: ['Canvia espinacs per bledes ja cuites.', 'Amb patata ja cuita pots substituir el pa per una guarnició de patata.'],
        batchNote: 'Deixa el saltat de bolets i espinacs preparat; qualla la truita al moment.',
        adaptationNote: 'Versió pròpia de la truita de bolets de Good Food: sense cheddar, més verdura i oli mesurat.'
    }),
    seasonalRecipe({
        id: 207, title: 'Peix blanc amb coliflor i llenties al forn', collection: 'recommended', emoji: '🐟',
        description: 'Una altra manera de fer peix al forn: llenties cuites en lloc de patata i coliflor de temporada.',
        totalMinutes: 35, activeMinutes: 12, equipment: ['Forn', 'Microones'],
        tags: ['Peix', 'Llegum cuit'], sourceIds: ['fish'],
        ingredients: [['Peix blanc descongelat', '2 filets de 160–180 g sense espines'], ['Coliflor', '500 g'], ['Llenties cuites', '300 g escorregudes'], ['Porro', '1 petit'], ['All', '1 gra'], ['Oli d’oliva verge extra', '2 culleradetes'], ['Aigua o brou de verdures baix en sal', '100 ml'], ['Llimona', '1/2 unitat']],
        steps: ['Preescalfa el forn a 200 °C. Fes floretes petites de coliflor i avança-les al microones 5 minuts amb una mica d’aigua i tapa ventilada.', 'Barreja coliflor, porro tallat molt fi, llenties, all, oli i brou en una safata. Forneja 8 minuts.', 'Afegeix-hi el peix i forneja 12–18 minuts, fins que sigui opac i es desfaci fàcilment. Comprova que la coliflor sigui tendra.', 'Acaba amb llimona i serveix.'],
        balanceNote: 'Llenties i peix conviuen al mateix plat, amb coliflor abundant: sense restriccions de combinacions.',
        variations: ['Si no tens microones, rosteix primer la coliflor 20 minuts; calcula uns 45–50 minuts totals.', 'Lluç o bacallà fresc són alternatives; evita confondre’l amb bacallà salat sense dessalar.'],
        batchNote: 'Deixa coliflor i llenties preparades; incorpora i cuina el peix el dia de servir.',
        adaptationNote: 'Adaptació de la safata de Diabetes UK per a dues racions, amb porro i precocció de coliflor. No reutilitza els valors nutricionals de l’original.'
    }),
    seasonalRecipe({
        id: 208, title: 'Pollastre amb bròquil, pastanaga i arròs', collection: 'recommended', emoji: '🥕',
        description: 'L’opció puntual amb carn magra: més verdura que pollastre i una salsa senzilla de llimona i soja.',
        totalMinutes: 25, activeMinutes: 18, equipment: ['Paella', 'Cassó'],
        tags: ['Carn magra', 'Paella'], sourceIds: ['chicken'],
        ingredients: [['Pit de pollastre', '250 g'], ['Bròquil', '350 g'], ['Pastanaga', '200 g'], ['Ceba', '1 petita'], ['Arròs basmati', '100 g en cru'], ['Oli d’oliva verge extra', '2 culleradetes'], ['Salsa de soja baixa en sal', '1 cullerada'], ['Llimona', '1/2 unitat'], ['Gingebre', '1 tros d’1 cm']],
        steps: ['Cou l’arròs segons el paquet. Talla el pollastre a tires fines amb estris separats de la verdura llesta per menjar.', 'Talla la verdura petita. Salta ceba, pastanaga i gingebre amb oli 4 minuts.', 'Afegeix el pollastre i cou 5 minuts, remenant. Incorpora el bròquil i 4 cullerades d’aigua; tapa 5–7 minuts, fins que el pollastre estigui completament cuit.', 'Afegeix soja i llimona i serveix amb l’arròs.'],
        balanceNote: 'Alternativa de carn magra per quan en vulguis, sense convertir-la en la base del receptari.',
        variations: ['Canvia el pollastre per 350 g de tofu i daura’l abans de la verdura.', 'L’arròs integral també serveix; el temps total dependrà del paquet i sovint serà superior.'],
        batchNote: 'Pots deixar la verdura tallada i la salsa mesurada. Mantén el pollastre cru separat de la resta.',
        adaptationNote: 'Inspirada en el saltat de Sara Buenfeld, sense salsa de cacauet i amb una guarnició i racions pròpies.'
    }),
    seasonalRecipe({
        id: 302, title: 'Nyoquis cremosos amb bolets i cottage', collection: 'mine', emoji: '🍄', photoPending: true,
        description: 'Nyoquis amb bolets congelats i una crema de cottage i parmesà. Dues racions, en uns 20–25 minuts.',
        totalMinutes: 25, activeMinutes: 20, equipment: ['Paella', 'Batedora'], sourceChecked: null,
        tags: ['Vegetarià', 'Amb formatge'], sourceIds: [],
        ingredients: [['Nyoquis', '200 g'], ['Cottage', '180 g'], ['Bolets congelats', '150 g'], ['Ceba', '1/2 unitat'], ['Parmesà', '10–15 g'], ['All', 'Al gust'], ['Julivert', 'Al gust'], ['Pebre negre', 'Al gust'], ['Nou moscada', 'Al gust'], ['Farigola', 'Al gust'], ['Caiena', 'Al gust'], ['Oli d’oliva', 'Una mica'], ['Sal', 'Al gust']],
        optionalIngredients: [{ item: 'Llimona', qty: 'Unes gotes' }, { item: 'Ous', qty: '2 unitats · 1 per ració' }],
        steps: ['Sofregeix la mitja ceba i l’all amb una mica d’oli.', 'Afegeix els bolets congelats i deixa que alliberin l’aigua.', 'Incorpora els nyoquis i cou-los 2–4 minuts, seguint també les indicacions del paquet. Afegeix una mica d’aigua si cal.', 'Tritura el cottage amb el parmesà, la nou moscada i una mica del líquid dels bolets.', 'Incorpora la crema a foc baix, sense deixar-la bullir.', 'Condimenta amb pebre, farigola, julivert i una mica de caiena. Si vols, acaba amb unes gotes de llimona i serveix amb un ou cuit al teu gust per ració.'],
        nutritionNote: 'Valors aproximats aportats per l’usuari, no verificats ni recalculats: 325–375 kcal i 16–18 g de proteïnes per ració. Amb un ou: 395–455 kcal i 22–25 g de proteïnes. Poden variar segons el producte i les quantitats.',
        balanceNote: 'Combina nyoquis, bolets i lactis. Pots acompanyar-ho amb més verdura si et ve de gust; no s’han calculat necessitats nutricionals personals.',
        variations: ['Llimona, altres verdures i ou són opcionals. No entren a la compra automàtica ni són necessaris per coincidir amb la nevera; afegeix-los a la compra si els vols.', 'Modera la caiena i evita que la salsa de cottage bulli. L’ou opcional augmenta l’aportació de proteïna.'],
        batchNote: 'Pots deixar la ceba i els bolets cuinats. Acaba els nyoquis i la salsa a foc baix quan els hagis de menjar.',
        adaptationNote: 'Recepta pròpia de l’usuari, elaborada amb ChatGPT. Quantitats i estimacions transcrites de la seva proposta; pendent de prova casolana.'
    }),
    seasonalRecipe({
        id: 303, title: 'Crema densa al curri amb pollastre', collection: 'mine', emoji: '🥣', photoPending: true,
        description: 'Crema espessa de patata, ceba i pastanaga, amb pollastre esmicolat i un ou escalfat per persona. Dues racions grans.',
        totalMinutes: 30, activeMinutes: 10, equipment: ['Olla', 'Batedora', 'Cassó'], sourceChecked: null,
        tags: ['Pollastre', 'Crema', 'Racions grans'], sourceIds: ['maydenCream'],
        ingredients: [['Pit de pollastre', '1 unitat sencera'], ['Patata', '500 g'], ['Ceba', '350 g'], ['Pastanaga', '2 unitats'], ['Ous', '2 unitats'], ['Aigua', 'Fins cobrir'], ['Curri o cúrcuma', 'Al gust'], ['Nou moscada', 'Al gust'], ['Pebre negre', 'Al gust'], ['Sal', 'Al gust']],
        steps: ['Pela i talla les verdures a trossos petits.', 'Posa-les en una olla amb el pit de pollastre.', 'Cobreix amb aigua, condimenta i cou uns 20 minuts, fins que les verdures siguin tendres i el pollastre estigui ben cuit també al centre; allarga la cocció si cal.', 'Retira el pollastre i tritura les verdures amb part del brou fins a obtenir una crema espessa. Reserva la resta de brou per ajustar la textura.', 'Esmicola el pollastre i incorpora’l a la crema.', 'Prepara els ous escalfats en un cassó i serveix-ne un per ració.'],
        nutritionNote: 'Valors per ració segons la font original indicada per l’usuari, no verificats: 501 kcal, 45 g de proteïnes, 66 g d’hidrats, 7 g de greixos i 10 g de fibra. No s’han recalculat i el pes del pit no està especificat.',
        balanceNote: 'Patata i verdures amb pollastre i ou. La fitxa correspon a dues racions grans; les quantitats es poden ajustar en passar-les a la compra.',
        variations: ['Ajusta l’aigua per aconseguir una textura densa.', 'Pots substituir l’aigua per brou casolà; afegeix-lo manualment a la compra si en necessites.'],
        batchNote: 'Prepara la crema amb el pollastre i guarda-la en racions. Fes l’ou al moment de servir.',
        adaptationNote: 'Font indicada per l’usuari: MaydenFit. Preparació i valors nutricionals transcrits de la seva proposta; el vídeo no s’ha pogut verificar en aquesta sessió.'
    })
];
