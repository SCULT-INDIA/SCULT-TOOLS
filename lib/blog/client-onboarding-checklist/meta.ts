import { resolveServiceLink } from '@/lib/tools/service-links'
import type { BlogPost } from '../types'

const SLUG = "client-onboarding-checklist"
const SERVICE_CUSTOM_SOFTWARE = resolveServiceLink("custom-software", SLUG)

/**
 * Generated from content-engine/05-drafts/article_041.md by
 * content-engine/generate-meta-files.js — every claim, source, and link was
 * written and fact-checked by the content-engine research/production
 * pipeline (see content-engine/06-verification for the per-article report),
 * not invented at conversion time.
 */
export const meta: BlogPost = {
  slug: SLUG,
  pillar: "playbook",
  title: "Client Onboarding Checklist: The 17-Step Process Real Agencies Use",
  h1: "Client Onboarding Checklist: What Actually Belongs on It (17-Step Version)",
  targetKeyword: "client onboarding checklist",
  description: "A step-by-step client onboarding checklist for agencies, freelancers, and service firms — what to include, common mistakes, and how to measure if it's working.",
  dek: "A real client onboarding checklist has three phases — pre-kickoff (contract, questionnaire, secure credential handoff), kickoff (the actual kickoff meeting, internal alignment, timeline sign-off), and early delivery (quick wins, QA checkpoints, health scoring, and a satisfaction survey). Skipping any phase is one of the most commonly cited causes of client churn in service businesses, and the full cycle usually takes three to six months before it runs smoothly on its own.",
  sections: [
    {
      heading: "What a client onboarding checklist actually is",
      body: [
        ["Client onboarding is the structured process of turning a signed client into an active, delivering-value client. It's the work of setting expectations, collecting the information and access you need, introducing the team, and building the first layer of trust — all before the \"real\" work visibly starts (", { text: "Bonsai", href: "https://www.hellobonsai.com/blog/client-onboarding-checklist", external: true }, ")."],
        ["It matters more than most service businesses treat it: Automattic's agency guide states that poor onboarding is \"the third most common reason for client or customer churn\" (", { text: "Automattic for Agencies", href: "https://automattic.com/for-agencies/blog/agency-client-onboarding/", external: true }, "). That statistic alone should reframe onboarding from an administrative afterthought into a retention-critical process with its own owner, its own checklist, and its own success metrics."],
        ["Bonsai's guide adds a timeline reality check that's worth setting expectations around internally: onboarding a client to the point where the relationship runs efficiently and predictably usually takes ", { text: "three to six months", bold: true }, ", not the first week (", { text: "Bonsai", href: "https://www.hellobonsai.com/blog/client-onboarding-checklist", external: true }, "). The checklist below covers the first 30 days in detail, because that's where the process either works or breaks — but plan your health-score and check-in cadence assuming the full ramp takes a quarter or more."],
      ],
    },
    {
      heading: "The 17-step checklist, phase by phase",
      body: [
        ["Automattic's agency-focused guide lays out one of the most detailed public checklists available, and it maps cleanly onto three phases most service businesses actually run through (", { text: "Automattic for Agencies", href: "https://automattic.com/for-agencies/blog/agency-client-onboarding/", external: true }, "):"],
        [{ text: "Phase 1 — Before the kickoff call", bold: true }, " ", "1. ", { text: "Client research", bold: true }, " — before the first real working session, know the client's market, competitors, and public-facing brand voice so you're not asking questions you could have answered yourself."],
        ["2. ", { text: "Welcome package", bold: true }, " — a short document or page confirming scope, timeline, and who's on the team, sent immediately after the contract is signed."],
        ["3. ", { text: "Onboarding questionnaire", bold: true }, " — sent before kickoff so the meeting is spent discussing answers, not collecting them (see the dedicated section below)."],
        ["4. ", { text: "Secure credential collection", bold: true }, " — access to the client's accounts, hosting, ad platforms, or CMS, gathered through a password manager rather than email (see below)."],
        ["5. ", { text: "Assign a dedicated onboarding specialist or point of contact", bold: true }, " — one named person the client can reach, rather than a shared inbox."],
        [{ text: "Phase 2 — Kickoff and alignment", bold: true }, " ", "6. ", { text: "Kickoff meeting", bold: true }, " — the first live session where goals, scope, and working norms are confirmed out loud, not just in a contract."],
        ["7. ", { text: "Internal team alignment", bold: true }, " — everyone touching the account has read the same brief and heard the same client priorities; sales and delivery should never be discovering the scope differently."],
        ["8. ", { text: "Timeline and milestone confirmation", bold: true }, " — dates the client has agreed to and can hold you to, and vice versa."],
        ["9. ", { text: "Reporting cadence agreement", bold: true }, " — how often, in what format, and through what channel the client will hear from you."],
        ["10. ", { text: "Client portal setup", bold: true }, " — a single place for files, invoices, and status, instead of files scattered across email threads."],
        ["11. ", { text: "Communication channel confirmation", bold: true }, " — Slack, email, or a shared tool, decided once instead of re-negotiated every week."],
        [{ text: "Phase 3 — Early delivery and proof", bold: true }, " ", "12. ", { text: "Sign-off on early deliverables", bold: true }, " — a formal, documented \"yes, this is right\" at each milestone, not an assumed one."],
        ["13. ", { text: "Quick wins", bold: true }, " — something visibly delivered inside the first two to four weeks, so the client has early proof the engagement is working."],
        ["14. ", { text: "QA checks", bold: true }, " — an internal review step before anything client-facing ships."],
        ["15. ", { text: "Regular check-ins", bold: true }, " — scheduled, not reactive — a recurring slot on the calendar rather than a call booked only when something's wrong."],
        ["16. ", { text: "Client health scoring", bold: true }, " — a running internal signal for whether the account is trending toward renewal or toward churn (detailed below)."],
        ["17. ", { text: "Post-onboarding satisfaction survey", bold: true }, " — sent roughly one to two weeks after onboarding formally ends, while the experience is still fresh."],
        ["That's the most granular published version of the checklist. Bonsai's and LeadFuze's versions compress it into fewer named phases but cover the same ground — questionnaire, kickoff, milestone tracking, and a feedback loop (", { text: "Bonsai", href: "https://www.hellobonsai.com/blog/client-onboarding-checklist", external: true }, "; ", { text: "LeadFuze", href: "https://www.leadfuze.com/client-onboarding-process/", external: true }, ") — and newer 2026 guides from Rocketlane and CheckFlow add the same core spine: signed contract, completed intake form, kickoff scheduled, access shared, project tool configured, communication cadence agreed, and a 30-day check-in on the calendar (", { text: "Rocketlane", href: "https://www.rocketlane.com/blogs/client-onboarding", external: true }, ")."],
      ],
    },
    {
      heading: "What the onboarding questionnaire should ask",
      body: [
        ["The questionnaire is the single highest-leverage document in the whole checklist, because everything downstream — the kickoff conversation, the timeline, the reporting cadence — depends on getting real answers before you start guessing. Automattic's guide recommends the questionnaire cover (", { text: "Automattic for Agencies", href: "https://automattic.com/for-agencies/blog/agency-client-onboarding/", external: true }, "):"],
        ["– ", { text: "Target audience", bold: true }, " — who the client is actually trying to reach, in their own words, not your assumption of who they're trying to reach."],
        ["– ", { text: "Brand voice", bold: true }, " — how they want to sound, with examples of what they like and dislike."],
        ["– ", { text: "Business goals", bold: true }, " — the outcome behind the engagement, not just the deliverable."],
        ["– ", { text: "Internal staff capabilities", bold: true }, " — what the client's own team can and can't do, so you know where the real gaps are."],
        ["– ", { text: "KPIs", bold: true }, " — the specific numbers that will define success for the client, stated up front rather than negotiated after delivery."],
        ["The reason this matters structurally: without documented answers to these five things, \"scope\" quietly becomes whatever the loudest voice in the last meeting said it was. A written questionnaire is the difference between a defensible scope and an ambiguous one."],
      ],
    },
    {
      heading: "How to collect client credentials securely",
      body: [
        ["Every service engagement eventually needs access to something — a CMS login, an ad account, a hosting panel, a domain registrar. The wrong way to handle this is well-documented and still extremely common: pasting a password into an email or a Slack message, where it sits in plaintext indefinitely."],
        ["Automattic's guide recommends using a password manager — naming ", { text: "LastPass", bold: true }, " and ", { text: "1Password", bold: true }, " specifically — to share and store client credentials instead (", { text: "Automattic for Agencies", href: "https://automattic.com/for-agencies/blog/agency-client-onboarding/", external: true }, "). The mechanism matters: a password manager's sharing feature transmits the credential encrypted and lets you revoke access later without asking the client to change their password. An email thread gives you neither."],
        ["Practically, this step belongs in the pre-kickoff phase, tied to a specific person (the onboarding specialist from step 5), and logged somewhere so that if that person leaves the agency, credential access doesn't leave with them."],
      ],
    },
    {
      heading: "Vertical differences: agencies, MSPs, financial advisors, legal",
      body: [
        ["The 17-step spine above is written from a creative/marketing-agency perspective, but the same evidence base shows the checklist shifts weight depending on the vertical:"],
        ["– ", { text: "MSPs (managed service providers)", bold: true }, " — ManageEngine's and ConnectWise's onboarding guides put far more weight on access and security scoping up front, and typically start with an RFP-style discovery process before any technical onboarding begins, because the \"product\" is direct access to the client's infrastructure (", { text: "ManageEngine", href: "https://www.manageengine.com/products/service-desk-msp/msp-onboarding-checklist.html", external: true }, "; ", { text: "ConnectWise", href: "https://www.connectwise.com/blog/msp-onboarding-checklist", external: true }, ")."],
        ["– ", { text: "Financial advisors", bold: true }, " — SmartAsset's checklist for financial advisors weights compliance documentation and regulatory disclosures far more heavily than a marketing agency's checklist would, since the intake itself carries fiduciary and legal obligations (", { text: "SmartAsset", href: "https://smartasset.com/advisor-resources/client-onboarding-checklist", external: true }, ")."],
        ["– ", { text: "Creative and marketing agencies", bold: true }, " — the Automattic/Bonsai model above, weighted toward the kickoff meeting and the brand/audience questionnaire."],
        ["– ", { text: "Legal and accounting", bold: true }, " — not directly sourced in this research, but the general pattern (compliance-heavy verticals front-load documentation) holds; if this applies to you, treat SmartAsset's model as the closer analogue than the marketing-agency one."],
        ["The takeaway: don't copy a generic \"client onboarding checklist\" template wholesale. Copy the phase structure (pre-kickoff → kickoff → early delivery), then weight each phase according to what actually creates risk in your specific business — security and access for MSPs, compliance for regulated advisors, and scope/expectations for agencies."],
      ],
    },
    {
      heading: "Practical examples",
      body: [
        [{ text: "Illustrative example — a 3-person marketing agency onboarding a new retainer client.", bold: true }, " (This is a hypothetical composite built from the checklist above, not a real named case study — labeled clearly as such.) Day 1: contract signed, welcome package and questionnaire sent same day. Day 3: questionnaire returned, credentials shared via 1Password. Day 5: kickoff call — goals, KPIs, and a 90-day timeline confirmed out loud, notes sent within 24 hours. Day 10: reporting cadence (bi-weekly) and communication channel (Slack Connect) locked in. Day 20: first quick win delivered — a completed audit or first campaign draft — giving the client something tangible before the invoice for month two arrives. Day 30: first formal check-in, health score logged internally. Day 45: satisfaction survey sent. This is the shape the 17-step checklist produces when compressed into a real calendar."],
        [{ text: "Real, sourced example — the \"onboarding as prevention\" case.", bold: true }, " A practitioner account published on Bullenweg's blog reframes so-called \"nightmare clients\" as, overwhelmingly, an onboarding failure rather than a client-quality failure: ambiguous success criteria, fuzzy scope, and unclear communication channels are what actually produce the relationship that later gets blamed on \"a difficult client\" (", { text: "Bullenweg", href: "https://bullenweg.com/client-onboarding-the-process-that-prevents-nightmares-later/", external: true }, "). The piece's core diagnostic point is that the warning signs show up early and quietly — not as a formal complaint, but as sales and delivery describing the engagement differently to each other, invoices the client seems confused by, and a client who goes quiet rather than pushes back. Each of those is traceable to a specific missing step in the checklist above (no written scope, no aligned internal team, no confirmed reporting cadence)."],
      ],
    },
    {
      heading: "Data and evidence",
      body: [
        ["– Poor onboarding is \"the third most common reason for client or customer churn\" (", { text: "Automattic for Agencies", href: "https://automattic.com/for-agencies/blog/agency-client-onboarding/", external: true }, ")."],
        ["– A full onboarding cycle to steady-state efficiency typically takes ", { text: "three to six months", bold: true }, " (", { text: "Bonsai", href: "https://www.hellobonsai.com/blog/client-onboarding-checklist", external: true }, ")."],
        ["– The referral ask has a specific, evidence-backed timing recommendation: around ", { text: "day 30", bold: true }, ", once the client has had time to see initial value — not at kickoff, and not left indefinite (", { text: "LeadFuze", href: "https://www.leadfuze.com/client-onboarding-process/", external: true }, ")."],
        ["– Satisfaction surveys are recommended ", { text: "one to two weeks", bold: true }, " after onboarding formally wraps, timed to catch the experience while it's still fresh rather than months later (", { text: "Automattic for Agencies", href: "https://automattic.com/for-agencies/blog/agency-client-onboarding/", external: true }, "; ", { text: "LeadFuze", href: "https://www.leadfuze.com/client-onboarding-process/", external: true }, ")."],
        ["– On exact conversion or retention lift from a formal checklist versus none: ", { text: "evidence not sufficiently verified.", bold: true }, " Multiple 2026 vendor guides (Rocketlane, Zoomforth, CheckFlow) assert that a checklist \"creates consistency\" and reduces variance across account owners, but none of the sources reviewed published a controlled before/after retention number for adopting one — treat the churn-prevention logic as directionally well-supported, not independently quantified."],
      ],
    },
    {
      heading: "Comparisons",
      body: [
        [{ text: "Software vs. spreadsheet checklist.", bold: true }, " A spreadsheet or shared doc costs nothing and is fast to start with, but it has no automation (no auto-reminders when a step is overdue), no client-facing portal, and no audit trail of who signed off on what. Dedicated onboarding/client-management software (Bonsai, HoneyBook, Dubsado) adds contract e-signing, invoicing, a client-facing portal, and automated sequencing, at the cost of a monthly subscription and a setup investment. The right choice depends on client volume: a spreadsheet is fine below roughly 5-10 concurrent onboardings; past that, the coordination overhead of a spreadsheet becomes its own risk."],
        [{ text: "Bonsai vs. HoneyBook vs. Dubsado.", bold: true }, " All three are aimed at freelancers and small agencies and bundle contracts, invoicing, and client communication into one workspace; Bonsai's own content positions itself specifically around the onboarding checklist and workflow automation angle (", { text: "Bonsai", href: "https://www.hellobonsai.com/blog/client-onboarding-checklist", external: true }, "). This research did not independently verify feature-by-feature pricing or capability differences between the three platforms — treat any specific claim about which is \"best\" for a given use case as ", { text: "evidence not sufficiently verified", bold: true }, " without checking current vendor pricing pages directly, since SaaS pricing and feature sets change frequently."],
        [{ text: "Generalist tools vs. purpose-built onboarding tools.", bold: true }, " CRM tools like Salesforce, task boards like Trello, and messaging like Slack all show up repeatedly in real onboarding stacks (", { text: "Bonsai", href: "https://www.hellobonsai.com/blog/client-onboarding-checklist", external: true }, "; ", { text: "Automattic for Agencies", href: "https://automattic.com/for-agencies/blog/agency-client-onboarding/", external: true }, ") — but they're general-purpose infrastructure, not a checklist. A purpose-built client portal adds the missing piece: a single link the client can open to see contracts, invoices, and status without asking you for it."],
      ],
    },
    {
      heading: "Real-world use cases",
      body: [
        ["– ", { text: "A freelance designer's first retainer client", bold: true }, " — the questionnaire and kickoff-meeting steps matter most here, because a solo freelancer has no internal team to misalign, but is at the highest risk of scope creep without a written scope document."],
        ["– ", { text: "A 15-person MSP onboarding a new SMB client", bold: true }, " — access/security collection and an RFP-style discovery process dominate, per ManageEngine's and ConnectWise's guides, because the engagement is fundamentally about being granted infrastructure access (", { text: "ManageEngine", href: "https://www.manageengine.com/products/service-desk-msp/msp-onboarding-checklist.html", external: true }, "; ", { text: "ConnectWise", href: "https://www.connectwise.com/blog/msp-onboarding-checklist", external: true }, ")."],
        ["– ", { text: "A financial advisory practice onboarding a new household", bold: true }, " — compliance documentation and disclosures front-load the process, and the \"quick win\" concept from the marketing-agency checklist doesn't map cleanly, since the regulatory intake itself is the milestone (", { text: "SmartAsset", href: "https://smartasset.com/advisor-resources/client-onboarding-checklist", external: true }, ")."],
        ["– ", { text: "A growing agency standardizing across account managers", bold: true }, " — the health-score and satisfaction-survey steps matter most here, because the actual failure mode at this size isn't a bad first meeting, it's inconsistent quality across whichever account manager happens to own a given client."],
      ],
    },
    {
      heading: "Common mistakes",
      body: [
        ["– ", { text: "Skipping the written questionnaire and going straight to a kickoff call.", bold: true }, " Without documented answers on audience, goals, and KPIs, the kickoff becomes an unstructured conversation that different attendees remember differently."],
        ["– ", { text: "Sharing credentials over email or chat.", bold: true }, " Creates a permanent, unencrypted record of a client's login and makes revoking access on offboarding harder than it should be."],
        ["– ", { text: "No internal alignment step before kickoff.", bold: true }, " Sales and delivery describing the engagement differently to the client is one of the concrete early warning signs that onboarding — not the client — is the actual problem (", { text: "Bullenweg", href: "https://bullenweg.com/client-onboarding-the-process-that-prevents-nightmares-later/", external: true }, ")."],
        ["– ", { text: "No sign-off checkpoints.", bold: true }, " Assuming approval instead of getting a documented \"yes\" invites disputes later about whether something was actually agreed to."],
        ["– ", { text: "Treating onboarding as a one-week sprint.", bold: true }, " Since the full cycle runs three to six months, judging success or failure after the first two weeks misreads the timeline entirely (", { text: "Bonsai", href: "https://www.hellobonsai.com/blog/client-onboarding-checklist", external: true }, ")."],
        ["– ", { text: "No feedback loop.", bold: true }, " Without a satisfaction survey and a health score, the first real signal of a problem is the client leaving — by which point it's too late to fix."],
        ["– ", { text: "One person owning every step with no documentation.", bold: true }, " If the onboarding specialist is out sick or leaves, an undocumented process leaves the client relationship stalled."],
      ],
    },
    {
      heading: "Best practices",
      body: [
        ["– Send the welcome package and questionnaire the same day the contract is signed — momentum matters, and delay reads as disorganization before the engagement has even started."],
        ["– Assign one named point of contact, not a shared inbox, from day one."],
        ["– Use a password manager for every credential handoff, without exception."],
        ["– Put the reporting cadence and communication channel in writing during kickoff, not left implicit."],
        ["– Build in a deliberate \"quick win\" inside the first two to four weeks — something the client can point to as proof the engagement is already working."],
        ["– Schedule the day-30 check-in and referral conversation before onboarding starts, not reactively after."],
        ["– Track a simple health score (communication frequency, milestone adherence, sentiment in check-ins) from week one, not just after something goes wrong."],
        ["– Review the checklist itself quarterly and remove steps that don't add value while adding ones that address recurring problems."],
        ["– Make every task on the checklist have exactly one named owner — a task with two owners has, in practice, none."],
      ],
    },
    {
      heading: "Key takeaways",
      body: [
        ["– A real client onboarding checklist runs in three phases — pre-kickoff, kickoff/alignment, and early delivery — and the full cycle to steady-state typically takes three to six months, not one week."],
        ["– Poor onboarding is cited as the third most common reason clients churn, making the checklist a retention tool, not just an admin process."],
        ["– The onboarding questionnaire (audience, brand voice, goals, internal capabilities, KPIs) is the single highest-leverage document — most downstream scope disputes trace back to skipping it."],
        ["– Always collect client credentials through a password manager, never email or chat."],
        ["– The checklist's weighting should shift by vertical: MSPs front-load access/security, financial advisors front-load compliance documentation, agencies front-load the brand questionnaire and kickoff."],
        ["– Build in a deliberate quick win inside the first 2-4 weeks and a day-30 check-in with a referral ask — both are evidence-backed timing recommendations, not arbitrary."],
      ],
    },
    {
      heading: "Relevant tools.scult.in resources",
      body: [
        ["Once a client is onboarded and work starts, billing needs to be just as clean as the intake process — the ", { text: "Invoice Generator", href: "/business/invoice-generator" }, " creates a professional invoice with GST/VAT handling and multi-currency support directly in your browser, with nothing uploaded, so you can send the first invoice the same day you deliver that early quick win. For prompt-based help drafting welcome packages, onboarding questionnaires, or kickoff-meeting agendas, the ", { text: "Business Operations prompt library", href: "/prompts/business-ops" }, " has ready-to-adapt starting points."],
        ["If you're past the point where a shared doc can track your onboarding pipeline reliably — several concurrent clients, multiple people touching each account, or a checklist that keeps slipping — that's usually a signal worth a conversation about a custom-built client intake or portal workflow rather than another off-the-shelf subscription; ", { text: "SCULT's custom software team", href: SERVICE_CUSTOM_SOFTWARE.href, external: true }, " builds exactly that kind of internal tooling."],
      ],
    },
  ],
  faq: [
    {
      question: "What is a client onboarding checklist?",
      answer: ["A structured, repeatable list of steps a service business follows from the moment a contract is signed until the client relationship is running smoothly and predictably (", { text: "Bonsai", href: "https://www.hellobonsai.com/blog/client-onboarding-checklist", external: true }, ")."],
    },
    {
      question: "Why do I need one if I already have a contract?",
      answer: ["A contract defines scope and price; a checklist defines the operational steps — questionnaire, access, kickoff, reporting cadence — that actually determine whether the engagement feels organized from the client's side."],
    },
    {
      question: "Who should own the onboarding checklist inside a small team?",
      answer: ["A single named person per client (an \"onboarding specialist\" or account lead), even in a two-person business, so accountability doesn't diffuse."],
    },
    {
      question: "How long does client onboarding usually take?",
      answer: ["The full cycle to steady-state efficiency runs three to six months, though the intensive first-30-days phase is where most of the checklist activity happens (", { text: "Bonsai", href: "https://www.hellobonsai.com/blog/client-onboarding-checklist", external: true }, ")."],
    },
    {
      question: "Is onboarding the same as a kickoff meeting?",
      answer: ["No — the kickoff meeting is one step inside a larger onboarding process that starts before the meeting (questionnaire, credential collection) and continues after it (check-ins, health scoring)."],
    },
    {
      question: "Do freelancers need a formal onboarding checklist, or is that just for agencies?",
      answer: ["Freelancers benefit from the same core steps — questionnaire, scope confirmation, secure access, a defined communication channel — because scope creep and unclear expectations hit solo operators even harder than teams."],
    },
    {
      question: "What's the very first step after a contract is signed?",
      answer: ["Sending the welcome package and onboarding questionnaire, ideally the same day."],
    },
    {
      question: "What's a \"welcome package\"?",
      answer: ["A short document or page confirming scope, timeline, and the team involved, sent immediately after signing to set the tone before the first live call."],
    },
    {
      question: "Do I need special software to run a client onboarding checklist?",
      answer: ["No — a shared doc or spreadsheet works at low volume; dedicated software becomes worth it as concurrent onboardings scale up."],
    },
    {
      question: "What happens if I skip onboarding and just start the work?",
      answer: ["You lose the structured record of what was agreed, increasing the risk of scope disputes and reducing the client's early confidence in the engagement."],
    },
    {
      question: "Why is client onboarding tied to churn specifically?",
      answer: ["Automattic's agency guide states poor onboarding is the third most common reason clients churn — it's an early, high-leverage point where trust is either built or eroded (", { text: "Automattic for Agencies", href: "https://automattic.com/for-agencies/blog/agency-client-onboarding/", external: true }, ")."],
    },
    {
      question: "What are the three broad phases of onboarding?",
      answer: ["Pre-kickoff (contract, questionnaire, access), kickoff and alignment (the meeting, timeline, reporting cadence), and early delivery (quick wins, QA, health scoring, survey)."],
    },
    {
      question: "What should the onboarding questionnaire cover?",
      answer: ["Target audience, brand voice, business goals, internal staff capabilities, and KPIs (", { text: "Automattic for Agencies", href: "https://automattic.com/for-agencies/blog/agency-client-onboarding/", external: true }, ")."],
    },
    {
      question: "What is a \"client health score\"?",
      answer: ["A composite internal metric tracking satisfaction signals, communication frequency, and engagement indicators used to flag at-risk accounts before they churn (", { text: "Automattic for Agencies", href: "https://automattic.com/for-agencies/blog/agency-client-onboarding/", external: true }, ")."],
    },
    {
      question: "What is customer journey mapping in an onboarding context?",
      answer: ["Identifying the critical milestones from first purchase to the client's \"aha\" moment, then setting communication frequency deliberately around those milestones rather than at a flat constant cadence (", { text: "LeadFuze", href: "https://www.leadfuze.com/client-onboarding-process/", external: true }, ")."],
    },
    {
      question: "When should I ask an onboarded client for a referral?",
      answer: ["Around day 30, once they've had time to see initial value from the engagement (", { text: "LeadFuze", href: "https://www.leadfuze.com/client-onboarding-process/", external: true }, ")."],
    },
    {
      question: "Does the checklist differ across industries?",
      answer: ["Yes — MSPs weight access/security, financial advisors weight compliance documentation, and creative agencies weight the kickoff and brand questionnaire (", { text: "ManageEngine", href: "https://www.manageengine.com/products/service-desk-msp/msp-onboarding-checklist.html", external: true }, "; ", { text: "SmartAsset", href: "https://smartasset.com/advisor-resources/client-onboarding-checklist", external: true }, ")."],
    },
    {
      question: "What's an early sign that onboarding — not the client — is the actual problem?",
      answer: ["Sales and delivery describing the engagement differently, confusing invoices, and a client who goes quiet instead of complaining (", { text: "Bullenweg", href: "https://bullenweg.com/client-onboarding-the-process-that-prevents-nightmares-later/", external: true }, ")."],
    },
    {
      question: "What's the difference between onboarding and account management?",
      answer: ["Onboarding is the bounded initial ramp; account management is the ongoing relationship that follows once onboarding's milestones are complete."],
    },
    {
      question: "Should onboarding steps be documented per client or standardized once?",
      answer: ["Standardized once as a template, then lightly customized per client — full customization per client is what makes onboarding inconsistent across a team in the first place."],
    },
    {
      question: "How do I create a client onboarding checklist from scratch?",
      answer: ["Start from the three-phase structure (pre-kickoff, kickoff, early delivery), list the specific steps your business needs in each phase, assign one owner per step, and put dates or trigger events against each."],
    },
    {
      question: "How do I onboard a new client step by step?",
      answer: ["Send the welcome package and questionnaire on day 1, collect credentials securely, hold the kickoff, confirm the timeline and reporting cadence, deliver a quick win inside 2-4 weeks, and run the first formal check-in around day 30."],
    },
    {
      question: "How do I collect client logins securely?",
      answer: ["Use a password manager's sharing feature (e.g., 1Password or LastPass) rather than email or chat, tied to a named point of contact (", { text: "Automattic for Agencies", href: "https://automattic.com/for-agencies/blog/agency-client-onboarding/", external: true }, ")."],
    },
    {
      question: "How do I run a good client kickoff meeting?",
      answer: ["Confirm goals, scope, and KPIs out loud even though they're written in the questionnaire, align on the reporting cadence and communication channel, and send written notes within 24 hours."],
    },
    {
      question: "How do I write an onboarding questionnaire?",
      answer: ["Ask about target audience, brand voice, business goals, internal capabilities, and KPIs, phrased so answers can be acted on directly rather than needing further interpretation."],
    },
    {
      question: "How often should I check in with a newly onboarded client?",
      answer: ["On a fixed, scheduled cadence agreed during kickoff — the specific frequency depends on engagement size, but \"reactive only\" is the wrong default."],
    },
    {
      question: "How do I build a client health score without dedicated software?",
      answer: ["Track three to five simple signals manually — response time, milestone adherence, and sentiment in check-ins — and review them on a fixed schedule."],
    },
    {
      question: "How do I know when onboarding is officially \"done\"?",
      answer: ["When the client has moved to the standard reporting cadence, hit the first agreed milestone, and completed the satisfaction survey."],
    },
    {
      question: "How do I structure the first 30 days concretely?",
      answer: ["Day 1: contract and questionnaire; days 3-5: access and kickoff; day 10: cadence locked in; day 20: quick win delivered; day 30: check-in and survey."],
    },
    {
      question: "How do I hand off an onboarded client to ongoing account management?",
      answer: ["With a documented record — questionnaire answers, kickoff notes, agreed cadence — so the next owner isn't starting from zero."],
    },
    {
      question: "How should onboarding differ for an enterprise client versus a small business client?",
      answer: ["Enterprise onboarding typically needs more internal stakeholder alignment (procurement, legal, multiple approvers) before the same core steps apply, stretching the pre-kickoff phase considerably."],
    },
    {
      question: "How do I onboard multiple clients at once without the checklist breaking down?",
      answer: ["This is precisely where a spreadsheet stops scaling and dedicated onboarding software's automation (auto-reminders, templated sequences) starts paying for itself."],
    },
    {
      question: "Can onboarding steps be partially automated?",
      answer: ["Yes — welcome packages, questionnaires, and reminder sequences are the easiest to template and automate; the kickoff call and sign-off conversations are the hardest to automate meaningfully."],
    },
    {
      question: "How do I measure onboarding ROI?",
      answer: ["Compare churn rates and time-to-first-value between clients who went through the full checklist versus those who didn't — evidence not sufficiently verified as a published benchmark, but directly trackable internally."],
    },
    {
      question: "Should onboarding differ for a one-time project versus a recurring retainer?",
      answer: ["Yes — a one-time project's \"quick win\" step effectively becomes the delivery itself, while a retainer needs the ongoing cadence and health-score steps that a one-off project doesn't."],
    },
    {
      question: "Bonsai vs. HoneyBook vs. Dubsado for onboarding — which is best?",
      answer: ["All three bundle contracts, invoicing, and client communication for freelancers/small agencies; specific feature and pricing comparisons were not independently verified in this research — check current vendor pages directly."],
    },
    {
      question: "Client onboarding software vs. a spreadsheet checklist — which should I use?",
      answer: ["A spreadsheet is sufficient below roughly 5-10 concurrent onboardings; past that, the lack of automation and audit trail in a spreadsheet becomes its own operational risk."],
    },
    {
      question: "Salesforce vs. a dedicated client portal for onboarding?",
      answer: ["Salesforce (or any general CRM) tracks the sales-to-delivery handoff well but isn't client-facing; a dedicated portal gives the client a single place to see status, which a CRM generally doesn't."],
    },
    {
      question: "Automattic's 17-step model vs. Bonsai's model — what's the real difference?",
      answer: ["Automattic's is more granular and explicitly names the health-score and post-onboarding survey steps; Bonsai's covers the same ground in fewer named phases — they're not competing frameworks, just different levels of detail on the same process."],
    },
    {
      question: "MSP onboarding vs. marketing-agency onboarding — how different are they really?",
      answer: ["Structurally similar (pre-kickoff, kickoff, delivery) but weighted very differently: MSPs front-load access/security scoping, agencies front-load the brand/audience questionnaire."],
    },
    {
      question: "My onboarding keeps causing scope creep — what's missing?",
      answer: ["Almost always a missing or unenforced written scope document plus no formal sign-off checkpoints at each milestone (", { text: "Bullenweg", href: "https://bullenweg.com/client-onboarding-the-process-that-prevents-nightmares-later/", external: true }, ")."],
    },
    {
      question: "A new client already seems difficult before we've even started — is that a bad sign?",
      answer: ["Not necessarily about the client — check whether sales and delivery are describing the engagement the same way internally first, since that mismatch is a more common root cause than client difficulty (", { text: "Bullenweg", href: "https://bullenweg.com/client-onboarding-the-process-that-prevents-nightmares-later/", external: true }, ")."],
    },
    {
      question: "A client has gone quiet since kickoff — what does that usually mean?",
      answer: ["Per the practitioner account cited above, a client going quiet rather than complaining is flagged as a warning sign of onboarding failure, not client disengagement — check whether the reporting cadence and communication channel were actually confirmed and are being honored."],
    },
    {
      question: "I never collected proper credentials and now access is a mess — how do I fix it retroactively?",
      answer: ["Move everything into a password manager now, document what's been granted, and treat it as a one-time cleanup rather than repeating the mistake with the next client."],
    },
    {
      question: "My checklist exists but nobody follows it consistently — why?",
      answer: ["Usually because no single step has one clear owner — a checklist with shared or unclear ownership degrades into \"someone will probably do it.\""],
    },
    {
      question: "Should I buy onboarding software or build my own checklist in a doc?",
      answer: ["Buy dedicated software once concurrent onboarding volume makes manual tracking error-prone; below that, a well-maintained doc or spreadsheet is genuinely sufficient."],
    },
    {
      question: "Is Bonsai, HoneyBook, or Dubsado worth it for a solo freelancer?",
      answer: ["These platforms are built specifically for the freelancer/small-agency segment and bundle contracts, invoicing, and onboarding tracking — but whether the subscription cost is worth it depends on client volume and whether you're currently losing time to manual admin; not independently benchmarked in this research."],
    },
    {
      question: "Do I need a CRM like Salesforce for onboarding, or is that overkill for a small business?",
      answer: ["Overkill for most solo operators and small agencies; a CRM earns its cost once you have enough concurrent clients that a spreadsheet can't reliably track handoffs."],
    },
    {
      question: "Is it worth hiring a dedicated onboarding specialist role as we grow?",
      answer: ["The evidence above (a named point of contact, one step-owner per task) supports having a clear owner — whether that's a dedicated hire or a role folded into an existing account manager depends on volume and budget."],
    },
    {
      question: "What's the minimum viable onboarding checklist if I'm just starting out?",
      answer: ["Contract signed, questionnaire sent and answered, credentials shared via a password manager, one kickoff call, and one 30-day check-in — the five steps most likely to prevent the most common failure modes described above."],
    },
  ],
  sources: [
    "https://www.hellobonsai.com/blog/client-onboarding-checklist",
    "https://automattic.com/for-agencies/blog/agency-client-onboarding/",
    "https://bullenweg.com/client-onboarding-the-process-that-prevents-nightmares-later/",
    "https://www.leadfuze.com/client-onboarding-process/",
    "https://www.manageengine.com/products/service-desk-msp/msp-onboarding-checklist.html",
    "https://smartasset.com/advisor-resources/client-onboarding-checklist",
    "https://www.connectwise.com/blog/msp-onboarding-checklist",
    "https://www.rocketlane.com/blogs/client-onboarding",
    "https://www.zoomforth.com/blog/client-onboarding-best-practices/",
    "https://checkflow.io/blog/client-onboarding-checklist",
  ],
  relatedTools: ["invoice-generator"],
  relatedPrompts: [],
  serviceTarget: "custom-software",
  updatedAt: "2026-08-21",
  readingMinutes: 19,
}
