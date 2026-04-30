import { useState } from "react";
import { AppLayout } from "./components/AppLayout";
import type { Page } from "./config/navigation";
import { AlertsPage } from "./pages/AlertsPage";
import { CategoriesPage } from "./pages/CategoriesPage";
import { DashboardPage } from "./pages/DashboardPage";
import { MedicinesPage } from "./pages/MedicinesPage";
import { SalesPage } from "./pages/SalesPage";
import { SettingsPage } from "./pages/SettingsPage";

export default function App() {
  const [page, setPage] = useState<Page>("dashboard");

  return (
    <AppLayout page={page} onPageChange={setPage}>
      {page === "dashboard" && <DashboardPage />}
      {page === "medicines" && <MedicinesPage />}
      {page === "sales" && <SalesPage />}
      {page === "categories" && <CategoriesPage />}
      {page === "alerts" && <AlertsPage />}
      {page === "settings" && <SettingsPage />}
    </AppLayout>
  );
}
