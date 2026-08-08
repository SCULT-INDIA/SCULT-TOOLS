import type { Prompt } from '../types'

/**
 * Marketing & Ads (Tier 2) — extends the UTM Builder and Marketing ROI
 * Calculator with the thinking that happens before either tool is opened
 * (naming, briefs, creative, segmentation) and the writing that happens
 * after the numbers come back (performance narratives). See
 * docs/research/prompt-library.md §4/§10.2 — 8 prompts to start.
 *
 * Deliberately excluded: any prompt implying an LLM can calculate real
 * ROI/ROAS from a paragraph of numbers. That math belongs to the Marketing
 * ROI Calculator's documented formula (see lib/tools/marketing-roi-
 * calculator/meta.ts) — prompts here that touch performance data are scoped
 * to interpreting and narrating numbers you already calculated, never to
 * recomputing them.
 */
export const prompts: readonly Prompt[] = [
  {
    slug: 'utm-naming-convention-for-a-campaign',
    category: 'ads',
    title: 'Design a UTM naming convention for a new campaign',
    description:
      "Turn a one-off campaign into a documented source/medium/campaign naming convention you'll actually reuse next time — the planning step before the UTM Builder.",
    promptText: `I'm planning a campaign called "{{campaign_name}}" that will run across these channels: {{channels}}. It will be tracked in {{ga_platform}}.

Design a UTM naming convention for this campaign that covers utm_source, utm_medium, utm_campaign, and utm_content for every channel listed. For each channel, give me:
1. The exact utm_source and utm_medium values to use (lowercase, hyphenated, no spaces)
2. A utm_campaign value that stays constant across all channels so I can group results
3. A utm_content pattern for distinguishing ad variants or placements within a channel

Existing conventions to respect, if any: {{existing_conventions}}

Then give me a short naming-convention reference table I can save and reuse for the next campaign, plus 2 mistakes to avoid that would fragment my reports.`,
    variables: [
      {
        name: 'campaign_name',
        description: 'What this specific campaign is called internally',
        example: 'Diwali Sale 2026',
        required: true,
      },
      {
        name: 'channels',
        description:
          'The channels or platforms this campaign will run on, comma separated',
        example: 'Google Search, Meta Feed, Email newsletter, Influencer partnerships',
        required: true,
      },
      {
        name: 'ga_platform',
        description: 'Which analytics platform will read these UTMs',
        example: 'GA4',
        required: false,
      },
      {
        name: 'existing_conventions',
        description:
          "Any naming rules you already follow, so the new convention doesn't conflict",
        example: 'We already use lowercase-hyphenated source values like google-search',
        required: false,
      },
    ],
    targetTools: ['ChatGPT', 'Claude', 'Gemini'],
    tags: ['utm', 'campaign tracking', 'attribution', 'naming convention', 'analytics'],
    whyItWorks:
      "Inconsistent casing and ad-hoc source/medium values are the single most common cause of fragmented GA4 reports — 'Google-Search' and 'google-search' land as two different rows. Asking for a reusable table, not just filled-in values for one campaign, forces the naming convention itself to become the deliverable — which is what actually prevents fragmentation on campaign two, not just campaign one. Paste the resulting source/medium/campaign values straight into the UTM Builder rather than typing them by hand.",
    exampleOutput:
      '| Channel | utm_source | utm_medium | utm_campaign | utm_content |\n|---|---|---|---|---|\n| Google Search | google | cpc | diwali-sale-2026 | {ad-group}-{keyword-theme} |\n| Meta Feed | meta | paid-social | diwali-sale-2026 | {creative-id}-{placement} |\n| Email | newsletter | | diwali-sale-2026 | {send-date}-{segment} |\n| Influencer | {handle} | affiliate | diwali-sale-2026 | {post-type} |\n\nMistakes to avoid: mixing "email" and "newsletter" as utm_medium across sends (pick one), and letting utm_campaign drift between "diwali-sale-2026" and "diwali-sale" mid-campaign — GA4 treats them as separate campaigns.',
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-07-18' },
      { tool: 'Claude', version: 'Claude Opus 4.5', date: '2026-07-20' },
    ],
    changelog: [
      {
        date: '2026-07-20',
        note: 'Initial version, verified against GPT-5.1 and Claude Opus 4.5.',
      },
    ],
    relatedToolSlug: 'utm-builder',
  },
  {
    slug: 'google-meta-ad-copy-variants',
    category: 'ads',
    title: 'Generate Google and Meta ad copy variants that fit their character limits',
    description:
      "Get ad copy variants for Google Search (RSA) and Meta Feed ads that are pre-checked against each platform's actual character limits, instead of copy you have to trim after the fact.",
    promptText: `Write ad copy for "{{product_or_offer}}" targeted at {{audience}}. The main benefit to lead with is: {{key_benefit}}. Preferred call to action: {{cta}}. Tone: {{tone}}.

Write two sets, respecting these exact platform limits — count the characters yourself and reject anything over the limit before showing it to me:

GOOGLE SEARCH (Responsive Search Ads):
- 8 headlines, each ≤30 characters
- 3 descriptions, each ≤90 characters

META (Feed / Reels):
- 3 primary text variants, each ≤125 characters (this is where Meta visually truncates on most placements, even though the field technically allows more)
- 3 headlines, each ≤40 characters
- 1 link description, ≤30 characters

For every line, show the character count in parentheses so I can verify it myself. Flag any line that repeats a claim already made elsewhere in the same set — I want variety, not the same sentence restated.`,
    variables: [
      {
        name: 'product_or_offer',
        description: "What's being advertised",
        example: 'Online yoga membership, first month free',
        required: true,
      },
      {
        name: 'audience',
        description: 'Who the ad is targeted at',
        example:
          'Busy working professionals aged 28-45 who want to start exercising but lack time',
        required: true,
      },
      {
        name: 'key_benefit',
        description: 'The single benefit or differentiator to lead with',
        example: 'Live classes at 6am and 9pm so it fits before or after work',
        required: true,
      },
      {
        name: 'cta',
        description: 'The call to action you want the copy to drive toward',
        example: 'Start your free month',
        required: false,
      },
      {
        name: 'tone',
        description: 'The tone the copy should carry',
        example: 'Encouraging, not pushy',
        required: false,
      },
    ],
    targetTools: ['ChatGPT', 'Claude', 'Gemini'],
    tags: [
      'ad copy',
      'google ads',
      'meta ads',
      'responsive search ads',
      'character limits',
      'creative',
    ],
    whyItWorks:
      'Google truncates RSA headlines and descriptions server-side, and Meta visually cuts off primary text around 125 characters on most placements — copy written without the limit in mind either gets chopped mid-word or forces a slow rewrite-and-recount cycle. Asking the model to print its own character count per line makes the constraint self-checking instead of something you verify by hand afterward, and explicitly asking it to flag repeated claims counters the well-documented tendency of LLMs to generate lines that read differently but make the identical point.',
    exampleOutput:
      'GOOGLE SEARCH headlines (sample):\n1. "Yoga That Fits Your Day" (24)\n2. "First Month, On Us" (19)\n3. "6am or 9pm — You Pick" (22)\n\nMETA primary text (sample):\n1. "Between meetings and dinner, there’s a class that fits. Try your first month free." (85)',
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-07-22' },
      { tool: 'Gemini', version: 'Gemini 3 Pro', date: '2026-07-25' },
    ],
    changelog: [
      {
        date: '2026-07-25',
        note: 'Initial version; character limits checked against Google Ads and Meta Ads Help Center specs.',
      },
    ],
  },
  {
    slug: 'campaign-goal-to-creative-brief',
    category: 'ads',
    title: 'Turn a campaign goal into a full creative and channel brief',
    description:
      'Expand a one-line campaign goal into a structured brief covering audience, message, channel mix, budget guardrails and success metrics — the document a designer or media buyer can actually work from.',
    promptText: `I need a campaign brief for this goal: {{goal}}.
Budget: {{budget}}.
Audience: {{audience_hint}}.
Timeline: {{timeline}}.
Constraints: {{constraints}}.

Write a one-page campaign brief with these sections:
1. Objective — restate the goal as a single measurable outcome
2. Audience — 2-3 sentences plus the single biggest objection this audience has before converting
3. Core message — one sentence the whole campaign should communicate, and why it's the right one for this audience
4. Channel mix — recommend which channels to prioritize given the budget and timeline, with a rough percentage split
5. Success metrics — the 2-3 numbers that would tell us this worked, distinct from vanity metrics like impressions
6. Risks — 2 things most likely to make this underperform, and what to watch for early

Keep it to something a media buyer or designer could read in 5 minutes and start working from. Do not invent statistics or benchmark numbers you don't have — if a number depends on data I haven't given you, say what you'd need instead of guessing one.`,
    variables: [
      {
        name: 'goal',
        description: 'The business goal this campaign needs to hit',
        example:
          'Get 200 qualified demo signups for our new expense-management SaaS in Q3',
        required: true,
      },
      {
        name: 'budget',
        description: 'Budget available for the campaign',
        example: '₹4,50,000 for the quarter across all paid channels',
        required: true,
      },
      {
        name: 'audience_hint',
        description: 'A rough description of the target audience',
        example: 'Finance managers at 50-500 employee companies in India',
        required: true,
      },
      {
        name: 'timeline',
        description: 'Campaign duration or deadline',
        example: '8 weeks, launching September 1',
        required: true,
      },
      {
        name: 'constraints',
        description: 'Constraints, brand guidelines, or channels to avoid',
        example:
          'No influencer spend; must stay compliant with RBI advertising guidelines for fintech-adjacent claims',
        required: false,
      },
    ],
    targetTools: ['Claude', 'ChatGPT', 'Gemini'],
    tags: ['campaign brief', 'strategy', 'planning', 'media buying', 'creative brief'],
    whyItWorks:
      "A campaign that starts from a one-line goal usually loses coherence somewhere between strategy and execution — the designer builds one message, the media buyer targets a different audience, and nobody agreed on what 'success' means until the results come in and everyone disagrees about them. Forcing the output into these six sections mirrors what a real creative brief template does, and the explicit instruction against inventing benchmark numbers matters because campaign briefs are exactly where a fabricated 'industry-average CTR of 3.2%' quietly becomes the plan's foundation.",
    exampleOutput:
      '1. Objective: Generate 200 qualified demo signups by September 30.\n2. Audience: Finance managers at 50-500 employee Indian companies who currently reconcile expenses in spreadsheets. Biggest objection: "another tool to roll out to a team that already resists change."\n3. Core message: "Approvals in hours, not spreadsheet email chains" — because the objection is change-fatigue, not price...',
    verifiedAgainst: [
      { tool: 'Claude', version: 'Claude Opus 4.5', date: '2026-07-10' },
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-07-12' },
    ],
    changelog: [{ date: '2026-07-12', note: 'Initial version.' }],
  },
  {
    slug: 'campaign-metrics-to-performance-narrative',
    category: 'ads',
    title: 'Turn raw campaign metrics into a plain-English performance takeaway',
    description:
      "Feed in numbers you've already calculated — spend, revenue, ROAS, ROI — and get a written takeaway a founder or client can read in two minutes. This does not calculate anything: run your numbers through the Marketing ROI Calculator first, then bring the output here.",
    promptText: `I've already calculated these numbers for the campaign "{{campaign_name}}" over {{period}} — do not recalculate or second-guess the math, treat every figure below as correct:

{{metrics}}

This will be read by: {{audience_for_report}}.

Write a performance takeaway, not a re-explanation of the numbers:
1. One-sentence verdict — did this campaign make or lose money, in plain terms
2. The single most important reason why (point at the specific number that explains it — e.g. a gap between ROAS and ROI, a CPA trend, a conversion-rate shift)
3. What changed versus the previous period, if I gave you that comparison, and whether that change is the headline or a side note
4. One thing worth double-checking before acting on this (e.g. attribution window, whether margin is accurate, seasonality) — not a hedge on every line, just the one caveat that actually matters here
5. A recommended next action, phrased as a decision (continue / pause / adjust budget / adjust targeting), not a vague "monitor closely"

Do not introduce any number I didn't give you. If you need a number I haven't provided to make the verdict solid, ask for it instead of estimating it.`,
    variables: [
      {
        name: 'campaign_name',
        description: 'Name of the campaign being reported on',
        example: 'August Meta Prospecting — New Customers',
        required: true,
      },
      {
        name: 'period',
        description: 'The reporting period these numbers cover',
        example: 'August 1-31, 2026',
        required: true,
      },
      {
        name: 'metrics',
        description: 'The already-calculated numbers, pasted in as-is',
        example:
          'Spend ₹2,80,000. Revenue attributed ₹9,10,000. ROAS 3.25x. Gross margin 30%. ROI (from Marketing ROI Calculator) -2%. Conversions 145. CPA ₹1,931. Previous month ROI was +18%.',
        required: true,
      },
      {
        name: 'audience_for_report',
        description: 'Who will read this and what they care about',
        example: 'Founder who only has 2 minutes and cares about profit, not ROAS',
        required: true,
      },
    ],
    targetTools: ['Claude', 'ChatGPT'],
    tags: [
      'performance reporting',
      'roi',
      'roas',
      'reporting',
      'analysis',
      'client reporting',
    ],
    whyItWorks:
      "The failure mode this avoids is an LLM quietly inventing or 'helpfully' recalculating a benchmark figure it wasn't given — a real financial verdict should come from an actual calculation (the Marketing ROI Calculator's documented ROI formula, not a model doing arithmetic from a paragraph), and this prompt is deliberately scoped to interpretation and narrative only. Locking the model to the numbers you supply, and instructing it to ask rather than estimate, keeps the output useful for what an LLM is actually good at — turning a spreadsheet of numbers into the one sentence a founder needs — without letting it drift into inventing the underlying math.",
    exampleOutput:
      "Verdict: This campaign lost money in August despite a 3.25x ROAS. The gap is margin: at 30% gross margin, break-even ROAS is about 3.3x, so 3.25x lands just under water — ROI of -2% confirms it. Versus July's +18% ROI, this is the headline, not a side note. Before acting: confirm the attribution window didn't shift between months, since that alone could explain part of the swing. Recommended action: pause and re-test creative before adding budget — don't scale a campaign that's currently losing money even at a healthy-looking ROAS.",
    verifiedAgainst: [
      { tool: 'Claude', version: 'Claude Opus 4.5', date: '2026-07-29' },
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-07-30' },
    ],
    changelog: [
      {
        date: '2026-07-30',
        note: 'Initial version, explicitly scoped to narrative-only after testing showed models will "helpfully" recompute ROI from partial inputs unless told not to.',
      },
    ],
    relatedToolSlug: 'marketing-roi-calculator',
  },
  {
    slug: 'audience-segmentation-brainstorm',
    category: 'ads',
    title: 'Brainstorm audience segments for a new campaign before you build targeting',
    description:
      'Generate a wide set of candidate audience segments and the angle that would resonate with each, before you narrow down to what you actually target in-platform.',
    promptText: `I'm selling: {{product}}.
What I know about current customers: {{known_customers}}.
Campaign goal: {{goal}}.
Segments to exclude: {{exclude}}.

Generate 8 candidate audience segments I could target, each with:
1. A one-line description of who they are
2. The specific pain point or trigger that would make them receptive right now
3. The angle/message that would resonate with this segment specifically (not the same generic pitch reworded)
4. A guess at where this segment is easiest to reach (channel, not exact targeting parameters)
5. A one-line reason this segment might NOT work, so I can sanity-check before spending against it

Order them from most obviously validated by what I already know about my customers, to most speculative. Don't pad the list with segments that are just my existing customer base described a different way — I want genuinely distinct angles.`,
    variables: [
      {
        name: 'product',
        description: "What you're selling",
        example: 'A project management tool built for construction contractors',
        required: true,
      },
      {
        name: 'known_customers',
        description: 'What you already know about who buys today',
        example:
          'Mostly contractors managing 5-20 person crews who found us through referrals',
        required: true,
      },
      {
        name: 'goal',
        description: 'What this campaign needs to achieve',
        example: 'Find a second viable customer segment beyond our core referral base',
        required: true,
      },
      {
        name: 'exclude',
        description: 'Segments to explicitly exclude',
        example:
          'Enterprise construction firms — our product does not scale to their compliance needs',
        required: false,
      },
    ],
    targetTools: ['ChatGPT', 'Claude', 'Gemini'],
    tags: ['audience segmentation', 'targeting', 'strategy', 'brainstorm', 'positioning'],
    whyItWorks:
      'Segmentation brainstorms tend to produce eight versions of the same customer restated, because a model defaults to the safest, most obviously-correct segment repeatedly. Explicitly asking for a bull case, a bear case, and an ordering from validated to speculative forces real differentiation between segments, and gives you a built-in way to triage which ones deserve a small test budget versus which ones are a guess — this is a brainstorm to narrow from, not a finished targeting plan.',
    exampleOutput:
      "1. Referral-adjacent contractors (validated) — crews of 5-20 who haven't heard of you yet but match existing customers exactly. Angle: 'the tool contractors like you already switched to.' Weakness: same segment as today, just unreached — may not be a second segment at all.\n2. Solo contractors scaling to their first hire (speculative) — trigger: hiring their first employee and needing to share schedules for the first time...",
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-07-14' },
      { tool: 'Gemini', version: 'Gemini 3 Pro', date: '2026-07-16' },
    ],
    changelog: [{ date: '2026-07-16', note: 'Initial version.' }],
  },
  {
    slug: 'landing-page-headline-ab-test-variants',
    category: 'ads',
    title: 'Draft A/B test headline variants for a landing page',
    description:
      'Get a set of genuinely different headline angles for a landing page test, each with the hypothesis it is testing — not ten synonyms of the same sentence.',
    promptText: `Landing page purpose: {{page_purpose}}.
Current headline (if any): {{current_headline}}.
Primary benefit to communicate: {{primary_benefit}}.
Audience: {{audience}}.

Write 6 headline variants for an A/B test, each testing a genuinely different angle — not the same sentence reworded. Use these 6 angles specifically:
1. Outcome-led (what changes for them)
2. Pain-led (the problem they're currently living with)
3. Specific-number-led (a concrete, honest number — not a made-up stat)
4. Social-proof-led (implies validation without a fabricated claim)
5. Speed/simplicity-led
6. Direct/no-frills, stating exactly what the product does

For each headline, add one line: what hypothesis this variant tests, so I know what I'll actually learn depending on which one wins. Keep every headline under 60 characters so it doesn't wrap awkwardly on mobile. Do not invent a specific statistic, review count, or customer number I haven't given you — if the social-proof angle needs a real number, mark it as a placeholder I need to fill in, don't guess one.`,
    variables: [
      {
        name: 'page_purpose',
        description: 'What the landing page is for',
        example:
          'Landing page for a free trial signup for an invoicing tool aimed at freelancers',
        required: true,
      },
      {
        name: 'current_headline',
        description: 'The existing headline, if there is one',
        example: '"Send invoices in seconds"',
        required: false,
      },
      {
        name: 'primary_benefit',
        description: 'The main thing this page needs to communicate',
        example: 'Get paid faster because clients can pay directly from the invoice',
        required: true,
      },
      {
        name: 'audience',
        description: "Who's landing on this page",
        example:
          'Freelance designers and consultants who currently use Word or Excel invoices',
        required: true,
      },
    ],
    targetTools: ['Claude', 'ChatGPT', 'Gemini'],
    tags: ['landing page', 'headline testing', 'ab testing', 'conversion', 'copywriting'],
    whyItWorks:
      "Headline tests fail to produce a learning when every variant tests the same underlying idea with different words — you learn 'people liked headline B' without knowing why. Assigning each variant a distinct, named angle (outcome vs. pain vs. proof vs. speed) turns the test into something that answers a real question about what resonates, and the explicit ban on inventing statistics closes off the most common way AI-generated landing page copy quietly becomes false advertising.",
    exampleOutput:
      '1. Outcome-led: "Get paid the same day you send it" — tests whether speed-of-payment beats speed-of-sending as the hook.\n2. Pain-led: "Stop chasing clients for payment" — tests whether the pain of chasing (not the invoice itself) is the real trigger.\n3. Number-led: "Paid on average 9 days faster" [placeholder — insert your real figure] — tests whether a concrete number outperforms a feeling-based claim.',
    verifiedAgainst: [
      { tool: 'Claude', version: 'Claude Opus 4.5', date: '2026-07-08' },
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-07-09' },
    ],
    changelog: [{ date: '2026-07-09', note: 'Initial version.' }],
  },
  {
    slug: 'campaign-email-subject-lines',
    category: 'ads',
    title: 'Generate email subject lines for a campaign send, sized for the inbox',
    description:
      'Get subject line variants for a specific email send, each checked against mobile truncation, spam-trigger language and the preview text pairing — not just a list of clever lines.',
    promptText: `Email purpose: {{email_purpose}}.
Audience: {{audience}}.
Key detail that must appear or be clearly implied: {{key_detail}}.
Brand voice: {{brand_voice}}.

Write 8 subject line variants, each ≤45 characters (so it doesn't truncate on most mobile inboxes), plus a matching preview text (≤90 characters) for each — the preview text should add information, not just repeat the subject line.

Group them into: 2 curiosity-led, 2 benefit/offer-led, 2 urgency-led (real urgency only — the offer actually expires, don't manufacture false scarcity), 2 plain/direct.

Flag any variant that risks landing in spam or promotions due to language patterns (excessive punctuation, "free," all-caps words, too many emoji) so I know which ones are riskier to send even if they'd perform well on open rate alone.`,
    variables: [
      {
        name: 'email_purpose',
        description: 'What this email is trying to get someone to do',
        example:
          "Get past customers who haven't ordered in 90 days to use a 15% comeback discount before it expires Friday",
        required: true,
      },
      {
        name: 'audience',
        description: "Who's receiving it",
        example:
          "Lapsed customers of a D2C skincare brand, mostly opened emails before but haven't purchased in 3 months",
        required: true,
      },
      {
        name: 'key_detail',
        description: 'The one fact or offer that must appear or be implied',
        example: '15% off, code COMEBACK15, expires this Friday',
        required: true,
      },
      {
        name: 'brand_voice',
        description: 'Tone or voice guide for the brand',
        example:
          'Warm and a little playful, never uses ALL CAPS or excessive urgency language',
        required: false,
      },
    ],
    targetTools: ['ChatGPT', 'Claude', 'Gemini'],
    tags: [
      'email marketing',
      'subject lines',
      'deliverability',
      'copywriting',
      'ab testing',
    ],
    whyItWorks:
      "Subject lines are judged almost entirely by inbox preview, so a 'great' line that truncates at character 38 or duplicates its own preview text is invisible value. Testing across four distinct psychological angles, rather than eight variations of one hook, is what makes a subject-line test actually informative, and flagging spam-trigger language upfront prevents optimizing for an open rate that never reaches the inbox in the first place. The false-urgency guardrail matters because manufactured scarcity is both a deliverability risk and, in several markets, a regulated deceptive-marketing practice.",
    exampleOutput:
      'Curiosity: "We kept your seat warm" / Preview: "One reason we think you’ll be back this week."\nBenefit: "15% back, no strings" / Preview: "Same products, same you, less on the bill."\nUrgency (real): "Ends Friday: your 15% is waiting" / Preview: "Code COMEBACK15, expires midnight Friday."\nFlagged risk: any variant using "FREE" in caps or 3+ emoji is more likely to route to Promotions.',
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-07-05' },
      { tool: 'Claude', version: 'Claude Sonnet 4.5', date: '2026-07-06' },
    ],
    changelog: [{ date: '2026-07-06', note: 'Initial version.' }],
    relatedToolSlug: 'email-signature-generator',
  },
  {
    slug: 'competitor-ad-copy-analysis',
    category: 'ads',
    title: "Analyze a competitor's ad copy for the strategy behind it",
    description:
      'Paste in a competitor ad you spotted and get a structured breakdown of the strategy behind it — not just a compliment on their copywriting.',
    promptText: `Here is a competitor ad I spotted:
{{competitor_ad_text}}
Seen on: {{where_seen}}.

For context, I sell: {{your_product}}. My current angle: {{your_current_angle}}.

Break this ad down:
1. What audience and buying-stage does this ad appear to target (cold / aware / comparison-shopping)? What in the copy signals that?
2. What's the core persuasion mechanism — pain-agitation, social proof, price/speed, authority, something else — and which specific words or phrases carry it?
3. What claim(s) in this ad would you NOT be able to make honestly for my product, and which ones could I make for real?
4. What's the most likely weakness in this ad a prospect would notice (vague proof point, unverifiable claim, missing objection-handling)?
5. Based on this, suggest one ad angle for my product that responds to the same audience need without copying their specific wording or claims.

Be specific about what's actually happening in the copy, not generic praise like "strong CTA" — point to the exact phrase and explain the mechanism.`,
    variables: [
      {
        name: 'competitor_ad_text',
        description: 'The actual ad copy or creative description you observed',
        example:
          'Headline: "Still doing payroll by hand?" Body: "Switch to RunPay and process payroll in under 10 minutes. Trusted by 12,000+ Indian SMBs. Start your free trial." CTA: "Try RunPay Free"',
        required: true,
      },
      {
        name: 'where_seen',
        description: 'The platform or placement where you saw it',
        example: 'Meta Feed ad, seen while scrolling Instagram',
        required: true,
      },
      {
        name: 'your_product',
        description: 'What you sell, for comparison',
        example: 'A payroll and compliance tool for Indian SMBs, similar price point',
        required: true,
      },
      {
        name: 'your_current_angle',
        description: 'What your current ads say, if any',
        example: 'Our ads currently lead with "100% PF/ESI compliant, always"',
        required: false,
      },
    ],
    targetTools: ['Claude', 'ChatGPT', 'Gemini'],
    tags: ['competitor analysis', 'ad copy', 'creative strategy', 'positioning'],
    whyItWorks:
      "Competitor-ad analysis is easy to do badly — either restating what the ad says, or generic copywriting-textbook praise that doesn't transfer to action. Structuring the analysis around audience signal, persuasion mechanism, and an honest claims-comparison (what you could and couldn't say for real) turns 'that's a good ad' into a specific, actionable input for your own creative, and forces the model to name the exact phrase doing the work rather than a vague summary. The explicit instruction against copying wording also keeps the output as inspiration, not something that risks looking derivative.",
    exampleOutput:
      '1. Audience/stage: Cold-to-aware — "Still doing payroll by hand?" targets people who haven\'t considered switching yet, not comparison shoppers.\n2. Mechanism: Pain-agitation (the question) paired with speed-based social proof ("under 10 minutes," "12,000+ SMBs") — the number is doing the trust-building, not the product description.\n3. Claims you could make for real: speed and trust-through-scale, if you have comparable numbers. Not honestly makeable: implying payroll compliance is solved passively — that\'s a different value prop than speed...',
    verifiedAgainst: [
      { tool: 'Claude', version: 'Claude Opus 4.5', date: '2026-07-27' },
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-07-28' },
    ],
    changelog: [{ date: '2026-07-28', note: 'Initial version.' }],
  },
] as const
