import { ActionIcon, Group, Table, Text } from "@mantine/core";
import { Pencil, Trash2 } from "lucide-react";
import type { Medicament } from "../../api";
import { stockStatus } from "../../utils/medicament";
import { StatusBadge } from "../StatusBadge";

type MedicinesTableProps = {
  medicines: Medicament[];
  onEdit: (medicine: Medicament) => void;
  onArchive: (medicineId: number) => void;
  archiving?: number | null;
};

export function MedicinesTable({ medicines, onEdit, onArchive, archiving }: MedicinesTableProps) {
  return (
    <Table.ScrollContainer minWidth={860}>
      <Table striped highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Nom</Table.Th>
            <Table.Th>DCI</Table.Th>
            <Table.Th>Catégorie</Table.Th>
            <Table.Th>Forme</Table.Th>
            <Table.Th>Stock</Table.Th>
            <Table.Th>Statut</Table.Th>
            <Table.Th>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {medicines.map((medicine) => {
            const status = stockStatus(medicine);
            return (
              <Table.Tr key={medicine.id}>
                <Table.Td>
                  <Text fw={800}>{medicine.nom}</Text>
                  <Text size="xs" c="dimmed">
                    {medicine.dosage}
                  </Text>
                </Table.Td>
                <Table.Td>{medicine.dci}</Table.Td>
                <Table.Td>{medicine.categorie?.nom ?? "—"}</Table.Td>
                <Table.Td>{medicine.forme}</Table.Td>
                <Table.Td>
                  <Text fw={800} c={status === "ok" ? undefined : "red"}>
                    {medicine.stock_actuel}
                  </Text>
                </Table.Td>
                <Table.Td>
                  <StatusBadge status={status} />
                </Table.Td>
                <Table.Td>
                  <Group gap="xs" wrap="nowrap">
                    <ActionIcon variant="light" color="teal" onClick={() => onEdit(medicine)} aria-label="Modifier">
                      <Pencil size={16} />
                    </ActionIcon>
                    <ActionIcon
                      variant="light"
                      color="red"
                      onClick={() => onArchive(medicine.id)}
                      aria-label="Archiver"
                      loading={archiving === medicine.id}
                    >
                      <Trash2 size={16} />
                    </ActionIcon>
                  </Group>
                </Table.Td>
              </Table.Tr>
            );
          })}
        </Table.Tbody>
      </Table>
    </Table.ScrollContainer>
  );
}
