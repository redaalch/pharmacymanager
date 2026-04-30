import { apiClient, type Paginated } from "./axiosConfig";

export type VenteStatut = "en_cours" | "completee" | "annulee";

export type LigneVente = {
  id: number;
  medicament: number;
  medicament_nom: string;
  quantite: number;
  prix_unitaire: string;
  sous_total: string;
};

export type Vente = {
  id: number;
  reference: string;
  date_vente: string;
  total_ttc: string;
  statut: VenteStatut;
  notes: string;
  lignes: LigneVente[];
};

export type LigneVenteInput = {
  medicament_id: number;
  quantite: number;
};

export type VenteInput = {
  notes?: string;
  lignes: LigneVenteInput[];
};

export type VentesQuery = {
  page?: number;
  statut?: VenteStatut;
  date_min?: string;
  date_max?: string;
  ordering?: string;
};

const RESOURCE = "/ventes/";

export const ventesApi = {
  list: (params: VentesQuery = {}) =>
    apiClient.get<Paginated<Vente>>(RESOURCE, { params }).then((r) => r.data),

  getById: (id: number) =>
    apiClient.get<Vente>(`${RESOURCE}${id}/`).then((r) => r.data),

  create: (data: VenteInput) =>
    apiClient.post<Vente>(RESOURCE, data).then((r) => r.data),

  annuler: (id: number) =>
    apiClient.post<Vente>(`${RESOURCE}${id}/annuler/`).then((r) => r.data),
};
