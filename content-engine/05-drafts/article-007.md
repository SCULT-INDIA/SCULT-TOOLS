---
id: article_007
title: Why FAQ Rich Results Disappeared From Google Search in 2026
slug: why-faq-schema-not-showing-rich-results
description: Google deprecated FAQ rich results in May 2026. Here's the full timeline, why it happened, and whether you should remove your FAQ schema markup.
primary_keyword: why faq schema not showing rich results
secondary_keywords: [google faq rich results deprecated, is faq schema still worth it, faq rich results removed from google search, how to check if faq schema markup is valid]
intent: Problem-solving
audience: Website owners and small-business SEOs who added FAQ schema and are confused about losing rich snippets, plus technical SEOs deciding whether FAQ markup is still worth maintaining for traditional and AI search
topic_cluster: Structured data & rich-result deprecations
countries: []
author: "SCULT.IN Content Engine"
review_status: draft
last_verified: "2026-08-21"
sources: ["https://www.searchenginejournal.com/google-drops-faq-rich-results-from-search/574429/", "https://developers.google.com/search/docs/appearance/structured-data/faqpage", "https://searchengineland.com/google-to-no-longer-support-faq-rich-results-476957", "https://developers.google.com/search/updates", "https://support.google.com/webmasters/thread/114614455/faq-rich-results-for-some-of-our-pages-suddenly-disappeared-in-april-per-search-console?hl=en", "https://www.thehoth.com/blog/google-faq-rich-results-deprecated/", "https://www.getpassionfruit.com/blog/what-changed-with-google-drops-faq-rich-results-and-what-to-do-now", "https://entropyand.co/blog/faq-schema-still-worth-it", "https://www.redsharkdigital.com/news/google-how-to-faq-rich-results-update"]
---

# Why FAQ Rich Results Disappeared From Google Search in 2026

Your FAQ rich results didn't disappear because of anything you did wrong — Google deprecated the FAQ rich-result feature entirely, for every site, effective May 7, 2026. It's a global search-appearance change, not a penalty, not a ranking change, and not a sign your markup broke. FAQPage remains a fully valid Schema.org type, and Google has confirmed that unused or now-decorative structured data doesn't cause problems for Search, so there's no need to rush to remove it.

## Table of contents

- [The exact 2026 deprecation timeline](#the-exact-2026-deprecation-timeline)
- [Why Google removed FAQ rich results](#why-google-removed-faq-rich-results)
- [What changed vs what didn't change](#what-changed-vs-what-didnt-change)
- [Should you remove FAQ schema now?](#should-you-remove-faq-schema-now)
- [Practical examples](#practical-examples)
- [Data and evidence](#data-and-evidence)
- [Comparisons](#comparisons)
- [Real-world use cases](#real-world-use-cases)
- [Common mistakes](#common-mistakes)
- [Best practices](#best-practices)
- [Frequently asked questions](#frequently-asked-questions)
- [Key takeaways](#key-takeaways)
- [Relevant tools.scult.in resources](#relevant-toolsscultin-resources)
- [Sources](#sources)

## The exact 2026 deprecation timeline

This wasn't a single overnight switch-flip — it was a phased rollout with three distinct dates, all documented in Google's own Search developer updates and corroborated by multiple industry publications:

- **May 7, 2026:** FAQ rich results stopped appearing in Google Search results entirely, for all sites globally.
- **June 2026:** The FAQ search-appearance filter and rich result report in Search Console were removed, along with FAQ support in the Rich Results Test — meaning you can no longer filter Search Console data by "FAQ" appearance or validate FAQ markup through that specific tool.
- **August 2026:** Search Console API support for FAQ-related data was removed, closing out programmatic access to whatever historical FAQ reporting existed.

This timeline is documented directly in Google's Search Central developer updates and reported by Search Engine Journal and GetPassionfruit ([Google Search Central](https://developers.google.com/search/updates); [Search Engine Journal](https://www.searchenginejournal.com/google-drops-faq-rich-results-from-search/574429/); [GetPassionfruit](https://www.getpassionfruit.com/blog/what-changed-with-google-drops-faq-rich-results-and-what-to-do-now)).

Site owners noticing FAQ rich results vanish weren't imagining it — a Google community forum thread from site owners reporting FAQ rich results "suddenly disappeared" predates the full 2026 removal and reflects the earlier, gradual restriction phase that preceded the complete deprecation ([Google Search Central Help Community](https://support.google.com/webmasters/thread/114614455/faq-rich-results-for-some-of-our-pages-suddenly-disappeared-in-april-per-search-console?hl=en)).

## Why Google removed FAQ rich results

The deprecation wasn't a sudden policy reversal — it was the final step of a multi-year phase-out. Google had already significantly restricted FAQ rich results back in **August 2023**, limiting them to well-known, authoritative government and health websites only, and the reason given at the time was widespread abuse: SEOs and site owners had been aggressively stuffing artificial FAQ blocks onto pages purely to claim the larger, more visually prominent expandable rich-result real estate in search results, regardless of whether the content genuinely warranted it ([Google's own FAQPage documentation](https://developers.google.com/search/docs/appearance/structured-data/faqpage); [The HOTH](https://www.thehoth.com/blog/google-faq-rich-results-deprecated/)).

That 2023 restriction was itself widely reported as a response to this abuse pattern — a rich-result feature that had become a target for manipulation rather than a reliable signal of genuinely useful FAQ content. The 2026 full deprecation simply completed that arc for the remaining sites that hadn't already lost eligibility in 2023.

Notably, reporting on the original August 2023 restriction ties it to a broader cleanup happening at that same time: Google fully removed How-To rich results in August 2023, the same month FAQ rich results were restricted to authoritative sites, suggesting this was part of a wider effort to simplify or reduce the number of manipulable rich-result feature types rather than an isolated decision specific to FAQ content ([RedShark Digital](https://www.redsharkdigital.com/news/google-how-to-faq-rich-results-update)). That earlier How-To removal predates the 2026 full FAQ deprecation by about three years — it's evidence of a pattern, not a claim that the two features were retired in the same 2026 rollout.

## What changed vs what didn't change

It's worth being precise here, because a lot of confused site-owner questions in this space stem from conflating two genuinely separate things:

**What changed:**
- The visual, expandable FAQ snippet no longer displays in Google Search results, for anyone.
- Search Console's FAQ-specific filter, rich result report, and Rich Results Test support were removed.
- Search Console's API access to FAQ data was removed.

**What did *not* change:**
- FAQPage remains a fully valid Schema.org structured-data type — it wasn't deprecated as a schema, only the display feature was ([Google's FAQPage docs](https://developers.google.com/search/docs/appearance/structured-data/faqpage)).
- Google explicitly stated that unused or now-decorative structured data does not cause problems for Search — leaving old FAQ schema in place isn't flagged, penalized, or treated as an error ([Search Engine Journal](https://www.searchenginejournal.com/google-drops-faq-rich-results-from-search/574429/)).
- This is a search-appearance change, not a ranking or algorithmic change — Search Engine Land's reporting is explicit that losing the rich result may affect click-through rate on pages that previously showed the expanded snippet, but it does not affect ranking position itself ([Search Engine Land](https://searchengineland.com/google-to-no-longer-support-faq-rich-results-476957)).

That last distinction matters a lot for how a business should react: if you saw a traffic dip specifically coinciding with May 2026, the more likely explanation is a click-through-rate change from losing the more eye-catching SERP snippet, not your page suddenly ranking worse.

## Should you remove FAQ schema now?

The short answer from every source reviewed is no, but with a nuanced "why."

**The technical answer is straightforward:** Google has said unused structured data doesn't cause problems for Search, so there's no functional urgency to remove FAQPage markup just because its visual payoff disappeared ([Search Engine Journal](https://www.searchenginejournal.com/google-drops-faq-rich-results-from-search/574429/)).

**The more interesting argument for actively keeping (or even adding) it is the AI-search angle.** Some practitioners report that FAQ structured data still helps AI/LLM crawlers parse Q&A content, and describe anecdotal increases in AI-referral traffic after adding FAQ schema even without the Google-specific rich snippet — though this specific claim is explicitly not independently verified at scale, and should be treated as practitioner-reported anecdote rather than a rigorously confirmed causal effect ([GetPassionfruit](https://www.getpassionfruit.com/blog/what-changed-with-google-drops-faq-rich-results-and-what-to-do-now); [Entropyand](https://entropyand.co/blog/faq-schema-still-worth-it)).

Guidance for small businesses specifically lands in a similarly mixed place: no direct Google-SERP visual benefit remains, but the markup doesn't hurt anything, and it may support clarity for AI-driven answer engines — a "keep it, don't obsess over it" recommendation rather than either "remove it" or "invest heavily in it" ([GetPassionfruit](https://www.getpassionfruit.com/blog/what-changed-with-google-drops-faq-rich-results-and-what-to-do-now)).

## Practical examples

**Real, sourced pattern:** A site owner posting in Google's own webmaster community forum reported FAQ rich results "suddenly" disappearing for some pages, tracked via Search Console — a real, documented instance of the confusion this deprecation caused among ordinary site owners before the full scope of the 2026 change was widely understood ([Google Search Central Help Community](https://support.google.com/webmasters/thread/114614455/faq-rich-results-for-some-of-our-pages-suddenly-disappeared-in-april-per-search-console?hl=en)).

**Illustrative example (hypothetical, clearly labeled):** A small business owner who added FAQ schema to their services page in 2024 specifically to get the expandable snippet notices, sometime after May 2026, that the snippet is gone and panics that their SEO markup broke. Following the guidance in this article, the correct diagnostic step is simply confirming the date against Google's known deprecation timeline (May 7, 2026) rather than assuming a site-specific technical error — and then leaving the underlying schema in place rather than removing it, since Google has confirmed it causes no harm to keep.

## Data and evidence

- FAQ rich results stopped displaying in Google Search on **May 7, 2026** ([Search Engine Journal](https://www.searchenginejournal.com/google-drops-faq-rich-results-from-search/574429/); [Google Search Central](https://developers.google.com/search/updates)).
- Search Console's FAQ filter, rich result report, and Rich Results Test support were removed in **June 2026** ([Google Search Central](https://developers.google.com/search/updates)).
- Search Console API access to FAQ data was removed in **August 2026** ([GetPassionfruit](https://www.getpassionfruit.com/blog/what-changed-with-google-drops-faq-rich-results-and-what-to-do-now)).
- FAQ rich results were already restricted to authoritative government/health sites starting **August 2023**, due to documented abuse ([Google's FAQPage docs](https://developers.google.com/search/docs/appearance/structured-data/faqpage)).
- Google has explicitly stated that unused structured data does not cause problems for Search ([Search Engine Journal](https://www.searchenginejournal.com/google-drops-faq-rich-results-from-search/574429/)).
- Search Engine Land frames this specifically as a search-appearance change, not a ranking/algorithmic change ([Search Engine Land](https://searchengineland.com/google-to-no-longer-support-faq-rich-results-476957)).
- Evidence not sufficiently verified: claims that adding/keeping FAQ schema measurably increases AI-referral traffic are practitioner-reported and anecdotal, not independently verified at scale — treat any specific traffic-lift percentage tied to FAQ schema and AI engines as unconfirmed.

## Comparisons

| Before May 2026 | After May 2026 |
|---|---|
| FAQ rich result could display as expandable snippet in Google Search | No FAQ rich result displays anywhere in Google Search, for any site |
| Search Console had a dedicated FAQ filter and rich result report | Removed (June 2026) |
| Rich Results Test validated FAQ markup | FAQ support removed from the tool (June 2026) |
| Search Console API exposed FAQ data | Removed (August 2026) |
| FAQPage schema valid and displayed visually | FAQPage schema still valid, but with no visual display feature |

FAQ rich results before versus after May 2026 is really a story of one feature's display layer being retired while its underlying markup concept persists — comparable in structure to how Google fully removed How-To rich results back in August 2023, three years earlier, as part of the same broader effort to curb abused rich-result features ([RedShark Digital](https://www.redsharkdigital.com/news/google-how-to-faq-rich-results-update)).

## Real-world use cases

- **Small business owners** who added FAQ schema years ago purely for the rich-snippet visual benefit are now deciding whether it's worth maintaining — the consensus guidance is to leave it, given zero downside and possible AI-search upside.
- **Technical SEOs auditing legacy sites** are treating this deprecation as a prompt to review FAQ content quality generally (is it genuinely useful, or was it added purely for SERP real estate) rather than a signal to strip markup reflexively.
- **Content teams weighing new FAQ content investment** are increasingly framing FAQ pages around AI-answer-engine citation value rather than the now-gone Google rich-snippet incentive, shifting the justification for the work without necessarily changing the schema implementation itself.

## Common mistakes

- **Assuming a site-specific error caused the rich result to vanish.** For nearly all site owners, this was Google's global 2026 deprecation, not a site-level markup break.
- **Rushing to remove FAQ schema.** Unnecessary — Google confirmed unused structured data doesn't hurt Search.
- **Treating the CTR drop from losing the visual snippet as a ranking drop.** Search Engine Land explicitly frames this as a search-appearance change, not a ranking change.
- **Confusing the 2023 restriction with the 2026 full deprecation.** They're related but distinct events — 2023 limited FAQ rich results to authoritative sites; 2026 removed the feature for everyone.
- **Treating AI-search benefit claims for FAQ schema as proven fact.** They're practitioner-reported and not independently verified at scale — represent them as such.

## Best practices

- Leave existing FAQPage schema in place; there's no technical or SEO reason to remove it per Google's own guidance.
- If you notice a traffic or CTR change around May 2026, first check whether it coincides with the rich-result deprecation before investigating other causes.
- Continue writing genuinely useful FAQ content rather than FAQ content designed primarily to game a now-retired rich-result feature.
- If you're investing further FAQ effort, frame the justification around AI-answer-engine citation potential rather than the now-gone Google SERP snippet.
- Keep an eye on Google's Search Central developer updates directly for any future changes to related rich-result features, since How-To rich results saw a similar contemporaneous change.

## Frequently asked questions

**1. Why did my FAQ rich results disappear from Google Search?**
Not a site-specific issue — Google deprecated the FAQ rich result feature entirely, for every site, effective May 7, 2026 ([Search Engine Journal](https://www.searchenginejournal.com/google-drops-faq-rich-results-from-search/574429/)).

**2. Is FAQ schema itself deprecated, or just the rich result?**
Only the visual SERP rich-result display was removed; FAQPage remains a valid Schema.org type ([Google's FAQPage docs](https://developers.google.com/search/docs/appearance/structured-data/faqpage)).

**3. Do I need to remove FAQ schema from my site now?**
No — Google has said unused/leftover structured data doesn't cause problems for Search, so there's no urgency to strip it out ([Search Engine Journal](https://www.searchenginejournal.com/google-drops-faq-rich-results-from-search/574429/)).

**4. Will losing FAQ rich results hurt my rankings?**
No — this is a search-appearance change, not a ranking or algorithmic change, though it may affect click-through rate on pages that previously showed the expanded snippet ([Search Engine Land](https://searchengineland.com/google-to-no-longer-support-faq-rich-results-476957)).

**5. When exactly did Google remove FAQ rich results?**
Display stopped May 7, 2026; the Search Console FAQ filter, rich-result report, and Rich Results Test support were removed in June 2026; Search Console API access to FAQ data ended around August 2026.

**6. Why were FAQ rich results restricted before they were fully removed?**
In August 2023, Google had already limited FAQ rich results to well-known, authoritative government and health websites, citing abuse — the 2026 change completed that multi-year phase-out.

**7. Was FAQ schema abused by SEOs before it was removed?**
Yes, widely reported — FAQ markup had been aggressively over-used by SEO tooling to inflate SERP real estate, similar to other abused rich-result features.

**8. What's the actual difference between FAQ schema markup and the FAQ rich result?**
The markup is structured data describing Q&A content on a page; the rich result was the expandable visual SERP panel that used that markup — Google removed the display, not the underlying data concept ([The HOTH](https://www.thehoth.com/blog/google-faq-rich-results-deprecated/)).

**9. Does the Rich Results Test still validate FAQ schema?**
No — Rich Results Test support for the FAQ feature was removed in June 2026 alongside the Search Console report.

**10. Is FAQ schema still worth adding for AI-driven answer engines even without the Google SERP feature?**
Some practitioners report it still helps AI/LLM crawlers parse Q&A content and describe anecdotal AI-referral traffic increases, though this isn't independently verified at scale ([GetPassionfruit](https://www.getpassionfruit.com/blog/what-changed-with-google-drops-faq-rich-results-and-what-to-do-now); [Entropyand](https://entropyand.co/blog/faq-schema-still-worth-it)).

**11. Why does Google keep FAQPage as a valid schema type if it no longer displays it?**
Google's own documentation frames the underlying structured data as still useful for its systems' understanding of the page, independent of whether it powers a visual rich-result feature ([Google's FAQPage docs](https://developers.google.com/search/docs/appearance/structured-data/faqpage)).

**12. Is this deprecation unique to FAQ, or part of a broader trend?**
Part of a broader trend — Google fully removed How-To rich results back in August 2023, the same month FAQ rich results were first restricted, showing this is a recurring pattern of curbing abused rich-result features rather than a one-off FAQ-specific decision ([RedShark Digital](https://www.redsharkdigital.com/news/google-how-to-faq-rich-results-update)).

**13. Did Google give advance notice of the full 2026 deprecation?**
The 2023 restriction to authoritative sites functioned as an early signal of where the feature was heading, and the specific 2026 dates were documented in Google's own Search Central developer updates ahead of and during the rollout.

**14. Does this deprecation apply to all countries and all languages?**
The sourced reporting describes it as a global change to the FAQ rich result feature rather than a regional rollout, though evidence not sufficiently verified for any country-specific exceptions beyond what's stated in Google's own documentation.

**15. Is there an official Google announcement I can read directly?**
Yes — Google's Search Central developer updates page documents the deprecation and its phased timeline directly ([Google Search Central](https://developers.google.com/search/updates)).

**16. Why did some site owners notice FAQ rich results disappearing before the official May 2026 date?**
A Google Search Central community thread shows site owners reporting disappearances that appear to reflect the earlier, gradual 2023 restriction phase rather than the full 2026 deprecation ([Google Search Central Help Community](https://support.google.com/webmasters/thread/114614455/faq-rich-results-for-some-of-our-pages-suddenly-disappeared-in-april-per-search-console?hl=en)).

**17. Does removing the visual FAQ snippet mean Google no longer reads FAQ content at all?**
No — Google's broader systems can still parse and use page content, including FAQ-formatted content, for ranking and understanding purposes independent of the now-retired visual display feature.

**18. Is there a replacement rich-result feature for FAQ content?**
Evidence not sufficiently verified in the sources reviewed — no source describes a direct replacement feature specifically for FAQ-style content.

**19. Does this affect voice-assistant or featured-snippet display of FAQ content?**
Evidence not sufficiently verified — the sourced reporting focuses specifically on the classic FAQ rich-result SERP feature, not voice-assistant or standard featured-snippet behavior.

**20. Should I expect similar deprecations for other schema-driven rich results in the future?**
Given that Google already fully removed How-To rich results back in 2023 using similar abuse-driven reasoning, it's a reasonable pattern to watch for, though any specific future deprecation would need its own confirmation from Google directly.

**21. How do I check if my FAQ rich results were affected by the May 2026 deprecation?**
Compare your Search Console appearance history before and after May 2026 — since the feature-specific report was itself removed in June 2026, historical comparison is only possible using data captured before that removal.

**22. How do I check if my FAQPage schema markup is still technically valid?**
Since Google's Rich Results Test dropped FAQ support in June 2026, use a general Schema.org/JSON-LD validator to confirm your markup is syntactically correct instead.

**23. How do I know if a traffic dip was caused by this deprecation or something else?**
Check whether the timing lines up with May 2026 and whether it's specifically pages that previously showed the FAQ rich snippet; a coincidental timing plus affected-page overlap points to the deprecation rather than a separate issue.

**24. How do I decide whether to remove or keep my existing FAQ schema?**
Keep it — there's no functional downside per Google's own guidance, and it may retain indirect value for both Google's own systems and AI-answer-engine parsing.

**25. How do I add new FAQ schema in 2026 given the rich result is gone?**
Use a schema/FAQ generator tool to produce valid JSON-LD as before; the implementation process is unchanged, only the payoff (no visual snippet) has changed.

**26. How do I check Google's official current guidance on FAQPage schema?**
Refer directly to Google's Search Central documentation for the FAQPage structured-data type, which reflects the current (post-deprecation) guidance ([Google's FAQPage docs](https://developers.google.com/search/docs/appearance/structured-data/faqpage)).

**27. How do I explain this deprecation to a client who's worried their SEO broke?**
Point to the documented, global, dated timeline (May/June/August 2026) as evidence this is a platform-wide change, not a site-specific technical failure.

**28. How do I decide whether to keep investing in FAQ content at all?**
Base the decision on whether FAQ content serves your actual audience and (if relevant) AI-answer-engine citation goals, rather than on the now-gone Google rich-snippet incentive alone.

**29. How do I check whether How-To schema was affected the same way?**
Reporting ties the two together as a roughly contemporaneous cleanup — check Google's Search Central updates directly for the specific How-To rich-result deprecation details if that's relevant to your site.

**30. How do I monitor for future similar deprecations affecting my structured data?**
Periodically review Google's Search Central developer updates page directly, since that's the authoritative source documenting these changes as they happen.

**31. Is the underlying reason for this deprecation about AI Overviews replacing the need for FAQ rich results?**
This connection isn't explicitly confirmed in the sourced reporting reviewed for this article — the stated rationale centers on historical abuse of the feature; any AI-Overview-replacement theory should be treated as speculation not directly sourced here.

**32. Does Google's stance on "unused structured data doesn't hurt" apply to all deprecated rich-result types, or just FAQ?**
The specific statement reviewed is about FAQ; while the general principle plausibly extends to other deprecated types, treat the FAQ-specific citation as the directly sourced claim.

**33. Was there significant industry pushback against this deprecation?**
Evidence not sufficiently verified in the sources reviewed — the available reporting documents the change and its rationale without describing organized industry pushback specifically.

**34. Does this deprecation affect structured data testing tools outside of Google's own Rich Results Test?**
Not necessarily — third-party schema validators that check against the general Schema.org specification (rather than Google-specific rich-result eligibility) would likely be unaffected, since they test a different thing than Google's own tool did.

**35. Is there a version history showing exactly what Google changed in its FAQPage documentation?**
Google's Search Central developer updates page functions as the closest thing to a change log for this kind of documentation update ([Google Search Central](https://developers.google.com/search/updates)).

**36. FAQ rich results before vs. after May 2026 — what's the single biggest practical difference for site owners?**
The visual expandable snippet no longer appears in search results, which may reduce click-through rate on affected pages, but rankings and the underlying schema's validity are unchanged.

**37. FAQPage schema vs HowTo schema deprecation — were they handled the same way?**
Similarly in spirit but not in timing: How-To rich results were fully removed in August 2023, while FAQ rich results were only restricted (not fully removed) at that point and didn't lose their display entirely until May 2026 — both reflect the same abuse-driven cleanup pattern, just on different timelines.

**38. Is Google's current position on FAQ schema different from other search engines' positions on the same schema type?**
Evidence not sufficiently verified in the sources reviewed — this article's sourcing addresses Google's specific policy; other engines' current stances weren't independently confirmed here.

**39. Does this deprecation change how FAQ schema interacts with AI Overviews specifically?**
Not directly described as changed in the sourced reporting — FAQ schema's indirect relationship to AI Overviews (feeding Google's own page understanding) is discussed separately in our companion article on FAQ schema vs. genuine FAQ pages.

**40. Is there a meaningful difference between how this affects large sites versus small business sites?**
The deprecation applies uniformly regardless of site size; the practical stakes (lost CTR from a rich snippet) may simply be proportionally larger for sites that relied heavily on FAQ-driven SERP visibility.

**41. My FAQ rich results for some pages disappeared before the official May 2026 date — is that normal?**
Yes, plausible — a Google Search Central community thread documents exactly this pattern, likely reflecting the earlier 2023 restriction phase rather than a bug specific to your site.

**42. I removed my FAQ schema after hearing about the deprecation — should I add it back?**
There's no urgency either way per Google's guidance, but re-adding it is low-risk and preserves whatever indirect benefit remains for Google's own understanding systems and potentially AI-answer-engine parsing.

**43. My FAQ markup validates with a general schema checker but Search Console shows no FAQ data — why?**
Expected — Search Console's FAQ-specific filter, report, and Rich Results Test support were removed in June 2026, so the absence of that reporting doesn't indicate a markup error.

**44. I'm confused about whether my site lost a ranking or just a rich-result feature — how do I tell?**
Check your actual ranking position for the relevant queries over time; if position is stable but click-through rate dropped specifically for pages that used to show the FAQ snippet, that points to the appearance change rather than a ranking issue.

**45. Should I worry that my FAQ schema seems useless now that the rich result is gone?**
Not entirely useless — it lost its direct SERP display purpose but retains indirect value for Google's page-understanding systems, and possibly for AI-answer-engine parsing per practitioner reports.

**46. Is it worth paying for a schema audit specifically because of this deprecation?**
Only if you're unsure whether your existing markup is otherwise technically valid or being used effectively elsewhere (e.g., feeding AI Overview grounding) — the deprecation itself doesn't require remedial spending.

**47. Should a small business still invest in a free FAQ schema generator tool in 2026?**
Yes, reasonably — the tool itself is unaffected by the deprecation; you're simply no longer getting the visual rich-snippet payoff, while potentially still getting the indirect benefits discussed in this article.

**48. Is there commercial value in optimizing FAQ content specifically for AI answer engines now that Google's rich result is gone?**
Possibly, per practitioner reports of AI-referral traffic association with FAQ schema, though this specific claim isn't independently verified at scale — treat it as a reasonable hypothesis worth testing rather than a guaranteed return.

**49. Should I hire an agency to help decide what to do about this deprecation?**
For most small sites, the guidance in this article (keep the schema, don't panic, focus on content quality) is sufficient without paid help; larger sites with significant historical FAQ-driven SERP traffic may benefit from a broader technical SEO review of the resulting CTR impact.

**50. What's the single most useful thing to do today given this deprecation?**
Confirm your FAQPage schema is still valid using a general Schema.org validator, leave it in place, and shift your framing of FAQ content's value toward genuine user usefulness and AI-answer-engine citation potential rather than the now-retired Google rich snippet.

## Key takeaways

- Google deprecated the FAQ rich result globally and permanently, in phases: display removed May 7, 2026; Search Console tooling removed June 2026; API access removed August 2026.
- FAQPage remains a fully valid Schema.org type — only the visual SERP display feature was retired, not the underlying markup or its indirect value to Google's systems.
- This is a search-appearance change, not a ranking or algorithmic penalty; any traffic impact is most likely a click-through-rate effect from the lost visual snippet.
- Google has explicitly confirmed that leaving unused FAQ schema in place causes no problems for Search — there's no need to remove it.
- The deprecation followed a 2023 abuse-driven restriction to authoritative sites, and Google fully removed How-To rich results that same month in 2023 for the same abuse-driven reasons — evidence of a recurring cleanup pattern, not a claim that FAQ and How-To were retired together in 2026.

## Relevant tools.scult.in resources

Keep or add valid FAQPage markup with the [FAQ Schema Generator](/seo/faq-schema-generator) — the deprecation changes the payoff, not the implementation, and pairing it with the [Schema Markup Generator](/seo/schema-markup-generator) for your broader Organization and Article schema keeps your site's structured data consistent even without the retired rich-snippet incentive. For the underlying FAQ question-and-answer copy itself, tools.scult.in's [SEO/GEO prompt library](/prompts/seo-geo) has ready-to-adapt prompts for drafting content that works for both classic search and AI answer engines.

If your site relies on structured data across many templates and you want a broader technical review beyond just this one deprecation, that's the kind of work scult.in's [web development team](https://scult.in/services/web-development) handles as part of a technical SEO engagement.

## Sources

- https://www.searchenginejournal.com/google-drops-faq-rich-results-from-search/574429/
- https://developers.google.com/search/docs/appearance/structured-data/faqpage
- https://searchengineland.com/google-to-no-longer-support-faq-rich-results-476957
- https://developers.google.com/search/updates
- https://support.google.com/webmasters/thread/114614455/faq-rich-results-for-some-of-our-pages-suddenly-disappeared-in-april-per-search-console?hl=en
- https://www.thehoth.com/blog/google-faq-rich-results-deprecated/
- https://www.getpassionfruit.com/blog/what-changed-with-google-drops-faq-rich-results-and-what-to-do-now
- https://entropyand.co/blog/faq-schema-still-worth-it
- https://www.redsharkdigital.com/news/google-how-to-faq-rich-results-update
