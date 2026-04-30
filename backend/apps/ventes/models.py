from decimal import Decimal

from django.db import models, transaction

from apps.medicaments.models import Medicament

class Vente(models.Model):
    """Transaction de vente regroupant une ou plusieurs lignes."""

    STATUT_EN_COURS = "en_cours"
    STATUT_COMPLETEE = "completee"
    STATUT_ANNULEE = "annulee"
    STATUT_CHOICES = [
        (STATUT_EN_COURS, "En cours"),
        (STATUT_COMPLETEE, "Complétée"),
        (STATUT_ANNULEE, "Annulée"),
    ]

    reference = models.CharField(max_length=20, unique=True, editable=False)
    date_vente = models.DateTimeField(auto_now_add=True)
    total_ttc = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal("0.00"))
    statut = models.CharField(max_length=20, choices=STATUT_CHOICES, default=STATUT_COMPLETEE)
    notes = models.TextField(blank=True)

    class Meta:
        ordering = ["-date_vente"]

    def __str__(self) -> str:
        return self.reference

    def save(self, *args, **kwargs):
        if not self.reference:
            self.reference = self._generer_reference()
        super().save(*args, **kwargs)

    @staticmethod
    def _generer_reference() -> str:
        from django.utils import timezone

        annee = timezone.now().year
        dernier = Vente.objects.filter(reference__startswith=f"VNT-{annee}-").order_by("-id").first()
        suivant = 1 if not dernier else int(dernier.reference.split("-")[-1]) + 1
        return f"VNT-{annee}-{suivant:04d}"

    @transaction.atomic
    def annuler(self) -> None:
        """Annule la vente et réintègre les quantités au stock."""
        if self.statut == self.STATUT_ANNULEE:
            return
        for ligne in self.lignes.select_related("medicament"):
            Medicament.all_objects.filter(pk=ligne.medicament_id).update(
                stock_actuel=models.F("stock_actuel") + ligne.quantite
            )
        self.statut = self.STATUT_ANNULEE
        self.save(update_fields=["statut"])

class LigneVente(models.Model):
    """Ligne d'une vente — snapshot du prix au moment de la transaction."""

    vente = models.ForeignKey(Vente, on_delete=models.CASCADE, related_name="lignes")
    medicament = models.ForeignKey(Medicament, on_delete=models.PROTECT, related_name="lignes_vente")
    quantite = models.PositiveIntegerField()
    prix_unitaire = models.DecimalField(max_digits=10, decimal_places=2)
    sous_total = models.DecimalField(max_digits=12, decimal_places=2)

    class Meta:
        constraints = [
            models.CheckConstraint(check=models.Q(quantite__gt=0), name="quantite_positive"),
        ]

    def save(self, *args, **kwargs):
        self.sous_total = Decimal(self.quantite) * self.prix_unitaire
        super().save(*args, **kwargs)
