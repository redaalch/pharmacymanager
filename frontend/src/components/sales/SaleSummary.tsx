import { Alert, Button, Card, Group, Loader, NumberFormatter, Stack, Text, Textarea } from "@mantine/core";
import { AlertTriangle, Save, ShoppingCart } from "lucide-react";
import { ApiError } from "../../api";
import { formatCurrency } from "../../utils/format";
import { PanelTitle } from "./PanelTitle";

export type CartLine = {
  medicamentId: number;
  nom: string;
  quantite: number;
  prixUnitaire: number;
  sousTotal: number;
};

type SaleSummaryProps = {
  cart: CartLine[];
  notes: string;
  total: number;
  isSubmitting: boolean;
  error: ApiError | null;
  onNotesChange: (value: string) => void;
  onCompleteSale: () => void;
};

export function SaleSummary({
  cart,
  notes,
  total,
  isSubmitting,
  error,
  onNotesChange,
  onCompleteSale,
}: SaleSummaryProps) {
  const isEmpty = cart.length === 0;

  return (
    <Card withBorder radius="md" padding="lg" shadow="sm">
      <PanelTitle icon={<ShoppingCart size={20} />} title="Récapitulatif de la vente" />
      <Stack gap="xs" mb="md">
        {isEmpty ? (
          <Text c="dimmed" fw={700}>
            Panier vide.
          </Text>
        ) : (
          cart.map((line) => (
            <Group key={line.medicamentId} justify="space-between" className="cart-line" wrap="nowrap">
              <Text>{line.nom}</Text>
              <Text fw={800}>{line.quantite}</Text>
              <Text>{formatCurrency(line.prixUnitaire)}</Text>
              <Text fw={900}>{formatCurrency(line.sousTotal)}</Text>
            </Group>
          ))
        )}
      </Stack>

      <Stack className="total-box" gap="xs" mb="md">
        <Group justify="space-between" className="grand-total">
          <Text fw={900}>Total TTC</Text>
          <Text fw={900} c="teal">
            <NumberFormatter value={total} decimalScale={2} thousandSeparator=" " decimalSeparator="," suffix=" MAD" />
          </Text>
        </Group>
      </Stack>

      <Textarea
        label="Notes"
        value={notes}
        onChange={(event) => onNotesChange(event.currentTarget.value)}
        placeholder="Remarque optionnelle..."
        minRows={3}
        mb="md"
        disabled={isSubmitting}
      />

      {error && (
        <Alert color="red" icon={<AlertTriangle size={18} />} mb="md">
          {error.message}
        </Alert>
      )}

      <Button
        fullWidth
        leftSection={isSubmitting ? <Loader size={16} color="white" /> : <Save size={18} />}
        onClick={onCompleteSale}
        disabled={isEmpty || isSubmitting}
      >
        {isSubmitting ? "Enregistrement…" : "Enregistrer la vente"}
      </Button>
    </Card>
  );
}
