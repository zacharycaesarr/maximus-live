import BrandMark from '../brand/BrandMark'
import { InstagramIcon, LinkedInIcon, XIcon } from '../brand/SocialIcons'
import { useSiteChrome } from '../../context/SiteChromeContext'
import './site-footer.css'

const FOOTER_LINKS = [
  { href: '#services', label: 'Services' },
  { href: '#work', label: 'Work' },
  { href: '#process', label: 'Process' },
  { href: '#contact', label: 'Contact' },
]

export default function SiteFooter() {
  const { settings } = useSiteChrome()

  return (
    <footer className="site-footer" id="contact">
      <div className="site-footer__accent" aria-hidden="true" />

      <div className="site-footer__inner">
        <div className="site-footer__brand">
          <BrandMark size={Math.max(settings.logoSize + 8, 36)} />
          <div>
            <p className="site-footer__name">Maximus Reach</p>
            <p className="site-footer__tag">{settings.footerTag}</p>
          </div>
        </div>

        <nav className="site-footer__links" aria-label="Footer">
          {FOOTER_LINKS.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>

        <div className="site-footer__cta-row">
          <a className="site-footer__email" href={`mailto:${settings.email}`}>
            {settings.email}
          </a>
          <div className="site-footer__social" aria-label="Social">
            <a href={settings.instagram} target="_blank" rel="noreferrer" aria-label="Instagram">
              <InstagramIcon />
            </a>
            <a href={settings.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn">
              <LinkedInIcon />
            </a>
            <a href={settings.xUrl} target="_blank" rel="noreferrer" aria-label="X">
              <XIcon />
            </a>
          </div>
        </div>

        <p className="site-footer__legal">© {new Date().getFullYear()} Maximus Reach. All rights reserved.</p>
      </div>
    </footer>
  )
}
