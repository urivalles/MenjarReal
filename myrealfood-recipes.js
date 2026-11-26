// Fitxes recuperades de les captures de MyRealFood. Les quantitats són les de la pestanya d’ingredients.
const myRealFoodRecipes = [
    {
        id: 601, title: 'Natilles de caqui i cacau', originalTitle: 'Natillas de chocolate realfooder',
        author: 'carlosriosq', reviewed: true, totalMinutes: 2, servings: 1,
        types: ['snack', 'dessert'],
        ingredients: [['Caqui madur', '120 g'], ['Iogurt natural', '74 g'], ['Cacau en pols pur', '12 g']],
        steps: ['Tritura el caqui madur amb el iogurt. Afegeix el cacau al gust i torna a triturar fins que tingui una textura de natilla.']
    },
    {
        id: 602, title: 'Fajites de pollastre amb verdures i coco', originalTitle: 'Fajitas de delicia de pollo',
        author: 'MyRealFood', reviewed: true, totalMinutes: 50, servings: 1,
        types: ['lunch', 'dinner'], parts: ['carbs', 'protein', 'veg'], protein: 'poultry',
        ingredients: [['Llet de coco', '50 ml'], ['Pit de pollastre', '50 g'], ['Tortilles integrals de blat', '25 g'],
            ['Ceba', '25 g'], ['Xampinyons', '25 g'], ['Pastanaga', '20 g'], ['Pebre negre', '1 g'], ['Sal', '1 g'],
            ['Oli d’oliva verge extra', 'Una mica']],
        optional: [['Formatge', '20 g']],
        steps: ['Bull el pit de pollastre 20 minuts i talla’l a tires.',
            'Pica la ceba fina i daura-la amb oli. Incorpora-hi els xampinyons i la pastanaga laminats.',
            'Esmicola el pollastre amb dues forquilles, afegeix-lo a les verdures i cou-ho un parell de minuts.',
            'Posa-hi la llet de coco, el pebre i la sal. Remena i deixa que la salsa espesseixi uns minuts.',
            'Escalfa les tortilles a la paella i farceix-les. Hi pots posar formatge.']
    },
    {
        id: 603, title: 'Bastonets de pastanaga al forn', originalTitle: 'Sticks de zanahoria',
        author: 'naturexhealth', totalMinutes: 35, servings: 1, lists: ['today'],
        types: ['side', 'snack'], parts: ['veg'],
        ingredients: [['Pastanaga', '400 g'], ['Oli d’oliva verge extra', '15 ml'], ['Orenga', '5 g'],
            ['Herbes provençals', '3 g'], ['Cúrcuma', '1 g'], ['Pebre negre', '1 g']],
        steps: ['Talla les pastanagues a bastonets i posa-les en un bol.',
            'Barreja-les amb l’oli i les espècies fins que quedin ben impregnades.',
            'Enforna-les 20 minuts a 200 °C o fins que estiguin daurades.']
    },
    {
        id: 604, title: 'Pasta Alfredo amb formatge cottage', originalTitle: 'Pasta Alfredo con queso cottage',
        author: 'cookingbego', totalMinutes: 10, servings: 1, lists: ['today'],
        types: ['lunch', 'dinner'], parts: ['carbs', 'protein'], protein: 'dairy',
        ingredients: [['Llet desnatada', '150 ml'], ['Formatge cottage', '150 g'], ['Espaguetis integrals', '80 g'],
            ['Parmesà', '25 g'], ['Herbes provençals', '3 g'], ['Pebre negre', '3 g'], ['Sal', '1 g']],
        optional: [['All en pols', 'Al gust']],
        steps: ['Cou els espaguetis al dente.',
            'Mentrestant, tritura la llet, el cottage, el parmesà, les herbes, el pebre i la sal. Hi pots posar all en pols.',
            'Escorre els espaguetis, aboca’ls al bol amb la salsa, barreja-ho dos minuts i serveix de seguida.']
    },
    {
        id: 605, title: 'Arròs de Nadal amb pop i faves', originalTitle: 'Arroz navideño',
        author: 'urivalles', createdByUser: true, publicInSource: true, totalMinutes: 75, servings: 1,
        types: ['lunch', 'dinner'], parts: ['carbs', 'protein', 'veg'], protein: 'seafood', seasons: ['Hivern'],
        ingredients: [['Fumet de marisc i peix', '330 ml'], ['Pop fresc', '200 g'], ['Arròs bomba', '100 g'],
            ['Ceba', '100 g'], ['Faves fresques', '100 g'], ['Espècies', 'Al gust']],
        steps: ['Prepara les verdures i sofregeix-les amb el pop i les espècies que prefereixis.',
            'Afegeix-hi l’arròs i el fumet. Cou-ho uns 17 minuts.']
    },
    {
        id: 606, title: 'Coquetes de patata i formatge', originalTitle: 'Tortitas de patata y queso',
        author: 'Walla', reviewed: true, totalMinutes: 30, servings: 1, lists: ['hits'],
        types: ['lunch', 'dinner'], parts: ['carbs', 'protein'], protein: 'egg',
        description: 'Per acompanyar amb la verdura que ja tens preparada. La mozzarella ratllada hi funciona com a variant del formatge de la fitxa.',
        ingredients: [['Patata', '200 g'], ['Formatge ratllat lleuger', '60 g'], ['Ou', '50 g'],
            ['Oli d’oliva verge extra', '10 ml'], ['Cibulet', '10 g'], ['All en pols', '1 g'],
            ['Pebre vermell de La Vera', '1 g'], ['Pebre negre', '1 g']],
        variations: ['Pots fer servir mozzarella ratllada.'],
        steps: ['Pela la patata, talla-la a daus i cou-la al microones a màxima potència 6 minuts, en un recipient apte i tapat.',
            'Aixafa-la amb una forquilla. Quan sigui freda, incorpora-hi el cibulet picat, les espècies, el formatge i l’ou.',
            'Forma boles i aixafa-les per fer les coquetes.',
            'Daura-les pels dos costats en una paella amb una mica d’oli.']
    },
    {
        id: 607, title: 'Pasta cremosa de pollastre, verdures i coco', originalTitle: 'Pasta con delicia de pollo',
        author: 'Albitrips', reviewed: true, servings: 1, lists: ['hits'],
        types: ['lunch', 'dinner'], parts: ['carbs', 'protein', 'veg'], protein: 'poultry',
        ingredients: [['Llet de coco', '100 ml'], ['Pit de pollastre', '100 g'], ['Xampinyons', '80 g'],
            ['Espaguetis integrals', '60 g'], ['Ceba', '50 g'], ['Pastanaga', '40 g'], ['Mozzarella ratllada', '10 g'],
            ['Oli d’oliva verge extra', '8 ml'], ['Pebre negre', '1 g'], ['Sal', 'Al gust']],
        steps: ['Bull el pit de pollastre 20 minuts. Posa també a coure la pasta segons el paquet.',
            'Mentrestant pica la ceba, daura-la amb l’oli i afegeix-hi la pastanaga i els xampinyons laminats.',
            'Esmicola el pollastre amb dues forquilles i cou-lo un parell de minuts amb les verdures.',
            'Incorpora-hi la llet de coco, el pebre i la sal. Remena i deixa que la salsa espesseixi.',
            'Serveix la pasta amb la salsa i una mica de formatge ratllat.']
    },
    {
        id: 608, title: 'Bol d’estiu de iogurt, fruits vermells i civada', originalTitle: 'Bowl veraniego',
        author: 'Marta212', reviewed: true, totalMinutes: 5, servings: 1, lists: ['hits'],
        types: ['breakfast', 'snack'], parts: ['carbs', 'protein'], protein: 'dairy',
        ingredients: [['Iogurt proteic', '188 g'], ['Fruits vermells', '50 g'], ['Plàtan', '40 g'],
            ['Llet', '30 ml'], ['Nous', '30 g'], ['Panses', '15 g'], ['Flocs de civada', '10 g'], ['Crema de cacauet', '10 g']],
        optional: [['Pasta de dàtil', 'Al gust']],
        dataNote: 'La pasta de dàtil apareix a la preparació sense quantitat indicada.',
        steps: ['Tritura el iogurt amb els fruits vermells, el plàtan i la llet. Hi pots posar pasta de dàtil. Serveix-ho en un bol.',
            'Reparteix-hi els flocs de civada, les panses, la crema de cacauet i les nous.'],
        variations: ['Pots fer servir fruits vermells congelats o una beguda vegetal sense sucres afegits.']
    },
    {
        id: 609, title: 'Pasta amb pesto d’espinacs i pinyons', originalTitle: 'Pasta pesto espinacas',
        author: 'fitfanutics', servings: 2, lists: ['hits'],
        types: ['lunch', 'dinner'], parts: ['carbs', 'veg'],
        ingredients: [['Espinacs', '100 g'], ['Oli d’oliva verge extra', '60 ml'], ['Tomàquets cherry', '40 g'], ['Fruits secs', '20 g'],
            ['Pinyons', '20 g'], ['All', '3 g'], ['Sal', '1 g'], ['Pasta', 'Quantitat pendent']],
        dataNote: 'La captura indica 1 minut i dona les quantitats del pesto i els complements. La pasta només surt a la preparació i necessita el seu temps de cocció.',
        steps: ['Tritura en cru els espinacs, els pinyons, l’oli, l’all i la sal.',
            'Afegeix-hi els tomàquets i els fruits secs. Cou la pasta i barreja-la amb el pesto.']
    },
    {
        id: 610, title: 'Shakshuka amb pa integral', originalTitle: 'Shakshuka',
        author: 'Nina_Leshcheva', reviewed: true, servings: 1, lists: ['hits'],
        types: ['lunch', 'dinner'], parts: ['carbs', 'protein', 'veg'], protein: 'egg',
        ingredients: [['Tomàquet', '150 g'], ['Ous', '100 g'], ['Tomàquet triturat', '100 g'],
            ['Ceba', '50 g'], ['Pa integral de blat', '30 g'], ['Pebrots del piquillo', '20 g'],
            ['Oli d’oliva verge extra', '15 ml'], ['Comí', '1 g'], ['Pebre vermell picant', '1 g'], ['Sal', 'Un pessic']],
        steps: ['Talla la ceba i sofregeix-la amb l’oli. Afegeix-hi el tomàquet tallat, preferiblement pelat, i el pebrot.',
            'Sala-ho, tapa la paella i deixa que el tomàquet deixi anar el suc uns 5 minuts.',
            'Remena-hi el tomàquet triturat. Si queda sec, afegeix-hi una mica d’aigua.',
            'Obre dos espais a la salsa, trenca-hi els ous i afegeix-hi el comí, el pebre vermell i una mica de sal. Tapa-ho fins que les clares quallin, uns 2 minuts segons la font.',
            'Serveix-ho amb el pa integral torrat.']
    },
    {
        id: 611, title: 'Curri de tardor de llenties vermelles', originalTitle: 'Curry otoñal de lentejas rojas',
        author: 'rachelblacc', reviewed: true, totalMinutes: 30, servings: 1, lists: ['later'], seasons: ['Tardor', 'Hivern'],
        types: ['lunch', 'dinner'], parts: ['carbs', 'protein', 'veg'], protein: 'legumes',
        ingredients: [['Brou de verdures', '200 ml'], ['Llet de coco', '100 ml'], ['Llenties vermelles', '100 g'],
            ['Moniato', '60 g'], ['Ceba dolça', '50 g'], ['Coliflor', '50 g'], ['Tomàquet triturat', '30 g'],
            ['Oli d’oliva verge extra', '5 ml'], ['All', '3 g'], ['Canyella en pols', '1 g'], ['Comí', '1 g'],
            ['Curri', '1 g'], ['Pebre negre', '1 g'], ['Sal', 'Un pessic']],
        optional: [['Arròs basmati', 'Al gust']],
        steps: ['Sofregeix la ceba i l’all picats amb l’oli. Afegeix-hi el moniato a daus. També el pots posar ja cuit.',
            'Quan la ceba sigui transparent, incorpora-hi les llenties, les espècies i una mica de sal.',
            'Posa-hi el tomàquet triturat, la llet de coco, el brou i la coliflor a trossets.',
            'Cou-ho 15 minuts remenant. Si cal, afegeix-hi brou, llet de coco o aigua. Serveix-ho amb arròs basmati si et ve de gust.']
    },
    {
        id: 612, title: 'Pasta de cigrons amb carbassó, tomàquet sec i formatge', originalTitle: 'Pasta con salsa de calabacín, tomates secos y queso',
        author: 'sabela.sueiras', reviewed: true, totalMinutes: 25, servings: 1, lists: ['later'],
        types: ['lunch', 'dinner'], parts: ['carbs', 'protein', 'veg'], protein: 'legumes',
        ingredients: [['Carbassó', '125 g'], ['Llet', '100 ml'], ['Pasta de cigrons', '60 g'],
            ['Formatge cottage', '60 g'], ['Ceba', '25 g'], ['Oli d’oliva verge extra', '15 ml'], ['Tomàquet sec', '15 g'],
            ['Mozzarella ratllada', '10 g'], ['Alfàbrega seca', '1 g'], ['Orenga', '1 g']],
        steps: ['Talla la ceba en juliana i sofregeix-la amb l’oli. Mentrestant, cou la pasta seguint les indicacions del paquet.',
            'Talla el carbassó a tires i afegeix-lo quan la ceba sigui transparent.',
            'Quan les verdures estiguin toves, abaixa el foc i incorpora la llet, el cottage i les herbes. Deixa que la salsa redueixi.',
            'Apaga el foc, incorpora-hi la mozzarella i remena perquè es fongui amb la calor residual.',
            'Barreja-hi la pasta escorreguda i acaba amb els tomàquets secs picats.']
    },
    {
        id: 613, title: 'Nachos San Fernando de farina de cigrons', originalTitle: 'NACHOS SAN FERNANDO',
        author: 'maritinna_p', totalMinutes: 30, servings: 4, lists: ['later'],
        types: ['snack'], parts: ['carbs', 'veg'],
        ingredients: [['Iogurt natural', '125 g'], ['Ceba', '100 g'], ['Farina de cigrons', '100 g'],
            ['Pebrot vermell', '100 g'], ['Tomàquet', '100 g'], ['Pebrot verd', '50 g'], ['Llimona', '45 g'],
            ['Aigua', '40 ml'], ['Oli d’oliva verge extra', '30 ml'], ['Llima', '15 g'], ['Emmental ratllat', '15 g'],
            ['Jalapeños', '10 g'], ['Vinagre de poma', '10 ml'], ['Coriandre', '3 g'], ['Pebre negre', '1 g'], ['Sal', '1 g']],
        dataNote: 'Les quantitats són les de la llista de quatre racions. A la preparació, l’autora fa servir 200 ml de iogurt i indica 2 cullerades de vinagre blanc per a la crema agra.',
        steps: ['Barreja la farina de cigrons, l’aigua, l’oli i un pessic de sal. Pasta un parell de minuts fins que quedi homogènia.',
            'Preescalfa el forn a 170 °C. Enfarina una superfície amb farina de cigrons, estira la massa ben fina i talla-la a rectangles.',
            'Enforna els nachos sobre paper vegetal 10–15 minuts. Vigila que no es torrin massa i reserva’ls.',
            'Per al pico de gallo, pica el tomàquet, els pebrots i la ceba a daus i barreja’ls amb suc de llima, coriandre, sal i pebre.',
            'Fes la crema agra amb el iogurt, el suc de llimona, el vinagre i un pessic de sal.',
            'Cobreix els nachos amb l’emmental i gratina’ls amb la calor residual del forn fins que es fongui el formatge. Acaba amb el pico de gallo, la crema agra i els jalapeños.']
    },
    {
        id: 614, title: 'Coquetes de carbassó, patata i feta', originalTitle: 'Tortitas de calabacín, patata y queso feta',
        author: 'inrealfoodie', totalMinutes: 37, servings: 2, lists: ['later'],
        types: ['dinner', 'side'], parts: ['carbs', 'protein', 'veg'], protein: 'dairy',
        ingredients: [['Carbassó', '250 g'], ['Patata', '250 g'], ['Formatge feta', '150 g'], ['Farina de blat de moro', '20 g'],
            ['Oli d’oliva verge extra', '10 g'], ['Orenga', '5 g']],
        steps: ['Pela i ratlla la patata i ratlla el carbassó. Deixa’ls escórrer i esmicola el feta.',
            'Barreja tots els ingredients. Reparteix cullerades de la barreja sobre paper de forn i dona’ls forma de coqueta.',
            'Enforna-les a 200 °C amb calor a dalt i a baix. Al cap de 20 minuts, daura-les amb el gratinador uns 5 minuts per cada cara.']
    },
    {
        id: 615, title: 'Crep vegana de farina de cigrons', originalTitle: 'Crepe vegano a base de harina de garbanzo',
        author: 'MikeCleveland', lists: ['easy'], types: ['breakfast', 'snack', 'base'],
        parts: ['carbs', 'protein'], protein: 'legumes',
        ingredients: [['Farina de cigrons', ''], ['Beguda de civada', ''], ['Oli de coco', '']],
        incomplete: true, dataNote: 'La captura conté els passos, però no mostra les quantitats ni les racions.',
        steps: ['Barreja bé la farina de cigrons i la beguda de civada, idealment amb una batedora de mà.',
            'Cou les creps en una paella ben untada amb oli de coco. Serveixen per a farcits dolços o salats.']
    },
    {
        id: 616, title: 'Carxofes amb pernil cruixent', originalTitle: 'Alcachofa con jamón crujiente',
        author: 'albaduranlli', totalMinutes: 17, servings: 1, lists: ['easy'],
        types: ['side'], parts: ['veg', 'protein'], protein: 'meat',
        ingredients: [['Carxofa', '400 g'], ['Pernil serrà', '60 g'], ['Pebre negre', '3 g'], ['Sal', '1 g']],
        steps: ['Enforna el pernil uns 15 minuts en una safata, fins que quedi ben daurat.',
            'Mentrestant, cou i daura les carxofes en una paella.',
            'Pica o tritura el pernil cruixent. Barreja’l amb les carxofes i salpebra-ho.']
    },
    {
        id: 617, title: 'Torrada de pernil cuit i alvocat', originalTitle: 'Tostada jamón cocido y aguacate',
        author: 'sararamos14', reviewed: true, totalMinutes: 7, servings: 1, lists: ['easy'],
        types: ['breakfast', 'snack', 'dinner'], parts: ['carbs', 'protein'], protein: 'meat',
        ingredients: [['Alvocat', '150 g'], ['Pa integral de blat', '60 g'], ['Pernil cuit', '30 g'], ['Oli d’oliva verge extra', '5 ml']],
        steps: ['Torra el pa integral, unta’l amb l’alvocat i amaneix-lo amb l’oli. Posa-hi el pernil cuit al damunt.']
    },
    {
        id: 618, title: 'Nyoquis amb ou i mozzarella', originalTitle: 'Gnocchis con huevo y mozzarella',
        author: 'JessRealfooder', totalMinutes: 20, servings: 2, lists: ['easy'],
        types: ['lunch', 'dinner'], parts: ['carbs', 'protein'], protein: 'egg',
        ingredients: [['Mozzarella ratllada', '200 g'], ['Nyoquis', '200 g'], ['Ous', '100 g'], ['Mozzarella fresca lleugera', '100 g'],
            ['Orenga', '5 g'], ['Pebre blanc', '2 g'], ['Sal', '1 g'], ['Oli d’oliva verge extra', 'Una mica']],
        steps: ['Unta amb oli una paella apta per a forn. Reparteix-hi els nyoquis, la mozzarella ratllada, la fresca i els dos ous.',
            'Afegeix-hi orenga, sal i pebre blanc i enforna uns 15 minuts.'],
        dataNote: 'La preparació indica 15 minuts al forn i no n’especifica la temperatura.'
    },
    {
        id: 619, title: 'Fondue de formatge en pa amb poma i tomàquet', originalTitle: 'Avec plaisir',
        author: 'Marta212', totalMinutes: 23, servings: 4, lists: ['festive'],
        types: ['snack'], parts: ['carbs', 'protein'], protein: 'dairy',
        ingredients: [['Formatge per a fondue', '400 g'], ['Tomàquets cherry', '200 g'], ['Poma groga', '150 g'], ['Pa integral', '58 g']],
        dataNote: 'La fitxa indica 58 g de pa per a quatre racions. Per servir el formatge dins del pa cal una fogassa prou gran.',
        steps: ['Obre la fogassa i buida’n la molla. Reserva-la per torrar-la i sucar-la al formatge.',
            'Escalfa el formatge seguint les instruccions del paquet.',
            'Aboca’l dins del pa i embolica la fogassa amb paper d’alumini. Enforna-la uns 10 minuts a 180 °C. Pots torrar la molla al costat.',
            'Treu l’alumini, destapa la fogassa i gratina-la 5 minuts més.',
            'Serveix-la amb poma tallada, tomàquets cherry o altres verdures per sucar.']
    },
    {
        id: 620, title: 'Pizza amb base de carbassó', originalTitle: 'Pizza con base de calabacín',
        author: 'tonpetitchef', totalMinutes: 30, servings: 1, lists: ['festive'],
        types: ['lunch', 'dinner'], parts: ['carbs', 'protein', 'veg'], protein: 'egg',
        ingredients: [['Carbassó', '500 g'], ['Farina de civada', '60 g'], ['Tomàquets cherry', '60 g'], ['Ou', '50 g'],
            ['Ricotta', '50 g'], ['Nous pacanes', '30 g'], ['Espinacs', '20 g'], ['Alfàbrega seca', '5 g'],
            ['Orenga', '5 g'], ['Pebre negre', '3 g'], ['Sal', '1 g'], ['Oli d’oliva verge extra', 'Una mica']],
        variations: ['La preparació també proposa farina de fajol per a la base.'],
        steps: ['Preescalfa el forn a 180 °C. Ratlla el carbassó i esprem-lo bé dins un drap de cuina.',
            'Barreja el carbassó amb l’ou, la farina i els condiments fins a tenir una massa compacta. Si és massa líquida, afegeix-hi una mica de farina.',
            'Unta el paper de forn amb un rajolí d’oli, estén-hi la massa i enforna-la 10 minuts.',
            'Cobreix la base amb ricotta, espinacs, tomàquets cherry i nous. Enforna-la uns 10 minuts més, fins que les vores es daurin.']
    },
    {
        id: 621, title: 'Pizza de blat de moro, verdures i burrata', originalTitle: 'Pizza de maíz, verduras y burrata',
        author: 'urivalles', createdByUser: true, publicInSource: true, totalMinutes: 30, servings: 1, lists: ['festive'],
        types: ['lunch', 'dinner'], parts: ['carbs', 'protein', 'veg'], protein: 'dairy',
        ingredients: [['Burrata', '100 g'], ['Aigua', '80 ml'], ['Farina de blat de moro', '56 g'],
            ['Ceba dolça', '50 g'], ['Tomàquet triturat', '50 g'], ['Xampinyons', '20 g'], ['Espàrrecs verds', '20 g'],
            ['Sal', 'Una mica'], ['Llevat', 'Una mica']],
        optional: [['Vi blanc', '¼ de got']],
        dataNote: 'La fitxa declara la pizza sense gluten. La preparació parla de farina i aigua a parts iguals. Aquí es conserven les quantitats de la llista. El repòs de 30 minuts és opcional.',
        steps: ['Preescalfa el forn a 200 °C. Barreja la farina, l’aigua, la sal i el llevat fins a tenir una massa consistent.',
            'Deixa-la reposar mitja hora si tens temps. Aplana-la sobre paper de forn i cou la base sola 10 minuts.',
            'Mentrestant, talla i sofregeix la ceba, els xampinyons i els espàrrecs. Si hi poses vi blanc, aboca’l cinc minuts abans del tomàquet.',
            'Quan la base sigui cruixent, cobreix-la amb les verdures i torna-la a enfornar 5 minuts.',
            'Treu-la del forn i acaba-la amb la burrata.']
    },
    {
        id: 622, title: 'Edamame amb tres amaniments', originalTitle: 'Edamames',
        author: 'MyRealFood', reviewed: true, totalMinutes: 10, servings: 1, lists: ['snacks'],
        types: ['snack', 'side'], parts: ['protein'], protein: 'legumes',
        ingredients: [['Edamame en beina', '100 g']],
        optional: [['Oli d’oliva verge extra', '5 ml'], ['Salsa de soja', '5 g'], ['Vinagre d’arròs', '5 g'],
            ['Curri', '1 g'], ['Pebre vermell de La Vera', '1 g'], ['Escates de sal', 'Al gust']],
        steps: ['Bull les beines 3–5 minuts i refreda-les amb aigua freda o gel.',
            'Tria un amaniment: salsa de soja amb vinagre d’arròs, oli amb pebre vermell i escates de sal, o curri. Es mengen els grans de dins.']
    },
    {
        id: 623, title: 'Base de pizza exprés de fajol i formatge fresc', originalTitle: 'Pizza express con sólo 2 ingredientes',
        author: 'Mermeladaaa', totalMinutes: 27, servings: 4, lists: ['snacks'],
        types: ['base'], parts: ['carbs'],
        ingredients: [['Farina de fajol', '200 g'], ['Formatge fresc batut', '200 g'], ['Sal', '3 g']],
        dataNote: 'La foto ensenya una pizza acabada. Les quantitats de la fitxa corresponen a la base.',
        variations: ['Pots fer servir iogurt grec en lloc del formatge fresc batut. L’autora també indica que es pot canviar la farina.'],
        steps: ['Barreja la farina, el formatge fresc i la sal fins a tenir una massa homogènia.',
            'Enfarina lleugerament el paper de forn i estira-hi la massa amb un corró.',
            'Afegeix els ingredients de cobertura que vulguis i enforna-la 20–25 minuts a 180 °C.']
    },
    {
        id: 624, title: 'Ou escalfat al microones', originalTitle: 'Huevo poché en 2 minutos (microondas)',
        totalMinutes: 4, lists: ['easy'], types: ['base', 'breakfast'], parts: ['protein'], protein: 'egg',
        ingredients: [['Ou', '']], incomplete: true
    },
    {
        id: 625, title: 'Boletes de formatge', originalTitle: 'Bolitas de queso',
        totalMinutes: 13, lists: ['snacks'], types: ['snack'], incomplete: true
    },
    {
        id: 626, title: 'Mantecados de tres ingredients', originalTitle: 'Mantecados con 3 ingredientes',
        lists: ['snacks'], types: ['snack', 'dessert'], incomplete: true
    },
    {
        id: 627, title: 'Paella valenciana', originalTitle: 'Paella Valenciana',
        lists: ['festive'], types: ['lunch', 'dinner'], parts: ['carbs'], incomplete: true
    },
    {
        id: 628, title: 'Mos amb cobertura de xocolata',
        lists: ['snacks'], types: ['snack', 'dessert'], incomplete: true,
        dataNote: 'Títol descriptiu provisional. A la captura de la col·lecció només es veu la foto.'
    },
    {
        id: 629, title: 'Crema fosca en un bol',
        lists: ['snacks'], types: ['snack', 'dessert'], incomplete: true,
        dataNote: 'Títol descriptiu provisional. A la captura de la col·lecció només es veu la foto.'
    }
].map(({ ingredients = [], optional, steps, totalMinutes, reviewed, lists, author, ...recipe }) => ({
    ...recipe, totalMinutes, time: totalMinutes ? `${totalMinutes} min` : '',
    collection: recipe.createdByUser ? 'mine' : 'recommended',
    sourceName: 'MyRealFood', author, sourceReviewed: reviewed === true, sourceLists: lists || [],
    seasons: recipe.seasons || ['Hivern', 'Primavera', 'Estiu', 'Tardor'],
    image: `photos/myrealfood/${recipe.id}.jpg`, photoNote: 'Foto de la recepta a MyRealFood, extreta de les captures aportades.',
    ingredients: ingredients.map(([item, qty]) => ({ item, qty })),
    optionalIngredients: optional?.map(([item, qty]) => ({ item, qty })),
    instructions: steps?.map((step, index) => `${index + 1}. ${step}`).join('\n'),
    dataNote: recipe.dataNote || (recipe.incomplete ? 'La recepta surt a la col·lecció de MyRealFood. Els ingredients, les racions i els passos estan pendents.' : '')
}));
