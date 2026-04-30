import { Button, Card, Group, SimpleGrid, Stack, Text } from "@mantine/core";
import { RotateCcw, ShieldCheck } from "lucide-react";
import { PageHeader } from "../components/PageHeader";
import { SectionTitle } from "../components/SectionTitle";
import type { Medicine, Sale } from "../data/pharmacy";

type SettingsPageProps = {
  onReset: () => void;
  medicines: Medicine[];
  sales: Sale[];
};

export function SettingsPage({ onReset, medicines, sales }: SettingsPageProps) {
  return (
    <>
      <PageHeader eyebrow="Préférences" title="Paramètres" description="Configuration locale de la démonstration PharmaManager." />

      <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="md">
        <Card withBorder radius="md" padding="lg" shadow="sm">
          <SectionTitle icon={ShieldCheck} title="Pharmacie" />
          <Stack gap="sm">
            <Summary label="Nom" value="Pharmacie Centrale" />
            <Summary label="Identifiant" value="PHC-001" />
            <Summary label="Responsable" value="Dr. Martin" />
            <Summary label="Données actives" value={`${medicines.length} médicaments · ${sales.length} ventes`} />
          </Stack>
        </Card>
        <Card withBorder radius="md" padding="lg" shadow="sm">
          <SectionTitle icon={RotateCcw} title="Données de démonstration" />
          <Text c="dimmed" mb="md">
            Les modifications sont conservées dans le navigateur avec localStorage. Vous pouvez restaurer l'état de départ à tout moment.
          </Text>
          <Button variant="default" leftSection={<RotateCcw size={17} />} onClick={onReset}>
            Restaurer les données
          </Button>
        </Card>
      </SimpleGrid>
    </>
  );
}

function Summary({ label, value }: { label: string; value: string }) {
  return (
    <Group justify="space-between">
      <Text c="dimmed">{label}</Text>
      <Text fw={800}>{value}</Text>
    </Group>
  );
}
