import type { LovelaceCard, LovelaceCardConfig, LovelaceCardEditor } from "custom-card-helpers"

export interface CustomCardEntry {
  description: string
  name: string
  preview?: boolean
  type: string
}

export interface CustomClockCardConfig extends LovelaceCardConfig {
  color?: string
  colors?: string[]
  font_family?: string
  font_url?: string
  font_weight?: number
  gap?: number
  horizontal_spacing?: number
  individual_colors?: boolean
  layout?: "line" | "stacked"
  natural_width?: boolean
  no_background?: boolean
  padding?: number
  scale?: number
  separator?: string
  separator_color?: string
  separator_offset?: number
  separator_spacing?: number
  show_separator?: boolean
  time_format?: CustomClockCardTimeFormat
  time_zone?: string
  type: string
  vertical_spacing?: number
}

export type CustomClockCardTimeFormat = "12" | "24" | "" | "language" | "system"

export type NormalizedCustomClockCardConfig = Required<Omit<CustomClockCardConfig, "type">> & {
  type: string
}

declare global {
  interface HTMLElementTagNameMap {
    "custom-clock-card": LovelaceCard
    "custom-clock-card-editor": LovelaceCardEditor
  }
  interface Window {
    customCards?: CustomCardEntry[]
  }
}
