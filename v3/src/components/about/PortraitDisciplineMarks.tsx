import AboutDisciplineIcon from './AboutDisciplineIcon'

/** Desktop side marks. The portrait's existing visibility state controls their CSS idle motion. */
export default function PortraitDisciplineMarks() {
  return (
    <div className="ab-discipline-stack">
      <div className="ab-discipline">
        <AboutDisciplineIcon kind="web" className="ab-discipline-mark ab-web-mark ab-icon-idle" />
        <span>WEB DEV</span>
      </div>
      <div className="ab-discipline">
        <AboutDisciplineIcon kind="creative" className="ab-discipline-mark ab-creative-mark ab-icon-idle" />
        <span>CREATIVE STUDIO</span>
      </div>
      <div className="ab-discipline">
        <AboutDisciplineIcon kind="ads" className="ab-discipline-mark ab-ads-mark ab-icon-idle" />
        <span>AD MANAGE</span>
      </div>
    </div>
  )
}
