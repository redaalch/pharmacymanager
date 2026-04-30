import { Button, Card, ColorInput, Group, SimpleGrid, Stack, Text, Textarea, TextInput } from "@mantine/core";
import { LayoutGrid, Plus, Save } from "lucide-react";
import type { FormEvent } from "react";
import { PageHeader } from "../components/PageHeader";
import { SectionTitle } from "../components/SectionTitle";
import type { Category, Medicine } from "../data/pharmacy";

type CategoryDraft = {
  name: string;
  description: string;
  color: string;
};

type CategoriesPageProps = {
  categories: Category[];
  medicines: Medicine[];
  draft: CategoryDraft;
  onDraftChange: (draft: CategoryDraft) => void;
  onSave: (event: FormEvent<HTMLFormElement>) => void;
};

export function CategoriesPage({ categories, medicines, draft, onDraftChange, onSave }: CategoriesPageProps) {
  return (
    <>
      <PageHeader eyebrow="Classification" title="Catégories" description="Organisez le catalogue par famille thérapeutique." />

      <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="md">
        <Card withBorder radius="md" padding="lg" shadow="sm">
          <SectionTitle icon={LayoutGrid} title="Catégories existantes" />
          <Stack>
            {categories.map((category) => {
              const count = medicines.filter((medicine) => medicine.categoryId === category.id).length;
              return (
                <Group key={category.id} className="category-row" justify="space-between" wrap="nowrap">
                  <Group gap="sm" wrap="nowrap">
                    <span className="category-color" style={{ background: category.color }} />
                    <div>
                      <Text fw={800}>{category.name}</Text>
                      <Text size="sm" c="dimmed">
                        {category.description}
                      </Text>
                    </div>
                  </Group>
                  <Text size="sm" fw={800} c="dimmed">
                    {count} médicaments
                  </Text>
                </Group>
              );
            })}
          </Stack>
        </Card>

        <Card component="form" onSubmit={onSave} withBorder radius="md" padding="lg" shadow="sm">
          <SectionTitle icon={Plus} title="Nouvelle catégorie" />
          <Stack>
            <TextInput label="Nom*" value={draft.name} onChange={(event) => onDraftChange({ ...draft, name: event.currentTarget.value })} placeholder="Dermatologie" />
            <Textarea label="Description" value={draft.description} onChange={(event) => onDraftChange({ ...draft, description: event.currentTarget.value })} minRows={4} />
            <ColorInput label="Couleur" value={draft.color} onChange={(color) => onDraftChange({ ...draft, color })} />
            <Button leftSection={<Save size={17} />} type="submit">
              Enregistrer
            </Button>
          </Stack>
        </Card>
      </SimpleGrid>
    </>
  );
}
