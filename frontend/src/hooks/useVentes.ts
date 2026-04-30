import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ventesApi,
  type Vente,
  type VenteInput,
  type VentesQuery,
} from "../api";

const KEY = ["ventes"] as const;

export function useVentes(params: VentesQuery = {}) {
  return useQuery({
    queryKey: [...KEY, params],
    queryFn: () => ventesApi.list(params),
  });
}

export function useVente(id: number | null) {
  return useQuery({
    queryKey: [...KEY, "detail", id],
    queryFn: () => ventesApi.getById(id as number),
    enabled: id !== null,
  });
}

export function useCreateVente() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: VenteInput) => ventesApi.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEY });
      qc.invalidateQueries({ queryKey: ["medicaments"] });
    },
  });
}

export function useAnnulerVente() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => ventesApi.annuler(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEY });
      qc.invalidateQueries({ queryKey: ["medicaments"] });
    },
  });
}

export type { Vente, VenteInput };
