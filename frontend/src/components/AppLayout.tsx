import {
  AppShell,
  Avatar,
  Badge,
  Burger,
  Button,
  Group,
  NavLink,
  rem,
  Text,
  TextInput,
  ThemeIcon,
  UnstyledButton,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Bell, ChevronDown, Pill, Plus, Search, ShoppingCart } from "lucide-react";
import type { ReactNode } from "react";
import type { NavItem, Page } from "../data/pharmacy";

type AppLayoutProps = {
  page: Page;
  navItems: NavItem[];
  alertCount: number;
  searchValue: string;
  children: ReactNode;
  onPageChange: (page: Page) => void;
  onSearchChange: (value: string) => void;
};

export function AppLayout({
  page,
  navItems,
  alertCount,
  searchValue,
  children,
  onPageChange,
  onSearchChange,
}: AppLayoutProps) {
  const [opened, { toggle, close }] = useDisclosure();

  function navigate(nextPage: Page) {
    onPageChange(nextPage);
    close();
  }

  return (
    <AppShell
      header={{ height: 76 }}
      navbar={{ width: 280, breakpoint: "md", collapsed: { mobile: !opened } }}
      padding="xl"
      className="app-shell"
    >
      <AppShell.Header className="app-header">
        <Group h="100%" justify="space-between" wrap="nowrap" className="topbar-container">
          <Group gap="md" className="header-search-wrap">
            <Burger opened={opened} onClick={toggle} hiddenFrom="md" size="sm" aria-label="Menu" />
            <TextInput
              leftSection={<Search size={17} />}
              placeholder="Rechercher (médicament, DCI, catégorie...)"
              value={searchValue}
              onChange={(event) => onSearchChange(event.currentTarget.value)}
              className="header-search"
              radius="md"
            />
          </Group>

          <Group gap="sm" wrap="nowrap">
            <UnstyledButton className="notification-button" onClick={() => navigate("alerts")} aria-label="Alertes">
              <Bell size={20} />
              {alertCount > 0 ? <span>{alertCount}</span> : null}
            </UnstyledButton>
            <Button
              leftSection={page === "sales" ? <Pill size={17} /> : <ShoppingCart size={17} />}
              onClick={() => navigate(page === "sales" ? "medicines" : "sales")}
              visibleFrom="sm"
            >
              {page === "sales" ? "Catalogue" : "Nouvelle vente"}
            </Button>
            <Group gap={6} visibleFrom="sm">
              <Avatar color="teal" radius="xl">
                DM
              </Avatar>
              <ChevronDown size={15} />
            </Group>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar className="app-navbar">
        <Group gap="sm" mb={34}>
          <ThemeIcon size={52} radius={14} className="brand-icon">
            <Plus size={25} strokeWidth={3} />
          </ThemeIcon>
          <div>
            <Text fw={900} fz={20} lh={1} c="white">
              Pharma<Text span c="teal.4">Manager</Text>
            </Text>
            <Text c="slate.4" size="xs">
              Pharmacie Centrale
            </Text>
          </div>
        </Group>

        <div className="nav-list">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = page === item.key;
            return (
              <NavLink
                key={item.key}
                active={active}
                label={item.label}
                leftSection={<Icon size={rem(18)} />}
                rightSection={item.key === "alerts" && alertCount > 0 ? <Badge color="red">{alertCount}</Badge> : null}
                onClick={() => navigate(item.key)}
                classNames={{ root: "main-nav-link" }}
              />
            );
          })}
        </div>

        <div className="navbar-footer">
          <div className="pharmacy-card">
            <Text fw={800} c="white" size="sm">
              Pharmacie Centrale
            </Text>
            <Text c="slate.4" size="xs">
              ID : PHC-001
            </Text>
          </div>
          <Group gap="sm">
            <Avatar color="teal" radius="xl">
              DM
            </Avatar>
            <div>
              <Text fw={800} c="white" size="sm">
                Dr. Martin
              </Text>
              <Text c="slate.4" size="xs">
                Pharmacien
              </Text>
            </div>
          </Group>
        </div>
      </AppShell.Navbar>

      <AppShell.Main>
        <div className="page-container">{children}</div>
      </AppShell.Main>
    </AppShell>
  );
}
