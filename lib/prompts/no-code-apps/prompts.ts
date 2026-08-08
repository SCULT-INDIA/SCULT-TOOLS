import type { Prompt } from '../types'

/**
 * "Build Apps Without Code" — Lovable, Bolt.new, v0, and Replit Agent prompts.
 * These tools generate a working app (or component) from a single description
 * in one shot, so the initial brief carries more weight than it would in an
 * IDE with ongoing back-and-forth — see docs/research/prompt-library.md §4.
 * First batch of 8, per §10.2's "curate small" launch decision.
 */
export const prompts: readonly Prompt[] = [
  {
    slug: 'lovable-saas-mvp-client-portal',
    category: 'no-code-apps',
    title: 'Scope and build a freelancer client-portal SaaS MVP',
    description: `A structured Lovable brief for a freelancer client-portal SaaS — the full entity model, screens, and Supabase auth/RLS rules spelled out so the first generation is a working multi-tenant app, not a single-user demo.`,
    promptText: `Build {{product_name}}, a subscription SaaS web app for {{primary_user}}. This is the full v1 — build the real data model and working flows, not placeholder screens.

Data model:
- User: id, name, email, role (owner or team_member), avatar_url.
- Client: id, name, company, email, phone, notes, owner_id (references User).
- Project: id, client_id (references Client), title, status (active, on_hold, or completed), start_date, due_date, budget.
- Task: id, project_id (references Project), title, is_done, due_date.
- Invoice: id, project_id (references Project), invoice_number, amount, status (draft, sent, paid, or overdue), due_date, line_items (JSON).
- Comment: id, project_id (references Project), author_id (references User), body, created_at — for client-visible project updates.

Screens and flows:
1. Sign up and log in with email plus Google OAuth.
2. Dashboard: active projects, overdue invoices, and tasks due this week at a glance.
3. Clients list, linking to a client detail page showing all their projects and invoice history.
4. Project detail page: task checklist, a comment thread the client can see, and a 'Create invoice' action.
5. Invoice view: line items, status, and a 'mark as paid' toggle.
6. Billing and settings page listing these subscription tiers: {{subscription_tiers}}, with a Stripe checkout stub.

Constraints:
- Use Lovable's native Supabase integration for auth (email plus Google) and the database — do not fake data in local component state.
- Row-level security: a User can only see the Clients, Projects, and Invoices where owner_id matches their own auth.uid().
- Primary brand color: {{brand_color}}. Keep the UI calm and unopinionated — this is a tool freelancers show to their own clients.
- Do not build the real Stripe integration yet — a visual checkout screen with a disabled 'connect Stripe' button is enough for this pass.`,
    variables: [
      {
        name: 'product_name',
        description: 'The name of the SaaS product.',
        example: 'Clientflow',
        required: true,
      },
      {
        name: 'primary_user',
        description: 'Who logs in and uses this day to day.',
        example: 'solo freelancers and small agencies of 1-5 people',
        required: true,
      },
      {
        name: 'subscription_tiers',
        description: 'The pricing tiers to show on the billing page.',
        example: 'Solo ($15/mo, 1 user), Team ($45/mo, up to 5 users)',
        required: true,
      },
      {
        name: 'brand_color',
        description: 'The primary accent color for the UI.',
        example: '#5B4CFF (indigo)',
        required: false,
      },
    ],
    targetTools: ['Lovable'],
    tags: ['saas', 'mvp', 'data-model', 'supabase', 'client-portal', 'b2b'],
    whyItWorks: `Lovable generates a full application from one description in a single pass, so anything left unspecified gets invented — usually as a generic CRUD shell with fake in-memory data rather than a real backend. Naming the entities, their foreign keys, and the row-level-security ownership rule up front (rather than just "clients can have projects") is what turns Lovable's native Supabase integration into an actual multi-tenant app instead of a demo that loses its data on refresh or leaks every user's clients to every other user. A vague "build me a client portal" prompt produces something that looks right in the first screenshot and breaks the moment two different freelancers sign up.`,
    exampleOutput: `A working Lovable app with email/Google sign-in, a seeded dashboard showing 2-3 sample projects and one overdue invoice, and a Supabase table editor showing real rows in clients, projects, and invoices — each scoped to the logged-in user via row-level security.`,
    verifiedAgainst: [
      {
        tool: 'Lovable',
        version: 'Lovable web app (Supabase-integrated chat builder)',
        date: '2026-07-22',
      },
    ],
    changelog: [
      {
        date: '2026-07-22',
        note: 'Initial version, scoped around an explicit row-level-security ownership rule after early drafts without one defaulted to fully public tables.',
      },
    ],
    relatedToolSlug: 'invoice-generator',
  },
  {
    slug: 'bolt-new-landing-page-supabase-signup',
    category: 'no-code-apps',
    title: 'Build a waitlist landing page with a real signup form',
    description: `A Bolt.new landing-page brief that treats the signup form as the actual product: the exact Supabase table, insert logic, and duplicate-email handling are specified up front, since Bolt.new has no database or auth of its own to fall back on.`,
    promptText: `Build a single-page marketing site for {{product_name}}, {{one_line_pitch}}. The goal is to collect email signups for a waitlist before launch.

Page sections, in order:
1. Hero — headline, one-line subheading, and the signup form (button text: {{primary_cta_text}}) above the fold.
2. How it works — three short steps with icons.
3. Social proof — a row of three placeholder testimonial quotes with name and role.
4. FAQ — four questions in a collapsible accordion.
5. Footer — signup form repeated, plus a contact address: {{contact_email}}.

Signup form requirements — this is the important part:
- Fields: email (required), and optionally name.
- Bolt.new has no database or auth of its own, so wire this form directly to Supabase: create a waitlist_signups table (columns: id, email, name, created_at, source) and insert a row on submit using the Supabase JS client.
- Show inline validation for an invalid email format, and a success state (for example, "You're on the list") after a successful insert, without a full page reload.
- Handle the duplicate-email case — a unique constraint on email — by showing a friendly "you're already signed up" message instead of a raw database error.
- Do not build any other auth. This page only ever needs a one-way form submission, never a login.

Style: {{visual_style}}. Fully responsive, single page, no unused component libraries.`,
    variables: [
      {
        name: 'product_name',
        description: 'The name of the product collecting signups.',
        example: 'Recap',
        required: true,
      },
      {
        name: 'one_line_pitch',
        description: 'A one-sentence description of what the product does.',
        example: 'an AI meeting-notes tool that writes the follow-up email for you',
        required: true,
      },
      {
        name: 'primary_cta_text',
        description: 'The label on the signup button.',
        example: 'Get early access',
        required: true,
      },
      {
        name: 'contact_email',
        description: 'The contact address shown in the footer.',
        example: 'hello@getrecap.com',
        required: false,
      },
      {
        name: 'visual_style',
        description: 'The overall visual direction for the page.',
        example: 'dark background, one accent lime-green color, big confident type',
        required: false,
      },
    ],
    targetTools: ['Bolt.new'],
    tags: ['landing-page', 'waitlist', 'signup-form', 'supabase', 'saas', 'launch'],
    whyItWorks: `Bolt.new spins up a full StackBlitz WebContainer environment but has no managed database or auth of its own — that gap is the single most-cited limitation of the tool. A prompt that just says "add a signup form" gets a form that either fakes a success message with nowhere for the data to go, or throws a runtime error the moment it tries to reach a backend that was never wired up. Naming the exact Supabase table, its columns, and how to handle a duplicate email is what turns a good-looking landing page into a waitlist you can actually export and follow up with.`,
    exampleOutput: `A live Bolt.new preview URL with a dark hero, a working email field, and a Supabase waitlist_signups table that gains a real row every time the form is submitted, plus a friendly message if the same email is submitted twice.`,
    verifiedAgainst: [
      {
        tool: 'Bolt.new',
        version:
          'Bolt.new web app (StackBlitz WebContainers, Supabase integration panel)',
        date: '2026-07-24',
      },
    ],
    changelog: [
      {
        date: '2026-07-24',
        note: "Initial version, written explicitly around Bolt.new's missing built-in database/auth after an earlier draft without a named backend produced a form with no persistence.",
      },
    ],
  },
  {
    slug: 'v0-nextjs-pricing-table-component',
    category: 'no-code-apps',
    title: 'Generate a production-ready pricing table component',
    description: `A v0 component brief for a typed, responsive pricing table built on Next.js and shadcn/ui — props contract, breakpoints, and accessibility spelled out so the output drops straight into an existing codebase.`,
    promptText: `Generate a PricingTable React component for a Next.js App Router project using shadcn/ui and Tailwind CSS.

Props and data shape: accept a plans array as props. Each plan has name, price (monthly number), priceAnnual (annual number), description, features (a string array), ctaLabel, and highlighted (boolean, marks the recommended plan). Define this with a TypeScript interface — no inline any.

Layout:
- {{plan_count}} plans in a responsive grid: side-by-side columns on desktop, stacked on mobile.
- A monthly/annual toggle above the grid that swaps the displayed price and shows a badge reading {{annual_discount_label}} when annual is selected.
- The highlighted plan gets a border or shadow treatment and a small ribbon reading {{highlighted_badge_text}} — make it visually a size class above the others, not just a different background color.
- Each card lists features with a check icon per line, and greys out or strikes through any feature the plan doesn't include when a feature is passed with included set to false.

Constraints:
- Client component only where needed (the toggle) — keep the static plan cards server-renderable where the toggle state allows it.
- Fully keyboard-accessible toggle with a visible focus state.
- No hardcoded plan data inside the component itself — it must accept plans as a prop so it's reusable, and include one example usage with {{plan_count}} realistic sample plans.`,
    variables: [
      {
        name: 'plan_count',
        description: 'How many pricing plans to render.',
        example: '3',
        required: true,
      },
      {
        name: 'annual_discount_label',
        description: 'The badge text shown when annual billing is selected.',
        example: 'Save 20%',
        required: true,
      },
      {
        name: 'highlighted_badge_text',
        description: 'The ribbon text on the recommended plan.',
        example: 'Most popular',
        required: false,
      },
    ],
    targetTools: ['v0'],
    tags: [
      'ui-component',
      'nextjs',
      'shadcn',
      'tailwind',
      'pricing-page',
      'design-system',
    ],
    whyItWorks: `v0 is tuned to produce idiomatic Next.js and shadcn/ui components, not full applications with their own data layer — that's its real strength relative to Lovable or Bolt.new, and the prompt should lean into it rather than fight it. Specifying the exact prop shape, TypeScript types, and breakpoints up front is what makes the output a genuinely reusable component you can drop into an existing design system; a bare "make a pricing table" prompt gets plausible-looking output with the plan data hardcoded inside the component and no type safety, which means rewriting it before it's usable anyway.`,
    exampleOutput: `A PricingTable.tsx file with a typed Plan interface, a working monthly/annual toggle, and three example cards rendered from a sample plans array passed in as props — ready to paste into an existing pricing page route.`,
    verifiedAgainst: [
      {
        tool: 'v0',
        version: 'v0 by Vercel (Next.js + shadcn/ui default stack)',
        date: '2026-07-18',
      },
    ],
    changelog: [
      {
        date: '2026-07-18',
        note: 'Initial version, added an explicit TypeScript prop contract after an untyped draft produced a component with the sample data baked in instead of passed as props.',
      },
    ],
  },
  {
    slug: 'replit-agent-student-expense-tracker',
    category: 'no-code-apps',
    title: 'Build a personal expense tracker as a code-visible learning project',
    description: `A Replit Agent brief for a personal expense tracker that treats the build itself as the lesson — staged commits, plain-English explanations, and inline comments on anything unfamiliar, aimed at a student who wants to be able to explain their own code.`,
    promptText: `I'm {{skill_level}}. Build a personal expense tracker web app with me — but the point of this project is that I understand every part of it, not just that it works, so build it in visible stages and explain the code as you go.

What to build:
- A {{tech_stack}} app where I can add an expense (amount, category, date, note), see a list of all expenses, filter by category and date range, and see a running total plus a simple bar chart of spend by category.
- Store data in a real database (SQLite is fine), not in-memory — I want to see an actual schema and real queries, not a JavaScript array pretending to be a database.

How to work with me — this is the important part:
1. Before writing code, show me the file structure and database schema you're about to create, and explain why it's shaped that way.
2. Build it in stages: (a) database and models, (b) the add-expense form and save logic, (c) the list and filter view, (d) the chart. Pause after each stage, show me the code, and give a 3-5 sentence plain-English explanation of what it does and why.
3. When you use a library or pattern I might not know — for example, {{unfamiliar_concepts}} — add a short comment in the code explaining it, not just the code itself.
4. Don't silently fix bugs. If something breaks, tell me what broke and why before you fix it.

Constraints:
- Keep the UI simple and functional — this project is about the code, not the design.
- I want to be able to explain this project in a job interview afterward, so favor clear, conventional code over clever one-liners.`,
    variables: [
      {
        name: 'skill_level',
        description:
          'Your current experience level, so explanations land at the right depth.',
        example:
          "a second-year CS student who's done a couple of Python courses but never built a full-stack app",
        required: true,
      },
      {
        name: 'tech_stack',
        description: 'The language/framework combination you want to learn.',
        example: 'Python and Flask backend with a plain HTML/JS frontend',
        required: true,
      },
      {
        name: 'unfamiliar_concepts',
        description: 'Specific libraries or patterns you want explained inline.',
        example: 'an ORM like SQLAlchemy, or the fetch API for async requests',
        required: false,
      },
    ],
    targetTools: ['Replit Agent'],
    tags: ['learn-to-code', 'student-project', 'beginner', 'sqlite', 'portfolio-project'],
    whyItWorks: `Every no-code builder in this category can technically produce a working expense tracker, but Replit Agent's real differentiator is that it builds inside a real, editable codebase and shows its work rather than hiding it behind a generated preview — the "glass box" among these four tools. A prompt that explicitly asks for staged builds, plain-English explanations, and comments on unfamiliar patterns is what actually cashes in that advantage; without it, Replit Agent will still produce working code, but it ships all at once with no explanation, which throws away the one reason to pick it over Lovable for someone trying to learn.`,
    exampleOutput: `A staged back-and-forth: a database schema with a one-paragraph explanation, then a working add-expense form with a plain-English recap of the save handler, then a filtered list view, then a category bar chart — each stage confirmed before the next begins.`,
    verifiedAgainst: [
      {
        tool: 'Replit Agent',
        version: 'Replit Agent (chat-based build mode in Replit)',
        date: '2026-07-15',
      },
    ],
    changelog: [
      {
        date: '2026-07-15',
        note: 'Initial version, added the explicit staged-and-explained build sequence after a one-shot version of this prompt returned a complete app with no explanation of any of it.',
      },
    ],
  },
  {
    slug: 'lovable-internal-inventory-admin-dashboard',
    category: 'no-code-apps',
    title: 'Build an internal inventory and order-management admin dashboard',
    description: `A Lovable brief for an internal inventory and order-management dashboard — invite-only auth, role-based permissions, and the exact stock-adjustment logic spelled out so the tool enforces real business rules instead of shipping two disconnected CRUD tables.`,
    promptText: `Build an internal admin dashboard called {{tool_name}} for {{team_context}} to track inventory and orders. This is an internal tool — no public sign-up, only invited staff.

Data model:
- User: id, name, email, role (admin or staff).
- Product: id, sku, name, category, unit_cost, reorder_threshold, quantity_on_hand.
- Supplier: id, name, contact_email, lead_time_days.
- Order: id, product_id (references Product), supplier_id (references Supplier), quantity, status (pending, shipped, or received), ordered_at, expected_at.
- StockMovement: id, product_id (references Product), change_qty (positive or negative), reason (restock, sale, adjustment, or damage), created_by (references User), created_at.

Screens:
1. Login — invite-only, no public sign-up form.
2. Dashboard: products below their reorder_threshold, pending orders, and a 7-day stock-movement activity feed.
3. Products table: sortable and filterable by category, inline-editable quantity_on_hand, a visual flag on low-stock rows.
4. Product detail page: the full StockMovement history for that product, plus a "create purchase order" action that opens the Order form pre-filled with a suggested quantity of {{reorder_multiplier}} times the reorder_threshold.
5. Orders table: filter by status. Marking an order as received must automatically create a matching StockMovement and increase quantity_on_hand — these two actions are one transaction, not two separate manual steps.
6. Admin-only screen: manage Users and their roles.

Constraints:
- Use Lovable's Supabase integration for auth — invite-only, with public sign-up disabled in the auth settings — and for the database.
- Role-based access: staff can view everything and log stock movements; only admin can add or remove users or edit unit_cost.
- {{brand_note}}
- This tool is used on a warehouse-floor tablet as much as a desktop — the Products and Orders tables must stay usable at {{min_viewport}}, not just at desktop width.`,
    variables: [
      {
        name: 'tool_name',
        description: 'The internal name of the dashboard.',
        example: 'StockDesk',
        required: true,
      },
      {
        name: 'team_context',
        description: 'Who uses this tool and roughly how many people.',
        example: 'a 6-person warehouse team at a small furniture importer',
        required: true,
      },
      {
        name: 'reorder_multiplier',
        description:
          'The multiplier applied to reorder_threshold when suggesting an order quantity.',
        example: '2',
        required: true,
      },
      {
        name: 'brand_note',
        description: 'Any branding requirement, or a note that none is needed.',
        example: 'No branding beyond a simple wordmark — this is never client-facing.',
        required: false,
      },
      {
        name: 'min_viewport',
        description: 'The smallest device width the tables must stay usable at.',
        example: 'a 10-inch tablet, roughly 1280x800, landscape orientation',
        required: false,
      },
    ],
    targetTools: ['Lovable'],
    tags: [
      'internal-tool',
      'admin-dashboard',
      'inventory',
      'operations',
      'role-based-access',
      'supabase',
    ],
    whyItWorks: `An internal tool has a different failure mode than a customer-facing SaaS: the risk isn't a bad first impression, it's a dashboard that looks complete but doesn't actually enforce the business rule that matters — in this case, that receiving an order has to update stock, not just change a status label. Spelling out that state-machine behavior, the role-based permission split, and invite-only auth up front is what makes Lovable build one connected system instead of two unrelated CRUD tables you have to notice are disconnected after someone's already trusted the numbers.`,
    exampleOutput: `An invite-only Lovable dashboard where marking a pending order as received automatically logs a stock movement and increases quantity_on_hand on the product detail page, with the Products table remaining usable at tablet width.`,
    verifiedAgainst: [
      {
        tool: 'Lovable',
        version: 'Lovable web app (Supabase-integrated chat builder)',
        date: '2026-07-10',
      },
    ],
    changelog: [
      {
        date: '2026-07-10',
        note: 'Initial version, made the order-received-to-stock-movement transaction explicit after a first draft shipped Orders and StockMovement as unrelated screens.',
      },
    ],
  },
  {
    slug: 'bolt-new-investor-pitch-prototype',
    category: 'no-code-apps',
    title: 'Build a clickable investor-pitch prototype for a marketplace app',
    description: `A Bolt.new brief for a clickable, mock-data investor-pitch prototype of a two-sided marketplace — deliberately skipping any real backend so the build stays fast and demo-proof instead of half-wiring a database it doesn't need yet.`,
    promptText: `Build a clickable prototype of {{product_name}}, a two-sided marketplace connecting {{supply_side}} with {{demand_side}}. This is for {{pitch_context}} — it needs to look and feel real in a live demo, but it does not need a real backend, real payments, or real auth yet.

Screens to build — all navigable, all using realistic hardcoded or mock data, no Supabase and no external API calls:
1. Landing/browse view: a grid of {{listing_count}} sample listings with photos (placeholder images are fine), price, and rating.
2. Listing detail page: a photo gallery, description, price, and a "Book" or "Buy" button that opens a mock checkout modal.
3. Mock checkout modal: an order summary and a fake "Confirm" button that leads to a success screen. Do not wire this to any real payment provider.
4. A simple three-step "become a seller/provider" onboarding flow that ends on a mock "listing submitted" confirmation.
5. A basic profile/dashboard screen showing 2-3 mock past orders or listings.

Constraints:
- All data lives in local component state or a static mock-data file. Skip any real backend entirely for this pass — the goal is a fast, reliable demo, not a production app.
- Prioritize visual polish and smooth transitions between screens over feature completeness. Someone clicking through this for 90 seconds should see something that looks shippable.
- Visual direction: {{visual_style}}.
- Make sure every button in the demo path actually does something — navigates, or opens a modal. A dead-end button is the fastest way to break a live demo.`,
    variables: [
      {
        name: 'product_name',
        description: 'The name of the marketplace product.',
        example: 'Pawtrot',
        required: true,
      },
      {
        name: 'supply_side',
        description: 'Who is supplying the service or listing.',
        example: 'local dog walkers',
        required: true,
      },
      {
        name: 'demand_side',
        description: 'Who is buying or booking.',
        example: 'pet owners who need a same-day walk',
        required: true,
      },
      {
        name: 'pitch_context',
        description: 'The setting this prototype needs to perform in.',
        example: 'a 3-minute seed-round pitch to angel investors',
        required: true,
      },
      {
        name: 'listing_count',
        description: 'How many sample listings to show on the browse grid.',
        example: '8',
        required: false,
      },
      {
        name: 'visual_style',
        description: 'The overall visual direction for the prototype.',
        example: 'warm and friendly, rounded corners, one coral accent color',
        required: false,
      },
    ],
    targetTools: ['Bolt.new'],
    tags: [
      'prototype',
      'pitch-deck',
      'investor-demo',
      'mock-data',
      'marketplace',
      'fast-build',
    ],
    whyItWorks: `This is the same tool as the waitlist-signup prompt above with the opposite backend instruction, and that contrast is the point: explicitly telling Bolt.new to skip Supabase and use mock data keeps a pitch-prototype build fast and demo-proof, instead of Bolt.new guessing wrong in either direction — either attempting a real backend it doesn't have natively and burning your limited iteration time before a pitch, or half-wiring one and leaving a demo that can error out live on a bad connection. For a 90-second investor click-through, "looks real and never dead-ends" beats "is real," and a good prompt says so directly rather than leaving Bolt.new to assume.`,
    exampleOutput: `A clickable Bolt.new preview: a browse grid of eight sample listings, a listing detail page with a mock checkout modal ending in a success screen, and a three-step seller-onboarding flow — no backend calls, no loading spinners that go nowhere.`,
    verifiedAgainst: [
      {
        tool: 'Bolt.new',
        version: 'Bolt.new web app (StackBlitz WebContainers)',
        date: '2026-06-30',
      },
    ],
    changelog: [
      {
        date: '2026-06-30',
        note: 'Initial version, added the explicit "no real backend" constraint after an earlier draft let Bolt.new attempt a half-wired database mid-build, stalling the prototype.',
      },
    ],
  },
  {
    slug: 'v0-nextjs-saas-hero-section',
    category: 'no-code-apps',
    title: 'Generate a SaaS landing page hero section with a product visual',
    description: `A v0 brief for a Next.js SaaS hero section with exact copy, CTA hierarchy, and a concrete visual description, so the output reads as shippable copy rather than generic AI-landing-page filler.`,
    promptText: `Generate a hero section component for a Next.js App Router marketing page, built with Tailwind CSS and shadcn/ui primitives.

Content:
- Eyebrow/badge text: {{eyebrow_text}}
- Headline: {{headline}} — large, tight leading, should read as one confident sentence, not a pile of slogans.
- Subheadline: {{subheadline}} — one sentence, muted color, smaller than the headline.
- Primary CTA button: {{primary_cta}}, plus a secondary ghost or text-link CTA: {{secondary_cta}}.
- A visual on the right on desktop, below the text on mobile: {{visual_description}}. Build it as an actual styled mock (cards, a stat row, a chat bubble, whatever fits the description), not a grey placeholder box.

Layout:
- Two-column on desktop, stacked with the visual below the text on mobile.
- Generous vertical padding on desktop, with a constrained max-width container.
- A subtle background treatment behind the whole section — a soft gradient or a faint grid pattern, not a flat white or black background.

Constraints:
- Server component — no client-side state unless the visual mock genuinely needs interactivity.
- Use next/image, with a placeholder src, for any images.
- Ship it as a self-contained Hero component with typed props for all of the text content above, so it's reusable with different copy.`,
    variables: [
      {
        name: 'eyebrow_text',
        description: 'Small badge text above the headline.',
        example: 'Now with team workspaces',
        required: false,
      },
      {
        name: 'headline',
        description: 'The main headline.',
        example: 'Ship customer support that actually reads the docs',
        required: true,
      },
      {
        name: 'subheadline',
        description: 'One supporting sentence under the headline.',
        example: 'Connect your help center once. Every reply cites the real answer.',
        required: true,
      },
      {
        name: 'primary_cta',
        description: 'The main call-to-action button label.',
        example: 'Start free trial',
        required: true,
      },
      {
        name: 'secondary_cta',
        description: 'A lower-emphasis second action.',
        example: 'Watch a 2-min demo',
        required: false,
      },
      {
        name: 'visual_description',
        description: 'A concrete description of what the hero visual should show.',
        example:
          'a mock chat widget showing an AI reply with a citation chip underneath it',
        required: true,
      },
    ],
    targetTools: ['v0'],
    tags: [
      'landing-page',
      'hero-section',
      'nextjs',
      'tailwind',
      'saas-marketing',
      'ui-component',
    ],
    whyItWorks: `v0's output quality tracks how concrete the brief is, and hero sections are where that's most visible — the tool has to invent headline copy, a CTA hierarchy, and whatever goes in that big visual slot on the right if you don't supply them, which is exactly why so many AI-generated SaaS landing pages read identically. Giving v0 the actual headline, the exact secondary CTA, and a real description of the visual, not "something nice," is the difference between a component you ship and one you immediately rewrite.`,
    exampleOutput: `A self-contained Hero.tsx with the supplied headline and subheadline rendered at full size, a two-CTA row, and a styled mock chat-widget visual on the right rather than a placeholder rectangle.`,
    verifiedAgainst: [
      {
        tool: 'v0',
        version: 'v0 by Vercel (Next.js + shadcn/ui default stack)',
        date: '2026-07-05',
      },
    ],
    changelog: [
      {
        date: '2026-07-05',
        note: 'Initial version, added an explicit visual_description field after a draft without one returned a plain grey placeholder box instead of a styled mock.',
      },
    ],
  },
  {
    slug: 'replit-agent-discord-community-bot',
    category: 'no-code-apps',
    title: 'Build and deploy a Discord community bot with fully explained code',
    description: `A Replit Agent brief for a deployed Discord community bot that doubles as a lesson in real hosting — architecture, crash recovery, and secrets handling explained alongside the code, not just the commands themselves.`,
    promptText: `Build a Discord bot called {{bot_name}} for {{community_context}}, and deploy it so it's actually running, not just code that would work in theory.

What the bot should do:
- Respond to these slash commands: {{command_list}}.
- {{automation_feature}} — running automatically on a schedule or in response to an event, not only replying to commands.
- Log every command used (who, what, and when) to a simple database table so I can review usage later.

How to build this with me:
1. Start by explaining the overall architecture — the bot process, the command handlers, the scheduled or event-driven job, and where data is stored — before writing code. I want to understand the shape of it first.
2. Build and show me each command handler one at a time, with a plain-English explanation of what each one does and why it's structured that way.
3. Walk me through how Replit's deployment and always-on setup keeps the bot running, and what happens if it crashes or the Repl restarts. I want to actually understand the hosting model, not just trust that it works.
4. Use Replit Secrets for the bot token. Show me where that's configured and explain why it isn't hardcoded in the code.

Constraints:
- {{language_preference}}
- Keep each command handler in its own clearly named file or function — more files I understand beats one big file I don't.
- After it's deployed, give me a short checklist for confirming it's actually live in my server.`,
    variables: [
      {
        name: 'bot_name',
        description: 'The name of the bot.',
        example: 'StudyBot',
        required: true,
      },
      {
        name: 'community_context',
        description: 'Who the bot is for and roughly how big the server is.',
        example: 'a 40-person Discord server for a college study group',
        required: true,
      },
      {
        name: 'command_list',
        description: 'The slash commands the bot should support.',
        example: '/schedule, /remind, /poll',
        required: true,
      },
      {
        name: 'automation_feature',
        description:
          'The scheduled or event-driven behavior beyond replying to commands.',
        example:
          "posts a daily 8am reminder of that day's study-group topic in a fixed channel",
        required: true,
      },
      {
        name: 'language_preference',
        description: 'Your preferred language/library and how familiar you are with it.',
        example:
          "Python with discord.py — I've used Python before but never an async library",
        required: false,
      },
    ],
    targetTools: ['Replit Agent'],
    tags: ['discord-bot', 'automation', 'learn-to-code', 'deployment', 'community-tool'],
    whyItWorks: `A Discord bot is a good test of Replit Agent's real advantage over the other three tools here: because the code and the host are both visible and editable, a prompt that asks it to explain the architecture, the crash-recovery behavior, and the secrets handling turns a "make me a bot" request — which any of these tools could technically fulfill — into something you understand well enough to extend yourself later. That's the entire reason to reach for Replit Agent over Lovable or Bolt.new for an automation project instead of a CRUD app.`,
    exampleOutput: `A deployed, always-on Repl running the bot in your Discord server, a usage-log table you can query, a short written explainer of what happens if the Repl restarts, and the bot token stored in Replit Secrets rather than in code.`,
    verifiedAgainst: [
      {
        tool: 'Replit Agent',
        version: 'Replit Agent (chat-based build mode in Replit)',
        date: '2026-06-20',
      },
    ],
    changelog: [
      {
        date: '2026-06-20',
        note: 'Initial version, added the explicit walkthrough of Replit deployment and crash recovery after a draft that only asked for the commands skipped explaining how the bot stays running.',
      },
    ],
  },
]
