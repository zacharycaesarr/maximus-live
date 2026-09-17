import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { LevaPanel, useCreateStore, useControls, folder } from 'leva'
import DirectNav from '@/components/nav/DirectNav'
import { NavTunerProvider } from '@/context/NavTunerContext'
import { ReachTunerProvider } from '@/context/ReachTunerContext'
import { LenisTunerProvider } from '@/context/LenisTunerContext'
import SmoothScroll from '@/components/SmoothScroll'

type Props = {
  title: string
  pathKey: string
  blurb: string
}

/** Placeholder page with its own Leva store (not the home hero tuners). */
export default function PlaceholderPage({ title, pathKey, blurb }: Props) {
  const store = useCreateStore()
  const isDev = import.meta.env.DEV
  const [collapsed, setCollapsed] = useState(true)
  const [mountKey, setMountKey] = useState(0)

  useControls(
    {
      [title]: folder(
        {
          pageTitle: { value: title, label: 'page title' },
          hint: { value: `This Leva panel is only for ${pathKey}`, label: 'scope' },
        },
        { collapsed: false },
      ),
    },
    { store },
  )

  useEffect(() => {
    document.title = `${title} · Maximus Reach`
  }, [title])

  return (
    <LenisTunerProvider store={store}>
      <NavTunerProvider store={store}>
        <ReachTunerProvider store={store}>
          <SmoothScroll>
            <div className="min-h-screen bg-[#f7f7f5]">
              <DirectNav />
              <main className="mx-auto flex max-w-3xl flex-col px-6 py-24 md:py-32">
                <p className="mb-3 font-nhg text-[11px] font-medium uppercase tracking-[0.16em] text-espresso/40">
                  Placeholder
                </p>
                <h1 className="m-0 font-nhg text-[clamp(2rem,5vw,3rem)] font-semibold tracking-tight text-espresso">
                  {title}
                </h1>
                <p className="mt-4 max-w-xl font-nhg text-base leading-relaxed text-espresso/60">{blurb}</p>
                <Link
                  to="/"
                  className="mt-10 inline-flex w-fit rounded-[10px] bg-[#111] px-5 py-3 font-nhg text-sm text-[#FCFAF2] no-underline"
                >
                  Back home
                </Link>
              </main>
            </div>
          </SmoothScroll>
          {isDev && (
            <div data-lenis-prevent className="mr-v3-leva-host" onWheel={(e) => e.stopPropagation()}>
              <LevaPanel
                key={mountKey}
                store={store}
                collapsed={{
                  collapsed,
                  onChange: (c) => {
                    setCollapsed(c)
                    if (!c) setMountKey((k) => k + 1)
                  },
                }}
                titleBar={{ title: `Maximus · ${title}`, filter: false }}
                oneLineLabels
              />
            </div>
          )}
        </ReachTunerProvider>
      </NavTunerProvider>
    </LenisTunerProvider>
  )
}
