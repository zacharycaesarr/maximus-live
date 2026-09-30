/** Approved values are the baseline. Emit overrides only after a value changes. */
export type WebValues = Record<string, number | string>
export type WebField = { key: string; label: string; value: number; min: number; max: number; step: number; unit: string; selector: string; property: string }
export const WEB_FIELDS: Record<string, WebField[]> = {}
function field(group: string, key: string, label: string, value: number, min: number, max: number, unit: string, selector: string, property: string, step = 1) {
  ;(WEB_FIELDS[group] ??= []).push({ key, label, value, min, max, step, unit, selector, property })
}
export const WEB_MOVERS: Record<string, string> = {
  navHome: '.mini-browser__nav span:nth-child(1)', navAbout: '.mini-browser__nav span:nth-child(2)', navWork: '.mini-browser__nav span:nth-child(3)',
  logo: '.mini-browser__logo', nav: '.mini-browser__nav', getStarted: '.mini-browser__cta',
  headline: '.mini-browser__headline', subcopy: '.mini-browser__sub', arrow: '.mini-browser__arrow',
  media: '.mini-browser__media', graph: '.performance-graph', performance: '.mini-analytics__label',
  delta: '.mini-analytics__delta', number: '.service-card__num', icon: '.service-card__icon',
  title: '.service-card__title', description: '.service-card__desc', explore: '.service-card__cta',
  home: '.tool-rail__btn:nth-child(1)', layers: '.tool-rail__btn:nth-child(2)',
  imageTool: '.tool-rail__btn:nth-child(3)', textTool: '.tool-rail__btn:nth-child(4)', plus: '.tool-rail__btn:nth-child(5)',
}
export const WEB_CONTENT = {
  webNumber: '01', webTitle: 'Web Development', webDescription: 'Design and develop high-performing websites that convert visitors into customers.',
  webCta: 'Explore Web', webLogo: 'MAXIMUS REACH', webNavHome: 'Home', webNavAbout: 'About', webNavWork: 'Work',
  webGetStarted: 'Get Started', webHeadline1: 'Build', webHeadline2: "What's Next",
  webSubcopy: 'High-performing websites for ambitious brands.', webPerformance: 'Performance', webDelta: '+40%',
  webImage: '', webImageFit: 'cover',
  webGraphPath: 'M6 53 C20 33 29 30 41 42 S62 56 75 39 S94 41 109 28 S136 -1 165 15',
}
export function webText(t: WebValues, key: keyof typeof WEB_CONTENT) { return String(t[key] ?? WEB_CONTENT[key]) }
export const WEB_COLORS = {
  webAccent: { value: '#c8ff3d', selector: '.service-card', property: '--lab-acid' },
  webInk: { value: '#ffffff', selector: '.service-card', property: '--lab-ink' },
  webMuted: { value: '#8a8e88', selector: '.service-card', property: '--lab-muted' },
  webCardBackground: { value: '#0a0c0b', selector: '.service-card', property: '--lab-card-bg' },
  webBrowserBackground: { value: '#020202', selector: '.browser-face', property: 'background-color' },
  webGraphColor: { value: '#c8ff3d', selector: '.performance-line, .performance-glow', property: 'stroke' },
  webResultColor: { value: '#38db65', selector: '.mini-analytics__delta', property: 'color' },
}
field('Browser content', 'bodyColumns', 'Copy / image ratio', 1.35, .5, 2.5, 'fr 1fr', '.mini-browser__body', 'grid-template-columns', .05)
field("Browser surface", "browserAspect", "Aspect ratio", 1.2, 0.7, 2, "", ".browser3d", "aspect-ratio", 0.01)
field("Browser surface", "browserFace", "Face opacity", 1, 0, 1, "", ".browser-face", "opacity", 0.01)
field("Browser header", "chromeTop", "Top padding", 16, 0, 40, "px", ".mini-browser__chrome", "padding-top")
field("Browser header", "chromeBottom", "Bottom padding", 10, 0, 30, "px", ".mini-browser__chrome", "padding-bottom")
field("Browser header", "chromeLeft", "Left padding", 16, 0, 40, "px", ".mini-browser__chrome", "padding-left")
field("Browser header", "chromeRight", "Right padding", 16, 0, 40, "px", ".mini-browser__chrome", "padding-right")
field("Browser header", "chromeGap", "Element gap", 7, 0, 20, "px", ".mini-browser__chrome", "gap")
field("Browser header", "logoSize", "Logo text size", 6, 3, 15, "px", ".mini-browser__logo", "font-size", 0.5)
field("Browser header", "navSize", "Navigation size", 6, 3, 15, "px", ".mini-browser__nav", "font-size", 0.5)
field("Browser header", "navGap", "Navigation gap", 7, 0, 20, "px", ".mini-browser__nav", "gap")
field("Browser header", "getStartedSize", "Button text size", 6, 3, 15, "px", ".mini-browser__cta", "font-size", 0.5)
field("Browser header", "getStartedPadY", "Button vertical padding", 5, 0, 16, "px", ".mini-browser__cta", "padding-block")
field("Browser header", "getStartedPadX", "Button side padding", 8, 0, 20, "px", ".mini-browser__cta", "padding-inline")
field("Browser header", "getStartedRadius", "Button corners", 6, 0, 20, "px", ".mini-browser__cta", "border-radius")
field("Browser content", "bodyTop", "Body top padding", 13, 0, 40, "px", ".mini-browser__body", "padding-top")
field("Browser content", "bodyBottom", "Body bottom padding", 18, 0, 40, "px", ".mini-browser__body", "padding-bottom")
field("Browser content", "bodySide", "Body side padding", 16, 0, 40, "px", ".mini-browser__body", "padding-inline")
field("Browser content", "bodyGap", "Column gap", 10, 0, 30, "px", ".mini-browser__body", "gap")
field("Browser content", "copyGap", "Copy gap", 8, 0, 24, "px", ".mini-browser__copy", "gap")
field("Browser content", "copyTop", "Copy top padding", 4, 0, 20, "px", ".mini-browser__copy", "padding-top")
field("Browser content", "headlineSize", "Headline size", 21, 10, 36, "px", ".mini-browser__headline", "font-size", 0.5)
field("Browser content", "headlineWeight", "Headline weight", 600, 100, 900, "", ".mini-browser__headline", "font-weight", 100)
field("Browser content", "headlineLeading", "Headline line height", 1.12, 0.8, 2, "", ".mini-browser__headline", "line-height", 0.01)
field("Browser content", "headlineTracking", "Headline tracking", -0.03, -0.1, 0.1, "em", ".mini-browser__headline", "letter-spacing", 0.001)
field("Browser content", "subSize", "Subtitle size", 8.5, 5, 16, "px", ".mini-browser__sub", "font-size", 0.5)
field("Browser content", "subLeading", "Subtitle line height", 1.4, 1, 2, "", ".mini-browser__sub", "line-height", 0.05)
field("Browser content", "subWidth", "Subtitle width", 22, 10, 40, "ch", ".mini-browser__sub", "max-width")
field("Browser content", "arrowWidth", "Arrow button width", 34, 16, 60, "px", ".mini-browser__arrow", "width")
field("Browser content", "arrowHeight", "Arrow button height", 25, 16, 60, "px", ".mini-browser__arrow", "height")
field("Browser content", "arrowRadius", "Arrow corners", 6, 0, 24, "px", ".mini-browser__arrow", "border-radius")
field("Browser content", "arrowGap", "Arrow top margin", 4, 0, 25, "px", ".mini-browser__arrow", "margin-top")
field("Browser content", "arrowIconWidth", "Arrow icon width", 17, 8, 30, "px", ".mini-browser__arrow svg", "width")
field("Browser content", "arrowIconHeight", "Arrow icon height", 17, 8, 30, "px", ".mini-browser__arrow svg", "height")
field("Browser content", "mediaRadius", "Media corners", 6, 0, 24, "px", ".mini-browser__media", "border-radius")
field("Rail details", "railWidth", "Rail width", 42, 25, 70, "px", ".tool-rail", "width")
field("Rail details", "railPadding", "Rail end padding", 9, 0, 25, "px", ".tool-rail", "padding-block")
field("Rail details", "railGap", "Button gap", 6, 0, 20, "px", ".tool-rail", "gap")
field("Rail details", "railButtonWidth", "Button width", 27, 15, 45, "px", ".tool-rail__btn", "width")
field("Rail details", "railButtonHeight", "Button height", 27, 15, 45, "px", ".tool-rail__btn", "height")
field("Rail details", "railButtonRadius", "Button corners", 7, 0, 20, "px", ".tool-rail__btn", "border-radius")
field("Rail details", "railIconWidth", "Icon width", 17, 8, 35, "px", ".tool-rail__btn svg", "width")
field("Rail details", "railIconHeight", "Icon height", 17, 8, 35, "px", ".tool-rail__btn svg", "height")
field("Rail details", "railRim", "Rail edge opacity", 1, 0, 1, "", ".tool-rail::after", "opacity", 0.01)
field("Analytics details", "analyticsWidth", "Panel width", 40, 20, 65, "%", ".mini-analytics", "width")
field("Analytics details", "analyticsTop", "Top padding", 12, 0, 30, "px", ".mini-analytics", "padding-top")
field("Analytics details", "analyticsBottom", "Bottom padding", 9, 0, 30, "px", ".mini-analytics", "padding-bottom")
field("Analytics details", "analyticsSide", "Side padding", 11, 0, 25, "px", ".mini-analytics", "padding-inline")
field("Analytics details", "performanceSize", "Label size", 9, 5, 18, "px", ".mini-analytics__label", "font-size", 0.5)
field("Analytics details", "performanceGap", "Label bottom gap", 4, 0, 20, "px", ".mini-analytics__top", "margin-bottom")
field("Analytics details", "deltaSize", "Result size", 8, 5, 18, "px", ".mini-analytics__delta", "font-size", 0.5)
field("Analytics details", "graphHeight", "Graph height", 42, 15, 85, "px", ".performance-graph", "height")
field("Analytics details", "graphStroke", "Line width", 1.6, 0.5, 5, "", ".performance-line", "stroke-width", 0.1)
field("Analytics details", "graphGlowWidth", "Glow width", 6, 0, 15, "", ".performance-glow", "stroke-width", 0.5)
field("Analytics details", "graphGlowOpacity", "Glow opacity", 0.16, 0, 1, "", ".performance-glow", "opacity", 0.01)
field("Analytics details", "analyticsRim", "Panel edge opacity", 1, 0, 1, "", ".mini-analytics::after", "opacity", 0.01)
field("Card header and footer", "headerTop", "Header top padding", 18, 0, 40, "px", ".service-card__header", "padding-top")
field("Card header and footer", "headerSide", "Header side padding", 20, 0, 45, "px", ".service-card__header", "padding-inline")
field("Card header and footer", "numberSize", "Number size", 12, 8, 22, "px", ".service-card__num", "font-size")
field("Card header and footer", "numberGap", "Number line gap", 10, 0, 25, "px", ".service-card__num", "gap")
field("Card header and footer", "numberLine", "Number line width", 28, 5, 60, "px", ".service-card__num-line", "width")
field("Card header and footer", "cardIconWidth", "Icon box width", 34, 20, 55, "px", ".service-card__icon", "width")
field("Card header and footer", "cardIconHeight", "Icon box height", 34, 20, 55, "px", ".service-card__icon", "height")
field("Card header and footer", "cardIconRadius", "Icon box corners", 9, 0, 25, "px", ".service-card__icon", "border-radius")
field("Card header and footer", "cardIconArtW", "Icon artwork width", 16, 10, 30, "px", ".service-card__icon svg", "width")
field("Card header and footer", "cardIconArtH", "Icon artwork height", 16, 10, 30, "px", ".service-card__icon svg", "height")
field("Card header and footer", "footerSide", "Footer side padding", 22, 0, 50, "px", ".service-card__footer", "padding-inline")
field("Card header and footer", "footerBottom", "Footer bottom padding", 22, 0, 50, "px", ".service-card__footer", "padding-bottom")
field("Card header and footer", "footerTop", "Footer top padding", 8, 0, 30, "px", ".service-card__footer", "padding-top")
field("Card header and footer", "titleGap", "Title bottom gap", 10, 0, 30, "px", ".service-card__title", "margin-bottom")
field("Card header and footer", "descriptionSize", "Description size", 13, 9, 22, "px", ".service-card__desc", "font-size", 0.5)
field("Card header and footer", "descriptionLeading", "Description leading", 1.45, 1, 2, "", ".service-card__desc", "line-height", 0.05)
field("Card header and footer", "descriptionWidth", "Description width", 28, 15, 50, "ch", ".service-card__desc", "max-width")
field("Card header and footer", "descriptionGap", "Description bottom gap", 16, 0, 35, "px", ".service-card__desc", "margin-bottom")
field("Card header and footer", "exploreSize", "Explore text size", 13, 9, 22, "px", ".service-card__cta", "font-size", 0.5)
field("Card header and footer", "exploreGap", "Explore icon gap", 10, 0, 25, "px", ".service-card__cta", "gap")
field("Card header and footer", "exploreUnderline", "Underline spacing", 7, 0, 20, "px", ".service-card__cta", "padding-bottom")
field("Grid", "gridOpacity", "Grid opacity", 0.45, 0, 1, "", ".scene-grid", "opacity", 0.01)

export function webDetailCss(t: WebValues) {
  const root = '.lab-artboard__live--web '
  const rules: string[] = []
  for (const [key, f] of Object.entries(WEB_COLORS)) {
    const value = String(t[key] ?? f.value)
    if (value !== f.value && /^#[\da-f]{3,8}$/i.test(value)) rules.push(`${f.selector.split(', ').map(s => root + s).join(', ')}{${f.property}:${value}}`)
  }
  for (const f of Object.values(WEB_FIELDS).flat()) {
    const value = Number(t[f.key] ?? f.value)
    if (Number.isFinite(value) && value !== f.value) rules.push(`${root}${f.selector}{${f.property}:${value}${f.unit}}`)
  }
  for (const [key, selector] of Object.entries(WEB_MOVERS)) {
    const x = Number(t[key + 'OffsetX'] ?? 0), y = Number(t[key + 'OffsetY'] ?? 0), scale = Number(t[key + 'LocalScale'] ?? 1)
    if (x || y || scale !== 1) rules.push(`${root}${selector}{transform:translate(${x}px,${y}px) scale(${scale})}`)
  }
  for (const [index, defaults] of [[1, [3,-4,-6]], [2, [5,-8,-12]]] as const) {
    const [x,y,z] = ['X','Y','Z'].map((axis,i)=>Number(t['shell'+index+axis] ?? defaults[i]))
    if ([x,y,z].some((v,i)=>v!==defaults[i])) rules.push(`${root}.browser-back--${index}{transform:translate3d(${x}px,${y}px,${z}px)}`)
  }
  return rules.join('\n')
}

