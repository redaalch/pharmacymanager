# Sprint 1 - Backend MVP

Ce sprint sert a poser la base solide du projet. Le frontend existe deja comme prototype local, donc la prochaine vraie valeur est le backend : modeles, API REST, logique de stock et Swagger.

## Objectif du sprint

Livrer une premiere version backend utilisable de PharmaManager avec :

- CRUD categories.
- CRUD medicaments avec soft delete.
- Alertes de stock bas.
- Creation de ventes avec deduction du stock.
- Annulation de ventes avec reintegration du stock.
- Swagger consultable pour verifier les endpoints.

## Duree proposee

1 à 2 jours de travail, selon le temps disponible.

Ce n'est pas un sprint Scrum strict. C'est plutot une petite iteration de stage : une liste claire, un objectif clair, et une verification a la fin.

## Taches selectionnees

| Jour | Focus | Livrable attendu |
| --- | --- | --- |
| 1 | Initialisation backend | Projet Django, settings, PostgreSQL, DRF, drf-spectacular, `.env.example`. |
| 1 | Categories + medicaments | Modeles, migrations, serializers, ViewSets et endpoints de base. |
| 1 | Ventes | Modeles `Vente` / `LigneVente`, creation de vente et calcul du total. |
| 2 | Logique stock | Deduction de stock, annulation de vente, reintegration, validations metier. |
| 2 | Swagger + donnees de test | Documentation API, fixtures/seed, verification manuelle dans Swagger. |
| 2 | Buffer | Corrections, README, nettoyage et commits propres. |

## Definition de reussite

Le sprint est reussi si je peux :

- lancer le backend localement ;
- ouvrir Swagger sur `/api/schema/swagger-ui/` ;
- creer une categorie ;
- creer un medicament ;
- voir les medicaments en alerte de stock ;
- creer une vente avec plusieurs lignes ;
- verifier que le stock baisse apres la vente ;
- annuler la vente ;
- verifier que le stock revient correctement.

## Hors scope pour ce sprint

Ces points sont importants, mais je les garde pour apres le backend MVP :

- connexion complete du frontend a l'API ;
- authentification JWT ;
- Docker Compose ;
- export CSV ;
- interface admin avancee.

## Risques a surveiller

- La logique de stock doit etre transactionnelle pour eviter les incoherences.
- `prix_unitaire` dans `LigneVente` doit rester un snapshot, pas une valeur recalculée depuis le medicament.
- Swagger doit etre ecrit au fur et a mesure, sinon il devient facile de l'oublier a la fin.
- Le projet ne doit pas rester un prototype frontend : le backend est le coeur de l'evaluation.

