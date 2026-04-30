import {
  Bell,
  Home,
  LayoutGrid,
  Pill,
  Settings,
  ShoppingCart,
  type LucideIcon,
} from "lucide-react";

export type Page = "dashboard" | "medicines" | "sales" | "categories" | "alerts" | "settings";
export type SaleStatus = "Complétée" | "Annulée";

export type Category = {
  id: string;
  name: string;
  description: string;
  color: string;
};

export type Medicine = {
  id: string;
  name: string;
  dci: string;
  categoryId: string;
  form: string;
  dosage: string;
  purchasePrice: number;
  salePrice: number;
  stock: number;
  minStock: number;
  expirationDate: string;
  prescription: boolean;
  active: boolean;
};

export type MedicineDraft = Omit<Medicine, "id" | "active">;

export type SaleLine = {
  medicineId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
};

export type Sale = {
  id: string;
  reference: string;
  date: string;
  totalTtc: number;
  status: SaleStatus;
  notes: string;
  lines: SaleLine[];
};

export type NavItem = {
  key: Page;
  icon: LucideIcon;
  label: string;
};

export const navItems: NavItem[] = [
  { key: "dashboard", icon: Home, label: "Tableau de bord" },
  { key: "medicines", icon: Pill, label: "Médicaments" },
  { key: "sales", icon: ShoppingCart, label: "Ventes" },
  { key: "categories", icon: LayoutGrid, label: "Catégories" },
  { key: "alerts", icon: Bell, label: "Alertes" },
  { key: "settings", icon: Settings, label: "Paramètres" },
];

export const initialCategories: Category[] = [
  { id: "antibiotiques", name: "Antibiotiques", description: "Traitements anti-infectieux", color: "#2563eb" },
  { id: "antalgiques", name: "Antalgiques", description: "Douleur et fièvre", color: "#0fb7a7" },
  { id: "digestifs", name: "Digestifs", description: "Troubles digestifs", color: "#f59e0b" },
  { id: "cardiologie", name: "Cardiologie", description: "Traitements cardiovasculaires", color: "#ef4444" },
  { id: "respiratoire", name: "Respiratoire", description: "Asthme et voies respiratoires", color: "#8b5cf6" },
  { id: "antihistaminiques", name: "Antihistaminiques", description: "Allergies et rhinites", color: "#14b8a6" },
];

export const initialMedicines: Medicine[] = [
  createMedicine("1", "Amoxicilline 1g", "Amoxicilline", "antibiotiques", "Comprimé", "1g", 0.45, 1.2, 12, 50, "2026-06-30", true),
  createMedicine("2", "Paracétamol 500mg", "Paracétamol", "antalgiques", "Comprimé", "500mg", 0.22, 0.8, 120, 30, "2027-03-12", false),
  createMedicine("3", "Ibuprofène 400mg", "Ibuprofène", "antalgiques", "Comprimé", "400mg", 0.35, 1.1, 15, 40, "2026-08-02", false),
  createMedicine("4", "Oméprazole 20mg", "Oméprazole", "digestifs", "Gélule", "20mg", 0.62, 1.5, 80, 25, "2026-11-18", false),
  createMedicine("5", "Loratadine 10mg", "Loratadine", "antihistaminiques", "Comprimé", "10mg", 0.31, 0.9, 5, 20, "2026-07-01", false),
  createMedicine("6", "Azithromycine 500mg", "Azithromycine", "antibiotiques", "Comprimé", "500mg", 1.2, 2.1, 42, 18, "2026-05-30", true),
  createMedicine("7", "Salbutamol 100µg", "Salbutamol", "respiratoire", "Inhalateur", "100µg", 1.6, 3.4, 25, 12, "2027-01-22", false),
  createMedicine("8", "Diclofénac 75mg", "Diclofénac", "antalgiques", "Comprimé", "75mg", 0.4, 1.25, 7, 25, "2026-06-05", true),
  createMedicine("9", "Atorvastatine 20mg", "Atorvastatine", "cardiologie", "Comprimé", "20mg", 0.75, 1.9, 64, 20, "2027-04-10", true),
];

export const initialSales: Sale[] = [
  {
    id: "sale-1",
    reference: "VNT-2026-0001",
    date: "2026-04-29T10:30:00",
    totalTtc: 23.76,
    status: "Complétée",
    notes: "Client comptoir",
    lines: [
      createSaleLine("2", "Paracétamol 500mg", 4, 0.8),
      createSaleLine("4", "Oméprazole 20mg", 2, 1.5),
      createSaleLine("7", "Salbutamol 100µg", 4, 3.4),
    ],
  },
  {
    id: "sale-2",
    reference: "VNT-2026-0002",
    date: "2026-04-29T09:15:00",
    totalTtc: 10.8,
    status: "Complétée",
    notes: "Ordonnance vérifiée",
    lines: [createSaleLine("1", "Amoxicilline 1g", 3, 1.2), createSaleLine("5", "Loratadine 10mg", 6, 0.9)],
  },
  {
    id: "sale-3",
    reference: "VNT-2026-0003",
    date: "2026-04-28T16:45:00",
    totalTtc: 33.36,
    status: "Complétée",
    notes: "Paiement carte",
    lines: [createSaleLine("9", "Atorvastatine 20mg", 8, 1.9), createSaleLine("6", "Azithromycine 500mg", 6, 2.1)],
  },
  {
    id: "sale-4",
    reference: "VNT-2026-0004",
    date: "2026-04-28T11:20:00",
    totalTtc: 8.16,
    status: "Complétée",
    notes: "",
    lines: [createSaleLine("3", "Ibuprofène 400mg", 4, 1.1), createSaleLine("2", "Paracétamol 500mg", 3, 0.8)],
  },
];

export const emptyMedicineDraft: MedicineDraft = {
  name: "",
  dci: "",
  categoryId: "antibiotiques",
  form: "Comprimé",
  dosage: "",
  purchasePrice: 0,
  salePrice: 0,
  stock: 0,
  minStock: 10,
  expirationDate: "2026-12-31",
  prescription: false,
};

export function createSaleLine(medicineId: string, name: string, quantity: number, unitPrice: number): SaleLine {
  return {
    medicineId,
    name,
    quantity,
    unitPrice,
    subtotal: Number((quantity * unitPrice).toFixed(2)),
  };
}

function createMedicine(
  id: string,
  name: string,
  dci: string,
  categoryId: string,
  form: string,
  dosage: string,
  purchasePrice: number,
  salePrice: number,
  stock: number,
  minStock: number,
  expirationDate: string,
  prescription: boolean,
): Medicine {
  return { id, name, dci, categoryId, form, dosage, purchasePrice, salePrice, stock, minStock, expirationDate, prescription, active: true };
}
