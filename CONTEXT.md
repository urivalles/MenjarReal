# Context de MenjarReal

MenjarReal és un receptari personal en català per triar què cuinar, planificar dinars i sopars, aprofitar els ingredients de la nevera i preparar la compra. El projecte busca que sigui fàcil menjar variat entre setmana amb plats que l’usuari cuinaria de debò. [Aplicació](https://urivalles.github.io/MenjarReal/)

## Preferències i decisions acordades

- Fer servir poques etiquetes. **Testada** agrupa «Feta per mi», «Provada per mi» i els «Triomfs» importats de MyRealFood. **Revisada per MyRealFood** identifica el segell de la font.
- **Dia festiu** identifica receptes més energètiques quan hi ha prou dades. El llindar orientatiu del receptari és de **700 kcal per ració**. Per aplicar-lo cal conèixer la ració o poder calcular-la a partir de la base declarada.
- Prioritzar receptes senzilles, ràpides i equilibrades, amb varietat de peix, llegums i guarnicions de verdura. Una combinació com salmó a la planxa, patata i amanida és una entrada útil amb racions, temps i ingredients.
- Classificar les receptes pel tipus d’àpat o el paper al plat i pels ingredients principals. Si la verdura ja és a punt, el filtre **Ja tinc verdura · hidrats i proteïna** ajuda a trobar què hi pot anar. Les coquetes de patata i formatge o l’orada amb moniato en són exemples. Les natilles de caqui poden sortir a berenars i a postres.
- El menú setmanal genera **dinars i sopars**. Els esmorzars, els berenars, les postres i les guarnicions es consulten al receptari. El generador afavoreix la varietat de fonts de proteïna i d’espècies de peix, dona preferència als plats ràpids amb verdura, hidrats i proteïna i respecta les preferències, els plats fixats i els blocs de *batch cooking*. Els plats de dia festiu es poden triar manualment.
- En integrar fonts externes, conserva les dades de la recepta, l’autoria i la procedència. Si una captura és parcial, indica què falta. Les 29 fitxes de MyRealFood ja aprofiten les fotos que es podien recuperar. [Inventari del receptari](RECEPTARI.md)

El primer resum aprovat d’aquests criteris es conserva a [PREFERENCIES.md](PREFERENCIES.md). Les decisions aprovades a partir d’ara es mantenen al context del projecte.

## Context compartit i dades de l’app

El codi i els acords de producte es comparteixen per GitHub entre Visual Studio Code, Codex Cloud i ChatGPT al mòbil. El pas acordat per a cada decisió duradora és presentar un resum, obtenir la confirmació i incorporar els punts aprovats al repositori. [Metodologia de treball](AGENTS.md)

Les receptes afegides a mà, les notes, les fotos carregades, els estats, la nevera, el menú, la compra i les preferències de l’app es desen al navegador. L’exportació i restauració d’una còpia JSON permet traslladar aquestes dades a un altre dispositiu. En restaurar una còpia se substitueix l’estat actual del navegador. [Desament i còpies](app-data.js)
