import type { Medicament, MedicamentInput } from "../../api";

export type MedicamentDraft = {
  nom: string;
  dci: string;
  categorie_id: number | null;
  forme: string;
  dosage: string;
  prix_achat: number | string;
  prix_vente: number | string;
  stock_actuel: number | string;
  stock_minimum: number | string;
  date_expiration: string;
  ordonnance_requise: boolean;
};

export const EMPTY_DRAFT: MedicamentDraft = {
  nom: "",
  dci: "",
  categorie_id: null,
  forme: "",
  dosage: "",
  prix_achat: 0,
  prix_vente: 0,
  stock_actuel: 0,
  stock_minimum: 0,
  date_expiration: "",
  ordonnance_requise: false,
};

export function draftFromMedicament(m: Medicament): MedicamentDraft {
  return {
    nom: m.nom,
    dci: m.dci,
    categorie_id: m.categorie.id,
    forme: m.forme,
    dosage: m.dosage,
    prix_achat: Number(m.prix_achat),
    prix_vente: Number(m.prix_vente),
    stock_actuel: m.stock_actuel,
    stock_minimum: m.stock_minimum,
    date_expiration: m.date_expiration,
    ordonnance_requise: m.ordonnance_requise,
  };
}

export function draftToInput(draft: MedicamentDraft): MedicamentInput {
  return {
    nom: draft.nom.trim(),
    dci: draft.dci.trim(),
    categorie_id: draft.categorie_id as number,
    forme: draft.forme.trim(),
    dosage: draft.dosage.trim(),
    prix_achat: Number(draft.prix_achat).toFixed(2),
    prix_vente: Number(draft.prix_vente).toFixed(2),
    stock_actuel: Number(draft.stock_actuel) || 0,
    stock_minimum: Number(draft.stock_minimum) || 0,
    date_expiration: draft.date_expiration,
    ordonnance_requise: draft.ordonnance_requise,
  };
}

export function isDraftValid(draft: MedicamentDraft): boolean {
  return Boolean(draft.nom.trim() && draft.categorie_id !== null && draft.date_expiration);
}
