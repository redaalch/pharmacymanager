from decimal import Decimal

from django.db import transaction
from rest_framework import serializers

from apps.medicaments.models import Medicament
from .models import LigneVente, Vente


class LigneVenteReadSerializer(serializers.ModelSerializer):
    """Lecture d'une ligne avec nom du médicament dénormalisé."""

    medicament_nom = serializers.CharField(source="medicament.nom", read_only=True)

    class Meta:
        model = LigneVente
        fields = ["id", "medicament", "medicament_nom", "quantite", "prix_unitaire", "sous_total"]
        read_only_fields = fields


class LigneVenteWriteSerializer(serializers.Serializer):
    """Entrée pour créer une ligne — uniquement medicament_id et quantité."""

    medicament_id = serializers.PrimaryKeyRelatedField(
        source="medicament", queryset=Medicament.all_objects.filter(est_actif=True)
    )
    quantite = serializers.IntegerField(min_value=1)


class VenteSerializer(serializers.ModelSerializer):
    """Lecture d'une vente avec ses lignes imbriquées."""

    lignes = LigneVenteReadSerializer(many=True, read_only=True)

    class Meta:
        model = Vente
        fields = ["id", "reference", "date_vente", "total_ttc", "statut", "notes", "lignes"]
        read_only_fields = ["id", "reference", "date_vente", "total_ttc", "statut"]


class VenteCreateSerializer(serializers.ModelSerializer):
    """Création d'une vente avec ses lignes — déduction atomique du stock."""

    lignes = LigneVenteWriteSerializer(many=True, write_only=True)

    class Meta:
        model = Vente
        fields = ["id", "reference", "notes", "lignes"]
        read_only_fields = ["id", "reference"]

    def validate_lignes(self, value):
        if not value:
            raise serializers.ValidationError("Une vente doit contenir au moins une ligne.")
        return value

    @transaction.atomic
    def create(self, validated_data):
        lignes_data = validated_data.pop("lignes")
        vente = Vente.objects.create(**validated_data)

        total = Decimal("0.00")
        for ligne in lignes_data:
            medicament = ligne["medicament"]
            quantite = ligne["quantite"]

            medicament_locked = Medicament.all_objects.select_for_update().get(pk=medicament.pk)
            if medicament_locked.stock_actuel < quantite:
                raise serializers.ValidationError(
                    {"lignes": f"Stock insuffisant pour {medicament_locked.nom} "
                               f"(disponible: {medicament_locked.stock_actuel}, demandé: {quantite})."}
                )

            prix_unitaire = medicament_locked.prix_vente
            LigneVente.objects.create(
                vente=vente,
                medicament=medicament_locked,
                quantite=quantite,
                prix_unitaire=prix_unitaire,
            )
            medicament_locked.stock_actuel -= quantite
            medicament_locked.save(update_fields=["stock_actuel"])
            total += prix_unitaire * quantite

        vente.total_ttc = total
        vente.save(update_fields=["total_ttc"])
        return vente

    def to_representation(self, instance):
        return VenteSerializer(instance, context=self.context).data
