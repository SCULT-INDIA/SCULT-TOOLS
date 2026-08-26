import { resolveServiceLink } from '@/lib/tools/service-links'
import type { BlogPost } from '../types'

const SLUG = 'midjourney-vs-flux-vs-nano-banana-commercial-use'
const SERVICE_BRANDING_AGENCY = resolveServiceLink('branding-agency', SLUG)

/**
 * Generated from content-engine/05-drafts/article_027.md by
 * content-engine/generate-meta-files.js — every claim, source, and link was
 * written and fact-checked by the content-engine research/production
 * pipeline (see content-engine/06-verification for the per-article report),
 * not invented at conversion time.
 */
export const meta: BlogPost = {
  slug: SLUG,
  pillar: 'roundup',
  title:
    'Midjourney vs Flux vs Nano Banana: Commercial Use, Licensing and Legal Risk Compared',
  h1: 'Midjourney vs Flux vs Nano Banana: commercial use compared',
  targetKeyword: 'midjourney vs flux vs nano banana commercial use',
  description:
    "FLUX.1 schnell is free for commercial use; Midjourney requires a paid plan and has active copyright lawsuits. Here's what each AI image model actually allows.",
  dek: "Only one of these three model families is genuinely free for commercial use: FLUX.1 [schnell], Apache 2.0-licensed by Black Forest Labs. FLUX.1 [dev] requires a separate paid commercial license, Midjourney requires a paid subscription tier ($10–$120/month, with companies over $1M revenue required to use Pro or Mega), and Google's Gemini/Nano Banana lets you keep ownership of outputs but restricts free-tier use to non-consumer-facing commercial products and adds a visible SynthID watermark. Midjourney additionally carries active, unresolved copyright litigation from Disney, Universal, and Warner Bros. Discovery that the other two don't.",
  sections: [
    {
      heading: 'FLUX: the only genuinely free-for-commercial option, with caveats',
      body: [
        [
          'Black Forest Labs, the company behind FLUX, ships its model family under genuinely different license terms depending on the variant — and getting this wrong is the single most common mistake in this comparison. FLUX.1 [schnell] is released under the Apache 2.0 license, which means it is free to use commercially, including for client work, with no fee owed to Black Forest Labs (',
          {
            text: 'GitHub — black-forest-labs/flux',
            href: 'https://github.com/black-forest-labs/flux',
            external: true,
          },
          '; ',
          {
            text: 'Wikipedia — FLUX.1',
            href: 'https://en.wikipedia.org/wiki/FLUX.1',
            external: true,
          },
          ').',
        ],
        [
          "FLUX.1 [dev] and Kontext [dev], by contrast, ship under a non-commercial license by default. Using either for paid client work, an agency deliverable, or any revenue-generating product requires purchasing a separate commercial license directly from Black Forest Labs — running the open-weight model file yourself doesn't grant you commercial rights just because you can technically do it. FLUX.1 [pro] is proprietary and API-only, meaning you access it through BFL's paid infrastructure rather than downloading weights at all.",
        ],
        [
          "Ownership of the actual output images is more permissive than the license structure might suggest: per BFL's terms, users retain ownership of the images FLUX generates regardless of which specific model variant produced them. The one meaningful restriction under the Dev license is that you cannot use FLUX-generated output to train, fine-tune, or distill a competing model — a restriction aimed at protecting BFL's own model, not at limiting how you use the image itself in client deliverables (",
          {
            text: 'Wikipedia — FLUX.1',
            href: 'https://en.wikipedia.org/wiki/FLUX.1',
            external: true,
          },
          ').',
        ],
        [
          'For agencies specifically, Black Forest Labs\' current FLUX.2 licensing page lists four commercial tiers — Builder, Platform, Professional, and Enterprise — with the Professional tier explicitly scoped for agencies serving up to three clients, and Enterprise offering what BFL calls "permissive commercial use" plus custom domain support. Exact pricing for these tiers isn\'t published; BFL requires contacting sales directly (',
          {
            text: 'BFL Pricing/Licensing',
            href: 'https://bfl.ai/pricing/licensing',
            external: true,
          },
          ').',
        ],
      ],
    },
    {
      heading: 'Nano Banana / Gemini: ownership yes, but with real restrictions',
      body: [
        [
          '"Nano Banana" and "Nano Banana 2" are the public nicknames for Google Gemini\'s image generation and editing capability, confirmed directly on Google\'s own Gemini overview page (',
          {
            text: 'Gemini',
            href: 'https://gemini.google/overview/image-generation/',
            external: true,
          },
          "). Google's Gemini API Additional Terms of Service state that Google will not claim ownership over content you generate — but with an important caveat: Google explicitly reserves the right to generate the same or similar content for other users, since the model isn't creating anything exclusively for you, and you remain responsible for how you actually use the generated content (",
          {
            text: 'Google — Gemini API Terms',
            href: 'https://ai.google.dev/gemini-api/terms',
            external: true,
          },
          ').',
        ],
        [
          "There's a use-case restriction worth flagging specifically for anyone building a consumer product on top of the API: Google's terms state the service is intended for developers building for \"professional or business purposes, not for consumer use.\" Developers also may not use the API to build a model that competes with Gemini or Google AI Studio itself. And for businesses operating in the European Economic Area, Switzerland, or the United Kingdom specifically, the terms require that commercial API deployments made available to users in those regions use Google's Paid Services tier rather than the free tier (",
          {
            text: 'Google — Gemini API Terms',
            href: 'https://ai.google.dev/gemini-api/terms',
            external: true,
          },
          ').',
        ],
        [
          'One more practical detail matters for anyone using Nano Banana output in client-facing marketing or branding work: Google applies SynthID — both an invisible digital watermark and a visible marker — to images generated or edited through Gemini\'s image tools. This is checkable via the Gemini app and is worth knowing before delivering a "clean" final asset to a client who may not expect a watermark, visible or otherwise, embedded in it (',
          {
            text: 'Gemini',
            href: 'https://gemini.google/overview/image-generation/',
            external: true,
          },
          ').',
        ],
      ],
    },
    {
      heading: 'Midjourney: paid commercial rights, plus active litigation risk',
      body: [
        [
          'Midjourney requires a paid subscription for any commercial use at all — there\'s no free tier with commercial rights, and the company discontinued its free trial entirely in March 2023. Current paid tiers are Basic ($10/month), Standard ($30/month), Pro ($60/month), and Mega ($120/month), all of which include what Midjourney calls "General Commercial Terms," letting subscribers use generated images and videos in client work, ads, websites, and products, and sell prints, merchandise, or NFTs made from them (',
          {
            text: 'eesel AI',
            href: 'https://www.eesel.ai/blog/midjourney-pricing',
            external: true,
          },
          ').',
        ],
        [
          "There's a revenue-based restriction that specifically matters for agencies and larger businesses: companies with gross annual revenue over $1,000,000 are required to use the Pro or Mega tier specifically for lawful commercial use — the Basic and Standard tiers' commercial terms are scoped to smaller organizations. If your agency or client crosses that revenue threshold, staying on a cheaper tier isn't just a missed feature, it's a compliance gap under Midjourney's own terms (",
          {
            text: 'eesel AI',
            href: 'https://www.eesel.ai/blog/midjourney-pricing',
            external: true,
          },
          ').',
        ],
        [
          "The legal-risk profile here is genuinely different from FLUX or Gemini, and it's the reason this comparison exists for agencies at all: Midjourney is facing active, unresolved copyright litigation. This includes a lawsuit originally filed by individual artists in 2023 that was later joined by more than 4,700 additional artists, plus separate suits filed by Disney and Universal in June 2025 and by Warner Bros. Discovery in September 2025, all alleging large-scale copyright infringement in how Midjourney's models were trained or how they generate outputs resembling protected characters and works (",
          {
            text: 'Wikipedia — Midjourney',
            href: 'https://en.wikipedia.org/wiki/Midjourney',
            external: true,
          },
          '). None of this litigation has been resolved as of this writing, which means the legal risk is real and current, not historical — a meaningfully different risk profile than FLUX or Gemini carry in the sources reviewed for this article.',
        ],
      ],
    },
    {
      heading: 'Practical examples',
      body: [
        [
          '– ',
          {
            text: "A freelance designer using FLUX.1 [schnell] for a client's social graphics:",
            bold: true,
          },
          ' since schnell is Apache 2.0-licensed, this is commercially permitted with no separate license fee — the designer only needs to confirm ownership terms if the client wants exclusivity, which is a separate contractual matter, not a licensing restriction from Black Forest Labs.',
        ],
        [
          '– ',
          {
            text: 'An agency accidentally using FLUX.1 [dev] for paid client deliverables without a commercial license:',
            bold: true,
          },
          ' because Dev ships non-commercial by default, this would violate the license unless the agency purchased a separate commercial license from BFL — a distinction easy to miss since both variants are downloaded and run the same way.',
        ],
        [
          '– ',
          {
            text: "A marketing team on Midjourney's Standard plan ($30/month) whose company crosses $1M in annual revenue:",
            bold: true,
          },
          " per Midjourney's own terms, this team is now required to upgrade to Pro or Mega to remain in compliance for commercial use — an easy trigger to miss since revenue growth doesn't automatically prompt a plan review.",
        ],
        [
          '– ',
          { text: 'Illustrative, not a documented real case:', bold: true },
          ' picture a small business using Nano Banana to generate a hero image for a landing page, unaware that the image carries an invisible SynthID watermark — not a legal problem, but worth knowing before promising a client a "completely clean" AI-generated asset.',
        ],
      ],
    },
    {
      heading: 'Data and evidence',
      body: [
        [
          '– ',
          { text: 'FLUX.1 [schnell] is Apache 2.0-licensed', bold: true },
          ' — free for commercial use with no fee (GitHub; Wikipedia).',
        ],
        [
          '– ',
          {
            text: 'FLUX.1 [dev] and Kontext [dev] are non-commercial by default',
            bold: true,
          },
          ', requiring a separate paid commercial license from Black Forest Labs for client/commercial work (Wikipedia).',
        ],
        [
          '– ',
          {
            text: 'FLUX output ownership is retained by the user regardless of model variant',
            bold: true,
          },
          ', with the sole restriction (under the Dev license) being a ban on using output to train a competing model (Wikipedia).',
        ],
        [
          '– ',
          {
            text: "FLUX.2's current commercial tiers are Builder, Platform, Professional (up to 3 agency clients), and Enterprise",
            bold: true,
          },
          ', with pricing available only by contacting BFL sales directly (BFL Pricing/Licensing).',
        ],
        [
          '– ',
          {
            text: 'Google will not claim ownership of Gemini/Nano Banana output but reserves the right to generate similar content for other users',
            bold: true,
          },
          ', and restricts free-tier commercial use in the EEA, Switzerland, and the UK specifically to Paid Services (Google Gemini API Terms).',
        ],
        [
          '– ',
          { text: "Nano Banana images carry Google's SynthID watermark", bold: true },
          ', both invisible and visible (Gemini official page).',
        ],
        [
          '– ',
          {
            text: "Midjourney's paid tiers run $10–$120/month, all including commercial rights",
            bold: true,
          },
          ', with companies over $1M in annual revenue required to use Pro or Mega specifically (eesel AI).',
        ],
        [
          '– ',
          {
            text: 'Midjourney faces active copyright suits from individual artists (2023, later joined by 4,700+ more), Disney/Universal (June 2025), and Warner Bros. Discovery (September 2025)',
            bold: true,
          },
          ' — all unresolved as of this writing (Wikipedia — Midjourney).',
        ],
        [
          "– Evidence not sufficiently verified: Midjourney's own official help-center article on plan-by-plan commercial terms returned a 403 error on direct fetch during this research; the figures cited above for Midjourney come from a secondary source (eesel AI) rather than Midjourney's own documentation directly, and should be confirmed on midjourney.com before being treated as final for a specific business decision.",
        ],
      ],
    },
    {
      heading: 'Comparisons: licensing terms side by side',
      body: [
        [
          'Model: FLUX.1 [schnell] · Free tier commercial use?: Yes · Cost for commercial rights: Free (Apache 2.0) · Output ownership: User retains ownership · Watermarking: Not specifically documented in sources reviewed · Active legal risk: None documented',
        ],
        [
          "Model: FLUX.1 [dev] / Kontext [dev] · Free tier commercial use?: No · Cost for commercial rights: Separate paid commercial license required from BFL · Output ownership: User retains ownership; can't train competing models on output · Watermarking: Not specifically documented in sources reviewed · Active legal risk: None documented",
        ],
        [
          'Model: FLUX.1 [pro] / FLUX.2 tiers · Free tier commercial use?: No (API-only, proprietary) · Cost for commercial rights: Builder/Platform/Professional/Enterprise tiers, contact sales for pricing · Output ownership: User retains ownership · Watermarking: Not specifically documented in sources reviewed · Active legal risk: None documented',
        ],
        [
          "Model: Nano Banana / Gemini (free tier) · Free tier commercial use?: Limited — professional/business use only, not consumer-facing; EEA/UK/Switzerland require paid tier · Cost for commercial rights: Free (with restrictions) or Paid Services · Output ownership: Google doesn't claim ownership, but may generate similar content for others · Watermarking: Yes — SynthID (invisible + visible) · Active legal risk: None documented",
        ],
        [
          'Model: Midjourney (Basic–Mega) · Free tier commercial use?: No — paid subscription required for any commercial use · Cost for commercial rights: $10–$120/month; Pro/Mega required over $1M company revenue · Output ownership: User owns generated output under paid plans · Watermarking: Not specifically documented in sources reviewed · Active legal risk: Yes — active suits from artists, Disney/Universal, Warner Bros. Discovery',
        ],
      ],
    },
    {
      heading: 'Real-world use cases',
      body: [
        [
          'Black Forest Labs was founded in 2024 by former Stability AI researchers — including Robin Rombach, Andreas Blattmann, and Patrick Esser, who had previously worked on Stable Diffusion — and raised $31 million initially, reportedly followed by $450 million more by the end of 2025 (',
          {
            text: 'Wikipedia — FLUX.1',
            href: 'https://en.wikipedia.org/wiki/FLUX.1',
            external: true,
          },
          "). That funding and technical pedigree underpins the dual open-weight/commercial licensing model this article describes: it's a company specifically structured to monetize commercial licensing on top of freely available open weights, which is a genuinely different business model than Midjourney's subscription-only approach or Google's API-tier structure.",
        ],
        [
          "The Disney/Universal and Warner Bros. Discovery lawsuits against Midjourney are a real, current use case for any agency's risk assessment: both suits specifically allege the model generates outputs resembling protected, recognizable characters — a concrete legal exposure scenario for any commercial user whose output could resemble a client's or a third party's protected IP, regardless of whether that resemblance was intentional.",
        ],
      ],
    },
    {
      heading: 'Common mistakes',
      body: [
        [
          '– ',
          {
            text: 'Assuming any FLUX model variant is free for commercial use because FLUX.1 [schnell] is.',
            bold: true,
          },
          ' Dev and Pro variants have entirely different licensing terms, and using Dev commercially without a separate license is a real violation, not a technicality.',
        ],
        [
          '– ',
          {
            text: "Treating Midjourney's paid subscription as sufficient once a company crosses $1M in revenue.",
            bold: true,
          },
          ' The Pro/Mega requirement at that threshold is a specific, documented term — staying on Basic or Standard past that point is a compliance gap.',
        ],
        [
          '– ',
          {
            text: 'Assuming Google "not claiming ownership" of Gemini output means unrestricted commercial use.',
            bold: true,
          },
          ' The terms specifically limit free-tier use to non-consumer-facing professional/business purposes and require Paid Services for commercial deployment to users in the EEA, UK, or Switzerland.',
        ],
        [
          '– ',
          {
            text: 'Delivering a Nano Banana-generated asset to a client without checking for the SynthID watermark',
            bold: true,
          },
          ", which can matter for brand-clean deliverables even though it isn't a licensing violation.",
        ],
        [
          '– ',
          {
            text: "Treating Midjourney's copyright litigation as background noise rather than a live risk factor",
            bold: true,
          },
          ', when the Disney, Universal, and Warner Bros. Discovery suits remain unresolved and specifically concern the kind of output-resemblance risk that matters most for client-facing commercial work.',
        ],
      ],
    },
    {
      heading: 'Best practices for choosing a model for client work',
      body: [
        [
          '1. ',
          {
            text: "Confirm the exact model variant's license before using it commercially",
            bold: true,
          },
          ' — "FLUX" isn\'t one license; schnell, dev, and pro have three different commercial terms.',
        ],
        [
          '2. ',
          {
            text: "Check your company's (or your client's) annual revenue against Midjourney's $1M threshold",
            bold: true,
          },
          ' before assuming a Basic or Standard plan covers you for commercial use.',
        ],
        [
          '3. ',
          {
            text: "Read the specific restriction on consumer-facing use in Google's Gemini API terms",
            bold: true,
          },
          " before building a customer-facing product on Nano Banana's free tier — it's scoped to professional/business use, not consumer products.",
        ],
        [
          '4. ',
          {
            text: 'Factor active litigation into your risk assessment for Midjourney specifically',
            bold: true,
          },
          ', especially for client work involving recognizable characters, brands, or IP-adjacent visual styles, given the ongoing Disney/Universal and Warner Bros. Discovery suits.',
        ],
        [
          '5. ',
          {
            text: 'Check for watermarking (like SynthID) before delivering a "final," unmarked asset to a client',
            bold: true,
          },
          ' who may expect a clean file with no embedded AI-origin signal.',
        ],
        [
          '6. ',
          {
            text: 'Get commercial licensing terms in writing from the provider directly',
            bold: true,
          },
          " — BFL's enterprise/professional tiers and Midjourney's plan pages are the authoritative source, not a summary article (including this one) for a specific, high-stakes business decision.",
        ],
      ],
    },
    {
      heading: 'Key takeaways',
      body: [
        [
          '– Only FLUX.1 [schnell] is genuinely free for commercial use (Apache 2.0); FLUX.1 [dev] requires a separate paid license, and FLUX.1 [pro] is proprietary API access.',
        ],
        [
          '– Midjourney requires a paid subscription for any commercial use, with companies over $1M in revenue required to use Pro or Mega specifically — and it carries active, unresolved copyright litigation from artists, Disney/Universal, and Warner Bros. Discovery.',
        ],
        [
          "– Google doesn't claim ownership of Nano Banana/Gemini output, but restricts free-tier use to non-consumer-facing professional/business purposes and requires Paid Services for commercial deployment in the EEA, UK, and Switzerland.",
        ],
        [
          "– Nano Banana images carry Google's SynthID watermark, both invisible and visible — worth disclosing to clients before delivery.",
        ],
        [
          "– For agencies specifically weighing legal risk, FLUX currently has no documented active litigation, while Midjourney's is real, current, and specifically concerns the kind of output-resemblance risk that matters most for commercial client work.",
        ],
      ],
    },
    {
      heading: 'Relevant tools.scult.in resources',
      body: [
        [
          'The ',
          { text: 'Midjourney', href: '/prompts/midjourney' },
          ', ',
          { text: 'Flux', href: '/prompts/flux' },
          ', and ',
          { text: 'Nano Banana', href: '/prompts/nano-banana' },
          " prompt libraries are a practical place to start once you've settled on the model that fits your commercial licensing needs, so your prompting approach matches the tool you're actually cleared to use for client work.",
        ],
        [
          'Given how much the "right" model choice here depends on your specific client mix, revenue scale, and risk tolerance — not just a generic recommendation — this is exactly the kind of decision worth folding into a broader conversation with a ',
          {
            text: 'branding and design',
            href: SERVICE_BRANDING_AGENCY.href,
            external: true,
          },
          ' team about how AI-generated visuals fit into your production pipeline going forward.',
        ],
      ],
    },
  ],
  faq: [
    {
      question: 'Can you use Midjourney images commercially?',
      answer: [
        'Yes, but only with a paid subscription — Midjourney has no free tier with commercial rights, and companies over $1M in annual revenue must use the Pro or Mega tier specifically.',
      ],
    },
    {
      question: 'Does Flux allow commercial use?',
      answer: [
        'It depends on the variant: FLUX.1 [schnell] is free for commercial use under Apache 2.0; FLUX.1 [dev] and Kontext [dev] require a separate paid commercial license from Black Forest Labs.',
      ],
    },
    {
      question: 'Who owns Nano Banana generated images?',
      answer: [
        'Google states it does not claim ownership over content generated through the Gemini API, but reserves the right to generate the same or similar content for other users, and you remain responsible for how the content is used.',
      ],
    },
    {
      question: 'Is Nano Banana safe for commercial use?',
      answer: [
        "It's usable for professional/business purposes under Google's terms, but free-tier use is explicitly not intended for consumer-facing products, and businesses in the EEA, UK, or Switzerland must use Paid Services for commercial deployment.",
      ],
    },
    {
      question: 'Is Flux Schnell free for commercial projects?',
      answer: [
        "Yes — it's Apache 2.0-licensed, meaning free commercial use with no license fee owed to Black Forest Labs.",
      ],
    },
    {
      question: 'Does Google claim ownership of Gemini-generated images?',
      answer: [
        "No — Google's terms state it won't claim ownership, though it reserves the right to generate similar content for other users.",
      ],
    },
    {
      question: 'Can I sell images made with Midjourney commercially?',
      answer: [
        "Yes, on a paid subscription — Midjourney's General Commercial Terms specifically permit selling prints, merchandise, and NFTs, and using images in client work.",
      ],
    },
    {
      question: 'Is Flux AI free for commercial use?',
      answer: [
        'Only the schnell variant is free for commercial use; dev and pro variants require payment (a separate commercial license, or API access respectively).',
      ],
    },
    {
      question: "What is Nano Banana's commercial license?",
      answer: [
        "It operates under Google's Gemini API Additional Terms of Service, which grant output ownership to the user with restrictions on consumer-facing free-tier use and a paid-service requirement in certain regions.",
      ],
    },
    {
      question: 'What is the FLUX.1 dev non-commercial license, explained simply?',
      answer: [
        'It lets you use the model and its output for personal or non-commercial purposes for free, but requires purchasing a separate commercial license from Black Forest Labs before using it for client work, ads, or any revenue-generating product.',
      ],
    },
    {
      question: 'Do I own images generated by Nano Banana?',
      answer: [
        "Google doesn't claim ownership over your generated content, though it reserves the right to produce similar content for other users and places usage responsibility on you.",
      ],
    },
    {
      question: 'Which AI image generator is safest for agency client work?',
      answer: [
        'Based on the licensing and litigation evidence here, FLUX.1 [schnell] carries the lowest documented legal/licensing complexity for commercial use, while Midjourney carries the highest documented legal-risk profile due to active copyright litigation.',
      ],
    },
    {
      question: 'What company owns FLUX?',
      answer: [
        'Black Forest Labs, founded in 2024 by former Stability AI researchers including Robin Rombach, Andreas Blattmann, and Patrick Esser.',
      ],
    },
    {
      question: 'Is Midjourney facing legal trouble?',
      answer: [
        'Yes — active, unresolved lawsuits from individual artists (joined by over 4,700 more), Disney and Universal (June 2025), and Warner Bros. Discovery (September 2025), all alleging copyright infringement.',
      ],
    },
    {
      question: 'What is SynthID?',
      answer: [
        "Google's watermarking technology, applied both invisibly and visibly to AI-generated images from Gemini's image tools, checkable for AI origin via the Gemini app.",
      ],
    },
    {
      question: 'How much does a Midjourney subscription cost?',
      answer: [
        "$10/month (Basic), $30/month (Standard), $60/month (Pro), or $120/month (Mega), all including commercial usage rights under Midjourney's General Commercial Terms.",
      ],
    },
    {
      question: "What's the revenue threshold that changes which Midjourney plan I need?",
      answer: [
        "Companies with gross annual revenue over $1,000,000 must use the Pro or Mega plan for lawful commercial use, per Midjourney's terms.",
      ],
    },
    {
      question: 'Does FLUX.2 have enterprise pricing?',
      answer: [
        "Yes — Black Forest Labs' FLUX.2 licensing page lists Builder, Platform, Professional, and Enterprise tiers, with exact pricing available only by contacting BFL's sales team.",
      ],
    },
    {
      question: 'Is FLUX open source?',
      answer: [
        'Partially — FLUX.1 [schnell] is Apache 2.0 (genuinely open source with commercial rights); [dev] and [pro] variants are open-weight or proprietary respectively but not free for unrestricted commercial use.',
      ],
    },
    {
      question: "What does Black Forest Labs' Professional tier include?",
      answer: [
        "It's explicitly scoped for agencies, supporting use across up to three clients, per BFL's published licensing page.",
      ],
    },
    {
      question: 'How do I license FLUX for commercial use?',
      answer: [
        "Use FLUX.1 [schnell] directly (Apache 2.0, no license needed), or contact Black Forest Labs' sales team for a FLUX.1 [dev] commercial license or one of the FLUX.2 tiers (Builder, Platform, Professional, Enterprise).",
      ],
    },
    {
      question:
        'How do I check AI image commercial rights before using an image in client work?',
      answer: [
        "Identify the exact model and variant used, then check that provider's specific commercial terms directly (BFL's licensing page, Midjourney's plan comparison, or Google's Gemini API terms) rather than relying on general assumptions about \"AI-generated images.\"",
      ],
    },
    {
      question: 'How do I get a Flux commercial license?',
      answer: [
        "For FLUX.1 [dev], contact Black Forest Labs directly to purchase a commercial license; FLUX.2's Builder/Platform/Professional/Enterprise tiers similarly require contacting BFL's sales team for pricing.",
      ],
    },
    {
      question: 'How do I know which Midjourney plan my business actually needs?',
      answer: [
        "Check your company's gross annual revenue against the $1,000,000 threshold — below it, Basic or Standard cover commercial use; above it, Pro or Mega are required.",
      ],
    },
    {
      question: 'How do I avoid using a non-commercial FLUX license by mistake?',
      answer: [
        "Confirm you're specifically using the [schnell] variant if you want guaranteed free commercial rights, since [dev] and [pro] have different, more restrictive commercial terms.",
      ],
    },
    {
      question: 'How do I use Gemini/Nano Banana for a consumer-facing product legally?',
      answer: [
        "Review Google's Gemini API terms carefully, since the stated intent is professional/business use rather than consumer use on the free tier — a consumer-facing product likely needs Paid Services and its own terms review.",
      ],
    },
    {
      question: 'How do I check if my AI-generated image has a SynthID watermark?',
      answer: [
        "Use the Gemini app's built-in check, which can identify Google's SynthID watermarking on images generated or edited through Gemini's tools.",
      ],
    },
    {
      question:
        'How do I assess copyright risk before using Midjourney for a client project involving recognizable characters or brands?',
      answer: [
        'Given the active Disney/Universal and Warner Bros. Discovery litigation specifically concerning output resembling protected IP, avoid prompts that reference or closely evoke existing copyrighted characters, and consider a lower-litigation-risk model like FLUX for that specific use case.',
      ],
    },
    {
      question:
        "How do I find out the exact price for Black Forest Labs' enterprise FLUX licensing?",
      answer: [
        "Contact BFL's sales team directly through their pricing/licensing page — exact enterprise and professional-tier pricing isn't published publicly.",
      ],
    },
    {
      question:
        'How do I decide between FLUX, Midjourney, and Nano Banana for a new agency project?',
      answer: [
        "Weigh licensing cost and complexity (FLUX schnell is simplest and free; Midjourney requires a paid tier matched to your revenue; Gemini has use-case and regional restrictions) against your specific need for quality, ease of use, and legal risk tolerance (particularly around Midjourney's active litigation).",
      ],
    },
    {
      question:
        'Is there a meaningful quality difference between FLUX, Midjourney, and Nano Banana that affects the commercial-use decision?',
      answer: [
        "This research focused specifically on licensing, ownership, and legal-risk terms rather than image-quality benchmarking; quality comparisons weren't independently verified here and shouldn't be assumed from this article.",
      ],
    },
    {
      question:
        "Does using an AI image generator's output still require model-release or IP clearance for recognizable people or brands depicted?",
      answer: [
        "This wasn't directly addressed by the licensing terms reviewed here, which cover the AI provider's own commercial-use grant, not third-party rights (e.g., a real person's likeness) that might separately apply to specific generated content — that's a separate legal consideration from AI licensing terms.",
      ],
    },
    {
      question:
        'Do these commercial terms apply retroactively to images I generated before understanding the license?',
      answer: [
        "The license terms in effect at the time you generated and are using the content typically govern that use; this research didn't find specific retroactive-enforcement provisions in any of the three providers' terms, but a definitive answer would require reviewing the exact terms version in effect when you generated the content.",
      ],
    },
    {
      question:
        'Are there jurisdiction-specific commercial restrictions beyond the EEA/UK/Switzerland rule for Gemini?',
      answer: [
        "Google's terms specifically single out the EEA, Switzerland, and the UK for the Paid Services requirement; this research didn't find equivalent jurisdiction-specific terms documented for FLUX or Midjourney beyond general company-revenue thresholds.",
      ],
    },
    {
      question:
        'Can I use these AI image tools to generate images that will be trademarked as a logo?',
      answer: [
        "Ownership-of-output terms for all three providers generally support using generated images in commercial branding, but trademark registrability is a separate legal question (governed by trademark law and originality/distinctiveness requirements) that this research didn't independently address.",
      ],
    },
    {
      question: 'Midjourney vs Flux — which is better for commercial use?',
      answer: [
        'FLUX (specifically the schnell variant) offers simpler, free commercial licensing with no documented active litigation; Midjourney requires a paid, revenue-tiered subscription and carries current, unresolved copyright litigation — a meaningfully different risk and cost profile.',
      ],
    },
    {
      question: 'Flux vs Nano Banana — which has better commercial terms?',
      answer: [
        "FLUX.1 [schnell]'s free Apache 2.0 license is simpler and more permissive than Gemini's free tier, which restricts consumer-facing use and imposes a Paid Services requirement in the EEA, UK, and Switzerland specifically.",
      ],
    },
    {
      question: 'Midjourney vs Nano Banana commercial — which carries more legal risk?',
      answer: [
        "Midjourney carries documented, active litigation risk (Disney, Universal, Warner Bros. Discovery, and an artist class action); no comparable active litigation against Google's Gemini/Nano Banana was found in this research.",
      ],
    },
    {
      question:
        'Flux Schnell vs Flux Dev vs Flux Pro — how do the licenses actually differ?',
      answer: [
        "Schnell is Apache 2.0 (free, commercial-ready); Dev is non-commercial by default (requires a paid BFL license for commercial use); Pro is proprietary and API-only, accessed through BFL's paid infrastructure directly.",
      ],
    },
    {
      question:
        "Which is cheaper for a small agency: Midjourney's Pro plan or a FLUX.2 Professional license?",
      answer: [
        "Midjourney's Pro plan has a published price ($60/month); Black Forest Labs doesn't publish Professional-tier pricing publicly, so a direct cost comparison isn't possible from public information alone — you'd need to contact BFL sales for a quote.",
      ],
    },
    {
      question:
        'I used FLUX.1 [dev] for a paid client project without buying a commercial license — is that a problem?',
      answer: [
        "Yes — Dev ships non-commercial by default, so commercial use without purchasing BFL's separate commercial license is a license violation, not a gray area.",
      ],
    },
    {
      question:
        "My company just crossed $1M in revenue and we're still on Midjourney Standard — are we out of compliance?",
      answer: [
        "Per Midjourney's own terms, companies over $1M in gross annual revenue are required to use Pro or Mega for lawful commercial use — staying on Standard past that threshold would put you out of compliance with their stated terms.",
      ],
    },
    {
      question:
        'My client noticed a watermark on an image I delivered from Nano Banana — what happened?',
      answer: [
        "Google's Gemini image tools apply SynthID, both invisible and visible, to generated/edited images — this is expected behavior, not a bug, and worth disclosing to clients proactively before delivery.",
      ],
    },
    {
      question:
        "I'm worried about using Midjourney for a project that might resemble a copyrighted character — what should I do?",
      answer: [
        'Given the active Disney/Universal and Warner Bros. Discovery litigation specifically about output resembling protected characters, avoid prompts referencing existing copyrighted IP and consider using FLUX instead for that specific type of work.',
      ],
    },
    {
      question:
        "I can't find Black Forest Labs' exact commercial license pricing anywhere — is that normal?",
      answer: [
        "Yes — BFL doesn't publish exact pricing for its Professional and Enterprise tiers; you need to contact their sales team directly for a quote.",
      ],
    },
    {
      question:
        'Which AI image generator should I choose for ongoing client work: Midjourney, Flux, or Nano Banana?',
      answer: [
        "If minimizing licensing complexity and legal risk is the priority, FLUX.1 [schnell] has the simplest, free, litigation-free commercial terms documented here; Midjourney offers a more established creative tool but at higher cost and documented legal risk; Nano Banana suits professional/business integrations but isn't positioned for consumer-facing products on its free tier.",
      ],
    },
    {
      question:
        "Is it worth paying for Black Forest Labs' enterprise FLUX license instead of just using Midjourney?",
      answer: [
        "That depends on your specific volume, client count, and risk tolerance — BFL's Professional tier is explicitly built for agencies serving multiple clients, which may be more cost-effective at scale than multiple Midjourney seats, but exact pricing requires contacting BFL directly to compare.",
      ],
    },
    {
      question:
        'Should a branding agency standardize on one AI image model for client deliverables?',
      answer: [
        "Given the licensing complexity shown in this comparison, standardizing on a model with clear, simple, low-risk commercial terms (like FLUX.1 [schnell] for lower-stakes work, with a BFL commercial license or Midjourney's Pro/Mega for higher-stakes projects) reduces the chance of a licensing mistake across a team.",
      ],
    },
    {
      question:
        'Where can I get a definitive answer on which license applies to my specific use case?',
      answer: [
        "Go directly to the provider's own current terms (BFL's licensing page, Midjourney's plan comparison article, or Google's Gemini API terms) rather than relying on any summary article, including this one, for a decision with real legal or financial stakes.",
      ],
    },
    {
      question:
        "Who can help me figure out the right AI image tooling and licensing setup for my brand's ongoing content needs?",
      answer: [
        "That's a scoping question a ",
        {
          text: 'branding and design',
          href: SERVICE_BRANDING_AGENCY.href,
          external: true,
        },
        ' partner can help work through alongside your actual content volume and client base, since the right choice depends on your specific commercial exposure, not just a generic recommendation.',
      ],
    },
  ],
  sources: [
    'https://github.com/black-forest-labs/flux',
    'https://en.wikipedia.org/wiki/FLUX.1',
    'https://bfl.ai/pricing/licensing',
    'https://ai.google.dev/gemini-api/terms',
    'https://gemini.google/overview/image-generation/',
    'https://en.wikipedia.org/wiki/Midjourney',
    'https://www.eesel.ai/blog/midjourney-pricing',
  ],
  relatedTools: [],
  relatedPrompts: [],
  serviceTarget: 'branding-agency',
  updatedAt: '2026-08-21',
  readingMinutes: 18,
}
