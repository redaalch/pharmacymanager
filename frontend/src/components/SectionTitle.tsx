import { Group, ThemeIcon, Title } from "@mantine/core";
import type { LucideIcon } from "lucide-react";

type SectionTitleProps = {
  icon: LucideIcon;
  title: string;
};

export function SectionTitle({ icon: Icon, title }: SectionTitleProps) {
  return (
    <Group gap="sm" mb="md">
      <ThemeIcon color="teal" variant="light" radius="md">
        <Icon size={18} />
      </ThemeIcon>
      <Title order={2} fz="md">
        {title}
      </Title>
    </Group>
  );
}
