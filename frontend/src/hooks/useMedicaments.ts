import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  medicamentsApi,
  type Medicament,
  type MedicamentInput,
  type MedicamentsQuery,
} from "../api";

const KEY = ["medicaments"] as const;

export function useMedicaments(params: MedicamentsQuery = {}) {
  return useQuery({
    queryKey: [...KEY, params],
    queryFn: () => medicamentsApi.list(params),
  });
}

export function useMedicament(id: number | null) {
  return useQuery({
    queryKey: [...KEY, "detail", id],
    queryFn: () => medicamentsApi.getById(id as number),
    enabled: id !== null,
  });
}

export function useAlertesStock() {
  return useQuery({
    queryKey: [...KEY, "alertes"],
    queryFn: () => medicamentsApi.alertes(),
  });
}

export function useCreateMedicament() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: MedicamentInput) => medicamentsApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}

export function useUpdateMedicament() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<MedicamentInput> }) =>
      medicamentsApi.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}

export function useDeleteMedicament() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => medicamentsApi.softDelete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}

export type { Medicament, MedicamentInput };
