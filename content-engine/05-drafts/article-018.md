---
id: article_018
title: "How Fast Does a Website Need to Be? Core Web Vitals Thresholds and Diminishing Returns"
slug: how-fast-does-a-website-need-to-be
description: "The real Core Web Vitals thresholds, where speed optimization hits diminishing returns, and how a slow landing page can quietly wreck a Google Ads campaign."
primary_keyword: "how fast does a website need to be"
secondary_keywords: ["core web vitals thresholds", "website speed diminishing returns", "good enough page speed", "lcp inp cls targets"]
intent: "Informational"
audience: "Website owners, marketers running paid ads, small business site owners, and developers deciding how much performance work is worth doing"
topic_cluster: "Web Performance Thresholds"
countries: []
author: "SCULT.IN Content Engine"
review_status: draft
last_verified: "2026-08-21"
sources: ["https://web.dev/articles/vitals", "https://web.dev/articles/why-speed-matters", "https://gtmetrix.com/blog/how-landing-page-performance-can-silently-make-or-break-your-google-ads-campaigns/", "https://gtmetrix.com/blog/", "https://portent.com/blog/analytics/research-site-speed-hurting-everyones-revenue.htm", "https://websitespeedy.com/blog/lab-data-vs-field-data/"]
---

# How fast does a website actually need to be?

Google's own thresholds are specific: Largest Contentful Paint (LCP) under 2.5 seconds, Interaction to Next Paint (INP) under 200 milliseconds, and Cumulative Layout Shift (CLS) under 0.1 — each measured at the 75th percentile of real mobile and desktop page loads, not a best-case lab run. Once a site is solidly inside those thresholds, the evidence for further optimization weakens sharply: analysis of 100 million page views found the biggest conversion gains concentrated in the first few seconds of load-time improvement, with the curve flattening out after that. But "fast enough on average" isn't the whole story — GTmetrix's data on Google Ads-specific consequences shows that even a brief, sudden slowdown can trigger a "performance death spiral" where Smart Bidding cuts spend and traffic, regardless of how good the site's baseline speed normally is.

## Table of contents

- The actual Core Web Vitals thresholds
- Why 75th percentile, not average
- Where diminishing returns actually kick in
- The Google Ads "performance death spiral"
- Lab data vs. field data: which one to trust
- Practical examples
- Data and evidence
- Comparisons
- Real-world use cases
- Common mistakes
- Best practices
- Frequently asked questions
- Key takeaways
- Relevant tools.scult.in resources
- Sources

## The actual Core Web Vitals thresholds

Google's web.dev documentation sets three specific numeric targets. Largest Contentful Paint (LCP), which measures how quickly the main content of a page becomes visible, should be 2.5 seconds or less (web.dev/articles/vitals). Interaction to Next Paint (INP), which measures how responsive a page is to user interactions like clicks and taps, should be 200 milliseconds or less. Cumulative Layout Shift (CLS), which measures visual stability — whether elements jump around as a page loads — should be 0.1 or less to be considered visually stable.

These aren't arbitrary numbers picked for round convenience; they're the specific thresholds Google itself uses to classify a page's experience as "good," and they're the same numbers that feed into Google's page-experience signals.

## Why 75th percentile, not average

A detail that matters a great deal in practice: web.dev specifies these thresholds should be met at the 75th percentile of page loads, split separately by mobile and desktop (web.dev/articles/vitals). That means a site isn't judged on its average or best-case performance — it needs three out of every four page loads to fall within the threshold, which is a meaningfully harder bar to clear than "our average load time looks fine." A site with a fast median load time but a long tail of slow loads on weaker devices or networks can still fail this threshold even though its "typical" experience looks good on paper.

This percentile-based approach also explains why two sites with the same average load time can have very different real-world outcomes — one with tightly clustered load times across most visits, another with a wide spread where a meaningful chunk of visits are much slower than the average suggests.

## Where diminishing returns actually kick in

Industry analysis of website speed optimization converges on a specific pattern: after a page reaches a "fast enough" threshold — commonly cited around the 2-second mark — squeezing out additional milliseconds rarely produces a meaningful further gain in user satisfaction or conversion. Portent's analysis of 100 million page views found pages loading in 1 second associated with roughly 3x the conversion rate of pages loading in 5 seconds, but with the curve flattening out well before that comparison's far end — meaning the largest gains are concentrated early, in going from slow to acceptable, not from acceptable to imperceptibly faster.

There's also a real cost side to chasing sub-second gains once a page already feels instant: further optimization (aggressively deferring every script, compressing every asset to the maximum) can introduce complexity, bugs, or removed functionality that actively degrades the experience in ways that outweigh the marginal speed benefit. The practical sequencing that emerges from this research: fix images first (since modern formats can run 40–50% smaller than older formats like JPEG for comparable quality), then address script bloat and caching — in that order, because that's where the actual returns are concentrated, rather than starting with marginal, high-effort sub-second optimization.

## The Google Ads "performance death spiral"

This is the most underappreciated angle in the "how fast is fast enough" conversation, and it's specific to paid traffic rather than organic visitors. GTmetrix describes a mechanism where AI-driven Smart Bidding interprets a landing page slowdown as reduced conversion effectiveness and responds by cutting ad spend and traffic to that page — even if the underlying product or offer hasn't changed at all (gtmetrix.com/blog/how-landing-page-performance-can-silently-make-or-break-your-google-ads-campaigns/). The cited example: a two-second slowdown was enough to derail an active campaign, triggering the algorithm to reduce delivery before a human operator even noticed the site had gotten slower.

GTmetrix's guidance names specific alert thresholds worth tracking for exactly this reason: a performance score dropping below 80% should trigger investigation, Total Blocking Time (TBT) exceeding 300 milliseconds is a red flag, and fully loaded time exceeding 4 seconds should prompt action. The same source cites a mattress retailer case that moved from a 76% (C grade) score to 99% (A grade) after fixes — a concrete before/after result illustrating that this isn't a theoretical risk but one that's been diagnosed and resolved in real campaigns.

## Lab data vs. field data: which one to trust

This distinction resolves a common confusion: a site can pass a Lighthouse test with a great score and still feel slow to real visitors, or vice versa. Lab data comes from a Lighthouse test run in a simulated, controlled environment — a consistent, repeatable snapshot, but one that doesn't reflect the variety of real devices, networks, and locations actual visitors use. Field data comes from the Chrome UX Report, which aggregates real Chrome users' actual experience over roughly a 28-day rolling window.

Only field data influences Google's page-experience signals — lab data, no matter how good, has no direct effect on that signal. The practical workflow this implies: use lab data (a Lighthouse test) to diagnose what's slow and verify a fix technically worked, then confirm the fix actually improved the real-user experience by checking field data in Search Console's Core Web Vitals report before declaring the work done. Web.dev's own guidance reinforces this same lab-to-field relationship directly: optimizations that improve Total Blocking Time in lab testing may improve INP in the field, but lab metrics function as a predictive proxy, not a guarantee, of real-world gains.

## Practical examples

A local service business runs Google Ads to a landing page that normally loads in 1.8 seconds. During a routine CMS plugin update, an unoptimized new plugin quietly adds 2 seconds to load time without anyone noticing immediately. Over the following days, Smart Bidding — reading the slowdown as reduced conversion quality — throttles ad delivery, and the business sees a mysterious drop in leads that initially looks like a market or seasonality issue rather than a technical one. Following GTmetrix's recommended alert thresholds (score below 80%, TBT over 300ms, fully loaded time over 4 seconds) as an ongoing monitoring habit, rather than a one-time launch check, would have caught this within a day instead of a week.

A SaaS marketing site scores 68 (a "D" or "C" grade depending on the tool) on Lighthouse and the team spends a sprint trying to push it to a 98+ score, chasing sub-second gains on already-acceptable load times. A more evidence-aligned approach, given the diminishing-returns pattern described above, would prioritize getting comfortably under the 2.5-second LCP and 200ms INP thresholds at the 75th percentile first — a "good enough per Google's own bar" target — before investing further sprint time chasing marginal gains beyond that point.

## Data and evidence

- LCP target: 2.5 seconds or less, at the 75th percentile of mobile/desktop page loads (web.dev/articles/vitals).
- INP target: 200 milliseconds or less, at the 75th percentile.
- CLS target: 0.1 or less.
- Rakuten 24 raised revenue per visitor by 53.37% and conversion by 33.13% through performance work, per web.dev's business-impact case studies (web.dev/articles/why-speed-matters).
- Vodafone gained 8% in sales from a 31% LCP improvement.
- redBus gained 7% in sales from an INP improvement.
- BBC reported losing an additional 10% of users for every additional second of load time.
- Research cited by web.dev found stress responses to page delays comparable to watching horror films or solving math problems, and higher than the stress of waiting in a retail checkout line.
- GTmetrix alert thresholds for Google Ads landing pages: performance score below 80%, Total Blocking Time above 300ms, fully loaded time above 4 seconds (gtmetrix.com/blog/how-landing-page-performance-can-silently-make-or-break-your-google-ads-campaigns/).
- A cited case study: a mattress retailer moved from a 76% (C grade) to 99% (A grade) performance score after fixes.
- A two-second slowdown was cited as sufficient to derail an active Google Ads campaign via Smart Bidding's automated response.
- Portent's analysis of 100 million page views found 1-second pages with roughly 3x the conversion rate of 5-second pages, with returns flattening after the first few seconds of improvement.
- Modern image formats (e.g., AVIF) can run 40–50% smaller than JPEG for comparable quality, making image optimization consistently one of the highest-return, lowest-effort fixes.
- Lab data comes from a controlled Lighthouse test; field data comes from the Chrome UX Report's rolling ~28-day aggregation of real Chrome users; only field data feeds Google's page-experience ranking signal.

## Comparisons

**LCP vs. INP vs. CLS.** LCP measures perceived loading speed, INP measures interaction responsiveness, and CLS measures visual stability — three genuinely different dimensions of "fast," meaning a site can pass one and fail another (a page that loads quickly but jumps around as ads inject, or one that appears fast but lags badly on click, both fail the overall Core Web Vitals bar despite looking fine on a single metric).

**Lab data vs. field data.** Lab data is a controlled, repeatable Lighthouse snapshot useful for diagnosing and verifying fixes; field data is real-user Chrome UX Report data that actually determines page-experience signals — treating a good lab score as proof of a good real-world experience is a common and consequential mistake.

**PageSpeed score vs. real user experience.** A high PageSpeed/Lighthouse score correlates with but doesn't guarantee a good real-user experience, since the lab test can't capture the full variety of devices, networks, and connection quality actual visitors bring — field data is the only reliable confirmation.

## Real-world use cases

- **A marketing team running Google Ads campaigns** adds landing-page performance monitoring (score, TBT, fully loaded time) as a standing check alongside their usual campaign metrics, specifically to catch the kind of silent, spend-throttling slowdown GTmetrix documents before it shows up as a mysterious lead-volume drop.
- **A small business owner who already optimized images and hosting** and is now stuck deciding whether to invest further in speed work checks their current LCP/INP/CLS numbers against the 75th-percentile field-data thresholds first — if already comfortably inside them, that's evidence to redirect further effort elsewhere rather than chasing diminishing sub-second gains.
- **A developer auditing a client site** runs both a Lighthouse lab test (to diagnose specific technical issues) and pulls the client's Search Console Core Web Vitals field-data report (to confirm what real visitors are actually experiencing) before recommending a scope of work, rather than quoting a fix based on lab data alone.
- **An ecommerce team preparing for a high-traffic sale** treats the Google Ads death-spiral risk as a reason to stress-test landing pages under simulated peak load in advance, not just under normal traffic conditions, given how quickly Smart Bidding can react to a slowdown.

## Common mistakes

- Chasing a perfect 100 Lighthouse score long after a site is already comfortably inside Google's actual LCP/INP/CLS thresholds, spending effort where the evidence shows diminishing returns.
- Judging site speed by average load time instead of the 75th-percentile figure Google actually uses, missing a slow long tail that's dragging down real-world experience for a meaningful share of visitors.
- Treating a good lab (Lighthouse) score as proof the site is fast for real users, when only field data (Chrome UX Report) actually reflects real-world experience and feeds ranking signals.
- Not monitoring landing page performance continuously for Google Ads campaigns, missing a slowdown until Smart Bidding has already started throttling spend and traffic.
- Optimizing performance once at launch and assuming it stays fixed, when new plugins, scripts, or content updates commonly degrade speed silently afterward.
- Sacrificing genuinely useful functionality purely to shave milliseconds off an already-fast page, trading real user value for a marginal, often imperceptible speed gain.

## Best practices

- Benchmark current LCP, INP, and CLS against Google's specific thresholds (2.5s / 200ms / 0.1) using 75th-percentile field data before deciding whether more optimization work is warranted.
- Fix images and script bloat first — the highest-return, lowest-effort levers — before pursuing marginal sub-second gains on an already-acceptable page.
- Set up ongoing landing page performance monitoring for any page running paid traffic, using GTmetrix-style alert thresholds (score under 80%, TBT over 300ms, fully loaded time over 4s) rather than a one-time pre-launch check.
- Use lab data (Lighthouse) to diagnose and verify technical fixes, but confirm real-world impact using field data (Chrome UX Report / Search Console) before considering the work complete.
- Re-test performance after any plugin, script, or content management change, since these are common, easy-to-miss causes of gradual speed regression.
- Recognize when a site has crossed into "fast enough" territory and redirect further optimization effort toward other priorities once the 75th-percentile thresholds are comfortably met.

## Frequently asked questions

**1. What is a good LCP score?**
2.5 seconds or less, measured at the 75th percentile of page loads.

**2. What is a good INP score?**
200 milliseconds or less, at the 75th percentile.

**3. What is a good CLS score?**
0.1 or less.

**4. Does site speed affect Google rankings?**
Core Web Vitals field data feeds into Google's page-experience signals; lab data alone has no direct ranking impact.

**5. Why measure Core Web Vitals at the 75th percentile instead of the average?**
So the metric reflects most real users rather than being skewed by best-case sessions, since a site can have a good average but a slow long tail.

**6. Is there a point where more speed optimization stops helping?**
Yes — once a page is comfortably inside Google's thresholds (commonly cited around the 2-second mark), further optimization produces increasingly small gains relative to the effort required.

**7. Is a 2-second load time fast enough?**
Generally yes for most practical purposes — it's commonly cited as the point past which additional optimization delivers diminishing returns, though the official Core Web Vitals thresholds (2.5s LCP, 200ms INP, 0.1 CLS) are the more precise bar to check against.

**8. Does shaving milliseconds off an already-fast load time matter?**
Rarely in a meaningful way once a page is already inside the "good" thresholds — the biggest conversion gains are concentrated in going from slow to acceptable, not from acceptable to marginally faster.

**9. What PageSpeed score is considered good enough for SEO?**
There's no single official score threshold for SEO; what matters for Google's ranking signal is passing the actual Core Web Vitals thresholds using field data, not a specific PageSpeed numeric score.

**10. How much does 1 second of load time cost in conversions?**
Site-wide research (cited in related page-speed studies) puts this in the range of a 7–22% conversion cost depending on the dataset, though the precise figure varies by study and industry.

**11. What is Total Blocking Time (TBT) and what's a bad score?**
TBT measures how long a page is blocked from responding to user input during load; GTmetrix recommends treating anything above 300 milliseconds as a red flag worth investigating.

**12. What "fully loaded" time is too slow for a landing page?**
GTmetrix recommends alerting when fully loaded time exceeds 4 seconds, particularly for pages running paid ad traffic.

**13. What performance score should trigger concern?**
GTmetrix recommends investigating once a performance score drops below 80%.

**14. Can a slow landing page hurt a Google Ads campaign specifically?**
Yes — GTmetrix documents a "performance death spiral" where Smart Bidding interprets a slowdown as reduced conversion effectiveness and cuts spend/traffic accordingly, independent of organic search effects.

**15. How much can fixing page speed actually move revenue?**
Case studies cited by web.dev include Rakuten 24 (+53.37% revenue per visitor, +33.13% conversion), Vodafone (+8% sales from a 31% LCP improvement), and redBus (+7% sales from an INP improvement).

**16. Does a 1-second delay really lose that many visitors?**
The BBC reported losing an additional 10% of users for every additional second of load time, per web.dev's cited research.

**17. Does waiting for a slow page actually cause measurable stress?**
Yes — cited research found stress responses to page delays comparable to watching horror films or solving math problems, exceeding the stress of a retail checkout line wait.

**18. Do lab performance fixes actually translate to real-world improvement?**
Not automatically guaranteed — web.dev notes lab metrics like TBT are predictive proxies for field metrics like INP, not a guarantee of real-user gains.

**19. What's the difference between lab data and field data?**
Lab data comes from a controlled Lighthouse test; field data comes from real Chrome users aggregated via the Chrome UX Report over roughly a 28-day window.

**20. Which data — lab or field — actually affects search rankings?**
Only field data (Chrome UX Report) feeds Google's page-experience ranking signal; lab data has no direct ranking effect.

**21. How do I check if my website is fast enough?**
Compare your current LCP, INP, and CLS field data (via Search Console) against Google's thresholds (2.5s / 200ms / 0.1) at the 75th percentile.

**22. How do I test Core Web Vitals?**
Use Google PageSpeed Insights for a combined lab-and-field view, or check Search Console's Core Web Vitals report specifically for field data.

**23. How do I prioritize which speed fixes actually matter?**
Start with images and script bloat (the highest-return, lowest-effort fixes), then address caching, before pursuing marginal sub-second gains.

**24. How do I know if I've hit diminishing returns on speed optimization?**
If your page already meets Google's LCP/INP/CLS thresholds at the 75th percentile, further optimization is likely to produce comparatively small additional gains relative to the effort.

**25. How do I monitor landing page speed for an active Google Ads campaign?**
Set up ongoing checks against specific alert thresholds — score below 80%, TBT above 300ms, fully loaded time above 4 seconds — rather than a one-time pre-launch test.

**26. How do I fix Cumulative Layout Shift specifically?**
Set explicit dimensions on images and embedded content so the browser reserves space before the asset loads, preventing elements from jumping as the page renders.

**27. How do I reduce Interaction to Next Paint (INP)?**
Reduce JavaScript execution time and main-thread blocking, since heavy scripts delay how quickly a page can respond to a user's click or tap.

**28. My site passes Lighthouse but still feels slow to real visitors — why?**
Lab data doesn't capture the full range of real devices, networks, and locations; check your field data (Chrome UX Report / Search Console) to see the actual real-user experience.

**29. My landing page slowed down and my Google Ads spend dropped — is that related?**
Possibly yes — GTmetrix documents Smart Bidding reducing spend/traffic in response to a detected slowdown, sometimes from a change as small as two seconds of added load time.

**30. My PageSpeed score dropped after a routine update — what should I check?**
Review any newly added plugins, scripts, or third-party embeds introduced in that update, since these are a common and easy-to-miss cause of sudden performance regression.

**31. Is there a point where more speed optimization stops helping conversions?**
Yes — analysis of 100 million page views found the largest conversion gains concentrated in the first few seconds of improvement, with returns flattening out well before reaching sub-second load times.

**32. LCP vs. INP vs. CLS — which matters most?**
All three are independently required to pass Core Web Vitals; a page can score well on one and poorly on another, so none can be treated as a stand-in for the others.

**33. Lab data vs. field data — which should I trust more?**
Field data is the more trustworthy reflection of real-user experience and the only one that affects ranking signals; lab data is best used for diagnosing and verifying specific technical fixes.

**34. PageSpeed score vs. real user experience — how much do they actually correlate?**
They generally correlate, but a good lab-based PageSpeed score doesn't guarantee a good real-user experience given the range of devices and networks field data captures that a lab test can't simulate.

**35. My performance score is stuck around 80% despite multiple optimization rounds — is that a problem?**
GTmetrix's suggested alert threshold is specifically below 80%; a score consistently near or above that mark may already be in acceptable territory, especially if field-data thresholds are also being met.

**36. My site's average load time looks great but Search Console still shows failing Core Web Vitals — why?**
This is a common symptom of the average-vs-75th-percentile gap — a slow long tail of visits (weaker devices, poorer networks) can fail the percentile-based threshold even when the average looks fine.

**37. My landing page conversions dropped and I can't find a marketing cause — could speed be the issue?**
Worth checking — GTmetrix documents cases where a performance slowdown alone, invisible without explicit monitoring, caused a marketing-looking problem (reduced Ads delivery) that had a purely technical root cause.

**38. My developer says further speed optimization isn't worth it anymore — how do I know if that's true?**
Check your current LCP/INP/CLS field data against Google's thresholds; if you're comfortably inside them, the diminishing-returns pattern documented in the research supports that assessment.

**39. My site scores differently in PageSpeed Insights depending on when I test it — is that normal?**
Yes for lab data (results can vary by test conditions and small measurement variance) and expected for field data too, since it's a rolling aggregate that shifts as real-user traffic patterns change over the measurement window.

**40. My CLS score is bad but my page doesn't look like it's shifting — what am I missing?**
Layout shifts can happen quickly or be triggered by late-loading content (ads, fonts, embeds) that isn't obvious on a casual visual check; run a Lighthouse test to identify the specific element causing the shift.

**41. Is it worth paying for an ongoing performance monitoring service, or is a manual check enough?**
For any page carrying paid traffic, given the documented Google Ads spend-throttling risk from an undetected slowdown, ongoing automated monitoring is generally worth the cost relative to the revenue at stake; for a low-traffic informational site, periodic manual checks may be sufficient.

**42. Is it worth hiring a developer to chase a perfect 100 PageSpeed score?**
Given the documented diminishing returns past the point of meeting Google's actual thresholds, this is usually not the best use of a limited budget — better to confirm thresholds are met and redirect remaining budget elsewhere.

**43. Should a small business prioritize Core Web Vitals or other SEO factors first?**
Core Web Vitals are one ranking signal among many; if a site is failing the thresholds outright, fixing that is usually a reasonable priority given both the ranking and conversion impact, but it shouldn't be pursued at the total exclusion of content and other SEO fundamentals.

**44. How much should a site speed audit cost?**
Evidence not sufficiently verified in this research for a specific price benchmark; cost varies significantly by site complexity and whether the audit includes implementation of fixes versus diagnosis alone.

**45. Is a fast website enough to guarantee good ad campaign performance?**
No — Speed removes one specific risk (Smart Bidding throttling due to a detected slowdown) but doesn't by itself guarantee campaign performance, which also depends on targeting, creative, offer, and bid strategy.

**46. Should I test my site speed differently for Google Ads landing pages versus regular content pages?**
Yes — GTmetrix's guidance specifically recommends dedicated alert thresholds (score, TBT, fully loaded time) for Ads landing pages, given the direct link between detected slowdowns and automated bid/spend adjustments.

**47. Is it worth investing in a CDN if my site is already inside Core Web Vitals thresholds?**
If already comfortably inside the thresholds, a CDN's marginal benefit is more about resilience (protecting against future traffic spikes or geographic latency) than pushing scores further, which aligns with the general diminishing-returns pattern past that point.

**48. What's a reasonable next step if my site fails Core Web Vitals on mobile but passes on desktop?**
Prioritize mobile-specific fixes (image sizing, script deferral, layout stability) since mobile devices and networks are typically the more constrained environment driving the percentile-based failure.

**49. How often should Core Web Vitals be re-checked?**
Regularly, and definitely after any site update, new third-party script addition, or major content change, since these are the most common causes of regression after an initial pass.

**50. What's the single most useful first step for someone who's never checked their site against these thresholds?**
Pull the Core Web Vitals field-data report from Google Search Console and compare LCP, INP, and CLS directly against the 2.5s/200ms/0.1 thresholds at the 75th percentile before deciding whether any optimization work is actually needed.

## Key takeaways

- Google's specific thresholds are LCP under 2.5s, INP under 200ms, and CLS under 0.1, measured at the 75th percentile of real mobile/desktop page loads — not average performance.
- Diminishing returns set in once a page is comfortably inside these thresholds; the largest conversion gains are concentrated in going from slow to acceptable, not from acceptable to imperceptibly faster.
- A landing page running paid Google Ads traffic carries extra risk: Smart Bidding can throttle spend in response to even a brief, sudden slowdown, independent of the site's normal baseline speed.
- Lab data (Lighthouse) is useful for diagnosing and verifying fixes; only field data (Chrome UX Report) reflects real-user experience and actually influences ranking signals.
- Once thresholds are met at the 75th percentile, further optimization effort is generally better redirected elsewhere rather than chasing marginal sub-second gains.

## Relevant tools.scult.in resources

Run your site through the [Website Speed Test](/seo/website-speed-test) tool to check your current LCP, INP, and CLS numbers against the thresholds covered above, and re-check after any significant site change to catch regressions before they show up as a mysterious drop in conversions or ad performance.

If your speed audit reveals the site is already inside Google's thresholds but conversions or ad performance still lag, that's usually a sign the next investment belongs in broader technical or campaign work rather than more speed optimization — the kind of diagnostic and implementation work SCULT.IN's web development team can help scope once the low-hanging speed fixes are already handled.

## Sources

- https://web.dev/articles/vitals
- https://web.dev/articles/why-speed-matters
- https://gtmetrix.com/blog/how-landing-page-performance-can-silently-make-or-break-your-google-ads-campaigns/
- https://gtmetrix.com/blog/
- https://portent.com/blog/analytics/research-site-speed-hurting-everyones-revenue.htm
- https://websitespeedy.com/blog/lab-data-vs-field-data/
