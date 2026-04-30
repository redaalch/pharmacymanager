# Definition of Done

Cette Definition of Done est volontairement courte. Pour ce projet, je veux surtout eviter les taches "presque finies" : code ecrit mais non teste, Swagger oublie, ou README pas a jour.

Une tache est terminee seulement si les points ci-dessous sont vrais.

## Backend

- Le code est implemente dans le bon module Django.
- Les migrations sont creees et appliquees sans conflit.
- Les serializers valident les donnees importantes.
- Les erreurs principales retournent un statut HTTP coherent.
- Les endpoints sont testables dans Swagger ou avec un client API.
- La documentation Swagger est mise a jour pour les endpoints touches.
- Aucune valeur sensible n'est ecrite en dur dans le code.

## Logique metier

- La creation d'une vente deduit correctement le stock.
- L'annulation d'une vente reintegre correctement le stock.
- Une vente annulee ne peut pas etre annulee deux fois avec un double retour de stock.
- `LigneVente.prix_unitaire` garde le prix au moment de la vente.
- Les medicaments en alerte respectent la regle `stock_actuel <= stock_minimum`.

## Frontend

- Les composants UI ne font pas d'appels API directement.
- Les appels reseau passent par `src/api/`.
- Les etats loading, error et empty sont visibles quand c'est utile.
- L'URL backend vient de l'environnement, pas d'une valeur codee en dur.
- Les actions importantes donnent un retour clair a l'utilisateur.

## Documentation

- Le README est mis a jour si l'installation ou le lancement change.
- `.env.example` contient les variables necessaires.
- Les decisions importantes sont notees dans `docs/` quand elles peuvent aider l'evaluation.
- Les commandes de verification sont indiquees clairement.

## Git

- Le commit est court et comprehensible.
- Le message suit l'esprit Conventional Commits, par exemple `feat(ventes): create sale with stock deduction`.
- Le commit ne contient pas `.env`, `node_modules`, fichiers temporaires ou secrets.
- Les changements non lies a la tache restent hors du commit.

## Verification finale avant soumission

- Backend lance sans erreur.
- Frontend lance sans erreur.
- Swagger accessible.
- Scenario manuel teste : creer medicament -> creer vente -> stock baisse -> annuler vente -> stock revient.
- README racine suffisant pour qu'une autre personne lance le projet.

