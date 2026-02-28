# Vacation Calendar Design System

Adapted from the ScheduleLaw design system. This document describes the tokens, components, and patterns used in the vacation-calendar app.

## Source files

| What | Where |
|---|---|
| Token palettes + style maps | `src/design-system/tokens.ts` |
| Tailwind v4 theme + CSS variables | `src/app/globals.css` |
| shadcn/ui primitives | `src/components/ui/` |
| Utility function | `src/lib/utils.ts` |

---

## Typography

### Fonts

| Role | Family | Tailwind class |
|---|---|---|
| Body / UI | Mabry Pro | `font-mabry` (applied to `<body>` by default) |
| Headings | Reckless Neue | `font-reckless font-light` |

### Headings

All headings use `font-reckless font-light tracking-tight`.

| Level | Size class |
|---|---|
| h1 | `text-4xl` |
| h2 | `text-3xl` |

```tsx
<h2 className="font-reckless font-light text-3xl tracking-tight">Section title</h2>
```

### Text scale

Use `text-lg`, `text-sm`, `text-xs`. Do **not** use `text-base`.

| Class | Usage |
|---|---|
| `text-lg` | Introductions |
| `text-sm` | Secondary info, compact layouts |
| `text-xs` | Captions, timestamps |

### Font weights

Use `font-medium` (500), `font-semibold` (600), `font-bold` (700). Do **not** use `font-normal` (400).

---

## Color system

Colors are available through three layers.

### 1. Semantic CSS variables (for shadcn components)

Defined in `globals.css` as HSL values. Used by shadcn primitives automatically.

| Variable | Role |
|---|---|
| `--background` / `--foreground` | Page background and default text |
| `--primary` / `--primary-foreground` | Brand actions (buttons, links, focus rings) |
| `--secondary` / `--secondary-foreground` | Secondary surfaces |
| `--muted` / `--muted-foreground` | Subdued backgrounds, placeholder text |
| `--destructive` / `--destructive-foreground` | Destructive actions |
| `--accent` / `--accent-foreground` | Hover/focus highlights |
| `--border`, `--input`, `--ring` | Borders, inputs, focus rings |

### 2. Tailwind color scales (for direct use)

Defined in `globals.css` via `@theme inline`. Use with Tailwind utilities like `bg-brand-600`, `text-gray-500`.

| Scale | Shades | Usage |
|---|---|---|
| `brand-*` | 25-900 | Primary brand |
| `gray-*` | 25-900 | Neutral grays |
| `error-*` | 25-900 | Error states |
| `warning-*` | 25-900 | Warnings |
| `success-*` | 25-900 | Positive actions |

### 3. Token palettes (for programmatic use)

Defined in `src/design-system/tokens.ts`.

| Export | Contains |
|---|---|
| `BASE_COLORS.neutral` | Gray scale |
| `BASE_COLORS.primary` | Brand scale (same hex as `brand-*` in Tailwind) |
| `FEEDBACK_COLORS.error` | Error scale |
| `FEEDBACK_COLORS.warning` | Warning scale |
| `FEEDBACK_COLORS.success` | Success scale |

---

## Style maps

### `eventTypeBadgeStyles`

Use with `<Badge>` for event type styling:

```tsx
import { Badge } from "@/components/ui/badge";
import { eventTypeBadgeStyles } from "@/design-system/tokens";

<Badge className={eventTypeBadgeStyles.national}>National holiday</Badge>
<Badge className={eventTypeBadgeStyles.company}>Company holiday</Badge>
<Badge className={eventTypeBadgeStyles.pto}>PTO</Badge>
<Badge className={eventTypeBadgeStyles.event}>Event</Badge>
```

| Key | Color scheme |
|---|---|
| `national` | error (red) |
| `company` | brand (blue) |
| `pto` | success (green) |
| `event` | warning (amber) |

### `metricCardStyles`

Color themes for stat displays.

Keys: `brand`, `success`, `warning`, `neutral`

---

## shadcn/ui primitives

Located in `src/components/ui/`.

| Component | File | Key exports |
|---|---|---|
| Badge | `badge.tsx` | `Badge` |
| Button | `button.tsx` | `Button` |
| Dialog | `dialog.tsx` | `Dialog`, `DialogContent`, `DialogHeader`, `DialogFooter`, `DialogTitle`, `DialogDescription` |
| Input | `input.tsx` | `Input` |
| Label | `label.tsx` | `Label` |
| Spinner | `spinner.tsx` | `Spinner` |
| Tooltip | `tooltip.tsx` | `TooltipProvider`, `Tooltip`, `TooltipTrigger`, `TooltipContent` |

### Button sizes

| Size | Height | Usage |
|---|---|---|
| `xs` | 24px (`h-6`) | Compact toolbars, inline actions |
| `sm` | 32px (`h-8`) | Secondary actions |
| `default` | 36px (`h-9`) | Standard buttons |
| `lg` | 40px (`h-10`) | CTAs |
| `icon` | 36px (`size-9`) | Square icon button (default) |
| `icon-xs` | 24px (`size-6`) | Compact icon button |
| `icon-sm` | 32px (`size-8`) | Small icon button |
| `icon-lg` | 40px (`size-10`) | Large icon button |

### Spinner

```tsx
import { Spinner } from "@/components/ui/spinner";

<Spinner />                                    // default: size-4
<Spinner className="size-8 text-brand-600" />  // section loader
```

---

## Icons

Use **Lucide React** (`lucide-react`).

| Context | Size class |
|---|---|
| Inline / standalone | `h-5 w-5` |
| Inside buttons | `h-4 w-4` |

---

## Rules

1. **Use style maps for appearance variations**, not wrapper components.
2. **`tokens.ts` hex values must stay in sync with `globals.css` `@theme` block.**
3. **Don't use `text-base` or `font-normal`** - stick to the documented text scale and weights.
4. **Use sentence casing everywhere** - write "Add event", not "Add Event".
