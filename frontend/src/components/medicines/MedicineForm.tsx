import {
  Alert,
  Button,
  Card,
  Checkbox,
  Group,
  Loader,
  NumberInput,
  Select,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { AlertTriangle, Pill, Save } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { ApiError, type Categorie, type Medicament, type MedicamentInput } from "../../api";
import { useCreateMedicament, useUpdateMedicament } from "../../hooks/useMedicaments";

type MedicineFormProps = {
  categories: Categorie[];
  editing: Medicament | null;
  onCancel: () => void;
  onSuccess?: () => void;
};

type Draft = {
  nom: string;
  dci: string;
  categorie_id: number | null;
  forme: string;
  dosage: string;
  prix_achat: number | string;
  prix_vente: number | string;
  stock_actuel: number | string;
  stock_minimum: number | string;
  date_expiration: string;
  ordonnance_requise: boolean;
};

const EMPTY: Draft = {
  nom: "",
  dci: "",
  categorie_id: null,
  forme: "",
  dosage: "",
  prix_achat: 0,
  prix_vente: 0,
  stock_actuel: 0,
  stock_minimum: 0,
  date_expiration: "",
  ordonnance_requise: false,
};

function fromMedicament(m: Medicament): Draft {
  return {
    nom: m.nom,
    dci: m.dci,
    categorie_id: m.categorie.id,
    forme: m.forme,
    dosage: m.dosage,
    prix_achat: Number(m.prix_achat),
    prix_vente: Number(m.prix_vente),
    stock_actuel: m.stock_actuel,
    stock_minimum: m.stock_minimum,
    date_expiration: m.date_expiration,
    ordonnance_requise: m.ordonnance_requise,
  };
}

function toInput(draft: Draft): MedicamentInput {
  return {
    nom: draft.nom.trim(),
    dci: draft.dci.trim(),
    categorie_id: draft.categorie_id as number,
    forme: draft.forme.trim(),
    dosage: draft.dosage.trim(),
    prix_achat: Number(draft.prix_achat).toFixed(2),
    prix_vente: Number(draft.prix_vente).toFixed(2),
    stock_actuel: Number(draft.stock_actuel) || 0,
    stock_minimum: Number(draft.stock_minimum) || 0,
    date_expiration: draft.date_expiration,
    ordonnance_requise: draft.ordonnance_requise,
  };
}

export function MedicineForm({ categories, editing, onCancel, onSuccess }: MedicineFormProps) {
  const [draft, setDraft] = useState<Draft>(EMPTY);
  const createMutation = useCreateMedicament();
  const updateMutation = useUpdateMedicament();

  useEffect(() => {
    setDraft(editing ? fromMedicament(editing) : EMPTY);
  }, [editing]);

  function updateField<K extends keyof Draft>(key: K, value: Draft[K]) {
    setDraft((prev) => ({ ...prev, [key]: value }));
  }

  const isPending = createMutation.isPending || updateMutation.isPending;
  const error = (createMutation.error ?? updateMutation.error) as ApiError | null;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!draft.nom.trim() || !draft.dci.trim() || draft.categorie_id === null || !draft.date_expiration) {
      return;
    }
    const payload = toInput(draft);
    const onDone = () => {
      setDraft(EMPTY);
      onSuccess?.();
    };
    if (editing) {
      updateMutation.mutate({ id: editing.id, data: payload }, { onSuccess: onDone });
    } else {
      createMutation.mutate(payload, { onSuccess: onDone });
    }
  }

  return (
    <Card component="form" onSubmit={handleSubmit} withBorder radius="md" padding="lg" shadow="sm">
      <Group gap="sm" mb="lg">
        <Pill size={20} color="#0f766e" />
        <div>
          <Title order={2} fz="md">
            {editing ? "Modifier le médicament" : "Ajouter un médicament"}
          </Title>
          <Text size="sm" c="dimmed">
            Synchronisé avec l'API
          </Text>
        </div>
      </Group>

      <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="sm">
        <TextInput required label="Nom*" value={draft.nom} onChange={(e) => updateField("nom", e.currentTarget.value)} placeholder="Amoxicilline 1g" />
        <TextInput required label="DCI*" value={draft.dci} onChange={(e) => updateField("dci", e.currentTarget.value)} placeholder="Amoxicilline" />
        <Select
          required
          label="Catégorie*"
          value={draft.categorie_id !== null ? String(draft.categorie_id) : null}
          onChange={(value) => updateField("categorie_id", value ? Number(value) : null)}
          data={categories.map((c) => ({ value: String(c.id), label: c.nom }))}
          placeholder="Sélectionner"
        />
        <TextInput required label="Forme*" value={draft.forme} onChange={(e) => updateField("forme", e.currentTarget.value)} placeholder="Comprimé" />
        <TextInput required label="Dosage*" value={draft.dosage} onChange={(e) => updateField("dosage", e.currentTarget.value)} placeholder="500mg" />
        <TextInput required type="date" label="Date d'expiration*" value={draft.date_expiration} onChange={(e) => updateField("date_expiration", e.currentTarget.value)} />
        <NumberInput required label="Prix achat (MAD)*" min={0} decimalScale={2} value={draft.prix_achat} onChange={(v) => updateField("prix_achat", v)} />
        <NumberInput required label="Prix vente (MAD)*" min={0} decimalScale={2} value={draft.prix_vente} onChange={(v) => updateField("prix_vente", v)} />
        <NumberInput required label="Stock actuel*" min={0} value={draft.stock_actuel} onChange={(v) => updateField("stock_actuel", v)} />
        <NumberInput required label="Stock minimum*" min={0} value={draft.stock_minimum} onChange={(v) => updateField("stock_minimum", v)} />
      </SimpleGrid>

      <Stack gap="md" mt="md">
        <Checkbox
          label="Ordonnance requise"
          checked={draft.ordonnance_requise}
          onChange={(e) => updateField("ordonnance_requise", e.currentTarget.checked)}
        />

        {error && (
          <Alert color="red" icon={<AlertTriangle size={18} />}>
            {error.message}
          </Alert>
        )}

        <Group justify="flex-end">
          <Button variant="default" onClick={onCancel} type="button" disabled={isPending}>
            Annuler
          </Button>
          <Button
            type="submit"
            leftSection={isPending ? <Loader size={14} color="white" /> : <Save size={17} />}
            disabled={isPending}
          >
            {isPending ? "Enregistrement…" : editing ? "Mettre à jour" : "Enregistrer"}
          </Button>
        </Group>
      </Stack>
    </Card>
  );
}
