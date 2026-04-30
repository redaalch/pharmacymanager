import {
  Alert,
  Button,
  Card,
  Group,
  Loader,
  Skeleton,
  SimpleGrid,
  Stack,
  Text,
  Textarea,
  TextInput,
} from "@mantine/core";
import { AlertTriangle, LayoutGrid, Plus, Save } from "lucide-react";
import { useState, type FormEvent } from "react";
import { ApiError } from "../api";
import { PageHeader } from "../components/PageHeader";
import { SectionTitle } from "../components/SectionTitle";
import { useCategories, useCreateCategorie } from "../hooks/useCategories";
import { useMedicaments } from "../hooks/useMedicaments";

const EMPTY_DRAFT = { nom: "", description: "" };

export function CategoriesPage() {
  const categoriesQuery = useCategories();
  const medicamentsQuery = useMedicaments();
  const createCategorie = useCreateCategorie();

  const [draft, setDraft] = useState(EMPTY_DRAFT);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!draft.nom.trim()) return;
    createCategorie.mutate(
      { nom: draft.nom.trim(), description: draft.description.trim() },
      { onSuccess: () => setDraft(EMPTY_DRAFT) },
    );
  };

  const categories = categoriesQuery.data?.results ?? [];
  const medicaments = medicamentsQuery.data?.results ?? [];

  return (
    <>
      <PageHeader
        eyebrow="Classification"
        title="Catégories"
        description="Organisez le catalogue par famille thérapeutique."
      />

      <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="md">
        <Card withBorder radius="md" padding="lg" shadow="sm">
          <SectionTitle icon={LayoutGrid} title="Catégories existantes" />

          {categoriesQuery.isLoading && (
            <Stack>
              <Skeleton height={48} radius="sm" />
              <Skeleton height={48} radius="sm" />
              <Skeleton height={48} radius="sm" />
            </Stack>
          )}

          {categoriesQuery.isError && (
            <Alert color="red" icon={<AlertTriangle size={18} />} title="Erreur de chargement">
              {(categoriesQuery.error as ApiError).message}
            </Alert>
          )}

          {categoriesQuery.isSuccess && categories.length === 0 && (
            <Text c="dimmed">Aucune catégorie pour l'instant.</Text>
          )}

          {categoriesQuery.isSuccess && categories.length > 0 && (
            <Stack>
              {categories.map((categorie) => {
                const count = medicaments.filter(
                  (medicament) => medicament.categorie.id === categorie.id,
                ).length;
                return (
                  <Group key={categorie.id} className="category-row" justify="space-between" wrap="nowrap">
                    <div>
                      <Text fw={800}>{categorie.nom}</Text>
                      <Text size="sm" c="dimmed">
                        {categorie.description || "—"}
                      </Text>
                    </div>
                    <Text size="sm" fw={800} c="dimmed">
                      {count} médicaments
                    </Text>
                  </Group>
                );
              })}
            </Stack>
          )}
        </Card>

        <Card component="form" onSubmit={handleSubmit} withBorder radius="md" padding="lg" shadow="sm">
          <SectionTitle icon={Plus} title="Nouvelle catégorie" />
          <Stack>
            <TextInput
              label="Nom*"
              required
              value={draft.nom}
              onChange={(event) => setDraft({ ...draft, nom: event.currentTarget.value })}
              placeholder="Dermatologie"
              disabled={createCategorie.isPending}
            />
            <Textarea
              label="Description"
              value={draft.description}
              onChange={(event) => setDraft({ ...draft, description: event.currentTarget.value })}
              minRows={4}
              disabled={createCategorie.isPending}
            />

            {createCategorie.isError && (
              <Alert color="red" icon={<AlertTriangle size={18} />}>
                {(createCategorie.error as ApiError).message}
              </Alert>
            )}

            <Button
              type="submit"
              leftSection={createCategorie.isPending ? <Loader size={14} color="white" /> : <Save size={17} />}
              disabled={createCategorie.isPending || !draft.nom.trim()}
            >
              {createCategorie.isPending ? "Enregistrement…" : "Enregistrer"}
            </Button>
          </Stack>
        </Card>
      </SimpleGrid>
    </>
  );
}
