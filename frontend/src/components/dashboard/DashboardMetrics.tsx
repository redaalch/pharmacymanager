import { SimpleGrid } from "@mantine/core";
import { AlertTriangle, CircleDollarSign, Pill, ShoppingCart } from "lucide-react";
import { MetricCard } from "../MetricCard";
import { formatCurrency } from "../../utils/format";

type DashboardMetricsProps = {
  medicinesCount: number;
  lowStockCount: number;
  todaySalesCount: number;
  todayRevenue: number;
};

export function DashboardMetrics({ medicinesCount, lowStockCount, todaySalesCount, todayRevenue }: DashboardMetricsProps) {
  return (
    <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="md" mb="md">
      <MetricCard icon={Pill} color="teal" value={medicinesCount.toLocaleString("fr-FR")} label="Médicaments actifs" sub="En stock" />
      <MetricCard icon={AlertTriangle} color="red" value={lowStockCount.toString()} label="Alertes stock" sub="Sous le seuil min." />
      <MetricCard icon={ShoppingCart} color="blue" value={todaySalesCount.toString()} label="Ventes du jour" sub="Aujourd'hui" />
      <MetricCard icon={CircleDollarSign} color="yellow" value={formatCurrency(todayRevenue)} label="Chiffre du jour" sub="Total TTC" />
    </SimpleGrid>
  );
}
