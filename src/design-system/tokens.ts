/**
 * Design-system tokens for the vacation-calendar.
 *
 * Adapted from ScheduleLaw's design system. Hex values here MUST stay in
 * sync with the Tailwind v4 @theme block in globals.css.
 */

// ─── Types ──────────────────────────────────────────────────────

export interface ColorShade {
  shade: string;
  hex: string;
}

export interface ColorPalette {
  label: string;
  description: string;
  shades: readonly ColorShade[];
}

// ─── Base palettes ──────────────────────────────────────────────

export const BASE_COLORS = {
  neutral: {
    label: "Neutral (Gray)",
    description:
      "Neutral gray scale used for text, borders, and backgrounds throughout the design system.",
    shades: [
      { shade: "25", hex: "#FCFCFD" },
      { shade: "50", hex: "#F9FAFB" },
      { shade: "100", hex: "#F2F4F7" },
      { shade: "200", hex: "#EAECF0" },
      { shade: "300", hex: "#D0D5DD" },
      { shade: "400", hex: "#98A2B3" },
      { shade: "500", hex: "#667085" },
      { shade: "600", hex: "#475467" },
      { shade: "700", hex: "#344054" },
      { shade: "800", hex: "#1D2939" },
      { shade: "900", hex: "#101828" },
    ],
  },
  primary: {
    label: "Primary (Brand)",
    description:
      "Primary brand colors used for interactive elements, emphasis, and key actions.",
    shades: [
      { shade: "25", hex: "#F5F8FC" },
      { shade: "50", hex: "#EBF1FA" },
      { shade: "100", hex: "#D6E3F4" },
      { shade: "200", hex: "#ADC8E9" },
      { shade: "300", hex: "#84ADDD" },
      { shade: "400", hex: "#5B91D1" },
      { shade: "500", hex: "#3577BF" },
      { shade: "600", hex: "#235CA3" },
      { shade: "700", hex: "#1C4B86" },
      { shade: "800", hex: "#153A69" },
      { shade: "900", hex: "#0E294C" },
    ],
  },
} as const;

// ─── Feedback palettes ──────────────────────────────────────────

export const FEEDBACK_COLORS = {
  error: {
    label: "Error",
    description:
      "Error colors for destructive actions and negative states.",
    shades: [
      { shade: "25", hex: "#FFFBFA" },
      { shade: "50", hex: "#FEF3F2" },
      { shade: "100", hex: "#FEE4E2" },
      { shade: "200", hex: "#FECDCA" },
      { shade: "300", hex: "#FDA29B" },
      { shade: "400", hex: "#F97066" },
      { shade: "500", hex: "#F04438" },
      { shade: "600", hex: "#D92D20" },
      { shade: "700", hex: "#B42318" },
      { shade: "800", hex: "#912018" },
      { shade: "900", hex: "#7A271A" },
    ],
  },
  warning: {
    label: "Warning",
    description:
      "Warning colors for potentially destructive or on-hold states.",
    shades: [
      { shade: "25", hex: "#FFFCF5" },
      { shade: "50", hex: "#FFFAEB" },
      { shade: "100", hex: "#FEF0C7" },
      { shade: "200", hex: "#FEDF89" },
      { shade: "300", hex: "#FEC84B" },
      { shade: "400", hex: "#FDB022" },
      { shade: "500", hex: "#F79009" },
      { shade: "600", hex: "#DC6803" },
      { shade: "700", hex: "#B54708" },
      { shade: "800", hex: "#93370D" },
      { shade: "900", hex: "#7A2E0E" },
    ],
  },
  success: {
    label: "Success",
    description:
      "Success colors for positive actions and confirmations.",
    shades: [
      { shade: "25", hex: "#F6FEF9" },
      { shade: "50", hex: "#ECFDF3" },
      { shade: "100", hex: "#D1FADF" },
      { shade: "200", hex: "#A6F4C5" },
      { shade: "300", hex: "#6CE9A6" },
      { shade: "400", hex: "#32D583" },
      { shade: "500", hex: "#12B76A" },
      { shade: "600", hex: "#039855" },
      { shade: "700", hex: "#027A48" },
      { shade: "800", hex: "#05603A" },
      { shade: "900", hex: "#054F31" },
    ],
  },
} as const;

// ─── Semantic style maps ────────────────────────────────────────

/** Badge styles for holiday/event types. Use with <Badge className={eventTypeBadgeStyles.pto}> */
export const eventTypeBadgeStyles = {
  national: "bg-error-100 text-error-800 hover:bg-error-100 border-error-200",
  company: "bg-brand-100 text-brand-800 hover:bg-brand-100 border-brand-200",
  pto: "bg-success-100 text-success-800 hover:bg-success-100 border-success-200",
  event: "bg-warning-100 text-warning-800 hover:bg-warning-100 border-warning-200",
} as const;

export type EventTypeBadgeKey = keyof typeof eventTypeBadgeStyles;

/** Metric card color themes, reusable for PTO counter cards or stat displays. */
export const metricCardStyles = {
  brand: { bg: "bg-brand-50", label: "text-brand-600", value: "text-brand-900" },
  success: { bg: "bg-success-50", label: "text-success-600", value: "text-success-900" },
  warning: { bg: "bg-warning-50", label: "text-warning-600", value: "text-warning-900" },
  neutral: { bg: "bg-gray-50", label: "text-gray-600", value: "text-gray-900" },
} as const;

export type MetricCardColor = keyof typeof metricCardStyles;

// ─── Label maps ─────────────────────────────────────────────────

export const eventTypeLabels: Record<string, string> = {
  national: "National holiday",
  company: "Company holiday",
  pto: "PTO",
  event: "Event",
};
