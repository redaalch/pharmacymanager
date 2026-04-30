# PharmaManager - Backlog leger

Derniere mise a jour : 2026-04-30

> Ce document a ete redige au debut du projet pour planifier le travail.
> Il est tenu a jour au fur et a mesure que les elements sont livres.

Ce backlog reste volontairement simple. Le but n'est pas de faire un faux Jira, mais de garder une trace claire de ce qui doit etre livre pour le test technique SMARTHOLOL.

Etat final du projet :

- Prototype frontend en React/Vite : cable a l'API, plus aucune donnee `localStorage`.
- Backend Django REST : implemente, teste, documente via Swagger.
- Integration frontend/backend : terminee sur les 5 pages (Dashboard, Medicaments, Ventes, Categories, Alertes).
- Docker Compose, fixtures et tests unitaires en place.

## Priorite 1 - MVP demande dans le PDF

| ID | Statut | Element | Resultat |
| --- | --- | --- | --- |
| B-01 | ✅ Fait | Initialiser le backend Django | `backend/` avec DRF, PostgreSQL, settings split (`config/settings/base.py` + `local.py`) et `python-decouple`. |
| B-02 | ✅ Fait | Modeliser les categories | Modele `Categorie` avec `Meta.ordering`, migration et CRUD complet. |
| B-03 | ✅ Fait | Modeliser les medicaments | Tous les champs du PDF, FK `PROTECT` vers `Categorie`, soft delete via `MedicamentManager`. |
| B-04 | ✅ Fait | API medicaments | ViewSet CRUD, filtres `categorie` / `ordonnance_requise`, recherche `nom`/`dci`, soft delete sur DELETE. |
| B-05 | ✅ Fait | Alertes de stock | `@action` `/api/v1/medicaments/alertes/` avec `stock_actuel__lte=F("stock_minimum")`. |
| B-06 | ✅ Fait | Modeliser les ventes | `Vente` (reference auto `VNT-YYYY-NNNN`) + `LigneVente` avec `prix_unitaire` snapshot. |
| B-07 | ✅ Fait | Creation de vente | Transaction atomique avec `select_for_update`, calcul du total et deduction du stock. |
| B-08 | ✅ Fait | Annulation de vente | Action `/annuler/` qui repasse en `annulee` et reintegre le stock une seule fois. |
| B-09 | ✅ Fait | Swagger | `drf-spectacular` avec tags, summaries, `OpenApiExample` request/response et codes 400/404. |
| B-10 | ✅ Fait | Donnees de test | `apps/categories/fixtures/seed.json` (categories + medicaments) chargee via `loaddata seed`. |
| B-11 | ✅ Fait | README backend | Section "Installation Backend" detaillee, variables d'environnement listees, commande de tests. |

## Priorite 2 - Raccorder le frontend au backend

| ID | Statut | Element | Resultat |
| --- | --- | --- | --- |
| F-01 | ✅ Fait | Ajouter la couche API | `src/api/axiosConfig.ts`, `categoriesApi`, `medicamentsApi`, `ventesApi`. |
| F-02 | ✅ Fait | Hooks de donnees | `useCategories`, `useMedicaments`, `useVentes` bases sur React Query (mutations, invalidation). |
| F-03 | ✅ Fait | Remplacer `localStorage` | Plus aucune page n'utilise les donnees locales. `usePharmacyManager`, `useLocalStorageState` et `data/pharmacy.ts` supprimes. |
| F-04 | ✅ Fait | Messages utilisateur | Etats `isLoading` / `isError` / `isPending` sur chaque requete, `Alert` Mantine pour les erreurs API et `ErrorBoundary` global. |
| F-05 | ✅ Fait | Variable d'environnement | `VITE_API_URL` documentee dans `frontend/.env.example`. |

## Priorite 3 - Qualite et finition

| ID | Statut | Element | Resultat |
| --- | --- | --- | --- |
| Q-01 | ✅ Fait | Tests minimum backend | 6 tests `APITestCase` (medicaments + ventes) couvrent stock, snapshot prix, soft delete et annulation. |
| Q-02 | ✅ Fait | Verification manuelle | Endpoints testes via Swagger UI et `curl`. |
| Q-03 | ✅ Fait | Nettoyage Git | 32 commits conventionnels, `.gitignore` complet (venv, node_modules, .env, __pycache__). |
| Q-04 | ✅ Fait | README racine | Procedure complete : Docker Compose, install backend, install frontend, variables d'env. |

## Bonus realises

- ✅ Filtres avances avec `django-filter` (categorie, ordonnance, date_min/date_max sur ventes, statut).
- ✅ Docker Compose pour lancer Postgres + backend + frontend en une commande.
- ✅ Tests unitaires Django (six scenarios couvrant la logique metier sensible).

## Bonus non realises (volontairement)

- Authentification JWT : non demandee par le brief, scope inutilement elargi.
- Export CSV de l'inventaire ou des ventes.
- Pagination personnalisee avec metadonnees enrichies.
