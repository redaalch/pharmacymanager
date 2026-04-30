import { apiClient, type Paginated } from "./axiosConfig";

export type Categorie = {
  id: number;
  nom: string;
  description: string;
  date_creation: string;
};

export type CategorieInput = {
  nom: string;
  description?: string;
};

export type CategoriesQuery = {
  page?: number;
  search?: string;
  ordering?: string;
};

const RESOURCE = "/categories/";

export const categoriesApi = {
  list: (params: CategoriesQuery = {}) =>
    apiClient.get<Paginated<Categorie>>(RESOURCE, { params }).then((r) => r.data),

  getById: (id: number) =>
    apiClient.get<Categorie>(`${RESOURCE}${id}/`).then((r) => r.data),

  create: (data: CategorieInput) =>
    apiClient.post<Categorie>(RESOURCE, data).then((r) => r.data),

  update: (id: number, data: CategorieInput) =>
    apiClient.put<Categorie>(`${RESOURCE}${id}/`, data).then((r) => r.data),

  remove: (id: number) =>
    apiClient.delete<void>(`${RESOURCE}${id}/`).then((r) => r.data),
};
