# Treballar amb MenjarReal en més d’un ordinador

Quan l’usuari reprengui MenjarReal i demani canvis, recorda-li abans d’editar que cal comprovar si té la versió més recent de GitHub. Revisa la branca i els canvis locals amb `git status --short --branch` i, si hi ha accés a GitHub, actualitza les referències amb `git fetch origin` per comparar amb la branca remota.

Si la còpia local és neta i es pot avançar directament, indica si cal fer `git pull --ff-only`. Si hi ha canvis locals o les branques han divergit, explica la situació i preserva la feina existent. Si GitHub no és accessible, indica que la sincronització no s’ha pogut comprovar.
