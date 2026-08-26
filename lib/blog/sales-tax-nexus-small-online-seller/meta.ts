import type { BlogPost } from '../types'

const SLUG = 'sales-tax-nexus-small-online-seller'

/**
 * Generated from content-engine/05-drafts/article_070.md by
 * content-engine/generate-meta-files.js — every claim, source, and link was
 * written and fact-checked by the content-engine research/production
 * pipeline (see content-engine/06-verification for the per-article report),
 * not invented at conversion time.
 */
export const meta: BlogPost = {
  slug: SLUG,
  pillar: 'playbook',
  title: 'What Sales Tax Nexus Actually Means for a Small Online Seller',
  h1: 'What "Sales Tax Nexus" Actually Means for a Small Online Seller',
  targetKeyword: 'sales tax nexus small online seller',
  description:
    'A practical breakdown of physical vs. economic nexus, what triggers it, and how small Etsy, Shopify, and Amazon FBA sellers figure out where they owe sales tax.',
  dek: "Sales tax nexus is a sufficient legal connection between your business and a state that obligates you to collect and remit that state's sales tax. It comes in two forms: physical nexus (an office, staff, or inventory — including in an Amazon FBA warehouse — physically located in a state) and economic nexus (crossing a state-set dollar or transaction-count sales threshold with no physical presence required, following the 2018 *South Dakota v. Wayfair* Supreme Court ruling). As of mid-2026, 46 states publish an economic nexus dollar threshold, with $100,000 in sales being the most common trigger, though several states use higher thresholds or add a transaction-count test — and no single seller-friendly summary substitutes for checking each state's specific current rule.",
  sections: [
    {
      heading: 'What sales tax nexus actually is',
      body: [
        [
          "Sales tax nexus is the legal term for the connection between a business and a state that's substantial enough to obligate the business to register with that state, collect sales tax from customers there, and remit it to the state's tax authority (",
          {
            text: 'taxjar.com/sales-tax/nexus',
            href: 'https://www.taxjar.com/sales-tax/nexus',
            external: true,
          },
          "). It's a foundational concept because everything downstream — whether you need to register, whether you need to charge tax on an invoice, whether you owe back taxes for past sales — depends on first establishing whether nexus exists in a given state.",
        ],
        [
          'Critically, nexus is evaluated ',
          { text: 'state by state, independently', bold: true },
          " — there is no single national nexus test. Each state sets its own rules, its own thresholds, and its own definitions of what counts, which means a seller can have nexus in a handful of states and none in others, and the specific combination is unique to that seller's actual footprint and sales pattern (",
          {
            text: 'taxjar.com/sales-tax/nexus',
            href: 'https://www.taxjar.com/sales-tax/nexus',
            external: true,
          },
          ').',
        ],
      ],
    },
    {
      heading: 'Physical nexus: what creates it',
      body: [
        [
          'Physical nexus is the older, more intuitive form: a tangible, physical connection between your business and a state. Cited nexus-creating activities include:',
        ],
        [
          '– ',
          { text: 'An office or place of business', bold: true },
          ' located in the state.',
        ],
        [
          '– ',
          { text: 'Employees or staff', bold: true },
          ' working in the state — including remote employees, which is a real and actively discussed concern among small SaaS founders specifically, per a dedicated "Ask HN: Hiring Remotely and US Tax Nexuses" discussion thread (',
          {
            text: 'hn.algolia.com',
            href: 'https://hn.algolia.com/api/v1/search?query=sales%20tax%20nexus',
            external: true,
          },
          ').',
        ],
        [
          '– ',
          { text: 'Inventory stored in the state', bold: true },
          ' — explicitly including inventory held in third-party fulfillment centers, such as an Amazon FBA warehouse (',
          {
            text: 'taxjar.com/sales-tax/nexus',
            href: 'https://www.taxjar.com/sales-tax/nexus',
            external: true,
          },
          ').',
        ],
        [
          '– ',
          { text: 'Temporary physical presence', bold: true },
          ', such as attending a trade show or craft fair in the state.',
        ],
        [
          '– ',
          { text: 'Third-party affiliates', bold: true },
          ' operating on your behalf in the state.',
        ],
        [
          "The Amazon FBA point deserves emphasis because it catches many small sellers by surprise: using FBA means Amazon may move your inventory between its own fulfillment centers across multiple states as part of its normal logistics operations, without you directly choosing which warehouses hold your stock at any given time. That means an FBA seller can develop physical nexus in states they never deliberately chose to have a presence in, simply because Amazon's fulfillment network placed inventory there — a genuinely counterintuitive trap for anyone assuming nexus only follows from decisions they made directly.",
        ],
      ],
    },
    {
      heading: 'Economic nexus: the Wayfair-era rule',
      body: [
        [
          "Economic nexus is the newer, and for most online-only sellers, more relevant form of nexus — and it has no physical-presence requirement at all. It's triggered purely by crossing a state-set threshold of sales volume, sales dollar amount, or transaction count into that state, regardless of whether you have any physical footprint there whatsoever (",
          {
            text: 'taxjar.com/sales-tax/nexus',
            href: 'https://www.taxjar.com/sales-tax/nexus',
            external: true,
          },
          ').',
        ],
        [
          "This concept exists because of the 2018 US Supreme Court ruling in *South Dakota v. Wayfair, Inc.*, which overturned the prior physical-presence-only standard and allowed states to require out-of-state sellers to collect sales tax based purely on economic activity within the state. Every state that has since adopted an economic nexus law sets its own specific threshold and rules independently — there's no single federal standard threshold that applies uniformly nationwide.",
        ],
      ],
    },
    {
      heading: 'Current 2026 state thresholds',
      body: [
        ['As of the available 2026 data, the landscape looks like this:'],
        [
          '– ',
          { text: '46 states', bold: true },
          ' publish a sales-tax economic nexus dollar threshold for remote sellers (the remainder either have no general sales tax or handle nexus differently).',
        ],
        [
          '– ',
          { text: '41 of those states', bold: true },
          ' use the common ',
          { text: '$100,000', bold: true },
          ' in sales as the dollar threshold.',
        ],
        [
          '– ',
          { text: '2 states use $250,000', bold: true },
          ' (Alabama and Mississippi).',
        ],
        [
          '– ',
          { text: '3 states use $500,000', bold: true },
          ' (California, Texas, and New York).',
        ],
        [
          '– ',
          { text: '18 jurisdictions', bold: true },
          ' still maintain an additional ',
          { text: '200-transaction test', bold: true },
          ' alongside (or as an alternative to) the dollar threshold — meaning a seller with many small, low-average-order-value transactions can trip economic nexus in these states well before reaching six figures in actual revenue.',
        ],
        [
          '– Some states are actively ',
          { text: 'removing', bold: true },
          ' the transaction-count test: ',
          { text: 'Alaska', bold: true },
          ' repealed its 200-transaction threshold effective January 1, 2025, and ',
          { text: 'Illinois', bold: true },
          ' removed its 200-transaction threshold effective January 1, 2026 — both moving toward dollar-threshold-only nexus rules.',
        ],
        [
          '– ',
          { text: 'New York and Connecticut', bold: true },
          ' use a combined ',
          { text: '"AND" test', bold: true },
          ' rather than an "or" test: New York requires ',
          { text: 'both', bold: true },
          ' $500,000 in sales ',
          { text: 'and', bold: true },
          ' 100 transactions before nexus triggers; Connecticut requires ',
          { text: 'both', bold: true },
          ' $100,000 ',
          { text: 'and', bold: true },
          ' 200 transactions (',
          {
            text: 'taxcloud.com',
            href: 'https://taxcloud.com/blog/sales-tax-nexus-by-state/',
            external: true,
          },
          '; ',
          {
            text: 'numeral.com',
            href: 'https://www.numeral.com/blog/economic-nexus',
            external: true,
          },
          '; ',
          { text: 'nexusbystate.com', href: 'https://nexusbystate.com/', external: true },
          ').',
        ],
        [
          'The practical takeaway from this state-by-state variation is that a seller genuinely cannot rely on a single rule of thumb like "I don\'t owe tax anywhere until I hit $100k total" — a low-average-order-value seller doing high transaction volume in a state with a 200-transaction test could trip nexus at a small fraction of that revenue figure in that specific state, while a seller concentrated in California, Texas, or New York has a materially higher dollar bar to clear there specifically.',
        ],
      ],
    },
    {
      heading: 'Amazon FBA and marketplace-specific nexus issues',
      body: [
        [
          'Beyond the general physical-nexus-via-warehoused-inventory issue described above, Amazon FBA sellers face an additional layer of complexity worth being aware of: many states have since passed ',
          { text: 'marketplace facilitator laws', bold: true },
          ", which shift the actual tax *collection and remittance* obligation onto the marketplace itself (Amazon, Etsy, etc.) for sales made through that marketplace, rather than requiring the individual seller to collect and remit directly for those specific transactions. This doesn't eliminate nexus considerations entirely — a seller can still have nexus-relevant obligations for sales made outside the marketplace (their own website, other channels) even while the marketplace handles collection for in-marketplace sales — but it does meaningfully change the practical, day-to-day compliance burden compared to the pre-marketplace-facilitator-law landscape that existed when FBA-related nexus concerns first became a major small-seller pain point.",
        ],
      ],
    },
    {
      heading: 'Do marketplaces like Shopify or Etsy collect tax for you automatically?',
      body: [
        [
          'This is a genuinely common point of confusion, and the honest answer is: ',
          {
            text: 'it depends on the platform, the specific transaction, and increasingly, on marketplace facilitator laws — not something a seller should assume without checking.',
            bold: true,
          },
          ' Shopify, as a platform you host your own store on, provides tax calculation and collection tools, but the underlying responsibility for correctly configuring nexus-based tax collection across the states where you actually have nexus generally remains with the seller, unlike a full marketplace facilitator arrangement. Etsy and Amazon, as true third-party marketplaces, are more likely to be covered by marketplace facilitator laws for sales made specifically through their platform, shifting the collection obligation onto them.',
        ],
        [
          "The practical, actionable step for any seller is not to assume either way — check each platform's current, specific documentation on how it handles sales tax collection for your specific seller setup, and use a dedicated nexus-tracking tool or resource (like TaxJar, cited as a primary source for this article, or Avalara — both repeatedly cited by sellers and SaaS founders as tools used to track nexus and manage remittance) to check your own current nexus footprint directly, since automatic collection on one channel doesn't automatically mean you're covered everywhere you sell (",
          {
            text: 'taxjar.com/sales-tax/nexus',
            href: 'https://www.taxjar.com/sales-tax/nexus',
            external: true,
          },
          '; ',
          {
            text: 'hn.algolia.com',
            href: 'https://hn.algolia.com/api/v1/search?query=sales%20tax%20nexus',
            external: true,
          },
          ').',
        ],
      ],
    },
    {
      heading: 'Practical examples',
      body: [
        [
          {
            text: 'A small Etsy jewelry shop scaling past $100k in a single state.',
            bold: true,
          },
          " If most sales flow through Etsy and Etsy's marketplace-facilitator arrangement handles collection for those in-marketplace sales, the seller's direct compliance burden may be lighter than a similarly-sized seller running their own Shopify store — but the seller should still verify this is actually the case for their specific situation, and check whether any non-Etsy sales channels exist that wouldn't be covered.",
        ],
        [
          {
            text: 'An Amazon FBA seller whose inventory gets distributed to warehouses in five states.',
            bold: true,
          },
          ' Even without ever visiting those states, opening an office there, or hiring anyone there, this seller may have physical nexus in each of those five states purely because their inventory is physically stored there — a real, documented trap distinct from economic nexus entirely.',
        ],
        [
          { text: 'Illustrative example (hypothetical, for clarity).', bold: true },
          " Imagine a small candle-making business selling primarily through its own Shopify store, doing $80,000 in California sales but with 15,000 individual low-dollar transactions. Since California's economic nexus threshold is $500,000 with no separate transaction-count test cited in the sources above, this seller would not trigger California economic nexus on revenue alone at that sales level — illustrating why understanding your specific state's exact threshold structure (dollar-only vs. combined dollar-and-transaction) matters more than a rough revenue estimate.",
        ],
      ],
    },
    {
      heading: 'Data and evidence',
      body: [
        [
          '– As of 2026-08-04, 46 states publish a sales-tax economic nexus dollar threshold for remote sellers; 41 use the common $100,000 threshold, 2 use $250,000 (Alabama, Mississippi), and 3 use $500,000 (California, Texas, New York) (',
          {
            text: 'taxcloud.com',
            href: 'https://taxcloud.com/blog/sales-tax-nexus-by-state/',
            external: true,
          },
          '; ',
          {
            text: 'numeral.com',
            href: 'https://www.numeral.com/blog/economic-nexus',
            external: true,
          },
          ').',
        ],
        [
          '– 18 jurisdictions still maintain a 200-transaction test; Alaska repealed its 200-transaction threshold effective January 1, 2025, and Illinois removed its 200-transaction threshold effective January 1, 2026 (',
          {
            text: 'taxcloud.com',
            href: 'https://taxcloud.com/blog/sales-tax-nexus-by-state/',
            external: true,
          },
          ').',
        ],
        [
          '– New York and Connecticut use combined "AND" tests: New York requires $500,000 AND 100 transactions; Connecticut requires $100,000 AND 200 transactions (',
          { text: 'nexusbystate.com', href: 'https://nexusbystate.com/', external: true },
          ').',
        ],
        [
          '– Economic nexus exists because of the 2018 US Supreme Court ruling in *South Dakota v. Wayfair, Inc.*, which removed the prior physical-presence-only requirement (',
          {
            text: 'taxjar.com/sales-tax/nexus',
            href: 'https://www.taxjar.com/sales-tax/nexus',
            external: true,
          },
          ').',
        ],
        [
          '– Inventory storage, including via third-party fulfillment centers like Amazon FBA, is explicitly listed among nexus-creating activities (',
          {
            text: 'taxjar.com/sales-tax/nexus',
            href: 'https://www.taxjar.com/sales-tax/nexus',
            external: true,
          },
          ').',
        ],
        [
          '– A dedicated "Ask HN" thread on handling VAT/sales tax accounting as a B2C SaaS drew 97 points and 86 comments — real, substantial evidence of how heavily-discussed and painful this issue is for small SaaS founders specifically (',
          {
            text: 'hn.algolia.com',
            href: 'https://hn.algolia.com/api/v1/search?query=sales%20tax%20nexus',
            external: true,
          },
          ').',
        ],
        [
          '– A separate HN post titled "Selling a B2B SaaS product in the U.S as a U.K company – A tax nightmare?" reflects real, documented founder pain around cross-border US sales tax compliance specifically (',
          {
            text: 'hn.algolia.com',
            href: 'https://hn.algolia.com/api/v1/search?query=sales%20tax%20nexus',
            external: true,
          },
          ').',
        ],
        [
          '– A New Jersey bill was proposed to eliminate the transaction-count nexus requirement for sales and corporate business tax, reflecting active legislative efforts to simplify nexus rules in at least some states (',
          {
            text: 'hn.algolia.com',
            href: 'https://hn.algolia.com/api/v1/search?query=sales%20tax%20nexus',
            external: true,
          },
          ').',
        ],
      ],
    },
    {
      heading: 'Comparisons',
      body: [
        [
          { text: 'Economic nexus vs. physical nexus.', bold: true },
          ' Physical nexus requires a tangible presence (office, staff, inventory) in a state; economic nexus requires no physical presence at all and is triggered purely by crossing a state-set sales threshold. A seller can have either, both, or neither in any given state, and each must be checked independently.',
        ],
        [
          { text: 'TaxJar vs. Avalara.', bold: true },
          " Both are repeatedly cited as tools small sellers and SaaS founders actually use to track nexus exposure and manage tax remittance across states; the available sourced material doesn't include a detailed, independently verified feature-by-feature comparison between the two — evidence not sufficiently verified beyond both being commonly cited as real, in-use tools for this purpose.",
        ],
        [
          { text: 'Origin-based vs. destination-based taxation.', bold: true },
          " States differ on this basis, which changes how a remote seller calculates the tax rate to charge: origin-based taxation applies the seller's location's rate, while destination-based taxation applies the buyer's location's rate — a distinction that matters once nexus is established in a state and you need to actually calculate the correct tax rate to charge.",
        ],
      ],
    },
    {
      heading: 'Real-world use cases',
      body: [
        [
          '– ',
          { text: 'Etsy and Amazon marketplace sellers', bold: true },
          ' relying partly on marketplace facilitator laws to handle collection for in-marketplace sales, while still needing to track their own nexus footprint for any sales made through other channels.',
        ],
        [
          '– ',
          { text: 'Shopify store owners', bold: true },
          " who need to actively configure and manage tax collection themselves across every state where they've established nexus, rather than assuming platform-level automation covers this by default.",
        ],
        [
          '– ',
          { text: 'Amazon FBA sellers', bold: true },
          ' specifically needing to track which states their inventory has been distributed to, since this can create physical nexus independent of and in addition to economic nexus from sales volume.',
        ],
        [
          '– ',
          {
            text: 'Small SaaS founders selling B2C or B2B software to US customers',
            bold: true,
          },
          ", who face the same underlying nexus concepts applied to digital products and services, with the added complication of cross-border compliance if the company itself isn't US-based.",
        ],
      ],
    },
    {
      heading: 'Common mistakes',
      body: [
        [
          '– ',
          {
            text: 'Assuming nexus is a single national rule rather than 46+ independent state-specific determinations.',
            bold: true,
          },
          " Each state's threshold, transaction-count rule, and definitions are set independently.",
        ],
        [
          '– ',
          {
            text: 'Assuming a single revenue figure ("once I hit $X total") determines nexus everywhere.',
            bold: true,
          },
          " Nexus thresholds are evaluated per state, against that state's specific dollar and/or transaction-count threshold — not against your total nationwide revenue.",
        ],
        [
          '– ',
          {
            text: 'Not accounting for Amazon FBA inventory distribution as a source of physical nexus.',
            bold: true,
          },
          " Sellers can develop nexus in states they never chose to have a presence in, simply because of Amazon's fulfillment logistics.",
        ],
        [
          '– ',
          {
            text: "Assuming a marketplace's tax collection covers all of your sales.",
            bold: true,
          },
          ' Marketplace facilitator laws typically cover sales made through that specific marketplace — not necessarily sales made through your own website or other channels.',
        ],
        [
          '– ',
          {
            text: 'Ignoring remote-employee locations as a potential nexus trigger.',
            bold: true,
          },
          ' Hiring a remote employee in a new state is a real, actively discussed nexus concern, not just an inventory or sales-volume issue.',
        ],
        [
          '– ',
          {
            text: 'Not re-checking thresholds after a state changes its rules.',
            bold: true,
          },
          ' States actively update these rules — Alaska and Illinois both recently removed their transaction-count tests — so a rule you checked a year ago may no longer be current.',
        ],
      ],
    },
    {
      heading: 'Best practices',
      body: [
        [
          "– Check each state's current, specific nexus rules directly (or via a dedicated nexus-tracking tool) rather than relying on a single blanket revenue threshold assumption.",
        ],
        [
          '– Track where your inventory physically sits if you use Amazon FBA or any third-party fulfillment service, since this can create nexus independent of your sales volume.',
        ],
        [
          '– Confirm directly whether your sales channels (marketplace vs. your own website) are covered by marketplace facilitator laws, rather than assuming uniform coverage across every channel you sell through.',
        ],
        [
          '– Factor remote employee locations into your nexus review, not just inventory and sales volume.',
        ],
        [
          '– Re-check your nexus footprint periodically, since state thresholds and rules change — recent examples include Alaska and Illinois removing their transaction-count tests.',
        ],
        [
          '– Use a nexus-tracking tool (such as TaxJar or Avalara) to get an ongoing, automated read on where you may have crossed a threshold, rather than relying on a one-time manual check.',
        ],
        [
          "– If you're a non-US company selling into the US, budget extra time and possibly professional help for this specifically — it's a well-documented pain point in founder communities, distinct from the compliance burden a US-based seller faces.",
        ],
      ],
    },
    {
      heading: 'Key takeaways',
      body: [
        [
          "– Nexus is evaluated state by state independently — there's no single national threshold, and a seller can have nexus in some states and not others based on their specific footprint.",
        ],
        [
          "– Physical nexus (office, staff, or stored inventory — including in an Amazon FBA warehouse) requires no sales-volume threshold at all; it's triggered by physical presence alone.",
        ],
        [
          '– Economic nexus, established after the 2018 *South Dakota v. Wayfair* ruling, is triggered by crossing a state-set sales threshold — commonly $100,000, though some states use $250,000, $500,000, or a combined dollar-and-transaction "AND" test.',
        ],
        [
          "– Amazon FBA sellers face a distinct, often-overlooked risk: Amazon's own fulfillment logistics can create physical nexus in states a seller never deliberately chose to have a presence in.",
        ],
        [
          "– Marketplace facilitator laws shift collection responsibility onto marketplaces like Amazon and Etsy for in-marketplace sales, but this doesn't necessarily cover sales made through your own website or other channels.",
        ],
      ],
    },
    {
      heading: 'Relevant tools.scult.in resources',
      body: [
        [
          "Once you've determined where you actually owe sales tax, producing clean, correctly itemized invoices matters — the ",
          { text: 'Invoice Generator', href: '/business/invoice-generator' },
          " on tools.scult.in is a quick way to create professional invoices for your sales. If you're building out product listings, review responses, or other customer-facing ecommerce copy alongside getting your tax compliance in order, the ",
          {
            text: 'E-Commerce & Product prompt library',
            href: '/prompts/ecommerce-product',
          },
          ' on tools.scult.in has practical prompts scoped to real marketplace and storefront constraints.',
        ],
      ],
    },
  ],
  faq: [
    {
      question: 'What is sales tax nexus?',
      answer: [
        "A sufficient connection between a business and a state that legally obligates the business to collect and remit that state's sales tax.",
      ],
    },
    {
      question: "What's the difference between physical nexus and economic nexus?",
      answer: [
        'Physical nexus comes from tangible presence (office, staff, warehouse); economic nexus comes from crossing a state-set sales threshold, with no physical presence required.',
      ],
    },
    {
      question: 'Does storing inventory in an Amazon FBA warehouse create nexus?',
      answer: [
        'Yes — inventory storage, including via third-party fulfillment centers like Amazon FBA, is explicitly listed as a nexus-creating activity.',
      ],
    },
    {
      question: 'Do nexus thresholds differ from state to state?',
      answer: [
        "Yes — each state sets its own nexus rules and thresholds independently; there's no single national standard.",
      ],
    },
    {
      question: 'How do I figure out which states I owe sales tax in?',
      answer: [
        "Check each state taxing authority's site directly, or use an automation/tracking dashboard like TaxJar that flags where nexus exists versus where tax is currently being collected.",
      ],
    },
    {
      question: 'How do small SaaS founders actually handle sales tax day to day?',
      answer: [
        "It's a heavily discussed, real pain point — a dedicated Ask HN thread on B2C SaaS VAT/sales tax accounting drew 97 points and 86 comments.",
      ],
    },
    {
      question: 'Does hiring a remote employee in another state create nexus there?',
      answer: [
        'Founders treat employee location as a real nexus trigger to actively worry about, per a dedicated Ask HN discussion on hiring remotely and US tax nexuses.',
      ],
    },
    {
      question: 'Do trade shows or craft fairs create nexus?',
      answer: [
        'Yes — temporary physical presence such as attending a trade show or craft fair is listed as a nexus-creating activity.',
      ],
    },
    {
      question: 'Can having affiliates in a state create nexus?',
      answer: [
        'Yes — third-party affiliates operating in a state are listed among nexus-creating activities.',
      ],
    },
    {
      question:
        'Is selling a US-facing SaaS product from a non-US company a tax problem?',
      answer: [
        'Founders describe it as a real, documented headache — one HN post is titled "Selling a B2B SaaS product in the U.S as a U.K company – A tax nightmare?"',
      ],
    },
    {
      question:
        'What tools do small businesses actually use to manage multi-state sales tax?',
      answer: [
        'TaxJar and Avalara are the platforms most commonly cited by sellers and SaaS founders for nexus tracking and remittance.',
      ],
    },
    {
      question: 'Are there active efforts to simplify nexus rules?',
      answer: [
        'Yes — for example, a New Jersey bill was proposed to eliminate the transaction-count nexus requirement for sales and corporate business tax.',
      ],
    },
    {
      question:
        'Does origin-based vs. destination-based taxation matter for remote sellers?',
      answer: [
        'Yes — states differ on this basis, which changes how a remote seller must calculate the tax rate to charge once nexus is established.',
      ],
    },
    {
      question: 'What is economic nexus, specifically?',
      answer: [
        'A form of nexus triggered purely by crossing a state-set dollar or transaction-count sales threshold, with no physical presence in the state required.',
      ],
    },
    {
      question: 'What is the most common economic nexus dollar threshold across states?',
      answer: [
        '$100,000 in sales, used by 41 of the 46 states that publish a threshold as of the available 2026 data.',
      ],
    },
    {
      question: 'Which states use a higher-than-$100,000 economic nexus threshold?',
      answer: [
        'Alabama and Mississippi use $250,000; California, Texas, and New York use $500,000.',
      ],
    },
    {
      question: 'Which states still use a 200-transaction test?',
      answer: [
        '18 jurisdictions still maintain a transaction-count test as of the available 2026 data; check current state-specific rules directly since some states have recently removed theirs.',
      ],
    },
    {
      question: 'Which states have removed their 200-transaction threshold recently?',
      answer: [
        'Alaska (effective January 1, 2025) and Illinois (effective January 1, 2026) have both removed their transaction-count thresholds.',
      ],
    },
    {
      question: 'What is South Dakota v. Wayfair, and why does it matter?',
      answer: [
        "It's the 2018 US Supreme Court ruling that removed the prior physical-presence-only requirement for sales tax collection, enabling states to adopt economic nexus laws based on sales activity alone.",
      ],
    },
    {
      question:
        'Do New York and Connecticut use a different kind of nexus test than most states?',
      answer: [
        'Yes — both use a combined "AND" test requiring both a dollar threshold and a transaction-count threshold, rather than either/or.',
      ],
    },
    {
      question: 'How do I register for a sales tax permit in a state where I have nexus?',
      answer: [
        "Register directly through that state's department of revenue (or equivalent taxing authority) website — the specific process varies by state, so check the current instructions on that state's official site.",
      ],
    },
    {
      question: 'How do I determine if I have sales tax nexus in a specific state?',
      answer: [
        "Check whether you have any physical presence there (office, staff, stored inventory) or have crossed that state's specific economic nexus dollar/transaction threshold.",
      ],
    },
    {
      question: 'How do I calculate economic nexus thresholds by state?',
      answer: [
        "Track your total sales revenue and transaction count per state against that state's specific published threshold — a nexus-tracking tool can automate this across all states simultaneously.",
      ],
    },
    {
      question:
        'How do I know if my Amazon FBA inventory has created nexus in a new state?',
      answer: [
        "Check Amazon Seller Central's inventory reports for your fulfillment centers, since these show which states are currently holding your stock.",
      ],
    },
    {
      question: 'How do I know if a marketplace is collecting sales tax on my behalf?',
      answer: [
        "Check that specific marketplace's current seller documentation on marketplace facilitator tax handling — don't assume automatic coverage without confirming.",
      ],
    },
    {
      question:
        'How do I handle sales tax if I sell through both my own website and a marketplace?',
      answer: [
        "Track nexus and collection obligations separately for each channel — marketplace facilitator laws typically only cover sales made through that specific marketplace, not your own website's sales.",
      ],
    },
    {
      question: 'How do I set up sales tax collection on Shopify?',
      answer: [
        "Configure Shopify's built-in tax settings for each state where you've established nexus — the platform provides calculation tools, but you're generally responsible for correctly configuring which states to collect in.",
      ],
    },
    {
      question:
        'How do I track sales tax nexus across all 50 states without manual spreadsheets?',
      answer: [
        "Use a dedicated nexus-tracking tool like TaxJar or Avalara, which automates monitoring your sales against each state's specific threshold.",
      ],
    },
    {
      question:
        'How do I handle sales tax nexus as a remote-first company with employees in multiple states?',
      answer: [
        "Treat each employee's state of residence/work as a potential physical nexus trigger and check that state's specific rules, in addition to tracking economic nexus from sales volume.",
      ],
    },
    {
      question:
        'How do I know when to hire a tax professional versus handling nexus tracking myself?',
      answer: [
        "Once you're crossing thresholds in multiple states, dealing with marketplace-facilitator ambiguity across channels, or operating as a non-US company selling into the US, professional help becomes increasingly worth the cost given the complexity and penalty risk involved.",
      ],
    },
    {
      question:
        'Economic nexus vs. physical nexus — which is more relevant for a pure online seller?',
      answer: [
        'Economic nexus is typically more relevant for a seller with no physical footprint anywhere, though FBA inventory storage can still create physical nexus even for an otherwise fully online business.',
      ],
    },
    {
      question: 'TaxJar vs. Avalara — which should a small seller use?',
      answer: [
        'Both are commonly cited as real, in-use tools for nexus tracking and remittance; a detailed, independently verified feature comparison between them is evidence not sufficiently verified in the available sourced material — evaluate based on your specific platform integrations and support needs.',
      ],
    },
    {
      question: 'Origin-based vs. destination-based taxation — which states use which?',
      answer: [
        "This varies by state and isn't fully detailed in the available sourced material — evidence not sufficiently verified for a complete state-by-state breakdown; check each specific state's rule once you've established nexus there.",
      ],
    },
    {
      question:
        'Does Shopify handle sales tax automatically, or do I need to configure it myself?',
      answer: [
        'Shopify provides tax calculation and collection tools, but responsibility for correctly configuring collection across the states where you have nexus generally remains with the seller.',
      ],
    },
    {
      question: 'Does Etsy collect sales tax automatically for sellers?',
      answer: [
        'Etsy, as a marketplace, is more likely to be covered by marketplace facilitator laws for in-marketplace sales, but sellers should confirm this directly for their specific situation rather than assuming full coverage.',
      ],
    },
    {
      question:
        "I just found out I have nexus in a state I've been selling into for years without collecting tax — what do I do?",
      answer: [
        'This is a real, serious situation that typically calls for professional tax advice, since back-tax exposure and potential penalties are involved — this article is not a substitute for that professional guidance in an already-triggered situation.',
      ],
    },
    {
      question:
        'My FBA inventory got moved to a new state without my choosing it — do I now have nexus there?',
      answer: [
        'Likely yes, if your inventory is physically stored there — inventory storage via a third-party fulfillment center is explicitly listed as a nexus-creating activity.',
      ],
    },
    {
      question:
        'I sell through both Etsy and my own Shopify store — am I double-covered for tax collection?',
      answer: [
        "Not necessarily — marketplace facilitator laws typically only cover the marketplace's own sales, so your Shopify store sales likely still require you to handle nexus and collection separately.",
      ],
    },
    {
      question:
        'I hired a remote employee in a new state — did that just create sales tax nexus there?',
      answer: [
        "It's a real, documented concern actively discussed among founders — check that specific state's physical nexus rules regarding employee presence to confirm.",
      ],
    },
    {
      question:
        'My sales in one state just crossed $100,000 — do I need to register immediately?',
      answer: [
        "Check that specific state's current threshold and registration timeline requirements, since the exact process and grace period (if any) varies by state.",
      ],
    },
    {
      question:
        'Should I use a sales tax automation tool, or can I track this manually with spreadsheets?',
      answer: [
        'For a seller active in more than a handful of states, a dedicated automation tool (like TaxJar or Avalara) is generally worth the cost given how much state-specific threshold tracking and rule-change monitoring is involved.',
      ],
    },
    {
      question:
        'Is it worth paying for TaxJar or Avalara for a small, single-state seller?',
      answer: [
        'For a seller confidently operating in just one or two states with a clear, stable nexus picture, manual tracking may be sufficient; the value of paid automation tools grows with the number of states and channels involved.',
      ],
    },
    {
      question:
        'Should I hire a sales tax professional or handle nexus compliance myself?',
      answer: [
        "Once you're crossing multiple state thresholds, dealing with marketplace-facilitator ambiguity, or facing potential back-tax exposure, professional help is generally worth the cost given the complexity and penalty risk.",
      ],
    },
    {
      question:
        'What does it cost to get help with multi-state sales tax nexus compliance?',
      answer: [
        'Costs vary too widely by business complexity, number of states, and provider to state a single verified figure — evidence not sufficiently verified; request a scoped quote based on your specific footprint.',
      ],
    },
    {
      question:
        'Is a non-US company selling into the US at higher tax-compliance risk than a US-based seller?',
      answer: [
        'Documented founder discussion suggests yes, functionally — the "tax nightmare" framing specifically applied to a UK company selling US-facing B2B SaaS reflects added complexity beyond what a similarly-sized US-based seller would face.',
      ],
    },
    {
      question:
        "What's the best invoicing tool for a small seller who needs to add sales tax correctly?",
      answer: [
        'The ',
        { text: 'Invoice Generator', href: '/business/invoice-generator' },
        " on tools.scult.in is a straightforward way to produce clean invoices; you'll still need to determine the correct tax rate and whether tax applies for each specific sale based on your actual nexus footprint.",
      ],
    },
    {
      question:
        'Should an ecommerce business budget for ongoing nexus monitoring as a fixed cost?',
      answer: [
        'For any seller selling across multiple states, yes — thresholds and rules change (as the Alaska and Illinois transaction-count removals show), so ongoing monitoring, whether manual or tool-based, is a reasonable recurring cost of doing business rather than a one-time task.',
      ],
    },
    {
      question:
        'Is it worth consulting a tax professional before scaling sales in a new state?',
      answer: [
        "For a business planning meaningful growth in a new state, proactively checking that state's specific nexus rules before scaling (rather than after crossing a threshold unknowingly) is a reasonable, lower-risk approach.",
      ],
    },
    {
      question:
        "Should a small seller worry about sales tax nexus if they're only selling in their home state right now?",
      answer: [
        'Physical nexus in your home state is essentially automatic; the nexus question becomes more complex once you start selling meaningfully into other states or storing inventory (e.g., via FBA) outside your home state.',
      ],
    },
    {
      question:
        "What's the single most important first step for a small online seller trying to understand their sales tax nexus exposure?",
      answer: [
        "Map out your actual footprint — where you have any physical presence (including FBA-stored inventory) and where your sales volume by state stands against each state's specific published threshold — rather than relying on a single blanket revenue rule of thumb.",
      ],
    },
  ],
  sources: [
    'https://www.taxjar.com/sales-tax/nexus',
    'https://hn.algolia.com/api/v1/search?query=sales%20tax%20nexus',
    'https://taxcloud.com/blog/sales-tax-nexus-by-state/',
    'https://www.numeral.com/blog/economic-nexus',
    'https://nexusbystate.com/',
  ],
  relatedTools: ['invoice-generator'],
  relatedPrompts: [],
  updatedAt: '2026-08-21',
  readingMinutes: 18,
}
