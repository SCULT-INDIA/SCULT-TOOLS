import { resolveServiceLink } from '@/lib/tools/service-links'
import type { BlogPost } from '../types'

const SLUG = "design-qa-checklist-before-launch"
const SERVICE_WEB_DEVELOPMENT = resolveServiceLink("web-development", SLUG)

/**
 * Generated from content-engine/05-drafts/article_090.md by
 * content-engine/generate-meta-files.js — every claim, source, and link was
 * written and fact-checked by the content-engine research/production
 * pipeline (see content-engine/06-verification for the per-article report),
 * not invented at conversion time.
 */
export const meta: BlogPost = {
  slug: SLUG,
  pillar: "playbook",
  title: "The Design QA Checklist Small Teams Use Before Launch",
  h1: "The design QA checklist small teams use before launch",
  targetKeyword: "design qa checklist before launch",
  description: "What design QA actually is, when it should start, and the practical pre-launch checklist small teams without a dedicated QA function use.",
  dek: "Design QA is the cross-verification pass where a designer checks that the built product actually matches the intended design — visual consistency, spacing, and interaction behavior — distinct from functional bug testing. It should start as soon as functional prototypes exist, not as a last-minute pass before launch, and the practical checklist covers visual consistency across pages, responsive behavior across devices, no leftover placeholder content, working forms and links, accessibility compliance, and the non-visual technical basics — staging environment, domain, SSL, and analytics setup.",
  sections: [
    {
      heading: "What design QA actually is (and isn't)",
      body: [
        ["Galaxy Weblinks' guidance on why design QA should be a non-negotiable part of the process defines it specifically: a cross-verification process, done by a designer, that checks whether the built product matches the intended design — visual consistency, spacing, and interaction behavior — as distinct from functional or bug testing, which checks whether the product *works* rather than whether it *looks and feels* right (", { text: "Galaxy Weblinks", href: "https://www.galaxyweblinks.com/blog/why-design-qa-should-be-a-non-negotiable-part-of-your-process", external: true }, "). This distinction matters more than it might seem: a site can pass every functional test (forms submit, links work, no console errors) and still ship with inconsistent spacing, mismatched font weights, and broken visual hierarchy that a functional QA pass simply isn't designed to catch."],
      ],
    },
    {
      heading: "When design QA should start",
      body: [
        ["The most actionable, specific piece of guidance from Galaxy Weblinks' analysis is timing: design QA should start \"the moment you get your hands on functional prototypes,\" not held until final pre-launch review (", { text: "Galaxy Weblinks", href: "https://www.galaxyweblinks.com/blog/why-design-qa-should-be-a-non-negotiable-part-of-your-process", external: true }, "). This reframes design QA from a single pre-launch gate into an ongoing review cadence that runs parallel to development — catching a spacing inconsistency or a broken interaction pattern early, while it's a five-minute fix in one component, rather than late, when the same pattern has been copied across twenty pages and now requires a much larger cleanup pass."],
      ],
    },
    {
      heading: "Why small teams skip it — and why that's expensive",
      body: [
        ["Galaxy Weblinks names three specific, recurring reasons small teams shortchange design QA: the misconception that a designer's job ends at handoff (once the design file is delivered, the designer treats their responsibility as complete); time pressure that limits how many review iterations are realistically possible; and friction between designers and developers over feedback, where design notes get read as criticism of the build rather than a normal part of the process (", { text: "Galaxy Weblinks", href: "https://www.galaxyweblinks.com/blog/why-design-qa-should-be-a-non-negotiable-part-of-your-process", external: true }, ")."],
        ["The same source frames the cost trade-off directly and usefully: \"a few extra hours of your designers is better than a few extra days of your developers\" hunting down inconsistencies after release (", { text: "Galaxy Weblinks", href: "https://www.galaxyweblinks.com/blog/why-design-qa-should-be-a-non-negotiable-part-of-your-process", external: true }, "). This is a specific, actionable argument for budgeting real designer time into the pre-launch schedule rather than treating design QA as a nice-to-have that gets cut when the timeline tightens — which, in practice, is exactly when teams are most tempted to skip it."],
      ],
    },
    {
      heading: "The practical pre-launch checklist",
      body: [
        ["Combining Galaxy Weblinks' design-QA-specific guidance with Webflow University's broader pre-launch checklist gives a concrete, actionable list covering both the design layer and the surrounding technical basics a small team needs to check before going live:"],
        [{ text: "Design-specific checks", bold: true }, " (", { text: "Galaxy Weblinks", href: "https://www.galaxyweblinks.com/blog/why-design-qa-should-be-a-non-negotiable-part-of-your-process", external: true }, "):", " ", "– Visual consistency — spacing, alignment, and styles matching across every page, not just the ones reviewed most closely"],
        ["– Responsive behavior across desktop, tablet, and mobile breakpoints"],
        ["– No leftover placeholder content (\"Lorem ipsum,\" placeholder images, unfinished copy)"],
        ["– Working forms and links, checked functionally as part of the design review, not assumed"],
        ["– Mobile tap-target sizing — buttons and links large enough to tap reliably on a real device, not just a simulator"],
        ["– Accessibility compliance, listed explicitly as one of the essential design QA checklist components alongside visual consistency and interaction behavior"],
        [{ text: "Broader technical pre-launch checks", bold: true }, " (", { text: "Webflow University", href: "https://university.webflow.com/resources/pre-launch-checklist", external: true }, "):"],
        ["– Staging environment verified and matching what will actually go live"],
        ["– Custom domain connected correctly", " ", "– SSL enabled"],
        ["– Analytics and third-party integrations configured and firing correctly before launch, not discovered missing afterward"],
      ],
    },
    {
      heading: "Practical examples",
      body: [
        [{ text: "Sourced pattern, applied illustratively:", bold: true }, " A four-person startup team (one designer, two developers, one founder) building a marketing site adopts the \"start design QA at functional prototype\" pattern directly: instead of waiting for a \"final review\" meeting the week before launch, the designer reviews each page as soon as it's built in the staging environment, flagging spacing and interaction issues while each page is still a single, isolated fix rather than a pattern replicated across the whole site. This is a direct, sourced application of Galaxy Weblinks' timing guidance, not a hypothetical invented for this article — the underlying recommendation (start at functional prototype stage) is the sourced claim; the specific four-person team scenario is illustrative."],
        [{ text: "Real, named source for the technical checklist:", bold: true }, " Webflow University's own published pre-launch checklist is a real, publicly available resource — not an invented template — specifically covering the domain, SSL, and integration verification steps listed above (", { text: "Webflow University", href: "https://university.webflow.com/resources/pre-launch-checklist", external: true }, ")."],
      ],
    },
    {
      heading: "Data and evidence",
      body: [
        ["– Design QA is defined specifically as a designer-led cross-verification process distinct from functional/bug testing — ", { text: "Galaxy Weblinks", href: "https://www.galaxyweblinks.com/blog/why-design-qa-should-be-a-non-negotiable-part-of-your-process", external: true }, "."],
        ["– Recommended timing: start design QA as soon as functional prototypes exist, not at final pre-launch — ", { text: "Galaxy Weblinks", href: "https://www.galaxyweblinks.com/blog/why-design-qa-should-be-a-non-negotiable-part-of-your-process", external: true }, "."],
        ["– Three named reasons small teams skip design QA: the \"designer's job ends at handoff\" misconception, time pressure, and designer-developer friction over feedback — ", { text: "Galaxy Weblinks", href: "https://www.galaxyweblinks.com/blog/why-design-qa-should-be-a-non-negotiable-part-of-your-process", external: true }, "."],
        ["– Pre-launch QA more broadly is described as covering five categories: search engine, security, content, performance, and functional checks, with launch-critical checks spanning functionality, design, content, accessibility, SEO, AEO, performance, and browser compatibility — general 2026 industry guidance reviewed for this article, not attributed to one single named source with that exact category breakdown, so treated here as directional structure rather than a single verified taxonomy."],
        ["– No independently verified, quantified statistic specific to design QA (e.g., \"X% of small teams skip design QA\" or \"Y hours saved per hour of design QA invested\") was found in the sources reviewed for this article — those specific numeric claims are evidence not sufficiently verified, and this article states the qualitative cost-tradeoff argument (a few extra designer hours vs. several extra developer days) without attaching an unverified number to it."],
        ["– A related, widely circulated figure worth citing for context: BugHerd's QA testing guide cites IBM Systems Sciences Institute research (via NIST) that defects caught after release can cost up to 100x more to fix than the same defect caught during the design phase (", { text: "BugHerd", href: "https://bugherd.com/blog/website-qa-testing-complete-guide-to-quality-assurance", external: true }, "). This statistic is about software defects broadly, not design QA specifically, and its exact multiplier has been disputed and re-cited with varying figures across the software industry for years — treat it as directional support for the general \"catch it early\" argument, not a precise, current, design-QA-specific benchmark."],
      ],
    },
    {
      heading: "Comparisons",
      body: [
        ["### Design QA vs. functional QA testing", " ", "Design QA checks whether the built product visually and interactively matches the intended design — spacing, consistency, responsive behavior, interaction patterns. Functional QA checks whether the product *works* — forms submit correctly, links don't 404, no console errors, features behave as specified. A product can pass one and fail the other; both are necessary, and Galaxy Weblinks is explicit that these are distinct disciplines, not two names for the same review (", { text: "Galaxy Weblinks", href: "https://www.galaxyweblinks.com/blog/why-design-qa-should-be-a-non-negotiable-part-of-your-process", external: true }, ")."],
        ["### Manual design QA vs. automated visual regression testing"],
        ["The sourced guidance for this article focuses specifically on manual, designer-led review rather than automated visual regression tooling — no source reviewed here provided a detailed comparison of automated visual-diffing tools against manual design QA. For a small team without a dedicated QA function, manual review as described by Galaxy Weblinks is the accessible starting point; automated visual regression testing is a separate, more infrastructure-heavy investment this article's sources don't directly address."],
      ],
    },
    {
      heading: "Real-world use cases",
      body: [
        ["Startup founders launching a site without a dedicated QA team are the audience Galaxy Weblinks' guidance is explicitly framed for — small teams where the designer, if there is one, has to own this review themselves rather than handing it to a separate QA function (", { text: "Galaxy Weblinks", href: "https://www.galaxyweblinks.com/blog/why-design-qa-should-be-a-non-negotiable-part-of-your-process", external: true }, "). Freelance designers handing off to developers represent a second clear real-world case: the \"designer's job ends at handoff\" misconception named directly in the sourced guidance is specifically the failure mode that occurs in exactly this working relationship, when a freelancer delivers files and assumes their responsibility is complete."],
      ],
    },
    {
      heading: "Common mistakes",
      body: [
        ["– ", { text: "Waiting until final pre-launch review to start design QA.", bold: true }, " By then, a spacing or interaction inconsistency may already be replicated across many pages, turning a small fix into a large cleanup project (", { text: "Galaxy Weblinks", href: "https://www.galaxyweblinks.com/blog/why-design-qa-should-be-a-non-negotiable-part-of-your-process", external: true }, ")."],
        ["– ", { text: "Assuming a designer's responsibility ends at handoff.", bold: true }, " This misconception is named directly as one of the primary reasons small teams skip design QA entirely."],
        ["– ", { text: "Treating design feedback as personal criticism of the developer's build.", bold: true }, " The friction this creates is specifically named as a reason design QA gets shortchanged, rather than run consistently."],
        ["– ", { text: "Checking responsive design only on a browser simulator, not a real device.", bold: true }, " Simulators can miss real-world issues like actual tap-target usability on a physical touchscreen."],
        ["– ", { text: "Skipping accessibility checks as a \"later\" concern.", bold: true }, " Accessibility compliance is listed as one of the essential design QA checklist components, not an optional add-on (", { text: "Galaxy Weblinks", href: "https://www.galaxyweblinks.com/blog/why-design-qa-should-be-a-non-negotiable-part-of-your-process", external: true }, ")."],
        ["– ", { text: "Verifying domain, SSL, and analytics only after launch.", bold: true }, " These are explicitly part of the pre-launch checklist, not a post-launch cleanup task (", { text: "Webflow University", href: "https://university.webflow.com/resources/pre-launch-checklist", external: true }, ")."],
      ],
    },
    {
      heading: "Best practices",
      body: [
        ["– Start design QA the moment functional prototypes exist, and keep reviewing continuously rather than treating it as a single pre-launch gate."],
        ["– Budget real designer hours into the launch schedule explicitly — the time trade-off (a few designer hours vs. several developer days of post-launch fixes) is worth planning for, not discovering under deadline pressure."],
        ["– Check every page for visual consistency, not just the pages reviewed most closely during development."],
        ["– Test responsive behavior and tap-target sizing on real devices, not only in a browser's device simulator."],
        ["– Include accessibility compliance as a standard line item in the checklist, not a separate, optional pass."],
        ["– Verify staging, domain, SSL, and analytics/integrations as part of the same pre-launch checklist, not a separate technical-only list handled by a different person with no cross-check."],
      ],
    },
    {
      heading: "Key takeaways",
      body: [
        ["– Design QA is a distinct discipline from functional testing — it checks whether the build matches design intent, not just whether features work."],
        ["– Start design QA as soon as functional prototypes exist, not as a last-minute pre-launch gate — this is the single most actionable timing change a small team can make."],
        ["– The most common reasons small teams skip design QA are the \"designer's job ends at handoff\" misconception, time pressure, and designer-developer friction — all addressable directly rather than accepted as unavoidable."],
        ["– A complete pre-launch checklist covers both design-specific items (visual consistency, responsive behavior, tap targets, accessibility) and technical basics (staging, domain, SSL, analytics)."],
        ["– A few extra hours of designer time before launch is a better trade than several extra days of developer time hunting down inconsistencies after release."],
      ],
    },
    {
      heading: "Relevant tools.scult.in resources",
      body: [
        ["– ", { text: "Website Speed Test", href: "/seo/website-speed-test" }, " — run alongside your design QA pass to confirm performance basics are solid before launch, not just visual and functional correctness."],
        ["If your team is preparing for a launch and design QA has consistently been the thing that gets cut under deadline pressure, that's a common, documented pattern rather than a unique failure — and it's exactly the kind of process gap ", { text: "SCULT's UI/UX design and web development team", href: SERVICE_WEB_DEVELOPMENT.href, external: true }, " can help close before your next launch, rather than after visitors start finding the inconsistencies for you."],
        ["For a related, free starting point, try the ", { text: "AI Visibility Checker", href: "/geo/ai-visibility-checker" }, "."],
      ],
    },
  ],
  faq: [
    {
      question: "What is design QA and how is it different from regular functional QA testing?",
      answer: ["Design QA is a cross-verification process, typically done by a designer, checking that the built product matches the intended design (visual consistency, spacing, interactions) — distinct from functional/bug testing, which checks whether the product works (", { text: "Galaxy Weblinks", href: "https://www.galaxyweblinks.com/blog/why-design-qa-should-be-a-non-negotiable-part-of-your-process", external: true }, ")."],
    },
    {
      question: "When in a project should design QA start?",
      answer: ["As soon as functional prototypes exist — guidance recommends starting review \"the moment you get your hands on functional prototypes,\" not waiting until final pre-launch (", { text: "Galaxy Weblinks", href: "https://www.galaxyweblinks.com/blog/why-design-qa-should-be-a-non-negotiable-part-of-your-process", external: true }, ")."],
    },
    {
      question: "Why do small teams often skip or shortchange design QA?",
      answer: ["Cited reasons include the misconception that a designer's job ends at handoff, time pressure limiting review iterations, and friction between designers and developers over feedback (", { text: "Galaxy Weblinks", href: "https://www.galaxyweblinks.com/blog/why-design-qa-should-be-a-non-negotiable-part-of-your-process", external: true }, ")."],
    },
    {
      question: "What should be on a pre-launch design QA checklist?",
      answer: ["Visual consistency, responsive behavior across devices, no leftover placeholder content, working forms/links, mobile tap-target sizing, and accessibility compliance (", { text: "Webflow University", href: "https://university.webflow.com/resources/pre-launch-checklist", external: true }, "; ", { text: "Galaxy Weblinks", href: "https://www.galaxyweblinks.com/blog/why-design-qa-should-be-a-non-negotiable-part-of-your-process", external: true }, ")."],
    },
    {
      question: "Is it worth spending extra designer time before launch to avoid developer rework after?",
      answer: ["Yes, per the framing that \"a few extra hours of your designers is better than a few extra days of your developers\" hunting down inconsistencies post-release (", { text: "Galaxy Weblinks", href: "https://www.galaxyweblinks.com/blog/why-design-qa-should-be-a-non-negotiable-part-of-your-process", external: true }, ")."],
    },
    {
      question: "Does design QA need to check accessibility, not just visual polish?",
      answer: ["Yes — accessibility compliance is listed as one of the essential design QA checklist components alongside visual consistency and interaction behavior (", { text: "Galaxy Weblinks", href: "https://www.galaxyweblinks.com/blog/why-design-qa-should-be-a-non-negotiable-part-of-your-process", external: true }, ")."],
    },
    {
      question: "What non-visual technical items should be checked right before a website launch?",
      answer: ["Verifying the staging environment, connecting the custom domain, enabling SSL, and configuring analytics/third-party integrations (", { text: "Webflow University", href: "https://university.webflow.com/resources/pre-launch-checklist", external: true }, ")."],
    },
    {
      question: "What's the difference between a website launch checklist and a design QA checklist?",
      answer: ["A website launch checklist is broader, covering technical setup, SEO, compliance, and performance alongside design; design QA is specifically the visual-consistency-and-interaction-behavior portion within that larger checklist."],
    },
    {
      question: "Who is responsible for running design QA on a small team?",
      answer: ["Typically the designer, per Galaxy Weblinks' framing, though on a very small team this responsibility may need to be explicitly assigned rather than assumed, since no dedicated QA function exists to catch it otherwise."],
    },
    {
      question: "Is design QA only relevant for websites, or also for apps?",
      answer: ["The sourced guidance discusses it generally in terms of \"the built product\" matching the intended design, which applies to app interfaces as much as websites — the core distinction (design match vs. functional correctness) isn't website-specific."],
    },
    {
      question: "What does \"visual consistency\" actually mean in a design QA checklist?",
      answer: ["Consistent spacing, alignment, and styles across every page — not just the pages that got the most attention during development (", { text: "Galaxy Weblinks", href: "https://www.galaxyweblinks.com/blog/why-design-qa-should-be-a-non-negotiable-part-of-your-process", external: true }, ")."],
    },
    {
      question: "Why does design QA need to check responsive behavior specifically?",
      answer: ["Because a design can look correct on the primary breakpoint tested during development while breaking down at other screen sizes — checking desktop, tablet, and mobile is part of the explicit design QA checklist (", { text: "Webflow University", href: "https://university.webflow.com/resources/pre-launch-checklist", external: true }, ")."],
    },
    {
      question: "What counts as \"leftover placeholder content\" that design QA should catch?",
      answer: ["Lorem ipsum text, placeholder images, or unfinished copy that made it into a build without being replaced with final content."],
    },
    {
      question: "Why is mobile tap-target sizing part of design QA rather than just functional testing?",
      answer: ["It's a usability/design concern about whether interactive elements are appropriately sized and spaced for real touch interaction, which is a design judgment as much as a functional pass/fail check."],
    },
    {
      question: "Does design QA include checking whether forms and links actually work?",
      answer: ["Yes — Galaxy Weblinks lists working forms/links as part of the design QA checklist, even though this overlaps with what functional testing would also catch; design QA checks it as part of verifying the overall built experience matches intent."],
    },
    {
      question: "What is a \"staging environment\" and why does it need verification before launch?",
      answer: ["A staging environment is a pre-production copy of the site used for testing; verifying it matches what will actually go live is a specific item on Webflow University's pre-launch checklist (", { text: "Webflow University", href: "https://university.webflow.com/resources/pre-launch-checklist", external: true }, ")."],
    },
    {
      question: "Why does SSL need to be checked specifically before launch?",
      answer: ["Without SSL enabled correctly, a site can show security warnings to visitors or fail to load properly over HTTPS — a concrete, named item on the pre-launch checklist (", { text: "Webflow University", href: "https://university.webflow.com/resources/pre-launch-checklist", external: true }, ")."],
    },
    {
      question: "Should analytics be set up and verified before or after launch?",
      answer: ["Before — Webflow University's checklist lists configuring analytics/third-party integrations as part of pre-launch verification, not a post-launch task (", { text: "Webflow University", href: "https://university.webflow.com/resources/pre-launch-checklist", external: true }, ")."],
    },
    {
      question: "Is design QA a one-time pass or an ongoing process?",
      answer: ["The sourced timing guidance frames it as something that should start at functional-prototype stage and continue, rather than a single pass reserved for right before launch (", { text: "Galaxy Weblinks", href: "https://www.galaxyweblinks.com/blog/why-design-qa-should-be-a-non-negotiable-part-of-your-process", external: true }, ")."],
    },
    {
      question: "What's the risk of treating design QA as a \"nice to have\" that gets cut under deadline pressure?",
      answer: ["Per the sourced cost-tradeoff framing, cutting design QA under deadline pressure tends to shift the cost to post-launch developer time hunting down and fixing inconsistencies — often a worse trade than the designer hours it would have taken upfront (", { text: "Galaxy Weblinks", href: "https://www.galaxyweblinks.com/blog/why-design-qa-should-be-a-non-negotiable-part-of-your-process", external: true }, ")."],
    },
    {
      question: "How do I do a design QA review step by step?",
      answer: ["Start reviewing as soon as functional prototypes are available, check visual consistency page by page, verify responsive behavior on real devices, confirm no placeholder content remains, test forms/links, check tap-target sizing, and review accessibility compliance."],
    },
    {
      question: "How do I catch design bugs before launch rather than after?",
      answer: ["Run design QA continuously from the functional-prototype stage forward rather than only at a final pre-launch gate, which is the specific timing guidance that most directly prevents late-stage discovery of widespread issues (", { text: "Galaxy Weblinks", href: "https://www.galaxyweblinks.com/blog/why-design-qa-should-be-a-non-negotiable-part-of-your-process", external: true }, ")."],
    },
    {
      question: "How do I run a pre-launch checklist that covers both design and technical basics?",
      answer: ["Combine the design-specific checklist (visual consistency, responsive behavior, placeholder content, forms/links, tap targets, accessibility) with the broader technical checklist (staging, domain, SSL, analytics) into one document reviewed together before go-live (", { text: "Galaxy Weblinks", href: "https://www.galaxyweblinks.com/blog/why-design-qa-should-be-a-non-negotiable-part-of-your-process", external: true }, "; ", { text: "Webflow University", href: "https://university.webflow.com/resources/pre-launch-checklist", external: true }, ")."],
    },
    {
      question: "How do I convince a small team to budget real time for design QA under a tight deadline?",
      answer: ["Present the specific trade-off framing directly: a few extra hours of designer time now versus several extra days of developer time hunting down inconsistencies after release (", { text: "Galaxy Weblinks", href: "https://www.galaxyweblinks.com/blog/why-design-qa-should-be-a-non-negotiable-part-of-your-process", external: true }, ")."],
    },
    {
      question: "How do I reduce friction between designers and developers during design QA feedback?",
      answer: ["Frame feedback explicitly as a normal, expected part of the process rather than criticism of the build — the friction itself is named as one of the specific reasons small teams skip design QA, so addressing it directly (rather than avoiding review to avoid the friction) is the recommended path."],
    },
    {
      question: "How do I check for leftover placeholder content systematically?",
      answer: ["Review every page methodically against the final content plan, specifically looking for lorem ipsum text, placeholder images, or unfinished copy rather than assuming a single pass will catch everything."],
    },
    {
      question: "How do I test tap-target sizing properly rather than just visually estimating it?",
      answer: ["Test on an actual physical touchscreen device rather than relying solely on a browser's device simulator, since real-world tap accuracy can differ from what a simulator suggests."],
    },
    {
      question: "How do I verify accessibility compliance as part of design QA without a dedicated accessibility specialist?",
      answer: ["Include it explicitly as a checklist item rather than skipping it — even a basic manual review against common accessibility guidelines is better than treating it as entirely out of scope for a small team's design QA process."],
    },
    {
      question: "How do I make sure my staging environment actually matches what will go live?",
      answer: ["Explicitly compare staging against the intended production configuration as a checklist item, rather than assuming they're identical by default (", { text: "Webflow University", href: "https://university.webflow.com/resources/pre-launch-checklist", external: true }, ")."],
    },
    {
      question: "How do I avoid discovering analytics isn't tracking correctly only after launch?",
      answer: ["Verify analytics and third-party integrations are configured and firing correctly as an explicit pre-launch checklist item, not something checked for the first time after go-live (", { text: "Webflow University", href: "https://university.webflow.com/resources/pre-launch-checklist", external: true }, ")."],
    },
    {
      question: "What's a more advanced approach to design QA for a growing team beyond manual review?",
      answer: ["Introducing more structured, shared feedback documentation (annotated screenshots linked to specific issues) and potentially automated visual regression tooling as the team and codebase grow — though the sources reviewed for this article focus on the manual, designer-led process rather than a detailed automated-tooling comparison."],
    },
    {
      question: "How should design QA change as a team scales beyond a handful of people?",
      answer: ["The core principles (early start, ongoing review, designer ownership) likely still apply, but the process may need more formal documentation and assignment as more people touch the same design system — the sources reviewed here don't provide detailed guidance specific to scaling this process, so treat this as a reasonable extrapolation rather than a directly sourced claim."],
    },
    {
      question: "Is there a documented framework for prioritizing which design QA issues to fix before launch versus after?",
      answer: ["The sources reviewed for this article don't provide a specific prioritization framework (like impact/effort scoring) for design QA issues specifically — evidence not sufficiently verified for a named framework, though applying a general impact/effort lens (similar to other QA and audit processes) is a reasonable general practice."],
    },
    {
      question: "Does design QA need to account for dark mode or theme variations if the product supports them?",
      answer: ["The sourced material for this article doesn't specifically address multi-theme design QA — evidence not sufficiently verified for guidance specific to that scenario; general visual-consistency principles would presumably extend to each supported theme, but this isn't directly sourced."],
    },
    {
      question: "How does design QA interact with a formal design system or component library?",
      answer: ["The sources reviewed here don't go into detail on design-system-specific QA practices; the general visual-consistency check described applies at the page level regardless of whether a formal component library exists underneath it."],
    },
    {
      question: "Design QA vs. functional QA testing — how do they actually differ in practice?",
      answer: ["Design QA checks whether the build matches design intent (spacing, consistency, interaction feel); functional QA checks whether features work correctly (forms submit, no errors, logic behaves as specified) — both are needed, and neither substitutes for the other (", { text: "Galaxy Weblinks", href: "https://www.galaxyweblinks.com/blog/why-design-qa-should-be-a-non-negotiable-part-of-your-process", external: true }, ")."],
    },
    {
      question: "Manual design QA vs. automated visual regression testing — which should a small team use?",
      answer: ["Manual, designer-led review is the accessible starting point described in the sourced guidance for this article; automated visual regression testing is a separate, more infrastructure-heavy option not directly compared in the sources reviewed here."],
    },
    {
      question: "Reviewing on a browser simulator vs. a real device — does it matter for design QA?",
      answer: ["Yes for specific checks like tap-target sizing and true responsive rendering — a simulator approximates real-device behavior but can miss issues that only show up on actual hardware."],
    },
    {
      question: "A single pre-launch review vs. continuous design QA from prototype stage — which produces better results?",
      answer: ["Continuous review from the functional-prototype stage forward is the recommended approach, since it catches issues while they're isolated rather than after they've been replicated across many pages (", { text: "Galaxy Weblinks", href: "https://www.galaxyweblinks.com/blog/why-design-qa-should-be-a-non-negotiable-part-of-your-process", external: true }, ")."],
    },
    {
      question: "Designer-led design QA vs. developer self-review — which is more reliable?",
      answer: ["The sourced guidance specifically frames design QA as a designer's cross-verification responsibility, distinct from a developer reviewing their own work — the value comes precisely from a second, design-trained perspective catching what the builder themselves might not notice."],
    },
    {
      question: "My site launched with visual bugs even though we thought we tested it — what went wrong?",
      answer: ["Likely design QA either started too late (only at final pre-launch) or wasn't run as a distinct pass from functional testing — both are named failure patterns in the sourced guidance (", { text: "Galaxy Weblinks", href: "https://www.galaxyweblinks.com/blog/why-design-qa-should-be-a-non-negotiable-part-of-your-process", external: true }, ")."],
    },
    {
      question: "Our design doesn't match the final build even though the developer says they followed the specs — why?",
      answer: ["This is exactly the gap design QA is meant to catch — a developer's honest interpretation of a spec can still diverge from design intent in ways that only a dedicated visual/interaction review surfaces."],
    },
    {
      question: "We have inconsistent spacing across pages that we didn't notice until after launch — how do we prevent this next time?",
      answer: ["Start design QA at the functional-prototype stage and review every page, not just the ones that got the most development attention, which is the specific timing and scope guidance that addresses this exact failure mode (", { text: "Galaxy Weblinks", href: "https://www.galaxyweblinks.com/blog/why-design-qa-should-be-a-non-negotiable-part-of-your-process", external: true }, ")."],
    },
    {
      question: "We keep finding leftover placeholder content after launch — how do we catch this before going live?",
      answer: ["Add an explicit \"no placeholder content\" line item to your pre-launch checklist and review every page against it deliberately, rather than assuming it would have been caught incidentally during other testing."],
    },
    {
      question: "Our mobile buttons are too small to tap reliably even though they looked fine on desktop — what happened?",
      answer: ["This is a common design QA gap when testing happens primarily on desktop or in a simulator — testing tap-target sizing on an actual mobile device specifically catches this issue."],
    },
    {
      question: "Is it worth hiring outside help for design QA if we don't have a dedicated designer on staff?",
      answer: ["Worth considering, since the sourced guidance frames design QA as specifically a designer's responsibility — without one in-house, an external reviewer can fill that specific gap before launch."],
    },
    {
      question: "Should a freelance designer include design QA in their scope, or is that a separate service?",
      answer: ["Given that \"the designer's job ends at handoff\" is specifically named as a misconception that causes design QA to get skipped, a freelance designer explicitly including a QA pass in their scope (rather than ending at file handoff) directly addresses a documented failure mode."],
    },
    {
      question: "What should a small business look for when hiring for a website launch to make sure design QA is included?",
      answer: ["Confirm explicitly whether design QA (visual consistency, responsive review, accessibility) is part of the scope, separate from functional testing — since the two are distinct disciplines that can each be skipped independently if not named explicitly."],
    },
    {
      question: "Is a pre-launch checklist template worth using even for a very small, simple site?",
      answer: ["Yes — the checklist items (placeholder content, responsive behavior, SSL, analytics) apply regardless of site size, and a simple site is exactly where a missed item is most likely to go unnoticed without a structured checklist."],
    },
    {
      question: "What's the single most important change a small team can make to their design QA process right now?",
      answer: ["Start the review at the functional-prototype stage instead of waiting for final pre-launch — this one timing change is the most specifically actionable guidance across the sourced material, and it directly prevents the \"small issue becomes a site-wide cleanup\" failure mode described above."],
    },
  ],
  sources: [
    "https://www.galaxyweblinks.com/blog/why-design-qa-should-be-a-non-negotiable-part-of-your-process",
    "https://university.webflow.com/resources/pre-launch-checklist",
    "https://bugherd.com/blog/website-qa-testing-complete-guide-to-quality-assurance",
  ],
  relatedTools: ["website-speed-test", "ai-visibility-checker"],
  relatedPrompts: [],
  serviceTarget: "web-development",
  updatedAt: "2026-08-21",
  readingMinutes: 16,
}
