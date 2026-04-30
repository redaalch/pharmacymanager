import {
  ActionIcon,
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
import { AlertTriangle, LayoutGrid, Pencil, Plus, Save, Trash2, X } from "lucide-react";
import { useState, type FormEvent } from "react";
import { ApiError, type Categorie } from "../api";
import { PageHeader } from "../components/PageHeader";
import { SectionTitle } from "../components/SectionTitle";
import {
  useCategories,
  useCreateCategorie,
  useDeleteCategorie,
  useUpdateCategorie,
} from "../hooks/useCategories";
import { useMedicaments } from "../hooks/useMedicaments";

const EMPTY_DRAFT = { nom: "", description: "" };

export function CategoriesPage() {
  const categoriesQuery = useCategories();
  const medicamentsQuery = useMedicaments();
  const createCategorie = useCreateCategorie();
  const updateCategorie = useUpdateCategorie();
  const deleteCategorie = useDeleteCategorie();

  const [draft, setDraft] = useState(EMPTY_DRAFT);
  const [editingId, setEditingId] = useState<number | null>(null);

  const isPending = createCategorie.isPending || updateCategorie.isPending;
  const submitError = (createCategorie.error ?? updateCategorie.error) as ApiError | null;

  function handleEdit(categorie: Categorie) {
    setEditingId(categorie.id);
    setDraft({ nom: categorie.nom, description: categorie.description });
  }

  function handleCancelEdit() {
    setEditingId(null);
    setDraft(EMPTY_DRAFT);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!draft.nom.trim()) return;
    const payload = { nom: draft.nom.trim(), description: draft.description.trim() };
    const onDone = () => {
      setDraft(EMPTY_DRAFT);
      setEditingId(null);
    };
    if (editingId !== null) {
      updateCategorie.mutate({ id: editingId, data: payload }, { onSuccess: onDone });
    } else {
      createCategorie.mutate(payload, { onSuccess: onDone });
    }
  }

  function handleDelete(categorie: Categorie, count: number) {
    if (count > 0) {
      alert(`Impossible : ${count} médicament(s) utilisent cette catégorie.`);
      return;
    }
    if (!confirm(`Supprimer la catégorie "${categorie.nom}" ?`)) return;
    deleteCategorie.mutate(categorie.id);
  }

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
                const count = medicaments.filter((m) => m.categorie?.id === categorie.id).length;
                const isDeleting = deleteCategorie.isPending && deleteCategorie.variables === categorie.id;
                return (
                  <Group
                    key={categorie.id}
                    className="category-row"
                    justify="space-between"
                    wrap="nowrap"
                    style={editingId === categorie.id ? { background: "#f1f5f9" } : undefined}
                  >
                    <div style={{ flex: 1 }}>
                      <Text fw={800}>{categorie.nom}</Text>
                      <Text size="sm" c="dimmed">
                        {categorie.description || "—"}
                      </Text>
                    </div>
                    <Text size="sm" fw={800} c="dimmed">
                      {count} médicaments
                    </Text>
                    <Group gap="xs" wrap="nowrap">
                      <ActionIcon variant="light" color="teal" onClick={() => handleEdit(categorie)} aria-label="Modifier">
                        <Pencil size={16} />
                      </ActionIcon>
                      <ActionIcon
                        variant="light"
                        color="red"
                        onClick={() => handleDelete(categorie, count)}
                        loading={isDeleting}
                        aria-label="Supprimer"
                      >
                        <Trash2 size={16} />
                      </ActionIcon>
                    </Group>
                  </Group>
                );
              })}
            </Stack>
          )}

          {deleteCategorie.isError && (
            <Alert color="red" icon={<AlertTriangle size={18} />} mt="md">
              {(deleteCategorie.error as ApiError).message}
            </Alert>
          )}
        </Card>

        <Card component="form" onSubmit={handleSubmit} withBorder radius="md" padding="lg" shadow="sm">
          <SectionTitle icon={editingId !== null ? Pencil : Plus} title={editingId !== null ? "Modifier la catégorie" : "Nouvelle catégorie"} />
          <Stack>
            <TextInput
              label="Nom*"
              required
              value={draft.nom}
              onChange={(event) => setDraft({ ...draft, nom: event.currentTarget.value })}
              placeholder="Dermatologie"
              disabled={isPending}
            />
            <Textarea
              label="Description"
              value={draft.description}
              onChange={(event) => setDraft({ ...draft, description: event.currentTarget.value })}
              minRows={4}
              disabled={isPending}
            />

            {submitError && (
              <Alert color="red" icon={<AlertTriangle size={18} />}>
                {submitError.message}
              </Alert>
            )}

            <Group justify="flex-end">
              {editingId !== null && (
                <Button variant="default" leftSection={<X size={15} />} onClick={handleCancelEdit} type="button" disabled={isPending}>
                  Annuler
                </Button>
              )}
              <Button
                type="submit"
                leftSection={isPending ? <Loader size={14} color="white" /> : <Save size={17} />}
                disabled={isPending || !draft.nom.trim()}
              >
                {isPending ? "Enregistrement…" : editingId !== null ? "Mettre à jour" : "Enregistrer"}
              </Button>
            </Group>
          </Stack>
        </Card>
      </SimpleGrid>
    </>
  );
}
