# PharmaManager

Application de gestion de pharmacie — MVP développé pour le test technique SMARTHOLOL.

Permet la gestion complète du catalogue de médicaments, des catégories, des ventes
multi-articles avec déduction atomique du stock, et des alertes de réapprovisionnement.

## Stack

- **Backend** — Django 5 · Django REST Framework · PostgreSQL · drf-spectacular
- **Frontend** — React (Vite + TypeScript) · Axios · React Query
- **Documentation API** — Swagger UI sur `/api/schema/swagger-ui/`

## Structure du dépôt


## Pré-requis

- Python 3.10+
- Node.js 18+
- PostgreSQL 14+ (ou Docker)

## Installation Backend

```bash
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
