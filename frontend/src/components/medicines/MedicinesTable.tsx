import { ActionIcon, Group, Table, Text } from "@mantine/core";
import { Pencil, Trash2 } from "lucide-react";
import { StatusBadge } from "../StatusBadge";
import type { Category, Medicine } from "../../data/pharmacy";
import { getCategoryName, stockStatus } from "../../utils/pharmacy";

type MedicinesTableProps = {
  categories: Category[];
  medicines: Medicine[];
  onEdit: (medicine: Medicine) => void;
  onArchive: (medicineId: string) => void;
};

export function MedicinesTable({ categories, medicines, onEdit, onArchive }: MedicinesTableProps) {
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
          {medicines.map((medicine) => (
            <Table.Tr key={medicine.id}>
              <Table.Td>
                <Text fw={800}>{medicine.name}</Text>
                <Text size="xs" c="dimmed">
                  {medicine.dosage}
                </Text>
              </Table.Td>
              <Table.Td>{medicine.dci}</Table.Td>
              <Table.Td>{getCategoryName(categories, medicine.categoryId)}</Table.Td>
              <Table.Td>{medicine.form}</Table.Td>
              <Table.Td>
                <Text fw={800} c={stockStatus(medicine) === "ok" ? undefined : "red"}>
                  {medicine.stock}
                </Text>
              </Table.Td>
              <Table.Td>
                <StatusBadge status={stockStatus(medicine)} />
              </Table.Td>
              <Table.Td>
                <Group gap="xs" wrap="nowrap">
                  <ActionIcon variant="light" color="teal" onClick={() => onEdit(medicine)} aria-label="Modifier">
                    <Pencil size={16} />
                  </ActionIcon>
                  <ActionIcon variant="light" color="red" onClick={() => onArchive(medicine.id)} aria-label="Archiver">
                    <Trash2 size={16} />
                  </ActionIcon>
                </Group>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Table.ScrollContainer>
  );
}
