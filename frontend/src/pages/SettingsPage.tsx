import { Card, Group, SimpleGrid, Skeleton, Stack, Text } from "@mantine/core";
import { Database, ShieldCheck } from "lucide-react";
import { PageHeader } from "../components/PageHeader";
import { SectionTitle } from "../components/SectionTitle";
import { useCategories } from "../hooks/useCategories";
import { useMedicaments } from "../hooks/useMedicaments";
import { useVentes } from "../hooks/useVentes";

const API_URL = import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8000/api/v1";

export function SettingsPage() {
  const medicamentsQuery = useMedicaments();
  const categoriesQuery = useCategories();
  const ventesQuery = useVentes();

  const isLoading = medicamentsQuery.isLoading || categoriesQuery.isLoading || ventesQuery.isLoading;

  return (
    <>
      <PageHeader
        eyebrow="Préférences"
        title="Paramètres"
        description="Configuration et état de l'instance PharmaManager."
      />

      <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="md">
        <Card withBorder radius="md" padding="lg" shadow="sm">
          <SectionTitle icon={ShieldCheck} title="Pharmacie" />
          <Stack gap="sm">
            <Summary label="Nom" value="Pharmacie Centrale" />
            <Summary label="Identifiant" value="PHC-001" />
            <Summary label="Responsable" value="Dr. Martin" />
          </Stack>
        </Card>

        <Card withBorder radius="md" padding="lg" shadow="sm">
          <SectionTitle icon={Database} title="État de l'API" />
          <Stack gap="sm">
            <Summary label="Endpoint" value={API_URL} />
            {isLoading ? (
              <>
                <Skeleton height={20} />
                <Skeleton height={20} />
                <Skeleton height={20} />
              </>
            ) : (
              <>
                <Summary label="Catégories" value={String(categoriesQuery.data?.count ?? 0)} />
                <Summary label="Médicaments" value={String(medicamentsQuery.data?.count ?? 0)} />
                <Summary label="Ventes" value={String(ventesQuery.data?.count ?? 0)} />
              </>
            )}
          </Stack>
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
