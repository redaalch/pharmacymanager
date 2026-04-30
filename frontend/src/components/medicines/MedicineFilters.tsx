import { Group, Select, TextInput } from "@mantine/core";
import { Search } from "lucide-react";
import type { Category } from "../../data/pharmacy";

type MedicineFiltersProps = {
  categories: Category[];
  search: string;
  category: string;
  status: string;
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onStatusChange: (value: string) => void;
};

export function MedicineFilters({
  categories,
  search,
  category,
  status,
  onSearchChange,
  onCategoryChange,
  onStatusChange,
}: MedicineFiltersProps) {
  return (
    <Group p="md" gap="sm" wrap="wrap">
      <TextInput
        leftSection={<Search size={16} />}
        placeholder="Nom, DCI ou catégorie"
        value={search}
        onChange={(event) => onSearchChange(event.currentTarget.value)}
        className="toolbar-search"
      />
      <Select
        value={category}
        onChange={(value) => onCategoryChange(value ?? "all")}
        data={[{ value: "all", label: "Toutes les catégories" }, ...categories.map((item) => ({ value: item.id, label: item.name }))]}
      />
      <Select
        value={status}
        onChange={(value) => onStatusChange(value ?? "all")}
        data={[
          { value: "all", label: "Tous les statuts" },
          { value: "ok", label: "En stock" },
          { value: "low", label: "Stock bas" },
          { value: "out", label: "Rupture" },
        ]}
      />
    </Group>
  );
}
