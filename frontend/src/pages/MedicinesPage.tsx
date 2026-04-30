import { Card } from "@mantine/core";
import type { FormEvent } from "react";
import { MedicineFilters } from "../components/medicines/MedicineFilters";
import { MedicineForm } from "../components/medicines/MedicineForm";
import { MedicinesTable } from "../components/medicines/MedicinesTable";
import { PageHeader } from "../components/PageHeader";
import type { Category, Medicine, MedicineDraft } from "../data/pharmacy";
import { getCategoryName, stockStatus } from "../utils/pharmacy";

type MedicinesPageProps = {
  categories: Category[];
  medicines: Medicine[];
  search: string;
  status: string;
  category: string;
  draft: MedicineDraft;
  editingMedicineId: string | null;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onDraftChange: (draft: MedicineDraft) => void;
  onSave: (event: FormEvent<HTMLFormElement>) => void;
  onEdit: (medicine: Medicine) => void;
  onArchive: (medicineId: string) => void;
  onCancelEdit: () => void;
};

export function MedicinesPage({
  categories,
  medicines,
  search,
  status,
  category,
  draft,
  editingMedicineId,
  onSearchChange,
  onStatusChange,
  onCategoryChange,
  onDraftChange,
  onSave,
  onEdit,
  onArchive,
  onCancelEdit,
}: MedicinesPageProps) {
  const filteredMedicines = medicines.filter((medicine) => {
    const normalized = search.trim().toLowerCase();
    const matchesSearch =
      !normalized ||
      medicine.name.toLowerCase().includes(normalized) ||
      medicine.dci.toLowerCase().includes(normalized) ||
      getCategoryName(categories, medicine.categoryId).toLowerCase().includes(normalized);
    const matchesCategory = category === "all" || medicine.categoryId === category;
    const matchesStatus = status === "all" || stockStatus(medicine) === status;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <>
      <PageHeader eyebrow="Catalogue" title="Gestion des médicaments" description="Liste, filtres, ajout et modification du stock en local." />

      <div className="medicines-layout">
        <Card withBorder radius="md" padding={0} shadow="sm">
          <MedicineFilters
            categories={categories}
            search={search}
            category={category}
            status={status}
            onSearchChange={onSearchChange}
            onCategoryChange={onCategoryChange}
            onStatusChange={onStatusChange}
          />
          <MedicinesTable categories={categories} medicines={filteredMedicines} onEdit={onEdit} onArchive={onArchive} />
        </Card>

        <MedicineForm
          categories={categories}
          draft={draft}
          editing={Boolean(editingMedicineId)}
          onDraftChange={onDraftChange}
          onSave={onSave}
          onCancel={onCancelEdit}
        />
      </div>
    </>
  );
}
