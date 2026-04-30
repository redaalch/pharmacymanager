# PharmaManager Frontend

Frontend-only pharmacy management dashboard built with React, Vite, TypeScript, Mantine, Recharts and lucide-react.

There is no backend in this version. Demo data is stored in `localStorage`, so the app behaves like a real interface while staying fully client-side.

## Features

- Dashboard with stock KPIs, sales totals, charts, low-stock alerts and expiry alerts
- Medicines page with search, filters, add/edit form, stock status and soft archive
- Sales page with cart quantities, TTC calculation, sale history and sale cancellation with stock restore
- Categories, alerts and settings screens for a complete navigation flow
- Mantine AppShell layout and responsive UI components

## Project Structure

```text
src/
  components/   Shared layout and UI helpers
  data/         Demo domain data and TypeScript domain types
  hooks/        Reusable React hooks
  pages/        Feature pages
  styles/       Product-specific CSS on top of Mantine
  utils/        Formatting and pharmacy business helpers
```

## Run Locally

```bash
npm install
npm run dev
```

Vite prints the local URL in the terminal, usually:

```text
http://localhost:5173/
```

## Quality Checks

```bash
npm run typecheck
npm run build
```

## Notes

The technical brief is kept in [docs/technical-brief.pdf](docs/technical-brief.pdf). When a backend is added later, replace the `localStorage` state layer with API calls for medicines, categories and sales.
