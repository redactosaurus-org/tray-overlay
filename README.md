# Redactosaurus Tray Overlay

A modern, component-based React/Next.js application for managing protection settings and protected domains, built with **shadcn/ui** components.

## 🎨 UI Framework

This project uses **[shadcn/ui](https://ui.shadcn.com/)** - a collection of beautifully designed, accessible components built on top of **Radix UI** and **Tailwind CSS**.

```
tray-overlay/
├── app/                      # Next.js app directory
│   ├── layout.tsx           # Root layout component
│   ├── page.tsx             # Home page
│   └── globals.css          # Global styles and Tailwind imports
├── components/              # Reusable React components
│   ├── StatusDot.tsx        # Status indicator dot
│   ├── ThemeToggle.tsx      # Light/dark mode toggle
│   ├── ExtensionIndicator.tsx # Extension connection status
│   ├── ProtectionToggle.tsx # Main protection toggle
│   ├── PauseControls.tsx    # Pause/resume with time selection
│   ├── DomainManager.tsx    # Add/edit/remove domains
│   ├── TrayOverlay.tsx      # Main container component
│   └── index.ts             # Component exports
├── hooks/                   # Custom React hooks
│   ├── useDesktopApi.ts    # Desktop API access
│   ├── useTrayState.ts     # Tray state management
│   ├── useDomains.ts       # Domain management logic
│   ├── useExtensionStatus.ts # Extension status polling
│   ├── useTheme.ts         # Theme management
│   └── index.ts            # Hook exports
├── lib/                     # Utility functions and constants
│   ├── constants.ts        # Application constants
│   ├── utils.ts            # Helper functions
├── types/                   # TypeScript type definitions
│   └── index.ts
├── package.json            # Dependencies and scripts
├── tsconfig.json           # TypeScript configuration
├── tailwind.config.js      # Tailwind CSS configuration
├── postcss.config.js       # PostCSS configuration
├── next.config.js          # Next.js configuration
└── README.md               # This file
```

## Key Features

### Separation of Concerns

- **Components**: UI presentation only
- **Hooks**: State management and business logic
- **Utils**: Pure functions for transformations
- **Types**: Type safety with TypeScript

### Components

| Component            | Purpose                                    |
| -------------------- | ------------------------------------------ |
| `TrayOverlay`        | Main container managing all features       |
| `ProtectionToggle`   | Toggle protection on/off                   |
| `PauseControls`      | Set pause duration and manage pause/resume |
| `DomainManager`      | Add, edit, remove protected domains        |
| `ExtensionIndicator` | Show extension connection status           |
| `ThemeToggle`        | Switch between light/dark themes           |
| `StatusDot`          | Visual indicator of current state          |

### shadcn/ui Components

The following shadcn/ui components are used throughout the application:

| Component                    | Usage                                                            |
| ---------------------------- | ---------------------------------------------------------------- |
| `Button`                     | All interactive buttons (pause, resume, add, save, remove, etc.) |
| `Input`                      | Domain input field in DomainManager                              |
| `Checkbox`                   | Protection toggle checkbox                                       |
| `Label`                      | Associated labels for form inputs                                |
| `Alert` & `AlertDescription` | Error and feedback messages                                      |
| `Badge`                      | Domain count indicator                                           |
| `Card` & `CardContent`       | Main container layout                                            |

All shadcn/ui components are located in `components/ui/` and are built on:

- **Radix UI** for unstyled, accessible primitives
- **Tailwind CSS** for styling
- **class-variance-authority** for component variants

### Custom Hooks

| Hook                 | Responsibility                          |
| -------------------- | --------------------------------------- |
| `useTrayState`       | Manage protection state and API calls   |
| `useDomains`         | Handle domain CRUD operations           |
| `useExtensionStatus` | Poll and track extension status         |
| `useTheme`           | Manage theme preference and persistence |
| `useDesktopApi`      | Provide desktop API singleton           |

### Best Practices Implemented

1. **Component Composition**: Small, focused components with single responsibilities
2. **Custom Hooks**: Encapsulated logic in reusable hooks
3. **Type Safety**: Full TypeScript coverage with interfaces
4. **State Management**: React hooks with useCallback for optimization
5. **Responsive Design**: Tailwind CSS for styling
6. **Accessibility**: ARIA labels, semantic HTML, keyboard support
7. **Error Handling**: Comprehensive error messages and feedback
8. **Performance**: Memoization and effect dependencies

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building

```bash
npm run build
npm run start
```

### Type Checking

```bash
npm run type-check
```

## Desktop API Integration

The application expects a `window.desktopApi` object with the following interface:

```typescript
const desktopApi = {
  tray: {
    getState: () => Promise<TrayState>,
    setProtectionEnabled: (enabled: boolean) => Promise<TrayState>,
    setPause: (minutes: number) => Promise<TrayState>,
    clearPause: () => Promise<TrayState>,
    openMainApp: () => Promise<void>,
    onStateChanged: (callback: (state: TrayState) => void) => () => void,
  },
  getProtectedDomains: () => Promise<{ domains: string[] }>,
  saveProtectedDomains: (domains: string[]) => Promise<{ domains: string[] }>,
  getExtensionConnectionStatus: () => Promise<ExtensionStatus>,
};
```

## Tailwind CSS

The project uses Tailwind CSS for styling with:

- Custom color extensions for accent colors
- Dark mode support via `data-theme` attribute
- Responsive design utilities

## Development Guidelines

### Adding a New Feature

1. **Create a Hook** (`hooks/useNewFeature.ts`) if it involves state or API logic
2. **Create Component(s)** (`components/NewFeature.tsx`) for UI
3. **Update Types** (`types/index.ts`) as needed
4. **Add Constants** (`lib/constants.ts`) if applicable
5. **Add Utilities** (`lib/utils.ts`) for helper functions

### Component Template

```tsx
import React from "react";

interface NewComponentProps {
  // props
}

export const NewComponent: React.FC<NewComponentProps> = (props) => {
  return <div>{/* content */}</div>;
};
```

### Hook Template

```tsx
import { useState, useCallback } from "react";

export const useNewFeature = () => {
  const [state, setState] = useState(null);

  const update = useCallback(() => {
    // logic
  }, []);

  return { state, update };
};
```

### Using shadcn/ui Components

To add or use shadcn/ui components:

1. **Import from `@/components/ui`:**

   ```tsx
   import { Button, Input, Alert, AlertDescription } from "@/components/ui";
   ```

2. **Use with variants:**

   ```tsx
   <Button variant="outline" size="sm">Click me</Button>
   <Alert variant="destructive">
     <AlertDescription>Error message</AlertDescription>
   </Alert>
   ```

3. **Customize with Tailwind CSS:**

   ```tsx
   <Button className="rounded-full">Custom Button</Button>
   ```

4. **Component Variants:**
   - **Button**: `default`, `destructive`, `outline`, `secondary`, `ghost`, `link`
   - **Alert**: `default`, `destructive`, `success`, `warning`
   - **Badge**: `default`, `secondary`, `destructive`, `outline`, `success`, `warning`

### Adding New shadcn/ui Components

To add a new shadcn component:

1. The component files are already set up in `components/ui/`
2. Import and use them in your custom components
3. Components can be customized by modifying the corresponding file in `components/ui/`
4. All components use the CSS custom properties defined in `app/globals.css`

## License

Proprietary - Redactosaurus
