import type { Category, Medicine, Sale } from "../data/pharmacy";

export function stockStatus(medicine: Medicine) {
  if (medicine.stock <= 0) return "out";
  if (medicine.stock <= medicine.minStock) return "low";
  return "ok";
}

export function getCategoryName(categories: Category[], categoryId: string) {
  return categories.find((category) => category.id === categoryId)?.name ?? "Non classé";
}

export function daysUntil(date: string) {
  const target = new Date(`${date}T12:00:00`).getTime();
  const now = new Date().getTime();
  return Math.ceil((target - now) / 86_400_000);
}

export function isToday(date: string) {
  return new Date().toDateString() === new Date(date).toDateString();
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(value);
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

export function buildRevenueChart(sales: Sale[]) {
  const labels = ["23/04", "24/04", "25/04", "26/04", "27/04", "28/04", "29/04"];
  const base = [120, 260, 180, 330, 210, 540, 420];
  return labels.map((label, index) => ({
    label,
    value:
      base[index] +
      sales
        .filter((sale) => sale.status === "Complétée" && formatShortDate(sale.date) === label)
        .reduce((sum, sale) => sum + sale.totalTtc, 0),
  }));
}

export function buildCategoryChart(medicines: Medicine[], categories: Category[]) {
  const rows = categories
    .map((category) => ({
      name: category.name,
      value: medicines.filter((medicine) => medicine.categoryId === category.id).length,
      color: category.color,
    }))
    .filter((category) => category.value > 0);
  return rows.length ? rows : [{ name: "Aucun stock", value: 1, color: "#cbd5e1" }];
}

export function makeId(prefix: string) {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}-${crypto.randomUUID()}`;
  }
  return `${prefix}-${Date.now()}-${Math.round(Math.random() * 1000)}`;
}

export function makeSaleReference(nextNumber: number) {
  return `VNT-${new Date().getFullYear()}-${String(nextNumber).padStart(4, "0")}`;
}

export function appendNote(current: string, note: string) {
  return current ? `${current} · ${note}` : note;
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function formatShortDate(date: string) {
  return new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "2-digit" }).format(new Date(date));
}
