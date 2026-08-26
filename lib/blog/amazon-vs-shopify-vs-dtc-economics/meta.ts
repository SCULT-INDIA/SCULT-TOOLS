import { resolveServiceLink } from '@/lib/tools/service-links'
import type { BlogPost } from '../types'

const SLUG = 'amazon-vs-shopify-vs-dtc-economics'
const SERVICE_WEB_DEVELOPMENT = resolveServiceLink('web-development', SLUG)

/**
 * Generated from content-engine/05-drafts/article_083.md by
 * content-engine/generate-meta-files.js — every claim, source, and link was
 * written and fact-checked by the content-engine research/production
 * pipeline (see content-engine/06-verification for the per-article report),
 * not invented at conversion time.
 */
export const meta: BlogPost = {
  slug: SLUG,
  pillar: 'roundup',
  title: 'Amazon vs Shopify vs DTC Economics: What Actually Changed in 2026',
  h1: 'Amazon vs Shopify vs DTC economics: what actually changed',
  targetKeyword: 'amazon vs shopify vs dtc economics',
  description:
    'How Amazon fees, Shopify costs, and rising customer acquisition costs changed the real margin math between marketplace and DTC selling in 2026.',
  dek: "On a $100 sale, one 2026 illustrative model from Eightx puts roughly $44 kept by an Amazon seller versus $63 kept by a Shopify DTC seller, once typical fees are counted for a mid-range order — Eightx is explicit that these are illustrative midpoints, not a measured average across real sellers, and actual figures vary by category, weight tier, and ad spend ([Eightx](https://eightx.co/blog/average-ecommerce-gross-margin-shopify-vs-amazon-2026)). But the bigger 2026 story isn't the fee gap itself — it's that direct-to-consumer customer acquisition costs have climbed so sharply that many brands are treating physical retail, not Meta ads, as the cheaper way to acquire a customer, while still running Amazon in parallel for reach.",
  sections: [
    {
      heading: 'The $100-sale math: Amazon vs Shopify',
      body: [
        [
          'A 2026 illustrative cost model from Eightx lays out the per-order margin gap using a mid-range hypothetical order: on the same SKU at the same price, Amazon keeps roughly $44 of every $100 sale once referral fees, FBA fulfillment, and storage are counted (COGS and inbound freight held equal across both channels), while a Shopify DTC store keeps roughly $63 after payment processing and platform fees. Eightx labels these figures illustrative midpoints that vary by category, weight tier, and ad spend — not a measured average across actual sellers — so treat the gap as directionally real but not a precise universal number (',
          {
            text: 'Eightx',
            href: 'https://eightx.co/blog/average-ecommerce-gross-margin-shopify-vs-amazon-2026',
            external: true,
          },
          "). That's not one flat number across every category — a separate Eightx breakdown by vertical found beauty/skincare shows the widest gap of any category studied (about 20% contribution margin on Amazon vs. 32% on Shopify), with supplements close behind (18% vs. 28%), attributed to those categories being light, high-margin SKUs that benefit disproportionately from Shopify's subscription economics (",
          {
            text: 'Eightx',
            href: 'https://eightx.co/blog/average-ecommerce-contribution-margin-amazon-vs-shopify-2026',
            external: true,
          },
          ').',
        ],
        [
          'The structural reason for the gap, per the same analysis: Shopify lets a brand own the customer relationship — email, SMS, loyalty programs, subscriptions — so a second and third purchase from the same customer gets cheaper over time. Amazon, by contrast, effectively charges a fresh referral fee on every single transaction, repeat customer or not, because the platform — not the brand — owns that relationship (',
          {
            text: 'Eightx',
            href: 'https://eightx.co/blog/average-ecommerce-gross-margin-shopify-vs-amazon-2026',
            external: true,
          },
          ').',
        ],
      ],
    },
    {
      heading: "Amazon's 2026 fee structure in full",
      body: [
        [
          "Amazon's official update for 2026 kept most referral fee percentages flat — most categories still sit at 15%, though this varies significantly by category, with some (like device accessories) running as high as 45% (",
          {
            text: 'Repricer',
            href: 'https://www.repricer.com/blog/amazon-seller-fees/',
            external: true,
          },
          '; ',
          {
            text: 'Feedvisor',
            href: 'https://feedvisor.com/university/referral-fee/',
            external: true,
          },
          '). The bigger 2026 change was on the fulfillment side: Amazon\'s own announcement confirms FBA fulfillment fees rose by an average $0.08 per unit starting in the update. Separately, third-party tracking of the "Low-Price FBA" program (for items under $10) reports that its discount relative to the standard FBA fee widened to roughly $0.86 per unit in 2026, up from about $0.77 in 2025 — a modest ~$0.09 improvement in the sub-$10 discount, not an $0.86 year-over-year fee cut (',
          {
            text: 'Amazon Selling Partners',
            href: 'https://sellingpartners.aboutamazon.com/update-to-u-s-referral-and-fulfillment-by-amazon-fees-for-2026',
            external: true,
          },
          '; ',
          {
            text: 'AMZPrep',
            href: 'https://amzprep.com/amazon-fba-fees/',
            external: true,
          },
          ').',
        ],
        [
          "Once every fee layer is counted — referral, FBA fulfillment, storage, returns processing, and the advertising spend most sellers need just to stay visible in Amazon's search results — one estimate puts total Amazon selling costs at roughly 30–45% of an item's selling price in 2026 (",
          {
            text: 'SentryKit',
            href: 'https://sentrykit.com/blog/amazon-seller-fba-fees-2026/',
            external: true,
          },
          '). A separate synthesis puts the broader range (referral + FBA + advertising) as high as 35–55% of revenue in total fees, against a Shopify Plus total cost-to-sell more commonly cited in the 22–40% range — the exact percentage in either case depends heavily on category, ad spend intensity, and fulfillment method, so treat these as directional ranges rather than a single fixed number for every seller.',
        ],
      ],
    },
    {
      heading: 'Why DTC customer acquisition cost got so expensive',
      body: [
        [
          "The other half of the 2026 story is that running your own store doesn't automatically mean cheap growth — it means a different, and currently worse, cost problem: paid acquisition.",
        ],
        [
          "Swell's 2026 DTC statistics roundup cites customer acquisition cost (CAC) up roughly 40–60% since 2023, and 222% cumulatively over roughly eight years according to an L.E.K. Consulting analysis (",
          {
            text: 'Swell',
            href: 'https://www.swell.is/content/dtc-ecommerce-statistics',
            external: true,
          },
          '; ',
          {
            text: 'L.E.K. Consulting',
            href: 'https://www.lek.com/sites/default/files/PDFs/fighting-acquisition-costs.pdf',
            external: true,
          },
          '). The drivers are structural, not a one-off spike: Google Shopping CPCs reportedly rose about 33.72% in 2025, and Meta CPMs hit all-time highs around $22.98 in Q4 (',
          {
            text: 'Swell',
            href: 'https://www.swell.is/content/dtc-ecommerce-statistics',
            external: true,
          },
          '). This means the "just run Meta ads" playbook that defined the early-2020s DTC boom has gotten structurally more expensive, independent of any single brand\'s execution quality.',
        ],
        [
          'This matters directly for the Amazon-vs-Shopify decision, because "Shopify keeps more per sale" only holds if the brand can actually get the customer to the Shopify store affordably in the first place. A brand paying $60 in Meta ad spend to acquire a customer who then buys a $40 product has a much worse economic picture than the raw per-order margin comparison above suggests.',
        ],
      ],
    },
    {
      heading: 'Why DTC brands are opening physical stores again',
      body: [
        [
          'The direct market response to rising paid-social CAC, per Shopify\'s own coverage of the trend, is a wave of DTC brands opening physical retail locations — framed in industry coverage with the phrase "rent is the new CAC" (',
          {
            text: 'Shopify',
            href: 'https://www.shopify.com/blog/dtc-to-brick-and-mortar',
            external: true,
          },
          '; ',
          {
            text: 'Swell',
            href: 'https://www.swell.is/content/dtc-ecommerce-statistics',
            external: true,
          },
          "). The logic: a physical storefront's monthly rent functions as a fixed, predictable acquisition cost, in a market where digital ad costs have become both higher and less predictable. This is a real, sourced shift in strategy — not every DTC brand is doing it, and it's not a universal fix, but it's a documented and repeated pattern across multiple brand case studies in 2026 coverage.",
        ],
      ],
    },
    {
      heading: 'Practical examples',
      body: [
        [
          { text: 'Sourced example:', bold: true },
          ' Multiple 2026 sources describe the current standard playbook among the fastest-growing brands as running both channels deliberately at once — Amazon for reach and discovery (where shoppers are already searching with purchase intent), Shopify for owned customer relationships and the better repeat-purchase margin described above (',
          {
            text: 'Eightx',
            href: 'https://eightx.co/blog/average-ecommerce-gross-margin-shopify-vs-amazon-2026',
            external: true,
          },
          '). This is a meaningful shift from the earlier framing of "pick a lane" — the 2026 consensus is closer to "use each channel for what it\'s structurally good at."',
        ],
        [
          { text: 'Illustrative example (labeled as such):', bold: true },
          " A skincare brand selling a $35 serum on both channels might see roughly $15–17 kept per unit on Amazon after all fees (in the 20% contribution-margin range Eightx cites for beauty), versus roughly $24–26 kept per unit on Shopify (32% range) before accounting for the ad spend needed to drive that Shopify sale. If that ad spend runs $10–15 per acquisition given 2025–2026 CPM/CPC trends, the two channels' *net* profitability on a single first-time sale can end up closer than the raw margin percentages suggest — the Shopify advantage compounds mainly on the second and third purchase from the same customer, not necessarily the first.",
        ],
      ],
    },
    {
      heading: 'Data and evidence',
      body: [
        [
          '– ',
          { text: '~$44 kept by Amazon vs. ~$63 kept by Shopify', bold: true },
          ' per $100 sale, all fees counted — ',
          {
            text: 'Eightx',
            href: 'https://eightx.co/blog/average-ecommerce-gross-margin-shopify-vs-amazon-2026',
            external: true,
          },
          '.',
        ],
        [
          '– ',
          { text: 'Beauty/skincare margin gap:', bold: true },
          ' ~20% Amazon vs. ~32% Shopify contribution margin; ',
          { text: 'supplements:', bold: true },
          ' ~18% vs. ~28% — ',
          {
            text: 'Eightx',
            href: 'https://eightx.co/blog/average-ecommerce-contribution-margin-amazon-vs-shopify-2026',
            external: true,
          },
          '.',
        ],
        [
          '– ',
          { text: 'Amazon referral fees:', bold: true },
          ' most categories at 15%, with wide category variation (some as high as 45%) — ',
          {
            text: 'Repricer',
            href: 'https://www.repricer.com/blog/amazon-seller-fees/',
            external: true,
          },
          ', ',
          {
            text: 'Feedvisor',
            href: 'https://feedvisor.com/university/referral-fee/',
            external: true,
          },
          '.',
        ],
        [
          '– ',
          { text: '2026 Amazon FBA fee change:', bold: true },
          ' average +$0.08/unit fulfillment fee increase per Amazon\'s own announcement; separately, the sub-$10 "Low-Price FBA" discount widened to roughly $0.86 below the standard fee (up from ~$0.77 in 2025), per third-party tracking — ',
          {
            text: 'Amazon Selling Partners',
            href: 'https://sellingpartners.aboutamazon.com/update-to-u-s-referral-and-fulfillment-by-amazon-fees-for-2026',
            external: true,
          },
          ', ',
          {
            text: 'AMZPrep',
            href: 'https://amzprep.com/amazon-fba-fees/',
            external: true,
          },
          '.',
        ],
        [
          '– ',
          { text: 'Total Amazon selling cost:', bold: true },
          ' roughly 30–45% of selling price once referral, FBA, storage, returns, and advertising are counted — ',
          {
            text: 'SentryKit',
            href: 'https://sentrykit.com/blog/amazon-seller-fba-fees-2026/',
            external: true,
          },
          '.',
        ],
        [
          '– ',
          { text: 'DTC CAC increase:', bold: true },
          ' 40–60% since 2023; 222% cumulative over ~8 years — ',
          {
            text: 'Swell',
            href: 'https://www.swell.is/content/dtc-ecommerce-statistics',
            external: true,
          },
          ', ',
          {
            text: 'L.E.K. Consulting',
            href: 'https://www.lek.com/sites/default/files/PDFs/fighting-acquisition-costs.pdf',
            external: true,
          },
          '.',
        ],
        [
          '– ',
          { text: 'Google Shopping CPCs:', bold: true },
          ' up ~33.72% in 2025; ',
          { text: 'Meta CPMs:', bold: true },
          ' ~$22.98 in Q4, described as an all-time high — ',
          {
            text: 'Swell',
            href: 'https://www.swell.is/content/dtc-ecommerce-statistics',
            external: true,
          },
          '.',
        ],
        [
          '– ',
          { text: 'Amazon + Shopify combined US ecommerce share:', bold: true },
          ' ~50% as of 2026 — ',
          {
            text: 'Novadata',
            href: 'https://novadata.io/resources/news/amazon-shopify-50-percent-us-ecommerce-2026',
            external: true,
          },
          '.',
        ],
        [
          'Where a figure varies notably between sources (e.g., total Amazon selling cost as a percentage of revenue), this article presents the range rather than picking a single number to state as definitive, since the underlying methodologies differ by category mix and fulfillment assumptions.',
        ],
      ],
    },
    {
      heading: 'Comparisons',
      body: [
        [
          '### Amazon FBA vs Shopify: profit margin',
          ' ',
          "Amazon FBA trades margin for demand-side convenience — the seller doesn't need to generate their own traffic, but pays for that traffic access through referral fees, fulfillment fees, storage, and (in practice) advertising spend to stay visible in search results. Shopify keeps more margin per sale but requires the seller to generate their own traffic, which is where 2026's elevated CAC environment bites.",
        ],
        ['### Amazon referral fee vs Shopify transaction fee'],
        [
          "Amazon's referral fee (commonly 15%, category-dependent) applies to every transaction indefinitely. Shopify's transaction fees depend on the payment processor and plan — using Shopify Payments avoids extra transaction fees beyond standard card processing, while third-party gateways add an extra 0.5–2% on top depending on plan. The structural difference is what the fee buys: Amazon's fee includes marketplace demand and discovery; Shopify's fee is purely payment processing, with demand generation left entirely to the seller.",
        ],
        ['### DTC vs marketplace selling economics, overall'],
        [
          'Marketplace selling (Amazon) front-loads demand at the cost of margin and customer ownership. DTC selling (Shopify) front-loads margin and customer ownership at the cost of needing to generate demand yourself in an ad market that got structurally more expensive through 2025–2026. Neither is categorically "better" — the 2026 pattern documented across multiple sources is brands running both, deliberately, rather than treating the decision as exclusive.',
        ],
      ],
    },
    {
      heading: 'Real-world use cases',
      body: [
        [
          'The "sell on Amazon and build a Shopify DTC presence" dual-channel pattern is documented across multiple 2026 sources as the approach the fastest-growing brands are using, rather than choosing exclusively one or the other (',
          {
            text: 'Eightx',
            href: 'https://eightx.co/blog/average-ecommerce-gross-margin-shopify-vs-amazon-2026',
            external: true,
          },
          '; ',
          {
            text: 'Webgility',
            href: 'https://www.webgility.com/blog/https/www.webgility.com/blog/order-to-payouts-process',
            external: true,
          },
          "). Brands opening physical retail locations as a documented response to CAC inflation is a second real, sourced pattern — Shopify's own blog profiles multiple brands that made this shift specifically framed as an acquisition-cost strategy, not just a brand-building move (",
          {
            text: 'Shopify',
            href: 'https://www.shopify.com/blog/dtc-to-brick-and-mortar',
            external: true,
          },
          ').',
        ],
      ],
    },
    {
      heading: 'Common mistakes',
      body: [
        [
          '– ',
          { text: 'Comparing gross margin only, ignoring CAC.', bold: true },
          ' A higher per-order Shopify margin means little if the ad spend to acquire that order eats the difference.',
        ],
        [
          '– ',
          { text: 'Treating Amazon fees as just the referral fee.', bold: true },
          ' Storage, returns processing, and advertising spend routinely push the real total well above the headline referral percentage.',
        ],
        [
          '– ',
          {
            text: 'Assuming ccTLD-style "pick one channel" thinking still applies.',
            bold: true,
          },
          ' The documented 2026 pattern is running both channels for what each is structurally good at, not choosing exclusively.',
        ],
        [
          '– ',
          { text: 'Underestimating repeat-purchase economics.', bold: true },
          " Amazon's per-transaction fee structure means repeat customers don't get materially cheaper to serve the way they do on an owned DTC store with email/SMS/subscription tools.",
        ],
        [
          '– ',
          {
            text: 'Opening a physical store as a CAC fix without modeling the fixed rent cost against actual foot-traffic conversion.',
            bold: true,
          },
          ' The "rent is the new CAC" framing is directional, not a guarantee any given retail location will out-perform digital acquisition.',
        ],
      ],
    },
    {
      heading: 'Best practices',
      body: [
        [
          '– Model the *total* cost to sell on each channel — referral/transaction fees, fulfillment, storage, returns, and realistic advertising spend — not just the headline fee percentage.',
        ],
        [
          '– Calculate CAC against current 2025–2026 ad-cost benchmarks, not older, cheaper CPM/CPC assumptions.',
        ],
        [
          "– Treat Amazon as a reach/discovery channel and Shopify as a retention/repeat-purchase channel, and measure each against the metric it's actually good at.",
        ],
        [
          '– Re-evaluate category-specific margin gaps (beauty/supplements show a wider gap than other categories) before assuming a flat percentage applies to your product.',
        ],
        [
          '– Consider physical retail only after modeling fixed rent cost against a realistic foot-traffic conversion estimate, not as an automatic CAC fix.',
        ],
      ],
    },
    {
      heading: 'Key takeaways',
      body: [
        [
          "– Shopify shows a higher per-order margin than Amazon in an illustrative 2026 cost model (~$63 vs. ~$44 per $100 sale) — a directional gap, not a precise universal figure — and that gap assumes the seller can acquire traffic affordably, which 2025–2026's CAC inflation has made harder.",
        ],
        [
          "– Amazon's 2026 fee update kept referral percentages mostly flat but raised FBA fulfillment fees by an average $0.08/unit, while sub-$10 items saw their Low-Price FBA discount widen slightly (to roughly $0.86 below the standard fee, up from ~$0.77 in 2025).",
        ],
        [
          '– DTC customer acquisition cost is up 40–60% since 2023 and 222% over roughly eight years, driven by rising Google Shopping CPCs and record Meta CPMs.',
        ],
        [
          '– Physical retail is a documented 2026 response to CAC inflation ("rent is the new CAC"), though it\'s not a guaranteed fix for every brand or location.',
        ],
        [
          '– The current standard among fast-growing brands is running Amazon and Shopify together deliberately — not choosing one exclusively.',
        ],
      ],
    },
    {
      heading: 'Relevant tools.scult.in resources',
      body: [
        [
          '– ',
          { text: 'E-Commerce & Product prompts', href: '/prompts/ecommerce-product' },
          ' — for listing copy, cross-sell/upsell writing, and post-purchase sequences that support the retention side of the Shopify margin advantage discussed above.',
        ],
        [
          "If the CAC math above is pushing your brand toward investing more seriously in an owned DTC presence rather than staying Amazon-dependent, that's exactly the kind of build ",
          {
            text: "SCULT's web development team",
            href: SERVICE_WEB_DEVELOPMENT.href,
            external: true,
          },
          " works on — a Shopify store that's actually built to convert increasingly expensive traffic, not just exist as a fallback listing.",
        ],
        [
          'For a related, free starting point, try the ',
          { text: 'AI Visibility Checker', href: '/geo/ai-visibility-checker' },
          '.',
        ],
      ],
    },
  ],
  faq: [
    {
      question: 'What percentage does Amazon take from sellers?',
      answer: [
        'Referral fees commonly run 15% depending on category, with FBA fulfillment, storage, and advertising adding substantially more on top (',
        {
          text: 'Repricer',
          href: 'https://www.repricer.com/blog/amazon-seller-fees/',
          external: true,
        },
        ').',
      ],
    },
    {
      question: 'Is Shopify cheaper than Amazon for sellers?',
      answer: [
        "Per-order, yes on average — roughly $63 kept per $100 sale on Shopify vs. $44 on Amazon in one 2026 benchmark — but Shopify requires the seller to pay for their own traffic, which the raw margin comparison doesn't include (",
        {
          text: 'Eightx',
          href: 'https://eightx.co/blog/average-ecommerce-gross-margin-shopify-vs-amazon-2026',
          external: true,
        },
        ').',
      ],
    },
    {
      question: 'How much of a $100 sale does Amazon keep vs. Shopify?',
      answer: [
        'Roughly $44 kept by the seller on Amazon vs. $63 on Shopify, once all fees are counted (',
        {
          text: 'Eightx',
          href: 'https://eightx.co/blog/average-ecommerce-gross-margin-shopify-vs-amazon-2026',
          external: true,
        },
        ').',
      ],
    },
    {
      question: 'Why is customer acquisition cost so high for DTC brands now?',
      answer: [
        'CAC is up 40–60% since 2023 and 222% over roughly eight years, driven by rising Google Shopping CPCs (~33.72% in 2025) and record Meta CPMs (~$22.98 in Q4) (',
        {
          text: 'Swell',
          href: 'https://www.swell.is/content/dtc-ecommerce-statistics',
          external: true,
        },
        '; ',
        {
          text: 'L.E.K. Consulting',
          href: 'https://www.lek.com/sites/default/files/PDFs/fighting-acquisition-costs.pdf',
          external: true,
        },
        ').',
      ],
    },
    {
      question: 'Is it better to sell on Amazon or Shopify for margins?',
      answer: [
        "Shopify shows a higher per-order margin in current benchmarks, but that advantage assumes you can acquire the customer affordably — Amazon's lower per-order margin comes bundled with built-in demand/discovery.",
      ],
    },
    {
      question: 'How much do Amazon sellers actually keep per sale?',
      answer: [
        "Roughly $44 per $100 in gross terms in one 2026 benchmark, before accounting for the seller's own cost of goods (",
        {
          text: 'Eightx',
          href: 'https://eightx.co/blog/average-ecommerce-gross-margin-shopify-vs-amazon-2026',
          external: true,
        },
        ').',
      ],
    },
    {
      question: 'Why are DTC brands opening physical stores again?',
      answer: [
        'As a documented response to unsustainable paid-social CAC — physical retail functions as a fixed-cost acquisition channel, summarized in coverage as "rent is the new CAC" (',
        {
          text: 'Shopify',
          href: 'https://www.shopify.com/blog/dtc-to-brick-and-mortar',
          external: true,
        },
        ').',
      ],
    },
    {
      question: "What are Amazon's referral and FBA fees in 2026?",
      answer: [
        'Most categories remain at a 15% referral fee, with FBA fulfillment fees up an average $0.08/unit in the 2026 update. Sub-$10 items get a bigger discount relative to the standard fee than in 2025 — roughly $0.86 below standard versus ~$0.77 the year before, per third-party tracking (',
        {
          text: 'Amazon Selling Partners',
          href: 'https://sellingpartners.aboutamazon.com/update-to-u-s-referral-and-fulfillment-by-amazon-fees-for-2026',
          external: true,
        },
        '; ',
        { text: 'AMZPrep', href: 'https://amzprep.com/amazon-fba-fees/', external: true },
        ').',
      ],
    },
    {
      question: "What's the all-in cost of selling on Amazon?",
      answer: [
        "Roughly 30–45% of an item's selling price once referral, fulfillment, storage, returns, and advertising are counted (",
        {
          text: 'SentryKit',
          href: 'https://sentrykit.com/blog/amazon-seller-fba-fees-2026/',
          external: true,
        },
        ').',
      ],
    },
    {
      question:
        'How much combined market share do Amazon and Shopify have in US ecommerce?',
      answer: [
        'About 50% combined as of 2026, according to one industry report (',
        {
          text: 'Novadata',
          href: 'https://novadata.io/resources/news/amazon-shopify-50-percent-us-ecommerce-2026',
          external: true,
        },
        ').',
      ],
    },
    {
      question:
        'Why does Amazon charge a fee on every repeat purchase, unlike a DTC store?',
      answer: [
        "Because Amazon, not the brand, owns the customer relationship — every transaction runs through Amazon's marketplace and referral-fee structure regardless of whether it's a first or repeat purchase (",
        {
          text: 'Eightx',
          href: 'https://eightx.co/blog/average-ecommerce-gross-margin-shopify-vs-amazon-2026',
          external: true,
        },
        ').',
      ],
    },
    {
      question: 'Does Shopify get cheaper per customer over time?',
      answer: [
        "Yes, in principle — owning the email/SMS/loyalty relationship means repeat purchases from the same customer don't require paying full acquisition cost again, unlike Amazon's flat per-transaction fee model.",
      ],
    },
    {
      question:
        'Which product categories see the widest margin gap between Amazon and Shopify?',
      answer: [
        'Beauty/skincare shows the widest documented gap (~20% Amazon vs. ~32% Shopify contribution margin), with supplements close behind (~18% vs. ~28%) (',
        {
          text: 'Eightx',
          href: 'https://eightx.co/blog/average-ecommerce-contribution-margin-amazon-vs-shopify-2026',
          external: true,
        },
        ').',
      ],
    },
    {
      question:
        'Is "sell on Amazon or build a DTC store" still the right framing in 2026?',
      answer: [
        'Multiple sources describe the current standard as running both deliberately, rather than treating it as an either/or decision (',
        {
          text: 'Eightx',
          href: 'https://eightx.co/blog/average-ecommerce-gross-margin-shopify-vs-amazon-2026',
          external: true,
        },
        ').',
      ],
    },
    {
      question: 'How much has DTC CAC increased long-term, not just recently?',
      answer: [
        'An L.E.K. Consulting analysis puts the cumulative increase at 222% over roughly eight years (',
        {
          text: 'L.E.K. Consulting',
          href: 'https://www.lek.com/sites/default/files/PDFs/fighting-acquisition-costs.pdf',
          external: true,
        },
        ').',
      ],
    },
    {
      question: 'What drove the 2025 rise in Google Shopping costs specifically?',
      answer: [
        "Swell's roundup cites a roughly 33.72% CPC increase in 2025 without attributing a single specific cause; broader industry commentary generally points to rising advertiser competition, though a definitive single cause is evidence not sufficiently verified in the sources reviewed here.",
      ],
    },
    {
      question: 'Are Meta ad costs still the default DTC acquisition channel in 2026?',
      answer: [
        'They remain widely used, but record-high CPMs (~$22.98 in Q4 cited) are part of why brands are diversifying into channels like physical retail (',
        {
          text: 'Swell',
          href: 'https://www.swell.is/content/dtc-ecommerce-statistics',
          external: true,
        },
        ').',
      ],
    },
    {
      question: "Does opening a physical store actually lower a DTC brand's CAC?",
      answer: [
        "Coverage frames it as a strategic response with a fixed, more predictable cost structure than paid social, but results vary by location and category — this isn't a guaranteed fix for every brand.",
      ],
    },
    {
      question: "What changed specifically in Amazon's official 2026 fee update?",
      answer: [
        "Referral fee percentages mostly held flat; FBA fulfillment fees rose an average $0.08/unit per Amazon's own announcement. Sub-$10 items saw their discount relative to the standard fee widen slightly (to roughly $0.86 below standard, up from ~$0.77 in 2025), per third-party tracking (",
        {
          text: 'Amazon Selling Partners',
          href: 'https://sellingpartners.aboutamazon.com/update-to-u-s-referral-and-fulfillment-by-amazon-fees-for-2026',
          external: true,
        },
        '; ',
        { text: 'AMZPrep', href: 'https://amzprep.com/amazon-fba-fees/', external: true },
        ').',
      ],
    },
    {
      question:
        'Is the Amazon-Shopify margin gap the same across every product category?',
      answer: [
        'No — it varies notably; beauty and supplements show a wider gap than other categories in the data reviewed (',
        {
          text: 'Eightx',
          href: 'https://eightx.co/blog/average-ecommerce-contribution-margin-amazon-vs-shopify-2026',
          external: true,
        },
        ').',
      ],
    },
    {
      question: 'How do I calculate my true margin on Amazon vs. my own Shopify store?',
      answer: [
        'Add referral/transaction fees, fulfillment costs, storage, returns processing, and realistic advertising spend to your cost of goods for each channel, then compare the resulting net margin per unit rather than just the headline fee percentage.',
      ],
    },
    {
      question: 'How do I reduce customer acquisition cost as a DTC brand right now?',
      answer: [
        'Documented 2026 approaches include diversifying beyond paid social into channels like physical retail, and leaning more heavily on owned-channel retention (email, SMS, loyalty/subscription) to lower blended CAC across repeat purchases (',
        {
          text: 'Shopify',
          href: 'https://www.shopify.com/blog/dtc-to-brick-and-mortar',
          external: true,
        },
        ').',
      ],
    },
    {
      question:
        'How do I decide between Amazon and my own store for a new product launch?',
      answer: [
        'Consider Amazon first if you need built-in discovery and have limited existing audience; consider Shopify first if you already have an audience or channel (social following, email list) that can drive traffic without paying full market-rate CAC.',
      ],
    },
    {
      question:
        'How do I model whether a physical store makes sense as an acquisition channel?',
      answer: [
        "Compare the store's fixed monthly rent against a realistic estimate of the customers it would acquire and their lifetime value, rather than assuming retail is automatically cheaper than digital ads.",
      ],
    },
    {
      question:
        'How do I estimate my all-in Amazon selling cost before listing a product?',
      answer: [
        "Budget roughly 30–45% of selling price for the combined referral, FBA, storage, returns, and advertising costs as a starting estimate, then refine with your actual category's fee schedule (",
        {
          text: 'SentryKit',
          href: 'https://sentrykit.com/blog/amazon-seller-fba-fees-2026/',
          external: true,
        },
        ').',
      ],
    },
    {
      question: 'How do I take advantage of the 2026 sub-$10 FBA discount?',
      answer: [
        'If you sell low-priced items, recheck your fulfillment cost assumptions against the updated 2026 schedule — the Low-Price FBA discount widened slightly (to roughly $0.86 below the standard fee), which can meaningfully change unit economics for that price tier (',
        { text: 'AMZPrep', href: 'https://amzprep.com/amazon-fba-fees/', external: true },
        ').',
      ],
    },
    {
      question:
        'How do I run both Amazon and Shopify without the two channels cannibalizing each other?',
      answer: [
        'Many brands differentiate SKUs, bundles, or pricing slightly between channels, and use Amazon primarily for new-customer discovery while directing loyalty/subscription offers toward the owned Shopify store.',
      ],
    },
    {
      question: 'How do I set a realistic CAC budget for a Shopify launch in 2026?',
      answer: [
        'Use current CPC/CPM benchmarks (Google Shopping CPCs up ~33.72% in 2025; Meta CPMs around $22.98 in Q4) as your baseline rather than pre-2023 cost assumptions, which are now significantly out of date (',
        {
          text: 'Swell',
          href: 'https://www.swell.is/content/dtc-ecommerce-statistics',
          external: true,
        },
        ').',
      ],
    },
    {
      question: 'How do I improve repeat-purchase economics on Shopify specifically?',
      answer: [
        "Invest in email/SMS retention flows and subscription options, which is the mechanism the margin research attributes to Shopify's better long-run per-customer economics (",
        {
          text: 'Eightx',
          href: 'https://eightx.co/blog/average-ecommerce-gross-margin-shopify-vs-amazon-2026',
          external: true,
        },
        ').',
      ],
    },
    {
      question:
        'How do I choose which product categories to prioritize on Shopify vs. Amazon?',
      answer: [
        'Light, high-margin categories like beauty and supplements show the widest documented margin advantage on Shopify — those are reasonable candidates to prioritize for the owned-store channel specifically (',
        {
          text: 'Eightx',
          href: 'https://eightx.co/blog/average-ecommerce-contribution-margin-amazon-vs-shopify-2026',
          external: true,
        },
        ').',
      ],
    },
    {
      question:
        "What's a more advanced way to think about blended CAC across both channels?",
      answer: [
        'Calculate CAC per channel separately, since Amazon\'s "acquisition cost" is largely embedded in advertising-to-stay-visible spend, while Shopify\'s is external ad spend plus platform fees — blending them into one number can obscure which channel is actually more efficient for your specific product.',
      ],
    },
    {
      question:
        'Does contribution margin analysis change if a brand uses 3PL fulfillment instead of Amazon FBA for its own store?',
      answer: [
        "Yes — a brand using its own 3PL for Shopify orders has a different, often more controllable cost structure than Amazon's fixed FBA fee schedule, though specific 3PL cost comparisons weren't covered in the sources reviewed for this article.",
      ],
    },
    {
      question:
        'How should a brand model the long-term (multi-year) unit economics of a DTC subscription program?',
      answer: [
        "Subscription programs shift the economics from single-transaction margin to lifetime-value math — a lower first-order margin can still be profitable if the subscription's retention rate is high enough, though specific retention benchmarks weren't independently verified in this research pass.",
      ],
    },
    {
      question:
        'Is there a documented ceiling on how high DTC CAC can rise before the channel becomes structurally unviable?',
      answer: [
        'No specific ceiling figure was found in the sources reviewed — this is evidence not sufficiently verified, and should not be treated as an established threshold.',
      ],
    },
    {
      question:
        'How are enterprise-scale brands responding differently to CAC inflation than small DTC brands?',
      answer: [
        'The sources reviewed describe physical retail expansion as a response used across brand sizes, but detailed enterprise-vs-small-brand comparative data on CAC response strategy was not found in this research pass.',
      ],
    },
    {
      question: 'Amazon FBA vs. Shopify — which has the better profit margin?',
      answer: [
        "Shopify shows a higher average per-order margin in 2026 benchmarks (~$63 vs. ~$44 per $100 sale), but that comparison excludes the seller's own cost of acquiring traffic to the Shopify store (",
        {
          text: 'Eightx',
          href: 'https://eightx.co/blog/average-ecommerce-gross-margin-shopify-vs-amazon-2026',
          external: true,
        },
        ').',
      ],
    },
    {
      question: 'Amazon referral fee vs. Shopify transaction fee — which costs more?',
      answer: [
        "Amazon's referral fee (commonly 15%) applies indefinitely per transaction; Shopify's transaction fee is typically limited to payment processing (0% extra with Shopify Payments, 0.5–2% extra with third-party gateways) — a fundamentally different cost structure, not a like-for-like comparison.",
      ],
    },
    {
      question: 'DTC vs. marketplace selling — which has better long-term economics?',
      answer: [
        'DTC/Shopify shows better long-term repeat-purchase economics due to owned customer relationships; marketplace/Amazon offers built-in demand at the cost of both margin and customer ownership — the better fit depends on whether a brand can generate its own traffic affordably.',
      ],
    },
    {
      question:
        'Is running both Amazon and Shopify actually better than choosing one exclusively?',
      answer: [
        'Multiple 2026 sources describe dual-channel operation as the pattern among the fastest-growing brands, using Amazon for reach and Shopify for owned-relationship margin (',
        {
          text: 'Eightx',
          href: 'https://eightx.co/blog/average-ecommerce-gross-margin-shopify-vs-amazon-2026',
          external: true,
        },
        ').',
      ],
    },
    {
      question:
        'Physical retail vs. paid social — which is the cheaper acquisition channel in 2026?',
      answer: [
        "Coverage frames physical retail as increasingly competitive against paid social specifically because paid-social costs (Meta CPMs, Google Shopping CPCs) have risen so sharply, though the actual cheaper option depends on a brand's specific rent, location, and traffic conversion — not a universal rule (",
        {
          text: 'Shopify',
          href: 'https://www.shopify.com/blog/dtc-to-brick-and-mortar',
          external: true,
        },
        '; ',
        {
          text: 'Swell',
          href: 'https://www.swell.is/content/dtc-ecommerce-statistics',
          external: true,
        },
        ').',
      ],
    },
    {
      question:
        "My Amazon margins keep shrinking even though referral fees didn't change — why?",
      answer: [
        'Check FBA fulfillment fee changes (up an average $0.08/unit in the 2026 update) and rising advertising costs needed to maintain visibility — both can erode margin even with flat referral percentages (',
        {
          text: 'Amazon Selling Partners',
          href: 'https://sellingpartners.aboutamazon.com/update-to-u-s-referral-and-fulfillment-by-amazon-fees-for-2026',
          external: true,
        },
        ').',
      ],
    },
    {
      question:
        "My Shopify CAC has doubled but my margin per order looks the same — what's going on?",
      answer: [
        'The per-order margin calculation typically excludes acquisition cost; rising CAC (up 40–60% since 2023 per industry data) erodes true profitability even when gross margin per unit stays flat (',
        {
          text: 'Swell',
          href: 'https://www.swell.is/content/dtc-ecommerce-statistics',
          external: true,
        },
        ').',
      ],
    },
    {
      question:
        "I opened a physical store to reduce CAC but it isn't converting — what should I check?",
      answer: [
        'Revisit the foot-traffic-to-customer conversion assumption behind the decision; "rent is the new CAC" is a documented industry pattern, not a guarantee for every location or category (',
        {
          text: 'Shopify',
          href: 'https://www.shopify.com/blog/dtc-to-brick-and-mortar',
          external: true,
        },
        ').',
      ],
    },
    {
      question:
        'My product sells well on Amazon but poorly on my Shopify store — why the mismatch?',
      answer: [
        "Amazon supplies built-in discovery traffic that a new Shopify store doesn't have by default; without a comparable traffic source (existing audience, ads, SEO), a Shopify store can underperform even with a better margin structure.",
      ],
    },
    {
      question:
        "I switched a low-cost item's fulfillment plan after the 2026 FBA update but margins didn't improve as expected — why?",
      answer: [
        'Confirm you actually qualify for the Low-Price FBA discount tier and check whether other fee categories (storage, returns, the base $0.08/unit fulfillment increase) offset the sub-$10 discount (',
        {
          text: 'Amazon Selling Partners',
          href: 'https://sellingpartners.aboutamazon.com/update-to-u-s-referral-and-fulfillment-by-amazon-fees-for-2026',
          external: true,
        },
        ').',
      ],
    },
    {
      question:
        "Is it worth paying for a Shopify store build if I'm already profitable on Amazon?",
      answer: [
        "Worth considering if you want to capture repeat-purchase margin and reduce platform dependency — the 2026 data suggests Shopify's advantage compounds specifically on repeat customers, which Amazon-only sellers can't access.",
      ],
    },
    {
      question: 'Should a new brand start on Amazon, Shopify, or both simultaneously?',
      answer: [
        'The documented 2026 pattern among fast-growing brands is running both from early on rather than sequencing them, using Amazon for discovery and Shopify for retention (',
        {
          text: 'Eightx',
          href: 'https://eightx.co/blog/average-ecommerce-gross-margin-shopify-vs-amazon-2026',
          external: true,
        },
        ').',
      ],
    },
    {
      question:
        'Is investing in a Shopify store build worth it given current CAC levels?',
      answer: [
        "It depends on whether the brand has (or can build) a traffic source that isn't purely paid social — an existing audience, strong SEO, or email list changes the CAC math substantially versus starting from zero.",
      ],
    },
    {
      question:
        'What questions should I ask before committing budget to a physical retail acquisition strategy?',
      answer: [
        'Ask what specific foot-traffic-to-customer conversion rate the location needs to hit to beat current digital CAC, and whether that rate is realistic for the category and location — not just whether "brands are doing this now."',
      ],
    },
    {
      question:
        'Is it worth a conversation with a web development team before building or rebuilding a Shopify DTC presence?',
      answer: [
        'If the shift toward owned-channel economics described here is relevant to your brand, a properly built store (fast, conversion-optimized, integrated with retention tooling) matters more now than when Shopify traffic was cheaper to acquire — a poorly built store wastes increasingly expensive traffic.',
      ],
    },
  ],
  sources: [
    'https://eightx.co/blog/average-ecommerce-gross-margin-shopify-vs-amazon-2026',
    'https://eightx.co/blog/average-ecommerce-contribution-margin-amazon-vs-shopify-2026',
    'https://www.repricer.com/blog/amazon-seller-fees/',
    'https://sellingpartners.aboutamazon.com/update-to-u-s-referral-and-fulfillment-by-amazon-fees-for-2026',
    'https://novadata.io/resources/news/amazon-shopify-50-percent-us-ecommerce-2026',
    'https://www.swell.is/content/dtc-ecommerce-statistics',
    'https://www.lek.com/sites/default/files/PDFs/fighting-acquisition-costs.pdf',
    'https://www.shopify.com/blog/dtc-to-brick-and-mortar',
    'https://feedvisor.com/university/referral-fee/',
    'https://sentrykit.com/blog/amazon-seller-fba-fees-2026/',
    'https://amzprep.com/amazon-fba-fees/',
  ],
  relatedTools: ['ai-visibility-checker'],
  relatedPrompts: [],
  serviceTarget: 'web-development',
  updatedAt: '2026-08-21',
  readingMinutes: 17,
}
