from django.db import models

from apps.categories.models import Categorie


class MedicamentManager(models.Manager):
    """Manager exposant uniquement les médicaments actifs par défaut."""

    def get_queryset(self):
        return super().get_queryset().filter(est_actif=True)


class Medicament(models.Model):
    """Médicament du catalogue de la pharmacie."""

    nom = models.CharField(max_length=200)
    dci = models.CharField(max_length=200, help_text="Dénomination Commune Internationale")
    categorie = models.ForeignKey(
        Categorie, on_delete=models.PROTECT, related_name="medicaments"
    )
    forme = models.CharField(max_length=50, help_text="comprimé, sirop, injection...")
    dosage = models.CharField(max_length=50, help_text="ex: 500mg, 250mg/5ml")
    prix_achat = models.DecimalField(max_digits=10, decimal_places=2)
    prix_vente = models.DecimalField(max_digits=10, decimal_places=2)
    stock_actuel = models.IntegerField(default=0)
    stock_minimum = models.IntegerField(default=0)
    date_expiration = models.DateField()
    ordonnance_requise = models.BooleanField(default=False)
    date_creation = models.DateTimeField(auto_now_add=True)
    est_actif = models.BooleanField(default=True)

    objects = MedicamentManager()
    all_objects = models.Manager()

    class Meta:
        ordering = ["nom"]
        constraints = [
            models.CheckConstraint(check=models.Q(prix_achat__gte=0), name="prix_achat_positif"),
            models.CheckConstraint(check=models.Q(prix_vente__gte=0), name="prix_vente_positif"),
            models.CheckConstraint(check=models.Q(stock_actuel__gte=0), name="stock_actuel_positif"),
            models.CheckConstraint(check=models.Q(stock_minimum__gte=0), name="stock_minimum_positif"),
        ]

    def __str__(self) -> str:
        return f"{self.nom} ({self.dosage})"

    @property
    def stock_bas(self) -> bool:
        return self.stock_actuel <= self.stock_minimum
