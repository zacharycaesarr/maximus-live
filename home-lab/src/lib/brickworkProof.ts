/** User-supplied combined model. The later $7K budget is outside these periods. */
export const brickworkPeriods = {
  before: { qualifiedLeads: 43, cpl: 42, adSpend: 1806, roas: 1.2 },
  after: { qualifiedLeads: 186, cpl: 18, adSpend: 3348, roas: 3.8 },
} as const

const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
const { before, after } = brickworkPeriods

// Keep exact implied revenue for the model; round only its displayed dollar value.
export const brickworkImpliedRevenue = {
  before: before.adSpend * before.roas,
  after: after.adSpend * after.roas,
}

export const brickworkResults = {
  cpl: { before: currency.format(before.cpl), after: currency.format(after.cpl) },
  leads: { before: String(before.qualifiedLeads), after: String(after.qualifiedLeads) },
  roas: { before: `${before.roas.toFixed(1)}x`, after: `${after.roas.toFixed(1)}x` },
  adSpend: { before: currency.format(before.adSpend), after: currency.format(after.adSpend) },
  revenue: { before: currency.format(brickworkImpliedRevenue.before), after: currency.format(brickworkImpliedRevenue.after) },
}
