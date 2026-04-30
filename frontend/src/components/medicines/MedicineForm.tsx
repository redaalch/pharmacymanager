import { Button, Card, Checkbox, Group, NumberInput, Select, SimpleGrid, Stack, Text, TextInput, Textarea, Title } from "@mantine/core";
import { Pill, Save } from "lucide-react";
import type { FormEvent } from "react";
import type { Category, MedicineDraft } from "../../data/pharmacy";

type MedicineFormProps = {
  categories: Category[];
  draft: MedicineDraft;
  editing: boolean;
  onDraftChange: (draft: MedicineDraft) => void;
  onSave: (event: FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
};

export function MedicineForm({ categories, draft, editing, onDraftChange, onSave, onCancel }: MedicineFormProps) {
  function updateField<K extends keyof MedicineDraft>(key: K, value: MedicineDraft[K]) {
    onDraftChange({ ...draft, [key]: value });
  }

  return (
    <Card component="form" onSubmit={onSave} withBorder radius="md" padding="lg" shadow="sm">
      <Group gap="sm" mb="lg">
        <Pill size={20} color="#0f766e" />
        <div>
          <Title order={2} fz="md">
            {editing ? "Modifier le médicament" : "Ajouter un médicament"}
          </Title>
          <Text size="sm" c="dimmed">
            Données stockées dans le navigateur
          </Text>
        </div>
      </Group>

      <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="sm">
        <TextInput label="Nom*" value={draft.name} onChange={(event) => updateField("name", event.currentTarget.value)} placeholder="Amoxicilline 1g" />
        <TextInput label="DCI*" value={draft.dci} onChange={(event) => updateField("dci", event.currentTarget.value)} placeholder="Amoxicilline" />
        <Select
          label="Catégorie*"
          value={draft.categoryId}
          onChange={(value) => updateField("categoryId", value ?? "antibiotiques")}
          data={categories.map((category) => ({ value: category.id, label: category.name }))}
        />
        <TextInput label="Forme*" value={draft.form} onChange={(event) => updateField("form", event.currentTarget.value)} placeholder="Comprimé" />
        <TextInput label="Dosage*" value={draft.dosage} onChange={(event) => updateField("dosage", event.currentTarget.value)} placeholder="500mg" />
        <TextInput label="Date d'expiration*" type="date" value={draft.expirationDate} onChange={(event) => updateField("expirationDate", event.currentTarget.value)} />
        <NumberInput label="Prix achat (€)*" min={0} decimalScale={2} value={draft.purchasePrice} onChange={(value) => updateField("purchasePrice", Number(value) || 0)} />
        <NumberInput label="Prix vente (€)*" min={0} decimalScale={2} value={draft.salePrice} onChange={(value) => updateField("salePrice", Number(value) || 0)} />
        <NumberInput label="Stock actuel*" min={0} value={draft.stock} onChange={(value) => updateField("stock", Number(value) || 0)} />
        <NumberInput label="Stock minimum*" min={0} value={draft.minStock} onChange={(value) => updateField("minStock", Number(value) || 0)} />
      </SimpleGrid>

      <Stack gap="md" mt="md">
        <Checkbox label="Ordonnance requise" checked={draft.prescription} onChange={(event) => updateField("prescription", event.currentTarget.checked)} />
        <Textarea label="Note interne" placeholder="Informations complémentaires..." minRows={2} />
        <Group justify="flex-end">
          <Button variant="default" onClick={onCancel} type="button">
            Annuler
          </Button>
          <Button leftSection={<Save size={17} />} type="submit">
            {editing ? "Mettre à jour" : "Enregistrer"}
          </Button>
        </Group>
      </Stack>
    </Card>
  );
}
