import { Group, SimpleGrid, Text } from "@mantine/core";
import { BarChart3, LayoutGrid } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { Category, Medicine, Sale } from "../../data/pharmacy";
import { buildCategoryChart, buildRevenueChart, formatCurrency } from "../../utils/pharmacy";
import { DashboardCard } from "./DashboardCard";

type DashboardChartsProps = {
  medicines: Medicine[];
  categories: Category[];
  sales: Sale[];
};

export function DashboardCharts({ medicines, categories, sales }: DashboardChartsProps) {
  const revenueChart = buildRevenueChart(sales);
  const categoryChart = buildCategoryChart(medicines, categories);

  return (
    <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="md" mb="md">
      <DashboardCard title="Ventes récentes" icon={BarChart3}>
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
