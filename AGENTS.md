# Treballar amb MenjarReal en més d’un ordinador

Quan l’usuari reprengui MenjarReal i demani canvis, recorda-li abans d’editar que cal comprovar si té la versió més recent de GitHub. Revisa la branca i els canvis locals amb `git status --short --branch` i, si hi ha accés a GitHub, actualitza les referències amb `git fetch origin` per comparar amb la branca remota.

Si la còpia local és neta i es pot avançar directament, indica si cal fer `git pull --ff-only`. Si hi ha canvis locals o les branques han divergit, explica la situació i preserva la feina existent. Si GitHub no és accessible, indica que la sincronització no s’ha pogut comprovar.

Quan acabis i verifiquis els canvis demanats a MenjarReal, fes un commit amb els fitxers de la tasca i puja’l a GitHub amb `git push`. L’usuari ha autoritzat fer-ho cada vegada. Comprova que el commit hagi arribat a la branca remota i informa l’usuari si la publicació queda pendent.

## Decisions de producte entre converses

Quan una conversa concreti criteris duradors per al receptari o el menú, presenta a l’usuari un resum breu amb el text que proposes desar. Demana-li que el confirmi o el corregeixi. L’aprovació cal abans d’escriure aquestes notes i es pot continuar la feina demanada a l’app mentre el resum es revisa.

Quan l’usuari aprovi el resum, incorpora els punts aprovats a `PREFERENCIES.md` a l’arrel del projecte. Si ja hi ha un criteri sobre el mateix tema, actualitza’l. Consulta aquest fitxer quan una tasca depengui de les preferències del receptari o del planificador.
