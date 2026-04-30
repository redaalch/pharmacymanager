# PharmaManager - Backlog leger

Derniere mise a jour : 2026-04-29

Ce backlog reste volontairement simple. Le but n'est pas de faire un faux Jira, mais de garder une trace claire de ce qui doit etre livre pour le test technique SMARTHOLOL.

Etat actuel du projet :

- Prototype frontend en React/Vite : fait, mais encore base sur `localStorage`.
- Board de system design : prepare dans un dossier separe.
- Backend Django REST : pas encore implemente.
- Integration frontend/backend : pas encore commencee.

## Priorite 1 - MVP demande dans le PDF

| ID | Statut | Element | Resultat attendu |
| --- | --- | --- | --- |
| B-01 | A faire | Initialiser le backend Django | Projet `backend/` avec DRF, PostgreSQL, settings separes et variables d'environnement. |
| B-02 | A faire | Modeliser les categories | Modele `Categorie`, migration, admin et CRUD API. |
| B-03 | A faire | Modeliser les medicaments | Tous les champs du PDF, relation avec categorie, soft delete avec `est_actif`. |
| B-04 | A faire | API medicaments | Liste, detail, creation, modification, suppression logique, recherche/filtres utiles. |
| B-05 | A faire | Alertes de stock | Endpoint `/api/v1/medicaments/alertes/` avec la regle `stock_actuel <= stock_minimum`. |
| B-06 | A faire | Modeliser les ventes | Modeles `Vente` et `LigneVente`, reference unique, statut, total, lignes. |
| B-07 | A faire | Creation de vente | Enregistrer plusieurs lignes, figer `prix_unitaire`, calculer `sous_total` et deduire le stock. |
| B-08 | A faire | Annulation de vente | Passer la vente en `Annulee` et reintegrer le stock sans supprimer l'historique. |
| B-09 | A faire | Swagger | Documenter les endpoints avec descriptions, tags, exemples et erreurs principales. |
| B-10 | A faire | Donnees de test | Ajouter des fixtures ou un seed simple pour tester rapidement l'application. |
| B-11 | A faire | README backend | Documenter installation, `.env`, migrations, fixtures et lancement du serveur. |

## Priorite 2 - Raccorder le frontend au backend

| ID | Statut | Element | Resultat attendu |
| --- | --- | --- | --- |
| F-01 | A faire | Ajouter la couche API | `src/api/axiosConfig`, fonctions medicaments, categories et ventes. |
| F-02 | A faire | Ajouter les hooks de donnees | Hooks dedies pour charger, creer, modifier et annuler avec etats loading/error. |
| F-03 | A faire | Remplacer `localStorage` | Les pages utilisent l'API au lieu des donnees locales. |
| F-04 | A faire | Messages utilisateur | Afficher clairement erreurs API, succes et etats vides. |
| F-05 | A faire | Variable d'environnement | `VITE_API_BASE_URL` documente dans `.env.example`. |

## Priorite 3 - Qualite et finition

| ID | Statut | Element | Resultat attendu |
| --- | --- | --- | --- |
| Q-01 | A faire | Tests minimum backend | Tester serializers et logique sensible des ventes. |
| Q-02 | A faire | Verification manuelle | Tester les endpoints principaux dans Swagger. |
| Q-03 | A faire | Nettoyage Git | Commits courts et conventionnels, pas de secrets, pas de `node_modules`. |
| Q-04 | A faire | README racine | Donner une procedure claire pour lancer backend + frontend. |

## Bonus possibles seulement apres le MVP

- Authentification JWT.
- Filtres avances avec `django-filter`.
- Export CSV inventaire ou ventes.
- Docker Compose.
- Pagination personnalisee.

