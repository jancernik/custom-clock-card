import { type HomeAssistant, type LovelaceCardEditor, TimeFormat } from "custom-card-helpers"
import {
  css,
  type CSSResultGroup,
  html,
  LitElement,
  nothing,
  svg,
  type SVGTemplateResult,
  type TemplateResult,
  unsafeCSS
} from "lit"
import { property, state } from "lit/decorators.js"
import { classMap } from "lit/directives/class-map.js"
import { ifDefined } from "lit/directives/if-defined.js"
import { styleMap } from "lit/directives/style-map.js"

import type { CustomClockCardConfig, NormalizedCustomClockCardConfig } from "./types"

import {
  clampOption,
  createDefaultConfig,
  DEFAULT_CONFIG,
  normalizeColors,
  normalizeLayout,
  normalizeTimeFormat
} from "./config"

const CARD_VERSION = "0.1.0"

const CUSTOM_FONT_NAME = "Custom Clock Font" // Used for fonts loaded from font_url when no font_family is set.

const DEFAULT_FONT_STACK = "system-ui, sans-serif"
const FONT_FILE_EXTENSIONS = [".woff2", ".woff", ".ttf", ".otf"] as const

console.info(
  `%c CUSTOM-CLOCK-CARD %c v${CARD_VERSION} `,
  "color: white; font-weight: bold; background: black",
  "color: black; font-weight: bold; background: white"
)

window.customCards = window.customCards || []
window.customCards.push({
  description: "Highly customizable clock card",
  name: "Custom Clock Card",
  preview: true,
  type: "custom-clock-card"
})

const loadedFonts = new Set<string>()
const ensuredStylesheets = new Set<string>()

const isFontFile = (url: string): boolean => {
  try {
    const pathname = new URL(url, location.origin).pathname.toLowerCase()
    return FONT_FILE_EXTENSIONS.some((ext) => pathname.endsWith(ext))
  } catch {
    return true
  }
}

// Stylesheet URLs (e.g. Google Fonts css2 links) are attached to the
// document head, where their @font-face rules can register fonts.
const ensureFontStylesheet = (url: string): void => {
  if (ensuredStylesheets.has(url)) {
    return
  }
  ensuredStylesheets.add(url)
  const link = document.createElement("link")
  link.rel = "stylesheet"
  link.href = url
  link.addEventListener("error", () => {
    console.warn(`custom-clock-card: could not load font stylesheet ${url}`)
  })
  document.head.appendChild(link)
}

const hashString = (value: string): string => {
  let hash = 5381
  for (let i = 0; i < value.length; i++) {
    hash = (hash * 33) ^ value.charCodeAt(i)
  }
  return (hash >>> 0).toString(36)
}

const fallbackFontFamily = (url: string): string => `${CUSTOM_FONT_NAME} ${hashString(url)}`

// Mirrors Home Assistant's own resolution of the time format settings
// https://github.com/home-assistant/frontend/blob/dev/src/common/datetime/use_am_pm.ts
const useAmPm = (timeFormat: TimeFormat, language: string | undefined): boolean => {
  if (timeFormat === TimeFormat.language || timeFormat === TimeFormat.system) {
    const testLanguage = timeFormat === TimeFormat.language ? language : undefined
    const test = new Date("January 1, 2023 22:00:00").toLocaleString(testLanguage)
    return test.includes("10")
  }
  return timeFormat === TimeFormat.am_pm
}

const ensureFont = (family: string, url: string): void => {
  const key = `${family}|${url}`
  if (loadedFonts.has(key)) {
    return
  }
  loadedFonts.add(key)
  try {
    const face = new FontFace(family, `url("${url}")`, { weight: "100 1000" })
    document.fonts.add(face)
    void face.load().catch((err) => {
      loadedFonts.delete(key)
      console.warn(`custom-clock-card: could not load font from ${url}`, err)
    })
  } catch (err) {
    loadedFonts.delete(key)
    console.warn(`custom-clock-card: invalid font url ${url}`, err)
  }
}

// Glyph geometry, in unscaled SVG canvas units.
const CELL = 120
const SEPARATOR_CELL = CELL / 2
const MIN_ADVANCE = 8
const FONT_SIZE = 142

const MEASURE_BUDGET = 5 // Caps measurement retries per render trigger

const FONT_READY_TIMEOUT = 3000

const DIGIT_PROBE = "0123456789"
const FALLBACK_METRICS = { ascent: FONT_SIZE * 0.75, descent: FONT_SIZE * 0.05 }

let measureContext: CanvasRenderingContext2D | null | undefined

const getMeasureContext = (): CanvasRenderingContext2D | null => {
  if (measureContext === undefined) {
    measureContext = document.createElement("canvas").getContext("2d")
  }
  return measureContext
}

const fontSpec = (fontFamily: string, fontWeight: number): string =>
  `${fontWeight} ${FONT_SIZE}px ${fontFamily}`

const metricsCache = new Map<string, { ascent: number; descent: number }>()

const measureCharsMetrics = (
  fontFamily: string,
  fontWeight: number,
  chars: string
): { ascent: number; descent: number } => {
  const key = `${fontSpec(fontFamily, fontWeight)}|${chars}`
  const cached = metricsCache.get(key)
  if (cached) {
    return cached
  }
  const context = getMeasureContext()
  if (!context || !chars) {
    return FALLBACK_METRICS
  }
  context.font = fontSpec(fontFamily, fontWeight)
  let ascent = 0
  let descent = 0
  for (const char of chars) {
    const metrics = context.measureText(char)
    ascent = Math.max(ascent, metrics.actualBoundingBoxAscent)
    descent = Math.max(descent, metrics.actualBoundingBoxDescent)
  }
  if (ascent <= 0 && descent <= 0) {
    return FALLBACK_METRICS
  }
  const result = { ascent, descent }
  metricsCache.set(key, result)
  return result
}

const widthsCache = new Map<string, number[]>()

const measureAdvanceWidths = (fontFamily: string, fontWeight: number, text: string): number[] => {
  const key = `${fontSpec(fontFamily, fontWeight)}|${text}`
  const cached = widthsCache.get(key)
  if (cached) {
    return cached
  }
  const context = getMeasureContext()
  if (!context || !text) {
    return text.split("").map(() => 0)
  }
  context.font = fontSpec(fontFamily, fontWeight)
  const widths: number[] = []
  let previous = 0
  for (let i = 1; i <= text.length; i++) {
    const cumulative = context.measureText(text.slice(0, i)).width
    widths.push(cumulative - previous)
    previous = cumulative
  }
  if (widths.every((w) => w <= 0)) {
    return widths
  }
  widthsCache.set(key, widths)
  return widths
}

const fontKey = (config: NormalizedCustomClockCardConfig): string =>
  `${config.font_family}|${config.font_url}|${config.font_weight}`

interface Glyph {
  char: string
  color: string
  separator?: boolean
  width: number
}

interface Layout {
  height: number
  positions: Array<{ x: number; y: number }>
  width: number
}

let instanceCounter = 0

export class CustomClockCard extends LitElement {
  static get styles(): CSSResultGroup {
    return css`
      :host {
        display: block;
      }

      ha-card {
        display: flex;
        justify-content: center;
        align-items: center;
        overflow: hidden;
      }

      ha-card.no-background {
        background: transparent;
        box-shadow: none;
        border: 0;
        overflow: visible;
      }

      .clock {
        display: flex;
        justify-content: center;
        align-items: center;
        width: var(--clock-width);
        aspect-ratio: var(--clock-aspect);
        max-width: 100%;
        margin-inline: auto;
        overflow: visible;
      }

      .clock-svg {
        display: block;
        width: 100%;
        height: 100%;
        overflow: visible;
      }

      .digit,
      .mask-digit {
        font-family: var(--digit-font, system-ui, sans-serif);
        font-size: ${unsafeCSS(FONT_SIZE)}px;
        font-weight: var(--digit-weight);
        line-height: 1;
        dominant-baseline: alphabetic;
      }

      .mask-digit {
        fill: black;
        stroke: black;
        stroke-linejoin: round;
        paint-order: stroke fill;
      }
    `
  }

  @property({ attribute: false }) public hass?: HomeAssistant

  @state() private _config: NormalizedCustomClockCardConfig = createDefaultConfig()

  private _fontFamily: string = DEFAULT_FONT_STACK
  private readonly _maskPrefix = `custom-clock-${++instanceCounter}`

  private _measureBudget = MEASURE_BUDGET
  @state() private _metricsReady = true
  private _metricsReadyTimer?: number

  @state() private _naturalWidth = 4 * CELL

  @state() private _naturalX = -2 * CELL
  @state() private _now = new Date()
  private _resizeObserver?: ResizeObserver

  private _timer?: number

  private get _customFontFamily(): string | undefined {
    const { font_family: family, font_url: url } = this._config
    return family || (url ? fallbackFontFamily(url) : undefined)
  }
  public static async getConfigElement(): Promise<LovelaceCardEditor> {
    await import("./editor")
    return document.createElement("custom-clock-card-editor")
  }

  public static getStubConfig(): CustomClockCardConfig {
    return { type: "custom:custom-clock-card" }
  }

  public connectedCallback(): void {
    super.connectedCallback()
    this._scheduleTick()
    document.fonts.addEventListener("loadingdone", this._onFontsLoaded)
    void document.fonts.ready.then(() => {
      if (this.isConnected) {
        this._onFontsLoaded()
      }
    })
    this._metricsReadyTimer = window.setTimeout(() => {
      this._metricsReady = true
    }, FONT_READY_TIMEOUT)
    this._resizeObserver = new ResizeObserver(this._onResize)
    this._resizeObserver.observe(this)
  }

  public disconnectedCallback(): void {
    super.disconnectedCallback()
    this._clearTimer()
    document.fonts.removeEventListener("loadingdone", this._onFontsLoaded)
    if (this._metricsReadyTimer) {
      clearTimeout(this._metricsReadyTimer)
      this._metricsReadyTimer = undefined
    }
    this._resizeObserver?.disconnect()
    this._resizeObserver = undefined
  }

  // Default placement for the sections dashboard view
  public getGridOptions(): { columns: number; min_columns: number; rows: "auto" } {
    return { columns: 12, min_columns: 3, rows: "auto" }
  }

  public setConfig(config: CustomClockCardConfig): void {
    if (!config) {
      throw new Error("Invalid configuration")
    }

    const previousFontKey = fontKey(this._config)

    this._config = {
      color: config.color || DEFAULT_CONFIG.color,
      colors: normalizeColors(config.colors),
      font_family: (config.font_family ?? "").trim(),
      font_url: (config.font_url ?? "").trim(),
      font_weight: clampOption("font_weight", config.font_weight),
      gap: clampOption("gap", config.gap),
      horizontal_spacing: clampOption("horizontal_spacing", config.horizontal_spacing),
      individual_colors: config.individual_colors === true,
      layout: normalizeLayout(config.layout),
      natural_width: config.natural_width !== false,
      no_background: config.no_background === true,
      padding: clampOption("padding", config.padding),
      scale: clampOption("scale", config.scale),
      separator: config.separator ?? DEFAULT_CONFIG.separator,
      separator_color: config.separator_color || DEFAULT_CONFIG.separator_color,
      separator_offset: clampOption("separator_offset", config.separator_offset),
      separator_spacing: clampOption("separator_spacing", config.separator_spacing),
      show_separator: config.show_separator !== false,
      time_format: normalizeTimeFormat(config.time_format),
      time_zone: (config.time_zone ?? "").trim(),
      type: config.type || "custom:custom-clock-card",
      vertical_spacing: clampOption("vertical_spacing", config.vertical_spacing)
    }
    this._resetMeasureBudget()
    this._fontFamily = this._computeFontFamily()
    if (fontKey(this._config) !== previousFontKey) {
      this._metricsReady = this._isFontReady()
    }
    if (this._config.font_url) {
      if (isFontFile(this._config.font_url)) {
        ensureFont(
          this._config.font_family || fallbackFontFamily(this._config.font_url),
          this._config.font_url
        )
      } else {
        ensureFontStylesheet(this._config.font_url)
      }
    }
  }

  protected render(): TemplateResult {
    const natural = this._config.natural_width
    const digits = this._digits()
    const extraProbe =
      this._config.layout === "line" && this._config.show_separator ? this._config.separator : ""
    const { baseline, rowHeight } = this._rowMetrics(extraProbe)
    const separatorOffset = this._config.separator_offset
    const height = this._rowsHeight(rowHeight)

    let width: number
    let viewX: number
    let content: SVGTemplateResult
    if (natural) {
      width = this._naturalWidth
      viewX = this._naturalX
      content =
        this._config.layout === "line"
          ? this._renderNaturalLine(digits, baseline, separatorOffset)
          : this._renderNaturalStacked(digits, height, baseline, rowHeight)
    } else {
      const glyphs = this._glyphs(digits)
      const cellLayout = this._layout(glyphs, baseline, rowHeight, separatorOffset)
      width = cellLayout.width
      viewX = 0
      content = this._renderCells(glyphs, cellLayout)
    }
    const scaledWidth = width * this._config.scale

    return html`
      <ha-card
        class=${classMap({ "no-background": this._config.no_background })}
        style=${`padding: ${this._config.padding}px;`}
      >
        <div
          class="clock"
          style=${styleMap({
            "--clock-aspect": `${width} / ${height}`,
            "--clock-width": `${scaledWidth}px`,
            "--digit-font": this._fontFamily,
            "--digit-weight": `${this._config.font_weight}`,
            visibility: this._metricsReady ? "visible" : "hidden"
          })}
        >
          <svg
            class="clock-svg"
            viewBox=${`${viewX} 0 ${width} ${height}`}
            role="img"
            aria-label=${`Current time ${this._accessibleTime()}`}
          >
            ${content}
          </svg>
        </div>
      </ha-card>
    `
  }

  protected updated(): void {
    if (!this._config.natural_width || this._measureBudget <= 0) {
      return
    }
    const texts = this.renderRoot.querySelectorAll<SVGTextElement>("text.digit")
    if (texts.length === 0) {
      return
    }
    let minX = Number.POSITIVE_INFINITY
    let maxX = Number.NEGATIVE_INFINITY
    for (const text of texts) {
      const box = text.getBBox()
      minX = Math.min(minX, box.x)
      maxX = Math.max(maxX, box.x + box.width)
    }
    const measuredWidth = Math.max(maxX - minX, 1)
    if (!Number.isFinite(minX) || !Number.isFinite(measuredWidth)) {
      return
    }
    if (
      Math.abs(measuredWidth - this._naturalWidth) > 0.5 ||
      Math.abs(minX - this._naturalX) > 0.5
    ) {
      this._measureBudget -= 1
      this._naturalX = minX
      this._naturalWidth = measuredWidth
    }
  }

  private _accessibleTime(): string {
    const formatter = new Intl.DateTimeFormat(undefined, {
      hour: "numeric",
      hourCycle: this._useAmPm() ? "h12" : "h23",
      minute: "2-digit",
      timeZone: this._timeZone()
    })
    return formatter.format(this._now)
  }

  private _clearTimer(): void {
    if (this._timer) {
      clearTimeout(this._timer)
      this._timer = undefined
    }
  }

  private _colors(): string[] {
    const { color, colors, individual_colors } = this._config
    return individual_colors ? colors : [color, color, color, color]
  }

  private _computeFontFamily(): string {
    const custom = this._customFontFamily
    return custom ? `"${custom}", ${DEFAULT_FONT_STACK}` : DEFAULT_FONT_STACK
  }

  private _digits(): string[] {
    const formatter = new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      hourCycle: this._useAmPm() ? "h12" : "h23",
      minute: "2-digit",
      timeZone: this._timeZone()
    })
    const parts = formatter.formatToParts(this._now)
    const hour = parts.find((part) => part.type === "hour")?.value.padStart(2, "0") || "00"
    const minute = parts.find((part) => part.type === "minute")?.value.padStart(2, "0") || "00"
    return `${hour}${minute}`.split("")
  }

  private _glyphs(digits: string[]): Glyph[] {
    const colors = this._colors()
    const glyphs: Glyph[] = digits.map((char, index) => ({
      char,
      color: colors[index],
      width: CELL
    }))
    if (this._config.layout === "line" && this._config.show_separator) {
      glyphs.splice(2, 0, {
        char: this._config.separator,
        color: this._config.separator_color,
        separator: true,
        width: SEPARATOR_CELL * this._config.separator.length
      })
    }
    return glyphs
  }

  private _isFontReady(): boolean {
    const family = this._customFontFamily
    if (!family) {
      return true
    }
    for (const face of document.fonts) {
      if (face.status === "loaded" && face.family.replace(/^["']|["']$/g, "") === family) {
        return true
      }
    }
    return false
  }

  private _layout(
    glyphs: Glyph[],
    baseline: number,
    rowHeight: number,
    separatorOffset: number
  ): Layout {
    const spacingX = this._config.horizontal_spacing
    if (this._config.layout === "line") {
      const spacing = this._config.separator_spacing
      const positions: Layout["positions"] = []
      let left = 0
      let right = 0
      glyphs.forEach((glyph, index) => {
        const y = glyph.separator ? baseline + separatorOffset : baseline
        positions.push({ x: left + glyph.width / 2, y })
        right = left + glyph.width
        const advance =
          glyph.separator || glyphs[index + 1]?.separator
            ? glyph.width + spacing
            : glyph.width + spacingX
        left += Math.max(advance, MIN_ADVANCE)
      })
      return { height: rowHeight, positions, width: right }
    }

    const xStep = CELL + spacingX
    const yStep = rowHeight + this._config.vertical_spacing
    return {
      height: this._rowsHeight(rowHeight),
      positions: [
        { x: CELL / 2, y: baseline },
        { x: CELL / 2 + xStep, y: baseline },
        { x: CELL / 2, y: baseline + yStep },
        { x: CELL / 2 + xStep, y: baseline + yStep }
      ],
      width: xStep + CELL
    }
  }

  private _maskId(index: number): string {
    return `${this._maskPrefix}-mask-${index}`
  }

  private readonly _onFontsLoaded = (): void => {
    metricsCache.clear()
    widthsCache.clear()
    this._resetMeasureBudget()
    if (!this._metricsReady) {
      this._metricsReady = this._isFontReady()
    }
    this.requestUpdate()
  }

  private readonly _onResize = (): void => {
    this._resetMeasureBudget()
    this.requestUpdate()
  }

  private _renderCellMask(glyphs: Glyph[], layout: Layout, index: number): SVGTemplateResult {
    return svg`
      <mask
        id=${this._maskId(index)}
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width=${layout.width}
        height=${layout.height}
        style="mask-type: luminance;"
      >
        <rect width=${layout.width} height=${layout.height} fill="white"></rect>
        ${glyphs.slice(index + 1).map((glyph, offset) => {
          const position = layout.positions[index + offset + 1]
          return svg`
            <text
              x=${position.x}
              y=${position.y}
              text-anchor="middle"
              class="mask-digit"
              stroke-width=${this._config.gap * 2}
              xml:space="preserve"
            >${glyph.char}</text>
          `
        })}
      </mask>
    `
  }

  private _renderCells(glyphs: Glyph[], layout: Layout): SVGTemplateResult {
    const withMasks = this._config.gap > 0
    return svg`
      ${
        withMasks
          ? svg`<defs>${glyphs.map((_glyph, index) => this._renderCellMask(glyphs, layout, index))}</defs>`
          : nothing
      }
      ${glyphs.map(
        (glyph, index) => svg`
          <text
            x=${layout.positions[index].x}
            y=${layout.positions[index].y}
            text-anchor="middle"
            class="digit"
            fill=${glyph.color}
            mask=${ifDefined(withMasks ? `url(#${this._maskId(index)})` : undefined)}
            xml:space="preserve"
          >${glyph.char}</text>
        `
      )}
    `
  }

  private _renderNaturalLine(
    digits: string[],
    baseline: number,
    separatorOffset: number
  ): SVGTemplateResult {
    const colors = this._colors()
    const weight = this._config.font_weight
    const spacing = this._config.separator_spacing
    const digitSpacing = Math.max(0, this._config.horizontal_spacing)
    const withSeparator = this._config.show_separator

    const [w0, w1] = measureAdvanceWidths(this._fontFamily, weight, digits[0] + digits[1])
    const [w2, w3] = measureAdvanceWidths(this._fontFamily, weight, digits[2] + digits[3])
    const sepWidth = withSeparator
      ? measureAdvanceWidths(this._fontFamily, weight, this._config.separator).reduce(
          (sum, w) => sum + w,
          0
        )
      : 0

    const glyphs: Array<{ char: string; fill: string; x: number; y: number }> = []
    let cursor = 0
    glyphs.push({ char: digits[0], fill: colors[0], x: cursor + w0 / 2, y: baseline })
    cursor += w0 + digitSpacing
    glyphs.push({ char: digits[1], fill: colors[1], x: cursor + w1 / 2, y: baseline })
    cursor += w1
    if (withSeparator) {
      cursor += spacing
      glyphs.push({
        char: this._config.separator,
        fill: this._config.separator_color,
        x: cursor + sepWidth / 2,
        y: baseline + separatorOffset
      })
      cursor += sepWidth + spacing
    } else {
      cursor += digitSpacing
    }
    glyphs.push({ char: digits[2], fill: colors[2], x: cursor + w2 / 2, y: baseline })
    cursor += w2 + digitSpacing
    glyphs.push({ char: digits[3], fill: colors[3], x: cursor + w3 / 2, y: baseline })

    return svg`
      <text class="digit">
        ${glyphs.map(
          (g) => svg`
            <tspan x=${g.x} y=${g.y} text-anchor="middle" fill=${g.fill} xml:space="preserve">${g.char}</tspan>
          `
        )}
      </text>
    `
  }

  private _renderNaturalStacked(
    digits: string[],
    height: number,
    baseline: number,
    rowHeight: number
  ): SVGTemplateResult {
    const colors = this._colors()
    const cx = 0
    const rowY = height - rowHeight + baseline
    const withMask = this._config.gap > 0
    return svg`
      ${
        withMask
          ? svg`
            <defs>
              <mask
                id=${this._maskId(0)}
                maskUnits="userSpaceOnUse"
                x=${this._naturalX}
                y="0"
                width=${this._naturalWidth}
                height=${height}
                style="mask-type: luminance;"
              >
                <rect x=${this._naturalX} width=${this._naturalWidth} height=${height} fill="white"></rect>
                <text
                  x=${cx}
                  y=${rowY}
                  text-anchor="middle"
                  class="mask-digit"
                  stroke-width=${this._config.gap * 2}
                >${digits[2]}${digits[3]}</text>
              </mask>
            </defs>
          `
          : nothing
      }
      <text
        x=${cx}
        y=${baseline}
        text-anchor="middle"
        class="digit"
        mask=${ifDefined(withMask ? `url(#${this._maskId(0)})` : undefined)}
      ><tspan fill=${colors[0]}>${digits[0]}</tspan><tspan fill=${colors[1]}>${digits[1]}</tspan></text>
      <text x=${cx} y=${rowY} text-anchor="middle" class="digit">
        <tspan fill=${colors[2]}>${digits[2]}</tspan><tspan fill=${colors[3]}>${digits[3]}</tspan>
      </text>
    `
  }

  private _resetMeasureBudget(): void {
    this._measureBudget = MEASURE_BUDGET
  }

  private _rowMetrics(extraChars: string): { baseline: number; rowHeight: number } {
    const chars = extraChars ? DIGIT_PROBE + extraChars : DIGIT_PROBE
    const { ascent, descent } = measureCharsMetrics(
      this._fontFamily,
      this._config.font_weight,
      chars
    )
    return { baseline: ascent, rowHeight: ascent + descent }
  }

  private _rowsHeight(rowHeight: number): number {
    return this._config.layout === "stacked"
      ? 2 * rowHeight + this._config.vertical_spacing
      : rowHeight
  }

  private _scheduleTick(): void {
    this._clearTimer()
    const now = new Date()
    this._now = now
    this._resetMeasureBudget()
    const delay = (60 - now.getSeconds()) * 1000 - now.getMilliseconds()
    this._timer = window.setTimeout(
      () => {
        this._scheduleTick()
      },
      Math.max(delay, 1000)
    )
  }

  private _timeZone(): string | undefined {
    return this._config.time_zone || this.hass?.config?.time_zone
  }

  private _useAmPm(): boolean {
    const timeFormat = (this._config.time_format ||
      this.hass?.locale?.time_format ||
      TimeFormat.language) as TimeFormat
    return useAmPm(timeFormat, this.hass?.locale?.language)
  }
}

if (!customElements.get("custom-clock-card")) {
  customElements.define("custom-clock-card", CustomClockCard)
}
