import { SimpleGrid } from "@mantine/core";
import { AlertTriangle, CircleDollarSign, Pill, ShoppingCart } from "lucide-react";
import { MetricCard } from "../MetricCard";
import { formatCurrency } from "../../utils/pharmacy";

type DashboardMetricsProps = {
  medicinesCount: number;
  lowStockCount: number;
  todaySalesCount: number;
  todayRevenue: number;
};

export function DashboardMetrics({ medicinesCount, lowStockCount, todaySalesCount, todayRevenue }: DashboardMetricsProps) {
  return (
    <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="md" mb="md">
      <MetricCard icon={Pill} color="teal" value={medicinesCount.toLocaleString("fr-FR")} label="Médicaments" sub="En stock" trend="+12%" />
      <MetricCard icon={AlertTriangle} color="red" value={lowStockCount.toString()} label="Alertes stock" sub="Sous le seuil min." />
      <MetricCard icon={ShoppingCart} color="blue" value={todaySalesCount.toString()} label="Ventes du jour" sub="+15% vs hier" />
      <MetricCard icon={CircleDollarSign} color="yellow" value={formatCurrency(todayRevenue)} label="Chiffre du jour" sub="+18% vs hier" />
    </SimpleGrid>
  );
}
