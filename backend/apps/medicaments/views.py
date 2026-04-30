from django.db.models import F
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from drf_spectacular.utils import OpenApiExample, OpenApiResponse, extend_schema, extend_schema_view

from .models import Medicament
from .serializers import MedicamentSerializer

MEDICAMENT_EXAMPLE = OpenApiExample(
    "Médicament",
    value={
        "id": 1,
        "nom": "Amoxicilline",
        "dci": "Amoxicilline",
        "categorie": {"id": 1, "nom": "Antibiotique", "description": "Anti-bactériens"},
        "forme": "comprimé",
        "dosage": "500mg",
        "prix_achat": "10.00",
        "prix_vente": "15.00",
        "stock_actuel": 3,
        "stock_minimum": 10,
        "est_en_alerte": True,
        "date_expiration": "2027-01-01",
        "ordonnance_requise": True,
        "date_creation": "2026-04-30T12:27:21.136000+01:00",
        "est_actif": True,
    },
    response_only=True,
)
MEDICAMENT_REQUEST_EXAMPLE = OpenApiExample(
    "Création médicament",
    value={
        "nom": "Amoxicilline",
        "dci": "Amoxicilline",
        "categorie_id": 1,
        "forme": "comprimé",
        "dosage": "500mg",
        "prix_achat": "10.00",
        "prix_vente": "15.00",
        "stock_actuel": 25,
        "stock_minimum": 10,
        "date_expiration": "2027-01-01",
        "ordonnance_requise": True,
    },
    request_only=True,
)
VALIDATION_ERROR = OpenApiResponse(description="Données invalides, catégorie inconnue ou prix incohérent.")
NOT_FOUND_ERROR = OpenApiResponse(description="Médicament introuvable ou archivé.")


@extend_schema_view(
    list=extend_schema(
        summary="Liste des médicaments actifs (paginée)",
        tags=["Médicaments"],
        examples=[MEDICAMENT_EXAMPLE],
    ),
    create=extend_schema(
        summary="Créer un médicament",
        tags=["Médicaments"],
        examples=[MEDICAMENT_REQUEST_EXAMPLE, MEDICAMENT_EXAMPLE],
        responses={201: MedicamentSerializer, 400: VALIDATION_ERROR},
    ),
    retrieve=extend_schema(
        summary="Détail d'un médicament",
        tags=["Médicaments"],
        examples=[MEDICAMENT_EXAMPLE],
        responses={200: MedicamentSerializer, 404: NOT_FOUND_ERROR},
    ),
    update=extend_schema(
        summary="Modifier un médicament",
        tags=["Médicaments"],
        examples=[MEDICAMENT_REQUEST_EXAMPLE, MEDICAMENT_EXAMPLE],
        responses={200: MedicamentSerializer, 400: VALIDATION_ERROR, 404: NOT_FOUND_ERROR},
    ),
    partial_update=extend_schema(
        summary="Modifier partiellement",
        tags=["Médicaments"],
        examples=[MEDICAMENT_REQUEST_EXAMPLE, MEDICAMENT_EXAMPLE],
        responses={200: MedicamentSerializer, 400: VALIDATION_ERROR, 404: NOT_FOUND_ERROR},
    ),
    destroy=extend_schema(
        summary="Soft delete (est_actif=False)",
        tags=["Médicaments"],
        responses={204: OpenApiResponse(description="Médicament archivé."), 404: NOT_FOUND_ERROR},
    ),
)
class MedicamentViewSet(viewsets.ModelViewSet):
    """CRUD avec soft delete et alertes de stock bas."""

    queryset = Medicament.objects.all()
    serializer_class = MedicamentSerializer
    filterset_fields = ["categorie", "ordonnance_requise"]
    search_fields = ["nom", "dci"]
    ordering_fields = ["nom", "prix_vente", "stock_actuel", "date_expiration"]

    def perform_destroy(self, instance: Medicament) -> None:
        instance.est_actif = False
        instance.save(update_fields=["est_actif"])

    @extend_schema(
        summary="Médicaments dont le stock est sous le seuil",
        tags=["Médicaments"],
        examples=[MEDICAMENT_EXAMPLE],
    )
    @action(detail=False, methods=["get"], url_path="alertes")
    def alertes(self, request):
        """Retourne tous les médicaments actifs avec stock_actuel ≤ stock_minimum."""
        qs = self.get_queryset().filter(stock_actuel__lte=F("stock_minimum"))
        page = self.paginate_queryset(qs)
        serializer = self.get_serializer(page or qs, many=True)
        return self.get_paginated_response(serializer.data) if page else Response(serializer.data)
