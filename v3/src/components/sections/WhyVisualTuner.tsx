import { createContext, useContext, useState, type ReactNode } from 'react'
import { button, folder, useControls } from '@home-leva'
import { whyTestimonials, type WhyTestimonial } from '@/lib/whyTestimonial'
import { useHomeLevaStore } from '@/context/HomeLevaStoreContext'

export type Position = { x: number; y: number; rotation: number }
export type FloatTuning = { x: number; y: number; rotation: number; duration: number; phase: number }
type Tuning = {
  global: { stageBackground: string; elevatedSurface: string; ink: string; mutedInk: string; sage: string; acid: string; borderColor: string; borderOpacity: number; shadowOpacity: number; shadowBlur: number; shadowY: number; stageRadius: number; cardRadius: number; globalScale: number; gridOpacity: number }
  motion: { enabled: boolean; intensity: number; introEnabled: boolean; introDuration: number; introStagger: number; ambientEnabled: boolean; ambientDuration: number; floatAmount: number; tiltAmount: number; shadowDepth: number; hoverResponse: number; interactionPause: number; carouselTransition: number }
  floating: { enabled: boolean; intensity: number; speed: number; panels: FloatTuning[] }
  one: { logoPath: string; scale: number; center: Position; centerScale: number; centerLift: number; web: Position; ads: Position; creative: Position; connectorOpacity: number; connectorThickness: number; connectorCurve: number; connectorStyle: string; ringOpacity: number; dotColor: string; dotInset: number; dotY: number; smallFloat: number }
  two: { scale: number; goals: Position; audience: Position; strategy: Position; creative: Position; gridOpacity: number; activeColor: string; accentColor: string; shadow: number; spacing: number; tilt: number; hoverLift: number; activeEmphasis: number; iconReaction: number }
  three: { scale: number; launch: Position; measure: Position; improve: Position; arrowOpacity: number; arrowScale: number; showArrows: boolean; routeSpeed: number; cardFloat: number; stageEmphasis: number; repeatX: number; repeatY: number; repeatColor: string; repeatLabel: string }
  four: { scale: number; x: number; y: number; barColor: string; lineColor: string; highlightColor: string; metricScale: number; shadow: number; gridOpacity: number; endpointStyle: string; endpointSize: number; arrowGap: number; arrowY: number; lineThickness: number; labelSize: number; valueSize: number; ambientAmount: number; graphResetToken: number }
  five: { scale: number; center: Position; left: Position; right: Position; cardSurface: string; activeColor: string; inactiveColor: string; shadow: number; interval: number; spread: number; autoplay: boolean; pauseOnInteraction: boolean }
  testimonials: WhyTestimonial[]
}

const Context = createContext<Tuning | null>(null)
const slider = (value: number, min = -100, max = 100, step = 1) => ({ value, min, max, step })
const testimonialFolders = Object.fromEntries(whyTestimonials.map((item, index) => {
  const prefix = `0${index + 1}`
  return [`Entry ${prefix}`, folder({
    [`${prefix} Client`]: item.client,
    [`${prefix} Role`]: item.role,
    [`${prefix} Company`]: item.company,
    [`${prefix} Quote`]: item.quote,
  })]
}))

export function WhyVisualTuner({ children }: { children: ReactNode }) {
  const [graphResetToken, setGraphResetToken] = useState(0)
  const store = useHomeLevaStore()
  if (!store) throw new Error('Why visuals require the homepage Leva store')
  const c = useControls('WHY MAXIMUS VISUALS', {
    'Global Visual Style': folder({
      'Stage Background': '#f8f9f2', 'Elevated Surface': '#fffefa', Ink: '#080909', 'Muted Ink': '#777a75', Sage: '#dcebd2', Acid: '#a9fb00', 'Border Color': '#d7dcd2',
      'Border Opacity': slider(55, 0, 100), 'Shadow Opacity': slider(13, 0, 40), 'Shadow Blur': slider(28, 0, 80), 'Shadow Y': slider(14, 0, 50),
      'Stage Radius': slider(22, 0, 50), 'Card Radius': slider(20, 0, 40), 'Global Scale': slider(1, .5, 1.5, .01), 'Global Grid Opacity': slider(.45, 0, 1, .01),
    }),
    'Motion & Interaction': folder({
      'Enable Motion': true, 'Motion Intensity': slider(1, 0, 2, .05), 'Enable Intro': true,
      'Intro Duration': slider(.75, .2, 2, .05), 'Intro Stagger': slider(.11, 0, .4, .01),
      'Enable Ambient': true, 'Ambient Loop Seconds': slider(6, 2, 16, .5),
      'Float Amount': slider(3, 0, 10, .25), 'Tilt Amount': slider(1.2, 0, 5, .1),
      'Shadow Depth': slider(1, 0, 2.5, .05), 'Hover Tap Response': slider(1, 0, 2, .05),
      'Interaction Pause Seconds': slider(2.5, .5, 8, .5), 'Carousel Transition Seconds': slider(.45, .2, 1.5, .05),
    }),
    'Idle Floating': folder({
      'Enable Idle Floating': true, 'Float Intensity': slider(2, 0, 4, .05), 'Float Speed Multiplier': slider(1, .5, 2, .05),
      'Panel 01 Float': folder({ '01 Float X': slider(2, 0, 5, .25), '01 Float Y': slider(5.5, 0, 10, .25), '01 Float Rotation': slider(.45, 0, 1.5, .05), '01 Float Duration': slider(6.2, 3, 12, .1), '01 Float Phase': slider(-.7, -8, 0, .1) }),
      'Panel 02 Float': folder({ '02 Float X': slider(2, 0, 5, .25), '02 Float Y': slider(5.5, 0, 10, .25), '02 Float Rotation': slider(.4, 0, 1.5, .05), '02 Float Duration': slider(6.4, 3, 12, .1), '02 Float Phase': slider(-1.2, -8, 0, .1) }),
      'Panel 03 Float': folder({ '03 Float X': slider(2, 0, 5, .25), '03 Float Y': slider(5, 0, 10, .25), '03 Float Rotation': slider(.4, 0, 1.5, .05), '03 Float Duration': slider(6.1, 3, 12, .1), '03 Float Phase': slider(-.9, -8, 0, .1) }),
      'Panel 04 Float': folder({ '04 Float X': slider(.8, 0, 5, .25), '04 Float Y': slider(3, 0, 10, .25), '04 Float Rotation': slider(.15, 0, 1.5, .05), '04 Float Duration': slider(7.4, 3, 12, .1), '04 Float Phase': slider(-1, -8, 0, .1) }),
      'Panel 05 Float': folder({ '05 Float X': slider(1.5, 0, 5, .25), '05 Float Y': slider(4, 0, 10, .25), '05 Float Rotation': slider(.3, 0, 1.5, .05), '05 Float Duration': slider(6.6, 3, 12, .1), '05 Float Phase': slider(-.6, -8, 0, .1) }),
    }),
    '01 — One Partner': folder({
      'Center Logo / Mark Asset Path': '/assets/mrlogo-short-white.png', 'One Scale': slider(1, .5, 1.5, .01),
      'Center Block X': slider(50, 0, 100), 'Center Block Y': slider(49, 0, 100), 'Center Block Rotation': slider(0, -30, 30), 'Center Block Scale': slider(1, .5, 1.5, .01),
      'Web Card X': slider(50, 0, 100), 'Web Card Y': slider(16, 0, 100), 'Web Card Rotation': slider(-2, -30, 30),
      'Ads Card X': slider(22, 0, 100), 'Ads Card Y': slider(77, 0, 100), 'Ads Card Rotation': slider(11, -30, 30),
      'Creative Card X': slider(78, 0, 100), 'Creative Card Y': slider(77, 0, 100), 'Creative Card Rotation': slider(-10, -30, 30),
      'Connector Opacity': slider(.82, 0, 1, .01), 'Connector Thickness': slider(1.5, .5, 4, .1), 'Connector Curve': slider(22, 0, 60, 1),
      'Connector Style': { options: ['Routed', 'Radial'], value: 'Routed' }, 'Ring Opacity': slider(.25, 0, 1, .01), 'Green Dot Color': '#a9fb00',
      'Dot Inset': slider(8, 0, 30, 1), 'Dot Vertical Position': slider(50, 0, 100, 1), 'Center Lift': slider(2, 0, 10, .5), 'Small Card Float': slider(1, 0, 3, .1),
    }),
    '02 — Built Around You': folder({
      'Stack Scale': slider(1, .5, 1.5, .01), 'Goals X': slider(49, 0, 100), 'Goals Y': slider(18, 0, 100), 'Goals Rotation': slider(-8, -30, 30),
      'Audience X': slider(51, 0, 100), 'Audience Y': slider(40, 0, 100), 'Audience Rotation': slider(-7, -30, 30),
      'Strategy X': slider(52, 0, 100), 'Strategy Y': slider(61, 0, 100), 'Strategy Rotation': slider(-7, -30, 30),
      'Creative X': slider(54, 0, 100), 'Creative Y': slider(82, 0, 100), 'Creative Rotation': slider(-7, -30, 30),
      'Stack Grid Opacity': slider(.5, 0, 1, .01), 'Active Card Color': '#11120e', 'Stack Accent Color': '#a9fb00', 'Stack Shadow': slider(1, 0, 2, .01),
      'Stack Spacing': slider(1, .6, 1.5, .02), 'Card Tilt': slider(1.5, 0, 6, .1), 'Stack Hover Lift': slider(5, 0, 12, .5), 'Active Emphasis': slider(1, 0, 2, .05), 'Icon Reaction': slider(1, 0, 2, .05),
    }),
    '03 — Launch Improve': folder({
      'Loop Scale': slider(1, .5, 1.5, .01), 'Launch X': slider(49, 0, 100), 'Launch Y': slider(17, 0, 100), 'Launch Rotation': slider(-8, -30, 30),
      'Measure X': slider(62, 0, 100), 'Measure Y': slider(51, 0, 100), 'Measure Rotation': slider(-8, -30, 30),
      'Improve X': slider(50, 0, 100), 'Improve Y': slider(82, 0, 100), 'Improve Rotation': slider(-8, -30, 30),
      'Arrow Opacity': slider(.75, 0, 1, .01), 'Show Arrows': true, 'Arrow Scale': slider(1, .5, 2, .05), 'Route Loop Seconds': slider(6, 2, 16, .5),
      'Flow Card Float': slider(1, 0, 3, .1), 'Stage Emphasis': slider(1, 0, 2, .05), 'Repeat Label X': slider(12, 0, 100), 'Repeat Label Y': slider(54, 0, 100),
      'Repeat Label Color': '#6b7a69', 'Repeat Label Text': 'REPEAT',
    }),
    '04 — Know What’s Working': folder({
      'Chart Scale': slider(1, .5, 1.5, .01), 'Chart X': slider(50, 0, 100), 'Chart Y': slider(50, 0, 100),
      'Bar Color': '#dcefd5', 'Trend Line Color': '#294c2e', 'Highlight Color': '#a9fb00', 'Metric Row Scale': slider(1, .5, 1.5, .01),
      'Chart Shadow': slider(1, 0, 2, .01), 'Chart Grid Opacity': slider(1, 0, 1, .01),
      'Endpoint Style': { options: ['Ring', 'Minimal', 'Halo'], value: 'Ring' }, 'Endpoint Size': slider(5, 2, 10, .5),
      'Metric Arrow Gap': slider(8, 0, 20, 1), 'Metric Arrow Y': slider(-1, -10, 10, 1), 'Chart Line Thickness': slider(2.5, 1, 6, .25),
      'Metric Label Size': slider(1, .8, 1.5, .05), 'Metric Value Size': slider(1, .8, 1.5, .05), 'Chart Ambient Amount': slider(1, 0, 2, .05),
      'Replay Graph Intro': button(() => setGraphResetToken(token => token + 1)),
      'Replay Panel 04 Intro': button(() => setGraphResetToken(token => token + 1)),
    }),
    '05 — Stay Connected': folder({
      'Carousel Scale': slider(1, .5, 1.5, .01), 'Center Card X': slider(50, 0, 100), 'Center Card Y': slider(48, 0, 100), 'Center Card Rotation': slider(0, -30, 30),
      'Left Card X': slider(24, 0, 100), 'Left Card Y': slider(53, 0, 100), 'Left Card Rotation': slider(-9, -30, 30),
      'Right Card X': slider(76, 0, 100), 'Right Card Y': slider(53, 0, 100), 'Right Card Rotation': slider(9, -30, 30),
      'Carousel Card Surface': '#fffefa', 'Indicator Active Color': '#a9fb00', 'Indicator Inactive Color': '#d9dcd5',
      'Carousel Shadow': slider(1, 0, 2, .01), 'Card Spread': slider(1, .6, 1.5, .05),
      Autoplay: true, 'Pause On Interaction': true, 'Auto Advance Seconds': slider(4, 2, 12, .5),
    }),
    'Testimonial Content': folder(testimonialFolders),
  }, { store })
  const position = (prefix: string): Position => ({ x: Number(c[`${prefix} X` as keyof typeof c]), y: Number(c[`${prefix} Y` as keyof typeof c]), rotation: Number(c[`${prefix} Rotation` as keyof typeof c]) })
  const floatPanel = (prefix: string): FloatTuning => ({
    x: Number(c[`${prefix} Float X` as keyof typeof c]), y: Number(c[`${prefix} Float Y` as keyof typeof c]),
    rotation: Number(c[`${prefix} Float Rotation` as keyof typeof c]), duration: Number(c[`${prefix} Float Duration` as keyof typeof c]),
    phase: Number(c[`${prefix} Float Phase` as keyof typeof c]),
  })
  const value: Tuning = {
    global: { stageBackground: c['Stage Background'], elevatedSurface: c['Elevated Surface'], ink: c.Ink, mutedInk: c['Muted Ink'], sage: c.Sage, acid: c.Acid, borderColor: c['Border Color'], borderOpacity: c['Border Opacity'], shadowOpacity: c['Shadow Opacity'], shadowBlur: c['Shadow Blur'], shadowY: c['Shadow Y'], stageRadius: c['Stage Radius'], cardRadius: c['Card Radius'], globalScale: c['Global Scale'], gridOpacity: c['Global Grid Opacity'] },
    motion: { enabled: c['Enable Motion'], intensity: c['Motion Intensity'], introEnabled: c['Enable Intro'], introDuration: c['Intro Duration'], introStagger: c['Intro Stagger'], ambientEnabled: c['Enable Ambient'], ambientDuration: c['Ambient Loop Seconds'], floatAmount: c['Float Amount'], tiltAmount: c['Tilt Amount'], shadowDepth: c['Shadow Depth'], hoverResponse: c['Hover Tap Response'], interactionPause: c['Interaction Pause Seconds'], carouselTransition: c['Carousel Transition Seconds'] },
    floating: { enabled: c['Enable Idle Floating'], intensity: c['Float Intensity'], speed: c['Float Speed Multiplier'], panels: ['01', '02', '03', '04', '05'].map(floatPanel) },
    one: { logoPath: c['Center Logo / Mark Asset Path'], scale: c['One Scale'], center: position('Center Block'), centerScale: c['Center Block Scale'], centerLift: c['Center Lift'], web: position('Web Card'), ads: position('Ads Card'), creative: position('Creative Card'), connectorOpacity: c['Connector Opacity'], connectorThickness: c['Connector Thickness'], connectorCurve: c['Connector Curve'], connectorStyle: c['Connector Style'], ringOpacity: c['Ring Opacity'], dotColor: c['Green Dot Color'], dotInset: c['Dot Inset'], dotY: c['Dot Vertical Position'], smallFloat: c['Small Card Float'] },
    two: { scale: c['Stack Scale'], goals: position('Goals'), audience: position('Audience'), strategy: position('Strategy'), creative: position('Creative'), gridOpacity: c['Stack Grid Opacity'], activeColor: c['Active Card Color'], accentColor: c['Stack Accent Color'], shadow: c['Stack Shadow'], spacing: c['Stack Spacing'], tilt: c['Card Tilt'], hoverLift: c['Stack Hover Lift'], activeEmphasis: c['Active Emphasis'], iconReaction: c['Icon Reaction'] },
    three: { scale: c['Loop Scale'], launch: position('Launch'), measure: position('Measure'), improve: position('Improve'), arrowOpacity: c['Arrow Opacity'], arrowScale: c['Arrow Scale'], showArrows: c['Show Arrows'], routeSpeed: c['Route Loop Seconds'], cardFloat: c['Flow Card Float'], stageEmphasis: c['Stage Emphasis'], repeatX: c['Repeat Label X'], repeatY: c['Repeat Label Y'], repeatColor: c['Repeat Label Color'], repeatLabel: c['Repeat Label Text'] },
    four: { scale: c['Chart Scale'], x: c['Chart X'], y: c['Chart Y'], barColor: c['Bar Color'], lineColor: c['Trend Line Color'], highlightColor: c['Highlight Color'], metricScale: c['Metric Row Scale'], shadow: c['Chart Shadow'], gridOpacity: c['Chart Grid Opacity'], endpointStyle: c['Endpoint Style'], endpointSize: c['Endpoint Size'], arrowGap: c['Metric Arrow Gap'], arrowY: c['Metric Arrow Y'], lineThickness: c['Chart Line Thickness'], labelSize: c['Metric Label Size'], valueSize: c['Metric Value Size'], ambientAmount: c['Chart Ambient Amount'], graphResetToken },
    five: { scale: c['Carousel Scale'], center: position('Center Card'), left: position('Left Card'), right: position('Right Card'), cardSurface: c['Carousel Card Surface'], activeColor: c['Indicator Active Color'], inactiveColor: c['Indicator Inactive Color'], shadow: c['Carousel Shadow'], interval: c['Auto Advance Seconds'], spread: c['Card Spread'], autoplay: c.Autoplay, pauseOnInteraction: c['Pause On Interaction'] },
    testimonials: whyTestimonials.map((item, index) => {
      const prefix = `0${index + 1}`
      const field = (name: string) => String(c[`${prefix} ${name}` as keyof typeof c] ?? '')
      return { ...item, client: field('Client'), role: field('Role'), company: field('Company'), quote: field('Quote') }
    }),
  }
  return <Context.Provider value={value}>{children}</Context.Provider>
}

export function useWhyVisuals(): Tuning {
  const value = useContext(Context)
  if (!value) throw new Error('Why visuals require WhyVisualTuner')
  return value
}
