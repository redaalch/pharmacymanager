from rest_framework import serializers

from apps.categories.models import Categorie
from apps.categories.serializers import CategorieSerializer
from .models import Medicament


class MedicamentSerializer(serializers.ModelSerializer):
    """Serializer CRUD pour les médicaments avec catégorie imbriquée en lecture."""

    categorie = CategorieSerializer(read_only=True)
    categorie_id = serializers.PrimaryKeyRelatedField(
        source="categorie",
        queryset=Categorie.objects.all(),
        write_only=True,
    )
    est_en_alerte = serializers.BooleanField(read_only=True)

    class Meta:
        model = Medicament
        fields = [
            "id", "nom", "dci",
            "categorie", "categorie_id",
            "forme", "dosage",
            "prix_achat", "prix_vente",
            "stock_actuel", "stock_minimum", "est_en_alerte",
            "date_expiration", "ordonnance_requise",
            "date_creation", "est_actif",
        ]
        read_only_fields = ["id", "date_creation", "est_actif", "est_en_alerte"]

    def validate_prix_vente(self, value):
        prix_achat = self.initial_data.get("prix_achat")
        if prix_achat is not None and value < float(prix_achat):
            raise serializers.ValidationError("Le prix de vente doit être ≥ prix d'achat.")
        return value
