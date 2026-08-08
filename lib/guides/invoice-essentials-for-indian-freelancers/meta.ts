import type { Guide } from '../types'

export const meta: Guide = {
  slug: 'invoice-essentials-for-indian-freelancers',
  title: 'What Every Invoice Needs — A Guide for Indian Freelancers and Small Businesses',
  h1: 'What every invoice needs, for freelancers and small businesses in India',
  description:
    'The fields a valid invoice needs, the India-specific basics (GSTIN, CGST/SGST vs IGST, sequential numbering) and the mistakes that get invoices paid late.',
  dek: 'Most late payments trace back to the invoice, not the client. Missing due dates, numbering that skips, totals that do not add up — this is what a complete invoice actually needs, and where India-specific rules come in.',
  updatedAt: '2026-08-09',
  readingMinutes: 5,
  relatedTools: ['invoice-generator', 'email-signature-generator'],
  sections: [
    {
      heading: 'The fields every invoice needs, anywhere in the world',
      body: [
        'Before any country-specific rule applies, an invoice is a document that has to answer a few plain questions: who billed whom, for what, how much, and by when is it due. Leave one of those out and you have not sent an invoice — you have sent an itemized guess.',
        'A complete invoice needs: a unique invoice number, the issue date, and a due date. Your business details and your client’s — name, address and a way to reach each of you. Itemized line items, each with a description, quantity and rate, rather than a single lump sum. A subtotal, the tax applied (if any) and the total. And a stated payment term and method — how many days the client has to pay, and where the money should actually go.',
        'None of these fields is decorative. The invoice number and issue date are what make the document referenceable later, in an email thread or an accounting system. The line items are what let a client’s finance team check your math instead of taking your total on faith. And the payment terms are what turn "please pay" into something with an actual deadline attached.',
      ],
    },
    {
      heading: 'The India-specific basics: GSTIN, CGST/SGST vs IGST, and numbering',
      body: [
        'If you are registered for GST, show your GSTIN on the invoice, in your business’s address block. A client who is also GST-registered will often need it to claim input tax credit, and its absence is a common reason an invoice bounces back for correction.',
        'The tax split depends on where you and your client are located, not on what you sell. Bill a client in the same state as your registered place of business, and the tax is split into CGST and SGST. Bill a client in a different state (an inter-state supply), and the tax is charged as IGST instead. This is a genuinely common source of invoicing mistakes, because the total tax rate is often the same either way — only the split changes, and getting the split wrong is still wrong.',
        'Keep your invoice numbering sequential, without gaps or repeats, across your entire billing history — not per client or per month in isolation. A number that skips, or two invoices sharing the same number, is one of the first things a client’s accounts team or a GST officer will flag.',
        'None of the above is tax advice, and it is deliberately kept generic. GST treatment has exceptions, thresholds and edge cases (composition scheme, exports, reverse charge, and more) that depend on your specific registration and the nature of what you are billing. If a GST detail actually matters for a given invoice, confirm it with a chartered accountant before you rely on it.',
      ],
    },
    {
      heading: 'Billing clients outside India',
      body: [
        'An international client does not need a GST split. What they do need is the invoice in a currency they recognize, with a total that does not need converting by hand before it can be approved for payment.',
        'This is the one place where the right tool matters more than the rule: our Invoice Generator supports eight currencies, so an invoice for a client in the US, the UK, the EU or elsewhere can be issued in their currency directly, with every line item and total already computed in it, rather than in rupees with a currency symbol relabeled afterward.',
      ],
    },
    {
      heading: 'Mistakes that get invoices rejected or paid late',
      body: [
        'A large share of "late" payments are actually invoices that were never payable on time in the first place, because something on the document made the client’s finance team stop and ask a question instead of just paying it. The recurring offenders:',
        'No due date, or a due date implied rather than stated. "Payment appreciated promptly" is not a due date. Every invoice needs an explicit date, and it should follow from a stated payment term (Net 7, Net 15, Net 30) rather than being picked at random.',
        'No payment terms or payment method. A total with nowhere to send it — no bank details, no payment link, no method at all — sits in someone’s inbox until they think to ask you how to pay.',
        'Inconsistent or reused invoice numbers. Beyond the GST issue above, an accounts team that cannot tell whether an invoice is a duplicate, a correction, or a new bill will often just hold it rather than risk paying twice.',
        'Math that does not reconcile. Line items that do not sum to the stated subtotal, or a tax and total that do not follow from it, is the single fastest way to get an invoice bounced back for correction — and every round trip adds days to when you actually get paid.',
      ],
    },
    {
      heading: 'Putting this together',
      body: [
        'The fields above are exactly what our Invoice Generator is built around: a live preview as you fill it in, Net 7/14/30 payment terms that fill in the due date for you, and line-item totals computed so the subtotal, tax and total always reconcile. It also lets you carry your GSTIN in the address block for a standard GST tax invoice and continue a sequential invoice series with its Next number field.',
        'Once the invoice looks right, an Email Signature Generator is a small, related finishing touch — it puts your business name, role and contact details into every email you send an invoice from, which is one more way a client can reach you if a question comes up before payment.',
      ],
    },
  ],
}
