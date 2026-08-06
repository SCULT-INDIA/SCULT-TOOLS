import type { ComponentType } from 'react'
import type { TemplateId } from '@/lib/tools/invoice-generator/logic'
import { AgencyTemplate } from './AgencyTemplate'
import { BoutiqueTemplate } from './BoutiqueTemplate'
import { ClassicTemplate } from './ClassicTemplate'
import { ClinicTemplate } from './ClinicTemplate'
import { CorporateTemplate } from './CorporateTemplate'
import { HospitalityTemplate } from './HospitalityTemplate'
import { MinimalTemplate } from './MinimalTemplate'
import { NonprofitTemplate } from './NonprofitTemplate'
import { RetailTemplate } from './RetailTemplate'
import { TechTemplate } from './TechTemplate'
import { TradeTemplate } from './TradeTemplate'
import type { InvoiceTemplateProps } from './types'

/**
 * The template registry — the one place `draft.template` resolves to an
 * actual component. `Record<TemplateId, …>` rather than a lookup with a
 * fallback is deliberate: TypeScript then refuses to compile if a template is
 * added to `INVOICE_TEMPLATES` in logic.ts without a matching component here,
 * so the two lists can never drift.
 */
export const INVOICE_TEMPLATE_COMPONENTS: Record<
  TemplateId,
  ComponentType<InvoiceTemplateProps>
> = {
  classic: ClassicTemplate,
  minimal: MinimalTemplate,
  agency: AgencyTemplate,
  corporate: CorporateTemplate,
  boutique: BoutiqueTemplate,
  trade: TradeTemplate,
  retail: RetailTemplate,
  hospitality: HospitalityTemplate,
  tech: TechTemplate,
  clinic: ClinicTemplate,
  nonprofit: NonprofitTemplate,
}

export type { InvoiceTemplateProps } from './types'
export { ClassicTemplate }
