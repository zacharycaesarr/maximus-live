import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Observer } from 'gsap/Observer'
import { SplitText } from 'gsap/SplitText'

// Module registration is idempotent; the existing site's ScrollTrigger plugin is reused.
gsap.registerPlugin(ScrollTrigger, Observer, SplitText)
export { gsap, ScrollTrigger, Observer, SplitText }
