from rest_framework import serializers
from .models import Categorie


class CategorieSerializer(serializers.ModelSerializer):
    """Serializer CRUD pour les catégories de médicaments."""

    class Meta:
        model = Categorie
        fields = ["id", "nom", "description", "date_creation"]
        read_only_fields = ["id", "date_creation"]
