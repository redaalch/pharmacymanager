import { Card, Group, Text, ThemeIcon } from "@mantine/core";
import type { LucideIcon } from "lucide-react";

type MetricCardProps = {
  icon: LucideIcon;
  value: string;
  label: string;
  sub: string;
  color: string;
  trend?: string;
};

export function MetricCard({ icon: Icon, value, label, sub, color, trend }: MetricCardProps) {
  return (
    <Card withBorder radius="md" padding="lg" shadow="sm">
      <Group justify="space-between" align="flex-start" mb="sm">
        <ThemeIcon color={color} variant="light" size={46} radius="md">
          <Icon size={24} />
        </ThemeIcon>
        {trend ? (
          <Text c="teal.7" fw={800} size="sm">
            {trend}
          </Text>
        ) : null}
      </Group>
      <Text fw={900} fz={28} lh={1}>
        {value}
      </Text>
      <Text fw={800} mt={4}>
        {label}
      </Text>
      <Text c="dimmed" size="sm">
        {sub}
      </Text>
    </Card>
  );
}
