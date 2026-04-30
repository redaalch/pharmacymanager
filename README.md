# PharmaManager

Application de gestion de pharmacie — MVP développé pour le test technique SMARTHOLOL.

Permet la gestion complète du catalogue de médicaments, des catégories, des ventes
multi-articles avec déduction atomique du stock, et des alertes de réapprovisionnement.

## Stack

- **Backend** — Django 5 · Django REST Framework · PostgreSQL · drf-spectacular
- **Frontend** — React (Vite + TypeScript) · Axios · React Query
- **Documentation API** — Swagger UI sur `/api/schema/swagger-ui/`

## Structure du dépôt

    pharmacymanager/
    ├── backend/          # API Django REST
    ├── frontend/         # Application React
    └── docs/             # Brief technique et documents projet

## Pré-requis

- Python 3.10+
- Node.js 18+
- PostgreSQL 14+ (ou Docker)

## Démarrage Docker Compose

Pour lancer PostgreSQL, l'API Django et le frontend Vite en une commande :

~~~bash
docker compose up --build
~~~

Si votre installation Docker exige les droits administrateur, utilisez `sudo docker compose up --build`.

Le backend applique les migrations et recharge les données de démonstration au démarrage.

- Frontend : `http://localhost:5173`
- API : `http://127.0.0.1:8000/api/v1/`
- Swagger : `http://127.0.0.1:8000/api/schema/swagger-ui/`
- PostgreSQL exposé en local sur le port `5433` pour éviter les conflits avec une base locale sur `5432`.

Pour arrêter et supprimer les volumes de développement :

~~~bash
docker compose down -v
~~~

## Variables d'Environnement

Backend (`backend/.env`) :

- `SECRET_KEY` — clé secrète Django.
- `DEBUG` — `True` en développement, `False` en production.
- `ALLOWED_HOSTS` — hôtes autorisés par Django, séparés par des virgules.
- `CORS_ALLOWED_ORIGINS` — origines frontend autorisées, séparées par des virgules.
- `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_PORT` — connexion PostgreSQL.

Frontend (`frontend/.env`) :

- `VITE_API_URL` — URL de l'API, par défaut `http://127.0.0.1:8000/api/v1`.

## Installation Backend

~~~bash
cd backend

# 1. Environnement virtuel
python -m venv venv
source venv/bin/activate          # Linux/Mac
# venv\Scripts\activate           # Windows

# 2. Dépendances
pip install -r requirements.txt

# 3. Variables d'environnement
cp .env.example .env
# éditer .env avec vos identifiants Postgres

# 4. Base de données (option Docker)
docker run -d --name pharma-pg \
  -e POSTGRES_DB=pharma -e POSTGRES_USER=pharma -e POSTGRES_PASSWORD=pharma_dev \
  -p 5432:5432 postgres:16

# 5. Migrations et données de démo
python manage.py migrate
python manage.py loaddata seed

# 6. Lancer le serveur
python manage.py runserver
~~~

L'API est disponible sur `http://127.0.0.1:8000/api/v1/`.
La documentation Swagger est sur `http://127.0.0.1:8000/api/schema/swagger-ui/`.

## Tests Backend

~~~bash
cd backend
source venv/bin/activate
python manage.py test apps.medicaments apps.ventes
~~~

## Installation Frontend

~~~bash
cd frontend
npm install
cp .env.example .env              # configurer VITE_API_URL si besoin
npm run dev
~~~

L'application est disponible sur `http://localhost:5173`.

## Endpoints principaux

| Méthode | Endpoint | Description |
|---|---|---|
| GET / POST | `/api/v1/categories/` | Liste / création de catégories |
| GET / POST | `/api/v1/medicaments/` | Liste paginée / création de médicaments |
| GET | `/api/v1/medicaments/alertes/` | Médicaments sous le seuil de stock |
| DELETE | `/api/v1/medicaments/{id}/` | Soft delete (`est_actif=False`) |
| GET / POST | `/api/v1/ventes/` | Historique / création d'une vente |
| POST | `/api/v1/ventes/{id}/annuler/` | Annulation et réintégration du stock |

Filtres pris en charge : `?categorie=`, `?ordonnance_requise=`, `?search=`,
`?ordering=`, `?date_min=YYYY-MM-DD`, `?date_max=YYYY-MM-DD`.

## Règles métier importantes

- **Snapshot du prix** — `LigneVente.prix_unitaire` est figé au moment de la vente.
- **Stock atomique** — la création de vente verrouille les médicaments
  (`SELECT FOR UPDATE`) et déduit le stock dans une transaction.
- **Soft delete** — médicaments et ventes ne sont jamais supprimés physiquement.
- **Référence auto-générée** — format `VNT-YYYY-NNNN` par année.

## Tests rapides (curl)

~~~bash
# Créer une catégorie
curl -X POST http://127.0.0.1:8000/api/v1/categories/ \
  -H "Content-Type: application/json" \
  -d '{"nom":"Antibiotique","description":"Anti-bactériens"}'

# Créer une vente
curl -X POST http://127.0.0.1:8000/api/v1/ventes/ \
  -H "Content-Type: application/json" \
  -d '{"lignes":[{"medicament_id":1,"quantite":2}]}'
~~~

## Auteur

Reda Alalach — test technique SMARTHOLOL, avril 2026.
