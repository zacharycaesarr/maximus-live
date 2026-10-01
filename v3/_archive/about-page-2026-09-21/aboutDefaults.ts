export const ABOUT_STORAGE_KEY = 'mr-v3-about-v1'

export const defaultAboutTuner = {
  heroEyebrow: 'About Maximus Reach',
  heroLine1: 'ZACHARY',
  heroLine2: 'MAXIMUS',
  heroTagline: 'Websites, ads, and digital growth for businesses ready to look sharper.',
  storyLabel: 'The short version',
  storyTitle: "Hey, I'm Zachary",
  storyP1:
    "I'm 24, based in Staunton, Virginia. I've been building online since I was a kid, usually messing around with Adobe Premiere, After Effects, and Notepad++ instead of playing outside (though I probably should've been). My dad's been into computers for as long as I can remember and is now a lead network engineer for Dell, so I grew up around that energy. Maximus Reach is how I help local businesses show up better online.",
  storyP2:
    "I've worked with 100+ clients to build the digital presence they want. One partner who can ship the site, the ads, and the follow-up systems without agency bloat.",
  doLabel: 'What I do',
  doTitle: 'Websites, ads, and the stuff that connects them',
  do1Title: 'Web Development',
  do1Body: 'Clean sites that load fast, look right on a phone, and make it easy for someone to call or book.',
  do2Title: 'Ad Management',
  do2Body: 'Facebook, Instagram, and Google ads aimed at people in your area who are actually looking.',
  do3Title: 'Digital Growth',
  do3Body: 'Google listings, reviews, and the small systems that keep your business visible week to week.',
  do4Title: 'Creative',
  do4Body: 'Editing, graphics, and short video when your brand needs to look consistent across social and the site.',
  processLabel: 'How it works',
  processTitle: 'From first message to launch',
  step1Title: 'You tell me what you need',
  step1Body: 'Email or call. Quick chat about your business, goals, and timeline.',
  step2Title: 'I map the plan',
  step2Body: 'Clear scope: pages, ads, creatives, whatever fits. You know what you are getting before we start.',
  step3Title: 'Build and revise',
  step3Body: 'I build it, you review it, we tighten the details until it feels right.',
  step4Title: 'Launch and stay in touch',
  step4Body: 'Go live, check results, and keep the door open if you want ongoing help.',
  ctaLabel: 'Next step',
  ctaTitle: "Tell me what you're working on",
  ctaSub: "Whether it's a new site, ads, or something in between, I'm easy to reach.",
  ctaEmail: 'hello@maximusreach.com',
  ctaButton: 'Get started',
}

export type AboutTuner = typeof defaultAboutTuner

export function loadAboutTuner(): AboutTuner {
  try {
    const raw = localStorage.getItem(ABOUT_STORAGE_KEY)
    if (!raw) return { ...defaultAboutTuner }
    return { ...defaultAboutTuner, ...JSON.parse(raw) }
  } catch {
    return { ...defaultAboutTuner }
  }
}
