import { ActionIcon, SimpleGrid, Table, Text } from "@mantine/core";
import { AlertTriangle, CalendarClock, Pencil } from "lucide-react";
import { StatusBadge } from "../StatusBadge";
import type { Medicine } from "../../data/pharmacy";
import { formatDate, stockStatus } from "../../utils/pharmacy";
import { DashboardCard } from "./DashboardCard";

type DashboardAlertsProps = {
  lowStock: Medicine[];
  expiringSoon: (Medicine & { daysLeft: number })[];
  onEditMedicine: (medicine: Medicine) => void;
};

export function DashboardAlerts({ lowStock, expiringSoon, onEditMedicine }: DashboardAlertsProps) {
  return (
    <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="md">
      <DashboardCard title="Alertes de stock faible" icon={AlertTriangle}>
        <Table.ScrollContainer minWidth={620}>
          <Table striped highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Médicament</Table.Th>
                <Table.Th>Stock</Table.Th>
                <Table.Th>Min.</Table.Th>
                <Table.Th>Statut</Table.Th>
                <Table.Th>Action</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {lowStock.slice(0, 5).map((medicine) => (
                <Table.Tr key={medicine.id}>
                  <Table.Td>{medicine.name}</Table.Td>
                  <Table.Td>
                    <Text c="red" fw={800}>
                      {medicine.stock}
                    </Text>
                  </Table.Td>
                  <Table.Td>{medicine.minStock}</Table.Td>
                  <Table.Td>
                    <StatusBadge status={stockStatus(medicine)} />
                  </Table.Td>
                  <Table.Td>
                    <ActionIcon variant="light" color="teal" onClick={() => onEditMedicine(medicine)} aria-label="Modifier">
                      <Pencil size={16} />
                    </ActionIcon>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Table.ScrollContainer>
      </DashboardCard>

      <DashboardCard title="Médicaments bientôt expirés" icon={CalendarClock}>
        <Table.ScrollContainer minWidth={560}>
          <Table striped highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Médicament</Table.Th>
                <Table.Th>Expiration</Table.Th>
                <Table.Th>Jours restants</Table.Th>
                <Table.Th>Statut</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {expiringSoon.slice(0, 5).map((medicine) => (
                <Table.Tr key={medicine.id}>
                  <Table.Td>{medicine.name}</Table.Td>
                  <Table.Td>{formatDate(medicine.expirationDate)}</Table.Td>
                  <Table.Td>{medicine.daysLeft} j</Table.Td>
                  <Table.Td>
                    <StatusBadge status={medicine.daysLeft <= 30 ? "danger" : "warning"} label={medicine.daysLeft <= 30 ? "Urgent" : "À surveiller"} />
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Table.ScrollContainer>
      </DashboardCard>
    </SimpleGrid>
  );
}
