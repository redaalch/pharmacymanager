import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  categoriesApi,
  type Categorie,
  type CategorieInput,
  type CategoriesQuery,
} from "../api";

const KEY = ["categories"] as const;

export function useCategories(params: CategoriesQuery = {}) {
  return useQuery({
    queryKey: [...KEY, params],
    queryFn: () => categoriesApi.list(params),
  });
}

export function useCategorie(id: number | null) {
  return useQuery({
    queryKey: [...KEY, "detail", id],
    queryFn: () => categoriesApi.getById(id as number),
    enabled: id !== null,
  });
}

export function useCreateCategorie() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CategorieInput) => categoriesApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}

export function useUpdateCategorie() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: CategorieInput }) =>
      categoriesApi.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}

export function useDeleteCategorie() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => categoriesApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
}

export type { Categorie, CategorieInput };
