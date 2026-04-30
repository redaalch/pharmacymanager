import { Button, Card, Table, Text } from "@mantine/core";
import { ShoppingCart } from "lucide-react";
import { StatusBadge } from "../StatusBadge";
import type { Sale } from "../../data/pharmacy";
import { formatCurrency, formatDateTime } from "../../utils/pharmacy";
import { PanelTitle } from "./PanelTitle";

type SalesHistoryProps = {
  sales: Sale[];
  onCancelSale: (saleId: string) => void;
};

export function SalesHistory({ sales, onCancelSale }: SalesHistoryProps) {
  return (
    <Card withBorder radius="md" padding="lg" shadow="sm">
      <PanelTitle icon={<ShoppingCart size={20} />} title="Historique des ventes" />
      <Table.ScrollContainer minWidth={820}>
        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Référence</Table.Th>
              <Table.Th>Date</Table.Th>
              <Table.Th>Articles</Table.Th>
              <Table.Th>Montant</Table.Th>
              <Table.Th>Statut</Table.Th>
              <Table.Th>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {sales.map((sale) => (
              <Table.Tr key={sale.id}>
                <Table.Td>
                  <Text fw={800}>{sale.reference}</Text>
                  <Text size="xs" c="dimmed">
                    {sale.notes || "Client comptoir"}
                  </Text>
                </Table.Td>
                <Table.Td>{formatDateTime(sale.date)}</Table.Td>
                <Table.Td>{sale.lines.length}</Table.Td>
                <Table.Td>{formatCurrency(sale.totalTtc)}</Table.Td>
                <Table.Td>
                  <StatusBadge status={sale.status} label={sale.status} />
                </Table.Td>
                <Table.Td>
                  <Button variant="default" size="xs" onClick={() => onCancelSale(sale.id)} disabled={sale.status === "Annulée"}>
                    Annuler
                  </Button>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>
    </Card>
  );
}
