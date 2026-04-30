import { Group, Select, TextInput } from "@mantine/core";
import { Search } from "lucide-react";
import type { Categorie } from "../../api";
import type { StockStatus } from "../../utils/medicament";

export type MedicamentStatusFilter = "all" | StockStatus;

type MedicamentFiltersProps = {
  categories: Categorie[];
  search: string;
  category: number | "all";
  status: MedicamentStatusFilter;
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: number | "all") => void;
  onStatusChange: (value: MedicamentStatusFilter) => void;
};

export function MedicamentFilters({
  categories,
  search,
  category,
  status,
  onSearchChange,
  onCategoryChange,
  onStatusChange,
}: MedicamentFiltersProps) {
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
        value={category === "all" ? "all" : String(category)}
        onChange={(value) => onCategoryChange(value === "all" || value === null ? "all" : Number(value))}
        data={[
          { value: "all", label: "Toutes les catégories" },
          ...categories.map((item) => ({ value: String(item.id), label: item.nom })),
        ]}
      />
      <Select
        value={status}
        onChange={(value) => onStatusChange((value as MedicamentStatusFilter) ?? "all")}
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
