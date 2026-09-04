import { HERO_TEXT_TUNER_STORAGE_KEY } from '../components/hero/heroTextDefaults'
import { SUBHEAD_TUNER_STORAGE_KEY } from '../components/hero/subheadDefaults'
import { SHADER_TUNER_STORAGE_KEY } from '../components/background/shaderDefaults'
import { PARTICLES_TUNER_STORAGE_KEY } from '../components/background/particlesDefaults'
import { CARDS_TUNER_STORAGE_KEY } from '../components/cards/serviceCardsDefaults'
import { NAV_TUNER_STORAGE_KEY } from '../components/nav/navDefaults'
import { PARALLAX_TUNER_STORAGE_KEY } from './parallaxDefaults'
import { SCROLL_TUNER_STORAGE_KEY } from './scrollDefaults'
import { HOLD_WAVES_STORAGE_KEY, EXPLORE_WAVES_STORAGE_KEY } from '../components/background/wavesDefaults'
import { BENTO_TUNER_STORAGE_KEY } from './bentoDefaults'
import { SITE_CHROME_STORAGE_KEY } from './siteChromeDefaults'
import { TYPOGRAPHY_STORAGE_KEY } from './typographyDefaults'
import { PANEL_POS_STORAGE_KEY } from './panelPositions'

function readJson(key, fallback = {}) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

/** One-click dump of every tuner value you've edited in dev. */
export function buildAllTunersPayload() {
  return {
    heroText: readJson(HERO_TEXT_TUNER_STORAGE_KEY),
    subhead: readJson(SUBHEAD_TUNER_STORAGE_KEY),
    shader: readJson(SHADER_TUNER_STORAGE_KEY),
    particles: readJson(PARTICLES_TUNER_STORAGE_KEY),
    parallax: readJson(PARALLAX_TUNER_STORAGE_KEY),
    nav: readJson(NAV_TUNER_STORAGE_KEY),
    serviceCards: readJson(CARDS_TUNER_STORAGE_KEY),
    scrollWindow: readJson(SCROLL_TUNER_STORAGE_KEY),
    realityWavesBackground: readJson(HOLD_WAVES_STORAGE_KEY),
    exploreWavesBackground: readJson(EXPLORE_WAVES_STORAGE_KEY),
    servicesBento: readJson(BENTO_TUNER_STORAGE_KEY),
    siteChrome: readJson(SITE_CHROME_STORAGE_KEY),
    typography: readJson(TYPOGRAPHY_STORAGE_KEY),
    panelPositions: readJson(PANEL_POS_STORAGE_KEY),
    exportedAt: new Date().toISOString(),
  }
}

export function copyAllTunersToClipboard() {
  const payload = buildAllTunersPayload()
  return navigator.clipboard?.writeText(JSON.stringify(payload, null, 2))
}
