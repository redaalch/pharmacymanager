import { Alert, Center, Loader } from "@mantine/core";
import { AlertTriangle } from "lucide-react";
import { useMemo } from "react";
import { ApiError } from "../api";
import { DashboardAlerts } from "../components/dashboard/DashboardAlerts";
import { DashboardCharts } from "../components/dashboard/DashboardCharts";
import { DashboardMetrics } from "../components/dashboard/DashboardMetrics";
import { PageHeader } from "../components/PageHeader";
import { useCategories } from "../hooks/useCategories";
import { useAlertesStock, useMedicaments } from "../hooks/useMedicaments";
import { useVentes } from "../hooks/useVentes";
import { daysUntil, isToday } from "../utils/format";

const EXPIRY_WINDOW_DAYS = 75;

export function DashboardPage() {
  const medicamentsQuery = useMedicaments();
  const categoriesQuery = useCategories();
  const ventesQuery = useVentes();
  const alertesQuery = useAlertesStock();

  const medicaments = medicamentsQuery.data?.results ?? [];
  const categories = categoriesQuery.data?.results ?? [];
  const ventes = ventesQuery.data?.results ?? [];
  const lowStock = alertesQuery.data?.results ?? [];

  const expiringSoon = useMemo(
    () =>
      medicaments
        .map((m) => ({ ...m, daysLeft: daysUntil(m.date_expiration) }))
        .filter((m) => m.daysLeft <= EXPIRY_WINDOW_DAYS)
        .sort((a, b) => a.daysLeft - b.daysLeft),
    [medicaments],
  );

  const todaySales = useMemo(
    () => ventes.filter((v) => v.statut === "completee" && isToday(v.date_vente)),
    [ventes],
  );
  const todayRevenue = todaySales.reduce((sum, v) => sum + Number(v.total_ttc), 0);

  const isLoading =
    medicamentsQuery.isLoading || categoriesQuery.isLoading || ventesQuery.isLoading || alertesQuery.isLoading;

  const firstError =
    (medicamentsQuery.error ?? categoriesQuery.error ?? ventesQuery.error ?? alertesQuery.error) as
      | ApiError
      | null
      | undefined;

  return (
    <>
      <PageHeader
        eyebrow="Vue d'ensemble"
        title="Tableau de bord"
        description="Stocks, ventes et alertes opérationnelles de la pharmacie."
      />

      {firstError && (
        <Alert color="red" icon={<AlertTriangle size={18} />} mb="md" title="Erreur de chargement">
          {firstError.message}
        </Alert>
      )}

      {isLoading && !firstError ? (
        <Center p="xl">
          <Loader />
        </Center>
      ) : (
        <>
          <DashboardMetrics
            medicinesCount={medicaments.length}
            lowStockCount={lowStock.length}
            todaySalesCount={todaySales.length}
            todayRevenue={todayRevenue}
          />
          <DashboardCharts medicaments={medicaments} categories={categories} ventes={ventes} />
          <DashboardAlerts lowStock={lowStock} expiringSoon={expiringSoon} />
        </>
      )}
    </>
  );
}
