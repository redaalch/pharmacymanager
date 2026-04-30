from decimal import Decimal

from rest_framework import status
from rest_framework.test import APITestCase

from apps.categories.models import Categorie
from .models import Medicament


class MedicamentApiTests(APITestCase):
    def setUp(self):
        self.categorie = Categorie.objects.create(
            nom="Antalgique",
            description="Douleur et fièvre",
        )
        self.low_stock = Medicament.objects.create(
            nom="Paracétamol",
            dci="Paracétamol",
            categorie=self.categorie,
            forme="comprimé",
            dosage="500mg",
            prix_achat=Decimal("4.00"),
            prix_vente=Decimal("7.00"),
            stock_actuel=2,
            stock_minimum=5,
            date_expiration="2028-01-01",
        )
        self.normal_stock = Medicament.objects.create(
            nom="Ibuprofène",
            dci="Ibuprofène",
            categorie=self.categorie,
            forme="comprimé",
            dosage="400mg",
            prix_achat=Decimal("8.00"),
            prix_vente=Decimal("12.00"),
            stock_actuel=20,
            stock_minimum=5,
            date_expiration="2028-01-01",
        )

    def test_create_medicament_accepts_blank_dci(self):
        response = self.client.post(
            "/api/v1/medicaments/",
            {
                "nom": "Complexe vitamines",
                "categorie_id": self.categorie.id,
                "forme": "comprimé",
                "dosage": "standard",
                "prix_achat": "20.00",
                "prix_vente": "29.00",
                "stock_actuel": 10,
                "stock_minimum": 3,
                "date_expiration": "2028-12-31",
                "ordonnance_requise": False,
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        medicament = Medicament.objects.get(nom="Complexe vitamines")
        self.assertEqual(medicament.dci, "")

    def test_alertes_returns_only_low_stock_medicaments(self):
        response = self.client.get("/api/v1/medicaments/alertes/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        ids = {item["id"] for item in response.data["results"]}
        self.assertIn(self.low_stock.id, ids)
        self.assertNotIn(self.normal_stock.id, ids)

    def test_delete_is_soft_delete_and_excludes_from_default_queryset(self):
        response = self.client.delete(f"/api/v1/medicaments/{self.normal_stock.id}/")

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.normal_stock.refresh_from_db()
        self.assertFalse(self.normal_stock.est_actif)
        self.assertFalse(Medicament.objects.filter(pk=self.normal_stock.pk).exists())
        self.assertTrue(Medicament.all_objects.filter(pk=self.normal_stock.pk).exists())
