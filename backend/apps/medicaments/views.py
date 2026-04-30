from django.db.models import F
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from drf_spectacular.utils import extend_schema, extend_schema_view

from .models import Medicament
from .serializers import MedicamentSerializer


@extend_schema_view(
    list=extend_schema(summary="Liste des médicaments actifs (paginée)", tags=["Médicaments"]),
    create=extend_schema(summary="Créer un médicament", tags=["Médicaments"]),
    retrieve=extend_schema(summary="Détail d'un médicament", tags=["Médicaments"]),
    update=extend_schema(summary="Modifier un médicament", tags=["Médicaments"]),
    partial_update=extend_schema(summary="Modifier partiellement", tags=["Médicaments"]),
    destroy=extend_schema(summary="Soft delete (est_actif=False)", tags=["Médicaments"]),
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

    @extend_schema(summary="Médicaments dont le stock est sous le seuil", tags=["Médicaments"])
    @action(detail=False, methods=["get"], url_path="alertes")
    def alertes(self, request):
        """Retourne tous les médicaments actifs avec stock_actuel ≤ stock_minimum."""
        qs = self.get_queryset().filter(stock_actuel__lte=F("stock_minimum"))
        page = self.paginate_queryset(qs)
        serializer = self.get_serializer(page or qs, many=True)
        return self.get_paginated_response(serializer.data) if page else Response(serializer.data)
