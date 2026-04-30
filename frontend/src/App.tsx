import { useState } from "react";
import { AppLayout } from "./components/AppLayout";
import type { Page } from "./config/navigation";
import { AlertsPage } from "./pages/AlertsPage";
import { CategoriesPage } from "./pages/CategoriesPage";
import { DashboardPage } from "./pages/DashboardPage";
import { MedicamentsPage } from "./pages/MedicamentsPage";
import { SettingsPage } from "./pages/SettingsPage";
import { VentesPage } from "./pages/VentesPage";

export default function App() {
  const [page, setPage] = useState<Page>("dashboard");

  return (
    <AppLayout page={page} onPageChange={setPage}>
      {page === "dashboard" && <DashboardPage />}
      {page === "medicaments" && <MedicamentsPage />}
      {page === "ventes" && <VentesPage />}
      {page === "categories" && <CategoriesPage />}
      {page === "alerts" && <AlertsPage />}
      {page === "settings" && <SettingsPage />}
    </AppLayout>
  );
}
