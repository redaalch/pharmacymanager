import { DashboardAlerts } from "../components/dashboard/DashboardAlerts";
import { DashboardCharts } from "../components/dashboard/DashboardCharts";
import { DashboardMetrics } from "../components/dashboard/DashboardMetrics";
import { PageHeader } from "../components/PageHeader";
import type { Category, Medicine, Sale } from "../data/pharmacy";

type DashboardPageProps = {
  medicines: Medicine[];
  categories: Category[];
  lowStock: Medicine[];
  expiringSoon: (Medicine & { daysLeft: number })[];
  todaySalesCount: number;
  todayRevenue: number;
  sales: Sale[];
  onEditMedicine: (medicine: Medicine) => void;
};

export function DashboardPage({ medicines, categories, lowStock, expiringSoon, todaySalesCount, todayRevenue, sales, onEditMedicine }: DashboardPageProps) {
  return (
    <>
      <PageHeader eyebrow="Vue d'ensemble" title="Tableau de bord" description="Stocks, ventes et alertes opérationnelles de la pharmacie." />
      <DashboardMetrics medicinesCount={medicines.length} lowStockCount={lowStock.length} todaySalesCount={todaySalesCount} todayRevenue={todayRevenue} />
      <DashboardCharts medicines={medicines} categories={categories} sales={sales} />
      <DashboardAlerts lowStock={lowStock} expiringSoon={expiringSoon} onEditMedicine={onEditMedicine} />
    </>
  );
}
