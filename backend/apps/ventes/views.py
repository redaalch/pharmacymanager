from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from drf_spectacular.utils import OpenApiExample, OpenApiResponse, extend_schema, extend_schema_view

from .models import Vente
from .serializers import VenteCreateSerializer, VenteSerializer

VENTE_EXAMPLE = OpenApiExample(
    "Vente",
    value={
        "id": 1,
        "reference": "VNT-2026-0001",
        "date_vente": "2026-04-30T13:00:00+01:00",
        "total_ttc": "30.00",
        "statut": "completee",
        "notes": "Vente comptoir",
        "lignes": [
            {
                "id": 1,
                "medicament": 1,
                "medicament_nom": "Amoxicilline",
                "quantite": 2,
                "prix_unitaire": "15.00",
                "sous_total": "30.00",
            }
        ],
    },
    response_only=True,
)
VENTE_REQUEST_EXAMPLE = OpenApiExample(
    "Création vente",
    value={"notes": "Vente comptoir", "lignes": [{"medicament_id": 1, "quantite": 2}]},
    request_only=True,
)
VALIDATION_ERROR = OpenApiResponse(description="Données invalides ou stock insuffisant.")
NOT_FOUND_ERROR = OpenApiResponse(description="Vente introuvable.")


@extend_schema_view(
    list=extend_schema(
        summary="Historique des ventes",
        tags=["Ventes"],
        examples=[VENTE_EXAMPLE],
    ),
    retrieve=extend_schema(
        summary="Détail d'une vente",
        tags=["Ventes"],
        examples=[VENTE_EXAMPLE],
        responses={200: VenteSerializer, 404: NOT_FOUND_ERROR},
    ),
    create=extend_schema(
        summary="Créer une vente avec ses lignes",
        tags=["Ventes"],
        examples=[VENTE_REQUEST_EXAMPLE, VENTE_EXAMPLE],
        responses={201: VenteSerializer, 400: VALIDATION_ERROR},
    ),
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

    @extend_schema(
        summary="Annuler une vente (réintègre le stock)",
        tags=["Ventes"],
        examples=[VENTE_EXAMPLE],
        responses={
            200: VenteSerializer,
            400: OpenApiResponse(description="La vente est déjà annulée."),
            404: NOT_FOUND_ERROR,
        },
    )
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
