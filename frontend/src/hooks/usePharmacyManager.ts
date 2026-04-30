import { useMemo, useState, type FormEvent } from "react";
import {
  createSaleLine,
  emptyMedicineDraft,
  initialCategories,
  initialMedicines,
  initialSales,
  type Category,
  type Medicine,
  type MedicineDraft,
  type Page,
  type Sale,
} from "../data/pharmacy";
import { appendNote, clamp, daysUntil, isToday, makeId, makeSaleReference, slugify } from "../utils/pharmacy";
import { useLocalStorageState } from "./useLocalStorageState";

type CategoryDraft = {
  name: string;
  description: string;
  color: string;
};

export function usePharmacyManager() {
  const [page, setPage] = useState<Page>("dashboard");
  const [globalSearch, setGlobalSearch] = useState("");
  const [medicines, setMedicines] = useLocalStorageState<Medicine[]>("pharma-manager-medicines", initialMedicines);
  const [categories, setCategories] = useLocalStorageState<Category[]>("pharma-manager-categories", initialCategories);
  const [sales, setSales] = useLocalStorageState<Sale[]>("pharma-manager-sales", initialSales);

  const [medicineSearch, setMedicineSearch] = useState("");
  const [medicineCategory, setMedicineCategory] = useState("all");
  const [medicineStatus, setMedicineStatus] = useState("all");
  const [medicineDraft, setMedicineDraft] = useState<MedicineDraft>(emptyMedicineDraft);
  const [editingMedicineId, setEditingMedicineId] = useState<string | null>(null);

  const [saleSearch, setSaleSearch] = useState("");
  const [saleQuantities, setSaleQuantities] = useState<Record<string, number>>({ "2": 2, "1": 1 });
  const [saleNotes, setSaleNotes] = useState("");
  const [categoryDraft, setCategoryDraft] = useState<CategoryDraft>({ name: "", description: "", color: "#0fb7a7" });

  const activeMedicines = useMemo(() => medicines.filter((medicine) => medicine.active), [medicines]);
  const lowStock = useMemo(() => activeMedicines.filter((medicine) => medicine.stock <= medicine.minStock), [activeMedicines]);
  const expiringSoon = useMemo(
    () =>
      activeMedicines
        .map((medicine) => ({ ...medicine, daysLeft: daysUntil(medicine.expirationDate) }))
        .filter((medicine) => medicine.daysLeft <= 75)
        .sort((a, b) => a.daysLeft - b.daysLeft),
    [activeMedicines],
  );
  const todaySales = sales.filter((sale) => sale.status === "Complétée" && isToday(sale.date));
  const todayRevenue = todaySales.reduce((sum, sale) => sum + sale.totalTtc, 0);
  const cart = useMemo(
    () =>
      activeMedicines
        .filter((medicine) => (saleQuantities[medicine.id] ?? 0) > 0)
        .map((medicine) => createSaleLine(medicine.id, medicine.name, saleQuantities[medicine.id] ?? 0, medicine.salePrice)),
    [activeMedicines, saleQuantities],
  );
  const cartSubtotal = cart.reduce((sum, line) => sum + line.subtotal, 0);
  const cartVat = cartSubtotal * 0.2;
  const cartTotal = cartSubtotal + cartVat;
  const topbarSearchValue = page === "medicines" ? medicineSearch : page === "sales" ? saleSearch : globalSearch;

  function handleTopbarSearch(value: string) {
    if (page === "medicines") setMedicineSearch(value);
    if (page === "sales") setSaleSearch(value);
    if (page !== "medicines" && page !== "sales") setGlobalSearch(value);
  }

  function handleSaveMedicine(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!medicineDraft.name.trim() || !medicineDraft.dci.trim() || medicineDraft.salePrice <= 0) return;

    if (editingMedicineId) {
      setMedicines((current) => current.map((medicine) => (medicine.id === editingMedicineId ? { ...medicine, ...medicineDraft } : medicine)));
    } else {
      setMedicines((current) => [{ id: makeId("med"), active: true, ...medicineDraft }, ...current]);
    }
    setMedicineDraft(emptyMedicineDraft);
    setEditingMedicineId(null);
  }

  function handleEditMedicine(medicine: Medicine) {
    setMedicineDraft({
      name: medicine.name,
      dci: medicine.dci,
      categoryId: medicine.categoryId,
      form: medicine.form,
      dosage: medicine.dosage,
      purchasePrice: medicine.purchasePrice,
      salePrice: medicine.salePrice,
      stock: medicine.stock,
      minStock: medicine.minStock,
      expirationDate: medicine.expirationDate,
      prescription: medicine.prescription,
    });
    setEditingMedicineId(medicine.id);
    setPage("medicines");
  }

  function handleArchiveMedicine(medicineId: string) {
    setMedicines((current) => current.map((medicine) => (medicine.id === medicineId ? { ...medicine, active: false } : medicine)));
    setSaleQuantities((current) => {
      const next = { ...current };
      delete next[medicineId];
      return next;
    });
  }

  function handleCancelMedicineEdit() {
    setMedicineDraft(emptyMedicineDraft);
    setEditingMedicineId(null);
  }

  function handleQuantityChange(medicineId: string, delta: number) {
    const medicine = activeMedicines.find((item) => item.id === medicineId);
    if (!medicine) return;
    setSaleQuantities((current) => ({ ...current, [medicineId]: clamp((current[medicineId] ?? 0) + delta, 0, medicine.stock) }));
  }

  function handleCompleteSale() {
    if (cart.length === 0) return;

    const validatedLines = cart
      .map((line) => {
        const medicine = medicines.find((item) => item.id === line.medicineId);
        if (!medicine || !medicine.active) return null;
        const quantity = clamp(line.quantity, 0, medicine.stock);
        if (quantity <= 0) return null;
        return createSaleLine(medicine.id, medicine.name, quantity, medicine.salePrice);
      })
      .filter((line): line is NonNullable<typeof line> => line !== null);

    if (validatedLines.length === 0) {
      setSaleQuantities({});
      return;
    }

    const validatedSubtotal = validatedLines.reduce((sum, line) => sum + line.subtotal, 0);
    const validatedTotal = validatedSubtotal * 1.2;

    const sale: Sale = {
      id: makeId("sale"),
      reference: makeSaleReference(sales.length + 1),
      date: new Date().toISOString(),
      totalTtc: Number(validatedTotal.toFixed(2)),
      status: "Complétée",
      notes: saleNotes,
      lines: validatedLines,
    };

    setMedicines((current) =>
      current.map((medicine) => {
        const soldLine = validatedLines.find((line) => line.medicineId === medicine.id);
        return soldLine ? { ...medicine, stock: Math.max(0, medicine.stock - soldLine.quantity) } : medicine;
      }),
    );
    setSales((current) => [sale, ...current]);
    setSaleQuantities({});
    setSaleNotes("");
  }

  function handleCancelSale(saleId: string) {
    const sale = sales.find((item) => item.id === saleId);
    if (!sale || sale.status === "Annulée") return;
    setSales((current) => current.map((item) => (item.id === saleId ? { ...item, status: "Annulée", notes: appendNote(item.notes, "Vente annulée") } : item)));
    setMedicines((current) =>
      current.map((medicine) => {
        const returnedLine = sale.lines.find((line) => line.medicineId === medicine.id);
        return returnedLine ? { ...medicine, stock: medicine.stock + returnedLine.quantity } : medicine;
      }),
    );
  }

  function handleSaveCategory(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const name = categoryDraft.name.trim();
    if (!name) return;
    setCategories((current) => {
      const baseId = slugify(name) || makeId("cat");
      const existingIds = new Set(current.map((category) => category.id));
      let id = baseId;
      let suffix = 2;
      while (existingIds.has(id)) {
        id = `${baseId}-${suffix++}`;
      }
      return [...current, { id, name, description: categoryDraft.description.trim(), color: categoryDraft.color }];
    });
    setCategoryDraft({ name: "", description: "", color: "#0fb7a7" });
  }

  function resetDemoData() {
    setMedicines(initialMedicines);
    setCategories(initialCategories);
    setSales(initialSales);
    setSaleQuantities({ "2": 2, "1": 1 });
    setMedicineDraft(emptyMedicineDraft);
    setEditingMedicineId(null);
  }

  return {
    page,
    setPage,
    topbarSearchValue,
    activeMedicines,
    categories,
    sales,
    lowStock,
    expiringSoon,
    todaySales,
    todayRevenue,
    medicineSearch,
    medicineCategory,
    medicineStatus,
    medicineDraft,
    editingMedicineId,
    saleSearch,
    saleQuantities,
    saleNotes,
    cart,
    cartSubtotal,
    cartVat,
    cartTotal,
    categoryDraft,
    setMedicineSearch,
    setMedicineCategory,
    setMedicineStatus,
    setMedicineDraft,
    setSaleSearch,
    setSaleNotes,
    setCategoryDraft,
    handleTopbarSearch,
    handleSaveMedicine,
    handleEditMedicine,
    handleArchiveMedicine,
    handleCancelMedicineEdit,
    handleQuantityChange,
    handleCompleteSale,
    handleCancelSale,
    handleSaveCategory,
    resetDemoData,
  };
}
