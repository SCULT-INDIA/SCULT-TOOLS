---
id: article_021
title: "Customer Support Automation Gone Wrong: What Klarna, Air Canada and Cursor Actually Learned"
slug: customer-support-automation-gone-wrong
description: "Real cases — Klarna, Air Canada, Cursor — show what breaks when companies automate customer support too fast, and how to avoid the same mistakes."
primary_keyword: customer support automation gone wrong
secondary_keywords: ["ai chatbot customer service fails", "ai customer support backlash", "company replaced support agents with ai", "ai support hallucination incidents"]
intent: Problem-solving
audience: "Founders, CX/support leaders and product managers at small-to-mid companies deciding how fast and how far to automate support"
topic_cluster: "AI customer support failure patterns"
countries: ["Canada"]
author: "SCULT.IN Content Engine"
review_status: draft
last_verified: "2026-08-21"
sources: ["https://www.yahoo.com/news/customer-support-ai-went-rogue-120000474.html", "https://www.cmswire.com/customer-experience/ai-in-customer-service-billion-dollar-mistake-when-deployed-wrong/", "https://www.forbes.com/sites/marisagarcia/2024/02/19/what-air-canada-lost-in-remarkable-lying-ai-chatbot-case/", "https://www.cbc.ca/news/canada/british-columbia/air-canada-chatbot-lawsuit-1.7116416", "https://www.theregister.com/2025/04/18/cursor_ai_support_bot_lies/", "https://www.cxtoday.com/contact-center/a-contact-center-chatbot-invents-company-policies-now-customers-want-out/", "https://digialps.com/ai-support-fail-cursor-bot-invents-policy-causes-user-uproar/", "https://community.shopify.com/t/shopify-misleading-merchants-about-support/258145", "https://www.gleap.io/blog/ai-support-failures-lessons", "https://fortune.com/2025/08/18/mit-report-95-percent-generative-ai-pilots-at-companies-failing-cfo/"]
---

# Customer support automation gone wrong: what Klarna, Air Canada and Cursor actually learned

Automating customer support too fast has produced three documented, verifiable failure patterns: an AI chatbot that invents a company policy that never existed (Air Canada, Cursor), a legal ruling that a company is liable for what its own chatbot says (Air Canada's small-claims tribunal loss), and a strategic reversal after a company discovered that cost savings from AI-only support cost it customer loyalty and quality (Klarna). None of these were edge cases — they were the predictable result of removing human judgment from a channel where customers expect accountability.

## Table of contents

- What actually happened when Klarna went AI-first, then reversed course
- The Air Canada chatbot case: hallucination becomes legal liability
- Cursor's "Sam" bot: when the support agent lies about a fake policy
- Why AI-only support fails so often
- Practical examples
- Data and evidence
- Comparisons: AI-only vs. AI-plus-human support
- Real-world use cases
- Common mistakes
- Best practices for rolling out AI support without the backlash
- Frequently asked questions
- Key takeaways
- Relevant tools.scult.in resources
- Sources

## What actually happened when Klarna went AI-first, then reversed course

In February 2024, the Swedish buy-now-pay-later company Klarna announced that its OpenAI-powered assistant was doing the work of roughly 700 full-time support agents, handling about 2.3 million conversations a month — a scale the company presented as proof that generative AI could replace, not just assist, a human support function. It became one of the most cited case studies in enterprise AI adoption almost overnight.

By mid-2025, CEO Sebastian Siemiatkowski publicly reversed that framing. He acknowledged that the company had prioritized cost savings over service quality, and Klarna began rehiring and expanding its human support team again, describing the AI-first approach as a mistake rather than a milestone ([Yahoo News, "A customer support AI went rogue"](https://www.yahoo.com/news/customer-support-ai-went-rogue-120000474.html); [CMSWire](https://www.cmswire.com/customer-experience/ai-in-customer-service-billion-dollar-mistake-when-deployed-wrong/)). The reversal matters for two reasons distinct from the headline: first, it came from the company itself, not from a leaked internal memo or a disgruntled customer — this is a CEO retracting his own case study in public. Second, it happened after roughly 18 months of live production use at genuine scale, which rules out the "they just didn't try hard enough" explanation that vendors often reach for when a deployment goes wrong.

What Klarna's reversal actually tells small and mid-size companies is narrower than the headlines suggest. It does not say AI support fails at every scale or every use case — Klarna's own bot handled millions of straightforward conversations. It says that the metric the company optimized for (headcount reduction, conversation volume handled) was not the same as the metric customers cared about (getting a correct, satisfying resolution), and the gap between those two metrics didn't show up until the company had already restructured its team around the assumption that it wouldn't.

## The Air Canada chatbot case: hallucination becomes legal liability

In late 2022, a passenger named Jake Moffatt asked Air Canada's website chatbot about bereavement fares after a family death, and the bot told him he could book a full-fare flight and then apply for a bereavement discount retroactively within 90 days. That policy did not exist — Air Canada's actual bereavement policy required the discount to be requested before travel, not after. Moffatt booked the more expensive fare in good faith, was later refused the retroactive refund, and took the airline to Canada's Civil Resolution Tribunal.

Air Canada's defense is the part that makes this case load-bearing for every company running a support chatbot: the airline argued the chatbot was "a separate legal entity that is responsible for its own actions," meaning the company shouldn't be held liable for what the bot said. Tribunal member Christopher C. Rivers rejected that argument outright, ruling that a company is responsible for all the information on its website, "regardless of whether it comes from a static page or a chatbot," and awarded Moffatt CAD $812.02 in damages and fees for negligent misrepresentation ([CBC News](https://www.cbc.ca/news/canada/british-columbia/air-canada-chatbot-lawsuit-1.7116416); [Forbes](https://www.forbes.com/sites/marisagarcia/2024/02/19/what-air-canada-lost-in-remarkable-lying-ai-chatbot-case/)).

The dollar amount is trivial. The legal reasoning is not. It closes off the single most common defense companies reach for when a support AI says something false: "the AI said it, not us." Canadian small-claims precedent — and the broader legal logic it reflects, which most jurisdictions with negligent-misrepresentation doctrine would likely mirror — treats a chatbot's output the same as a page of copy your marketing team wrote and published. If it's wrong, you own the consequence, whether a human or a model typed it.

## Cursor's "Sam" bot: when the support agent lies about a fake policy

In April 2025, users of the AI coding tool Cursor started getting logged out when switching between machines. Several emailed support and received a reply from an agent named "Sam," explaining this was expected behavior under a new policy limiting each subscription to one device. Multiple users, taking the explanation at face value, publicly announced they were cancelling their subscriptions over what they saw as an unreasonable new restriction ([The Register](https://www.theregister.com/2025/04/18/cursor_ai_support_bot_lies/); [CX Today](https://www.cxtoday.com/contact-center/a-contact-center-chatbot-invents-company-policies-now-customers-want-out/)).

There was no such policy. "Sam" was an AI support agent, and it had fabricated a plausible-sounding rule to explain a bug it had no real explanation for. Cursor's co-founder confirmed the mistake publicly, apologized, and clarified that the "one device per subscription" rule never existed. The company's fix was procedural rather than technical: going forward, AI-generated support responses would be clearly labeled as such, rather than presented as if a person had written them ([Digialps](https://digialps.com/ai-support-fail-cursor-bot-invents-policy-causes-user-uproar/)).

The Cursor case is the clean counterpart to Air Canada's: it shows the same failure mode — a support AI confidently inventing a specific, plausible policy rather than admitting it didn't know — happening to a technically sophisticated company whose own product is an AI coding assistant. If a company built by AI-fluent engineers, selling to AI-fluent customers, shipped this failure in 2025, "we understand the technology so this won't happen to us" is not a credible risk mitigation strategy on its own.

## Why AI-only support fails so often

Industry research aggregated by Gleap puts numbers behind what these individual cases show anecdotally. An analysis citing Accenture found that roughly 38.8% of interactions handled entirely by AI, with no human involvement, ended in failure — meaning the customer's issue wasn't actually resolved. Separately, nearly one in five consumers using AI support reported getting no benefit from it at all ([Gleap](https://www.gleap.io/blog/ai-support-failures-lessons)).

The same analysis lists recurring root causes across failed deployments: the bot lacking accurate, current context about the specific customer or account; relying on outdated knowledge that wasn't synced with real policy changes; overstepping its actual permissions (answering questions it shouldn't be authoritative on); missing obvious frustration signals in a customer's tone or repeated messages; and — the pattern every case study above shares — making escalation to a human difficult or slow when the bot hits its limits.

There's also a loyalty cost that doesn't show up in a resolution-rate metric. The same Gleap analysis reports that nearly 90% of surveyed consumers said their loyalty to a company dropped when human support was removed from a channel, even in cases where the AI response itself was fast. Speed and correctness aren't substitutes for the feeling of being taken seriously, and companies that measure success only in average handle time miss that cost until it shows up in churn.

## Practical examples

- **Klarna (real, documented):** 700 agents' worth of AI-handled volume at 2.3 million conversations/month, followed by a public admission that speed of rollout outpaced quality, and a return to hiring humans.
- **Air Canada (real, documented, court record):** a chatbot inventing a bereavement-fare policy, an airline's failed legal defense that the bot was a separate entity, and a tribunal ruling that made the company pay for the bot's words.
- **Cursor (real, documented):** an AI support agent inventing a device-limit policy to explain a bug, users cancelling over the fabricated rule, and a public apology plus a new labeling policy.
- **Shopify merchants (real, documented via community forum):** merchants posting on Shopify's own community forum describing being routed through an AI chatbot that couldn't resolve their issue and made reaching a human deliberately hard ([Shopify Community](https://community.shopify.com/t/shopify-misleading-merchants-about-support/258145)).
- **Illustrative, not a real case:** picture a mid-size SaaS company that replaces tier-1 billing support with a bot trained only on last quarter's pricing page. When pricing changes mid-quarter, the bot keeps quoting the old numbers to customers until someone notices the complaint volume spike — a scenario built from the same "outdated knowledge" root cause Gleap documents, not a specific company we verified.

## Data and evidence

- **38.8% failure rate on fully AI-handled interactions** — cited from Accenture research via Gleap's analysis; this is the clearest single number showing that "handled by AI" and "resolved" are not the same claim ([Gleap](https://www.gleap.io/blog/ai-support-failures-lessons)).
- **~90% of consumers report reduced loyalty** when human support is removed from a channel, according to the same survey data — even when the AI itself responds quickly (Gleap).
- **95% of enterprise generative-AI pilots delivered no measurable return to the bottom line**, against an estimated $30-40 billion in enterprise investment, per MIT's Project NANDA research reported by Fortune — a useful caution against assuming that AI support spend automatically translates to ROI ([Fortune](https://fortune.com/2025/08/18/mit-report-95-percent-generative-ai-pilots-at-companies-failing-cfo/)).
- **CAD $812.02** — the actual damages and fees awarded to the Air Canada chatbot claimant, a small number that established a large legal principle (CBC News).
- **~700 human agents' worth of volume, 2.3 million conversations/month** — Klarna's own reported scale for its AI support system before the reversal (Yahoo News; CMSWire).
- Evidence not sufficiently verified: there is no independently audited, company-confirmed figure for exactly how many of Klarna's 700 roles were eliminated permanently versus reassigned, nor a precise current headcount after the 2025 rehiring — the public reporting describes a directional reversal, not an exact number restored.

## Comparisons: AI-only vs. AI-plus-human support

| Dimension | AI-only support | AI-plus-human (escalation-based) |
|---|---|---|
| Cost per interaction | Lower on paper | Higher, but includes resolution |
| Resolution rate on complex issues | Weak — ~38.8% fully-AI interactions fail (Gleap) | Stronger, since humans catch what the bot can't resolve |
| Legal exposure | Real — Air Canada precedent holds the company liable for chatbot statements | Lower, since escalation paths let a human correct false claims before they become policy |
| Customer loyalty impact | Negative when humans are removed entirely (~90% report reduced loyalty, Gleap) | Neutral to positive when escalation is genuinely available |
| Public-relations risk | High — Cursor and Air Canada both became widely covered incidents | Lower, since a labeled AI response with a fast human backstop reads as reasonable, not deceptive |

The comparison isn't AI versus no AI. Klarna, Cursor, and most companies in this space still use AI extensively — the difference is whether a human remains genuinely reachable when the bot is wrong, and whether the company is honest that a response came from a bot at all.

## Real-world use cases

Cursor's post-incident fix — labeling AI-generated support responses as AI-generated — is itself a real-world use case worth naming on its own: it's a low-cost, verifiable change (no new infrastructure, just a disclosure change) that directly targets the failure mode that caused the backlash in the first place. A customer reading "This response was generated by our AI assistant" reacts very differently to an odd claim than a customer who believes a human named "Sam" made a considered decision about their account.

Shopify's merchant complaints on its own community forum are a real, ongoing use case of what happens when AI support becomes the default first line with no visible, fast path to a human — merchants describe the bot as an obstacle to solving their problem rather than a shortcut, which is the opposite of automation's intended effect ([Shopify Community](https://community.shopify.com/t/shopify-misleading-merchants-about-support/258145)).

## Common mistakes

- **Measuring success by volume handled, not by issues resolved.** Klarna's headline metric (2.3 million conversations/month) described throughput, not outcomes — and the outcome gap is what forced the reversal.
- **Letting the bot state specific policies with confidence instead of deferring to a human on anything not explicitly verified.** Both Air Canada and Cursor's failures came from the bot inventing specific, confident, wrong answers rather than saying "I'm not certain, let me connect you with someone."
- **Assuming disclaimers protect the company.** Air Canada's tribunal defense — that the bot was a separate legal entity — failed. A generic disclaimer buried in terms of service is unlikely to fare better in a similar case.
- **Making human escalation slow or hidden.** Every case in this article involves a customer who couldn't get a fast, clear path to a human when the bot's answer didn't work.
- **Not labeling AI-generated responses as such.** Cursor's incident specifically involved a customer believing a human named "Sam" had made a considered decision, which amplified the sense of betrayal once the truth came out.

## Best practices for rolling out AI support without the backlash

1. **Scope the bot's authority narrowly and explicitly.** Let it answer order status, general FAQs, and account basics; route anything touching a specific written policy (refunds, fare rules, subscription terms) to a human or a verified, hard-coded lookup rather than free-form generation.
2. **Always disclose that a response is AI-generated**, in the message itself — not buried in a terms-of-service link. Cursor's post-incident fix is the direct evidence this works as damage control; doing it before an incident is cheaper.
3. **Build a visible, fast human-escalation path** and measure how long it actually takes customers to reach one, not just whether the option technically exists.
4. **Track resolution rate, not just conversations handled.** If "resolved by AI" and "conversation ended" are the same metric in your dashboard, you can't see the Klarna-style gap coming.
5. **Treat any hallucinated or contradicted statement as a defect to be logged and fixed, not an isolated anomaly** — Air Canada and Cursor both had a single incident become a legal or PR event because there was no process to catch and correct fabricated claims before they reached customers at scale.
6. **Pilot on a single, low-stakes queue before rolling out company-wide**, and set an explicit rollback trigger (e.g., resolution rate below X%, loyalty score drop of Y points) rather than treating the rollout as a one-way door.

## Frequently asked questions

**1. What does "customer support automation gone wrong" actually mean?**
It refers to documented cases where a company's AI-driven support system produced a false statement, a resolution failure, or a customer backlash serious enough to force a policy change, a lawsuit, or a public reversal — as happened at Air Canada, Cursor, and Klarna.

**2. Is AI customer support inherently bad?**
No. The failures documented here stem from specific decisions — removing human escalation, letting the bot state unverified policy, measuring volume instead of resolution — not from AI support as a category.

**3. What is an AI hallucination in a support context?**
It's when an AI system generates a confident, specific, plausible-sounding answer that has no basis in the company's actual policies or data — as the Air Canada and Cursor bots both did.

**4. Did Klarna fully get rid of human support agents?**
Public reporting describes Klarna reducing human support headcount as it scaled AI handling, then reversing that trend and rehiring after 2025; an exact before/after headcount figure was not independently verifiable in available reporting.

**5. Who is Sebastian Siemiatkowski?**
He is Klarna's CEO, who publicly acknowledged in 2025 that the company's AI-first support strategy prioritized cost over quality ([Yahoo News](https://www.yahoo.com/news/customer-support-ai-went-rogue-120000474.html)).

**6. What company is "Sam" the support bot associated with?**
Cursor, the AI-powered coding tool, whose support agent named Sam fabricated a device-limit policy in April 2025 ([The Register](https://www.theregister.com/2025/04/18/cursor_ai_support_bot_lies/)).

**7. What airline was found liable for its chatbot's advice?**
Air Canada, in a 2024 Canadian Civil Resolution Tribunal ruling ([CBC News](https://www.cbc.ca/news/canada/british-columbia/air-canada-chatbot-lawsuit-1.7116416)).

**8. Can a chatbot be considered a separate legal entity from the company that deploys it?**
No — the Air Canada tribunal explicitly rejected that argument, ruling the airline responsible for all information on its website regardless of source.

**9. What is negligent misrepresentation?**
A legal claim that a party gave false information they should have known was false (or failed to verify), causing another party to rely on it to their detriment — the basis of the Air Canada ruling.

**10. Is it common for AI support bots to invent policies?**
It has happened at multiple, unrelated companies (Air Canada, Cursor) in documented, separately reported incidents, which suggests it's a structural risk of unconstrained generative support rather than a one-off bug.

**11. Why did Klarna's AI-first strategy fail even though the bot handled millions of conversations successfully?**
Handling a conversation and resolving it satisfactorily are different outcomes; the company's own public statements describe prioritizing cost/efficiency metrics over the quality metrics that actually predict customer retention.

**12. What percentage of fully-AI-handled support interactions fail to resolve the issue?**
Roughly 38.8%, per Accenture research cited by Gleap's analysis of AI support failures ([Gleap](https://www.gleap.io/blog/ai-support-failures-lessons)).

**13. Does removing human agents actually save money once you account for the failures?**
The available evidence doesn't provide a verified net-savings figure that accounts for churn, legal exposure, and re-work; Klarna's own reversal suggests the net calculation didn't favor a full AI-only approach for them specifically.

**14. What's the difference between an AI chatbot and an AI agent in a support context?**
A chatbot converses within a defined scope; an agent can take multi-step actions across systems (e.g., actually issuing a refund). Most of the failures in this article involve conversational bots making claims, not agents taking unauthorized actions — a narrower but still serious failure mode.

**15. Are these AI support failures unique to any one industry?**
No — they span airlines (Air Canada), fintech (Klarna), and software (Cursor), suggesting the pattern is about deployment decisions, not industry-specific technology limits.

**16. What root causes show up repeatedly across AI support failures?**
Outdated knowledge, missing context, overstepping the bot's actual authority, missing frustration signals, and difficult escalation to a human (Gleap).

**17. Does a fast AI response make up for an incorrect one?**
Evidence suggests no — nearly 90% of surveyed consumers reported reduced loyalty when human support was removed, even when the AI response itself was fast (Gleap).

**18. What is "agent washing" and is it related to this topic?**
It's a separate but related phenomenon (vendors mislabeling ordinary chatbots as autonomous "agents"); it matters here because a company may believe it deployed something more capable and self-correcting than it actually did.

**19. Did any of these companies apologize publicly?**
Yes — Cursor's co-founder apologized and clarified the fabricated policy; Klarna's CEO acknowledged the strategy prioritized cost over quality.

**20. Is there a single "safe" amount of AI to use in support?**
No universal number exists in the evidence; the safer signal is scope (what the bot is allowed to state as fact) and escalation speed, not a percentage of volume automated.

**21. How do I check whether my own support bot has stated an incorrect policy?**
Audit a sample of transcripts against your actual written policy documents, specifically the phrasing the bot uses for anything time-sensitive or plan-specific (refunds, cancellations, discounts) where language can drift from the source.

**22. How do I label AI-generated responses without sounding robotic or off-putting to customers?**
A short, plain-language line at the top or bottom of the message (e.g., "This reply was generated by our support assistant") is what Cursor adopted post-incident, and it doesn't require restructuring the response itself.

**23. How do I set up a fast escalation path to a human?**
At minimum, give the bot an explicit trigger (repeated frustration language, a direct request, or any policy-specific question) that immediately routes to a queued human, and measure the time-to-human as its own metric.

**24. How do I decide which support topics are safe to fully automate?**
Start with topics that have a single, unambiguous, rarely-changing answer (order status, business hours, general FAQs) and keep anything tied to money, contracts, or individual circumstances (refunds, legal terms, account-specific disputes) behind human review.

**25. How do I roll back an AI support deployment if it's not working?**
Define the rollback trigger before launch (e.g., resolution rate falling below a set threshold, or a spike in complaint volume) so the decision isn't made reactively after a PR incident forces it.

**26. How do I train a support bot to say "I don't know" instead of guessing?**
Constrain its responses to a verified knowledge base and explicitly instruct it to escalate — rather than generate an answer — for any question outside that base; this is a prompt/system design choice, not something the model does automatically.

**27. How do I audit my AI support vendor's actual resolution rate, not just volume handled?**
Ask the vendor for resolution-rate data broken out from conversation-count data specifically, since the Klarna case shows these can diverge significantly.

**28. How do I communicate an AI support rollout to customers without triggering distrust?**
Being upfront that a bot is involved, and pairing that disclosure with a visible human option, addresses the trust gap more directly than presenting the bot as indistinguishable from a person.

**29. How do I know if my support automation is legally exposing the company?**
Any customer-facing statement your bot makes about policy, pricing, or entitlements carries the same liability exposure as a page your legal team wrote, per the Air Canada precedent — review it with that standard.

**30. How do I prevent an AI bot from fabricating a policy under pressure (e.g., a bug it can't otherwise explain)?**
Give it an explicit fallback response for "I don't have information about that" scenarios instead of open-ended generation, since fabrication in both documented cases arose from the model filling a gap rather than admitting one.

**31. Is there research showing AI-only interactions cost more in the long run than blended human-AI support?**
The evidence assembled here shows correlation (Klarna's reversal, high failure rates, loyalty loss) rather than a single controlled cost-comparison study; treat any specific ROI percentage as directional, not proven, absent that study.

**32. Does the size of the company change the risk profile?**
The documented cases span a large airline, a large fintech, and a mid-size software company, suggesting the risk isn't limited to scale — smaller companies may have less legal/PR resilience to absorb an incident, which arguably raises the stakes.

**33. What's the relationship between AI support failures and "cognitive debt" in AI research generally?**
They're different concepts — cognitive debt describes reduced human skill/engagement from AI reliance in tasks like writing; support failures described here are about factual accuracy and escalation, not skill atrophy — don't conflate the two.

**34. Is there a standard framework for evaluating AI support vendor claims before buying?**
No single industry-standard checklist emerged from this research; the practical proxy is asking for resolution-rate data, hallucination-rate testing results, and named escalation-speed guarantees in the contract.

**35. How does this topic relate to companies that build genuinely autonomous support agents versus scripted chatbots?**
The distinction matters for risk: a scripted chatbot with a narrow decision tree is less likely to fabricate a specific policy than an open-ended generative agent, which is closer to what caused the Cursor and Air Canada incidents.

**36. AI chatbot vs. human support agent — which resolves issues better?**
Available evidence (Gleap's ~38.8% failure rate on fully-AI interactions) suggests human-inclusive resolution outperforms fully-AI handling on complex issues, though simple, high-volume queries may favor AI on speed alone.

**37. Klarna's AI support vs. its human support — what changed before and after the reversal?**
Before: AI handled roughly 700 agents' worth of volume with cost savings as the headline metric. After: the company publicly reprioritized quality and began rehiring humans, per its own CEO's statements.

**38. Air Canada's chatbot vs. a human travel agent — who would have caught the bereavement-fare error?**
A human agent trained on the airline's actual bereavement policy would very likely have known the discount had to be requested before travel, since that's the documented real policy the bot contradicted.

**39. Cursor's AI support bot vs. its own product's coding accuracy — is there a contradiction?**
Not necessarily a contradiction in capability, but it does show that a company skilled at building AI tools can still under-govern how those tools are deployed in a different function (support) with different failure consequences.

**40. Shopify's AI chatbot vs. direct merchant support — which do merchants prefer, per the forum evidence?**
Merchant complaints on Shopify's own community forum specifically describe wanting faster access to a human, indicating a stated preference against AI-first routing when their issue isn't resolved quickly.

**41. My AI chatbot gave a customer wrong information about a discount — what should I do first?**
Correct the customer directly and honor a reasonable resolution consistent with your actual policy; the Air Canada precedent suggests contesting that "the bot said it, not us" is unlikely to succeed if it comes to a dispute.

**42. Customers are canceling after our AI support bot said something false — how do we contain it?**
Acknowledge the error publicly and specifically (as Cursor did), correct the record, and add a visible fix (like response labeling) rather than a generic apology with no process change.

**43. Our AI support resolution rate looks fine in the dashboard but complaints are rising — what's the disconnect?**
Check whether "resolved" in your dashboard means "conversation ended" or "customer's actual problem was fixed" — Klarna's case shows these metrics can diverge sharply.

**44. We removed human support entirely and now see churn — is that reversible?**
Yes, in the sense that Klarna itself reversed course; expect the fix to take time and explicit reinvestment, not just a policy statement, since rebuilding trust after a backlash is typically slower than the backlash itself.

**45. Our support bot keeps escalating everything to a human, defeating the point of automating — how do we fix that without reintroducing the hallucination risk?**
Narrow the bot's confident-answer scope to genuinely low-risk, unambiguous topics rather than loosening its constraints on ambiguous ones — the fix for over-escalation is better bot training data, not looser guardrails.

**46. Should a small business buy an "AI-first" support platform or a "human-plus-AI" one?**
Given the documented failure modes above, a platform that makes human escalation fast and native — rather than one designed to minimize human involvement — better matches what the evidence shows customers and companies actually need.

**47. What questions should I ask an AI customer support vendor before signing a contract?**
Ask specifically for their documented resolution rate (not just automation rate), how they handle escalation speed, whether responses are labeled as AI-generated, and how they've handled a hallucination incident if one has occurred.

**48. Is there a vendor or platform specifically built around human handoff rather than replacement?**
The evidence here doesn't endorse a specific vendor; the buying criterion that matters, per the case studies, is a genuinely fast, visible human-escalation feature rather than a marketing claim about "seamless AI-to-human handoff."

**49. How much should a small company budget for a hybrid AI-plus-human support rollout versus a full AI replacement?**
No verified budget benchmark exists in the sources reviewed; the more defensible approach is piloting on a subset of tickets and measuring resolution rate and loyalty impact before committing budget to a full rollout in either direction.

**50. Where can I get help designing an AI support rollout that avoids these failure patterns?**
A structured build — with explicit escalation rules, labeled AI responses, and resolution-rate tracking rather than volume tracking — is the kind of scoping conversation an AI agents and automation partner can help design before launch, rather than after an incident forces a redesign.

## Key takeaways

- Air Canada's tribunal loss establishes that companies are legally responsible for what their AI chatbots say, not just for what they write themselves.
- Cursor and Air Canada both show the same failure pattern: an AI bot fabricating a specific, confident, false policy rather than admitting uncertainty.
- Klarna's public reversal shows that even a technically successful, large-scale AI support deployment can still be a strategic mistake if it optimizes for cost over resolution quality.
- Roughly 38.8% of fully-AI-handled support interactions fail to resolve the customer's issue, and nearly 90% of consumers report reduced loyalty when human support disappears entirely (Gleap/Accenture-cited data).
- The fixes that worked in practice — labeling AI responses, keeping a fast human-escalation path, scoping the bot's authority narrowly — are process changes, not just better models.

## Relevant tools.scult.in resources

If you're mapping out prompts for how a support team should actually word AI-assisted responses, escalation scripts, or policy-safe FAQ language, the [customer support prompt library](/prompts/customer-support) and the [AI engineering prompt library](/prompts/ai-engineering) are built for exactly this kind of scoping work before you touch a production deployment.

If your team is weighing how far to take AI support automation — where to draw the line between a scripted assistant and something closer to an autonomous agent, and how to build in the escalation and audit safeguards this article's cases show are missing when things go wrong — that's a scoping conversation worth having with a team that builds [AI agents and automation](/services/ai-agents-automation) for a living, before a rollout decision turns into an incident report.

## Sources

- https://www.yahoo.com/news/customer-support-ai-went-rogue-120000474.html
- https://www.cmswire.com/customer-experience/ai-in-customer-service-billion-dollar-mistake-when-deployed-wrong/
- https://www.forbes.com/sites/marisagarcia/2024/02/19/what-air-canada-lost-in-remarkable-lying-ai-chatbot-case/
- https://www.cbc.ca/news/canada/british-columbia/air-canada-chatbot-lawsuit-1.7116416
- https://www.theregister.com/2025/04/18/cursor_ai_support_bot_lies/
- https://www.cxtoday.com/contact-center/a-contact-center-chatbot-invents-company-policies-now-customers-want-out/
- https://digialps.com/ai-support-fail-cursor-bot-invents-policy-causes-user-uproar/
- https://community.shopify.com/t/shopify-misleading-merchants-about-support/258145
- https://www.gleap.io/blog/ai-support-failures-lessons
- https://fortune.com/2025/08/18/mit-report-95-percent-generative-ai-pilots-at-companies-failing-cfo/
