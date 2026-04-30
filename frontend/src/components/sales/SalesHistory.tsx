import { Alert, Button, Card, Center, Loader, Skeleton, Stack, Table, Text } from "@mantine/core";
import { AlertTriangle, ShoppingCart } from "lucide-react";
import { ApiError, type Vente, type VenteStatut } from "../../api";
import { formatCurrency, formatDateTime } from "../../utils/format";
import { StatusBadge } from "../StatusBadge";
import { PanelTitle } from "./PanelTitle";

const STATUT_LABEL: Record<VenteStatut, string> = {
  en_cours: "En cours",
  completee: "Complétée",
  annulee: "Annulée",
};

const STATUT_BADGE: Record<VenteStatut, string> = {
  en_cours: "warning",
  completee: "Complétée",
  annulee: "Annulée",
};

type SalesHistoryProps = {
  sales: Vente[];
  isLoading: boolean;
  isError: boolean;
  error: ApiError | null;
  cancelling: number | null;
  onCancelSale: (saleId: number) => void;
};

export function SalesHistory({ sales, isLoading, isError, error, cancelling, onCancelSale }: SalesHistoryProps) {
  return (
    <Card withBorder radius="md" padding="lg" shadow="sm">
      <PanelTitle icon={<ShoppingCart size={20} />} title="Historique des ventes" />

      {isLoading && (
        <Stack>
          <Skeleton height={32} />
          <Skeleton height={32} />
          <Skeleton height={32} />
        </Stack>
      )}

      {isError && (
        <Alert color="red" icon={<AlertTriangle size={18} />}>
          {error?.message ?? "Erreur de chargement"}
        </Alert>
      )}

      {!isLoading && !isError && sales.length === 0 && (
        <Center p="md">
          <Text c="dimmed">Aucune vente enregistrée.</Text>
        </Center>
      )}

      {!isLoading && !isError && sales.length > 0 && (
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
                  <Table.Td>{formatDateTime(sale.date_vente)}</Table.Td>
                  <Table.Td>{sale.lignes.length}</Table.Td>
                  <Table.Td>{formatCurrency(sale.total_ttc)}</Table.Td>
                  <Table.Td>
                    <StatusBadge status={STATUT_BADGE[sale.statut]} label={STATUT_LABEL[sale.statut]} />
                  </Table.Td>
                  <Table.Td>
                    <Button
                      variant="default"
                      size="xs"
                      onClick={() => onCancelSale(sale.id)}
                      disabled={sale.statut === "annulee" || cancelling === sale.id}
                      leftSection={cancelling === sale.id ? <Loader size={12} /> : null}
                    >
                      Annuler
                    </Button>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Table.ScrollContainer>
      )}
    </Card>
  );
}
