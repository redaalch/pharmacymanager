import { ActionIcon, Card, Group, Stack, Text, TextInput } from "@mantine/core";
import { Minus, Pill, Plus, Search } from "lucide-react";
import type { Medicament } from "../../api";
import { formatCurrency } from "../../utils/format";
import { PanelTitle } from "./PanelTitle";

type SaleMedicinePickerProps = {
  medicines: Medicament[];
  search: string;
  quantities: Map<number, number>;
  onSearchChange: (value: string) => void;
  onQuantityChange: (medicineId: number, delta: number) => void;
};

export function SaleMedicinePicker({
  medicines,
  search,
  quantities,
  onSearchChange,
  onQuantityChange,
}: SaleMedicinePickerProps) {
  return (
    <Card withBorder radius="md" padding="lg" shadow="sm">
      <PanelTitle icon={<Pill size={20} />} title="Sélection des médicaments" />
      <TextInput
        leftSection={<Search size={16} />}
        placeholder="Rechercher un médicament..."
        value={search}
        onChange={(event) => onSearchChange(event.currentTarget.value)}
        mb="sm"
      />
      <Stack gap={0}>
        {medicines.length === 0 && (
          <Text c="dimmed" py="md" ta="center">
            Aucun médicament.
          </Text>
        )}
        {medicines.map((medicine) => {
          const inCart = quantities.get(medicine.id) ?? 0;
          const lowStock = medicine.stock_actuel <= medicine.stock_minimum;
          return (
            <Group key={medicine.id} className="sale-product-row" justify="space-between" wrap="nowrap">
              <div>
                <Text fw={800}>{medicine.nom}</Text>
                <Text size="xs" c="dimmed">
                  Stock {medicine.stock_actuel} · {formatCurrency(medicine.prix_vente)}
                </Text>
              </div>
              <Text c={lowStock ? "red" : undefined} fw={800}>
                {medicine.stock_actuel}
              </Text>
              <Group gap="xs" wrap="nowrap">
                <ActionIcon
                  variant="light"
                  color="gray"
                  onClick={() => onQuantityChange(medicine.id, -1)}
                  disabled={inCart === 0}
                  aria-label="Retirer"
                >
                  <Minus size={14} />
                </ActionIcon>
                <Text w={24} ta="center" fw={900}>
                  {inCart}
                </Text>
                <ActionIcon
                  variant="light"
                  color="teal"
                  onClick={() => onQuantityChange(medicine.id, 1)}
                  disabled={medicine.stock_actuel === 0 || inCart >= medicine.stock_actuel}
                  aria-label="Ajouter"
                >
                  <Plus size={14} />
                </ActionIcon>
              </Group>
            </Group>
          );
        })}
      </Stack>
    </Card>
  );
}
