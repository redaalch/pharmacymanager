import { Group, Title } from "@mantine/core";
import type { ReactNode } from "react";

type PanelTitleProps = {
  icon: ReactNode;
  title: string;
};

export function PanelTitle({ icon, title }: PanelTitleProps) {
  return (
    <Group gap="sm" mb="md">
      <span className="section-icon">{icon}</span>
      <Title order={2} fz="md">
        {title}
      </Title>
    </Group>
  );
}
