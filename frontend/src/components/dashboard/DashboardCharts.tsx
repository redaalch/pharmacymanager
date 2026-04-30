import { Group, SimpleGrid, Text } from "@mantine/core";
import { BarChart3, LayoutGrid } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { Categorie, Medicament, Vente } from "../../api";
import { formatCurrency } from "../../utils/format";
import { DashboardCard } from "./DashboardCard";

const PALETTE = ["#0fb7a7", "#2563eb", "#f59e0b", "#ef4444", "#8b5cf6", "#14b8a6", "#ec4899", "#10b981"];

type DashboardChartsProps = {
  medicaments: Medicament[];
  categories: Categorie[];
  ventes: Vente[];
};

function buildRevenueChart(ventes: Vente[]) {
  const days: { date: Date; label: string; total: number }[] = [];
  const fmt = new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "2-digit" });
  for (let offset = 6; offset >= 0; offset -= 1) {
    const date = new Date();
    date.setDate(date.getDate() - offset);
    date.setHours(0, 0, 0, 0);
    days.push({ date, label: fmt.format(date), total: 0 });
  }
  ventes
    .filter((vente) => vente.statut === "completee")
    .forEach((vente) => {
      const venteDate = new Date(vente.date_vente);
      venteDate.setHours(0, 0, 0, 0);
      const day = days.find((d) => d.date.getTime() === venteDate.getTime());
      if (day) day.total += Number(vente.total_ttc);
    });
  return days.map(({ label, total }) => ({ label, value: total }));
}

function buildCategoryChart(medicaments: Medicament[], categories: Categorie[]) {
  const rows = categories
    .map((categorie, index) => ({
      name: categorie.nom,
      value: medicaments.filter((m) => m.categorie?.id === categorie.id).length,
      color: PALETTE[index % PALETTE.length],
    }))
    .filter((row) => row.value > 0);
  return rows.length ? rows : [{ name: "Aucun stock", value: 1, color: "#cbd5e1" }];
}

export function DashboardCharts({ medicaments, categories, ventes }: DashboardChartsProps) {
  const revenueChart = buildRevenueChart(ventes);
  const categoryChart = buildCategoryChart(medicaments, categories);

  return (
    <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="md" mb="md">
      <DashboardCard title="Ventes des 7 derniers jours" icon={BarChart3}>
        <div className="chart-box">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={revenueChart} margin={{ top: 10, right: 8, bottom: 0, left: -18 }}>
              <CartesianGrid vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#64748b" }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#64748b" }} tickLine={false} axisLine={false} />
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              <Bar dataKey="value" fill="#0fb7a7" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </DashboardCard>

      <DashboardCard title="Répartition par catégorie" icon={LayoutGrid}>
        <div className="donut-layout">
          <div className="donut-box">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categoryChart} dataKey="value" nameKey="name" innerRadius={48} outerRadius={78} paddingAngle={2}>
                  {categoryChart.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="legend-list">
            {categoryChart.map((item) => (
              <Group key={item.name} justify="space-between" gap="sm" wrap="nowrap">
                <Group gap="xs" wrap="nowrap">
                  <span className="legend-dot" style={{ background: item.color }} />
                  <Text size="sm" c="dimmed">
                    {item.name}
                  </Text>
                </Group>
                <Text size="sm" fw={800}>
                  {item.value}
                </Text>
              </Group>
            ))}
          </div>
        </div>
      </DashboardCard>
    </SimpleGrid>
  );
}
