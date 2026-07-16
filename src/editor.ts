import { fireEvent, type HomeAssistant, type LovelaceCardEditor } from "custom-card-helpers"
import { html, LitElement, type TemplateResult } from "lit"
import { property, state } from "lit/decorators.js"

import type { CustomClockCardConfig } from "./types"

import {
  clamp,
  createDefaultConfig,
  DEFAULT_CONFIG,
  LIMITS,
  normalizeColors,
  normalizeLayout,
  normalizeTimeFormat,
  stripImplicit
} from "./config"

interface SchemaOptions {
  individualColors: boolean
  layout: "line" | "stacked"
  natural: boolean
  showSeparator: boolean
}

const buildSchema = ({ individualColors, layout, natural, showSeparator }: SchemaOptions) => [
  {
    name: "layout",
    selector: {
      select: {
        mode: "dropdown",
        options: [
          { label: "Grid", value: "stacked" },
          { label: "Line", value: "line" }
        ]
      }
    }
  },
  {
    name: "time_format",
    required: true,
    selector: {
      select: {
        mode: "dropdown",
        options: [
          { label: "Use user settings", value: "default" },
          { label: "Auto (use language setting)", value: "language" },
          { label: "Use system locale", value: "system" },
          { label: "12 hours (AM/PM)", value: "12" },
          { label: "24 hours", value: "24" }
        ]
      }
    }
  },
  // required: true stops ha-form from treating an emptied field as unset
  // and dropping it from the emitted value, blank is a valid value here
  { name: "time_zone", required: true, selector: { timezone: {} } },
  { name: "no_background", selector: { boolean: {} } },
  ...(layout === "line"
    ? [
        {
          expanded: false,
          flatten: true,
          icon: "mdi:dots-horizontal",
          name: "separator_section",
          schema: [
            { name: "show_separator", selector: { boolean: {} } },
            ...(showSeparator
              ? [
                  // See the time_zone comment above re: required.
                  { name: "separator", required: true, selector: { text: {} } },
                  { name: "separator_rgb", selector: { color_rgb: {} } },
                  {
                    name: "separator_spacing",
                    selector: {
                      number: {
                        ...LIMITS.separator_spacing,
                        mode: "slider",
                        step: 1,
                        unit_of_measurement: "px"
                      }
                    }
                  },
                  {
                    name: "separator_offset",
                    selector: {
                      number: {
                        ...LIMITS.separator_offset,
                        mode: "slider",
                        step: 1,
                        unit_of_measurement: "px"
                      }
                    }
                  }
                ]
              : [])
          ],
          title: "Separator",
          type: "expandable"
        }
      ]
    : []),
  {
    expanded: false,
    flatten: true,
    icon: "mdi:format-font",
    name: "font_section",
    schema: [
      // See the time_zone comment above re: required.
      { name: "font_family", required: true, selector: { text: {} } },
      { name: "font_url", required: true, selector: { text: {} } },
      {
        name: "font_weight",
        selector: { number: { ...LIMITS.font_weight, mode: "slider", step: 50 } }
      }
    ],
    title: "Font",
    type: "expandable"
  },
  {
    expanded: false,
    flatten: true,
    icon: "mdi:palette",
    name: "colors_section",
    schema: [
      { name: "individual_colors", selector: { boolean: {} } },
      ...(individualColors
        ? [
            {
              name: "",
              schema: [
                { name: "color_1", selector: { color_rgb: {} } },
                { name: "color_2", selector: { color_rgb: {} } },
                { name: "color_3", selector: { color_rgb: {} } },
                { name: "color_4", selector: { color_rgb: {} } }
              ],
              type: "grid"
            }
          ]
        : [{ name: "color_rgb", selector: { color_rgb: {} } }])
    ],
    title: "Colors",
    type: "expandable"
  },
  {
    expanded: false,
    flatten: true,
    icon: "mdi:arrow-expand-horizontal",
    name: "size_section",
    schema: [
      { name: "natural_width", selector: { boolean: {} } },
      ...(natural && layout === "line"
        ? []
        : [
            {
              name: "gap",
              selector: {
                number: { ...LIMITS.gap, mode: "slider", step: 1, unit_of_measurement: "px" }
              }
            }
          ]),
      ...(natural && layout === "stacked"
        ? []
        : [
            {
              name: "horizontal_spacing",
              selector: {
                number: {
                  ...LIMITS.horizontal_spacing,
                  min: natural ? 0 : LIMITS.horizontal_spacing.min,
                  mode: "slider",
                  step: 1,
                  unit_of_measurement: "px"
                }
              }
            }
          ]),
      ...(layout === "stacked"
        ? [
            {
              name: "vertical_spacing",
              selector: {
                number: {
                  ...LIMITS.vertical_spacing,
                  mode: "slider",
                  step: 1,
                  unit_of_measurement: "px"
                }
              }
            }
          ]
        : []),
      {
        name: "padding",
        selector: {
          number: { ...LIMITS.padding, mode: "slider", step: 1, unit_of_measurement: "px" }
        }
      },
      {
        name: "scale",
        selector: {
          number: { ...LIMITS.scale, mode: "slider", step: 0.05, unit_of_measurement: "×" }
        }
      }
    ],
    title: "Size & spacing",
    type: "expandable"
  }
]

const LABELS: Record<string, string> = {
  color_1: "Digit 1 color",
  color_2: "Digit 2 color",
  color_3: "Digit 3 color",
  color_4: "Digit 4 color",
  color_rgb: "Digits color",
  font_family: "Font family",
  font_url: "Font URL",
  font_weight: "Font weight",
  gap: "Transparent gap",
  horizontal_spacing: "Horizontal spacing",
  individual_colors: "Use individual colors",
  layout: "Layout",
  natural_width: "Natural character widths",
  no_background: "No background",
  padding: "Card padding",
  scale: "Scale",
  separator: "Separator character",
  separator_offset: "Separator vertical offset",
  separator_rgb: "Separator color",
  separator_spacing: "Separator spacing",
  show_separator: "Show separator",
  time_format: "Time format",
  time_zone: "Time zone",
  vertical_spacing: "Vertical spacing"
}

const computeLabel = (schema: { name: string }): string => LABELS[schema.name] ?? schema.name

type Rgb = [number, number, number]

const hexToRgb = (hex: string): Rgb => {
  let value = hex.replace("#", "")
  if (value.length === 3) {
    value = value
      .split("")
      .map((char) => char + char)
      .join("")
  }
  const num = Number.parseInt(value, 16)
  if (Number.isNaN(num) || value.length !== 6) {
    return [255, 255, 255]
  }
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255]
}

const rgbToHex = (rgb: number[] | undefined): string | undefined => {
  if (!rgb || rgb.length !== 3) {
    return undefined
  }
  const channels = rgb.map((channel) =>
    clamp(Math.round(channel), 0, 255).toString(16).padStart(2, "0")
  )
  return `#${channels.join("")}`
}

type EditorFormData = Omit<CustomClockCardConfig, "time_format"> & {
  color_1?: number[]
  color_2?: number[]
  color_3?: number[]
  color_4?: number[]
  color_rgb?: number[]
  separator_rgb?: number[]
  time_format?: string
}

export class CustomClockCardEditor extends LitElement implements LovelaceCardEditor {
  @property({ attribute: false }) public hass?: HomeAssistant

  @state() private _config: CustomClockCardConfig = createDefaultConfig()

  private _explicitKeys = new Set<keyof CustomClockCardConfig>()

  public setConfig(config: CustomClockCardConfig): void {
    this._explicitKeys = new Set(Object.keys(config) as (keyof CustomClockCardConfig)[])
    this._config = {
      ...DEFAULT_CONFIG,
      ...config,
      colors: normalizeColors(config.colors),
      type: config.type || "custom:custom-clock-card"
    }
  }

  protected render(): TemplateResult {
    const [color_1, color_2, color_3, color_4] = normalizeColors(this._config.colors).map(hexToRgb)
    const data: EditorFormData = {
      ...this._config,
      color_1,
      color_2,
      color_3,
      color_4,
      color_rgb: hexToRgb(this._config.color || DEFAULT_CONFIG.color),
      separator_rgb: hexToRgb(this._config.separator_color || DEFAULT_CONFIG.separator_color),
      time_format: this._config.time_format || "default"
    }
    return html`
      <ha-form
        .hass=${this.hass}
        .data=${data}
        .schema=${buildSchema({
          individualColors: this._config.individual_colors === true,
          layout: this._config.layout === "line" ? "line" : "stacked",
          natural: this._config.natural_width === true,
          showSeparator: this._config.show_separator !== false
        })}
        .computeLabel=${computeLabel}
        @value-changed=${this._valueChanged}
      ></ha-form>
    `
  }

  private _valueChanged(ev: CustomEvent<{ value: EditorFormData }>): void {
    ev.stopPropagation()
    const { color_1, color_2, color_3, color_4, color_rgb, separator_rgb, ...rest } =
      ev.detail.value
    const previous = this._config
    const previousColors = normalizeColors(previous.colors)
    const colors = [color_1, color_2, color_3, color_4].map(
      (rgb, index) => rgbToHex(rgb) ?? previousColors[index]
    )

    const next: CustomClockCardConfig = {
      ...previous,
      ...rest,
      color: rgbToHex(color_rgb) ?? previous.color ?? DEFAULT_CONFIG.color,
      colors,
      layout: normalizeLayout(rest.layout),
      separator_color:
        rgbToHex(separator_rgb) ?? previous.separator_color ?? DEFAULT_CONFIG.separator_color,
      time_format: normalizeTimeFormat(rest.time_format)
    }

    for (const key of Object.keys(next) as (keyof CustomClockCardConfig)[]) {
      if (key === "type") {
        continue
      }
      const changed =
        key === "colors"
          ? !(next.colors as string[]).every((color, index) => color === previousColors[index])
          : next[key] !== previous[key]
      if (changed) {
        this._explicitKeys.add(key)
      }
    }

    this._config = next
    fireEvent(this, "config-changed", { config: stripImplicit(this._config, this._explicitKeys) })
  }
}

if (!customElements.get("custom-clock-card-editor")) {
  customElements.define("custom-clock-card-editor", CustomClockCardEditor)
}
