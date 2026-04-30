import { Alert, Card, Group, Loader, SimpleGrid, Skeleton, Stack, Text } from "@mantine/core";
import { AlertTriangle, CalendarClock } from "lucide-react";
import { useMemo } from "react";
import { ApiError } from "../api";
import { PageHeader } from "../components/PageHeader";
import { SectionTitle } from "../components/SectionTitle";
import { StatusBadge } from "../components/StatusBadge";
import { useAlertesStock, useMedicaments } from "../hooks/useMedicaments";
import { daysUntil, formatDate } from "../utils/format";

const EXPIRY_WINDOW_DAYS = 75;

export function AlertsPage() {
  const alertesQuery = useAlertesStock();
  const medicamentsQuery = useMedicaments();

  const lowStock = alertesQuery.data?.results ?? [];
  const expiringSoon = useMemo(() => {
    const all = medicamentsQuery.data?.results ?? [];
    return all
      .map((m) => ({ ...m, daysLeft: daysUntil(m.date_expiration) }))
      .filter((m) => m.daysLeft <= EXPIRY_WINDOW_DAYS)
      .sort((a, b) => a.daysLeft - b.daysLeft);
  }, [medicamentsQuery.data]);

  return (
    <>
      <PageHeader
        eyebrow="Surveillance"
        title="Alertes"
        description="Priorisez les réapprovisionnements et les dates de péremption proches."
      />

      <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="md">
        <Card withBorder radius="md" padding="lg" shadow="sm">
          <SectionTitle icon={AlertTriangle} title="Stock sous seuil" />

          {alertesQuery.isLoading && (
            <Stack>
              <Skeleton height={48} radius="sm" />
              <Skeleton height={48} radius="sm" />
            </Stack>
          )}
          {alertesQuery.isError && (
            <Alert color="red" icon={<AlertTriangle size={18} />}>
              {(alertesQuery.error as ApiError).message}
            </Alert>
          )}
          {alertesQuery.isSuccess && lowStock.length === 0 && (
            <Text c="dimmed">Aucun médicament sous le seuil 🎉</Text>
          )}
          {alertesQuery.isSuccess && lowStock.length > 0 && (
            <Stack>
              {lowStock.map((medicine) => (
                <Group key={medicine.id} className="alert-row" justify="space-between" wrap="nowrap">
                  <div>
                    <Text fw={800}>{medicine.nom}</Text>
                    <Text size="sm" c="dimmed">
                      {medicine.categorie?.nom ?? "—"}
                    </Text>
                  </div>
                  <div>
                    <Text c="red" fw={900} ta="right">
                      {medicine.stock_actuel}
                    </Text>
                    <Text size="xs" c="dimmed">
                      min. {medicine.stock_minimum}
                    </Text>
                  </div>
                </Group>
              ))}
            </Stack>
          )}
        </Card>

        <Card withBorder radius="md" padding="lg" shadow="sm">
          <SectionTitle icon={CalendarClock} title="Péremptions proches" />

          {medicamentsQuery.isLoading && (
            <Stack>
              <Skeleton height={48} radius="sm" />
              <Skeleton height={48} radius="sm" />
            </Stack>
          )}
          {medicamentsQuery.isError && (
            <Alert color="red" icon={<AlertTriangle size={18} />}>
              {(medicamentsQuery.error as ApiError).message}
            </Alert>
          )}
          {medicamentsQuery.isSuccess && expiringSoon.length === 0 && (
            <Text c="dimmed">Aucune péremption dans les {EXPIRY_WINDOW_DAYS} prochains jours.</Text>
          )}
          {medicamentsQuery.isSuccess && expiringSoon.length > 0 && (
            <Stack>
              {expiringSoon.map((medicine) => (
                <Group key={medicine.id} className="alert-row" justify="space-between" wrap="nowrap">
                  <div>
                    <Text fw={800}>{medicine.nom}</Text>
                    <Text size="sm" c="dimmed">
                      Expire le {formatDate(medicine.date_expiration)}
                    </Text>
                  </div>
                  <StatusBadge
                    status={medicine.daysLeft <= 30 ? "danger" : "warning"}
                    label={`${medicine.daysLeft} jours`}
                  />
                </Group>
              ))}
            </Stack>
          )}
        </Card>
      </SimpleGrid>
    </>
  );
}
