import { AppLayout } from "./components/AppLayout";
import { navItems } from "./data/pharmacy";
import { usePharmacyManager } from "./hooks/usePharmacyManager";
import { AlertsPage } from "./pages/AlertsPage";
import { CategoriesPage } from "./pages/CategoriesPage";
import { DashboardPage } from "./pages/DashboardPage";
import { MedicinesPage } from "./pages/MedicinesPage";
import { SalesPage } from "./pages/SalesPage";
import { SettingsPage } from "./pages/SettingsPage";

export default function App() {
  const pharmacy = usePharmacyManager();

  return (
    <AppLayout
      page={pharmacy.page}
      navItems={navItems}
      alertCount={pharmacy.lowStock.length}
      searchValue={pharmacy.topbarSearchValue}
      onPageChange={pharmacy.setPage}
      onSearchChange={pharmacy.handleTopbarSearch}
    >
      {pharmacy.page === "dashboard" && (
        <DashboardPage
          medicines={pharmacy.activeMedicines}
          categories={pharmacy.categories}
          lowStock={pharmacy.lowStock}
          expiringSoon={pharmacy.expiringSoon}
          todaySalesCount={pharmacy.todaySales.length}
          todayRevenue={pharmacy.todayRevenue}
          sales={pharmacy.sales}
          onEditMedicine={pharmacy.handleEditMedicine}
        />
      )}

      {pharmacy.page === "medicines" && <MedicinesPage />}

      {pharmacy.page === "sales" && (
        <SalesPage
          medicines={pharmacy.activeMedicines}
          sales={pharmacy.sales}
          search={pharmacy.saleSearch}
          quantities={pharmacy.saleQuantities}
          notes={pharmacy.saleNotes}
          cart={pharmacy.cart}
          subtotal={pharmacy.cartSubtotal}
          vat={pharmacy.cartVat}
          total={pharmacy.cartTotal}
          onSearchChange={pharmacy.setSaleSearch}
          onQuantityChange={pharmacy.handleQuantityChange}
          onNotesChange={pharmacy.setSaleNotes}
          onCompleteSale={pharmacy.handleCompleteSale}
          onCancelSale={pharmacy.handleCancelSale}
        />
      )}

      {pharmacy.page === "categories" && <CategoriesPage />}
      {pharmacy.page === "alerts" && <AlertsPage />}
      {pharmacy.page === "settings" && <SettingsPage onReset={pharmacy.resetDemoData} medicines={pharmacy.activeMedicines} sales={pharmacy.sales} />}
    </AppLayout>
  );
}
