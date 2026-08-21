---
id: article_027
title: "Midjourney vs Flux vs Nano Banana: Commercial Use, Licensing and Legal Risk Compared"
slug: midjourney-vs-flux-vs-nano-banana-commercial-use
description: "FLUX.1 schnell is free for commercial use; Midjourney requires a paid plan and has active copyright lawsuits. Here's what each AI image model actually allows."
primary_keyword: midjourney vs flux vs nano banana commercial use
secondary_keywords: ["ai image generator commercial license comparison", "flux vs midjourney vs nano banana", "best ai image model for client work", "ai image generator copyright risk"]
intent: Comparative
audience: "Freelance designers, marketing/creative agencies, small business owners, and content creators evaluating which AI image tool is legally safe and cost-effective for paid client or commercial work"
topic_cluster: "AI image generation — commercial licensing & legal risk"
countries: ["European Economic Area countries, Switzerland, and the United Kingdom"]
author: "SCULT.IN Content Engine"
review_status: draft
last_verified: "2026-08-21"
sources: ["https://github.com/black-forest-labs/flux", "https://en.wikipedia.org/wiki/FLUX.1", "https://bfl.ai/pricing/licensing", "https://ai.google.dev/gemini-api/terms", "https://gemini.google/overview/image-generation/", "https://en.wikipedia.org/wiki/Midjourney", "https://www.eesel.ai/blog/midjourney-pricing"]
---

# Midjourney vs Flux vs Nano Banana: commercial use compared

Only one of these three model families is genuinely free for commercial use: FLUX.1 [schnell], Apache 2.0-licensed by Black Forest Labs. FLUX.1 [dev] requires a separate paid commercial license, Midjourney requires a paid subscription tier ($10–$120/month, with companies over $1M revenue required to use Pro or Mega), and Google's Gemini/Nano Banana lets you keep ownership of outputs but restricts free-tier use to non-consumer-facing commercial products and adds a visible SynthID watermark. Midjourney additionally carries active, unresolved copyright litigation from Disney, Universal, and Warner Bros. Discovery that the other two don't.

## Table of contents

- FLUX: the only genuinely free-for-commercial option, with caveats
- Nano Banana / Gemini: ownership yes, but with real restrictions
- Midjourney: paid commercial rights, plus active litigation risk
- Practical examples
- Data and evidence
- Comparisons: licensing terms side by side
- Real-world use cases
- Common mistakes
- Best practices for choosing a model for client work
- Frequently asked questions
- Key takeaways
- Relevant tools.scult.in resources
- Sources

## FLUX: the only genuinely free-for-commercial option, with caveats

Black Forest Labs, the company behind FLUX, ships its model family under genuinely different license terms depending on the variant — and getting this wrong is the single most common mistake in this comparison. FLUX.1 [schnell] is released under the Apache 2.0 license, which means it is free to use commercially, including for client work, with no fee owed to Black Forest Labs ([GitHub — black-forest-labs/flux](https://github.com/black-forest-labs/flux); [Wikipedia — FLUX.1](https://en.wikipedia.org/wiki/FLUX.1)).

FLUX.1 [dev] and Kontext [dev], by contrast, ship under a non-commercial license by default. Using either for paid client work, an agency deliverable, or any revenue-generating product requires purchasing a separate commercial license directly from Black Forest Labs — running the open-weight model file yourself doesn't grant you commercial rights just because you can technically do it. FLUX.1 [pro] is proprietary and API-only, meaning you access it through BFL's paid infrastructure rather than downloading weights at all.

Ownership of the actual output images is more permissive than the license structure might suggest: per BFL's terms, users retain ownership of the images FLUX generates regardless of which specific model variant produced them. The one meaningful restriction under the Dev license is that you cannot use FLUX-generated output to train, fine-tune, or distill a competing model — a restriction aimed at protecting BFL's own model, not at limiting how you use the image itself in client deliverables ([Wikipedia — FLUX.1](https://en.wikipedia.org/wiki/FLUX.1)).

For agencies specifically, Black Forest Labs' current FLUX.2 licensing page lists four commercial tiers — Builder, Platform, Professional, and Enterprise — with the Professional tier explicitly scoped for agencies serving up to three clients, and Enterprise offering what BFL calls "permissive commercial use" plus custom domain support. Exact pricing for these tiers isn't published; BFL requires contacting sales directly ([BFL Pricing/Licensing](https://bfl.ai/pricing/licensing)).

## Nano Banana / Gemini: ownership yes, but with real restrictions

"Nano Banana" and "Nano Banana 2" are the public nicknames for Google Gemini's image generation and editing capability, confirmed directly on Google's own Gemini overview page ([Gemini](https://gemini.google/overview/image-generation/)). Google's Gemini API Additional Terms of Service state that Google will not claim ownership over content you generate — but with an important caveat: Google explicitly reserves the right to generate the same or similar content for other users, since the model isn't creating anything exclusively for you, and you remain responsible for how you actually use the generated content ([Google — Gemini API Terms](https://ai.google.dev/gemini-api/terms)).

There's a use-case restriction worth flagging specifically for anyone building a consumer product on top of the API: Google's terms state the service is intended for developers building for "professional or business purposes, not for consumer use." Developers also may not use the API to build a model that competes with Gemini or Google AI Studio itself. And for businesses operating in the European Economic Area, Switzerland, or the United Kingdom specifically, the terms require that commercial API deployments made available to users in those regions use Google's Paid Services tier rather than the free tier ([Google — Gemini API Terms](https://ai.google.dev/gemini-api/terms)).

One more practical detail matters for anyone using Nano Banana output in client-facing marketing or branding work: Google applies SynthID — both an invisible digital watermark and a visible marker — to images generated or edited through Gemini's image tools. This is checkable via the Gemini app and is worth knowing before delivering a "clean" final asset to a client who may not expect a watermark, visible or otherwise, embedded in it ([Gemini](https://gemini.google/overview/image-generation/)).

## Midjourney: paid commercial rights, plus active litigation risk

Midjourney requires a paid subscription for any commercial use at all — there's no free tier with commercial rights, and the company discontinued its free trial entirely in March 2023. Current paid tiers are Basic ($10/month), Standard ($30/month), Pro ($60/month), and Mega ($120/month), all of which include what Midjourney calls "General Commercial Terms," letting subscribers use generated images and videos in client work, ads, websites, and products, and sell prints, merchandise, or NFTs made from them ([eesel AI](https://www.eesel.ai/blog/midjourney-pricing)).

There's a revenue-based restriction that specifically matters for agencies and larger businesses: companies with gross annual revenue over $1,000,000 are required to use the Pro or Mega tier specifically for lawful commercial use — the Basic and Standard tiers' commercial terms are scoped to smaller organizations. If your agency or client crosses that revenue threshold, staying on a cheaper tier isn't just a missed feature, it's a compliance gap under Midjourney's own terms ([eesel AI](https://www.eesel.ai/blog/midjourney-pricing)).

The legal-risk profile here is genuinely different from FLUX or Gemini, and it's the reason this comparison exists for agencies at all: Midjourney is facing active, unresolved copyright litigation. This includes a lawsuit originally filed by individual artists in 2023 that was later joined by more than 4,700 additional artists, plus separate suits filed by Disney and Universal in June 2025 and by Warner Bros. Discovery in September 2025, all alleging large-scale copyright infringement in how Midjourney's models were trained or how they generate outputs resembling protected characters and works ([Wikipedia — Midjourney](https://en.wikipedia.org/wiki/Midjourney)). None of this litigation has been resolved as of this writing, which means the legal risk is real and current, not historical — a meaningfully different risk profile than FLUX or Gemini carry in the sources reviewed for this article.

## Practical examples

- **A freelance designer using FLUX.1 [schnell] for a client's social graphics:** since schnell is Apache 2.0-licensed, this is commercially permitted with no separate license fee — the designer only needs to confirm ownership terms if the client wants exclusivity, which is a separate contractual matter, not a licensing restriction from Black Forest Labs.
- **An agency accidentally using FLUX.1 [dev] for paid client deliverables without a commercial license:** because Dev ships non-commercial by default, this would violate the license unless the agency purchased a separate commercial license from BFL — a distinction easy to miss since both variants are downloaded and run the same way.
- **A marketing team on Midjourney's Standard plan ($30/month) whose company crosses $1M in annual revenue:** per Midjourney's own terms, this team is now required to upgrade to Pro or Mega to remain in compliance for commercial use — an easy trigger to miss since revenue growth doesn't automatically prompt a plan review.
- **Illustrative, not a documented real case:** picture a small business using Nano Banana to generate a hero image for a landing page, unaware that the image carries an invisible SynthID watermark — not a legal problem, but worth knowing before promising a client a "completely clean" AI-generated asset.

## Data and evidence

- **FLUX.1 [schnell] is Apache 2.0-licensed** — free for commercial use with no fee (GitHub; Wikipedia).
- **FLUX.1 [dev] and Kontext [dev] are non-commercial by default**, requiring a separate paid commercial license from Black Forest Labs for client/commercial work (Wikipedia).
- **FLUX output ownership is retained by the user regardless of model variant**, with the sole restriction (under the Dev license) being a ban on using output to train a competing model (Wikipedia).
- **FLUX.2's current commercial tiers are Builder, Platform, Professional (up to 3 agency clients), and Enterprise**, with pricing available only by contacting BFL sales directly (BFL Pricing/Licensing).
- **Google will not claim ownership of Gemini/Nano Banana output but reserves the right to generate similar content for other users**, and restricts free-tier commercial use in the EEA, Switzerland, and the UK specifically to Paid Services (Google Gemini API Terms).
- **Nano Banana images carry Google's SynthID watermark**, both invisible and visible (Gemini official page).
- **Midjourney's paid tiers run $10–$120/month, all including commercial rights**, with companies over $1M in annual revenue required to use Pro or Mega specifically (eesel AI).
- **Midjourney faces active copyright suits from individual artists (2023, later joined by 4,700+ more), Disney/Universal (June 2025), and Warner Bros. Discovery (September 2025)** — all unresolved as of this writing (Wikipedia — Midjourney).
- Evidence not sufficiently verified: Midjourney's own official help-center article on plan-by-plan commercial terms returned a 403 error on direct fetch during this research; the figures cited above for Midjourney come from a secondary source (eesel AI) rather than Midjourney's own documentation directly, and should be confirmed on midjourney.com before being treated as final for a specific business decision.

## Comparisons: licensing terms side by side

| Model | Free tier commercial use? | Cost for commercial rights | Output ownership | Watermarking | Active legal risk |
|---|---|---|---|---|---|
| FLUX.1 [schnell] | Yes | Free (Apache 2.0) | User retains ownership | Not specifically documented in sources reviewed | None documented |
| FLUX.1 [dev] / Kontext [dev] | No | Separate paid commercial license required from BFL | User retains ownership; can't train competing models on output | Not specifically documented in sources reviewed | None documented |
| FLUX.1 [pro] / FLUX.2 tiers | No (API-only, proprietary) | Builder/Platform/Professional/Enterprise tiers, contact sales for pricing | User retains ownership | Not specifically documented in sources reviewed | None documented |
| Nano Banana / Gemini (free tier) | Limited — professional/business use only, not consumer-facing; EEA/UK/Switzerland require paid tier | Free (with restrictions) or Paid Services | Google doesn't claim ownership, but may generate similar content for others | Yes — SynthID (invisible + visible) | None documented |
| Midjourney (Basic–Mega) | No — paid subscription required for any commercial use | $10–$120/month; Pro/Mega required over $1M company revenue | User owns generated output under paid plans | Not specifically documented in sources reviewed | Yes — active suits from artists, Disney/Universal, Warner Bros. Discovery |

## Real-world use cases

Black Forest Labs was founded in 2024 by former Stability AI researchers — including Robin Rombach, Andreas Blattmann, and Patrick Esser, who had previously worked on Stable Diffusion — and raised $31 million initially, reportedly followed by $450 million more by the end of 2025 ([Wikipedia — FLUX.1](https://en.wikipedia.org/wiki/FLUX.1)). That funding and technical pedigree underpins the dual open-weight/commercial licensing model this article describes: it's a company specifically structured to monetize commercial licensing on top of freely available open weights, which is a genuinely different business model than Midjourney's subscription-only approach or Google's API-tier structure.

The Disney/Universal and Warner Bros. Discovery lawsuits against Midjourney are a real, current use case for any agency's risk assessment: both suits specifically allege the model generates outputs resembling protected, recognizable characters — a concrete legal exposure scenario for any commercial user whose output could resemble a client's or a third party's protected IP, regardless of whether that resemblance was intentional.

## Common mistakes

- **Assuming any FLUX model variant is free for commercial use because FLUX.1 [schnell] is.** Dev and Pro variants have entirely different licensing terms, and using Dev commercially without a separate license is a real violation, not a technicality.
- **Treating Midjourney's paid subscription as sufficient once a company crosses $1M in revenue.** The Pro/Mega requirement at that threshold is a specific, documented term — staying on Basic or Standard past that point is a compliance gap.
- **Assuming Google "not claiming ownership" of Gemini output means unrestricted commercial use.** The terms specifically limit free-tier use to non-consumer-facing professional/business purposes and require Paid Services for commercial deployment to users in the EEA, UK, or Switzerland.
- **Delivering a Nano Banana-generated asset to a client without checking for the SynthID watermark**, which can matter for brand-clean deliverables even though it isn't a licensing violation.
- **Treating Midjourney's copyright litigation as background noise rather than a live risk factor**, when the Disney, Universal, and Warner Bros. Discovery suits remain unresolved and specifically concern the kind of output-resemblance risk that matters most for client-facing commercial work.

## Best practices for choosing a model for client work

1. **Confirm the exact model variant's license before using it commercially** — "FLUX" isn't one license; schnell, dev, and pro have three different commercial terms.
2. **Check your company's (or your client's) annual revenue against Midjourney's $1M threshold** before assuming a Basic or Standard plan covers you for commercial use.
3. **Read the specific restriction on consumer-facing use in Google's Gemini API terms** before building a customer-facing product on Nano Banana's free tier — it's scoped to professional/business use, not consumer products.
4. **Factor active litigation into your risk assessment for Midjourney specifically**, especially for client work involving recognizable characters, brands, or IP-adjacent visual styles, given the ongoing Disney/Universal and Warner Bros. Discovery suits.
5. **Check for watermarking (like SynthID) before delivering a "final," unmarked asset to a client** who may expect a clean file with no embedded AI-origin signal.
6. **Get commercial licensing terms in writing from the provider directly** — BFL's enterprise/professional tiers and Midjourney's plan pages are the authoritative source, not a summary article (including this one) for a specific, high-stakes business decision.

## Frequently asked questions

**1. Can you use Midjourney images commercially?**
Yes, but only with a paid subscription — Midjourney has no free tier with commercial rights, and companies over $1M in annual revenue must use the Pro or Mega tier specifically.

**2. Does Flux allow commercial use?**
It depends on the variant: FLUX.1 [schnell] is free for commercial use under Apache 2.0; FLUX.1 [dev] and Kontext [dev] require a separate paid commercial license from Black Forest Labs.

**3. Who owns Nano Banana generated images?**
Google states it does not claim ownership over content generated through the Gemini API, but reserves the right to generate the same or similar content for other users, and you remain responsible for how the content is used.

**4. Is Nano Banana safe for commercial use?**
It's usable for professional/business purposes under Google's terms, but free-tier use is explicitly not intended for consumer-facing products, and businesses in the EEA, UK, or Switzerland must use Paid Services for commercial deployment.

**5. Is Flux Schnell free for commercial projects?**
Yes — it's Apache 2.0-licensed, meaning free commercial use with no license fee owed to Black Forest Labs.

**6. Does Google claim ownership of Gemini-generated images?**
No — Google's terms state it won't claim ownership, though it reserves the right to generate similar content for other users.

**7. Can I sell images made with Midjourney commercially?**
Yes, on a paid subscription — Midjourney's General Commercial Terms specifically permit selling prints, merchandise, and NFTs, and using images in client work.

**8. Is Flux AI free for commercial use?**
Only the schnell variant is free for commercial use; dev and pro variants require payment (a separate commercial license, or API access respectively).

**9. What is Nano Banana's commercial license?**
It operates under Google's Gemini API Additional Terms of Service, which grant output ownership to the user with restrictions on consumer-facing free-tier use and a paid-service requirement in certain regions.

**10. What is the FLUX.1 dev non-commercial license, explained simply?**
It lets you use the model and its output for personal or non-commercial purposes for free, but requires purchasing a separate commercial license from Black Forest Labs before using it for client work, ads, or any revenue-generating product.

**11. Do I own images generated by Nano Banana?**
Google doesn't claim ownership over your generated content, though it reserves the right to produce similar content for other users and places usage responsibility on you.

**12. Which AI image generator is safest for agency client work?**
Based on the licensing and litigation evidence here, FLUX.1 [schnell] carries the lowest documented legal/licensing complexity for commercial use, while Midjourney carries the highest documented legal-risk profile due to active copyright litigation.

**13. What company owns FLUX?**
Black Forest Labs, founded in 2024 by former Stability AI researchers including Robin Rombach, Andreas Blattmann, and Patrick Esser.

**14. Is Midjourney facing legal trouble?**
Yes — active, unresolved lawsuits from individual artists (joined by over 4,700 more), Disney and Universal (June 2025), and Warner Bros. Discovery (September 2025), all alleging copyright infringement.

**15. What is SynthID?**
Google's watermarking technology, applied both invisibly and visibly to AI-generated images from Gemini's image tools, checkable for AI origin via the Gemini app.

**16. How much does a Midjourney subscription cost?**
$10/month (Basic), $30/month (Standard), $60/month (Pro), or $120/month (Mega), all including commercial usage rights under Midjourney's General Commercial Terms.

**17. What's the revenue threshold that changes which Midjourney plan I need?**
Companies with gross annual revenue over $1,000,000 must use the Pro or Mega plan for lawful commercial use, per Midjourney's terms.

**18. Does FLUX.2 have enterprise pricing?**
Yes — Black Forest Labs' FLUX.2 licensing page lists Builder, Platform, Professional, and Enterprise tiers, with exact pricing available only by contacting BFL's sales team.

**19. Is FLUX open source?**
Partially — FLUX.1 [schnell] is Apache 2.0 (genuinely open source with commercial rights); [dev] and [pro] variants are open-weight or proprietary respectively but not free for unrestricted commercial use.

**20. What does Black Forest Labs' Professional tier include?**
It's explicitly scoped for agencies, supporting use across up to three clients, per BFL's published licensing page.

**21. How do I license FLUX for commercial use?**
Use FLUX.1 [schnell] directly (Apache 2.0, no license needed), or contact Black Forest Labs' sales team for a FLUX.1 [dev] commercial license or one of the FLUX.2 tiers (Builder, Platform, Professional, Enterprise).

**22. How do I check AI image commercial rights before using an image in client work?**
Identify the exact model and variant used, then check that provider's specific commercial terms directly (BFL's licensing page, Midjourney's plan comparison, or Google's Gemini API terms) rather than relying on general assumptions about "AI-generated images."

**23. How do I get a Flux commercial license?**
For FLUX.1 [dev], contact Black Forest Labs directly to purchase a commercial license; FLUX.2's Builder/Platform/Professional/Enterprise tiers similarly require contacting BFL's sales team for pricing.

**24. How do I know which Midjourney plan my business actually needs?**
Check your company's gross annual revenue against the $1,000,000 threshold — below it, Basic or Standard cover commercial use; above it, Pro or Mega are required.

**25. How do I avoid using a non-commercial FLUX license by mistake?**
Confirm you're specifically using the [schnell] variant if you want guaranteed free commercial rights, since [dev] and [pro] have different, more restrictive commercial terms.

**26. How do I use Gemini/Nano Banana for a consumer-facing product legally?**
Review Google's Gemini API terms carefully, since the stated intent is professional/business use rather than consumer use on the free tier — a consumer-facing product likely needs Paid Services and its own terms review.

**27. How do I check if my AI-generated image has a SynthID watermark?**
Use the Gemini app's built-in check, which can identify Google's SynthID watermarking on images generated or edited through Gemini's tools.

**28. How do I assess copyright risk before using Midjourney for a client project involving recognizable characters or brands?**
Given the active Disney/Universal and Warner Bros. Discovery litigation specifically concerning output resembling protected IP, avoid prompts that reference or closely evoke existing copyrighted characters, and consider a lower-litigation-risk model like FLUX for that specific use case.

**29. How do I find out the exact price for Black Forest Labs' enterprise FLUX licensing?**
Contact BFL's sales team directly through their pricing/licensing page — exact enterprise and professional-tier pricing isn't published publicly.

**30. How do I decide between FLUX, Midjourney, and Nano Banana for a new agency project?**
Weigh licensing cost and complexity (FLUX schnell is simplest and free; Midjourney requires a paid tier matched to your revenue; Gemini has use-case and regional restrictions) against your specific need for quality, ease of use, and legal risk tolerance (particularly around Midjourney's active litigation).

**31. Is there a meaningful quality difference between FLUX, Midjourney, and Nano Banana that affects the commercial-use decision?**
This research focused specifically on licensing, ownership, and legal-risk terms rather than image-quality benchmarking; quality comparisons weren't independently verified here and shouldn't be assumed from this article.

**32. Does using an AI image generator's output still require model-release or IP clearance for recognizable people or brands depicted?**
This wasn't directly addressed by the licensing terms reviewed here, which cover the AI provider's own commercial-use grant, not third-party rights (e.g., a real person's likeness) that might separately apply to specific generated content — that's a separate legal consideration from AI licensing terms.

**33. Do these commercial terms apply retroactively to images I generated before understanding the license?**
The license terms in effect at the time you generated and are using the content typically govern that use; this research didn't find specific retroactive-enforcement provisions in any of the three providers' terms, but a definitive answer would require reviewing the exact terms version in effect when you generated the content.

**34. Are there jurisdiction-specific commercial restrictions beyond the EEA/UK/Switzerland rule for Gemini?**
Google's terms specifically single out the EEA, Switzerland, and the UK for the Paid Services requirement; this research didn't find equivalent jurisdiction-specific terms documented for FLUX or Midjourney beyond general company-revenue thresholds.

**35. Can I use these AI image tools to generate images that will be trademarked as a logo?**
Ownership-of-output terms for all three providers generally support using generated images in commercial branding, but trademark registrability is a separate legal question (governed by trademark law and originality/distinctiveness requirements) that this research didn't independently address.

**36. Midjourney vs Flux — which is better for commercial use?**
FLUX (specifically the schnell variant) offers simpler, free commercial licensing with no documented active litigation; Midjourney requires a paid, revenue-tiered subscription and carries current, unresolved copyright litigation — a meaningfully different risk and cost profile.

**37. Flux vs Nano Banana — which has better commercial terms?**
FLUX.1 [schnell]'s free Apache 2.0 license is simpler and more permissive than Gemini's free tier, which restricts consumer-facing use and imposes a Paid Services requirement in the EEA, UK, and Switzerland specifically.

**38. Midjourney vs Nano Banana commercial — which carries more legal risk?**
Midjourney carries documented, active litigation risk (Disney, Universal, Warner Bros. Discovery, and an artist class action); no comparable active litigation against Google's Gemini/Nano Banana was found in this research.

**39. Flux Schnell vs Flux Dev vs Flux Pro — how do the licenses actually differ?**
Schnell is Apache 2.0 (free, commercial-ready); Dev is non-commercial by default (requires a paid BFL license for commercial use); Pro is proprietary and API-only, accessed through BFL's paid infrastructure directly.

**40. Which is cheaper for a small agency: Midjourney's Pro plan or a FLUX.2 Professional license?**
Midjourney's Pro plan has a published price ($60/month); Black Forest Labs doesn't publish Professional-tier pricing publicly, so a direct cost comparison isn't possible from public information alone — you'd need to contact BFL sales for a quote.

**41. I used FLUX.1 [dev] for a paid client project without buying a commercial license — is that a problem?**
Yes — Dev ships non-commercial by default, so commercial use without purchasing BFL's separate commercial license is a license violation, not a gray area.

**42. My company just crossed $1M in revenue and we're still on Midjourney Standard — are we out of compliance?**
Per Midjourney's own terms, companies over $1M in gross annual revenue are required to use Pro or Mega for lawful commercial use — staying on Standard past that threshold would put you out of compliance with their stated terms.

**43. My client noticed a watermark on an image I delivered from Nano Banana — what happened?**
Google's Gemini image tools apply SynthID, both invisible and visible, to generated/edited images — this is expected behavior, not a bug, and worth disclosing to clients proactively before delivery.

**44. I'm worried about using Midjourney for a project that might resemble a copyrighted character — what should I do?**
Given the active Disney/Universal and Warner Bros. Discovery litigation specifically about output resembling protected characters, avoid prompts referencing existing copyrighted IP and consider using FLUX instead for that specific type of work.

**45. I can't find Black Forest Labs' exact commercial license pricing anywhere — is that normal?**
Yes — BFL doesn't publish exact pricing for its Professional and Enterprise tiers; you need to contact their sales team directly for a quote.

**46. Which AI image generator should I choose for ongoing client work: Midjourney, Flux, or Nano Banana?**
If minimizing licensing complexity and legal risk is the priority, FLUX.1 [schnell] has the simplest, free, litigation-free commercial terms documented here; Midjourney offers a more established creative tool but at higher cost and documented legal risk; Nano Banana suits professional/business integrations but isn't positioned for consumer-facing products on its free tier.

**47. Is it worth paying for Black Forest Labs' enterprise FLUX license instead of just using Midjourney?**
That depends on your specific volume, client count, and risk tolerance — BFL's Professional tier is explicitly built for agencies serving multiple clients, which may be more cost-effective at scale than multiple Midjourney seats, but exact pricing requires contacting BFL directly to compare.

**48. Should a branding agency standardize on one AI image model for client deliverables?**
Given the licensing complexity shown in this comparison, standardizing on a model with clear, simple, low-risk commercial terms (like FLUX.1 [schnell] for lower-stakes work, with a BFL commercial license or Midjourney's Pro/Mega for higher-stakes projects) reduces the chance of a licensing mistake across a team.

**49. Where can I get a definitive answer on which license applies to my specific use case?**
Go directly to the provider's own current terms (BFL's licensing page, Midjourney's plan comparison article, or Google's Gemini API terms) rather than relying on any summary article, including this one, for a decision with real legal or financial stakes.

**50. Who can help me figure out the right AI image tooling and licensing setup for my brand's ongoing content needs?**
That's a scoping question a [branding and design](/services/ui-ux-design-branding) partner can help work through alongside your actual content volume and client base, since the right choice depends on your specific commercial exposure, not just a generic recommendation.

## Key takeaways

- Only FLUX.1 [schnell] is genuinely free for commercial use (Apache 2.0); FLUX.1 [dev] requires a separate paid license, and FLUX.1 [pro] is proprietary API access.
- Midjourney requires a paid subscription for any commercial use, with companies over $1M in revenue required to use Pro or Mega specifically — and it carries active, unresolved copyright litigation from artists, Disney/Universal, and Warner Bros. Discovery.
- Google doesn't claim ownership of Nano Banana/Gemini output, but restricts free-tier use to non-consumer-facing professional/business purposes and requires Paid Services for commercial deployment in the EEA, UK, and Switzerland.
- Nano Banana images carry Google's SynthID watermark, both invisible and visible — worth disclosing to clients before delivery.
- For agencies specifically weighing legal risk, FLUX currently has no documented active litigation, while Midjourney's is real, current, and specifically concerns the kind of output-resemblance risk that matters most for commercial client work.

## Relevant tools.scult.in resources

The [Midjourney](/prompts/midjourney), [Flux](/prompts/flux), and [Nano Banana](/prompts/nano-banana) prompt libraries are a practical place to start once you've settled on the model that fits your commercial licensing needs, so your prompting approach matches the tool you're actually cleared to use for client work.

Given how much the "right" model choice here depends on your specific client mix, revenue scale, and risk tolerance — not just a generic recommendation — this is exactly the kind of decision worth folding into a broader conversation with a [branding and design](/services/ui-ux-design-branding) team about how AI-generated visuals fit into your production pipeline going forward.

## Sources

- https://github.com/black-forest-labs/flux
- https://en.wikipedia.org/wiki/FLUX.1
- https://bfl.ai/pricing/licensing
- https://ai.google.dev/gemini-api/terms
- https://gemini.google/overview/image-generation/
- https://en.wikipedia.org/wiki/Midjourney
- https://www.eesel.ai/blog/midjourney-pricing
