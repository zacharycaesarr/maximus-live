import { useEffect, useRef } from 'react'
import { button, folder, LevaInputs, LevaPanel, useControls, useCreateStore } from 'leva'
import { defaultSignalSettings, type SignalSettings } from './signalSettings'

const storageKey = 'mr-v3-about-signal-v1'
function load(): SignalSettings {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || '{}')
    return { ...defaultSignalSettings, ...saved, clientsServed: String(saved.clientsServed ?? '').trim() || defaultSignalSettings.clientsServed }
  }
  catch { return defaultSignalSettings }
}
export default function SignalTuner({ onChange }: { onChange: (settings: SignalSettings) => void }) {
  const store = useCreateStore()
  const initial = useRef(load()).current
  const current = useRef(initial)
  const values = useControls({
    Content: folder({
      clientsServed: { type: LevaInputs.STRING, value: initial.clientsServed, label: 'Clients served (blank = pending)' },
    }),
    Composition: folder({
      typeScale: { value: initial.typeScale, min: 0.75, max: 1.15, step: 0.01, label: 'Headline scale' },
      horizontalScale: { value: initial.horizontalScale, min: 1.1, max: 1.8, step: 0.01, label: 'Horizontal type scale' },
      portraitScale: { value: initial.portraitScale, min: 0.8, max: 1.2, step: 0.01, label: 'Portrait scale' },
      beaconBloom: { value: initial.beaconBloom, min: 0.1, max: 1, step: 0.01, label: 'Beacon bloom' },
    }),
    Pacing: folder({
      desktopDistance: { value: initial.desktopDistance, min: 300, max: 650, step: 10, label: 'Desktop scroll (svh)' },
      mobileDistance: { value: initial.mobileDistance, min: 280, max: 550, step: 10, label: 'Mobile scroll (svh)' },
      stiffness: { value: initial.stiffness, min: 80, max: 350, step: 5, label: 'Response' },
      damping: { value: initial.damping, min: 25, max: 60, step: 1, label: 'Damping' },
    }),
    Remember: button(() => localStorage.setItem(storageKey, JSON.stringify(current.current))),
    Revert: button(() => { localStorage.removeItem(storageKey); window.location.reload() }),
  }, { store })
  useEffect(() => { current.current = { ...defaultSignalSettings, ...values }; onChange(current.current) }, [values, onChange])
  return <div className="ab-tuner" data-lenis-prevent><LevaPanel store={store} collapsed titleBar={{ title: 'About · Signal', filter: false }} /></div>
}
