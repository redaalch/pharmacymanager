import { Alert, SimpleGrid } from "@mantine/core";
import { AlertTriangle } from "lucide-react";
import { useMemo, useState } from "react";
import { ApiError } from "../api";
import { PageHeader } from "../components/PageHeader";
import { VenteMedicamentPicker } from "../components/ventes/VenteMedicamentPicker";
import { VenteSummary, type CartLine } from "../components/ventes/VenteSummary";
import { VentesHistory } from "../components/ventes/VentesHistory";
import { useMedicaments } from "../hooks/useMedicaments";
import { useAnnulerVente, useCreateVente, useVentes } from "../hooks/useVentes";

export function VentesPage() {
  const [search, setSearch] = useState("");
  const [notes, setNotes] = useState("");
  const [quantities, setQuantities] = useState<Map<number, number>>(new Map());

  const medicamentsQuery = useMedicaments({ search: search.trim() || undefined });
  const ventesQuery = useVentes();
  const createVente = useCreateVente();
  const annulerVente = useAnnulerVente();

  const medicaments = medicamentsQuery.data?.results ?? [];
  const sales = ventesQuery.data?.results ?? [];

  const cart = useMemo<CartLine[]>(() => {
    const lines: CartLine[] = [];
    quantities.forEach((quantite, medicamentId) => {
      if (quantite <= 0) return;
      const medicament = medicaments.find((m) => m.id === medicamentId);
      if (!medicament) return;
      const prixUnitaire = Number(medicament.prix_vente);
      lines.push({
        medicamentId,
        nom: medicament.nom,
        quantite,
        prixUnitaire,
        sousTotal: prixUnitaire * quantite,
      });
    });
    return lines;
  }, [quantities, medicaments]);

  const total = cart.reduce((sum, line) => sum + line.sousTotal, 0);

  function handleQuantityChange(medicamentId: number, delta: number) {
    setQuantities((prev) => {
      const next = new Map(prev);
      const current = next.get(medicamentId) ?? 0;
      const updated = Math.max(0, current + delta);
      if (updated === 0) {
        next.delete(medicamentId);
      } else {
        next.set(medicamentId, updated);
      }
      return next;
    });
  }

  function handleCompleteSale() {
    if (cart.length === 0) return;
    createVente.mutate(
      {
        notes: notes.trim() || undefined,
        lignes: cart.map((line) => ({
          medicament_id: line.medicamentId,
          quantite: line.quantite,
        })),
      },
      {
        onSuccess: () => {
          setQuantities(new Map());
          setNotes("");
        },
      },
    );
  }

  function handleCancelSale(saleId: number) {
    if (!confirm("Annuler cette vente ? Le stock sera réintégré.")) return;
    annulerVente.mutate(saleId);
  }

  return (
    <>
      <PageHeader
        eyebrow="Comptoir"
        title="Nouvelle vente"
        description="Sélectionnez les articles, le stock est déduit automatiquement à l'enregistrement."
      />

      {medicamentsQuery.isError && (
        <Alert color="red" icon={<AlertTriangle size={18} />} mb="md">
          Impossible de charger le catalogue : {(medicamentsQuery.error as ApiError).message}
        </Alert>
      )}

      <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="md" mb="md">
        <VenteMedicamentPicker
          medicines={medicaments}
          search={search}
          quantities={quantities}
          onSearchChange={setSearch}
          onQuantityChange={handleQuantityChange}
        />
        <VenteSummary
          cart={cart}
          notes={notes}
          total={total}
          isSubmitting={createVente.isPending}
          error={(createVente.error as ApiError) ?? null}
          onNotesChange={setNotes}
          onCompleteSale={handleCompleteSale}
        />
      </SimpleGrid>

      <VentesHistory
        sales={sales}
        isLoading={ventesQuery.isLoading}
        isError={ventesQuery.isError}
        error={(ventesQuery.error as ApiError) ?? null}
        cancelling={annulerVente.isPending ? annulerVente.variables ?? null : null}
        onCancelSale={handleCancelSale}
      />

      {annulerVente.isError && (
        <Alert color="red" icon={<AlertTriangle size={18} />} mt="md">
          {(annulerVente.error as ApiError).message}
        </Alert>
      )}
    </>
  );
}
