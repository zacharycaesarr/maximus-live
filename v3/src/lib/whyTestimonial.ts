/** Only approved client quotations belong here. Empty entries are visibly marked in the design. */
export type WhyTestimonial = {
  quote: string
  client: string
  company: string
  role: string
  logo?: string
  photo?: string
}

export const whyTestimonials: WhyTestimonial[] = Array.from({ length: 6 }, () => ({
  quote: '', client: '', company: '', role: '',
}))
