import { Card, Group, ThemeIcon, Title } from "@mantine/core";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

type DashboardCardProps = {
  title: string;
  icon: LucideIcon;
  children: ReactNode;
};

export function DashboardCard({ title, icon: Icon, children }: DashboardCardProps) {
  return (
    <Card withBorder radius="md" padding="lg" shadow="sm">
      <Group gap="sm" mb="md">
        <ThemeIcon color="teal" variant="light" radius="md">
          <Icon size={17} />
        </ThemeIcon>
        <Title order={2} fz="md">
          {title}
        </Title>
      </Group>
      {children}
    </Card>
  );
}
