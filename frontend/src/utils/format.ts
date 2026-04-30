export function formatCurrency(value: number | string) {
  const numeric = typeof value === "string" ? Number(value) : value;
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(numeric);
}

export function formatDate(date: string) {
  return new Intl.DateTimeFormat("fr-FR").format(new Date(`${date}T12:00:00`));
}

export function formatDateTime(date: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

export function daysUntil(date: string) {
  const target = new Date(`${date}T12:00:00`).getTime();
  const now = new Date().getTime();
  return Math.ceil((target - now) / 86_400_000);
}

export function isToday(date: string) {
  return new Date().toDateString() === new Date(date).toDateString();
}
