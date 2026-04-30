import { SimpleGrid } from "@mantine/core";
import { SaleMedicinePicker } from "../components/sales/SaleMedicinePicker";
import { SaleSummary } from "../components/sales/SaleSummary";
import { SalesHistory } from "../components/sales/SalesHistory";
import { PageHeader } from "../components/PageHeader";
import type { Medicine, Sale, SaleLine } from "../data/pharmacy";

type SalesPageProps = {
  medicines: Medicine[];
  sales: Sale[];
  search: string;
  quantities: Record<string, number>;
  notes: string;
  cart: SaleLine[];
  subtotal: number;
  vat: number;
  total: number;
  onSearchChange: (value: string) => void;
  onQuantityChange: (medicineId: string, delta: number) => void;
  onNotesChange: (value: string) => void;
  onCompleteSale: () => void;
  onCancelSale: (saleId: string) => void;
};

export function SalesPage({
  medicines,
  sales,
  search,
  quantities,
  notes,
  cart,
  subtotal,
  vat,
  total,
  onSearchChange,
  onQuantityChange,
  onNotesChange,
  onCompleteSale,
  onCancelSale,
}: SalesPageProps) {
  const normalizedSearch = search.toLowerCase();
  const filteredMedicines = medicines.filter((medicine) => medicine.name.toLowerCase().includes(normalizedSearch) || medicine.dci.toLowerCase().includes(normalizedSearch));
  const filteredSales = sales.filter((sale) => sale.reference.toLowerCase().includes(normalizedSearch) || sale.notes.toLowerCase().includes(normalizedSearch));

  return (
    <>
      <PageHeader eyebrow="Comptoir" title="Nouvelle vente" description="Ajoutez les articles, calculez le TTC et déduisez le stock sans backend." />

      <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="md" mb="md">
        <SaleMedicinePicker medicines={filteredMedicines} search={search} quantities={quantities} onSearchChange={onSearchChange} onQuantityChange={onQuantityChange} />
        <SaleSummary cart={cart} notes={notes} subtotal={subtotal} vat={vat} total={total} onNotesChange={onNotesChange} onCompleteSale={onCompleteSale} />
      </SimpleGrid>

      <SalesHistory sales={filteredSales} onCancelSale={onCancelSale} />
    </>
  );
}
