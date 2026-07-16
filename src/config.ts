import type {
  CustomClockCardConfig,
  CustomClockCardTimeFormat,
  NormalizedCustomClockCardConfig
} from "./types"

export const DEFAULT_COLORS = ["#ffffff", "#ffffff", "#ffffff", "#ffffff"] as const

export const DEFAULT_CONFIG = {
  color: "#ffffff",
  colors: [...DEFAULT_COLORS],
  font_family: "",
  font_url: "",
  font_weight: 400,
  gap: 0,
  horizontal_spacing: 0,
  individual_colors: false,
  layout: "line" as "line" | "stacked",
  natural_width: true,
  no_background: false,
  padding: 0,
  scale: 1,
  separator: ":",
  separator_color: "#ffffff",
  separator_offset: 0,
  separator_spacing: 0,
  show_separator: true,
  time_format: "" as CustomClockCardTimeFormat,
  time_zone: "",
  vertical_spacing: 0
} as const

export const LIMITS = {
  font_weight: { max: 1000, min: 100 },
  gap: { max: 50, min: 0 },
  horizontal_spacing: { max: 100, min: -100 },
  padding: { max: 100, min: 0 },
  scale: { max: 5, min: 0.1 },
  separator_offset: { max: 100, min: -100 },
  separator_spacing: { max: 50, min: -50 },
  vertical_spacing: { max: 100, min: -100 }
} as const

export const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value))

export const clampOption = (key: keyof typeof LIMITS, value: number | undefined): number => {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return DEFAULT_CONFIG[key]
  }
  const { max, min } = LIMITS[key]
  return clamp(value, min, max)
}

export const normalizeColors = (colors?: readonly string[]): string[] =>
  [0, 1, 2, 3].map((index) => colors?.[index] || DEFAULT_COLORS[index])

export const normalizeLayout = (layout: unknown): "line" | "stacked" =>
  layout === "stacked" || layout === "line" ? layout : DEFAULT_CONFIG.layout

export const normalizeTimeFormat = (timeFormat: unknown): CustomClockCardTimeFormat =>
  timeFormat === "language" || timeFormat === "system" || timeFormat === "12" || timeFormat === "24"
    ? timeFormat
    : DEFAULT_CONFIG.time_format

export const createDefaultConfig = (): NormalizedCustomClockCardConfig => ({
  type: "custom:custom-clock-card",
  ...DEFAULT_CONFIG,
  colors: [...DEFAULT_CONFIG.colors]
})

export const stripImplicit = (
  config: CustomClockCardConfig,
  explicitKeys: ReadonlySet<keyof CustomClockCardConfig>
): CustomClockCardConfig => {
  const result: CustomClockCardConfig = { type: config.type }
  for (const key of Object.keys(config) as (keyof CustomClockCardConfig)[]) {
    if (key === "type" || !explicitKeys.has(key)) {
      continue
    }
    ;(result as Record<string, unknown>)[key] = config[key]
  }
  return result
}
