import { Bell, Home, LayoutGrid, Pill, Settings, ShoppingCart, type LucideIcon } from "lucide-react";

export type Page = "dashboard" | "medicaments" | "ventes" | "categories" | "alerts" | "settings";

export type NavItem = {
  key: Page;
  icon: LucideIcon;
  label: string;
};

export const navItems: NavItem[] = [
  { key: "dashboard", icon: Home, label: "Tableau de bord" },
  { key: "medicaments", icon: Pill, label: "Médicaments" },
  { key: "ventes", icon: ShoppingCart, label: "Ventes" },
  { key: "categories", icon: LayoutGrid, label: "Catégories" },
  { key: "alerts", icon: Bell, label: "Alertes" },
  { key: "settings", icon: Settings, label: "Paramètres" },
];
