---
id: article_042
title: "Healthcare Website Compliance Requirements: HIPAA, FTC, and ADA Explained"
slug: healthcare-website-compliance-requirements
description: "What actually separates a healthcare or wellness site's legal exposure from a normal small business site — HIPAA tracking rules, FTC oversight, and ADA accessibility."
primary_keyword: healthcare website compliance requirements
secondary_keywords: [hipaa website compliance, wellness website compliance, medical practice website requirements, health breach notification rule]
intent: Problem-solving
audience: "Healthcare providers (clinics, practices, hospitals), telehealth and wellness-app founders, and the agencies/developers building websites for them, especially non-HIPAA-covered wellness businesses unaware they may still face FTC oversight"
topic_cluster: "Healthcare & Wellness Website Legal Compliance"
countries: ["United States"]
author: "SCULT.IN Content Engine"
review_status: draft
last_verified: "2026-08-21"
sources: [
  "https://www.hipaajournal.com/ocr-website-tracking-technology-without-baa-hipaa-violation/",
  "https://www.hipaajournal.com/noncompliant-use-of-website-tracking-technologies-is-an-enforcement-priority-for-ocr/",
  "https://www.hipaajournal.com/96pc-hospital-websites-tracking-technologies-2024/",
  "https://www.hipaajournal.com/mount-nittany-health-sued-over-alleged-website-tracking-code-phi-disclosures/",
  "https://www.hipaajournal.com/banner-health-lifestance-health-group-pixel-settlements/",
  "https://www.hipaajournal.com/court-approves-ftc-settlement-goodrx/",
  "https://www.hipaajournal.com/goodrx-25-million-settlement-tracking-technology-lawsuit/",
  "https://www.hipaajournal.com/ftc-health-breach-notification-rule-final-rule-2024/",
  "https://www.ada.gov/resources/web-guidance/",
  "https://www.feroot.com/blog/hipaa-website-compliance-checklist/"
]
---

# Healthcare Website Compliance Requirements: What Actually Applies to You

A healthcare or wellness website faces three separate, stackable sources of legal exposure that an ordinary small business site doesn't: HIPAA (if you're a "covered entity" or business associate), FTC oversight via the Health Breach Notification Rule (which now explicitly covers non-HIPAA health apps and wellness sites too), and ADA Title III web accessibility rules. The single most common and most expensive mistake across all three is running standard analytics or ad pixels — Google Analytics, Meta Pixel — without controlling what data they collect.

## Table of contents

- The three-layer compliance problem, explained
- HIPAA and website tracking technology
- FTC oversight for non-covered wellness businesses
- ADA Title III and medical practice websites
- Practical examples
- Data and evidence
- Comparisons: HIPAA vs. FTC, and covered vs. non-covered
- Real-world use cases
- Common mistakes
- Best practices
- Frequently asked questions
- Key takeaways
- Relevant tools.scult.in resources
- Sources

## The three-layer compliance problem, explained

A generic small-business website's biggest legal risks are usually contract disputes, basic privacy-policy accuracy, and maybe a cookie banner. A healthcare or wellness site carries all of that, plus three additional and largely independent legal exposures:

1. **HIPAA** — applies if you're a "covered entity" (a healthcare provider, health plan, or clearinghouse) or a "business associate" handling protected health information (PHI) on a covered entity's behalf.
2. **The FTC's Health Breach Notification Rule** — applies to health apps and wellness technologies that are explicitly **not** HIPAA-covered entities, closing a gap that used to let non-clinical health/wellness businesses operate with essentially no federal privacy oversight.
3. **ADA Title III** — general web accessibility law that applies to any business open to the public, but named explicitly by the DOJ with hospitals and medical offices as covered examples.

These three don't overlap cleanly, which is exactly why healthcare-adjacent businesses get compliance wrong: a wellness app founder who correctly determines they're not a HIPAA covered entity can still be wrong to conclude they have no health-privacy exposure, because the FTC rule was updated specifically to catch that gap ([HIPAA Journal](https://www.hipaajournal.com/ftc-health-breach-notification-rule-final-rule-2024/)).

## HIPAA and website tracking technology

This is the single most consequential, most litigated compliance issue for healthcare websites right now, and it is squarely about ordinary marketing and analytics tools most businesses install without a second thought.

**The core rule.** In December 2022, HHS's Office for Civil Rights (OCR) issued guidance confirming that deploying third-party tracking technologies — Google Analytics, Meta Pixel, and similar tools — **without a signed Business Associate Agreement (BAA)** is a HIPAA violation whenever individually identifiable health information is involved ([HIPAA Journal](https://www.hipaajournal.com/ocr-website-tracking-technology-without-baa-hipaa-violation/)).

**It's an active enforcement priority, not a one-off guidance memo.** OCR followed up in April 2023, explicitly naming noncompliant use of website tracking technologies as an active enforcement priority against covered entities ([HIPAA Journal](https://www.hipaajournal.com/noncompliant-use-of-website-tracking-technologies-is-an-enforcement-priority-for-ocr/)).

**The scale of the problem is enormous.** An analysis found that **96% of non-federal acute care hospital websites** use tracking technology that transmits visitor data to third parties including Meta, Google, LinkedIn, and Snapchat ([HIPAA Journal](https://www.hipaajournal.com/96pc-hospital-websites-tracking-technologies-2024/)). That statistic means the exposure described in this article isn't a hypothetical edge case — it's close to the industry default.

**What a Business Associate Agreement actually does.** A BAA is a contract that binds a vendor (an analytics provider, a scheduling widget, a hosting company) to HIPAA's rules whenever that vendor might process PHI on a covered entity's behalf. Standard consumer analytics and advertising tools are not built with healthcare BAAs available by default — Google and Meta's standard advertising products, for instance, are not offered as HIPAA-compliant tools with a signed BAA in the way a purpose-built healthcare analytics vendor would be. Installing them without one is the specific violation OCR flagged.

## FTC oversight for non-covered wellness businesses

The single biggest misconception in this space is: *"I'm not a hospital or a doctor's office, so HIPAA doesn't apply to me, and therefore I have no health-privacy compliance exposure."* The first half of that sentence is often true. The second half is not, and the case that proved it is now a matter of public record.

**GoodRx.** GoodRx is not a HIPAA-covered entity — it's a prescription discount and telehealth-adjacent platform, not a health plan or provider. The FTC pursued it anyway, under the FTC Act and the Health Breach Notification Rule, for sharing health data with advertisers. GoodRx settled for **$1.5 million** in one action, and separately agreed to a related tracking-technology class-action settlement reported at **$25 million** — later court proceedings reportedly revisited and revised that figure, so treat the exact final dollar amount as unsettled rather than closed, while the underlying enforcement fact (GoodRx being pursued and paying real money on both fronts) is not in dispute ([HIPAA Journal](https://www.hipaajournal.com/court-approves-ftc-settlement-goodrx/); [HIPAA Journal](https://www.hipaajournal.com/goodrx-25-million-settlement-tracking-technology-lawsuit/)).

**The rule got formally extended in 2024.** The FTC finalized an update to the Health Breach Notification Rule that explicitly extends it to health apps and technologies **outside HIPAA's scope** — closing, by regulation, exactly the gap that let a business argue "we're not a covered entity, so this doesn't apply to us" ([HIPAA Journal](https://www.hipaajournal.com/ftc-health-breach-notification-rule-final-rule-2024/)).

**What this means practically.** If you run a wellness app, a fitness platform, a mental-health-adjacent product, a supplement or nutrition business, or any site that collects health-relevant information but isn't a licensed medical provider, you likely fall outside HIPAA — but you may still fall squarely inside the FTC's Health Breach Notification Rule and general FTC Act unfairness/deception authority. The GoodRx settlements establish that this isn't theoretical: it's an actively enforced area with eight-figure settlement precedent.

## ADA Title III and medical practice websites

The third layer is accessibility, and it's the one most often treated as optional by small healthcare practices.

**The rule.** DOJ guidance states that businesses open to the public — explicitly including hospitals and medical offices as examples — must ensure their websites provide full and equal access. Practically, that means alt text on images, captions, accessible forms, keyboard navigation, sufficient color contrast, and resizable text ([ADA.gov](https://www.ada.gov/resources/web-guidance/)).

**It's general guidance, not healthcare-specific rules layered on top.** The DOJ guidance doesn't create extra healthcare-specific web accessibility standards beyond the general Title III bar — it simply names hospitals and medical offices as examples of the kind of public-facing business the general standard applies to ([ADA.gov](https://www.ada.gov/resources/web-guidance/)).

**Why medical practices are a disproportionate target.** ADA web-accessibility lawsuit filings have grown sharply in recent years, with specialized firms proactively scanning sites for accessibility defects and sending remediation-or-litigation demand letters. A specific "roughly 200%" increase figure circulating in practitioner discussion (an accessibility engineer's anecdotal comment on a public forum) has no traceable underlying data source or methodology behind it, so it is omitted here as **evidence not sufficiently verified** rather than repeated as a number. The directional pattern — more filings, more proactive scanning — is well documented by accessibility-law firms' own case-volume reporting, even without a precise industry-wide percentage. Medical practice websites are attractive targets for this pattern specifically because they tend to have public-facing, transaction-like features — appointment booking, patient portals, intake forms — that are exactly the kind of interactive element scanning tools flag most easily when it's inaccessible.

## Practical examples

**Real, sourced example — Mount Nittany Health.** Mount Nittany Health agreed to an **$1.8 million settlement** after tracking code on its website allegedly disclosed data for roughly **74,000 patients** to Meta and Google ([HIPAA Journal](https://www.hipaajournal.com/mount-nittany-health-sued-over-alleged-website-tracking-code-phi-disclosures/)). This is the exact mechanism described above — standard marketing pixels, no BAA, PHI in scope — playing out as an actual dollar figure and an actual patient count, not a hypothetical.

**Real, sourced example — Banner Health and LifeStance Health Group.** Both settled separate tracking-technology lawsuits following the same pattern: web analytics or ad pixels present on pages where patients entered identifiable health information, without the vendor agreements HIPAA requires ([HIPAA Journal](https://www.hipaajournal.com/banner-health-lifestance-health-group-pixel-settlements/)).

**Illustrative example (hypothetical, clearly labeled) — a solo therapy practice's booking page.** A single-therapist private practice runs a scheduling widget on its site where a prospective client selects "anxiety," "couples counseling," or "trauma" from a dropdown before booking, and the practice has Google Analytics installed with default settings. That combination — a page where a health condition or reason-for-visit is selectable, sitting behind a standard analytics tag with no BAA — is structurally the same violation pattern as the Mount Nittany case, just at a much smaller scale. The size of the practice does not change whether the underlying rule applies.

## Data and evidence

- **96%** of non-federal acute care hospital websites use tracking technology that shares visitor data with third parties ([HIPAA Journal](https://www.hipaajournal.com/96pc-hospital-websites-tracking-technologies-2024/)).
- Mount Nittany Health: **$1.8 million** settlement, roughly **74,000 patients** affected ([HIPAA Journal](https://www.hipaajournal.com/mount-nittany-health-sued-over-alleged-website-tracking-code-phi-disclosures/)).
- GoodRx (non-HIPAA-covered): **$1.5 million** FTC settlement, plus a separate **$25 million** settlement in related litigation ([HIPAA Journal](https://www.hipaajournal.com/court-approves-ftc-settlement-goodrx/); [HIPAA Journal](https://www.hipaajournal.com/goodrx-25-million-settlement-tracking-technology-lawsuit/)).
- OCR named noncompliant tracking-technology use an active enforcement priority in April 2023 — this is not a dormant, rarely-enforced rule ([HIPAA Journal](https://www.hipaajournal.com/noncompliant-use-of-website-tracking-technologies-is-an-enforcement-priority-for-ocr/)).
- ADA web-accessibility lawsuit filings have grown sharply in recent years and specialized firms are proactively scanning sites for defects — but a precise industry-wide percentage increase (a "200%" figure sometimes cited in online practitioner discussion) has no traceable government or peer-reviewed data source behind it, so it's treated here as **evidence not sufficiently verified** rather than repeated as fact.
- On exact ADA lawsuit counts specific to medical practices, and on precise per-site remediation costs for HIPAA-compliant analytics setups: **evidence not sufficiently verified** — the sources reviewed establish the pattern and named case settlements but don't provide an industry-wide cost benchmark.
- Proposed 2026 HIPAA Security Rule updates would eliminate the "addressable vs. required" distinction (making all safeguards mandatory), require encryption for all ePHI, require multi-factor authentication, and add biannual vulnerability scanning and annual penetration testing ([Feroot](https://www.feroot.com/blog/hipaa-website-compliance-checklist/)) — note this is described as a **proposed** update; confirm current final-rule status before treating any specific requirement as already in force.

## Comparisons

**HIPAA vs. the FTC's Health Breach Notification Rule.** HIPAA applies to covered entities (providers, plans, clearinghouses) and their business associates, and is enforced by HHS OCR. The Health Breach Notification Rule applies to vendors of personal health records and related health apps/technologies that are **not** HIPAA-covered, and is enforced by the FTC. They're not alternatives to each other — a business can be subject to one, the other, both, or (rarely) neither, and the GoodRx case is the clearest evidence that "not HIPAA-covered" does not mean "not regulated."

**Covered entity vs. non-covered wellness app.** A covered entity's exposure runs through OCR enforcement, BAAs, and breach notification under HIPAA. A non-covered wellness app's exposure runs through the FTC Act's general unfairness/deception authority plus the updated Health Breach Notification Rule. The practical compliance work — controlling what your tracking pixels actually collect and transmit — ends up nearly identical in both cases, even though the legal basis differs.

**"Compliance as a service" badges vs. real documentation.** The broader "compliance as a service" software category (covering SOC 2, HIPAA, and similar certifications) has drawn public scrutiny for selling a certification badge without the underlying audit rigor behind it — most notably a well-funded, Y Combinator-backed compliance-automation startup that left the YC network in 2026 amid public allegations of fabricated audit evidence and copy-paste controls documentation. That controversy was about compliance tooling broadly, not a healthcare-specific case, but the underlying lesson transfers directly: a badge or certification claim is not a substitute for a documented Security Risk Analysis and signed BAAs with every vendor touching PHI, and buyers should ask to see that underlying documentation rather than accepting a compliance logo at face value.

## Real-world use cases

- **A multi-location hospital system** — the 96% tracking-technology prevalence statistic means this is the default posture, not an outlier; a hospital system auditing its own site is more likely than not to find the exact issue OCR has flagged.
- **A solo telehealth or therapy practice** — smaller scale, but the same underlying tracking-pixel-without-BAA pattern applies, and settlement precedent doesn't distinguish by practice size, only by the mechanism of the violation.
- **A wellness/fitness app founder who isn't a covered entity** — the GoodRx precedent and the 2024 rule update are the specific reason "we're not HIPAA-covered" is not, on its own, a complete compliance answer.
- **An agency or developer building a healthcare client's website** — the ADA accessibility requirements apply regardless of who builds the site, and a developer who ships an inaccessible booking form or patient intake page creates legal exposure for the client that has nothing to do with HIPAA or the FTC.

## Common mistakes

- **Installing Google Analytics or Meta Pixel with default settings on any page where a patient/user might enter health-relevant information**, without a BAA in place — the single most common and most litigated mistake described above.
- **Assuming "we're not a covered entity" ends the analysis.** The GoodRx precedent and the 2024 FTC rule update specifically closed this gap for wellness and health-app businesses.
- **Treating ADA accessibility as a "nice to have" rather than a legal requirement** for a business open to the public — DOJ guidance names hospitals and medical offices explicitly.
- **Relying on a compliance badge or third-party certification** in place of an actual documented Security Risk Analysis and signed BAAs with every relevant vendor.
- **Not auditing third-party scripts (chat widgets, schedulers, CDNs, ad pixels) as a group** — any of them executing code in a patient's browser is in scope for the same tracking-technology analysis, not just the obvious analytics tags.
- **Missing employee training and documentation** — cited as one of the most common gaps small healthcare businesses have alongside missing Risk Analyses and missing BAAs.

## Best practices

- Audit every third-party script currently running on the site — analytics, ad pixels, chat widgets, schedulers, CDNs — and determine for each one whether it could be exposed to individually identifiable health information.
- Get a signed BAA with any vendor whose tool could touch PHI, or remove/reconfigure the tool so it structurally can't.
- If you're not a HIPAA-covered entity, don't stop there — assess your exposure under the FTC's Health Breach Notification Rule and general FTC Act authority, since that gap is now explicitly closed for health-adjacent, non-covered businesses.
- Run the site through an accessibility check against WCAG-aligned criteria — alt text, captions, keyboard navigation, color contrast, resizable text — and treat findings as legal risk items, not just UX polish.
- Document a formal Security Risk Analysis, even if you're small — it's one of the three most common gaps behind small-business enforcement actions.
- Treat compliance as ongoing, not a one-time setup — new tracking tools, new integrations, and evolving regulation (like the 2026 proposed HIPAA Security Rule updates) mean this needs periodic re-review.
- If a compliance vendor's pitch is primarily a badge or certification mark, ask specifically for the underlying documentation (Risk Analysis, signed BAAs, audit trail) rather than accepting the badge as sufficient on its own.

## Frequently asked questions

**Beginner**

1. **What makes a healthcare website legally different from a normal small business site?** Three added layers of exposure: HIPAA (if covered), the FTC's Health Breach Notification Rule (which now covers non-HIPAA health/wellness tech too), and ADA Title III accessibility requirements named explicitly for medical practices ([ADA.gov](https://www.ada.gov/resources/web-guidance/)).
2. **Is my wellness website HIPAA compliant just because I don't handle medical records?** Not handling medical records may mean HIPAA doesn't apply, but it does not automatically mean you have no health-privacy compliance exposure — see the FTC section above.
3. **What is HIPAA, in one sentence?** A US federal law governing how protected health information is handled by covered entities (providers, plans, clearinghouses) and their business associates.
4. **What is the Health Breach Notification Rule?** An FTC rule requiring notification after a breach of unsecured personal health records, now explicitly updated to cover health apps and technologies outside HIPAA's scope ([HIPAA Journal](https://www.hipaajournal.com/ftc-health-breach-notification-rule-final-rule-2024/)).
5. **What is a Business Associate Agreement (BAA)?** A contract binding a vendor to HIPAA's requirements whenever it may process PHI on a covered entity's behalf; OCR's 2022 guidance treats tracking tools used without one as a violation ([HIPAA Journal](https://www.hipaajournal.com/ocr-website-tracking-technology-without-baa-hipaa-violation/)).
6. **Does ADA Title III apply to my medical practice's website?** Yes, in the same way it applies to any business open to the public — DOJ guidance names hospitals and medical offices as covered examples ([ADA.gov](https://www.ada.gov/resources/web-guidance/)).
7. **Is using Google Analytics on a healthcare website automatically illegal?** Not automatically — it's the combination of tracking + individually identifiable health information + no BAA that OCR has flagged as a violation, not analytics tools in general.
8. **Do I need a lawyer to figure this out, or can I DIY it?** Given the settlement amounts and multi-layer exposure described here, professional legal review is strongly advisable before assuming any DIY compliance approach is sufficient — this article is not legal advice.
9. **Is HIPAA only about medical records stored in a database?** No — OCR's guidance explicitly covers website tracking technology, meaning exposure can exist even if you never store a formal medical record.
10. **What's the very first thing I should check on my own healthcare-adjacent website?** Which third-party scripts (analytics, ad pixels, chat, schedulers) are currently running, and whether any of them sit on a page where health-relevant information could be entered.

**Core understanding**

11. **Why is website tracking technology specifically such a big HIPAA issue right now?** Because OCR named it an active enforcement priority in 2023, and because an analysis found 96% of hospital websites already run tracking tech that shares data with third parties ([HIPAA Journal](https://www.hipaajournal.com/noncompliant-use-of-website-tracking-technologies-is-an-enforcement-priority-for-ocr/); [HIPAA Journal](https://www.hipaajournal.com/96pc-hospital-websites-tracking-technologies-2024/)).
12. **What counts as "individually identifiable health information" on a website?** Broadly, any information that could let a tracking recipient connect a specific person to specific health-related content or actions they took on the site — e.g., which condition-specific page they visited, or what they selected on a booking form.
13. **Does HIPAA cover the website itself, or just the backend systems?** Both — OCR's 2022 guidance is specifically about front-end website tracking technology, not just backend database or EHR systems.
14. **Why did the FTC pursue GoodRx if HIPAA didn't apply to it?** Because the FTC Act's general unfairness/deception authority and the Health Breach Notification Rule gave it separate legal grounds, independent of HIPAA coverage ([HIPAA Journal](https://www.hipaajournal.com/court-approves-ftc-settlement-goodrx/)).
15. **What changed in the 2024 FTC rule update specifically?** It finalized language explicitly extending the Health Breach Notification Rule to health apps and technologies outside HIPAA's scope ([HIPAA Journal](https://www.hipaajournal.com/ftc-health-breach-notification-rule-final-rule-2024/)).
16. **Does the ADA create healthcare-specific website rules?** No — it's general Title III guidance; hospitals and medical offices are named only as examples of the kind of public-facing business the general rule covers ([ADA.gov](https://www.ada.gov/resources/web-guidance/)).
17. **Why are ADA web-accessibility lawsuits reportedly increasing so much?** Specialized firms are proactively scanning websites for accessibility defects and sending remediation-or-litigation demand letters — filing volume is well-documented as rising sharply, though a precise industry-wide percentage isn't independently verified (see the note in the ADA section above).
18. **Is a compliance badge from a "compliance as a service" vendor enough on its own?** No — the wider compliance-automation software category has already faced a public scandal over exactly this (a YC-backed startup accused of fabricating audit evidence behind its badges in 2026); a Risk Analysis and signed BAAs are what actually constitute compliance, not a certification logo.
19. **What's the relationship between a data breach and the Health Breach Notification Rule?** The rule requires notification specifically after a breach of unsecured personal health records held by covered vendors of personal health records and related apps — it's a breach-response obligation, not a general operating license.
20. **Is this compliance area actively enforced or mostly theoretical?** Actively enforced — OCR's named enforcement priority, the multiple hospital-system settlements, and the GoodRx settlements are all real, dated enforcement actions, not theoretical risk.

**Practical / how-to**

21. **How do I make a healthcare website HIPAA compliant?** Audit and control third-party tracking, get BAAs with any vendor that could touch PHI, complete a Security Risk Analysis, implement technical/administrative/physical safeguards, and document everything ([Feroot](https://www.feroot.com/blog/hipaa-website-compliance-checklist/)).
22. **How do I audit my website's tracking pixels for HIPAA compliance?** List every third-party script currently loading on the site, identify what data each one can access, and check whether any could reach a page where health-relevant information is entered.
23. **How do I make a medical website ADA accessible?** Add alt text to images, captions to video/audio, ensure forms and navigation work via keyboard alone, meet color-contrast standards, and allow text resizing ([ADA.gov](https://www.ada.gov/resources/web-guidance/)).
24. **How do I know if my wellness app needs to worry about the Health Breach Notification Rule?** If you collect health-relevant personal information and aren't a HIPAA-covered entity, assume you may be in scope given the 2024 rule update, and get that assessed specifically.
25. **How do I get a Business Associate Agreement with a vendor?** Request one directly from the vendor before or immediately after implementation — many enterprise-grade healthcare vendors offer a standard BAA; general-purpose consumer tools often do not, which is itself a signal to reconsider using them.
26. **How do I remove tracking risk without losing analytics entirely?** Reconfigure or replace tools so they don't have access to identifiable health information — options include restricting what data reaches the tracking tool, using healthcare-specific analytics vendors that offer BAAs, or removing tracking from pages where health information is entered.
27. **How do I document a Security Risk Analysis if I'm a small practice with no compliance staff?** Start from the core checklist components — risk analysis, administrative/physical/technical safeguards, BAAs, breach procedures — and document each explicitly rather than assuming informal practice constitutes compliance.
28. **How often should I re-check my site's compliance posture?** Treat it as ongoing — new integrations, new tracking tools, and regulatory changes (like the proposed 2026 HIPAA Security Rule updates) all reset the analysis.
29. **How do I check if my current CDN or hosting setup creates HIPAA exposure?** Any browser-executed code from a CDN counts the same as any other third-party script for this analysis — audit it the same way as analytics and ad pixels.
30. **How do I train staff on this if I don't have a compliance department?** Document basic policies (what tools are approved, what can't be installed without review) and confirm staff have read and acknowledged them — missing documented training is one of the most common small-business enforcement gaps.

**Advanced**

31. **What's changing in the proposed 2026 HIPAA Security Rule update?** Elimination of the "addressable vs. required" distinction (making all safeguards mandatory), mandatory encryption for all ePHI, mandatory multi-factor authentication, required asset inventories, biannual vulnerability scanning, and annual penetration testing ([Feroot](https://www.feroot.com/blog/hipaa-website-compliance-checklist/)) — confirm current final-rule status, since this was described as a proposed update.
32. **Does encrypting data in transit (HTTPS) satisfy HIPAA's technical safeguards on its own?** No — HTTPS addresses transmission security but doesn't substitute for a full Risk Analysis, access controls, BAAs, and the other required safeguards.
33. **How does multi-tenant or third-party-hosted infrastructure change the compliance picture?** It adds another layer of BAA requirements — the hosting/infrastructure vendor itself needs an agreement if PHI could pass through its systems.
34. **Can a covered entity be liable for a business associate's tracking-technology mistake?** Generally yes in substance — the covered entity's obligation to have a BAA and oversee compliant use exists precisely because liability doesn't simply disappear by outsourcing the function.
35. **Is there a meaningful difference in exposure between a static informational site and an interactive patient portal?** Yes — an interactive portal or booking system where users actively enter health-relevant information carries substantially higher tracking-technology risk than a purely informational brochure site with no forms.

**Comparison**

36. **HIPAA vs. the FTC Health Breach Notification Rule — which applies to me?** HIPAA applies if you're a covered entity or business associate; the FTC rule applies to health apps/technologies outside HIPAA's scope — check both rather than assuming one excludes the other.
37. **Covered entity vs. non-covered wellness app — is the practical compliance work really different?** Not as different as the legal labels suggest — both end up needing to control third-party tracking around health-relevant data, just under different enforcing agencies and legal bases.
38. **"Compliance as a service" software vs. doing it yourself with a lawyer/consultant?** A service can speed up implementation, but given the scrutiny the category has faced over unverified audit claims, it should still produce the same underlying documentation (Risk Analysis, BAAs) a DIY approach with proper legal guidance would — a badge alone isn't a substitute for either.
39. **Standard Google Analytics vs. a healthcare-specific analytics vendor?** Healthcare-specific vendors are more likely to offer a signed BAA and to be built with PHI-handling controls in mind; standard consumer analytics tools generally are not.
40. **General small-business ADA compliance vs. medical-practice-specific accessibility needs?** The legal standard is the same general Title III bar; medical practices simply face higher real-world enforcement attention because of interactive features like booking and intake forms that scanning tools flag easily.

**Problem/troubleshooting**

41. **I just realized my site has Meta Pixel installed on a symptom-checker page — what do I do first?** Remove or disable the pixel on that page immediately, then assess retroactively whether a breach notification obligation may exist, with legal counsel involved given the settlement precedent described above.
42. **We got a demand letter about ADA accessibility — is this legitimate?** These campaigns are a documented, widespread pattern of proactive scanning and demand letters (see the ADA section above); legitimacy of a specific letter should still be assessed with counsel, but the broader pattern itself is real and well-documented even without a precise industry-wide percentage figure.
43. **We don't have a signed BAA with our analytics vendor and can't get one — now what?** Remove or reconfigure the tool so it doesn't have access to identifiable health information, since a BAA-less setup with PHI exposure is the exact violation OCR has flagged.
44. **Our compliance vendor only gave us a badge, no documentation — is that a red flag?** Yes — treat the absence of a Risk Analysis, signed BAAs, and audit documentation as the actual gap, regardless of what badge or certification is displayed.
45. **We're a wellness app, not a covered entity, and just got an FTC inquiry — how is that possible?** The 2024 rule update and GoodRx precedent specifically established that non-HIPAA-covered health/wellness businesses remain within FTC authority — this is the mechanism, not a mistake on the FTC's part.

**Commercial/decision**

46. **Should I hire a HIPAA compliance consultant or handle this internally?** Given the settlement amounts (six to eight figures) and the multi-layer legal exposure described here, professional guidance is advisable for any practice beyond the smallest solo operation.
47. **Is HIPAA-compliant hosting worth paying for?** It removes one layer of infrastructure-level risk (BAA coverage at the hosting level) but doesn't substitute for auditing your own front-end tracking tools, which is where most documented violations originate.
48. **Should I just remove all analytics from my healthcare website to avoid the risk entirely?** An option, but overcorrecting removes valuable operational data; the more targeted fix is controlling what data reaches tracking tools and getting BAAs where needed, not eliminating measurement altogether.
49. **Is an accessibility audit worth the cost proactively, or should I wait for a complaint?** Given the documented rise in proactive scanning and demand letters, an audit before a complaint arrives is generally the lower-cost path.
50. **Who should build or fix a compliant healthcare website — a generalist web developer or a healthcare-specific agency?** Either can do it correctly if they understand all three layers described in this article (HIPAA tracking, FTC scope, ADA accessibility) — the risk is a generalist builder who only thinks about design and misses the compliance layer entirely.

## Key takeaways

- Healthcare and wellness websites carry three separate, stackable compliance exposures beyond what a normal small business site faces: HIPAA, the FTC's Health Breach Notification Rule, and ADA Title III accessibility.
- Standard analytics and ad pixels (Google Analytics, Meta Pixel) without a BAA are the most common and most litigated HIPAA violation — and 96% of hospital websites already run this exact risk.
- Not being a HIPAA-covered entity does not mean you're outside health-privacy regulation — the GoodRx settlements and the 2024 FTC rule update closed that gap for wellness apps and non-covered health technologies.
- Settlement amounts are real and material: $1.8M (Mount Nittany), $1.5M and $25M (GoodRx, in separate actions) — this is actively enforced, not theoretical.
- ADA Title III applies to medical practice websites under the same general standard as any public-facing business, and demand-letter campaigns targeting accessibility defects are a documented, growing pattern.
- This article is informational, not legal advice — given the stakes involved, get qualified legal counsel to review your specific setup.

## Relevant tools.scult.in resources

For structuring internal compliance documentation, disclosures, and policy language, the [Legal & Compliance prompt library](/prompts/legal-compliance) has starting points for drafting privacy policies, BAA request templates, and accessibility audit checklists — treat all output as a draft for professional legal review, not a finished compliant document.

If you're building or rebuilding a healthcare or wellness website and want the tracking, accessibility, and compliance layers handled correctly from the ground up rather than retrofitted after an OCR letter or an ADA demand shows up, that's a conversation worth having with [SCULT's web development team](https://scult.in/services/web-development) — getting this right at build time is materially cheaper than remediating it after the fact.

## Sources

- https://www.hipaajournal.com/ocr-website-tracking-technology-without-baa-hipaa-violation/
- https://www.hipaajournal.com/noncompliant-use-of-website-tracking-technologies-is-an-enforcement-priority-for-ocr/
- https://www.hipaajournal.com/96pc-hospital-websites-tracking-technologies-2024/
- https://www.hipaajournal.com/mount-nittany-health-sued-over-alleged-website-tracking-code-phi-disclosures/
- https://www.hipaajournal.com/banner-health-lifestance-health-group-pixel-settlements/
- https://www.hipaajournal.com/court-approves-ftc-settlement-goodrx/
- https://www.hipaajournal.com/goodrx-25-million-settlement-tracking-technology-lawsuit/
- https://www.hipaajournal.com/ftc-health-breach-notification-rule-final-rule-2024/
- https://www.ada.gov/resources/web-guidance/
- https://www.feroot.com/blog/hipaa-website-compliance-checklist/
