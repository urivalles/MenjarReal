# Treballar amb MenjarReal

El repositori de GitHub és la referència compartida de MenjarReal quan es treballa des de Visual Studio Code, Codex Cloud o ChatGPT al mòbil. La branca publicada és `main`. Prioritza GitHub Pages davant de Netlify mentre el desplegament estàtic cobreixi les necessitats de l’app. [Repositori](https://github.com/urivalles/MenjarReal) · [Aplicació](https://urivalles.github.io/MenjarReal/)

## Abans de qualsevol tasca

1. Consulta aquest fitxer, [CONTEXT.md](CONTEXT.md), [ROADMAP.md](ROADMAP.md) i [CHANGELOG.md](CHANGELOG.md), juntament amb l’estat actual de GitHub. Respecta els acords previs i comprova si la feina ja està feta o en curs.
2. Si hi ha una còpia local, abans d’editar recorda a l’usuari que cal comprovar si està al dia. Executa `git status --short --branch` i, quan tinguis accés a GitHub, `git fetch origin`. Compara la branca local amb la seva referència remota, habitualment `origin/main`. Indica si cal un `git pull --ff-only` i fes-lo quan la còpia sigui neta i pugui avançar directament.
3. Si hi ha canvis locals o les branques han divergit, preserva la feina existent i explica la situació abans d’integrar canvis. En un entorn sense còpia local, consulta directament la branca i els documents via GitHub. Si el remot és inaccessible o no es pot verificar, informa’n amb precisió.

## Arquitectura

MenjarReal és una aplicació web instal·lable en català. L’HTML, el CSS, els scripts i els recursos se serveixen com a web estàtic, sense servidor d’aplicació ni pas de compilació. Per provar-la, serveix l’arrel via HTTP local. Revisa l’ordre de càrrega dels scripts a `index.html`.

| Àmbit | Fitxers |
| --- | --- |
| Interfície i estils | `index.html`, `app.js`, `styles.css`, `icons.css` |
| Dades del receptari | `recipes.js`, `seasonal-recipes.js`, `myrealfood-recipes.js`, `everyday-recipes.js`, `photos/` |
| Cerca, classificació i gluten | `recipe-catalog.js`, `recipe-classification.js`, `gluten-guide.js` |
| Menú, importació i compra | `weekly-planner.js`, `menu-import.js`, `menu-import-ui.js`, `shopping-list.js` |
| Emmagatzematge i còpies | `app-data.js` |
| Consells i dictat local | `tips-engine.js`, `tips-assistant.js` |
| Instal·lació i memòria cau | `manifest.webmanifest`, `pwa.js`, `sw.js`, `icons/` |

Quan canviïn recursos distribuïts, revisa `APP_FILES` i actualitza `BUILD_VERSION` de `sw.js` perquè la versió pugui servir-se correctament amb i sense connexió. Mantén estables els identificadors de receptes perquè els menús, les notes, els estats i les adopcions hi fan referència.

## Dades i publicació

- Preserva les dades del navegador durant les actualitzacions. Revisa la compatibilitat amb registres anteriors i còpies JSON quan canviïs el desament. Comprova els canvis amb dades de prova i deixa les dades de l’usuari intactes.
- Exclou de la publicació les dades personals, les credencials, les converses privades, les còpies de seguretat del navegador i els documents originals d’ús privat. Registra a GitHub només els acords de producte i els recursos destinats a l’app. Revisa què queda preparat per al commit.
- Minimitza les intervencions manuals. Resol les decisions reversibles dins l’abast, prova els fluxos afectats i demana intervenció quan calgui autorització o una decisió de l’usuari.

## Tancament de la feina

1. Verifica els canvis abans de donar-los per fets. Quan una comprovació quedi pendent, indica què falta i el motiu. Registra les tasques bloquejades o incompletes a [ROADMAP.md](ROADMAP.md) amb el pas concret que permetria reprendre-les.
2. Després de cada canvi o decisió rellevant, revisa els quatre documents, també quan la tasca sigui només documental. Actualitza aquest fitxer si canvia el procediment, [CONTEXT.md](CONTEXT.md) si canvien els acords, [ROADMAP.md](ROADMAP.md) si canvia l’estat de la feina i [CHANGELOG.md](CHANGELOG.md) per deixar constància del que s’ha fet.
3. Quan una conversa concreti criteris duradors, presenta a l’usuari un resum amb el text proposat i espera que el confirmi o el corregeixi abans de desar-los a [CONTEXT.md](CONTEXT.md). Es pot continuar la feina de l’app mentre es revisa el resum.
4. Fes un commit amb els fitxers de la tasca i sincronitza el codi i la documentació amb GitHub. L’usuari ha autoritzat el `git push` de cada tasca acabada. Comprova que el commit hagi arribat a la branca remota. Si el canvi afecta el web públic, comprova el desplegament quan estigui disponible i informa si queda pendent.
