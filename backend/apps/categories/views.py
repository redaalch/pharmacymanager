from rest_framework import viewsets
from drf_spectacular.utils import OpenApiExample, OpenApiResponse, extend_schema, extend_schema_view

from .models import Categorie
from .serializers import CategorieSerializer

CATEGORIE_EXAMPLE = OpenApiExample(
    "Catégorie",
    value={
        "id": 1,
        "nom": "Antalgique",
        "description": "Traitement de la douleur et de la fièvre",
        "date_creation": "2026-04-30T12:23:02.207000+01:00",
    },
    response_only=True,
)
CATEGORIE_REQUEST_EXAMPLE = OpenApiExample(
    "Création catégorie",
    value={"nom": "Antalgique", "description": "Traitement de la douleur et de la fièvre"},
    request_only=True,
)
VALIDATION_ERROR = OpenApiResponse(description="Données invalides ou nom de catégorie déjà utilisé.")
NOT_FOUND_ERROR = OpenApiResponse(description="Catégorie introuvable.")


@extend_schema_view(
    list=extend_schema(
        summary="Liste des catégories",
        tags=["Catégories"],
        examples=[CATEGORIE_EXAMPLE],
    ),
    create=extend_schema(
        summary="Créer une catégorie",
        tags=["Catégories"],
        examples=[CATEGORIE_REQUEST_EXAMPLE, CATEGORIE_EXAMPLE],
        responses={201: CategorieSerializer, 400: VALIDATION_ERROR},
    ),
    retrieve=extend_schema(
        summary="Détail d'une catégorie",
        tags=["Catégories"],
        examples=[CATEGORIE_EXAMPLE],
        responses={200: CategorieSerializer, 404: NOT_FOUND_ERROR},
    ),
    update=extend_schema(
        summary="Modifier une catégorie",
        tags=["Catégories"],
        examples=[CATEGORIE_REQUEST_EXAMPLE, CATEGORIE_EXAMPLE],
        responses={200: CategorieSerializer, 400: VALIDATION_ERROR, 404: NOT_FOUND_ERROR},
    ),
    partial_update=extend_schema(
        summary="Modifier partiellement",
        tags=["Catégories"],
        examples=[CATEGORIE_REQUEST_EXAMPLE, CATEGORIE_EXAMPLE],
        responses={200: CategorieSerializer, 400: VALIDATION_ERROR, 404: NOT_FOUND_ERROR},
    ),
    destroy=extend_schema(
        summary="Supprimer une catégorie",
        tags=["Catégories"],
        responses={204: OpenApiResponse(description="Catégorie supprimée."), 404: NOT_FOUND_ERROR},
    ),
)
class CategorieViewSet(viewsets.ModelViewSet):
    """CRUD complet sur les catégories."""

    queryset = Categorie.objects.all()
    serializer_class = CategorieSerializer
    search_fields = ["nom"]
    ordering_fields = ["nom", "date_creation"]
