import { SimpleGrid, Table, Text } from "@mantine/core";
import { AlertTriangle, CalendarClock } from "lucide-react";
import type { Medicament } from "../../api";
import { formatDate } from "../../utils/format";
import { stockStatus } from "../../utils/medicament";
import { StatusBadge } from "../StatusBadge";
import { DashboardCard } from "./DashboardCard";

type ExpiringMedicament = Medicament & { daysLeft: number };

type DashboardAlertsProps = {
  lowStock: Medicament[];
  expiringSoon: ExpiringMedicament[];
};

export function DashboardAlerts({ lowStock, expiringSoon }: DashboardAlertsProps) {
  return (
    <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="md">
      <DashboardCard title="Alertes de stock faible" icon={AlertTriangle}>
        {lowStock.length === 0 ? (
          <Text c="dimmed" p="md">
            Aucun médicament sous le seuil.
          </Text>
        ) : (
          <Table.ScrollContainer minWidth={620}>
            <Table striped highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Médicament</Table.Th>
                  <Table.Th>Stock</Table.Th>
                  <Table.Th>Min.</Table.Th>
                  <Table.Th>Statut</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {lowStock.slice(0, 5).map((medicament) => (
                  <Table.Tr key={medicament.id}>
                    <Table.Td>{medicament.nom}</Table.Td>
                    <Table.Td>
                      <Text c="red" fw={800}>
                        {medicament.stock_actuel}
                      </Text>
                    </Table.Td>
                    <Table.Td>{medicament.stock_minimum}</Table.Td>
                    <Table.Td>
                      <StatusBadge status={stockStatus(medicament)} />
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Table.ScrollContainer>
        )}
      </DashboardCard>

      <DashboardCard title="Médicaments bientôt expirés" icon={CalendarClock}>
        {expiringSoon.length === 0 ? (
          <Text c="dimmed" p="md">
            Aucune péremption proche.
          </Text>
        ) : (
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
                {expiringSoon.slice(0, 5).map((medicament) => (
                  <Table.Tr key={medicament.id}>
                    <Table.Td>{medicament.nom}</Table.Td>
                    <Table.Td>{formatDate(medicament.date_expiration)}</Table.Td>
                    <Table.Td>{medicament.daysLeft} j</Table.Td>
                    <Table.Td>
                      <StatusBadge
                        status={medicament.daysLeft <= 30 ? "danger" : "warning"}
                        label={medicament.daysLeft <= 30 ? "Urgent" : "À surveiller"}
                      />
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Table.ScrollContainer>
        )}
      </DashboardCard>
    </SimpleGrid>
  );
}
