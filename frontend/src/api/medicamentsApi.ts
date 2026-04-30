import { apiClient, type Paginated } from "./axiosConfig";
import type { Categorie } from "./categoriesApi";

export type Medicament = {
  id: number;
  nom: string;
  dci: string;
  categorie: Categorie;
  forme: string;
  dosage: string;
  prix_achat: string;
  prix_vente: string;
  stock_actuel: number;
  stock_minimum: number;
  stock_bas: boolean;
  date_expiration: string;
  ordonnance_requise: boolean;
  date_creation: string;
  est_actif: boolean;
};

export type MedicamentInput = {
  nom: string;
  dci: string;
  categorie_id: number;
  forme: string;
  dosage: string;
  prix_achat: string | number;
  prix_vente: string | number;
  stock_actuel: number;
  stock_minimum: number;
  date_expiration: string;
  ordonnance_requise: boolean;
};

export type MedicamentsQuery = {
  page?: number;
  search?: string;
  categorie?: number;
  ordonnance_requise?: boolean;
  ordering?: string;
};

const RESOURCE = "/medicaments/";

export const medicamentsApi = {
  list: (params: MedicamentsQuery = {}) =>
    apiClient.get<Paginated<Medicament>>(RESOURCE, { params }).then((r) => r.data),

  getById: (id: number) =>
    apiClient.get<Medicament>(`${RESOURCE}${id}/`).then((r) => r.data),

  create: (data: MedicamentInput) =>
    apiClient.post<Medicament>(RESOURCE, data).then((r) => r.data),

  update: (id: number, data: Partial<MedicamentInput>) =>
    apiClient.patch<Medicament>(`${RESOURCE}${id}/`, data).then((r) => r.data),

  softDelete: (id: number) =>
    apiClient.delete<void>(`${RESOURCE}${id}/`).then((r) => r.data),

  alertes: () =>
    apiClient.get<Paginated<Medicament>>(`${RESOURCE}alertes/`).then((r) => r.data),
};
