# Full de ruta de MenjarReal

## Implementat

| Àmbit | Estat actual |
| --- | --- |
| Receptari | 96 fitxes incorporades, incloent-hi 29 de MyRealFood amb foto, 8 receptes ràpides de peix i 8 guarnicions de verdura afegides en l’última ampliació. Cerca, col·leccions, adopcions, filtres, notes, receptes personals i fotos. |
| Cuina | Racions ajustables, passos guiats i temporitzador. Orientació sobre gluten a les fitxes que disposen de revisió. |
| Menú | Dinars i sopars per dia, tria manual, fixació d’àpats, generació de buits o d’àpats no fixats, varietat de proteïnes, *batch cooking* i menús desats. Importació de text amb revisió prèvia i suggeriments per als buits. |
| Nevera i compra | Coincidència de receptes amb la nevera, incorporació a la compra dels ingredients que falten i quantitats recalculades des del menú. Les edicions manuals es conserven en recalcular la compra. |
| Consells | Recordatoris contextuals amb entrada de text i dictat quan el navegador admet el reconeixement local en català. |
| Instal·lació i dades | Aplicació web instal·lable amb funcionament sense connexió per als recursos incorporats. Dades per navegador i còpia JSON amb previsualització abans de restaurar. |
| Tutorial | Guia de vuit apartats, accessible des de Receptes i Opcions, amb exemples i dreceres a les pantalles. Disponible sense connexió. |
| Continuïtat | Instruccions, context, full de ruta i historial versionats a GitHub. |

L’inventari detalla les fitxes i les fonts del catàleg. [Inventari del receptari](RECEPTARI.md)

- **Simplificació de la interfície, 26 de novembre de 2026.** S’han eliminat els textos introductoris redundants de cinc pantalles; s’ha actualitzat la versió de la memòria cau per distribuir la nova interfície. Comprovació visual al mòbil pendent; els avisos explicatius de Compra s'han traslladat al tutorial.

- **Consells compactats, 26 de novembre de 2026.** Eliminada l'explicació inicial redundant. Comprovació visual al mòbil pendent.

- **Actualitzacions i Opcions, 26 de novembre de 2026.** Menú compacte d’engranatge, comprovació manual amb resultat explícit i comprovació inicial. Cal validar el flux al mòbil i el cas d’una nova versió disponible.\n\n## Pendent de completar

| Tasca | Estat i pas per reprendre-la |
| --- | --- |
| Completar les fitxes parcials de MyRealFood | **Bloquejada per manca de font.** Hi ha set fitxes amb informació parcial i falta la quantitat de pasta en una fitxa de pesto. Calen les captures que mostrin els ingredients, les racions o els passos que falten. També falta confirmar quins plats hi havia a «Mis favoritas» i «Sopars». |
| Ampliar els esmorzars | **Millora identificada.** A les col·leccions principals hi ha dues fitxes d’esmorzar amb prou informació per preparar-les. L’inventari permet revisar la cobertura abans de decidir noves incorporacions. |
| Comprovar el dictat local en dispositius i navegadors | **Verificació pendent.** El codi comprova la disponibilitat del reconeixement local. Cal provar el flux complet en un dispositiu compatible amb el paquet de català disponible. |

## Verificació i incidències

- **Ampliació del catàleg i del menú, 26 de novembre de 2026.** Es van provar els filtres al navegador, la generació dels 14 àpats i la recàrrega sense connexió. També es van comprovar amb dades de prova els àpats fixats, el límit de temps, els blocs de *batch cooking* i l’escalat d’ingredients de la compra. Es va verificar que GitHub Pages servia el catàleg nou.
- **Revisió de continuïtat, 26 de novembre de 2026.** Es van comprovar les referències, les xifres del catàleg i l’abast documental del canvi.
- **Tutorial, 26 de novembre de 2026.** Es van comprovar els vuit apartats, les dreceres, el retorn del focus, el format mòbil i d’escriptori i l’accés sense connexió a Chrome.
