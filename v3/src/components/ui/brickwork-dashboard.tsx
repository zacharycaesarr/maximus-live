import { brickworkResults } from '@/lib/brickworkProof'
import { CampaignSymbol, PaidMediaMark } from '@/components/ui/brickwork-symbols'
import '@/components/ui/brickwork-dashboard.css'

const campaigns = [
  { name: 'Lead Gen', channel: 'Meta', kind: 'house' },
  { name: 'Lead Gen', channel: 'Google', kind: 'search' },
  { name: 'Remarketing', channel: 'Meta', kind: 'return' },
] as const

function HouseCreative() {
  return (
    <figure className="brickwork-creative">
      <figcaption>Ad creative (Meta)</figcaption>
      <div className="brickwork-ad">
        <PaidMediaMark channel="Meta" className="brickwork-ad-mark" />
        <svg viewBox="0 0 180 82" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true">
          <path d="M14 70h151M31 70V37l39-26 39 26v33M23 42l47-31 47 31M109 43h40v27M119 43v-9h30v36M52 70V46h22v24M83 43h14v15H83zM36 45h9v13h-9zM127 45h13v13h-13zM17 70V56m-6 4 6-10 6 10M156 70V49m-7 6 7-12 7 12" />
          <path d="M29 73h126M44 79h97" strokeOpacity=".25" />
        </svg>
        <h4>Transform<br />Your Home</h4>
        <p>Quality renovations<br />built to last.</p>
        <span className="brickwork-ad-cta">Get a Free Quote <span aria-hidden="true">→</span></span>
      </div>
    </figure>
  )
}

export default function BrickworkDashboard() {
  return (
    <section className="brickwork-dashboard" aria-label="Brickwork paid media campaign dashboard">
      <div className="brickwork-dashboard-shell">
        <header className="brickwork-controls">
          <div className="brickwork-channels" aria-label="Campaign channels">
            <span><PaidMediaMark channel="Meta" />Meta</span>
            <span><PaidMediaMark channel="Google" />Google</span>
          </div>
          <span className="brickwork-date">Last 30 days</span>
        </header>
        <div className="brickwork-campaigns">
          <h4>Campaign overview</h4>
          <table>
            <caption className="sr-only">Three campaigns and their channels. Only combined modeled results are available, shown in Performance comparison below.</caption>
            <thead><tr><th scope="col">Campaign</th><th scope="col">Channel</th></tr></thead>
            <tbody>{campaigns.map((campaign, index) => (
              <tr key={`${campaign.name}-${campaign.channel}`}>
                <th scope="row">
                  <span className="brickwork-campaign-icon"><CampaignSymbol kind={campaign.kind} /></span>
                  <span className="brickwork-campaign-title"><small>0{index + 1}</small><strong>{campaign.name}</strong></span>
                </th>
                <td><span className="brickwork-campaign-channel"><PaidMediaMark channel={campaign.channel} />{campaign.channel}</span></td>
              </tr>
            ))}</tbody>
          </table>
          <p className="brickwork-data-note">Campaign breakdown unavailable. Combined totals below.</p>
        </div>
        <div className="brickwork-lower">
          <section className="brickwork-comparison" aria-label="Performance comparison">
            <h4>Performance comparison</h4>
            <div className="brickwork-legend"><span>Before</span><span>After (30 days)</span></div>
            <dl className="brickwork-kpis">
              {[
                { name: 'Cost per lead (CPL)', values: brickworkResults.cpl },
                { name: 'Qualified leads', values: brickworkResults.leads },
                { name: 'ROAS', values: brickworkResults.roas },
              ].map(kpi => (
                <div className="brickwork-kpi" key={kpi.name}>
                  <dt>{kpi.name}</dt>
                  <dd><span className="brickwork-before">{kpi.values.before}</span><span className="brickwork-kpi-arrow" aria-hidden="true">→</span><strong className="brickwork-after">{kpi.values.after}</strong></dd>
                </div>
              ))}
            </dl>
            <dl className="brickwork-reporting">
              {[
                { name: 'Ad spend (modeled)', values: brickworkResults.adSpend },
                { name: 'Attributed revenue (implied)', values: brickworkResults.revenue },
              ].map(metric => (
                <div key={metric.name}>
                  <dt>{metric.name}</dt>
                  <dd><span>{metric.values.before}</span><span aria-hidden="true">→</span><strong>{metric.values.after}</strong></dd>
                </div>
              ))}
            </dl>
            <p className="brickwork-comparison-note">Combined modeled totals. Implied revenue rounded to whole dollars.</p>
          </section>
          <HouseCreative />
        </div>
      </div>
    </section>
  )
}
