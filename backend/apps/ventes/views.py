from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from drf_spectacular.utils import extend_schema, extend_schema_view

from .models import Vente
from .serializers import VenteCreateSerializer, VenteSerializer


@extend_schema_view(
    list=extend_schema(summary="Historique des ventes", tags=["Ventes"]),
    retrieve=extend_schema(summary="Détail d'une vente", tags=["Ventes"]),
    create=extend_schema(summary="Créer une vente avec ses lignes", tags=["Ventes"]),
)
class VenteViewSet(viewsets.ModelViewSet):
    """Création, consultation, et annulation des ventes."""

    queryset = Vente.objects.prefetch_related("lignes__medicament").all()
    http_method_names = ["get", "post", "head", "options"]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ["statut"]

    def get_serializer_class(self):
        if self.action == "create":
            return VenteCreateSerializer
        return VenteSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        date_min = self.request.query_params.get("date_min")
        date_max = self.request.query_params.get("date_max")
        if date_min:
            qs = qs.filter(date_vente__date__gte=date_min)
        if date_max:
            qs = qs.filter(date_vente__date__lte=date_max)
        return qs

    @extend_schema(summary="Annuler une vente (réintègre le stock)", tags=["Ventes"])
    @action(detail=True, methods=["post"], url_path="annuler")
    def annuler(self, request, pk=None):
        vente = self.get_object()
        if vente.statut == Vente.STATUT_ANNULEE:
            return Response(
                {"detail": "Cette vente est déjà annulée."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        vente.annuler()
        return Response(self.get_serializer(vente).data)