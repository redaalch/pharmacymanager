import { Button, Card, Group, SimpleGrid, Stack, Text } from "@mantine/core";
import { AlertTriangle, CalendarClock } from "lucide-react";
import { PageHeader } from "../components/PageHeader";
import { SectionTitle } from "../components/SectionTitle";
import { StatusBadge } from "../components/StatusBadge";
import type { Category, Medicine } from "../data/pharmacy";
import { formatDate, getCategoryName } from "../utils/pharmacy";

type AlertsPageProps = {
  lowStock: Medicine[];
  expiringSoon: (Medicine & { daysLeft: number })[];
  categories: Category[];
  onEditMedicine: (medicine: Medicine) => void;
};

export function AlertsPage({ lowStock, expiringSoon, categories, onEditMedicine }: AlertsPageProps) {
  return (
    <>
      <PageHeader eyebrow="Surveillance" title="Alertes" description="Priorisez les réapprovisionnements et les dates de péremption proches." />

      <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="md">
        <Card withBorder radius="md" padding="lg" shadow="sm">
          <SectionTitle icon={AlertTriangle} title="Stock sous seuil" />
          <Stack>
            {lowStock.map((medicine) => (
              <Group key={medicine.id} className="alert-row" justify="space-between" wrap="nowrap">
                <div>
                  <Text fw={800}>{medicine.name}</Text>
                  <Text size="sm" c="dimmed">
                    {getCategoryName(categories, medicine.categoryId)}
                  </Text>
                </div>
                <div>
                  <Text c="red" fw={900} ta="right">
                    {medicine.stock}
                  </Text>
                  <Text size="xs" c="dimmed">
                    min. {medicine.minStock}
                  </Text>
                </div>
                <Button variant="default" size="xs" onClick={() => onEditMedicine(medicine)}>
                  Traiter
                </Button>
              </Group>
            ))}
          </Stack>
        </Card>

        <Card withBorder radius="md" padding="lg" shadow="sm">
          <SectionTitle icon={CalendarClock} title="Péremptions proches" />
          <Stack>
            {expiringSoon.map((medicine) => (
              <Group key={medicine.id} className="alert-row" justify="space-between" wrap="nowrap">
                <div>
                  <Text fw={800}>{medicine.name}</Text>
                  <Text size="sm" c="dimmed">
                    Expire le {formatDate(medicine.expirationDate)}
                  </Text>
                </div>
                <StatusBadge status={medicine.daysLeft <= 30 ? "danger" : "warning"} label={`${medicine.daysLeft} jours`} />
              </Group>
            ))}
          </Stack>
        </Card>
      </SimpleGrid>
    </>
  );
}
