from decimal import Decimal

from django.utils import timezone
from rest_framework import status
from rest_framework.test import APITestCase

from apps.categories.models import Categorie
from apps.medicaments.models import Medicament
from .models import LigneVente, Vente


class VenteApiTests(APITestCase):
    def setUp(self):
        self.categorie = Categorie.objects.create(
            nom="Antibiotique",
            description="Anti-bactériens",
        )
        self.medicament = Medicament.objects.create(
            nom="Amoxicilline",
            dci="Amoxicilline",
            categorie=self.categorie,
            forme="comprimé",
            dosage="500mg",
            prix_achat=Decimal("10.00"),
            prix_vente=Decimal("15.00"),
            stock_actuel=10,
            stock_minimum=3,
            date_expiration="2028-01-01",
            ordonnance_requise=True,
        )

    def test_create_vente_deducts_stock_and_keeps_price_snapshot(self):
        response = self.client.post(
            "/api/v1/ventes/",
            {
                "notes": "Vente comptoir",
                "lignes": [{"medicament_id": self.medicament.id, "quantite": 2}],
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.medicament.refresh_from_db()
        self.assertEqual(self.medicament.stock_actuel, 8)

        vente = Vente.objects.get(pk=response.data["id"])
        ligne = LigneVente.objects.get(vente=vente)
        self.assertEqual(vente.total_ttc, Decimal("30.00"))
        self.assertEqual(ligne.prix_unitaire, Decimal("15.00"))
        self.assertEqual(ligne.sous_total, Decimal("30.00"))
        self.assertTrue(vente.reference.startswith(f"VNT-{timezone.now().year}-"))

    def test_create_vente_rejects_insufficient_stock_without_side_effects(self):
        response = self.client.post(
            "/api/v1/ventes/",
            {
                "lignes": [{"medicament_id": self.medicament.id, "quantite": 11}],
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(Vente.objects.count(), 0)
        self.assertEqual(LigneVente.objects.count(), 0)
        self.medicament.refresh_from_db()
        self.assertEqual(self.medicament.stock_actuel, 10)

    def test_annuler_reintegrates_stock_once(self):
        create_response = self.client.post(
            "/api/v1/ventes/",
            {
                "lignes": [{"medicament_id": self.medicament.id, "quantite": 3}],
            },
            format="json",
        )
        vente_id = create_response.data["id"]
        self.medicament.refresh_from_db()
        self.assertEqual(self.medicament.stock_actuel, 7)

        cancel_response = self.client.post(f"/api/v1/ventes/{vente_id}/annuler/")

        self.assertEqual(cancel_response.status_code, status.HTTP_200_OK)
        self.medicament.refresh_from_db()
        self.assertEqual(self.medicament.stock_actuel, 10)
        self.assertEqual(cancel_response.data["statut"], Vente.STATUT_ANNULEE)

        second_cancel = self.client.post(f"/api/v1/ventes/{vente_id}/annuler/")

        self.assertEqual(second_cancel.status_code, status.HTTP_400_BAD_REQUEST)
        self.medicament.refresh_from_db()
        self.assertEqual(self.medicament.stock_actuel, 10)
