import { Button, Card, Group, NumberFormatter, Stack, Text, Textarea } from "@mantine/core";
import { Save, ShoppingCart } from "lucide-react";
import type { SaleLine } from "../../data/pharmacy";
import { formatCurrency } from "../../utils/pharmacy";
import { PanelTitle } from "./PanelTitle";

type SaleSummaryProps = {
  cart: SaleLine[];
  notes: string;
  subtotal: number;
  vat: number;
  total: number;
  onNotesChange: (value: string) => void;
  onCompleteSale: () => void;
};

export function SaleSummary({ cart, notes, subtotal, vat, total, onNotesChange, onCompleteSale }: SaleSummaryProps) {
  return (
    <Card withBorder radius="md" padding="lg" shadow="sm">
      <PanelTitle icon={<ShoppingCart size={20} />} title="Récapitulatif de la vente" />
      <Stack gap="xs" mb="md">
        {cart.length === 0 ? (
          <Text c="dimmed" fw={700}>
            Panier vide.
          </Text>
        ) : (
          cart.map((line) => (
            <Group key={line.medicineId} justify="space-between" className="cart-line" wrap="nowrap">
              <Text>{line.name}</Text>
              <Text fw={800}>{line.quantity}</Text>
              <Text>{formatCurrency(line.unitPrice)}</Text>
              <Text fw={900}>{formatCurrency(line.subtotal)}</Text>
            </Group>
          ))
        )}
      </Stack>

      <Stack className="total-box" gap="xs" mb="md">
        <SummaryLine label="Sous-total" value={formatCurrency(subtotal)} />
        <SummaryLine label="TVA (20%)" value={formatCurrency(vat)} />
        <Group justify="space-between" className="grand-total">
          <Text fw={900}>Total TTC</Text>
          <Text fw={900} c="teal">
            <NumberFormatter value={total} decimalScale={2} thousandSeparator=" " decimalSeparator="," suffix=" €" />
          </Text>
        </Group>
      </Stack>

      <Textarea label="Notes" value={notes} onChange={(event) => onNotesChange(event.currentTarget.value)} placeholder="Remarque optionnelle..." minRows={3} mb="md" />
      <Button fullWidth leftSection={<Save size={18} />} onClick={onCompleteSale}>
        Enregistrer la vente
      </Button>
    </Card>
  );
}

function SummaryLine({ label, value }: { label: string; value: string }) {
  return (
    <Group justify="space-between">
      <Text c="dimmed">{label}</Text>
      <Text fw={800}>{value}</Text>
    </Group>
  );
}
