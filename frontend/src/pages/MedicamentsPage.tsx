import { Alert, Card, Center, Loader, Stack, Text } from "@mantine/core";
import { AlertTriangle } from "lucide-react";
import { useMemo, useState } from "react";
import { ApiError, type Medicament } from "../api";
import { MedicamentFilters, type MedicamentStatusFilter } from "../components/medicaments/MedicamentFilters";
import { MedicamentForm } from "../components/medicaments/MedicamentForm";
import { MedicamentsTable } from "../components/medicaments/MedicamentsTable";
import { PageHeader } from "../components/PageHeader";
import { useCategories } from "../hooks/useCategories";
import { useDeleteMedicament, useMedicaments } from "../hooks/useMedicaments";
import { stockStatus } from "../utils/medicament";

export function MedicamentsPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<number | "all">("all");
  const [status, setStatus] = useState<MedicamentStatusFilter>("all");
  const [editing, setEditing] = useState<Medicament | null>(null);

  const categoriesQuery = useCategories();
  const medicamentsQuery = useMedicaments({
    search: search.trim() || undefined,
    categorie: category === "all" ? undefined : category,
  });
  const deleteMutation = useDeleteMedicament();

  const categories = categoriesQuery.data?.results ?? [];
  const allResults = medicamentsQuery.data?.results ?? [];

  const filtered = useMemo(() => {
    if (status === "all") return allResults;
    return allResults.filter((m) => stockStatus(m) === status);
  }, [allResults, status]);

  function handleArchive(id: number) {
    if (!confirm("Archiver ce médicament ?")) return;
    deleteMutation.mutate(id, {
      onSuccess: () => {
        if (editing?.id === id) setEditing(null);
      },
    });
  }

  return (
    <>
      <PageHeader
        eyebrow="Catalogue"
        title="Gestion des médicaments"
        description="Liste, filtres, ajout et modification synchronisés avec l'API."
      />

      <div className="medicines-layout">
        <Card withBorder radius="md" padding={0} shadow="sm">
          <MedicamentFilters
            categories={categories}
            search={search}
            category={category}
            status={status}
            onSearchChange={setSearch}
            onCategoryChange={setCategory}
            onStatusChange={setStatus}
          />

          {medicamentsQuery.isLoading && (
            <Center p="xl">
              <Loader />
            </Center>
          )}

          {medicamentsQuery.isError && (
            <Alert color="red" icon={<AlertTriangle size={18} />} m="md" title="Erreur de chargement">
              {(medicamentsQuery.error as ApiError).message}
            </Alert>
          )}

          {medicamentsQuery.isSuccess && filtered.length === 0 && (
            <Stack p="xl" align="center" gap={4}>
              <Text fw={600}>Aucun médicament trouvé.</Text>
              <Text size="sm" c="dimmed">
                Ajustez les filtres ou ajoutez un nouveau médicament.
              </Text>
            </Stack>
          )}

          {medicamentsQuery.isSuccess && filtered.length > 0 && (
            <MedicamentsTable
              medicines={filtered}
              onEdit={setEditing}
              onArchive={handleArchive}
              archiving={deleteMutation.isPending ? deleteMutation.variables ?? null : null}
            />
          )}

          {deleteMutation.isError && (
            <Alert color="red" icon={<AlertTriangle size={18} />} m="md">
              {(deleteMutation.error as ApiError).message}
            </Alert>
          )}
        </Card>

        <MedicamentForm
          categories={categories}
          editing={editing}
          onCancel={() => setEditing(null)}
          onSuccess={() => setEditing(null)}
        />
      </div>
    </>
  );
}
