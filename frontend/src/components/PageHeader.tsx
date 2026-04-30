import { Stack, Text, Title } from "@mantine/core";

type PageHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function PageHeader({ eyebrow, title, description }: PageHeaderProps) {
  return (
    <Stack gap={4} mb="xl">
      <Text c="teal.7" fw={800} size="xs" tt="uppercase" lts={1}>
        {eyebrow}
      </Text>
      <Title order={1} className="page-title">
        {title}
      </Title>
      <Text c="slate.6" maw={720}>
        {description}
      </Text>
    </Stack>
  );
}
