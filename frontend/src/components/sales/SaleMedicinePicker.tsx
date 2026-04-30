import { ActionIcon, Card, Group, Stack, Text, TextInput } from "@mantine/core";
import { Minus, Pill, Plus, Search } from "lucide-react";
import type { Medicine } from "../../data/pharmacy";
import { formatCurrency } from "../../utils/pharmacy";
import { PanelTitle } from "./PanelTitle";

type SaleMedicinePickerProps = {
  medicines: Medicine[];
  search: string;
  quantities: Record<string, number>;
  onSearchChange: (value: string) => void;
  onQuantityChange: (medicineId: string, delta: number) => void;
};

export function SaleMedicinePicker({ medicines, search, quantities, onSearchChange, onQuantityChange }: SaleMedicinePickerProps) {
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
        {medicines.map((medicine) => (
          <Group key={medicine.id} className="sale-product-row" justify="space-between" wrap="nowrap">
            <div>
              <Text fw={800}>{medicine.name}</Text>
              <Text size="xs" c="dimmed">
                Stock {medicine.stock} · {formatCurrency(medicine.salePrice)}
              </Text>
            </div>
            <Text c={medicine.stock <= medicine.minStock ? "red" : undefined} fw={800}>
              {medicine.stock}
            </Text>
            <Group gap="xs" wrap="nowrap">
              <ActionIcon variant="light" color="gray" onClick={() => onQuantityChange(medicine.id, -1)} aria-label="Retirer">
                <Minus size={14} />
              </ActionIcon>
              <Text w={24} ta="center" fw={900}>
                {quantities[medicine.id] ?? 0}
              </Text>
              <ActionIcon variant="light" color="teal" onClick={() => onQuantityChange(medicine.id, 1)} disabled={medicine.stock === 0} aria-label="Ajouter">
                <Plus size={14} />
              </ActionIcon>
            </Group>
          </Group>
        ))}
      </Stack>
    </Card>
  );
}
