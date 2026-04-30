import { Badge } from "@mantine/core";

type StatusBadgeProps = {
  status: string;
  label?: string;
};

export function StatusBadge({ status, label }: StatusBadgeProps) {
  const text =
    label ??
    ({
      ok: "En stock",
      low: "Stock bas",
      out: "Rupture",
      warning: "À surveiller",
      danger: "Urgent",
    }[status] ||
      status);

  const color =
    {
      ok: "teal",
      low: "red",
      out: "red",
      danger: "red",
      warning: "yellow",
      Complétée: "teal",
      Annulée: "red",
    }[status] ?? "gray";

  return (
    <Badge color={color} variant="light" radius="xl">
      {text}
    </Badge>
  );
}
