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
  {
    slug: 'ads-facebook-scroll-stopping-hook-variants',
    category: 'ads',
    title: `Turn one Facebook ad idea into scroll-stopping hook variants ranked by the objection they defuse`,
    description: `Generates a set of Facebook ad primary-text hooks for a single offer, each built to defuse a different specific objection or skepticism the target buyer would have mid-scroll, then ranks them by which objection is most likely to be the actual blocker.`,
    promptText: `You are a Meta Ads copywriter drafting primary-text hook variants for a single Facebook ad, for an audience that will see this in a feed between friends' posts and other ads — meaning the hook has about one second of attention before a thumb keeps scrolling.

OFFER
{{offer_description}}

TARGET BUYER
{{target_buyer}}

BIGGEST SKEPTICISM OR OBJECTION
{{core_objection}}

PROOF POINTS AVAILABLE
{{proof_points}}

BANNED CLAIMS OR PHRASES
{{banned_claims}}

RULES
Write five hook variants, each one built around a different specific angle: a pattern-interrupt observation, a direct callout of the target buyer, a proof-led claim using one of the proof points, a cost-of-inaction angle, and a curiosity gap that resolves in the first line of body copy rather than staying vague forever. Do not write generic hype openers like "Attention [audience]!" or "Tired of X?" unless the target buyer's actual words would plausibly include that phrasing — if I gave you exact language they use, prefer it over marketing-speak. Every hook must implicitly or explicitly address the stated skepticism; a hook that ignores the real objection and just sounds punchy is a miss, not a win. Do not invent a statistic, guarantee, or claim not present in the proof points I gave you — if a hook would be stronger with a number you don't have, write "[NEEDS: specific number]" instead of making one up. Respect the banned claims list exactly; if none of my five hooks would need a banned phrase, don't force one in just to prove compliance.

OUTPUT FORMAT
For each of the 5 hooks: the hook text (1-2 sentences, under 125 characters where possible), which angle it uses, and which specific part of the stated objection it's aimed at. Close with a ranked recommendation of which hook to test first and why, based on which objection is most likely to be the real blocker rather than a surface-level one.`,
    variables: [
      {
        name: 'offer_description',
        description: `What's actually being sold and the core mechanism of how it works.`,
        example: `A $39/month app that auto-categorizes freelance income and expenses for quarterly tax estimates.`,
        required: true,
      },
      {
        name: 'target_buyer',
        description: `Who specifically will see this ad, in their own likely language if possible.`,
        example: `Freelance designers and consultants who currently guess their quarterly tax payment and are scared of underpaying.`,
        required: true,
      },
      {
        name: 'core_objection',
        description: `The real skepticism standing between this buyer and clicking, not a generic one.`,
        example: `"I already tried an app like this and it still needed me to manually fix half the categories."`,
        required: true,
      },
      {
        name: 'proof_points',
        description: `Real, specific facts you can back up — numbers, testimonials, guarantees.`,
        example: `94% auto-categorization accuracy across 12,000 users last quarter; 30-day money-back guarantee.`,
        required: true,
      },
      {
        name: 'banned_claims',
        description: `Words or claims that can't appear for compliance, brand, or honesty reasons.`,
        example: `Never say "guaranteed to save you money" or "IRS-approved" — we are not a tax authority.`,
        required: false,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`facebook-ads`, `ad-copy`, `hook-writing`, `meta-ads`, `conversion-copy`],
    whyItWorks: `GPT-5.1 defaults to generic marketing hype phrasing when a prompt just says "write ad hooks" because that pattern is overrepresented in ad-copy training examples relative to genuinely objection-specific copy, so forcing five distinct angles (pattern-interrupt, direct callout, proof-led, cost-of-inaction, curiosity gap) prevents the model from collapsing into five versions of the same generic template with swapped adjectives. Explicitly naming the core objection and requiring every hook to address it mechanically shifts the model's attention from "what sounds punchy" to "what actually removes the specific reason this buyer hesitates," which is the real determinant of Facebook ad click-through since feed scrollers are pattern-matching against their own skepticism in under a second, not evaluating writing quality. The instruction to write "[NEEDS: specific number]" instead of fabricating a statistic closes a well-documented failure mode where language models asked for punchy ad copy will invent a plausible-sounding percentage or claim to fill a gap, which is a real compliance and trust liability in paid ads specifically since Meta's ad review and FTC substantiation rules apply to exact wording, not intent. Ranking the five hooks by which objection is the real blocker rather than presenting them as equally-weighted options gives an actual next action instead of a menu, which matters because most people running this prompt will only have budget to test two or three variants, not five.`,
    exampleOutput: `Hook 3 (proof-led): "94% of freelance expenses categorized automatically — no manual fixing, verified across 12,000 users last quarter." Targets: the objection that prior tools still required manual cleanup, addressed head-on with the specific accuracy number rather than a vague "it just works" claim. Recommended to test first since the stated objection is specifically about broken promises from a prior tool, and this is the only hook that answers with a number instead of a reassurance.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-08' }],
    changelog: [
      {
        date: '2026-08-08',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'ads-instagram-story-ad-three-frame-sequence',
    category: 'ads',
    title: `Script a 3-frame Instagram Story ad sequence that survives a thumb-tap instead of just a scroll`,
    description: `Builds a three-frame Story ad script — each frame with on-screen text, voiceover or caption line, and a tap-through reason — designed around the fact that Story viewers tap through in under two seconds if frame one doesn't earn the next one.`,
    promptText: `You are scripting a 3-frame Instagram Story ad for {{brand_name}}, where the viewer can tap to the next frame or tap out entirely in under two seconds, so each frame has to individually earn the next tap rather than relying on a single strong opening.

OFFER OR CTA
{{offer_and_cta}}

VISUAL ASSETS ON HAND
{{visual_assets}}

WHAT MAKES THIS DIFFERENT FROM A COMPETITOR'S STORY AD
{{differentiator}}

Structure the sequence as three frames:
Frame 1 must stop the tap within the first half-second — no logo reveal, no slow build, the payoff or the tension has to be visible immediately since Stories autoplay past anything that reads as an intro.
Frame 2 must answer the single question Frame 1 raises, using the differentiator to make clear why this isn't the same as three other ads the viewer swiped past this week.
Frame 3 must carry the CTA and make the tap-through action feel like the obvious next micro-step, not a big commitment — match the CTA's ask size to what a Story viewer will actually do mid-scroll (swiping up to see a product page is a bigger ask than tapping a sticker poll).

For each frame, specify: the on-screen text (short, since Stories are watched muted more often than not), what's happening visually given the assets I listed, and the single reason a viewer taps forward instead of tapping away. Do not describe frames in vague creative-brief language like "engaging visual of the product" — if I didn't give you a specific visual asset, say what kind of shot would need to be produced instead of assuming one exists. Do not make Frame 3's CTA bigger than the offer justifies — a cold Story viewer tapping to a full checkout page is a mismatch unless the offer is frictionless enough to support it.

OUTPUT: three labeled frames (on-screen text / visual direction / reason to tap forward), followed by one line naming which frame is the highest-risk drop-off point and why.`,
    variables: [
      {
        name: 'brand_name',
        description: `The brand or product this Story ad is for.`,
        example: `Fernweh Skincare`,
        required: true,
      },
      {
        name: 'offer_and_cta',
        description: `What's being offered and the specific action the ad wants.`,
        example: `20% off first order, CTA is swipe-up to a single-product landing page.`,
        required: true,
      },
      {
        name: 'visual_assets',
        description: `What footage, photos, or graphics actually exist to build frames from.`,
        example: `Before/after product-use photos, one 6-second unboxing clip, brand color palette.`,
        required: true,
      },
      {
        name: 'differentiator',
        description: `The specific thing that separates this from competitor ads the same viewer has seen.`,
        example: `Fragrance-free formula for reactive skin, unlike the scented competitors dominating this feed's beauty ads.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `instagram-ads`,
      `story-ads`,
      `social-ad-copy`,
      `meta-ads`,
      `creative-scripting`,
    ],
    whyItWorks: `Framing this as three individually-must-earn-the-tap frames rather than one continuous 15-second script matches how Instagram Stories actually behave mechanically — each frame is a separate autoplay unit with its own tap-away risk, so a model asked to just "write a Story ad" tends to produce a single narrative arc that assumes the viewer watches passively through all three frames, which is not how Stories are consumed. Requiring Frame 1 to show payoff or tension immediately rather than a logo or slow build directly counters GPT-5.1's default ad-script tendency to open with brand introduction, which is a leftover pattern from TV and pre-roll video conventions that actively fails in a tap-to-skip environment. Matching the CTA's size in Frame 3 to the actual offer commitment level prevents a common mismatch where the model defaults to "Shop Now" or "Learn More" regardless of context — a cold Story viewer being asked to swipe into a full checkout flow is a much bigger ask than a poll sticker or a swipe-up to a single simple offer page, and the drop-off cost of over-asking is highest at exactly this frame. Asking for the highest-risk drop-off frame as a separate output forces an honest read on where the sequence is weakest, which is more useful than a script that implicitly claims all three frames are equally strong.`,
    exampleOutput: `Frame 2: on-screen text "Not another scented serum." Visual: before/after photo held on screen for the full frame duration, no motion. Reason to tap forward: resolves Frame 1's implied tension (reactive skin + skincare ad) by naming the fragrance-free difference before the viewer has time to assume this is the same pitch as the last five beauty ads they saw today.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-09' }],
    changelog: [
      {
        date: '2026-08-09',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'ads-google-search-rsa-headline-pinning-strategy',
    category: 'ads',
    title: `Write Google Search RSA headlines with a pinning strategy instead of 15 interchangeable variations`,
    description: `Produces the full set of Responsive Search Ad headlines and descriptions for a Google Ads campaign, grouped by which ones should be pinned to which position versus left for Google's algorithm to rotate, based on what each headline is actually for.`,
    promptText: `You are building a Google Search Responsive Search Ad (RSA) for the campaign below, and the goal is not just 15 headlines that all say roughly the same thing — it's a deliberate mix where some headlines are safe to let Google's algorithm rotate freely and a few are risky or precise enough that they need to be pinned to a specific position.

CAMPAIGN / AD GROUP THEME
{{ad_group_theme}}

SEARCH INTENT BEING TARGETED
{{search_intent}}

KEYWORDS THIS AD GROUP TARGETS
{{target_keywords}}

LEGAL OR FACTUAL CONSTRAINTS
{{legal_constraints}}

LANDING PAGE PROMISE
{{landing_page_promise}}

Write 12 headlines (max 30 characters each) and 4 descriptions (max 90 characters each). Group the headlines into three tiers: (1) keyword-echo headlines that closely mirror the target keywords for Quality Score relevance — these can rotate freely; (2) differentiator or offer headlines that make a specific factual claim — flag these as candidates for pinning to Position 1 since they carry the actual selling argument and shouldn't get buried under a generic keyword-echo headline by the algorithm; (3) trust or objection-handling headlines (pricing transparency, guarantee, social proof) — flag these as candidates for Position 2 or 3. Every headline must be something the landing page actually delivers on — do not write a headline promising something not present in the stated landing page promise, since a mismatch between ad and landing page is a direct Quality Score and compliance risk on Google Ads, not just a bad user experience. Do not fabricate a specific number, statistic, or claim not given to you in the campaign details; if a headline would be stronger with a number you don't have, mark it "[NEEDS INPUT]" instead of inventing one. Respect the legal/factual constraints exactly.

OUTPUT FORMAT: a table with columns Headline, Character Count, Tier, Pin Recommendation — followed by the 4 descriptions, then a 2-3 sentence rationale for the overall pinning strategy given this specific search intent.`,
    variables: [
      {
        name: 'ad_group_theme',
        description: `What this specific ad group is about, narrower than the whole campaign.`,
        example: `Same-day emergency locksmith service, downtown metro area only.`,
        required: true,
      },
      {
        name: 'search_intent',
        description: `What the person searching this keyword actually wants right now.`,
        example: `Locked out right now, needs someone within the hour, price-sensitive but urgency beats price.`,
        required: true,
      },
      {
        name: 'target_keywords',
        description: `The actual keywords this ad group bids on.`,
        example: `emergency locksmith near me, 24 hour locksmith downtown, locked out of house help`,
        required: true,
      },
      {
        name: 'legal_constraints',
        description: `Anything that can't be claimed for legal, licensing, or platform-policy reasons.`,
        example: `Cannot say "licensed" in states where we only hold a business permit, not a locksmith license.`,
        required: false,
      },
      {
        name: 'landing_page_promise',
        description: `What the landing page the ad points to actually offers, so headlines don't overpromise.`,
        example: `30-minute average response time, flat $75 call-out fee shown before booking.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`google-ads`, `rsa`, `search-ads`, `ppc-copywriting`, `quality-score`],
    whyItWorks: `Google's RSA engine auto-rotates and combines headlines by predicted performance unless a headline is explicitly pinned to a position, which means a set of 15 headlines that are all roughly interchangeable in meaning gives the algorithm nothing to actually differentiate between combinations — the pinning-tier structure in this prompt gives the model a reason to write headlines with genuinely different jobs (keyword relevance for Quality Score, a differentiator claim, an objection-handler) rather than 15 rephrasings of the same value proposition, which is the default output when a prompt just asks for "RSA headlines." Tying every headline explicitly back to the stated landing page promise addresses a specific, real Google Ads risk: ad-to-landing-page message mismatch is something Google's Quality Score system and ad review both penalize, not a cosmetic concern, so a model that isn't constrained this way will happily write a more exciting headline than the landing page can back up. The instruction against fabricating numbers matters more in Search than in social ad copy because Search ads sit next to an explicit factual claim the user is actively fact-checking through intent (they typed "same day" or "24 hour" themselves), so an invented statistic is both a compliance risk and a credibility risk the moment the landing page doesn't match it. Requiring a rationale for the overall pinning strategy tied to the specific search intent forces the recommendation to be diagnostic rather than a generic best-practice restatement, since the right pinning approach for a high-urgency local-service search is different from an informational, comparison-shopping search.`,
    exampleOutput: `Headline: "Locked Out? 30-Min Help" | 22 chars | Tier 2 (differentiator) | Pin to Position 1 — carries the urgency+speed promise that matches the stated landing page response time and should not be displaced by a generic keyword-echo headline.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-09' }],
    changelog: [
      {
        date: '2026-08-09',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'ads-linkedin-sponsored-content-decision-maker-angle',
    category: 'ads',
    title: `Write LinkedIn Sponsored Content copy that speaks to the actual approver, not the whole job title`,
    description: `Drafts LinkedIn Sponsored Content ad copy calibrated to what a specific decision-maker in the buying process actually cares about — budget owner, technical evaluator, or end user — instead of one generic B2B pitch aimed at a job title.`,
    promptText: `LinkedIn Sponsored Content ad copy for {{product_or_service}}, written specifically for the person in this buying process who has this role, not a generic pitch to a job title:

WHO THIS SPECIFIC AD TARGETS IN THE BUYING PROCESS
{{buyer_role_in_process}}
(e.g., the budget owner who signs off but won't use it daily, the technical evaluator who has to defend the choice internally, or the end user whose day-to-day pain triggered the search)

WHAT THIS PERSON SPECIFICALLY CARES ABOUT THAT A DIFFERENT STAKEHOLDER WOULDN'T
{{stakeholder_specific_concern}}

COMPANY CONTEXT LINKEDIN TARGETING WILL REACH
{{target_company_context}}

PROOF POINT RELEVANT TO THIS STAKEHOLDER
{{stakeholder_proof_point}}

Write: one intro-text variant (under 150 characters visible before "see more"), the full intro text (up to 600 characters), and one headline (under 70 characters) for the image/link card. The first 150 characters must speak to this specific stakeholder's concern, not the general product pitch — a budget owner and a technical evaluator reading the same ad copy should each recognize themselves as the intended reader within one sentence, even though only one of them is actually being targeted by this specific ad. Do not write copy that could be pasted unchanged into an ad for a different stakeholder in the same buying process — that's a sign the copy is generic rather than targeted. Do not claim ROI figures, adoption timelines, or outcomes not present in the stated proof point; if the pitch would be stronger with a number you weren't given, write "[NEEDS INPUT]" rather than inventing a percentage or case-study figure, since B2B buyers on LinkedIn are unusually likely to click through and fact-check a specific claim against the company's actual case studies page.

OUTPUT: intro-text short variant, full intro text, headline, and one sentence explaining what would have to change in this copy to retarget it at a different stakeholder in the same deal — to make explicit that this version is not one-size-fits-all.`,
    variables: [
      {
        name: 'product_or_service',
        description: `What's being sold, described concretely.`,
        example: `A vendor-risk-assessment platform that automates SOC 2 evidence collection.`,
        required: true,
      },
      {
        name: 'buyer_role_in_process',
        description: `Which specific person in the buying committee this exact ad targets.`,
        example: `The security engineer who has to run the actual vendor assessments, not the CISO who signs the contract.`,
        required: true,
      },
      {
        name: 'stakeholder_specific_concern',
        description: `What this person cares about that a different stakeholder in the same deal wouldn't.`,
        example: `How many hours of manual evidence-chasing this removes from their week, not overall company risk posture.`,
        required: true,
      },
      {
        name: 'target_company_context',
        description: `What kind of company LinkedIn's targeting will actually reach with this ad.`,
        example: `Series B-D SaaS companies currently going through their first SOC 2 Type II audit.`,
        required: true,
      },
      {
        name: 'stakeholder_proof_point',
        description: `A real, specific fact that would land with this exact stakeholder.`,
        example: `Cut evidence-collection time from 40 hours to 6 hours per audit cycle for a comparable-sized customer.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `linkedin-ads`,
      `b2b-advertising`,
      `sponsored-content`,
      `stakeholder-messaging`,
      `ad-copy`,
    ],
    whyItWorks: `LinkedIn's Sponsored Content is served against a job-title and company-attribute targeting layer, which means the platform mechanically enables aiming one specific ad at one specific role inside a buying committee — but a prompt that just says "write a B2B LinkedIn ad for [product]" gives the model no reason to pick a stakeholder angle at all, so it defaults to a lowest-common-denominator pitch that name-checks ROI, efficiency, and ease of use in a way that technically applies to everyone and therefore lands specifically with no one. Forcing the first 150 characters (the only text visible before LinkedIn's "see more" truncation) to speak to one stated concern rather than the general value prop matters because that truncation point is the actual make-or-break moment for LinkedIn feed engagement, and generic copy that works for any stakeholder is precisely the copy that gets scrolled past by all of them. The instruction that this exact copy shouldn't be pasteable unchanged into an ad for a different stakeholder is a built-in check against the model's tendency to write broadly-applicable-sounding copy under the guise of specificity — it's a concrete test the output has to pass rather than a subjective quality bar. The caution against fabricated ROI or timeline figures is calibrated to LinkedIn's B2B audience specifically, since technical buyers on this platform are more likely than a general consumer audience to click through to a case-studies page and check a cited number, making an invented statistic a credibility risk that surfaces faster here than in most other ad channels.`,
    exampleOutput: `Headline: "6 Hours, Not 40, Per Audit" — Intro (short): "Still chasing screenshots for SOC 2 evidence? One customer cut it to 6 hours." This copy speaks to the engineer doing the manual work, not the CISO signing the check — retargeting to the CISO would need a risk-posture and audit-outcome angle instead of a time-saved angle.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-10' }],
    changelog: [
      {
        date: '2026-08-10',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'ads-landing-page-single-cta-conversion-audit',
    category: 'ads',
    title: `Draft a landing page brief and copy that survives being read for 6 seconds, not being admired`,
    description: `Produces a full landing page copy draft (headline through CTA) built around one measurable conversion action, plus a section-by-section rationale for why each element earns its place instead of just filling a template slot.`,
    promptText: `You are writing landing page copy for a page whose entire job is to get the visitor to complete ONE specific action — not to be comprehensive, not to explain everything about the product, just to move the visitor to that one action before they leave.

TRAFFIC SOURCE
{{traffic_source}}

SINGLE CONVERSION ACTION
{{conversion_action}}

WHAT THE VISITOR ALREADY BELIEVES WHEN THEY ARRIVE
{{visitor_prior_belief}}

OBJECTION THAT KILLS THE MOST CONVERSIONS
{{top_objection}}

PROOF ASSETS AVAILABLE
{{proof_assets}}

Write, in order: a headline (under 12 words) that matches the promise made by the traffic source rather than introducing a new angle, a one-sentence subheadline that either resolves the top objection or sets up why it doesn't apply, a 3-bullet "what you get" section using only the proof assets given, one objection-handling section addressing the stated top objection by name rather than dancing around it, and a single CTA button label plus the one sentence of microcopy beneath it. Do not add a second competing call to action anywhere on the page — no "or sign up for our newsletter" — a page selling two actions converts worse on both than a page selling one. Do not write filler sections like a generic "About Us" or feature-dump list unless a specific proof asset requires it to land; every section must exist because it does conversion work, not because landing pages conventionally have that section. Do not invent a testimonial, statistic, or guarantee not present in the proof assets list; mark any place a stronger proof point would help with "[NEEDS: proof asset]."

OUTPUT FORMAT: each section labeled, followed by a short rationale (1 sentence each) for why that specific section earns its place given the stated traffic source and top objection — not a generic best-practice justification.`,
    variables: [
      {
        name: 'traffic_source',
        description: `Where the visitor is coming from and what promise got them to click.`,
        example: `Instagram Story ad promising "see your quote in 60 seconds" for pet insurance.`,
        required: true,
      },
      {
        name: 'conversion_action',
        description: `The one specific thing this page needs the visitor to do.`,
        example: `Enter their pet's breed and zip code to start a quote flow.`,
        required: true,
      },
      {
        name: 'visitor_prior_belief',
        description: `What the visitor already believes or expects walking in, set by the ad they clicked.`,
        example: `Expects this to be fast and free, and is price-comparing against 2-3 other quote sites already open in other tabs.`,
        required: true,
      },
      {
        name: 'top_objection',
        description: `The single biggest reason visitors bounce without converting, if known.`,
        example: `Fear that entering zip code triggers a flood of sales calls.`,
        required: true,
      },
      {
        name: 'proof_assets',
        description: `Real proof you can use — no fabrication allowed beyond this list.`,
        example: `No phone number required to see a quote; 4.6-star rating from 8,200 reviews; underwritten by a named insurer.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`landing-pages`, `conversion-copywriting`, `cro`, `ad-copy`, `single-cta`],
    whyItWorks: `The single-conversion-action constraint directly counters GPT-5.1's default landing-page instinct, which — absent an explicit restriction — tends to build a comprehensive page with multiple CTAs (a primary button plus a newsletter signup plus a "learn more" link) because that pattern is common in generic landing-page templates the model has seen, even though it's a well-documented conversion-rate-optimization failure mode: every additional competing action on a page measurably splits attention and lowers completion on the primary goal. Requiring the headline to match the traffic source's specific promise rather than introduce a new angle addresses message-match, one of the most consistent findings in landing-page conversion research — a visitor who clicked a specific promise and lands on a page that opens with a different framing experiences a split-second trust gap that raises bounce rate even if the new framing is arguably better copy. Naming the top objection explicitly and requiring it be addressed by name rather than danced around forces the page to do the actual conversion work instead of hoping the objection resolves itself through good vibes and social proof alone — objection-handling copy that never states the objection reads as evasive to a skeptical visitor, particularly relevant here since the stated objection (fear of being flooded with sales calls) is exactly the kind of thing a visitor is silently checking for. The requirement to flag missing proof rather than invent it protects against a specific real risk: a landing page overstating a guarantee or rating that doesn't match reality is a conversion asset that actively damages trust the moment a visitor checks it against reviews elsewhere, which is more likely for anything phrased as a specific number.`,
    exampleOutput: `Headline: "See Your Quote in 60 Seconds — No Phone Call Required." Rationale: matches the exact promise from the Instagram ad word-for-word and preempts the top objection (fear of sales calls) in the same sentence, so the visitor's guard drops before they even reach the form.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-10' }],
    changelog: [
      {
        date: '2026-08-10',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'ads-hero-section-headline-variants-by-visitor-state',
    category: 'ads',
    title: `Generate hero section headline variants matched to where the visitor is coming from, not just A/B noise`,
    description: `Produces a set of hero section headline and subheadline pairs, each matched to a distinct visitor entry state (cold ad traffic, warm retargeting, direct/branded search) so variants test genuinely different hypotheses instead of just wording tweaks.`,
    promptText: `Write hero section headline and subheadline pairs for {{page_or_product}}, where each variant is matched to a genuinely different visitor entry state rather than being a wording tweak on the same idea — the goal is variants that test different hypotheses about what makes someone convert, not five ways to say the same sentence.

PRODUCT / PAGE
{{page_or_product}}

ENTRY STATES TO COVER
{{entry_states}}
(e.g., cold traffic from a paid social ad who has never heard of this before, warm traffic retargeted after abandoning a cart or signup, direct traffic typing the brand name because they already decided)

CORE VALUE PROPOSITION
{{value_proposition}}

WHAT MUST NEVER APPEAR IN ANY VARIANT
{{must_not_include}}

For each entry state listed, write one headline (under 10 words) and one subheadline (under 20 words) built on a different hypothesis about what that visitor needs to see first: cold traffic likely needs the core value prop explained from zero, since they have no context; warm/retargeted traffic already knows the value prop and needs a reason to come back now, like addressing what likely stopped them the first time or referencing urgency; direct/branded traffic already decided and needs confirmation plus a fast path to action, not a sales pitch from scratch. Do not write five variants that are the same headline with synonyms swapped — if two entry states would genuinely see the same headline because the difference doesn't change what matters to them, say so explicitly instead of manufacturing an artificial difference. Do not include anything from the "must never appear" list. Do not fabricate a statistic, urgency claim ("only 3 left"), or guarantee not implied by the value proposition given.

OUTPUT: one row per entry state (Entry State / Headline / Subheadline / One-sentence hypothesis this variant tests), then flag any two entry states you judged should share a variant and why.`,
    variables: [
      {
        name: 'page_or_product',
        description: `What page this hero section is for.`,
        example: `Homepage for a project-management tool aimed at small agencies.`,
        required: true,
      },
      {
        name: 'entry_states',
        description: `The distinct visitor entry states you actually have traffic from.`,
        example: `Cold traffic from LinkedIn ads, warm traffic retargeted after a free-trial signup abandonment, direct traffic from branded search.`,
        required: true,
      },
      {
        name: 'value_proposition',
        description: `The core value prop in your own words, not marketing copy yet.`,
        example: `One shared view of client work and billing so agencies stop reconciling three tools at invoice time.`,
        required: true,
      },
      {
        name: 'must_not_include',
        description: `Anything off-limits — legal, brand voice, or factual reasons.`,
        example: `Never compare directly to named competitors by name.`,
        required: false,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `hero-section`,
      `landing-pages`,
      `ab-testing`,
      `conversion-copywriting`,
      `headline-writing`,
    ],
    whyItWorks: `Most hero-headline generation prompts produce variants that differ only in phrasing because the model is optimizing for "different enough to be five distinct outputs" rather than "different enough to test a real hypothesis," which produces A/B tests that can't actually explain why one version won even when they do — this prompt forces each variant to be anchored to a distinct, real visitor entry state with a stated reason that state needs different information, which is the actual variable that should be driving headline differences in a real test plan. The instruction to explicitly flag when two entry states should share a variant rather than forcing artificial differentiation matters because a model asked for N variants will produce N distinct-sounding outputs even when the honest answer is that two segments don't actually need different treatment — surfacing that as an option prevents shipping a fake test design that dilutes traffic across variants that don't test anything meaningfully different. Grounding each hypothesis in what's mechanically true about that entry state (cold traffic has zero context and needs the value prop explained from scratch; warm retargeted traffic already has context and needs a reason to return now) gives GPT-5.1 a concrete decision rule instead of leaving it to guess generically at "personalization," which is how most default hero-copy output ends up interchangeable across segments. The ban on fabricated urgency claims like fake scarcity counters a specific known failure mode where models asked for conversion copy will reach for manufactured urgency language by default, which is both a trust risk and, for many ad platforms and jurisdictions, a compliance risk if the scarcity claim isn't real.`,
    exampleOutput: `Entry State: Retargeted trial-abandoners. Headline: "Still juggling three tools at invoice time?" Subheadline: "Pick up where you left off — one shared view of client work and billing, ready in the account you already started." Hypothesis: this segment already understood the value prop once; the test is whether naming the specific friction that likely stalled them gets them back into the funnel faster than a generic "welcome back."`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-11' }],
    changelog: [
      {
        date: '2026-08-11',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'ads-aida-campaign-multi-channel-consistency-map',
    category: 'ads',
    title: `Build an AIDA ad campaign that stays coherent across three channels instead of three disconnected pitches`,
    description: `Writes a full AIDA-structured ad campaign (Attention, Interest, Desire, Action) with one variant per channel, keeping the same core argument intact across channels while adapting format and length to each platform's actual constraints.`,
    promptText: `Build an AIDA-structured ad campaign for {{campaign_offer}}, across the channels listed below — the constraint is that all channel variants must argue the same underlying case in the same order, adapted only for format and length, not turn into three unrelated pitches that happen to share a product name.

OFFER
{{campaign_offer}}

CHANNELS IN THIS CAMPAIGN
{{channels}}

TARGET AUDIENCE
{{target_audience}}

SINGLE CORE ARGUMENT THE WHOLE CAMPAIGN MAKES
{{core_argument}}

CAMPAIGN TIMEFRAME OR URGENCY DRIVER
{{urgency_driver}}

For each channel, write the four AIDA beats (Attention, Interest, Desire, Action) as actual copy, not as labeled abstractions — each beat should be recognizable copy a person would actually see, sized to the channel (a Facebook feed ad has room for a paragraph across Attention through Desire; a Google Search ad has to compress all four beats into two headlines and one description; an SMS or push notification variant may only have room for Attention and Action, in which case say so rather than forcing Interest and Desire into a text that has no room for them). Every channel's Attention beat must map to the same core argument, even though the wording differs — if you find yourself writing a genuinely different argument for one channel because the format demands it, flag that explicitly rather than silently drifting off-message. Do not fabricate the urgency driver if none was given — if {{urgency_driver}} is empty, build Action beats that don't rely on manufactured scarcity or countdown language.

OUTPUT: one section per channel (Channel name, then Attention/Interest/Desire/Action as actual copy, noting which beats a length-constrained channel had to compress or drop), followed by a one-paragraph cross-channel consistency check confirming the core argument holds across all variants or flagging where it drifted and why.`,
    variables: [
      {
        name: 'campaign_offer',
        description: `What the campaign is actually selling.`,
        example: `A 14-day free trial of a habit-tracking app with no credit card required.`,
        required: true,
      },
      {
        name: 'channels',
        description: `The specific channels this campaign will run on.`,
        example: `Facebook feed ad, Google Search ad, SMS reminder to warm leads.`,
        required: true,
      },
      {
        name: 'target_audience',
        description: `Who the whole campaign targets across channels.`,
        example: `People who downloaded a productivity ebook lead magnet in the last 30 days but haven't converted.`,
        required: true,
      },
      {
        name: 'core_argument',
        description: `The one underlying case the entire campaign makes, regardless of channel.`,
        example: `You already know what you want to change — this just removes the friction of tracking it.`,
        required: true,
      },
      {
        name: 'urgency_driver',
        description: `A real time-bound reason to act now, if one genuinely exists.`,
        example: `Free trial offer ends when the lead magnet email sequence ends, in 5 days.`,
        required: false,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `aida-framework`,
      `multi-channel-ads`,
      `campaign-copywriting`,
      `ad-copy`,
      `cross-channel-consistency`,
    ],
    whyItWorks: `AIDA is a sequencing framework, not a length or format spec, so a prompt that just asks for "an AIDA ad for each channel" tends to produce three copy pieces that each individually follow the four beats internally but drift apart from each other in underlying argument, because the model treats each channel as a fresh writing task rather than a constrained restatement of one fixed thesis — explicitly stating the single core argument up front and requiring a consistency check at the end forces the model to treat channel variants as the same argument under different compression, which is what actually keeps a multi-channel campaign feeling coherent to someone who sees the Search ad, then gets retargeted with the Facebook ad, then receives the SMS. Requiring the model to acknowledge when a length-constrained channel (SMS, push notification) has to drop Interest or Desire entirely rather than forcing all four beats into a format with no room for them addresses a real structural mismatch: AIDA was designed for long-form print copy, and applying it uncritically to a 160-character SMS produces cramped, illegible copy where a model will otherwise try to hit all four beats regardless of whether the format supports it. The instruction against manufacturing urgency when none was given directly guards against a known default behavior — models asked for an Action/CTA beat under time pressure reach for countdown-timer and "ends soon" language by default, which becomes a false-urgency compliance issue in ad platforms that increasingly flag manufactured scarcity, and is also a trust cost the first time a repeat visitor notices the "ending soon" offer never actually ends.`,
    exampleOutput: `SMS variant (Attention/Action only, Interest/Desire dropped — no room in 160 characters): Attention+Action combined: "You've got 5 days left on your free trial of [App] — no card needed. Open the app and log today's habit: [link]" Consistency check: retains the core argument (removing tracking friction) implicitly through the CTA itself rather than restating it, which is the only viable compression given the channel's length limit.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-11' }],
    changelog: [
      {
        date: '2026-08-11',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'ads-pas-campaign-real-pain-not-manufactured-panic',
    category: 'ads',
    title: `Write a Problem-Agitate-Solution ad that agitates a real consequence instead of manufacturing panic`,
    description: `Drafts a Problem-Agitate-Solution ad using a real, specific consequence of the stated problem to build the agitation section, explicitly avoiding fear-mongering or invented stakes that don't match the actual offer.`,
    promptText: `Write a Problem-Agitate-Solution (PAS) ad for {{offer}}, where the agitation section is built from a real, specific consequence the target audience actually experiences — not manufactured panic or a worst-case scenario disconnected from what this offer actually fixes.

OFFER
{{offer}}

REAL PROBLEM (in the audience's own words if possible)
{{real_problem}}

ACTUAL, VERIFIABLE CONSEQUENCE OF NOT SOLVING IT
{{real_consequence}}

AUDIENCE
{{target_audience}}

TONE GUARDRAIL
{{tone_guardrail}}

Structure: Problem (state it plainly in language the audience would use about themselves, not marketing language describing them), Agitate (expand on the ACTUAL consequence given — the cost of time, money, or reputation this problem creates if unaddressed — without escalating into a worst-case scenario or emotional manipulation not grounded in the stated consequence), Solution (introduce the offer as resolving specifically the consequence just described, not a broader pitch that reintroduces new claims). The agitation section is the part most likely to overreach — do not add a consequence more severe than what I gave you (e.g., if the real consequence is "you lose 3 hours a week to manual data entry," do not escalate to implying the business will fail); do not use fear-based language that implies physical, financial, or legal danger unless that danger is explicitly what {{real_consequence}} describes. If a tone guardrail was given, treat it as a hard constraint on the agitation section specifically, since that's the section most likely to violate it. Do not fabricate a statistic to make the consequence sound worse than stated.

OUTPUT: three labeled sections (Problem / Agitate / Solution) as ad copy ready to adapt to a specific channel, followed by one line confirming the agitation section's severity matches the stated consequence and did not escalate beyond it.`,
    variables: [
      {
        name: 'offer',
        description: `What's being sold.`,
        example: `An automated invoice-reconciliation tool for small bookkeeping firms.`,
        required: true,
      },
      {
        name: 'real_problem',
        description: `The actual problem in the audience's own likely phrasing.`,
        example: `"I spend Friday afternoons manually matching bank statements to invoices instead of billing clients."`,
        required: true,
      },
      {
        name: 'real_consequence',
        description: `A specific, real cost of not solving the problem — no exaggeration needed or wanted.`,
        example: `Roughly 3-4 unbillable hours per week per bookkeeper, based on internal time-tracking data.`,
        required: true,
      },
      {
        name: 'target_audience',
        description: `Who this is for.`,
        example: `Solo and small-team bookkeeping firm owners handling 15-30 client accounts.`,
        required: true,
      },
      {
        name: 'tone_guardrail',
        description: `Any explicit tone limit to respect, especially in the agitate section.`,
        example: `No language implying they're bad at their job or falling behind competitors — this audience responds badly to being made to feel incompetent.`,
        required: false,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `pas-framework`,
      `ad-copywriting`,
      `problem-agitate-solution`,
      `copywriting-ethics`,
      `ad-copy`,
    ],
    whyItWorks: `The Problem-Agitate-Solution framework's Agitate step is the section most prone to overreach in AI-generated copy, because the pattern is well-represented in aggressive direct-response marketing training data where agitation routinely escalates into manufactured worst-case scenarios disconnected from the actual stated problem, and a model asked to "agitate" without a ceiling will often reach for that more dramatic register by default since it reads as more persuasive on its own terms. Explicitly capping the agitation section at the real, given consequence — and giving a concrete example of what escalation beyond it looks like (three hours lost per week becoming implied business failure) — gives GPT-5.1 a specific boundary to check its own output against rather than a vague instruction like "don't exaggerate," which is unenforceable because exaggeration is a matter of degree the model can't self-assess without a stated ceiling. The tone guardrail being applied specifically to the agitate section (rather than the whole ad generically) matters because that's structurally where an audience-alienating tone is most likely to leak in — a Problem section stated plainly and a Solution section pitching the offer are lower-risk than an Agitate section that, done carelessly, can read as insulting or manipulative to the exact audience it's trying to move, which is a real risk with framing that implies the reader is incompetent or falling behind. Ending with an explicit self-check that the agitation didn't escalate beyond the stated consequence turns an easy-to-skip quality bar into something the output has to affirmatively demonstrate before being considered done.`,
    exampleOutput: `Agitate: "Every Friday, that's another 3-4 hours you're not billing a client for — time spent matching line items by hand instead of doing the work your clients actually pay you for." Solution: "[Tool] reconciles bank statements against invoices automatically, so Friday afternoon goes back to billable work." Confirmation: agitation stays within the stated 3-4 hour/week cost and does not imply business failure or incompetence.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-12' }],
    changelog: [
      {
        date: '2026-08-12',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'ads-retargeting-sequence-by-drop-off-point',
    category: 'ads',
    title: `Build a retargeting ad sequence keyed to exactly where each segment dropped off, not one generic 'come back' ad`,
    description: `Produces a 3-touch retargeting ad sequence with distinct messaging for each named drop-off segment (viewed product, added to cart, started checkout), since each represents a different reason for not converting and needs a different argument.`,
    promptText: `Build a 3-touch retargeting ad sequence for {{product_or_service}}, with separate copy for each of the drop-off segments listed below, since a visitor who abandoned checkout is not the same as one who only viewed a product page, and one generic "come back!" ad wastes the segmentation data most ad platforms already give you.

PRODUCT / SERVICE
{{product_or_service}}

DROP-OFF SEGMENTS TO TARGET SEPARATELY
{{dropoff_segments}}
(e.g., viewed a product page but didn't add to cart, added to cart but didn't start checkout, started checkout but didn't complete payment)

MOST LIKELY REASON EACH SEGMENT STALLED
{{stall_reasons}}

DISCOUNT OR INCENTIVE POLICY
{{incentive_policy}}

For each segment, write a 3-touch sequence (Day 1, Day 3, Day 7 or similar spacing) where each touch's copy is built around the stated likely stall reason for that specific segment, not a generic reminder. A viewer who only browsed likely needs more information or reassurance, not a discount; a cart-abandoner likely needs urgency or a small nudge; a checkout-abandoner likely hit a specific friction point (payment method, shipping cost, trust at the final step) and needs that friction addressed directly, not a generic "you left something in your cart" reminder repeated three times with different subject lines. Respect the stated incentive policy exactly — do not introduce a discount if the policy says not to use one for a given segment, and do not escalate discount percentage across touches if the policy defines a fixed maximum. If a segment's real stall reason wasn't given, do not invent a specific psychological explanation as fact — write the sequence around addressing friction generically for that segment and flag that the stall reason should be confirmed with actual data (survey, session recordings) rather than assumed.

OUTPUT: one section per segment (segment name, then Day 1 / Day 3 / Day 7 ad copy, each under 2 sentences plus a CTA), followed by a note on which segment is highest-value to fix first based on proximity to conversion.`,
    variables: [
      {
        name: 'product_or_service',
        description: `What's being retargeted.`,
        example: `A direct-to-consumer mattress brand.`,
        required: true,
      },
      {
        name: 'dropoff_segments',
        description: `The specific funnel stages you have retargeting audiences built for.`,
        example: `Viewed product page only, added to cart, started checkout but abandoned at payment.`,
        required: true,
      },
      {
        name: 'stall_reasons',
        description: `The actual or best-guess reason each segment stalled, if known.`,
        example: `Checkout abandoners frequently cite unexpected shipping costs shown only at the final step, per exit survey data.`,
        required: false,
      },
      {
        name: 'incentive_policy',
        description: `Exact rules on what discounts or incentives are allowed per segment.`,
        example: `No discount for browse-only segment; 10% one-time code for cart-abandoners; free shipping (not percentage discount) for checkout-abandoners.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `retargeting-ads`,
      `abandoned-cart`,
      `funnel-segmentation`,
      `ad-copy`,
      `remarketing`,
    ],
    whyItWorks: `Retargeting platforms segment audiences by funnel stage specifically because each stage represents a different, mechanically distinct reason for non-conversion, but a prompt that just asks for "retargeting ad copy" tends to produce one templated "you left something behind" message applied uniformly across segments, wasting the exact behavioral signal the segmentation data provides — requiring separate copy keyed to each segment's likely stall reason forces the model to treat a browse-only visitor (who needs more information, since they haven't committed to intent yet) differently from a checkout-abandoner (who has already shown strong intent and likely hit a specific, addressable friction point like unexpected shipping cost), which is the actual determinant of what argument will move each group. The explicit instruction not to escalate discount percentage across touches or violate the stated incentive policy addresses a specific, real business risk: a model asked to write a persuasive 3-touch sequence will often default to escalating urgency and discount depth touch over touch because that reads as more compelling in isolation, but that pattern trains customers to wait out the sequence for the biggest discount, which is a documented and costly failure mode in real retargeting programs. Refusing to invent a specific psychological stall reason when none was given — and instead flagging that it should be confirmed with real data — matters because a plausible-sounding but fabricated explanation ("this segment is price-anxious" asserted with no evidence) can steer an actual ad budget toward the wrong lever, like adding a discount when the real issue was a confusing checkout form.`,
    exampleOutput: `Checkout abandoners, Day 1: "Your order's still saved — and shipping's on us if you finish today." No discount escalation Day 3 or 7 per stated policy; Day 3 copy instead re-surfaces the free-shipping offer with a product reassurance angle rather than a deeper discount, since the incentive policy caps this segment at free shipping only.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-12' }],
    changelog: [
      {
        date: '2026-08-12',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'ads-audience-segmentation-behavioral-not-demographic',
    category: 'ads',
    title: `Build ad audience segments around actual buying behavior instead of demographic guesswork`,
    description: `Produces a set of audience segments for ad targeting built from real behavioral or purchase-history signals rather than assumed demographic personas, with a distinct messaging angle proposed for each segment.`,
    promptText: `You are helping build audience segments for ad targeting for {{business_type}}, using the behavioral and transactional signals actually available — not invented demographic personas like "busy moms" or "tech-savvy millennials" unless those categories are actually derived from real data you were given.

BUSINESS / PRODUCT
{{business_type}}

DATA SIGNALS ACTUALLY AVAILABLE
{{available_signals}}
(e.g., purchase frequency, cart value, pages visited, time since last purchase, referral source)

BUSINESS GOAL FOR THIS SEGMENTATION
{{segmentation_goal}}

EXISTING SEGMENTS ALREADY IN USE (to avoid redundant overlap)
{{existing_segments}}

Propose 4-6 audience segments built ONLY from combinations of the actual signals listed — for example, "purchased once 90+ days ago, no repeat purchase" is a valid behavioral segment; "budget-conscious shopper" is not, unless a specific signal like average order value or discount-code usage actually supports that label. For each segment: name it by the behavior that defines it (not a persona nickname), state the exact signal combination that qualifies someone for it, propose one distinct messaging angle appropriate to that behavior, and flag whether it meaningfully overlaps with an existing segment I listed. If a segment would be genuinely useful but requires a signal not in the available-signals list, name it anyway and flag exactly what data would need to be tracked to build it, rather than silently building the segment around a proxy that isn't actually reliable. Do not describe any segment using demographic assumptions (age, gender, income bracket, life stage) unless that data was explicitly given as an available signal — behavioral segmentation and demographic guessing are different things, and the latter is both less reliable and, on some ad platforms, more restricted for certain categories.

OUTPUT: a table (Segment Name / Qualifying Signal Combination / Messaging Angle / Overlap Flag), followed by which segment to prioritize building first given the stated business goal.`,
    variables: [
      {
        name: 'business_type',
        description: `What kind of business this is.`,
        example: `Subscription-based coffee roaster, direct-to-consumer.`,
        required: true,
      },
      {
        name: 'available_signals',
        description: `The real data points you can actually segment on.`,
        example: `Purchase frequency, days since last order, subscription vs. one-time purchase, average order value, whether they've ever paused a subscription.`,
        required: true,
      },
      {
        name: 'segmentation_goal',
        description: `What business outcome this segmentation should serve.`,
        example: `Reduce subscription churn by catching at-risk subscribers before they cancel.`,
        required: true,
      },
      {
        name: 'existing_segments',
        description: `Segments already in use, to avoid rebuilding the same audience under a new name.`,
        example: `"Active subscribers, 0-30 days" and "Lapsed one-time buyers, 90+ days" already exist.`,
        required: false,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `audience-segmentation`,
      `behavioral-targeting`,
      `ad-targeting`,
      `retention-marketing`,
      `data-driven-marketing`,
    ],
    whyItWorks: `Asked generically to build audience segments, GPT-5.1 defaults to demographic-persona shorthand ("busy professionals," "budget-conscious shoppers") because that's the dominant pattern in marketing-strategy training content, even though real ad-platform targeting and most CRM segmentation in practice runs on behavioral and transactional signals, not assumed demographic traits — restricting the model to combinations of explicitly listed real signals forces it to produce segments that are actually buildable and actionable in an ad platform or CRM, rather than aspirational personas with no underlying data to target against. Requiring every segment to be named by the qualifying behavior rather than a persona nickname closes a specific gap where a demographic-sounding label can smuggle in an unstated assumption — "budget-conscious shopper" implies something about income or price sensitivity that isn't actually supported unless a signal like discount-code usage or average order value backs it up, and treating that as a hard rule keeps the output honest about what it can and can't infer from the data given. The instruction to name a genuinely useful segment even when the supporting signal isn't yet tracked, rather than quietly substituting an unreliable proxy, surfaces a real and common tension in segmentation work: a business often has to choose between building a slightly-worse segment now with existing data or investing in new tracking to build the ideal one, and that's a decision worth making visible rather than resolving silently inside the model's answer. Flagging overlap with existing segments matters practically because ad platforms charge for redundant audience overlap in wasted spend and diluted signal when the same person is targeted by two competing segments with conflicting messages.`,
    exampleOutput: `Segment: "Subscription paused, no cancellation, 14-30 days." Qualifying signal: subscription status = paused AND days since pause is 14-30. Messaging angle: address the specific friction that led to pausing (not a generic win-back discount) — reference resuming being one click, not a full re-signup. Overlap flag: does not overlap with existing "lapsed one-time buyers" segment since this is subscription-specific.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-13' }],
    changelog: [
      {
        date: '2026-08-13',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'ads-customer-persona-from-real-signals-not-invented-detail',
    category: 'ads',
    title: `Build an ad-targeting customer persona that flags every invented detail instead of presenting guesses as facts`,
    description: `Produces a customer persona for ad-creative and targeting purposes that clearly separates facts drawn from real data you provide from reasonable inferences the model is making, so the persona doesn't get treated as verified truth it never was.`,
    promptText: `Build a customer persona for {{product_or_service}} to guide ad creative and targeting decisions — the requirement is that every detail in the persona is traceable to either the real data I give you or an explicitly labeled inference, never presented as an established fact when it's actually a guess.

PRODUCT / SERVICE
{{product_or_service}}

REAL DATA AVAILABLE
{{real_data}}
(survey responses, customer interview notes, purchase/behavioral data, support ticket themes — whatever you actually have)

WHAT THIS PERSONA WILL BE USED FOR
{{persona_use_case}}

KNOWN GAPS IN THE DATA
{{known_gaps}}

Build the persona in two clearly separated parts. Part 1, "Confirmed from data": only details directly supported by the real data given, each one citing which piece of data supports it (e.g., "Frequently mentions price comparison in support tickets — supported by 40% of tickets referencing a competitor's price"). Part 2, "Reasonable inferences, unverified": details that would round out a useful persona but aren't directly evidenced — clearly labeled as inference, with the reasoning shown, and phrased as hypotheses to test rather than facts ("likely also considers [X], though this isn't confirmed by current data"). Do not blend the two categories into one seamless narrative persona bio that reads as if everything is equally certain — that's the most common failure of AI-generated personas, where an invented detail like an age range or a hobby sits next to a real data point with identical confidence, and whoever uses the persona downstream has no way to tell which parts to trust. For the stated use case, add one section naming which unverified inferences would be most valuable to actually confirm first, since not all data gaps matter equally for every use case.

OUTPUT: Part 1 (confirmed, with citations to the data given), Part 2 (inferences, clearly labeled and reasoned), and a short prioritized list of what to verify next.`,
    variables: [
      {
        name: 'product_or_service',
        description: `What this persona is for.`,
        example: `A meal-kit subscription service targeting time-constrained households.`,
        required: true,
      },
      {
        name: 'real_data',
        description: `Actual data available — quote or summarize it, don't just say 'we have some surveys.'`,
        example: `200-response survey: 65% cite "lack of time to plan meals" as top reason for subscribing; support tickets show recurring complaints about portion sizes for larger households.`,
        required: true,
      },
      {
        name: 'persona_use_case',
        description: `What decision this persona will actually inform.`,
        example: `Deciding which pain point to lead with in a new round of Facebook ad creative.`,
        required: true,
      },
      {
        name: 'known_gaps',
        description: `What you know you don't know about this audience.`,
        example: `No reliable data on household size, income level, or cooking skill.`,
        required: false,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `customer-persona`,
      `audience-research`,
      `ad-targeting`,
      `market-research`,
      `data-driven-marketing`,
    ],
    whyItWorks: `AI-generated customer personas have a well-known failure mode where the model fills gaps in sparse real data with plausible-sounding demographic and psychographic detail — a name, an age, a hobby, an income bracket — presented in the same confident narrative voice as the actual survey findings, which means anyone using the persona downstream has no way to distinguish an evidenced fact from a filled-in guess, and ad creative built on the invented parts is effectively targeting a person who doesn't exist. Structurally separating the persona into a cited "confirmed from data" section and an explicitly labeled "unverified inference" section forces GPT-5.1 to make that distinction visible rather than resolving the ambiguity silently in favor of a more complete-sounding narrative, since the model's default instinct when asked for a persona is to produce something that reads as a finished, confident character rather than an honest reflection of data quality. Requiring each confirmed detail to cite the specific piece of data supporting it (not just assert it) makes the claim checkable — a downstream reader can trace "price-sensitive" back to "40% of support tickets reference a competitor's price" and judge for themselves whether that's strong enough evidence to build a campaign angle on. The final prioritization step — which unverified inferences matter most to confirm given the stated use case — makes the persona actionable as a research tool rather than a static deliverable, since not every data gap is equally costly to leave unresolved; a gap that would change which pain point leads the next ad round is worth closing before launch, while a gap that wouldn't change any near-term decision isn't.`,
    exampleOutput: `Part 1: "Time scarcity is the primary stated motivator — supported by 65% of 200 survey respondents citing 'lack of time to plan meals' as the top subscription reason." Part 2: "Likely skews toward dual-income households, though this isn't confirmed by current data — inferred from the time-scarcity theme, not directly measured." Priority to verify: household size and income, since portion-size complaints suggest the ad angle may be targeting the wrong household size without this confirmed.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-13' }],
    changelog: [
      {
        date: '2026-08-13',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'ads-value-proposition-differentiation-stress-test',
    category: 'ads',
    title: `Stress-test a value proposition by writing the competitor's rebuttal before finalizing the ad claim`,
    description: `Drafts a value proposition for ad copy, then deliberately writes the strongest counterargument a competitor or skeptical buyer could make against it, and revises the value prop only if it survives that pressure test.`,
    promptText: `Write a value proposition statement for {{product_or_service}} suitable for use across ad headlines and landing pages, and then deliberately stress-test it by writing the strongest rebuttal a skeptical buyer or a competitor could make against it before treating the value prop as finished.

PRODUCT / SERVICE
{{product_or_service}}

WHAT WE ACTUALLY DO DIFFERENTLY
{{actual_differentiator}}

MAIN COMPETITOR OR ALTERNATIVE
{{competitor_or_alternative}}

TARGET BUYER
{{target_buyer}}

Step 1: Write a value proposition (1-2 sentences, ad-ready) built specifically around the stated actual differentiator, not a generic claim like "the best solution for X" that any competitor could paste onto their own page unchanged. Step 2: Write the single strongest rebuttal a skeptical buyer familiar with {{competitor_or_alternative}} could make against this value prop — the real objection a smart buyer would raise, not a strawman. Step 3: Revise the value proposition specifically to preempt or survive that rebuttal, either by adding a qualifier that makes the claim more defensible, by pairing it with the proof point that answers the rebuttal directly, or by narrowing the claim to the specific scope where it's actually true and undeniable. Do not weaken the value prop into vague, unfalsifiable language just to dodge the rebuttal — narrowing scope to something true and specific is different from softening a claim into meaninglessness. Do not fabricate a competitor weakness or a claim about {{competitor_or_alternative}} you weren't given; the rebuttal should be about what a buyer would question in OUR claim, not an attack on the competitor's product.

OUTPUT: Draft 1 (value prop), Step 2 (rebuttal), Final version (revised value prop), and one sentence on what specifically changed between draft and final and why.`,
    variables: [
      {
        name: 'product_or_service',
        description: `What's being positioned.`,
        example: `A code-review tool that runs security checks inline in pull requests.`,
        required: true,
      },
      {
        name: 'actual_differentiator',
        description: `The real, specific thing that's different — not a vague superlative.`,
        example: `Flags issues directly in the PR diff before merge, instead of a separate dashboard reviewed after the fact.`,
        required: true,
      },
      {
        name: 'competitor_or_alternative',
        description: `What buyers are comparing this against.`,
        example: `A standalone security-scanning dashboard product, and the alternative of just doing manual code review.`,
        required: true,
      },
      {
        name: 'target_buyer',
        description: `Who this value prop needs to convince.`,
        example: `Engineering managers evaluating tools to add to an existing CI pipeline.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `value-proposition`,
      `positioning`,
      `competitive-differentiation`,
      `ad-copy`,
      `messaging-strategy`,
    ],
    whyItWorks: `A value proposition written in a single pass, without a pressure test, tends to be whatever sounds most confident and complete on first draft, and confident-sounding claims are exactly the ones most vulnerable to an obvious rebuttal a real buyer would raise in the first thirty seconds of evaluating the product — building the rebuttal step into the same prompt forces GPT-5.1 to generate the skeptical buyer's actual objection rather than skip straight to a polished-sounding claim, which surfaces weaknesses in the value prop before it ever reaches an ad platform where the cost of a shaky claim is wasted spend and a bounced click. Explicitly distinguishing between narrowing scope (making a claim more specific and therefore more defensible) and softening it into vagueness (making it unfalsifiable to dodge the objection) matters because a model under pressure to "fix" a rebutted claim will often default to the easier move of vague hedging language, which produces a value prop that's technically unrebuttable only because it no longer says anything specific enough to be wrong — the instruction to distinguish these two responses keeps the revision honest rather than just evasive. Requiring the rebuttal to focus on what a buyer would question in the claim itself, rather than inventing a weakness in the named competitor, prevents the exercise from turning into unearned competitor disparagement based on assumptions the model wasn't given any actual evidence for, which is both an accuracy risk and, in some ad contexts, a comparative-advertising compliance risk if a claim about a competitor's product were ever surfaced in the ad copy itself.`,
    exampleOutput: `Draft 1: "The fastest way to catch security issues in your codebase." Rebuttal: "So does [dashboard competitor] — what does 'fastest' actually mean here, and is it just faster than a dashboard, or faster than doing nothing?" Final: "Catches security issues in the PR diff, before merge — not in a separate dashboard reviewed after the fact." Change: narrowed "fastest" (unfalsifiable, invites the obvious "compared to what" rebuttal) to the specific, provable workflow difference (inline in PR vs. separate dashboard) that the rebuttal couldn't touch.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-14' }],
    changelog: [
      {
        date: '2026-08-14',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'ads-usp-single-sentence-under-fire',
    category: 'ads',
    title: `Distill a USP down to one sentence that still holds up when a buyer asks 'compared to what, exactly?'`,
    description: `Forces a Unique Selling Proposition down to a single, specific sentence that survives the direct follow-up question every real buyer eventually asks, rather than a broad claim that only sounds specific.`,
    promptText: `Distill a Unique Selling Proposition for {{product_or_service}} down to exactly one sentence, then check whether that sentence survives the single most common follow-up question a real buyer asks after hearing any USP: "compared to what, exactly?"

PRODUCT / SERVICE
{{product_or_service}}

ALTERNATIVES BUYERS ACTUALLY COMPARE THIS TO
{{alternatives_compared_to}}

SPECIFIC, VERIFIABLE FACT THAT SUPPORTS THE USP
{{supporting_fact}}

CATEGORY CLICHES TO AVOID
{{category_cliches}}

Write three candidate one-sentence USPs, each built on a different structural approach: one framed as an explicit comparison ("unlike X, we do Y"), one framed as a specific mechanism claim (naming exactly how it works, not just that it works well), and one framed around the supporting fact stated as a number or concrete outcome. For each candidate, write the "compared to what?" follow-up a buyer would ask, and whether the sentence as written already answers it or needs a buyer to dig further to get the real answer — a USP that prompts "compared to what?" and can't answer in the same breath isn't actually unique, it's just a confident-sounding generic claim. Avoid every phrase in the category-cliches list entirely, even in a softened form — if "best-in-class" is banned, "industry-leading" is the same violation with different words. Do not use the supporting fact loosely — if it's a specific number, state it exactly as given, don't round it up or generalize it into a vaguer superlative.

OUTPUT: three candidates, each with its structural approach named, the anticipated "compared to what?" follow-up, and whether it's already answered — then a final recommendation of which one to use and why it's the only one that doesn't need the buyer to ask a second question to understand the actual differentiation.`,
    variables: [
      {
        name: 'product_or_service',
        description: `What's being distilled to a USP.`,
        example: `A password manager built specifically for small law firms.`,
        required: true,
      },
      {
        name: 'alternatives_compared_to',
        description: `What buyers realistically compare this against.`,
        example: `Consumer password managers not built for compliance, and firms currently just using browser-saved passwords.`,
        required: true,
      },
      {
        name: 'supporting_fact',
        description: `A real, specific fact or number to ground the strongest candidate.`,
        example: `Built-in audit log meeting state bar association client-confidentiality requirements, unlike consumer-grade tools.`,
        required: true,
      },
      {
        name: 'category_cliches',
        description: `Overused phrases in this category to avoid entirely.`,
        example: `"Best-in-class security," "industry-leading," "seamless experience."`,
        required: false,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`usp`, `positioning`, `differentiation`, `ad-copy`, `messaging-strategy`],
    whyItWorks: `The most common failure of AI-generated USPs is producing a sentence that sounds specific and confident but is actually a generic superlative wearing specific-sounding clothes — "the smartest way to manage passwords" has the cadence of a differentiated claim but collapses the instant a buyer asks the natural follow-up question any real prospect asks, which is exactly why building that follow-up question into the prompt itself is the mechanism that catches the failure before the copy ships. Requiring three structurally different candidates (explicit comparison, mechanism claim, fact-grounded claim) rather than one polished sentence prevents GPT-5.1 from defaulting to whichever phrasing sounds most persuasive in isolation, since the comparison-framed and mechanism-framed versions naturally resist vagueness in a way a single unconstrained attempt often doesn't — a sentence that has to literally contain "unlike X" or name the specific mechanism can't hide behind a superlative the way a free-form USP can. The instruction to treat a softened synonym of a banned cliche as the same violation ("industry-leading" for a banned "best-in-class") matters because models routinely satisfy a literal ban while reintroducing the same generic register through a near-synonym, technically complying with the instruction's letter while missing its actual point, which is to avoid sounding like every other ad in the category regardless of the specific words used. Requiring the exact supporting fact to be stated precisely rather than rounded or generalized protects against a subtle drift where a real, checkable number ("meets state bar audit-log requirements") gets rewritten into a vaguer, unfalsifiable superlative during the polish pass, which quietly converts a genuinely differentiated fact into exactly the kind of generic claim this exercise is trying to eliminate.`,
    exampleOutput: `Candidate 2 (mechanism claim): "Built with an audit log that meets state bar client-confidentiality requirements — something consumer password managers aren't built for." Compared to what: "Compared to consumer-grade password managers." Already answered in the same sentence — no second question needed, since the sentence names both the mechanism and the specific alternative it's better than.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-14' }],
    changelog: [
      {
        date: '2026-08-14',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'ads-offer-positioning-price-anchor-and-framing-check',
    category: 'ads',
    title: `Position an ad offer with a price-framing check that catches when the anchor doesn't actually make sense`,
    description: `Drafts offer positioning copy for an ad, including how price or value is framed and anchored, with an explicit check that the anchor comparison is honest and would hold up if a skeptical buyer looked closely at the math.`,
    promptText: `Position an ad offer for {{offer}}, including how the price or value should be framed, and explicitly check whether the framing's math would hold up if a skeptical buyer actually did the comparison themselves rather than just feeling the vibe of the framing.

OFFER
{{offer}}

ACTUAL PRICE AND WHAT'S INCLUDED
{{actual_price_and_inclusions}}

WHAT THIS IS BEING COMPARED AGAINST (real anchor, if one exists)
{{comparison_anchor}}

TARGET BUYER'S PRICE SENSITIVITY
{{price_sensitivity_context}}

Write the offer positioning in two parts. Part 1: the framing approach — decide whether this offer is better positioned around an anchor comparison ("less than the cost of X"), a per-unit breakdown ("just $Y per day/use"), a bundled-value framing (listing what's included and its combined worth), or a straight price-transparency framing (stating the price plainly because the offer is strong enough not to need dressing up) — and justify the choice based on the target buyer's stated price sensitivity, not just pick whichever framing sounds most persuasive by default. Part 2: the actual ad copy using that framing. Then, run an honesty check: if using an anchor or per-unit comparison, verify the math actually works as stated (e.g., if claiming "less than a cup of coffee a day,� confirm the daily-equivalent price is genuinely in that range, not a stretch) and flag explicitly if the comparison only works with a generous rounding or an unstated assumption a skeptical buyer would catch. Do not invent a comparison anchor not given to you (a made-up "average cost of X" statistic) — if no real anchor was provided and one is needed for the framing to work, say so and either request the missing figure or default to a different framing that doesn't need one.

OUTPUT: framing approach chosen with justification, the ad copy itself, and the honesty check confirming the math holds or flagging exactly where it's a stretch.`,
    variables: [
      {
        name: 'offer',
        description: `The specific offer being positioned.`,
        example: `$29/month meditation app subscription, annual plan billed as $299/year.`,
        required: true,
      },
      {
        name: 'actual_price_and_inclusions',
        description: `The real price and what it actually includes.`,
        example: `$299/year covers unlimited sessions, offline downloads, and one linked family account.`,
        required: true,
      },
      {
        name: 'comparison_anchor',
        description: `A real thing this could honestly be compared against, if one exists.`,
        example: `One in-person therapy session locally averages $120-150, per publicly available local directory pricing — not a claim we've independently verified nationally.`,
        required: false,
      },
      {
        name: 'price_sensitivity_context',
        description: `What you know about how price-sensitive this buyer is.`,
        example: `Price-sensitive enough that a $299 annual charge upfront causes hesitation, even though the monthly-equivalent is low.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `offer-positioning`,
      `pricing-strategy`,
      `ad-copy`,
      `price-framing`,
      `conversion-copywriting`,
    ],
    whyItWorks: `Price-anchoring and per-unit framing ("less than a cup of coffee a day") are common enough in ad copy that a model asked to position an offer will reach for one by default regardless of whether the underlying math is actually honest, and this is a specific, well-documented weak point in AI-generated pricing copy — the model is optimizing for a framing that sounds persuasive, not one that survives a skeptical buyer doing the arithmetic themselves, which is exactly the gap the explicit honesty-check step closes by forcing the model to state and verify the actual calculation rather than assert the comparison and move on. Requiring the framing choice itself to be justified against the buyer's stated price sensitivity, rather than picked because it's the most conventionally persuasive option, matters because the right framing genuinely differs by buyer: a price-sensitive buyer facing a large upfront annual charge benefits from a per-unit breakdown that makes the daily cost feel small, while a buyer who already trusts the value proposition may find an anchor comparison to an unrelated purchase (coffee, another subscription) feel like a manipulation tactic rather than useful information, and defaulting to one framing style regardless of context misses that distinction entirely. The instruction against inventing a comparison anchor addresses a concrete accuracy problem: an ad claiming a product costs "less than the average cost of X" is making an implicit statistical claim, and if that statistic wasn't actually provided or verified, the ad is asserting something as fact that the advertiser has no basis for defending if a regulator, competitor, or simply a skeptical customer ever asks for the source. Explicitly flagging when a comparison only works via generous rounding or an unstated assumption gives the person using this prompt a chance to either fix the framing or accept the risk deliberately, rather than discovering after the ad is live that a customer did the math publicly and the framing didn't hold up.`,
    exampleOutput: `Framing chosen: per-unit breakdown, justified by stated price sensitivity to the upfront $299 charge. Ad copy: "$299/year works out to about 82 cents a day — unlimited sessions, offline downloads, one family seat included." Honesty check: $299/365 = $0.819/day, rounds cleanly to "about 82 cents" without a stretch — math holds without generous rounding.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-14' }],
    changelog: [
      {
        date: '2026-08-14',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'ads-ab-test-plan-one-variable-at-a-time',
    category: 'ads',
    title: `Design an ad A/B test plan that isolates one variable per test instead of changing five things and guessing why`,
    description: `Builds an ad A/B test plan that isolates a single variable per test, states the specific hypothesis being tested, and defines the minimum sample size or duration needed before drawing a conclusion, instead of a vague 'test some variations' plan.`,
    promptText: `Design an A/B test plan for {{ad_campaign}}, where every individual test isolates exactly one variable, so a result can actually be attributed to something specific rather than "the new version performed better" with no way to say why.

AD CAMPAIGN
{{ad_campaign}}

CURRENT BASELINE AD
{{baseline_ad}}

VARIABLES WE WANT TO LEARN ABOUT
{{variables_to_test}}
(e.g., headline framing, CTA button text, image style, offer structure)

CURRENT TRAFFIC / BUDGET CONSTRAINTS
{{traffic_constraints}}

For each variable listed, design one isolated test: state the specific hypothesis being tested ("a benefit-led headline will outperform a curiosity-led headline for this cold-traffic audience because..."), the exact single change between control and variant (everything else must stay identical — if two elements need to change together to make sense, say so explicitly and treat it as one combined variable, not two isolated tests run as if independent), and the primary metric that would confirm or reject the hypothesis. Given the stated traffic/budget constraints, estimate whether there's realistically enough volume to reach statistical significance in a reasonable timeframe, and flag any planned test that likely won't get enough data to be conclusive — a test that runs on too little traffic to ever reach significance isn't a real test, it's noise dressed up as one. Prioritize the list of tests by which finding would be most valuable to learn first, not just the order they were listed. Do not recommend running more than 2 simultaneous tests on the same ad set if the stated traffic constraints are limited, since overlapping tests contaminate each other's results when sample size is already tight.

OUTPUT: a table (Variable / Hypothesis / Exact Change / Primary Metric / Significance Feasibility Flag), ordered by priority, followed by a one-paragraph recommendation on sequencing given the traffic constraints.`,
    variables: [
      {
        name: 'ad_campaign',
        description: `What campaign this test plan is for.`,
        example: `Facebook cold-traffic acquisition campaign for a $60 skincare bundle.`,
        required: true,
      },
      {
        name: 'baseline_ad',
        description: `The current control ad being tested against.`,
        example: `Product-photo hero image, headline "Clear skin starts here," CTA "Shop Now."`,
        required: true,
      },
      {
        name: 'variables_to_test',
        description: `The specific elements you actually want to learn about.`,
        example: `Headline framing (benefit vs. curiosity), CTA button copy, whether a before/after image outperforms a product-only shot.`,
        required: true,
      },
      {
        name: 'traffic_constraints',
        description: `Real numbers on budget or traffic volume, so feasibility can be assessed honestly.`,
        example: `Roughly $50/day ad spend, ad set has historically converted at about 1.8%.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `ab-testing`,
      `ad-optimization`,
      `test-design`,
      `conversion-rate-optimization`,
      `ppc-strategy`,
    ],
    whyItWorks: `The most common real-world ad testing mistake is running variants that change multiple elements at once (a new headline and a new image and a new CTA in the same variant), which produces a result that says one version outperformed another with no way to attribute the lift to any specific cause — a prompt that just asks for "ad test ideas" doesn't prevent this because the model has no reason to enforce variable isolation unless explicitly instructed to, so this prompt makes isolating exactly one variable per test a hard structural rule rather than a best-practice suggestion easy to skip. Requiring an explicit, falsifiable hypothesis for each test (not just "test headline A vs B" but a stated reason A should outperform B for this specific audience) forces the plan to be diagnostic rather than exploratory — a test with a stated hypothesis produces a learning either way, while an unhypothesized test that just compares two options produces a result with no explanatory value even when it's statistically valid. The feasibility check against real stated traffic and budget numbers addresses a distinct, common failure where a technically well-designed test plan is impossible to actually run to conclusion given real budget constraints, and a model that isn't asked to check this will happily propose five simultaneous tests on an ad set that gets a few hundred clicks a month, producing directional noise mislabeled as a conclusive result. Capping simultaneous tests on the same ad set when traffic is limited protects against test contamination, a specific statistical risk where overlapping experiments on shared, scarce traffic make it impossible to cleanly attribute a result to either test — a risk that only matters when traffic is genuinely constrained, which is why the cap is conditioned on the stated constraint rather than applied as a universal rule regardless of scale.`,
    exampleOutput: `Variable: Headline framing. Hypothesis: "A benefit-led headline will outperform curiosity-led for this cold-traffic skincare audience because cold traffic hasn't built enough trust yet to click on ambiguity — they need the payoff stated plainly." Exact change: headline only, image and CTA held constant. Significance feasibility: at ~1.8% baseline CVR and $50/day spend, flag that reaching significance will likely take 3-4 weeks minimum — plan test duration accordingly rather than calling it early.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-14' }],
    changelog: [
      {
        date: '2026-08-14',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'ads-cro-audit-landing-page-paid-traffic',
    category: 'ads',
    title: `Turn a paid landing page's own funnel numbers into a ranked CRO audit, not a generic checklist`,
    description: `Diagnoses one specific paid-traffic landing page against its actual step-by-step drop-off numbers, separating ad-message mismatches from page execution problems, and outputs a single highest-priority fix instead of a 40-item best-practices list.`,
    promptText: `You are auditing the conversion path for ONE specific landing page that is currently receiving paid traffic — not doing a general "best practices" pass, but diagnosing this specific page against its own numbers.

CAMPAIGN CONTEXT
{{campaign_context}}

LANDING PAGE AND OFFER
{{landing_page_and_offer}}

FUNNEL NUMBERS SO FAR
{{funnel_numbers}}

TRAFFIC SOURCE BEHAVIOR
{{traffic_source_behavior}}

SUSPECTED FRICTION POINT
{{suspected_friction_point}}

HOW TO AUDIT
Start from the numbers, not the page layout — if funnel_numbers shows a specific step where visitors drop (landing view to form-start, versus form-start to submit), diagnose that step first and say explicitly why the other steps are lower priority given the data, rather than auditing top-to-bottom by page section regardless of where the actual leak is. Distinguish problems caused by a mismatch between the ad's promise and the landing page's message — traffic arriving with the wrong expectation — from problems caused by the page failing visitors who arrived with the right expectation; these need different fixes, and conflating them wastes a test cycle on the wrong lever. For every issue you flag, state your confidence based on the numbers given: call out plainly when something is a plausible hypothesis versus something the funnel data actually supports, since a few hundred paid clicks cannot support ten confident claims at once. Do not recommend a redesign as the first move for a problem a single element change (headline, form field count, CTA copy) could plausibly fix — propose a full redesign only when the numbers show broad, non-localized underperformance across every step rather than one clear leak point.

WHAT NOT TO DO
Do not produce a generic CRO checklist (page speed, mobile responsiveness, above-the-fold CTA) unless something in the context actually suggests that item is the issue here — every recommendation must trace back to a specific number or observation given above. Do not recommend more than one first test; prioritization is the entire point of this audit, not a menu of options.

OUTPUT FORMAT
1. The single highest-priority fix, with the funnel number that justifies it and the mechanism for why it should move that number.
2. Two to four secondary issues, each tagged [ad-message-mismatch] or [page-execution], ranked by likely impact.
3. One explicit "not enough data to say" item — a common suspect you're declining to diagnose because the numbers given don't support a verdict either way.
4. A single next A/B test recommendation naming the exact variable to change and the metric that would confirm the fix worked.`,
    variables: [
      {
        name: 'campaign_context',
        description: `Which ad platform, campaign type, and spend level is driving traffic to this page.`,
        example: `Google Search, exact-match on "project management software for agencies", $80/day, running 3 weeks.`,
        required: true,
      },
      {
        name: 'landing_page_and_offer',
        description: `The page in question and what it's asking the visitor to do.`,
        example: `/agencies-landing — gated 14-day trial signup form, no credit card required.`,
        required: true,
      },
      {
        name: 'funnel_numbers',
        description: `The actual step-by-step counts or rates from click to conversion.`,
        example: `2,400 clicks -> 2,100 landing views -> 340 form starts -> 96 submits (14% landing-to-start, 28% start-to-submit).`,
        required: true,
      },
      {
        name: 'traffic_source_behavior',
        description: `Engagement signals that hint at whether visitors are even reading the page.`,
        example: `Avg session 38 seconds, 71% mobile, 62% bounce on landing view.`,
        required: true,
      },
      {
        name: 'suspected_friction_point',
        description: `Any hunch the team already has, to be confirmed or overruled by the data rather than assumed.`,
        example: `Team suspects the pricing mention in the hero contradicts the ad's "free trial" framing.`,
        required: false,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `cro-audit`,
      `landing-page`,
      `paid-traffic`,
      `conversion-optimization`,
      `ab-testing`,
    ],
    whyItWorks: `Asked to "audit this landing page" without a numbers constraint, GPT-5.1 defaults to reciting the standard CRO literature — page speed, above-the-fold CTA, trust badges — because that is the highest-probability completion for the bare word "audit" and it has no data to anchor against, which produces a checklist that reads as competent but isn't actually diagnosing this page's specific leak. Forcing the funnel numbers into the prompt and instructing the model to diagnose the worst step first, then explicitly justify deprioritizing the rest, changes the task from pattern-matching against a known list to genuine triage against evidence — a structurally different and harder task the model won't do unless told to. The ad-message-mismatch versus page-execution split matters specifically for paid traffic because it is a failure mode organic-traffic CRO audits don't usually have to consider: a visitor who clicked a Google ad promising one thing and landed on a page emphasizing another will bounce for a reason no page-level fix addresses, and a generic audit tool has no way to know an ad even exists, let alone what it promised. The explicit confidence-calibration instruction and the required "not enough data to say" line counteract GPT-5.1's tendency to answer every prompt with uniform confidence regardless of sample size — a few hundred clicks is not enough to confidently diagnose ten separate issues, and naming the one thing you're declining to call is what keeps the output honest about what a thin dataset can and can't support.`,
    exampleOutput: `Highest-priority fix: the 14% landing-to-start rate against a 28% start-to-submit rate points to a page-level problem before the form, not a form-abandonment problem — likely the hero's pricing mention undercutting the ad's "free, no card" promise. [ad-message-mismatch] Rewrite the hero to lead with the free-trial terms verbatim from the ad copy before any pricing context appears. Not enough data to say: whether mobile layout is contributing, since bounce rate alone doesn't isolate device-specific friction at this sample size. Next test: hero headline swap (free-trial framing first vs. current), measured on landing-to-form-start rate only.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-08' }],
    changelog: [
      {
        date: '2026-08-08',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'ads-marketing-funnel-paid-acquisition-map',
    category: 'ads',
    title: `Map a paid-acquisition funnel stage by stage so every ad dollar has a named next step`,
    description: `Builds a paid-acquisition funnel around what actually happens after someone clicks an ad — the specific asset, channel, and trigger at each stage — instead of a generic awareness/consideration/decision diagram that doesn't say who does what.`,
    promptText: `Map the paid-acquisition funnel for this specific offer, stage by stage, so that every stage names a real asset, a real channel, and the specific event that moves someone to the next stage. Do not produce an abstract awareness/consideration/decision diagram — every stage must be concrete enough that someone could build it this week.

OFFER AND PRICE POINT
{{offer_and_price_point}}

CURRENT PAID CHANNELS IN USE
{{current_paid_channels}}

KNOWN DROP-OFF STAGE
{{known_drop_off_stage}}

SALES CYCLE LENGTH
{{sales_cycle_length}}

EXISTING RETARGETING ASSETS
{{existing_retargeting_assets}}

For each funnel stage, name: the specific ad or content asset a prospect sees at that stage, the channel it runs on, the trigger event that moves them forward (a click, a form fill, a watch-through threshold, an add-to-cart), and the one metric that proves the stage is working versus leaking. If sales_cycle_length is longer than a single session, the funnel must include at least one retargeting or nurture stage between first click and purchase — a funnel that jumps straight from ad click to purchase for anything with a multi-day consideration period is describing wishful thinking, not the actual path a buyer takes. Build the stage immediately before and after known_drop_off_stage in more detail than the rest of the funnel, since that is where the actual problem lives, and propose one specific change to the asset or trigger at that junction rather than a general "improve nurture" note. If existing_retargeting_assets are given, slot them into the funnel where they actually belong rather than inventing new assets from scratch when a usable one already exists.

OUTPUT FORMAT
A numbered stage-by-stage table: Stage | Asset | Channel | Trigger to next stage | Health metric. Follow it with a short paragraph on the known_drop_off_stage specifically — what's likely happening there and the one change to test first. End with a one-line gap check: any stage in the table with no assigned owner-ready asset yet, named honestly rather than papered over with a placeholder.`,
    variables: [
      {
        name: 'offer_and_price_point',
        description: `What's being sold and roughly what it costs, since funnel length depends heavily on price point.`,
        example: `B2B SaaS analytics tool, $400/month, annual contracts preferred.`,
        required: true,
      },
      {
        name: 'current_paid_channels',
        description: `Which paid channels are actually running today, not which ones are theoretically available.`,
        example: `LinkedIn ads to a gated whitepaper, Google Search on branded and competitor terms.`,
        required: true,
      },
      {
        name: 'known_drop_off_stage',
        description: `Where in the funnel prospects are known to disappear.`,
        example: `Whitepaper download to demo request — high download volume, very few demo bookings.`,
        required: true,
      },
      {
        name: 'sales_cycle_length',
        description: `Roughly how long from first touch to closed deal, so the funnel reflects reality rather than a single-session assumption.`,
        example: `Average 45 days, involves at least one internal stakeholder besides the first contact.`,
        required: true,
      },
      {
        name: 'existing_retargeting_assets',
        description: `Any nurture or retargeting content that already exists and should be slotted in rather than replaced.`,
        example: `A 3-email nurture sequence after whitepaper download, and a customer case study video not yet used in ads.`,
        required: false,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `marketing-funnel`,
      `paid-acquisition`,
      `retargeting`,
      `b2b-marketing`,
      `funnel-mapping`,
    ],
    whyItWorks: `GPT-5.1's default response to "map a marketing funnel" is the textbook three- or four-stage diagram it was trained on thousands of times, because that shape is the highest-frequency pattern for the phrase — it is correct in the abstract and useless in practice because it names no actual asset, channel, or trigger a team could build against this week. Requiring a named asset, channel, and trigger event per stage forces the model out of that generic template and into a mode where it has to commit to specifics, which is where the actual value of a funnel map lives — an unbuildable funnel is not a funnel, it's a diagram. The instruction to add a mandatory retargeting stage whenever the sales cycle exceeds a single session directly counters a structural blind spot: language models asked for "a funnel" tend to default to the simplest possible path (ad click to purchase) unless explicitly told the offer's price point and consideration period make that path implausible, and for anything with a multi-stakeholder B2B sales cycle that default path is simply wrong. Concentrating detail on the stage immediately before and after the known drop-off point, rather than spreading equal attention across every stage, mirrors how a real growth analyst would spend their limited time — the rest of the funnel matters less than fixing the one leak that's actually costing pipeline, and asking the model to weight its output that way keeps the response focused on the decision that matters rather than exhaustively even-handed across a diagram nobody asked to have equally documented.`,
    exampleOutput: `Stage 3 — Whitepaper Download to Demo Request | Asset: 3-email nurture sequence (existing) + unused case study video | Channel: Email + LinkedIn retargeting | Trigger: video watch-through past 50% triggers a demo-request CTA email | Health metric: download-to-demo conversion rate. Diagnosis: high download volume with low demo bookings suggests the whitepaper is answering the prospect's question well enough that they don't feel an urgent need to talk to sales yet — inserting the case study video mid-nurture, timed to a stakeholder-relevant pain point, is the first thing to test rather than adding another generic "book a demo" email.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-09' }],
    changelog: [
      {
        date: '2026-08-09',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'ads-campaign-brief-paid-media-launch',
    category: 'ads',
    title: `Write a paid-media campaign brief tight enough that a media buyer and a designer build the same campaign`,
    description: `Produces a single-source campaign brief with the objective, audience, budget split, and creative direction locked to specific numbers and constraints, so the media buyer and the designer don't quietly build two different campaigns from the same kickoff meeting.`,
    promptText: `Write a paid-media campaign brief for the launch described below. The test for whether this brief succeeded: a media buyer and a designer who have never spoken to each other should be able to read only this document and build the same campaign, with no assumptions filled in differently by each of them.

CAMPAIGN OBJECTIVE AND SUCCESS METRIC
{{objective_and_success_metric}}

TARGET AUDIENCE
{{target_audience}}

BUDGET AND FLIGHT DATES
{{budget_and_flight_dates}}

CHANNELS APPROVED FOR THIS CAMPAIGN
{{approved_channels}}

HARD CONSTRAINTS
{{hard_constraints}}

BRIEF REQUIREMENTS
State the objective as a single measurable outcome with a target number and a deadline, not a vague direction like "drive awareness" — if objective_and_success_metric doesn't already include a number, flag that as a gap the brief cannot responsibly fill in for the team and name it explicitly rather than inventing a plausible-sounding target. Split the budget across the approved channels with a stated rationale for the split, not an even default division — an even split across channels is itself a decision that should be justified or explicitly avoided, since channels rarely deserve equal spend by default. Write the creative direction section specifically enough that two different designers would produce visibly similar output: name the emotional register, what the visual must NOT look like (competitor brief-fatigue is real — call out a specific competitor's visual style to avoid if one is relevant), and the one non-negotiable brand or legal element that must appear in every asset. Every hard constraint given must appear as an explicit line in the brief itself, not just be honored implicitly in your reasoning — a constraint a reader can't see in the document isn't actually a constraint on the team building from it.

OUTPUT FORMAT
1. Objective (one sentence, one number, one deadline) — or an explicit flag if the input doesn't support one.
2. Audience (who, and just as important, who this is NOT for).
3. Budget table by channel with one-line rationale per row.
4. Flight timeline.
5. Creative direction (register, what to avoid, non-negotiable element).
6. Hard constraints, restated as a checklist.
7. One open question the brief cannot answer on its own and needs a decision-maker to close before work starts.`,
    variables: [
      {
        name: 'objective_and_success_metric',
        description: `What this campaign needs to achieve, ideally already numeric.`,
        example: `Generate 150 qualified demo signups for the new mid-market tier by end of Q3.`,
        required: true,
      },
      {
        name: 'target_audience',
        description: `Who the campaign should reach, and who it should explicitly not waste spend reaching.`,
        example: `Ops managers at 50-200 employee logistics companies; explicitly not enterprise (>1000 employees) or solo founders.`,
        required: true,
      },
      {
        name: 'budget_and_flight_dates',
        description: `Total spend and the exact window the campaign runs.`,
        example: `$22,000 total, flighting Sept 1 to Sept 30.`,
        required: true,
      },
      {
        name: 'approved_channels',
        description: `Which channels leadership has already approved for this specific campaign.`,
        example: `LinkedIn ads and Google Search only — no Meta this cycle per leadership decision.`,
        required: true,
      },
      {
        name: 'hard_constraints',
        description: `Non-negotiable rules the campaign must follow, from legal, brand, or leadership.`,
        example: `Must not use the word "guaranteed" anywhere in ad copy; logo must appear at full size, not cropped.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `campaign-brief`,
      `paid-media`,
      `media-buying`,
      `creative-direction`,
      `budget-allocation`,
    ],
    whyItWorks: `A campaign brief fails silently, not loudly — the media buyer and the designer each fill any ambiguity in the document with their own private assumption, and the gap only surfaces at review, after money has already been spent and creative already built, which is the single most expensive place to discover a brief was underspecified. Forcing an explicit number and deadline into the objective line, and instructing the model to flag rather than invent one when the input lacks it, prevents GPT-5.1's default behavior of smoothing a vague goal like "drive awareness" into a plausible-sounding but fabricated target, which would let the brief look complete while actually deferring the hardest decision to whoever reads it last. Requiring a budget-split rationale rather than accepting an even division across channels matters because an even split is a real, common failure mode of both AI-generated and human-written briefs — it looks fair and defensible on paper while almost never matching the actual cost-efficiency differences between channels like LinkedIn and Google Search for the same audience. The instruction that every hard constraint must appear as a visible line in the document, not just be respected implicitly in the model's reasoning, addresses a specific and easy-to-miss failure: a constraint honored inside the model's generation but never surfaced as text is invisible to the human team executing the brief days later, who has no way to know it was ever considered unless it's written down as an explicit line they can check work against.`,
    exampleOutput: `Objective: Generate 150 qualified demo signups for the mid-market tier by Sept 30. Budget: LinkedIn $15,000 (70% — audience is only reliably addressable there via job-title targeting), Google Search $7,000 (30% — captures existing intent from competitor and category terms, lower expected volume this audience size). Open question: leadership hasn't confirmed whether "qualified" means BANT-qualified or just form-completed — this determines whether the campaign is actually hitting 150 or a smaller real number, and needs a decision before spend starts.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-10' }],
    changelog: [
      {
        date: '2026-08-10',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'ads-brand-messaging-ad-copy-hierarchy',
    category: 'ads',
    title: `Lock a brand's ad messaging hierarchy so every campaign stops reinventing the value prop from scratch`,
    description: `Builds a ranked messaging hierarchy — primary claim, supporting proof points, and banned phrasing — specific enough that a new campaign brief can pull from it directly instead of a copywriter re-deriving the value proposition every time.`,
    promptText: `You are building the ad messaging hierarchy for this brand — the reference document a copywriter should pull from for every future paid campaign instead of re-deriving the value proposition from scratch each time.

WHAT THE PRODUCT ACTUALLY DOES
{{product_description}}

WHO IT'S FOR AND THEIR MAIN OBJECTION
{{audience_and_main_objection}}

WHAT'S BEEN TESTED SO FAR
{{tested_messaging_history}}

COMPETITOR CLAIM TO NOT COLLIDE WITH
{{competitor_claim_to_avoid}}

Build the hierarchy in three tiers, most important first: the single primary claim every ad should be able to trace back to, three to five supporting proof points that back that claim with something concrete (a number, a mechanism, a named outcome — not an adjective), and a short list of phrases this brand should never use in ad copy, with the specific reason each one is banned. The primary claim must directly answer audience_and_main_objection — if the stated objection is about price, a primary claim about ease-of-use is answering a question nobody in this audience is actually asking, no matter how true it is. If tested_messaging_history shows a claim that underperformed, do not silently drop it — name it, name your best guess at why it likely underperformed, and say whether it should be retired or just needs a different proof point attached. The primary claim and at least one supporting point must be phrased distinctly enough that competitor_claim_to_avoid could not be mistaken for this brand's message if a prospect saw both back to back — if your first draft of the primary claim reads too close to the competitor's claim, revise it and note that you did.

OUTPUT FORMAT
1. Primary claim (one sentence).
2. Supporting proof points (3-5, each with the concrete backing evidence, not just the claim).
3. Banned phrases, each with the specific reason.
4. Verdict on any previously-tested underperforming claim: retire, or keep with a new proof point.
5. One line confirming the primary claim is meaningfully distinct from the competitor claim to avoid, or noting what you changed to make it so.`,
    variables: [
      {
        name: 'product_description',
        description: `What the product does in concrete, non-marketing language.`,
        example: `A payroll platform that runs multi-state tax filings automatically and flags compliance errors before they're submitted.`,
        required: true,
      },
      {
        name: 'audience_and_main_objection',
        description: `Who buys it and the single biggest reason they hesitate.`,
        example: `Small business owners with under 20 employees; main objection is fear of switching payroll providers mid-year and breaking something.`,
        required: true,
      },
      {
        name: 'tested_messaging_history',
        description: `Any claims already tried in ads, and how they performed if known.`,
        example: `"Save 10 hours a month" tested for 6 weeks, click-through was fine but conversion to trial was low.`,
        required: false,
      },
      {
        name: 'competitor_claim_to_avoid',
        description: `A specific competitor message this brand's claim shouldn't be mistaken for.`,
        example: `Gusto's ads lead heavily with "payroll made easy" — this brand needs to sound distinct from that.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `brand-messaging`,
      `ad-copywriting`,
      `value-proposition`,
      `positioning`,
      `messaging-hierarchy`,
    ],
    whyItWorks: `A messaging hierarchy only earns its keep if a copywriter three months from now, working on a campaign nobody who wrote this document is involved in, can pull the primary claim and proof points directly rather than re-deriving them — which means the document has to force specificity GPT-5.1 won't volunteer unprompted, since asked generally for "brand messaging" it defaults to safely broad claims ("reliable," "easy to use") that sound plausible for almost any product and therefore commit the brand to nothing distinctive. Anchoring the primary claim explicitly to the stated main objection closes a common gap where a technically true claim (ease of use) gets promoted to primary status because it's the most flattering thing to say about the product, even when it doesn't address what's actually stopping the buyer — a mismatch that shows up as ads with a high click-through but poor down-funnel conversion, exactly the pattern named in the tested_messaging_history field. Requiring the model to name and diagnose a previously underperforming claim rather than quietly omit it prevents the common failure where an AI-assisted rewrite simply produces a fresh, positive-sounding hierarchy with no memory that something like this was already tried and didn't work, silently repeating the same mistake with slightly different words. The competitor-distinction check matters mechanically because language models trained on similar marketing copy across a category tend to converge toward the same handful of generic phrasings for a given product type unless explicitly told which exact phrase to differentiate from — without that instruction, two competitors' AI-assisted messaging documents can end up sounding nearly identical purely from shared training distribution, not because either brand chose to sound that way.`,
    exampleOutput: `Primary claim: "Switch payroll providers without missing a single filing — we handle the transition, you don't lift a finger." Verdict on "Save 10 hours a month": retire as primary, keep as a supporting proof point — it likely underperformed on conversion because it answers a time objection when the real blocker is switching-risk fear, not time. Competitor distinction: revised the primary claim away from "payroll made easy" territory by leading with switching-safety rather than general simplicity, since that's the specific fear this audience holds that Gusto's messaging doesn't address head-on.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-11' }],
    changelog: [
      {
        date: '2026-08-11',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'ads-customer-research-ad-audience-personas',
    category: 'ads',
    title: `Turn scattered customer research into ad-targeting personas built around actual objections, not demographic guesses`,
    description: `Converts raw customer research inputs — support tickets, sales call notes, survey answers — into a small number of ad-targeting personas defined by the objection each one holds and the proof that overcomes it, rather than a generic age-and-job-title profile.`,
    promptText: `Turn the raw customer research below into ad-targeting personas. Each persona must be defined primarily by the objection or hesitation it holds toward this product, not by demographic traits alone — a persona built only from age range and job title tells an ad team nothing about what to say to that person.

PRODUCT
{{product_summary}}

RAW RESEARCH INPUTS
{{raw_research_inputs}}

HOW MANY PERSONAS NEEDED
{{persona_count_target}}

EXISTING PERSONAS TO RECONCILE WITH
{{existing_personas}}

Read the raw research inputs for recurring hesitations, not just recurring facts — if three different support tickets or call notes independently express doubt about the same thing (implementation time, whether it integrates with an existing tool, whether the price scales badly), that's a persona-defining signal even if the people who said it don't share obvious demographic traits. Do not manufacture a demographic detail (age, income, company size) that isn't actually supported by the research inputs — if the inputs don't specify company size, say the persona is defined by role and objection only, and leave demographic fields honestly blank rather than inventing plausible-sounding numbers. For each persona, name the one ad angle or proof point that would most directly address their specific objection — not a generic value proposition restated per persona, but the one argument this specific person needs to hear that a different persona wouldn't. If existing_personas are provided, merge or split against them explicitly rather than starting over — say which existing persona each new one maps to, replaces, or splits into two, so the team doesn't end up running two parallel and uncoordinated persona sets.

OUTPUT FORMAT
For each persona: name, the objection that defines them (quoting or closely paraphrasing the research signal it came from), what demographic/firmographic traits are actually supported by the data (marking any as "not established by research" rather than guessing), and the one ad angle that addresses their objection directly. Close with a one-line map of how these personas relate to any existing_personas given.`,
    variables: [
      {
        name: 'product_summary',
        description: `What's being sold, briefly.`,
        example: `A cloud backup tool for small accounting firms.`,
        required: true,
      },
      {
        name: 'raw_research_inputs',
        description: `The actual research material — quotes, ticket summaries, call notes, survey excerpts.`,
        example: `12 support tickets mentioning worry about client data security compliance; 4 sales call notes where prospects asked about migration downtime; a survey where 60% cited "too expensive for what it does" as their top concern.`,
        required: true,
      },
      {
        name: 'persona_count_target',
        description: `Roughly how many distinct personas the ad team can realistically target with different creative.`,
        example: `2-3 — the team only has bandwidth to run distinct creative for a small number of segments.`,
        required: true,
      },
      {
        name: 'existing_personas',
        description: `Any persona set already in use that new personas need to reconcile against.`,
        example: `"Busy Bookkeeper" persona currently used in Google ads, built mostly on job title with no stated objection.`,
        required: false,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `customer-research`,
      `audience-personas`,
      `ad-targeting`,
      `objection-handling`,
      `market-research`,
    ],
    whyItWorks: `Asked to build "personas" in the abstract, GPT-5.1 reaches for the most common template in its training distribution — a name, an age range, a job title, and a few generic goals — because that format is heavily represented in marketing content regardless of whether it's actually useful for writing an ad, and it will happily fabricate a plausible-sounding age or company size even when no such detail exists anywhere in the source research. Anchoring each persona to a specific, quoted objection from the raw research forces the model to ground the persona in evidence that actually predicts ad response, since the entire reason personas exist for a paid-media team is to know what argument to lead with, and a demographic label alone doesn't answer that question no matter how precisely specified it is. The explicit instruction to mark unsupported demographic fields as "not established" rather than invent them addresses a specific and common failure mode: language models are fluent enough to generate a confident-sounding company size or income bracket that sounds like it came from data, and a reader has no way to distinguish a real research finding from a plausible fabrication unless the model is told to flag the difference itself. Requiring explicit reconciliation against any existing persona set prevents the common organizational problem where an AI-assisted research refresh quietly produces a second, incompatible persona framework that different team members start using inconsistently — one that maps clearly onto or supersedes the old set is far more likely to actually get adopted than one that requires the team to reconcile it by hand later.`,
    exampleOutput: `Persona: "Compliance-Cautious Owner" — objection: worried client financial data isn't secure enough for their compliance obligations (sourced from 12 support tickets on this theme). Demographics: not established by research beyond "small accounting firm owner"; do not assume firm size or age. Ad angle: lead with the specific compliance certification or encryption detail, not a general "secure backups" claim. Maps to existing "Busy Bookkeeper" persona: splits into this persona plus a second, "Migration-Wary Owner," since the current single persona conflated two distinct objections that need different proof points.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-12' }],
    changelog: [
      {
        date: '2026-08-12',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'ads-competitor-messaging-teardown-ad-angles',
    category: 'ads',
    title: `Reverse-engineer competitors' ad messaging into a gap map of angles nobody else is running`,
    description: `Analyzes a set of observed competitor ads for which claims and proof points every one of them leans on, then surfaces the specific angle none of them are using yet, instead of a bland side-by-side comparison table.`,
    promptText: `Analyze the competitor ad copy below to find the messaging angle none of these competitors are using — the gap this brand could occupy that isn't just a marginally different phrasing of what everyone else already says.

COMPETITOR ADS OBSERVED
{{competitor_ads_observed}}

THIS BRAND'S ACTUAL DIFFERENTIATOR
{{brand_differentiator}}

CATEGORY THIS IS COMPETING IN
{{category_context}}

STEP 1 — CLASSIFY THE CROWD
Group the competitor ads by the core claim each one is making (price, speed, ease of use, results, trust/authority, etc.), not by competitor name — the goal is to see how many of them are actually saying the same thing in different words, since a category where four competitors all lead with "easy to use" is a category where that claim has stopped differentiating anyone regardless of who's more accurate.

STEP 2 — FIND WHAT'S MISSING, NOT WHAT'S DIFFERENT
Do not simply list how this brand's ads differ from competitors' — a difference is only useful if it's also something the audience in category_context actually cares about. Identify claims that are true of brand_differentiator, relevant to this category, and genuinely absent or under-used across the observed competitor set. Reject a candidate gap if it's the kind of claim a competitor could copy within a week just by changing their ad copy with no product change required — a real gap should require the competitor to actually be true of it, not just say it.

STEP 3 — STRESS-TEST THE GAP
For the strongest gap you find, argue against yourself: name the most likely reason competitors are NOT already using this angle (maybe it's genuinely not compelling to this audience, maybe it requires a claim they legally or practically can't make, maybe it's simply been missed). If your best guess is that it's not compelling, say so plainly instead of forcing a recommendation.

OUTPUT FORMAT
1. Claim clusters — what most competitors are already saying, grouped.
2. The identified gap — the specific angle, and why a competitor can't simply copy it by rewriting ad copy alone.
3. Self-critique — the most likely reason nobody's using it yet, and whether that reason should stop this brand from using it too.
4. One sample headline built on the gap angle, ready to test.`,
    variables: [
      {
        name: 'competitor_ads_observed',
        description: `The actual ad copy or close paraphrases of ads seen from competitors.`,
        example: `Competitor A: "The easiest way to manage payroll." Competitor B: "Payroll that just works." Competitor C: "Simple payroll, powerful results."`,
        required: true,
      },
      {
        name: 'brand_differentiator',
        description: `What's actually true about this brand that's different from the competitors, verified fact not aspiration.`,
        example: `Only provider in this set with same-day payroll correction support via live chat, confirmed by support team.`,
        required: true,
      },
      {
        name: 'category_context',
        description: `What this category's buyers actually care about, so the gap found is relevant, not just novel.`,
        example: `Small business owners in this category consistently rank "what happens when something goes wrong" above "how easy is day-to-day use" in past surveys.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `competitor-analysis`,
      `ad-messaging`,
      `positioning`,
      `differentiation`,
      `ad-copy`,
    ],
    whyItWorks: `GPT-5.1's default response to a competitor teardown request is a side-by-side comparison table — this one says X, that one says Y — which is descriptively accurate but doesn't actually answer the question a media team needs answered, which is what to say that nobody else is saying, not what everyone is already saying phrased slightly differently. Grouping competitor ads by claim cluster rather than by competitor name surfaces the real signal, which is how narrow the actual messaging crowd is: three competitors phrasing "easy to use" three different ways is one occupied position, not three, and a table organized by competitor name obscures that. The instruction to reject any gap a competitor could copy within a week by rewriting ad copy alone is the mechanism that keeps this from producing a superficial angle — language models left unconstrained will happily surface a phrasing difference as if it were a strategic gap, when the actual bar for a defensible ad angle is that it requires the competitor to be true of something, not merely to claim it. The self-critique step, where the model has to argue the most likely reason competitors aren't already using the angle it just proposed, directly counters the sycophantic bias models have toward validating whatever conclusion they just generated — forcing an explicit adversarial pass against your own top recommendation surfaces the realistic possibility that the gap exists because it's genuinely uncompelling to this audience, not because everyone else missed it, which is the more common explanation and one a model won't volunteer unless explicitly told to look for it.`,
    exampleOutput: `Claim clusters: all three observed competitors cluster around "ease of use" phrased three ways — this claim is saturated. Gap: none lead with what happens when payroll goes wrong, despite category research showing buyers rank this above ease-of-use. Self-critique: most likely reason competitors avoid this angle is it implicitly admits payroll errors happen at all, which feels risky to say out loud — but since this brand's differentiator (same-day live-chat correction) turns that admission into a strength rather than a liability, the angle should still be used, just framed as confidence rather than caveat. Sample headline: "When payroll goes wrong, we fix it same day — not in a week."`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-13' }],
    changelog: [
      {
        date: '2026-08-13',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'ads-marketing-calendar-paid-campaign-cadence',
    category: 'ads',
    title: `Build a paid-campaign calendar sequenced around real fatigue signals, not a fixed weekly slot`,
    description: `Schedules creative refreshes, budget shifts, and campaign launches around actual performance-decay signals for each channel, instead of a generic content calendar that assigns a new post or ad every Monday regardless of whether last week's creative is still working.`,
    promptText: `Build a paid-campaign calendar for the period below. Every scheduled action must be triggered by a stated performance or timing signal — not placed on a fixed cadence just because a calendar needs entries in every week.

CAMPAIGNS RUNNING OR PLANNED
{{campaigns_planned}}

CREATIVE FATIGUE HISTORY
{{creative_fatigue_history}}

BUDGET REVIEW CADENCE
{{budget_review_cadence}}

KEY BUSINESS DATES TO BUILD AROUND
{{key_business_dates}}

For each campaign, schedule the creative refresh based on the fatigue pattern in creative_fatigue_history rather than an arbitrary fixed interval — if history shows this channel's creative typically fatigues (CTR decline of a certain magnitude) around a known point, schedule the refresh check just before that point, and say so explicitly rather than defaulting to a round-number cadence like "every 2 weeks" that isn't actually tied to this channel's real decay pattern. Do not schedule a budget review on the same day as a creative refresh unless there's a specific reason to bundle them — reviewing budget and refreshing creative are different decisions that get made worse when rushed together under one calendar slot. Build key_business_dates into the calendar as hard anchors the rest of the schedule must work around, not as an afterthought layered on top — if a launch or refresh would otherwise land in the same week as a key business date, move it, and say which way you moved it and why. If two campaigns would compete for the same audience's attention in the same week without a stated reason for that overlap, flag it explicitly rather than let a busy week for one audience pass silently.

OUTPUT FORMAT
A week-by-week calendar table: Week | Campaign | Action (launch / refresh check / budget review / pause) | Trigger reason for that timing. Below the table, list any key business date that forced a scheduling move, and any audience-overlap conflict you flagged between two campaigns.`,
    variables: [
      {
        name: 'campaigns_planned',
        description: `Which paid campaigns are running or planned for the period, with channel.`,
        example: `Meta ads for the fall product line (ongoing), Google Search brand campaign (always-on), planned LinkedIn campaign for a new webinar series.`,
        required: true,
      },
      {
        name: 'creative_fatigue_history',
        description: `What's known about how quickly creative typically decays on each channel from past campaigns.`,
        example: `Meta creative historically shows CTR decline starting around day 10-12 of a given ad set; Google Search brand terms rarely fatigue since they're intent-driven.`,
        required: true,
      },
      {
        name: 'budget_review_cadence',
        description: `How often budget gets formally reviewed and reallocated.`,
        example: `Budget reviewed every other Friday with the finance lead.`,
        required: true,
      },
      {
        name: 'key_business_dates',
        description: `Fixed dates the calendar must respect — launches, holidays, earnings, inventory events.`,
        example: `New product line ships Oct 1; no new campaign launches want to overlap with the Oct 1 week's operational load.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `marketing-calendar`,
      `paid-campaign-planning`,
      `creative-fatigue`,
      `budget-pacing`,
      `media-planning`,
    ],
    whyItWorks: `A calendar assembled by pattern-matching to "marketing calendar" templates in GPT-5.1's training data defaults to a fixed cadence — new post every Monday, refresh every two weeks — because that's the shape most calendar examples take online, and it has nothing to do with when this specific channel's creative actually stops working; a Meta ad set that fatigues at day 10 sitting untouched until a generic 2-week mark has already been bleeding efficiency for several days before the calendar even prompts a look. Requiring every scheduled action to cite the specific fatigue or timing signal that triggered it forces the model to actually use the creative_fatigue_history input rather than defaulting to round numbers, which is the entire value of giving it channel-specific decay data in the first place — a calendar that ignores that data isn't meaningfully different from one built with no input data at all. Separating budget review from creative refresh into distinct triggers matters because they're genuinely different decisions with different information needs — a budget reallocation call made in the same rushed slot as a creative swap tends to under-consider one or the other, and collapsing them onto the same day is a false efficiency that a naive calendar-generation pass won't flag on its own. Treating key business dates as hard anchors the schedule must move around, rather than optional context, addresses a common real failure where a campaign refresh lands during a week the team's attention is already consumed by an unrelated operational event like a product launch, and nobody actually executes the refresh on time because the calendar never accounted for competing bandwidth.`,
    exampleOutput: `Week of Sept 22: Meta fall product line — refresh check (trigger: approaching day-10 fatigue point based on history, want fresh creative in queue before CTR decline starts, not after). Week of Oct 1: no new campaign launches scheduled this week — moved the planned LinkedIn webinar campaign launch to Oct 8 to avoid competing with the Oct 1 product line ship date for internal attention. Flagged overlap: Meta fall campaign and the LinkedIn webinar campaign both target the same warm-audience segment in week of Oct 8 with no stated reason for the overlap — confirm this is intentional before both go live.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-09' }],
    changelog: [
      {
        date: '2026-08-09',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'ads-referral-campaign-paid-amplification-brief',
    category: 'ads',
    title: `Design a referral campaign brief that tells paid social exactly which incentive and creative to amplify`,
    description: `Specifies the referral incentive structure, the exact organic-to-paid handoff moment, and which advocate content is worth boosting, instead of a vague "promote our best referrals" instruction that leaves the media buyer guessing.`,
    promptText: `Design a referral campaign for the offer below, ending specifically in a brief the paid social team can act on directly — which piece of advocate content to boost, with what budget logic, and when to stop.

OFFER AND REFERRAL INCENTIVE
{{offer_and_incentive}}

WHO REFERS AND WHO THEY REFER TO
{{referrer_and_referee_profile}}

CURRENT ORGANIC REFERRAL SIGNAL
{{organic_referral_signal}}

PAID SOCIAL BUDGET AVAILABLE FOR AMPLIFICATION
{{amplification_budget}}

Start from the incentive structure and check it for a specific failure mode before anything else: an incentive that rewards the referrer richly but gives the referee a weak reason to act creates lopsided sharing (people post links for their own benefit) with poor conversion on the receiving end — if offer_and_incentive looks like this, flag it and propose a rebalance before building the rest of the campaign around an incentive likely to underperform. Identify the specific handoff moment where an organic referral becomes a paid-amplification candidate — not "boost popular posts" in the abstract, but the concrete signal (a referral link crossing a share count, a specific advocate's post outperforming baseline engagement) that should trigger a media buyer to actually spend against it, using organic_referral_signal as the basis for that threshold rather than an arbitrary round number. Specify what content format is worth boosting versus what should stay purely organic — a heartfelt personal testimonial post might convert well organically because it reads as authentic, but the same post reformatted and pushed through paid social distribution can read as inauthentic once an audience recognizes it as an ad, which is a real risk specific to amplifying referral/advocate content rather than brand-made ads. Budget the amplification spend against amplification_budget with a stated stopping condition — a signal that would tell the team to cut spend on this amplification before the whole budget is used, not just a plan for how to spend all of it.

OUTPUT FORMAT
1. Incentive structure check — flagged rebalance if lopsided, or confirmation it's reasonably balanced.
2. The specific organic-to-paid handoff trigger.
3. Content-format guidance — what to amplify as-is, what to reformat first, what should never be paid-boosted.
4. Budget plan with an explicit stopping condition.`,
    variables: [
      {
        name: 'offer_and_incentive',
        description: `What's being referred and what both sides get for it.`,
        example: `Referrer gets a $50 account credit, referee gets 20% off their first order.`,
        required: true,
      },
      {
        name: 'referrer_and_referee_profile',
        description: `Who typically refers and who they tend to refer to.`,
        example: `Existing customers of 6+ months referring friends in similar income brackets, usually via direct message rather than public post.`,
        required: true,
      },
      {
        name: 'organic_referral_signal',
        description: `What's currently observed about how referrals spread organically before any paid support.`,
        example: `Top 5% of referral posts get roughly 4x the engagement of a typical customer post within the first 48 hours.`,
        required: true,
      },
      {
        name: 'amplification_budget',
        description: `How much is available specifically to boost referral/advocate content via paid social.`,
        example: `$3,000/month set aside specifically for boosting top-performing referral posts.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `referral-marketing`,
      `paid-social`,
      `advocate-content`,
      `incentive-design`,
      `budget-planning`,
    ],
    whyItWorks: `Asked generally to design a referral campaign, GPT-5.1 tends to produce a plausible-sounding incentive structure and a generic "boost your best content" instruction for the paid team, because that's the shape most referral-marketing writeups take, without checking whether the incentive is actually balanced between both sides of the referral — a real and common design flaw where a generous referrer reward with a weak referee incentive produces lots of low-quality link-sharing and poor conversion on the receiving end, a failure mode that's invisible unless something explicitly prompts a check for it. Requiring a concrete handoff trigger tied to the organic_referral_signal data, rather than an instruction to "boost popular posts," is what actually makes the brief executable by a media buyer who wasn't part of the strategy conversation — "popular" is not a number a person can act on, while "a post crossing 4x baseline engagement in 48 hours" is a rule they can operationalize without further clarification. The content-format warning about reformatting advocate testimonials for paid distribution addresses a failure specific to referral marketing that doesn't apply to brand-made ads: authenticity is often the entire reason a referral post converts, and audiences are good at recognizing when organic-feeling content has been pushed through paid distribution, at which point the same words that worked organically can read as manipulative rather than genuine — a risk a generic "amplify what works" instruction has no mechanism to catch. Requiring an explicit stopping condition rather than a plan to fully spend the budget counters the default assumption, common in AI-generated media plans, that a budget exists to be spent in full regardless of whether performance holds up throughout the period.`,
    exampleOutput: `Incentive check: referrer gets $50 credit, referee gets 20% off — reasonably balanced, referee incentive is substantial enough to expect real conversion, not just link-sharing for the referrer's benefit. Handoff trigger: boost a referral post once it crosses 4x baseline engagement within 48 hours of posting, matching the organic top-5% pattern already observed. Content guidance: boost the post as-is if it's under 100 words and reads as a direct personal statement; do not reformat it into branded ad creative, since testimonial authenticity is the actual conversion driver here. Stopping condition: pause amplification spend on a given post if cost-per-referral-conversion exceeds 1.5x the organic average for two consecutive weeks.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-14' }],
    changelog: [
      {
        date: '2026-08-14',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'ads-growth-experiment-ad-test-design',
    category: 'ads',
    title: `Design a single ad experiment with a real kill criterion so it stops being "let's just try both and see"`,
    description: `Structures one paid-ad experiment with a stated hypothesis, minimum sample size, and an explicit kill criterion decided in advance, instead of an open-ended A/B test that runs until someone eyeballs the numbers and calls it.`,
    promptText: `Design one ad experiment for the hypothesis below. This is not a general "how to A/B test ads" explainer — it's the specific test plan for this one experiment, with a decision rule set in advance so nobody has to eyeball the numbers later and argue about whether it's done.

HYPOTHESIS BEING TESTED
{{hypothesis}}

WHAT VARIABLE CHANGES BETWEEN VARIANTS
{{variable_changed}}

CURRENT BASELINE METRIC
{{baseline_metric}}

DAILY TRAFFIC OR SPEND AVAILABLE FOR THE TEST
{{available_traffic_or_spend}}

STATE THE HYPOTHESIS AS A PREDICTION, NOT A QUESTION
Rewrite hypothesis, if needed, as a specific falsifiable prediction — "variant B will improve conversion rate by at least X relative to baseline_metric" — rather than an open question like "which one works better," since an open question has no built-in way to ever end the test.

ISOLATE THE VARIABLE
Confirm that variable_changed is the only meaningful difference between variants; if the described variants actually differ in more than one dimension at once (e.g., both headline and image changed together), say so explicitly and note that a positive result won't tell you which change caused it — recommend splitting into two sequential tests instead if that's the case.

SET THE KILL CRITERION BEFORE THE TEST STARTS
Using available_traffic_or_spend, estimate roughly how long it would take to reach a sample size large enough to trust a result at this baseline conversion rate, and state two decision rules set now, before any data comes in: the threshold at which the test is declared a clear win worth rolling out, and — just as important — the threshold or time limit at which it gets killed for being inconclusive or clearly not working, so a mediocre result doesn't get to run forever on hope. Name honestly if available_traffic_or_spend is too low to reach a trustworthy sample size in a reasonable window, rather than proceeding as if any test duration is fine.

OUTPUT FORMAT
1. Falsifiable hypothesis statement.
2. Variable isolation check — confirmed single-variable, or a flag with a recommended split.
3. Rough sample-size/time estimate given available traffic or spend, with an honest call on whether it's sufficient.
4. Win threshold and kill threshold, both set in advance.`,
    variables: [
      {
        name: 'hypothesis',
        description: `What's believed will happen, even if currently phrased loosely.`,
        example: `We think showing a customer's actual name in the headline via dynamic text will improve click-through.`,
        required: true,
      },
      {
        name: 'variable_changed',
        description: `The one thing that's different between the test variants.`,
        example: `Headline personalization (name insertion) vs. static generic headline — everything else in the ad identical.`,
        required: true,
      },
      {
        name: 'baseline_metric',
        description: `The current performance number the test is trying to beat.`,
        example: `Current CTR on the static headline is 1.2%.`,
        required: true,
      },
      {
        name: 'available_traffic_or_spend',
        description: `Roughly how much traffic or budget can realistically go to this test per day.`,
        example: `Around 4,000 impressions per day split across both variants.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `ab-testing`,
      `growth-experiments`,
      `ad-testing`,
      `hypothesis-design`,
      `experiment-design`,
    ],
    whyItWorks: `The most common way ad experiments fail isn't a bad hypothesis, it's the absence of a decision rule set before the data starts arriving — without one, a team watching a test in progress tends to keep it running past the point of usefulness whenever the early numbers look mildly promising, and calls it inconclusive and quietly drops it whenever the numbers look mildly disappointing, which means the actual stopping decision is being made by hope rather than by a rule, and GPT-5.1 asked generally "how do I A/B test this" will explain the concept of statistical significance without ever forcing a team to commit to a specific win and kill threshold in advance. Rewriting an open question into a falsifiable numeric prediction matters because "which one works better" genuinely has no defined endpoint — there is always a plausible argument for letting it run one more day — while "variant B beats baseline by at least X" gives the test a condition that can actually be met or missed. The variable-isolation check catches a specific and common experiment design flaw where two creative changes are bundled into one test because it's more convenient to build one variant than two, producing a result that, even if positive, can't be attributed to either change individually — a flaw invisible unless something is explicitly checking for it rather than accepting the described variants at face value. Estimating sample size against the actual available traffic and being willing to say the answer is "this test can't reach a trustworthy result in a reasonable window" is the honesty check most self-directed ad testing skips entirely — teams routinely launch tests against traffic volumes too small to ever produce a statistically meaningful answer, and continuing anyway just produces a confident-sounding conclusion built on noise.`,
    exampleOutput: `Falsifiable hypothesis: dynamic-name-insertion headline will improve CTR to at least 1.5% (a relative lift over the 1.2% baseline), not merely "perform better." Variable isolation: confirmed single-variable — only the headline personalization differs, rest of the ad is identical. Sample estimate: at ~2,000 impressions/day per variant, reaching a trustworthy sample at this baseline CTR will take roughly 2-3 weeks; this is workable but tight, plan for the full window rather than checking early. Win threshold: roll out personalization if CTR clears 1.5% with the full sample reached. Kill threshold: stop the test at day 21 regardless of result if CTR hasn't cleared 1.35%, since a smaller lift than that isn't worth the added complexity of dynamic personalization at scale.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-11' }],
    changelog: [
      {
        date: '2026-08-11',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
] as const
