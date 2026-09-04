import './browser-chrome.css'

function IconBack() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function IconForward() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function IconReload() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 12a8 8 0 0 1 13.5-5.7M20 12a8 8 0 0 1-13.5 5.7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path d="M17 4v4h-4M7 20v-4h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function IconLock() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function IconMore() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="6" cy="12" r="1.5" fill="currentColor" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
      <circle cx="18" cy="12" r="1.5" fill="currentColor" />
    </svg>
  )
}

export default function BrowserChrome({ settings }) {
  const chromeStyle = {
    background: `linear-gradient(180deg, ${settings.chromeBgTop} 0%, ${settings.chromeBgBottom} 100%)`,
  }

  return (
    <div className="browser-chrome" style={chromeStyle} aria-hidden="true">
      <div className="browser-chrome-tabs">
        <div className="browser-tab browser-tab--active">
          <span className="browser-tab-favicon" />
          <span className="browser-tab-label">{settings.tabTitle}</span>
          <span className="browser-tab-close">×</span>
        </div>
        <div className="browser-tab browser-tab--ghost">
          <span className="browser-tab-favicon browser-tab-favicon--muted" />
          <span className="browser-tab-label">New tab</span>
        </div>
        <button type="button" className="browser-tab-new" aria-label="New tab">
          +
        </button>
      </div>

      <div className="browser-toolbar">
        <div className="browser-toolbar-nav">
          <button type="button" className="browser-toolbar-btn" aria-label="Back">
            <IconBack />
          </button>
          <button type="button" className="browser-toolbar-btn" aria-label="Forward">
            <IconForward />
          </button>
          <button type="button" className="browser-toolbar-btn" aria-label="Reload">
            <IconReload />
          </button>
        </div>

        <div className="browser-omnibox">
          <span className="browser-omnibox-lock">
            <IconLock />
          </span>
          <span className="browser-omnibox-url">https://{settings.addressUrl}</span>
        </div>

        <div className="browser-toolbar-actions">
          <button type="button" className="browser-toolbar-btn" aria-label="More">
            <IconMore />
          </button>
        </div>
      </div>
    </div>
  )
}
