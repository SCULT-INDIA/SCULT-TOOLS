import type { Prompt } from '../types'

/**
 * "Build Apps Without Code" — Lovable, Bolt.new, v0, and Replit Agent prompts.
 * These tools generate a working app (or component) from a single description
 * in one shot, so the initial brief carries more weight than it would in an
 * IDE with ongoing back-and-forth — see docs/research/prompt-library.md §4.
 * 23 prompts, grouped by tool (6 Lovable, 6 Bolt.new, 6 v0, 5 Replit Agent),
 * each targeting a distinct job-to-be-done rather than a reskinned template.
 */
export const prompts: readonly Prompt[] = [
  {
    slug: 'lovable-multitenant-saas-rls-billing',
    category: 'no-code-apps',
    title: 'Scope a multi-tenant B2B SaaS with real tenant isolation and billing',
    description: `A Lovable brief for a multi-tenant SaaS where the row-level-security policy, not the frontend, is what actually stops one organization from reading another's data, plus a billing flow routed through Stripe's own hosted portal.`,
    promptText: `You are building {{product_name}}, a multi-tenant B2B SaaS where every customer signs up as its own isolated {{tenant_noun}}, not a shared account. Treat tenant isolation as the load-bearing requirement of this build, not a detail to add later.

PRODUCT
{{product_name}} is for {{primary_user}}. Each {{tenant_noun}} has its own members, its own data, and its own subscription — no {{tenant_noun}} should ever be able to query, list, or see a row that belongs to another {{tenant_noun}}, even by guessing an ID in the URL.

DATA MODEL
- Organization: id, name, slug, subscription_tier (references the tiers below), stripe_customer_id, created_at.
- Membership: id, organization_id (references Organization), user_id (references auth user), role (owner, admin, or member).
- Invite: id, organization_id (references Organization), email, role, token, expires_at, accepted_at.
- Every other business table in this app — {{core_entities}} — must carry an organization_id column and nothing else may scope access to it.

TENANT ISOLATION RULES
Write a row-level security policy on every business table that filters strictly on organization_id matching a membership row for auth.uid() — never on a client-supplied header, a URL parameter, or a value trusted from the frontend. A user with no accepted Membership row for an organization must get zero rows back from every table scoped to it, not a 403 — the query itself should simply return nothing, because a policy that leaks a count or an error message is still a leak. New Organizations are created only through a proper signup flow that creates the Organization and the creator's owner Membership in one transaction, never as two separate steps a signup could fail between.

BILLING
Subscription tiers: {{subscription_tiers}}. Show the current tier and usage against its limits on a Billing settings page, with a Stripe customer-portal link for upgrades and payment-method changes — do not hand-build a checkout form; route through Stripe's own hosted portal. {{seat_limit_behavior}}

SCREENS
1. Sign up, which creates the Organization and owner Membership together.
2. An invite flow: an admin enters an email and role, generates an Invite row, and the invited person accepts it into a Membership on their next login.
3. A main workspace view scoped to {{core_entities}}.
4. Organization settings: members list with role management, and the Billing page above.
5. A personal-account switcher if a user's email is a member of more than one Organization.

CONSTRAINTS
Primary brand color: {{brand_color}}. Use Lovable's native Supabase integration for auth and the database — do not fake multi-tenancy in client-side state or a single shared table filtered only in the frontend query, since that leaves every row reachable by anyone who opens the network tab. Before calling this done, describe in plain language how you tested that a second Organization's data is actually unreachable, not just hidden by the UI.`,
    variables: [
      {
        name: 'product_name',
        description: 'The name of the SaaS product.',
        example: 'Rosterly',
        required: true,
      },
      {
        name: 'primary_user',
        description: 'Who signs up and uses this day to day.',
        example: 'small agencies scheduling shifts for hourly staff',
        required: true,
      },
      {
        name: 'tenant_noun',
        description: 'The term used for one isolated customer account.',
        example: 'agency',
        required: true,
      },
      {
        name: 'core_entities',
        description: 'The main business tables this app revolves around.',
        example: 'Shift, Employee, and TimeOffRequest',
        required: true,
      },
      {
        name: 'subscription_tiers',
        description: 'The pricing tiers and their limits.',
        example:
          'Starter ($29/mo, up to 10 employees), Growth ($89/mo, up to 50 employees)',
        required: true,
      },
      {
        name: 'brand_color',
        description: 'The primary accent color for the UI.',
        example: '#1F6F5C (deep teal)',
        required: false,
      },
      {
        name: 'seat_limit_behavior',
        description: 'What happens when a tier limit is about to be exceeded.',
        example:
          "When an organization tries to invite past its tier's employee limit, block the invite and show an inline upgrade prompt instead of silently allowing it.",
        required: false,
      },
    ],
    targetTools: ['Lovable'],
    tags: [
      'multi-tenant',
      'saas',
      'row-level-security',
      'stripe-billing',
      'supabase',
      'b2b',
    ],
    whyItWorks: `Lovable's Supabase integration defaults to whatever access pattern the prompt actually specifies, and a vague "make it multi-tenant" request tends to produce filtering only in the frontend query — a .eq('organization_id', currentOrg) clause that is enforceable only if the client behaves itself. Anyone who opens their browser's network tab and edits that request can read every organization's rows, because the underlying Postgres table has no policy stopping them at the database layer; the frontend filter was never a security boundary, just a display convenience. Naming the exact row-level-security predicate — filtered on a real Membership join to auth.uid(), never a client-supplied value — is what forces the model to write the check where it actually matters.

The "zero rows, not a 403" instruction targets how RLS is supposed to behave and why that's correct here: a well-formed policy makes unauthorized rows simply not exist in the result set, indistinguishable from "no data," rather than raising an application-level authorization error. That's the right behavior for tenant isolation specifically, because an error message that says "organization X has no employees" is itself a leak — it confirms organization X exists at all, which a properly scoped query would never reveal to someone outside it. Spelling this out stops the model from reaching for an easier-to-write 403 check that inadvertently confirms more than it should.

Routing billing through Stripe's hosted customer portal rather than a hand-built checkout form is specific to what a Lovable-generated app can safely maintain: Lovable has no PCI-compliant payment form of its own, and an unscoped "build a checkout page" instruction produces either a static form with no real Stripe wiring behind it, or a half-implemented Stripe Elements integration that mishandles the webhook events subscription-state changes actually depend on. Directing the build at the portal sidesteps an entire class of billing bugs the tool has no way to get right unsupervised. Finally, naming the signup-transaction requirement closes a specific race: if Organization creation and owner Membership creation happen as two separate calls, a failure between them — a network blip, a retried duplicate-key insert — leaves an orphaned Organization with no owner and no way back in, a state that's easy to generate and hard to notice until a real signup hits it.`,
    exampleOutput: `A Lovable app where creating a second test organization and logging in as its owner shows zero shifts, employees, or time-off requests from the first organization — even when navigating directly to a first-organization record's URL by ID — and where the Billing page reflects Stripe test-mode subscription state and opens the real Stripe customer portal on click.`,
    verifiedAgainst: [
      {
        tool: 'Lovable',
        version: 'Lovable web app (Supabase-integrated chat builder)',
        date: '2026-07-21',
      },
    ],
    changelog: [
      {
        date: '2026-07-21',
        note: "Initial publish, verified against Lovable's Supabase-integrated builder with explicit RLS-policy and one-transaction-signup requirements.",
      },
    ],
  },
  {
    slug: 'lovable-two-sided-marketplace-stripe-connect',
    category: 'no-code-apps',
    title: 'Build a two-sided marketplace with Stripe Connect payouts',
    description: `A Lovable brief for a two-sided marketplace built on Stripe Connect Express accounts, with the platform fee split at the moment of payment and a hard rule against a listing going live before its provider can actually be paid.`,
    promptText: `Build {{product_name}}, a two-sided marketplace connecting {{supply_side_noun}} with {{demand_side_noun}}, where money actually changes hands through the platform — this is not a lead-gen directory, it is a real transaction flow with a platform fee.

PRODUCT
{{supply_side_noun}} list what they offer; {{demand_side_noun}} pay for it through the app. {{product_name}} takes a {{platform_fee_percent}} cut of every transaction and pays the rest out to the provider.

DATA MODEL
- Provider: id, user_id, display_name, bio, stripe_connect_account_id, connect_onboarding_status (not_started, pending, or complete).
- Listing: id, provider_id (references Provider), title, description, price, is_active.
- Order: id, listing_id (references Listing), buyer_id, provider_id, amount, platform_fee_amount, status (pending, paid, completed, refunded, or disputed), stripe_payment_intent_id, created_at.
- Review: id, order_id (references Order), rating, comment, created_at — only writable once an Order's status is completed.

STRIPE CONNECT FLOW
Use Stripe Connect Express accounts, not standard or custom accounts — Express gives providers a Stripe-hosted onboarding flow, which is the right fit here since this app is not trying to fully white-label the payments experience. When a Provider signs up to sell, generate a Stripe Connect Express onboarding link and redirect them to it; set connect_onboarding_status to pending until Stripe's webhook confirms the account can accept payouts, then flip it to complete. A Listing cannot go live — is_active cannot be set true — while its Provider's connect_onboarding_status is anything other than complete; enforce this in the database, not only by hiding a toggle in the UI. On checkout, create a PaymentIntent with an application_fee_amount equal to {{platform_fee_percent}} of the order total and transfer_data pointing at the provider's connected account, so the split happens inside Stripe's own transfer at the moment of payment rather than as a manual payout step your app has to calculate and trigger later.

TRUST AND SAFETY
Buyers can only leave a Review after their Order reaches completed status — never before, and never on behalf of an order that was refunded or disputed. Give an Order a disputed status path and a simple admin view listing every disputed Order with its Stripe dispute ID, so a human can actually act on it instead of it disappearing into a support inbox.

SCREENS
1. Browse/search listings, filterable by category and price. Seed with sample categories: {{category_examples}}.
2. Listing detail with a "Buy" or "Book" button leading to Stripe Checkout for the actual charge.
3. Provider dashboard: their listings, incoming orders, payout status, and the Connect onboarding link if still incomplete.
4. Buyer order history with review prompts on completed orders.
5. A minimal admin view: all orders, filterable by status, with the disputed-orders list above surfaced first.

CONSTRAINTS
Use Lovable's Supabase integration for the data model and auth; use Stripe Connect Express for payments, not a custom in-app wallet or ledger you'd have to reconcile by hand. {{brand_color}} Do not let a Listing accept payment while its provider's onboarding is incomplete — that single rule is what actually protects you from a payment succeeding with nowhere valid to send the payout.`,
    variables: [
      {
        name: 'product_name',
        description: 'The name of the marketplace product.',
        example: 'Fixly',
        required: true,
      },
      {
        name: 'supply_side_noun',
        description: 'Who supplies the service or listing.',
        example: 'independent home-repair contractors',
        required: true,
      },
      {
        name: 'demand_side_noun',
        description: 'Who books or buys.',
        example: 'homeowners booking one-off jobs',
        required: true,
      },
      {
        name: 'platform_fee_percent',
        description: 'The percentage the platform keeps from every transaction.',
        example: '12%',
        required: true,
      },
      {
        name: 'brand_color',
        description: 'The primary accent color for the UI.',
        example: '#E8562A (burnt orange), warm and trustworthy, not corporate blue',
        required: false,
      },
      {
        name: 'category_examples',
        description: 'Sample listing categories to seed the browse grid.',
        example: 'Plumbing, Electrical, Appliance repair, Painting',
        required: false,
      },
    ],
    targetTools: ['Lovable'],
    tags: [
      'marketplace',
      'stripe-connect',
      'payments',
      'two-sided',
      'saas',
      'trust-and-safety',
    ],
    whyItWorks: `Naming Stripe Connect Express specifically, rather than leaving the account type unspecified, matters because Express is the only Connect account type that ships with Stripe-hosted onboarding and compliance UI built in. A generated app pointed at Custom accounts instead would need to build its own KYC and compliance screens — a job Lovable has no business attempting unsupervised — while Standard accounts hand the provider a full Stripe dashboard that doesn't fit a marketplace trying to keep its own branded experience. Naming Express up front keeps the model inside the one account type that's actually buildable at this scope.

The application_fee_amount plus transfer_data instruction names the real Stripe mechanism for splitting a payment at the moment it's charged. Without it, a generated marketplace is likely to charge the buyer in full and then attempt a manual, separate "payout" step your own code has to calculate and trigger later — which introduces a window where the provider's share sits in your main Stripe balance, uncategorized, waiting on a background job that has to run correctly every time. Splitting the payment inside the PaymentIntent itself removes that entire reconciliation surface, because Stripe does the split as part of the original transaction rather than your app tracking who's owed what.

Blocking is_active at the database level rather than only hiding the "go live" toggle in the UI targets the actual attack surface, not just the visible one. Lovable-generated CRUD apps commonly hide invalid actions in the interface without also blocking them at the write layer, so a request assembled manually — or a stale form submission from before onboarding finished — could still set a listing live before the provider's Connect account can accept a transfer. If that happens, a payment can succeed with no valid destination for the provider's share, which is a worse failure than simply rejecting the listing early: money has already moved, and now it has to be reversed instead of never having been at risk. A database-level check closes that window regardless of which path the request came through.`,
    verifiedAgainst: [
      {
        tool: 'Lovable',
        version: 'Lovable web app (Supabase-integrated chat builder)',
        date: '2026-07-23',
      },
    ],
    changelog: [
      {
        date: '2026-07-23',
        note: 'Initial publish, verified against Lovable with Stripe Connect Express, scoped explicitly to block listings from going live before onboarding completes.',
      },
    ],
  },
  {
    slug: 'lovable-membership-content-gating',
    category: 'no-code-apps',
    title: 'Build a membership community with subscription-tier content gating',
    description: `A Lovable brief for a membership community where tier-gating happens at the query layer so a free member's own API response never contains a paid post's real content, with an explicit grace period for failed payments.`,
    promptText: `Build {{community_name}}, a membership community app where {{topic}} content is gated by subscription tier — free members should never be able to fetch the actual content of a paid post, not just see it blurred by CSS.

PRODUCT
Members join for free and can upgrade to paid tiers to unlock more content and community access. Tiers, low to high: {{tier_list}}.

DATA MODEL
- Member: id, user_id, display_name, current_tier, stripe_subscription_id, subscription_status (active, past_due, or canceled).
- ContentItem: id, title, body_or_video_url, min_tier_required, author_id, published_at. Sample content types: {{sample_content_types}}.
- Post: id, author_id, body, created_at — community discussion posts, visible to all Members regardless of tier.
- Comment: id, post_id (references Post), author_id, body, created_at.
- TierChangeLog: id, member_id, old_tier, new_tier, changed_at, reason (upgrade, downgrade, or payment_failed) — for support visibility into who changed tier and why.

GATING RULES
Gating happens at the data layer, not the presentation layer. Write the query or row-level security policy for ContentItem so that a Member whose current_tier is below a piece of content's min_tier_required never receives that content's body_or_video_url in the response at all — send back the title, a locked flag, and nothing else. A blurred-overlay-on-top-of-the-real-content approach is explicitly wrong here since the real content would still be sitting in the page source or the network response for anyone to read. When subscription_status moves to past_due, treat the Member as their free tier for gating purposes immediately, but do not delete or downgrade their current_tier value until either payment recovers or a grace period of {{grace_period_days}} days elapses — log every transition to TierChangeLog. When a Member downgrades or their payment fails permanently, any comments or posts they already made stay visible to the community exactly as before; only forward-looking content access changes, never their past contributions.

SCREENS
1. Content feed: mixed list of Posts (always visible) and ContentItems (visible in full to eligible tiers, shown as a locked card with a one-line teaser and an "Upgrade to unlock" CTA to everyone else).
2. Individual ContentItem page — if the viewer is below min_tier_required, redirect or render only the locked state, never the real body.
3. Billing/upgrade page listing {{tier_list}} with a Stripe customer-portal link for tier changes.
4. Admin content editor: set min_tier_required per ContentItem on publish, with a live preview of exactly what a free member versus a paid member would each see.
5. Community discussion view for Posts and Comments, unrestricted by tier.

CONSTRAINTS
Use Lovable's Supabase integration for auth, database, and RLS; route tier changes through Stripe's customer portal rather than a custom billing UI. {{brand_note}} Before calling this done, confirm — in plain language — what a free-tier member's raw API response for a VIP-only ContentItem actually contains, not just what the rendered page shows them.`,
    variables: [
      {
        name: 'community_name',
        description: 'The name of the membership community.',
        example: 'Fretwork Collective',
        required: true,
      },
      {
        name: 'topic',
        description: 'What the paid content is actually about.',
        example: 'guitar technique lessons',
        required: true,
      },
      {
        name: 'tier_list',
        description: 'The subscription tiers, low to high.',
        example: 'Free, Member ($12/mo), VIP ($35/mo)',
        required: true,
      },
      {
        name: 'grace_period_days',
        description:
          'How many days a past_due member keeps their current tier before downgrading.',
        example: '5',
        required: true,
      },
      {
        name: 'sample_content_types',
        description: 'What kinds of content items exist.',
        example: 'video lessons and downloadable PDF tab sheets',
        required: false,
      },
      {
        name: 'brand_note',
        description: 'Any branding requirement, or a note that none is needed.',
        example:
          'Warm, slightly rustic palette — this is a hobbyist community, not a corporate LMS.',
        required: false,
      },
    ],
    targetTools: ['Lovable'],
    tags: [
      'membership-site',
      'content-gating',
      'subscription',
      'community',
      'supabase',
      'row-level-security',
    ],
    whyItWorks: `An AI builder given "gate content by tier" with no further instruction very often implements gating as a frontend conditional that blurs or hides a div while still rendering the real body text or video URL into the page's initial HTML or a fetched JSON payload — trivially visible via view-source or the network tab regardless of what the screen shows. Explicitly demanding that the ineligible field itself must not be present in the response, not merely styled as hidden, forces server- or RLS-level filtering: the query for a locked ContentItem has to actually omit body_or_video_url from what it selects for that member, not just from what the component renders.

Naming a past_due grace period rather than instant downgrade addresses a real Stripe subscription lifecycle detail: subscriptions routinely enter past_due before ultimately failing — an expired card, a bank declining a single charge that clears on retry — and yanking access on the very first missed payment is a well-documented driver of unnecessary paid churn. A model given no explicit rule about this treats "not currently active" as "instantly free tier," which is the easy default; stating a grace period explicitly, with its own logged transition reason, stops that default from shipping unexamined.

Preserving past contributions on downgrade closes a specific and easy-to-miss failure mode for a community product: retroactively hiding a comment a now-downgraded member made while they were paid breaks conversation threads other members were following and reads as punitive rather than as a billing consequence. A model with no explicit scope for its access-control logic will tend to apply it uniformly to everything the member ever touched — because that's the simplest implementation — rather than scoping it specifically to future content access, which is the only thing a subscription tier actually governs. Stating this distinction is what keeps the gating rule from quietly overreaching into content it was never meant to control.`,
    exampleOutput: `A free-tier member's fetched response for a VIP-only lesson contains only { title, locked: true } — no body_or_video_url field at all — while the same request from a VIP member returns the full content, confirmed by comparing the two raw network responses side by side rather than just the two rendered screens.`,
    verifiedAgainst: [
      {
        tool: 'Lovable',
        version: 'Lovable web app (Supabase-integrated chat builder)',
        date: '2026-07-25',
      },
    ],
    changelog: [
      {
        date: '2026-07-25',
        note: 'Initial publish, verified against Lovable with query-level content gating and an explicit past_due grace period.',
      },
    ],
  },
  {
    slug: 'lovable-booking-scheduling-app',
    category: 'no-code-apps',
    title: 'Build a booking app with real availability rules and no double-bookings',
    description: `A Lovable brief for a booking app that stores every timestamp in UTC and enforces no-overlap and buffer rules with a real database constraint, not a client-side calendar check that a race condition can slip past.`,
    promptText: `Build {{business_name}}, a booking app for {{service_type}} where a client can only ever book a real, open slot — no double-bookings, no bookings inside a provider's buffer time, and no timezone confusion between the provider and the client.

PRODUCT
Clients pick a provider and a time slot from real availability and book a {{session_duration_minutes}}-minute session. Providers set their own weekly availability and can block off specific dates.

DATA MODEL
- Provider: id, user_id, name, timezone (IANA string, e.g. America/Chicago), bio.
- AvailabilityRule: id, provider_id (references Provider), day_of_week (0-6), start_time, end_time — recurring weekly windows in the provider's own timezone.
- BlockedDate: id, provider_id (references Provider), date, reason — one-off exceptions like a holiday or vacation day.
- Booking: id, provider_id (references Provider), client_id, starts_at (stored as a UTC timestamp, never a naive local time), ends_at, status (confirmed, canceled, or completed), created_at.

AVAILABILITY AND CONFLICT RULES
Store every Booking's starts_at and ends_at in UTC, and convert to and from the provider's or client's local timezone only at the point of display — never store a local time string and hope the offset stays correct. A slot is only bookable if it falls entirely inside an AvailabilityRule window for that day of week, is not covered by a BlockedDate, and does not overlap any existing confirmed Booking for that provider, including a {{buffer_minutes}}-minute buffer before and after every existing booking. Enforce the no-overlap rule with a database constraint or a single atomic check-and-insert transaction, not a client-side calendar check followed by a separate insert — two clients hitting "book" within the same second on the same slot must not both succeed; the second one must see a clear "this slot was just taken" message instead of a silently double-booked provider.

CANCELLATION AND CHANGES
A client can cancel their own booking up until {{cancellation_window_hours}} hours before starts_at; after that window, canceling requires the provider's own action, not the client's self-serve button. Canceling a Booking must immediately free that slot for someone else to book — it is not enough to just mark status canceled if the availability query doesn't also check status when computing open slots.

SCREENS
1. Public booking page: provider picks a date, sees only genuinely open slots (already filtered by all the rules above) rendered in the client's own browser timezone, picks one, confirms.
2. Booking confirmation screen and email showing the time in the client's timezone explicitly labeled with the timezone name, not just a bare time, plus a scannable QR code the client can show at check-in that the provider scans to mark the booking completed instantly.
3. Provider dashboard: weekly availability editor, blocked-date picker, and an upcoming-bookings list.
4. Cancel/reschedule flow respecting the cancellation window above.

CONSTRAINTS
Use Lovable's Supabase integration for auth and the database; enforce the no-overlap rule with a real database-level constraint or transaction, not JavaScript that runs after the fact. {{timezone_note}}`,
    variables: [
      {
        name: 'business_name',
        description: 'The name of the booking business or app.',
        example: 'Northline Tutoring',
        required: true,
      },
      {
        name: 'service_type',
        description: 'What service is being booked.',
        example: 'one-on-one SAT tutoring sessions',
        required: true,
      },
      {
        name: 'session_duration_minutes',
        description: 'How long a standard session lasts.',
        example: '50',
        required: true,
      },
      {
        name: 'buffer_minutes',
        description: 'Required gap before and after every booking.',
        example: '10',
        required: true,
      },
      {
        name: 'cancellation_window_hours',
        description: 'How many hours before a session a client can self-serve cancel.',
        example: '24',
        required: true,
      },
      {
        name: 'timezone_note',
        description: 'Anything specific about the timezone context worth calling out.',
        example:
          'Most tutors are in US Central time but clients book from anywhere, so the timezone label on every confirmation is not optional.',
        required: false,
      },
    ],
    targetTools: ['Lovable'],
    tags: [
      'booking-app',
      'scheduling',
      'timezone-handling',
      'availability',
      'supabase',
      'double-booking-prevention',
    ],
    whyItWorks: `Storing every timestamp in UTC and converting only at display time targets the single most common bug class in AI-generated scheduling apps. A generated app that stores "3:00 PM" as a plain string with no explicit UTC instruction will silently misbehave the moment a provider and client are in different zones, or even within the same zone across a daylight-saving transition — a failure that looks correct in same-timezone manual testing and breaks for the first client anywhere else, which is exactly the testing pattern a one-shot builder tends to run against itself. Naming the storage format explicitly, rather than leaving it implicit in "handle timezones correctly," is what actually gets the UTC-plus-conversion pattern instead of the naive one.

The atomic check-and-insert requirement closes a genuine concurrency race that a naive implementation misses by construction: querying for conflicts, seeing none, then inserting is two separate calls with a window between them where a concurrent booking for the identical slot can slip through undetected by either request. Specifying a single atomic transaction or a database exclusion constraint on the time range is what actually closes that window — and it's exactly the kind of concurrency detail a fast, one-shot generation pass skips unless it's named as a hard requirement rather than an implementation nicety left to the model's judgment.

Folding buffer time into the same overlap check, rather than treating it as a separate step, prevents it from becoming an inconsistently enforced afterthought. If buffer isn't part of the single conflict query, a generated app frequently implements it as a second check applied only on the client-facing booking form — and forgotten on the path where a provider manually adds a booking from their own dashboard, where the same underlying conflict rule should still apply but often silently doesn't, because it was written as a second, separate piece of logic instead of one shared rule both paths call.`,
    exampleOutput: `Two browser tabs both clicking "confirm" on the identical 2:00 PM slot within the same second — one succeeds with a confirmed booking, the other immediately sees "this slot was just taken" and is shown the next genuinely open slot, with the provider's calendar never showing two overlapping bookings.`,
    verifiedAgainst: [
      {
        tool: 'Lovable',
        version: 'Lovable web app (Supabase-integrated chat builder)',
        date: '2026-07-27',
      },
    ],
    changelog: [
      {
        date: '2026-07-27',
        note: 'Initial publish, verified against Lovable with UTC-only timestamp storage and a database-level no-overlap constraint.',
      },
    ],
    relatedToolSlug: 'qr-code-generator',
  },
  {
    slug: 'lovable-internal-ops-dashboard-existing-schema',
    category: 'no-code-apps',
    title: 'Build a read-only ops dashboard on top of an existing production database',
    description: `A Lovable brief for connecting a dashboard to an existing production database through a read-only role, with an explicit rule against inventing a column that isn't actually in the schema.`,
    promptText: `Build {{dashboard_name}}, a read-only internal dashboard on top of an EXISTING production database — you are not designing the data model, you are visualizing one that already exists and must not be altered.

EXISTING SCHEMA
The dashboard reads from these tables, exactly as they exist today — do not rename a column, do not add a migration, and do not assume a field exists that isn't listed here:
{{existing_schema}}

CONNECTION AND ACCESS
Connect using a read-only database role or a read replica connection string, never the primary write credentials — {{db_connection_note}}. If Lovable's setup flow only offers a single connection string with write access, explicitly note that risk back to me rather than silently proceeding, since this dashboard should be structurally incapable of writing to production even if a bug in the generated code tried to.

WHAT TO BUILD
1. A landing view: {{key_metrics}}, each as a card with the current value and a simple trend indicator against the prior period.
2. {{primary_table_view}} — a filterable, sortable table view over the real data, with pagination; assume the table can hold hundreds of thousands of rows, so every query must use the existing indexes and a LIMIT, never a full table scan into the browser.
3. A drill-down page for a single record showing its related rows across the other tables listed above, joined the way the existing foreign keys actually define, not a guessed relationship.
4. A CSV export button on the table view, scoped to whatever filters are currently applied, not a silent full-table dump.

CONSTRAINTS
Every query this dashboard runs must be read-only — no INSERT, UPDATE, DELETE, or DDL statement anywhere in the generated code, including in any Edge Function or server action. Do not add authentication to the underlying database itself; auth for who can view this dashboard is handled separately at {{dashboard_auth_layer}}. If a screen I've asked for would require a field or table that isn't in the schema above, stop and tell me exactly what's missing instead of inventing a plausible-looking column name and building against it — a dashboard that silently reads from a column that doesn't exist in production will fail the moment it's pointed at the real database instead of a design-time guess.

REVIEW BEFORE SHIPPING
Before calling this done, list every query the dashboard runs against the production schema in one place, so I can review each one for whether it's genuinely read-only and whether it's going to be slow against real data volume, not just against however much sample data Lovable seeded during the build.`,
    variables: [
      {
        name: 'dashboard_name',
        description: 'The internal name of the dashboard.',
        example: 'Ops Console',
        required: true,
      },
      {
        name: 'existing_schema',
        description: 'The real tables and columns this dashboard must read from.',
        example:
          'orders(id, customer_id, status, total_cents, created_at), customers(id, email, name, created_at), order_items(id, order_id, sku, qty, unit_price_cents) — Postgres 15, orders.customer_id references customers.id, order_items.order_id references orders.id',
        required: true,
      },
      {
        name: 'db_connection_note',
        description: 'The specific read-only credential or replica to connect through.',
        example:
          'use the read-only reporting replica connection string in an env var named REPORTING_DB_URL, not the primary DATABASE_URL',
        required: true,
      },
      {
        name: 'key_metrics',
        description: 'The top-line numbers to show on the landing view.',
        example:
          'orders today, gross revenue this week, average order value, count of orders still in pending status',
        required: true,
      },
      {
        name: 'primary_table_view',
        description: 'Which existing table gets the main filterable table screen.',
        example: 'the orders table',
        required: true,
      },
      {
        name: 'dashboard_auth_layer',
        description:
          'Where login/access control for viewing the dashboard actually lives.',
        example:
          'a separate company SSO gate in front of the whole dashboard URL, outside of Lovable',
        required: true,
      },
    ],
    targetTools: ['Lovable'],
    tags: [
      'internal-tool',
      'existing-database',
      'read-only',
      'postgres',
      'data-governance',
      'admin-dashboard',
    ],
    whyItWorks: `Lovable's default posture, when it builds a data-backed app from scratch, is to design and own the schema itself — that's the normal, well-supported path. Handing it an existing schema and forbidding migrations means fighting that default directly, which is why the "do not add a migration, do not invent a column" rule has to be explicit and specifically triggered at the moment a requested screen doesn't map cleanly onto the given schema. Left unscoped, the natural move for a generation pass hitting a missing field is simply to add it — the tool has no way to know that "add the column it needs" is exactly the wrong move against a database it doesn't own.

Naming a read-only role or replica, rather than trusting the generated code to simply "not write," targets the actual security boundary correctly. Code-level promises not to write are advisory, not enforced: a generated app connected with write-capable credentials is one bug away — or one future prompt asking for an "edit" feature down the line — from a mutation against production. A database-enforced read-only role fails closed even if the application code above it is wrong, which is a meaningfully stronger guarantee than "the current prompt didn't ask it to write anything."

Forcing pagination and index-aware queries addresses a failure mode specific to how design-time testing works inside a builder like this. Lovable seeds and previews against whatever sample data exists during the build, which is typically small, so a query pattern that looks instant in the builder's own preview — an unindexed scan, no LIMIT clause — can be catastrophically slow the moment it's pointed at hundreds of thousands of real rows. That failure is invisible for the entire build session and only surfaces the first time a real user opens the dashboard against real production volume, which is precisely the wrong moment to discover it.`,
    exampleOutput: `A written list of every SQL query the dashboard runs — for example, "orders table view: SELECT id, customer_id, status, total_cents, created_at FROM orders WHERE status = $1 ORDER BY created_at DESC LIMIT 50 OFFSET $2, using the existing idx_orders_status index" — ready for a human to review for read-only correctness and index usage before the dashboard is pointed at real production data.`,
    verifiedAgainst: [
      {
        tool: 'Lovable',
        version: 'Lovable web app (Supabase-integrated chat builder)',
        date: '2026-07-29',
      },
    ],
    changelog: [
      {
        date: '2026-07-29',
        note: 'Initial publish, verified against Lovable connected to an external read-only Postgres role with an explicit no-invented-columns rule.',
      },
    ],
  },
  {
    slug: 'lovable-schema-migration-add-feature',
    category: 'no-code-apps',
    title:
      'Add a feature to a live Lovable app without breaking existing data or access rules',
    description: `A Lovable brief for extending a live app already holding real user data, structured around additive-only schema changes and a written before/after for any row-level-security policy the new feature touches.`,
    promptText: `You are adding a feature to {{app_name}}, an existing Lovable app already in use by real users with real data — this is a migration, not a fresh build, and existing rows, existing RLS policies, and existing user sessions must all keep working through the change.

CURRENT STATE
Existing tables and their relevant columns: {{current_schema}}
Existing row-level security policies I know about: {{current_rls_summary}}
Current live user count / data volume, roughly: {{data_volume}}

NEW FEATURE
{{feature_description}}

MIGRATION RULES
Treat this as an additive change wherever possible — new tables and new nullable columns on existing tables — rather than renaming or dropping anything that existing code or existing RLS policies reference; a rename that isn't caught everywhere it's used breaks in production, not in preview. If a column genuinely must change type or meaning, write the migration as widen-then-backfill-then-narrow across separate steps, not a single destructive ALTER that could fail partway through and leave the table in a broken intermediate state. Any new table this feature introduces needs its own explicit row-level security policy from the moment it's created — do not let the feature go live with a business table that has RLS disabled, even temporarily "just for testing," since a table with RLS disabled on a production Supabase project is fully public to anyone who can reach the API. If the new feature changes what an existing RLS policy should allow — for example, a feature that introduces shared access to something that used to be strictly private to one user — write out the exact before-and-after policy logic in plain language before touching the policy itself, so the change in who can see what is a deliberate, reviewed decision, not a side effect of adding an unrelated feature.

ROLLOUT AND SAFETY
Assume real users are on this app right now — do not delete or truncate any existing table as part of building this feature, even a table you believe is now unused; leave it in place and tell me it looks unused so I can decide separately. If the feature needs a one-time backfill of existing rows (setting a new column's initial value based on old data), describe the backfill as its own explicit step with what it does to existing rows, and confirm it's safe to run more than once without duplicating or corrupting data, in case it needs to be re-run.

WHAT TO BUILD
{{screens_or_flows_needed}}

OUTPUT
Before writing any code, list: every schema change, in the order you'd apply them; every RLS policy that's new or modified, with the plain-language before/after; and anything from the current state above that this feature touches indirectly and might affect in a way I haven't asked about. Wait for me to confirm that list before generating the actual screens and queries.`,
    variables: [
      {
        name: 'app_name',
        description: 'The existing Lovable app being extended.',
        example: 'Clientflow',
        required: true,
      },
      {
        name: 'current_schema',
        description: 'The relevant existing tables and columns as they exist today.',
        example:
          'clients(id, owner_id, name, email), projects(id, client_id, owner_id, title, status)',
        required: true,
      },
      {
        name: 'current_rls_summary',
        description:
          'A plain-language summary of what access the current RLS policies allow.',
        example:
          'both tables filter strictly on owner_id = auth.uid() — single-user ownership only, no sharing between users today',
        required: true,
      },
      {
        name: 'data_volume',
        description: 'Roughly how much real data and how many real users exist today.',
        example: '340 signed-up users, roughly 2,900 client rows total',
        required: false,
      },
      {
        name: 'feature_description',
        description: 'What the new feature actually needs to do.',
        example:
          'Let an owner invite a second teammate to view (not edit) their clients and projects — a lightweight read-only collaborator role, not full multi-user ownership',
        required: true,
      },
      {
        name: 'screens_or_flows_needed',
        description: 'The specific screens or flows this feature adds.',
        example:
          'An "Invite a viewer" button on the settings page that sends an invite by email, and a banner on the dashboard for an accepted viewer showing whose data they are viewing',
        required: true,
      },
    ],
    targetTools: ['Lovable'],
    tags: [
      'schema-migration',
      'iterative-development',
      'row-level-security',
      'production-app',
      'feature-rollout',
      'supabase',
    ],
    whyItWorks: `A chat-based app builder generating the whole affected slice of an app fresh from a conversation has a natural instinct to regenerate a table definition wholesale to fit a new feature cleanly — that instinct reads great in the builder's own preview, where tables are empty or lightly seeded, and is destructive the moment it runs against a table with real rows in it. Explicitly demanding additive, nullable-first changes, and a widen-then-backfill-then-narrow path for anything that genuinely can't stay additive, closes that gap by naming the specific migration shape the model should reach for instead of the wholesale-regeneration shape it defaults to.

Requiring a written before/after for any RLS policy that changes what's shared targets the single highest-consequence class of bug in exactly this kind of change. An ownership model moving from single-user to shared is precisely the change most likely to accidentally over-broaden a policy — a rewritten policy meant to add one specific collaborator that ends up loose enough to let any authenticated user in, because "any authenticated user" and "this one accepted collaborator" can look like the same SQL predicate if the join condition isn't written carefully. Writing the intended behavior in plain language before touching SQL creates something a human can actually verify against, instead of trusting a generated policy is correct because it looks plausible.

The "wait for confirmation before generating code" instruction matters specifically because a Lovable chat session that goes straight from a feature request to full implementation gives you nothing to review before the change is already live in the connected Supabase project — there's no separate staging step by default. Forcing a plan-then-pause turns a one-shot, already-applied generation into something with an actual review gate, which is the entire difference between an experiment run against a copy of the data and a production change made directly against real users' rows.`,
    verifiedAgainst: [
      {
        tool: 'Lovable',
        version: 'Lovable web app (Supabase-integrated chat builder)',
        date: '2026-07-31',
      },
    ],
    changelog: [
      {
        date: '2026-07-31',
        note: 'Initial publish, verified against Lovable with an additive-only migration path and a mandatory plan-before-code review gate.',
      },
    ],
  },
  {
    slug: 'bolt-new-ecommerce-storefront-cart-prototype',
    category: 'no-code-apps',
    title: 'Build an e-commerce storefront with a real cart and a Stripe test checkout',
    description: `A Bolt.new brief for a storefront where the cart total, tax, and one coupon code all compute from a single shared state, ending in a clearly labeled test-mode Stripe checkout or an explicitly-named mock fallback.`,
    promptText: `Build a storefront web app for {{store_name}}, selling {{product_category}}, using Bolt.new. This needs a real, working shopping cart with correct math — not a UI mockup where the numbers don't actually update.

CATALOG
{{catalog_description}} Store the catalog as a static array or JSON file inside the project, not hardcoded duplicated inline inside multiple components — one source of truth the cart and product pages both read from.

CART BEHAVIOR — THIS IS THE PART THAT HAS TO ACTUALLY WORK
- Adding an item to the cart, adjusting its quantity, and removing it must all update a single shared cart state that persists across a page reload — use localStorage as the persistence layer, since Bolt.new has no database of its own to fall back on for this.
- The cart total must recompute correctly every time: {{tax_rate}}% tax applied after any discount, not before, and a running subtotal, discount line, tax line, and grand total all shown separately, not just a single final number.
- Support one coupon code, {{coupon_code}}, which applies a {{discount_description}} — show an inline error for an invalid code, and show the applied discount as its own line item, not folded silently into the item prices.
- If {{product_category}} items have a quantity_available field, decrement it visually in the cart (never let the cart quantity stepper go above what's available) — but since there's no real backend, do not pretend this is a real inventory system; a comment in the code should note that this is a display-only stock limit, not enforced server-side.

CHECKOUT
- A checkout page collecting shipping details and showing the final order summary from the cart above.
- Wire the "Pay" button to Stripe Checkout in TEST MODE ONLY, using a publishable test key — never a live key — and clearly label the page as a test-mode demo. If Stripe isn't connected, build the button to show a mock "Payment succeeded" confirmation screen instead, and say explicitly in your output which of the two you built.
- On successful (or mock) payment, clear the cart from localStorage and show an order confirmation with the items and total that were just purchased, pulled from the state at time of purchase, not recomputed from the now-empty cart.

CONSTRAINTS
No user accounts or login — this is a guest-checkout-only storefront. {{visual_style}} Keep all state management in a single cart context or store so the header cart-count badge, the cart page, and the checkout page can never disagree about what's actually in the cart.`,
    variables: [
      {
        name: 'store_name',
        description: 'The name of the storefront.',
        example: 'Northgrove Coffee',
        required: true,
      },
      {
        name: 'product_category',
        description: 'What kind of product is being sold.',
        example: 'bagged whole-bean coffee',
        required: true,
      },
      {
        name: 'catalog_description',
        description: 'What products exist and their prices.',
        example:
          '8 products: 4 single-origin bags ($16-$22) and 4 blends ($14-$18), each with a name, roast level, and one product photo',
        required: true,
      },
      {
        name: 'tax_rate',
        description: 'The sales tax percentage to apply.',
        example: '8.25',
        required: true,
      },
      {
        name: 'coupon_code',
        description: 'The one coupon code the storefront should accept.',
        example: 'FIRSTBAG10',
        required: false,
      },
      {
        name: 'discount_description',
        description: 'What the coupon code actually discounts.',
        example: '10% off the subtotal',
        required: false,
      },
      {
        name: 'visual_style',
        description: 'The overall visual direction.',
        example:
          'warm cream background, deep brown accent, one large product photo per card',
        required: false,
      },
    ],
    targetTools: ['Bolt.new'],
    tags: [
      'ecommerce',
      'shopping-cart',
      'stripe-checkout',
      'localstorage',
      'frontend-state',
      'prototype',
    ],
    whyItWorks: `A "build a shopping cart" prompt with no shared-state instruction commonly produces a Bolt.new app where the header badge, the cart drawer, and the checkout page each hold their own copy of the cart array, updated inconsistently by whichever handler happens to fire first during generation. The badge says three items while the cart page shows two — a bug invisible in whatever single click-path the model happened to test against itself, and immediately visible to a real person clicking around in a different order. Naming a single shared cart context as a hard constraint is what prevents three independently-generated pieces of UI from drifting out of sync with each other.

The tax-after-discount ordering closes a genuinely common arithmetic ambiguity: whether tax is computed on the pre-discount or post-discount subtotal changes the final total by a real amount, and a generated cart with no stated order will pick one silently and inconsistently if the coupon logic and the tax logic happen to get written in separate passes of the same build conversation — one path applying tax first, the other applying the discount first, producing two different totals for the identical cart depending on which code path executes.

The test-mode-only, explicitly-branching Stripe instruction addresses Bolt.new's real constraint directly. Because it runs inside a StackBlitz WebContainer with no backend server of its own, a genuine Stripe integration needs a server endpoint to create a PaymentIntent while holding a secret key safely — something a pure-frontend WebContainer session structurally cannot do without an external server piece. Naming the test-key-only path, and requiring the model to state plainly which of the two branches — real Stripe test mode or a mock confirmation screen — it actually built, stops it from silently faking a "Payment succeeded" screen while implying a real integration exists underneath it, which is the single most common way a Bolt.new checkout demo ends up misleading whoever it's shown to next.`,
    verifiedAgainst: [
      {
        tool: 'Bolt.new',
        version: 'Bolt.new web app (StackBlitz WebContainers)',
        date: '2026-07-22',
      },
    ],
    changelog: [
      {
        date: '2026-07-22',
        note: 'Initial publish, verified against Bolt.new with a single shared cart context and an explicit test-mode-vs-mock Stripe branch.',
      },
    ],
  },
  {
    slug: 'bolt-new-csv-api-dashboard-charts',
    category: 'no-code-apps',
    title: 'Turn a CSV export into an interactive, privacy-safe dashboard',
    description: `A Bolt.new brief for a browser-only CSV dashboard that validates the file, skips and counts malformed rows instead of silently propagating NaN, and never transmits the parsed data anywhere.`,
    promptText: `Build a data dashboard in Bolt.new that turns a CSV file into interactive charts entirely in the browser — no upload to any server, no backend, since the data in this file is {{data_sensitivity_note}} and should never leave the user's machine.

INPUT
The user drops or selects a CSV file with these columns: {{csv_columns}}. Parse it client-side with a CSV parsing library, not a hand-rolled split(','), — real CSVs have quoted fields containing commas, and a naive split silently corrupts those rows instead of erroring on them.

DATA HANDLING RULES
Validate the file before charting anything: if a required column from the list above is missing, show a clear error naming exactly which column is missing rather than crashing or silently charting nothing. If a row has a malformed value in a numeric column — text where a number is expected, an empty cell — exclude that row from calculations and show a count of how many rows were skipped and why, rather than letting one bad row silently turn a sum into NaN across the whole dashboard. Assume the file could be large — {{expected_row_count}} rows is the realistic upper bound — so parse and aggregate in a way that doesn't freeze the browser tab; if the parsing library supports streaming or chunked parsing, use it rather than loading the whole file into one array before any processing starts.

CHARTS TO BUILD
1. {{primary_metric}} over time as a line chart, bucketed by {{time_bucket}}.
2. A breakdown of {{primary_metric}} by {{category_column}} as a bar chart, sorted descending, with a "show top 10, group the rest as Other" behavior if there are more than 10 distinct categories.
3. A summary row of stat cards above the charts: total {{primary_metric}}, average per {{time_bucket}}, and the single highest {{time_bucket}} by value.
4. A raw data table below the charts, sortable by column, with the skipped-row count from above shown as a small note, not hidden.

INTERACTIVITY
Let the user filter by a date range and by one category value from {{category_column}}; every chart and stat card above must update together when a filter is applied — never let the line chart reflect the filter while the bar chart still shows the unfiltered set.

CONSTRAINTS
This is entirely client-side — no fetch call to any external endpoint with the parsed data, ever. If the file is dropped, do not persist it anywhere beyond the current browser session; a page reload can reasonably clear the dashboard and ask for the file again. {{visual_style}}`,
    variables: [
      {
        name: 'data_sensitivity_note',
        description: 'Why the data in the file should never leave the browser.',
        example: 'internal payroll data',
        required: true,
      },
      {
        name: 'csv_columns',
        description: 'The exact columns the CSV file contains.',
        example: 'date, department, employee_count, total_hours, overtime_hours',
        required: true,
      },
      {
        name: 'expected_row_count',
        description: 'A realistic upper bound on file size.',
        example: 'around 15,000',
        required: false,
      },
      {
        name: 'primary_metric',
        description: 'The main numeric column to chart.',
        example: 'total_hours',
        required: true,
      },
      {
        name: 'time_bucket',
        description: 'How to group the time-series chart.',
        example: 'week',
        required: true,
      },
      {
        name: 'category_column',
        description: 'Which column to break the bar chart down by.',
        example: 'department',
        required: true,
      },
      {
        name: 'visual_style',
        description: 'The overall visual direction.',
        example: 'clean and neutral, one accent blue, no illustrations',
        required: false,
      },
    ],
    targetTools: ['Bolt.new'],
    tags: [
      'data-visualization',
      'csv-parsing',
      'client-side',
      'privacy',
      'charts',
      'dashboard',
    ],
    whyItWorks: `Explicitly naming a real CSV parsing library instead of a naive split closes a specific corruption bug, not a stylistic preference. Real-world CSVs routinely contain quoted fields with embedded commas or newlines — an address field, a free-text note column — and a hand-rolled comma-split silently misaligns every column after the first quoted-comma field it hits, rather than throwing an error at the point of failure. That's a silent corruption bug invisible unless someone happens to check the exact row where it starts, and a vague "parse the CSV" instruction gives the model no reason to reach for a real parser over the simpler split it would otherwise default to.

Skipping and counting malformed rows, instead of letting a bad value propagate, addresses how JavaScript's numeric coercion actually behaves: Number("") evaluates to 0 and Number("abc") evaluates to NaN, and once a single NaN enters a running sum, every downstream aggregate touching it becomes NaN too, silently. A dashboard showing "Total: NaN" is at least visibly broken and gets noticed immediately; a dashboard where one bad row out of fifteen thousand makes an average subtly wrong — because it was excluded inconsistently in one chart's calculation but not another's — produces a wrong-but-confident number, which is the more dangerous failure of the two.

The client-side-only constraint is the actual reason to reach for a browser-only prototyping tool for this exact job in the first place. For genuinely sensitive data like payroll or health records, a dashboard that never transmits the parsed rows anywhere is a meaningfully different privacy posture than one that uploads the file to a backend for processing — and stating this as a hard constraint, not just an implementation preference, stops the model from reaching for a "simpler" server-side parsing route the moment the file size or chart complexity makes client-side processing feel harder to write, which would quietly violate the entire reason this approach was chosen.`,
    verifiedAgainst: [
      {
        tool: 'Bolt.new',
        version: 'Bolt.new web app (StackBlitz WebContainers)',
        date: '2026-07-24',
      },
    ],
    changelog: [
      {
        date: '2026-07-24',
        note: 'Initial publish, verified against Bolt.new with client-only CSV parsing and an explicit skipped-row count.',
      },
    ],
  },
  {
    slug: 'bolt-new-figma-screenshot-to-prototype',
    category: 'no-code-apps',
    title: 'Turn a Figma design or screenshot into a working prototype',
    description: `A Bolt.new brief for recreating a static Figma frame or screenshot as a working prototype, with a hard rule that anything not visible in the source gets flagged as a gap, never quietly invented and presented as a match.`,
    promptText: `Recreate the attached design as a working, responsive web prototype in Bolt.new. Match it closely — this is a fidelity exercise, not "get the general idea across."

DESIGN SOURCE
{{design_source}}

WHAT'S ACTUALLY IN THE DESIGN
The design shows {{screens_included}}. Treat anything not shown in it as genuinely unspecified — do not invent a mobile layout, an empty state, or a hover state that isn't visible in the source and present it as if it came from the design; build only what's shown, and flag every gap you had to fill in separately from the parts that are a direct match.

FIDELITY RULES
Match spacing, type scale, and color as closely as the source allows — {{color_values}} if you have exact hex values, use them exactly; if you're estimating from a screenshot, say which values are estimates rather than presenting a guessed color as if it were specified. Match the actual layout structure — if the design uses a 12-column grid with specific gutters, build that grid, don't approximate it with a generic flex layout that happens to look similar at one viewport width and diverges at others. Reproduce real component states shown in the source (a button's hover or disabled state, an input's error state) exactly as shown — if the source only shows one state of a given element, note that as a gap rather than inventing the other states from a generic design-system instinct.

RESPONSIVE BEHAVIOR
The source is a single static {{source_format}}, which by definition only shows one breakpoint. For breakpoints not shown at all, apply these explicit rules rather than guessing: {{responsive_rules}}. State plainly, screen by screen, what you had to decide for a breakpoint the source didn't cover, so it's clear which parts of the responsive behavior are a real match to a design decision and which are your own reasonable default.

INTERACTIVITY
{{interactivity_needed}} Anything clickable in the design that doesn't have a defined destination in this brief should navigate somewhere plausible within the prototype rather than being a dead link — but note every destination you had to invent so it can be corrected.

CONSTRAINTS
Use {{tech_stack}}. Keep the DOM structure reasonably semantic — real headings, real button and link elements — rather than a wall of generic divs with inline styles, since a prototype this close to final should be able to become production code with normal cleanup, not a full rewrite. Name the actual font family if it's identifiable in the source, or say explicitly that you substituted a close system-font equivalent because the real one couldn't be confirmed from a static image alone.`,
    variables: [
      {
        name: 'design_source',
        description: 'The design being recreated.',
        example:
          'a Figma file link with 4 frames: Landing, Pricing, Login, and Dashboard, all at desktop 1440px width',
        required: true,
      },
      {
        name: 'screens_included',
        description: 'What the source actually shows.',
        example:
          'Landing, Pricing, Login, and Dashboard, each at one desktop breakpoint only',
        required: true,
      },
      {
        name: 'color_values',
        description: 'Exact color values if known.',
        example:
          'primary #1A73E8, text #1F2937, background #F9FAFB — pulled directly from the Figma inspector panel',
        required: false,
      },
      {
        name: 'source_format',
        description: 'What kind of static source this is.',
        example: 'Figma frame at 1440px',
        required: true,
      },
      {
        name: 'responsive_rules',
        description: 'Explicit rules for breakpoints the source does not show.',
        example:
          'stack any multi-column section to a single column below 768px, keep the nav collapsing into a hamburger menu below 900px',
        required: true,
      },
      {
        name: 'interactivity_needed',
        description: 'What clicking around the prototype should actually do.',
        example:
          'Login should navigate to Dashboard on submit with any input; Pricing CTA buttons should scroll to or navigate to Login',
        required: false,
      },
      {
        name: 'tech_stack',
        description: 'The framework and styling approach to build with.',
        example: 'React with Tailwind CSS',
        required: true,
      },
    ],
    targetTools: ['Bolt.new'],
    tags: [
      'design-to-code',
      'figma',
      'prototyping',
      'responsive-design',
      'fidelity',
      'frontend',
    ],
    whyItWorks: `The explicit distinction between "shown in the source" and "invented" targets a specific and common failure of design-to-code generation: when a model is asked to "match this design" from a single static frame, it fills every gap the source doesn't cover with plausible-looking defaults and presents the entire result with equal confidence, so a reviewer comparing the output to the original can't tell which parts are a real match and which are the model's own invention until they go pixel-hunting through it. Requiring the gaps to be named separately turns an unverifiable "looks about right" into a checklist a designer can actually review line by line.

Distinguishing exact hex values from estimated colors addresses a concrete accuracy gap: a color sampled by a model from a compressed screenshot or a rendered preview image is an estimate, not a measurement, and can be off by enough to fail a brand-consistency check even though it looks identical to the eye on a different monitor's color profile. Explicitly separating "given exact values" from "estimated from the image" is what stops a plausible-looking guess from being treated as a specification someone might later rely on for an actual brand asset.

Naming explicit responsive rules for viewports the static source doesn't show closes the single largest gap in any static-image-to-prototype workflow: a Figma frame or screenshot is definitionally one viewport width, so anything about how the layout behaves at any other width is not actually "in the design" at all — it was never specified by anyone. A model not told this will invent a mobile layout from generic responsive-design instinct and present it with the same confidence as the parts genuinely traced from the source, when it's really a separate design decision nobody has actually made yet, and treating it as equally authoritative to the traced parts is exactly the kind of confusion this prompt's gap-flagging rule exists to prevent.`,
    verifiedAgainst: [
      {
        tool: 'Bolt.new',
        version: 'Bolt.new web app (StackBlitz WebContainers)',
        date: '2026-07-26',
      },
    ],
    changelog: [
      {
        date: '2026-07-26',
        note: 'Initial publish, verified against Bolt.new with an explicit shown-versus-invented distinction for every unspecified breakpoint and state.',
      },
    ],
  },
  {
    slug: 'bolt-new-realtime-collab-whiteboard',
    category: 'no-code-apps',
    title: 'Build a realtime multiplayer whiteboard and know where it breaks',
    description: `A Bolt.new brief for a realtime collaborative whiteboard that names one explicit sync mechanism, one explicit conflict-ordering strategy, and states honestly what breaks first past its stated scale.`,
    promptText: `Build a realtime collaborative whiteboard prototype in Bolt.new where {{concurrent_users}} people can draw on the same canvas at once and see each other's strokes appear live.

CORE INTERACTION
A shared canvas where each connected user can draw freehand strokes in their own assigned color, see a live cursor position for every other connected user labeled with their name, and see strokes from other users appear within roughly {{latency_target}} of being drawn, not after a page refresh. Drawing tools: {{canvas_tools}}.

REALTIME TRANSPORT — NAME THE ACTUAL MECHANISM
Bolt.new's WebContainer has no realtime server of its own, so pick one explicit mechanism and use only that one: {{realtime_backend}}. Every stroke event and cursor-position update goes through this single channel — do not build a hybrid where some updates go through the realtime channel and others are inferred from local state, since that's exactly how two users' boards silently drift out of sync with each other.

CONFLICT AND ORDERING RULES
State plainly which of these two behaviors you're building, since they produce different results under real concurrent use: (a) last-stroke-wins on any shared object, appropriate here since strokes are additive and don't really "conflict" with each other the way, say, two people editing the same text field would, or (b) an explicit ordering by a server-assigned sequence number so every client renders strokes in the same final order even if network latency delivered them out of order. For a drawing app, additive strokes rendered in receipt order per client is normally fine — call this out explicitly rather than silently reaching for a more complex CRDT approach the app doesn't actually need.

DISCONNECTION AND REJOIN
When a user's connection drops, their cursor should disappear from other users' views within a few seconds — via a presence heartbeat or timeout, not by staying stuck on screen forever. When a user reconnects or a new user joins mid-session, they must see the current full state of the board, not just strokes drawn after they joined — this needs either a periodic snapshot of the canvas state or a full stroke-history replay on join; name which one you're building.

HONEST LIMITATIONS
{{expected_scale}} is the realistic upper bound for this prototype. State plainly, in your own output, what would actually break first if usage grew past that — the realtime channel's message rate, the size of the stroke history being replayed to new joiners, or something else — rather than presenting this as infinitely scalable just because it works in a two-tab test.

CONSTRAINTS
{{visual_style}} Skip user accounts — a name entered on join is enough identity for this prototype.`,
    variables: [
      {
        name: 'concurrent_users',
        description: 'How many people should be able to draw at once.',
        example: 'up to 8',
        required: true,
      },
      {
        name: 'latency_target',
        description: 'How quickly a stroke should appear on other screens.',
        example: 'half a second',
        required: false,
      },
      {
        name: 'realtime_backend',
        description: 'The one explicit realtime transport to build against.',
        example:
          'Supabase Realtime channels (broadcast, not the Postgres changes feed) connected directly from the Bolt.new frontend',
        required: true,
      },
      {
        name: 'expected_scale',
        description: 'The realistic usage ceiling for this prototype.',
        example: '8 concurrent users on one board, sessions under 30 minutes',
        required: true,
      },
      {
        name: 'canvas_tools',
        description: 'The drawing tools the whiteboard needs beyond a basic pen.',
        example: 'pen, eraser, and a color picker with 6 preset colors',
        required: false,
      },
      {
        name: 'visual_style',
        description: 'The overall visual direction.',
        example: 'plain white canvas, minimal floating toolbar, no branding chrome',
        required: false,
      },
    ],
    targetTools: ['Bolt.new'],
    tags: [
      'realtime',
      'websockets',
      'supabase-realtime',
      'collaboration',
      'prototype',
      'multiplayer',
    ],
    whyItWorks: `Naming one explicit realtime mechanism, rather than letting the model choose or invent a hybrid, addresses a specific WebContainer limitation directly: Bolt.new's browser-based dev environment has no persistent server process of its own to run a WebSocket server on, so "realtime" here has to mean connecting out to an external realtime service such as Supabase Realtime or a hosted channel provider. An unscoped "make it realtime" prompt is likely to produce a plausible-looking implementation that actually just updates local state optimistically without a real shared channel underneath — which looks correct with two tabs open on one machine and does nothing for a second real user on a different device.

The last-write-wins-versus-sequence-number framing matters because these two choices produce genuinely different bugs under real network jitter. Without an explicit choice, a generated realtime app frequently ends up with an implicit, untested ordering assumption that happens to work when both users share a fast, low-latency connection and produces a visibly diverging canvas the moment one user has meaningfully higher latency than the other — a bug that's specifically hard to catch during a same-room demo, where both testers are on the same network. Naming which strategy is intentional turns an invisible assumption into a stated, checkable design decision someone can actually verify against real conditions.

Requiring an honest answer about what breaks first past the stated scale directly counters the tendency of a single quick manual test to stand in for a scale claim it can't actually support. A prototype that works flawlessly with two tabs open on one laptop has validated approximately nothing about real concurrent users on different networks and devices, and naming the actual likely bottleneck — a realtime channel's message-rate limit, or an ever-growing stroke history replayed in full to every new joiner — gives whoever inherits this prototype a concrete, testable prediction instead of an unfounded assumption that it will probably just scale fine.`,
    verifiedAgainst: [
      {
        tool: 'Bolt.new',
        version:
          'Bolt.new web app (StackBlitz WebContainers, Supabase Realtime integration)',
        date: '2026-07-28',
      },
    ],
    changelog: [
      {
        date: '2026-07-28',
        note: 'Initial publish, verified against Bolt.new with Supabase Realtime broadcast channels and an explicit stated scale ceiling.',
      },
    ],
  },
  {
    slug: 'bolt-new-chrome-extension-prototype',
    category: 'no-code-apps',
    title: 'Build a Chrome extension prototype that loads as a real unpacked extension',
    description: `A Bolt.new brief for a Manifest V3 Chrome extension scoped to the minimum permissions it actually needs, with explicit cross-context message passing and real load-as-unpacked-extension testing steps.`,
    promptText: `Build a Chrome extension called {{extension_name}} that {{core_function}}, using Manifest V3, structured so it can be loaded as a real unpacked extension in Chrome — not just previewed as a regular web page inside Bolt.new's own preview pane, which will not accurately show extension-specific behavior like a popup or a content script.

MANIFEST AND PERMISSIONS
Write a manifest.json targeting Manifest V3 specifically — background scripts are service workers, not persistent background pages, which changes how state has to be handled (no long-lived in-memory state between events; use chrome.storage instead). Request only the permissions this extension actually needs to do {{core_function}} — list each permission in the manifest with a one-line comment next to it explaining why it's needed; do not request {{avoid_permissions}} just because they're commonly used in extension examples, since Chrome's Web Store review process and cautious users both treat an overpermissioned extension as a red flag, and an unused permission is pure downside with no upside during this build.

COMPONENTS
- {{popup_or_content_script}} — build this as the primary interaction surface.
- Use chrome.storage.local (or chrome.storage.sync if the setting should follow the user across their signed-in Chrome instances) for any persisted setting or data — never localStorage, which behaves inconsistently across an extension's different execution contexts (popup, content script, background service worker each have their own).
- If this extension needs to read or modify the content of pages the user visits, use a content script scoped with matches patterns as narrow as {{site_scope}} actually requires — never <all_urls> unless the extension genuinely needs to run on every site, which is a different and much larger permission ask.

MESSAGE PASSING
If the popup, content script, and background service worker need to talk to each other, use chrome.runtime.sendMessage and chrome.runtime.onMessage explicitly — name which component sends and which listens for each message type, since an extension with three separate execution contexts silently failing to communicate (a click in the popup that the content script never hears about) is the most common Manifest V3 bug, precisely because each context genuinely cannot just call a function in another context directly.

TESTING INSTRUCTIONS
Since Bolt.new's own preview pane cannot load this as a real Chrome extension, end your output with the exact steps to load it as an unpacked extension from chrome://extensions in developer mode, and what to click through to actually exercise {{core_function}} once loaded — don't leave me to figure out loading it myself.

CONSTRAINTS
{{visual_style}} Keep the popup UI small and fast — it has no meaningful loading budget; anything that takes more than a second to render in a 350px-wide popup will feel broken.`,
    variables: [
      {
        name: 'extension_name',
        description: 'The name of the extension.',
        example: 'QuickQuote',
        required: true,
      },
      {
        name: 'core_function',
        description: 'What the extension actually does.',
        example:
          'lets you highlight text on any webpage and save it as a quote with the source URL, viewable later from the extension popup',
        required: true,
      },
      {
        name: 'avoid_permissions',
        description:
          'Permissions that are commonly overused and should not be requested here.',
        example: 'tabs, webRequest, or history',
        required: false,
      },
      {
        name: 'popup_or_content_script',
        description: 'The primary interaction surface for the extension.',
        example:
          'A content script that adds a small "Save quote" button next to any text selection, plus a popup listing all saved quotes',
        required: true,
      },
      {
        name: 'site_scope',
        description: 'Which sites the content script actually needs to run on.',
        example: 'all sites, since quotes can come from anywhere the user is reading',
        required: true,
      },
      {
        name: 'visual_style',
        description: 'The overall visual direction for the popup.',
        example: 'minimal, one accent color, system font stack, no logo needed yet',
        required: false,
      },
    ],
    targetTools: ['Bolt.new'],
    tags: [
      'chrome-extension',
      'manifest-v3',
      'browser-extension',
      'prototype',
      'permissions',
    ],
    whyItWorks: `The Manifest V3 service-worker note targets a real, well-documented migration gap: a service-worker-based background script can be terminated by Chrome at any time and restarted fresh on the next event, so any code pattern relying on a variable staying in memory between events — the default assumption in an ordinary persistent background page from Manifest V2 — silently loses its state. A model not told this explicitly may generate exactly that pattern anyway, since it's still what a large share of extension tutorials and examples show for "background script," even though it's the wrong pattern for the manifest version this build is targeting.

Requiring narrow match patterns instead of <all_urls>, with a one-line justification per permission, targets a documented Chrome Web Store review friction point and a real security posture. An extension requesting broad host permissions it doesn't actually use is both slower to get through review and a larger attack surface if the extension's own code is ever compromised, and a generic "add whatever permissions you need" instruction defaults toward over-requesting, because reaching for a broad permission is the path of least resistance for making everything work without thinking carefully about scope.

Explicit message-passing between popup, content script, and background contexts addresses the actual reason cross-context Chrome extension bugs are so common and so confusing to debug. These three contexts are genuinely separate JavaScript execution environments with no shared memory between them, so a natural-looking function call from one to another simply does nothing rather than throwing an obvious error a developer would notice immediately. A generated extension that isn't explicitly told which component sends which message type will often wire only the parts that happen to land in the same file during generation, leaving a click in the popup that the content script silently never learns about — a bug that looks like nothing happened, with no error to point at the actual cause.`,
    verifiedAgainst: [
      {
        tool: 'Bolt.new',
        version: 'Bolt.new web app (StackBlitz WebContainers)',
        date: '2026-07-30',
      },
    ],
    changelog: [
      {
        date: '2026-07-30',
        note: 'Initial publish, verified against Bolt.new with an explicit Manifest V3 permission audit and real unpacked-extension load steps.',
      },
    ],
  },
  {
    slug: 'bolt-new-github-export-handoff',
    category: 'no-code-apps',
    title: 'Prepare a Bolt.new prototype for GitHub export and developer handoff',
    description: `A Bolt.new cleanup pass that hunts down hardcoded secrets, lists every piece of mock data standing in for a real integration, and writes the README a new developer actually needs before inheriting the repo.`,
    promptText: `{{app_name}} is a working prototype I built in Bolt.new, and I'm about to export it to GitHub for {{handoff_audience}} to take over. Prepare the codebase for that handoff — this pass is about making it legible and safe to inherit, not adding any new feature.

WHAT THIS APP CURRENTLY IS
{{current_state_summary}}

AUDIT AND CLEAN UP
Go through the codebase and find every place a real secret, API key, or credential is hardcoded directly in a file rather than read from an environment variable — list each one by file and line, move it into an environment variable, and generate a .env.example file listing every variable name the app needs with a placeholder value and a one-line comment on what it's for, but never the real value itself. Find every place mock or placeholder data stands in for something that needs a real integration before this app is production-ready — a fake "Payment succeeded" screen with no real Stripe call behind it, a hardcoded array standing in for a database — and list each one explicitly in a section titled "Not yet real," rather than leaving {{handoff_audience}} to discover it by reading every file. Check package.json for dependencies that were added during exploration but are no longer imported anywhere in the actual codebase, and list them as candidates to remove — do not remove them yourself without confirmation, since a dependency you believe is unused might still be needed by a build step you didn't check.

DOCUMENTATION TO WRITE
A README.md covering: what this app does in two or three sentences, how to run it locally (the exact commands, in order), every environment variable it needs and where to get a real value for each one, and the "Not yet real" list from above so it's the first thing a new developer sees, not something buried in a code comment three files deep. {{known_gaps}}

REPOSITORY HYGIENE
Confirm a .gitignore exists and actually excludes node_modules, any .env file, and any build output directory — if it's missing or incomplete, write one. Confirm no real secret value is already sitting in the git history from an earlier commit in this Bolt.new session; if one is, say so explicitly rather than just fixing it going forward, since a secret that's already been committed needs to be rotated, not just removed from the current file. {{repo_visibility}}

OUTPUT
1. The moved-secrets list, with before/after for each.
2. The .env.example file.
3. The README.md.
4. The "Not yet real" list, standalone, so it can be pasted directly into a handoff message or ticket.
5. The unused-dependency candidates list, explicitly not yet removed.`,
    variables: [
      {
        name: 'app_name',
        description: 'The app being handed off.',
        example: 'Northgrove Coffee storefront',
        required: true,
      },
      {
        name: 'handoff_audience',
        description: 'Who is taking over the codebase.',
        example: 'a two-person contract dev team who will take this to production',
        required: true,
      },
      {
        name: 'current_state_summary',
        description: 'What actually exists and what state it was built in.',
        example:
          'A Bolt.new-built React + Tailwind storefront with a working cart and a mock Stripe checkout — no real backend, no tests, built over a single afternoon session',
        required: true,
      },
      {
        name: 'known_gaps',
        description:
          'Anything else the new developer should know beyond what code review will surface.',
        example:
          'No automated tests exist yet, and the coupon logic was never checked against a $0 subtotal edge case',
        required: false,
      },
      {
        name: 'repo_visibility',
        description: 'How the repository will actually be shared.',
        example:
          'private repo, will be shared via GitHub with the contractors as outside collaborators',
        required: false,
      },
    ],
    targetTools: ['Bolt.new'],
    tags: [
      'handoff',
      'github-export',
      'code-cleanup',
      'secrets-management',
      'developer-onboarding',
      'production-readiness',
    ],
    whyItWorks: `Bolt.new sessions are exploratory by nature, and pasting a real API key or a Supabase service key inline into a file to get something working fast during a chat-driven build session is a common habit, precisely because the WebContainer environment makes it trivially easy to just paste a value and keep moving. That means a prototype's actual codebase is disproportionately likely to have a hardcoded secret sitting in a file that was never meant to survive past that one build session — an explicit line-by-line secret audit is a direct countermeasure to a real, tool-specific habit, not a generic security reminder tacked on for form's sake.

Requiring the "not yet real" list to be generated from the code rather than from memory closes a specific handoff failure. Whoever built the prototype in a single afternoon chat session knows informally which parts are fake, but that knowledge lives in their head and in the chat history, not in the repository itself. A developer who inherits just the code, with no access to the original Bolt.new conversation, has no way to tell a real Stripe integration from a mock success screen without reading every line of the checkout flow — a generated, explicit list is what actually transfers that knowledge into the one place the next person will actually look: the repo itself.

The instruction to flag an already-committed secret rather than silently fix it going forward matters because of how git history actually works. Removing a secret from the current version of a file does nothing to remove it from an earlier commit still sitting in the repository's full history, which remains fully readable by anyone with clone access regardless of what the latest commit looks like. A cleanup pass that only edits the current file state, without calling out this distinction explicitly, gives a false sense that the secret has been dealt with when it still needs to be rotated at the actual source — the API provider's dashboard — not just deleted from the current HEAD.`,
    verifiedAgainst: [
      {
        tool: 'Bolt.new',
        version: 'Bolt.new web app (StackBlitz WebContainers, GitHub export)',
        date: '2026-08-01',
      },
    ],
    changelog: [
      {
        date: '2026-08-01',
        note: 'Initial publish, verified against a Bolt.new GitHub export with an explicit secret audit and a generated "not yet real" list.',
      },
    ],
  },
  {
    slug: 'v0-dashboard-data-table-filters-charts',
    category: 'no-code-apps',
    title: 'Build a data-table dashboard with server-side filters and charts',
    description: `A v0 brief for a data-table dashboard built against an explicit fetchRows contract, with sorting, filtering, and pagination all server-driven and the current view synced to the URL so a shared link reproduces it exactly.`,
    promptText: `Generate a DataDashboard page for a Next.js App Router project using shadcn/ui, Tailwind CSS, and TanStack Table for the data grid.

DATA CONTRACT
Assume the actual data comes from a function I'll wire up myself — do not fetch from a real API inside this component. Define a typed fetchRows(params: { page: number; pageSize: number; sort: SortState; filters: FilterState }) => Promise<{ rows: {{row_shape}}; totalCount: number }> function signature as a prop, and build the whole dashboard against that contract, with a working mock implementation of it for preview purposes clearly marked as mock data to swap out.

TABLE REQUIREMENTS
- Columns: {{column_list}}. Support column sorting (single-column, ascending/descending toggle) that calls fetchRows again with the new sort state — sorting must not be done client-side against only the current page's rows, since that would silently sort a subset and call it a full sort.
- Server-side pagination, not a client-side slice of a large in-memory array — {{expected_row_count}} rows is the realistic scale, and loading all of them into the browser at once to paginate client-side defeats the entire point of a server-driven table.
- {{filter_fields}} as filter controls above the table — a date-range picker and one or more select dropdowns. Applying a filter resets to page 1 and calls fetchRows with the new filter state; filters and pagination must never disagree about what's currently shown.
- Sync the current page, sort, and filter state to the URL's search params, so a reload or a shared link reproduces the exact same view — use useSearchParams and router.replace, not component state alone, or a reload silently resets the user back to an unfiltered page 1.

CHARTS
Above the table, {{chart_count}} summary charts built with Recharts (or another chart library already common with shadcn/ui) reflecting {{chart_metrics}} — these should update when a filter changes, using the same filter state as the table, not a separate unfiltered dataset that quietly disagrees with what the table below is showing.

LOADING AND EMPTY STATES
Show a skeleton table matching the real table's column structure while fetchRows is pending — not a generic spinner that causes a layout jump when real rows arrive. Show an explicit "No results match these filters" state, distinct from the loading state, when fetchRows resolves with zero rows.

CONSTRAINTS
Type everything — the row shape, the filter state, the sort state — with explicit TypeScript interfaces, no inline any. {{visual_style}}`,
    variables: [
      {
        name: 'row_shape',
        description: 'The TypeScript shape of one row returned by fetchRows.',
        example:
          '{ id: string; orderNumber: string; customer: string; status: "pending" | "shipped" | "delivered"; total: number; placedAt: string }',
        required: true,
      },
      {
        name: 'column_list',
        description: 'The columns the table shows.',
        example: 'Order #, Customer, Status (as a colored badge), Total, Placed date',
        required: true,
      },
      {
        name: 'expected_row_count',
        description: 'The realistic scale of the underlying dataset.',
        example: 'tens of thousands',
        required: false,
      },
      {
        name: 'filter_fields',
        description: 'The filter controls to show above the table.',
        example: 'a date range for placedAt, and a status select',
        required: true,
      },
      {
        name: 'chart_count',
        description: 'How many summary charts to show above the table.',
        example: '2',
        required: false,
      },
      {
        name: 'chart_metrics',
        description: 'What the summary charts should reflect.',
        example: 'orders per day over the filtered range, and order count by status',
        required: true,
      },
      {
        name: 'visual_style',
        description: 'The overall visual direction.',
        example: 'dense, data-forward, minimal color beyond the status badges',
        required: false,
      },
    ],
    targetTools: ['v0'],
    tags: [
      'data-table',
      'dashboard',
      'tanstack-table',
      'shadcn',
      'server-side-pagination',
      'url-state',
    ],
    whyItWorks: `The explicit fetchRows prop contract addresses v0's actual scope correctly: v0 generates the component and page layer, not a backend, and a prompt that just says "build a dashboard with real data" forces it to either invent a call to an API that doesn't exist yet — which fails the instant the component renders — or silently switch to a hardcoded array of fake rows without saying so. Defining the fetch function's exact signature up front, with an explicitly-labeled mock implementation for preview, is what makes the generated component genuinely a drop-in piece to wire a real backend into, rather than something that has to be gutted and rebuilt once real data enters the picture.

Requiring server-side sort, pagination, and filtering rather than client-side operations on the current page targets a specific and easy-to-miss correctness bug: sorting only the rows currently loaded on one page produces a result that looks like a sort — the visible rows are in order — but is not actually a sort of the full dataset at all. This exact mistake is common in generated data-table code because client-side sorting is genuinely simpler to write, and TanStack Table supports both modes through a very similar-looking API, so nothing in the resulting code makes the mistake visually obvious without explicit instruction pointing at server-side behavior specifically.

Syncing page, sort, and filter state to the URL rather than keeping it purely in component state closes a real UX gap specific to data-heavy dashboards: a colleague sharing a link to "orders shipped last week, sorted by total" only works if that view state actually lives in the URL. A generated dashboard that keeps this state purely in React state resets to page 1 with no filters on every reload or share, silently breaking the exact workflow — bookmarking or sharing a specific filtered view — that a table like this exists to support in the first place.`,
    verifiedAgainst: [
      {
        tool: 'v0',
        version: 'v0 by Vercel (Next.js + shadcn/ui default stack)',
        date: '2026-07-20',
      },
    ],
    changelog: [
      {
        date: '2026-07-20',
        note: 'Initial publish, verified against v0 with an explicit fetchRows contract and URL-synced table state.',
      },
    ],
  },
  {
    slug: 'v0-multistep-form-wizard',
    category: 'no-code-apps',
    title: 'Build a multi-step form wizard with real per-step and conditional validation',
    description: `A v0 brief for a multi-step form wizard on one shared form instance, where conditional steps disappear from both the flow and the progress indicator, and the full schema re-validates once more at final submit.`,
    promptText: `Generate a multi-step form wizard component in Next.js using shadcn/ui form primitives, react-hook-form, and zod for validation.

STEPS
{{step_list}} — {{step_count}} steps total, ending in a review step that shows every answer before final submit.

STATE AND NAVIGATION RULES
Hold the entire form's data in one react-hook-form instance spanning all steps, not a separate form instance per step — moving between steps must never lose data the user already entered on a step they're leaving, including moving backward. Only allow moving to the next step when the current step's own zod schema validates cleanly; show field-level error messages inline on the field that's actually wrong, not a generic "please fix errors above" banner that makes the user hunt for what's invalid. Allow moving backward to any previously completed step at any time, with its previously entered values still populated exactly as the user left them — going back must never clear a field that was already valid.

CONDITIONAL STEPS
{{conditional_logic}} — a step can be skipped entirely based on an earlier answer; when a step is skipped, it must not appear in the progress indicator either, since a progress bar showing "step 4 of 7" when step 4 was never actually shown to this particular user is confusing, not just cosmetically wrong.

PROGRESS AND REVIEW
Show a progress indicator (a stepper or a progress bar, your choice) reflecting only the steps this particular user's answers will actually require, updating live if an earlier answer changes which later steps are needed. The final review step must show every answer grouped by its original step, with an "Edit" link next to each group that jumps directly back to that step — not to the beginning of the wizard — and returns to the review step afterward rather than forcing the user to click Next through every remaining step again.

SUBMISSION
On final submit, validate the entire form's data against a combined schema one more time before calling {{submit_handler_name}} — a step-by-step validation pass earlier in the flow does not guarantee the full combined state is still valid if a conditional step changed what's actually required. Show a clear pending state on the submit button and disable it while submitting, and handle a submission error by returning the user to the review step with the error shown, not by silently losing their answers.

CONSTRAINTS
Type the full form's shape as one Zod schema composed from per-step sub-schemas, not duplicated field definitions. {{persistence_note}} {{visual_style}}`,
    variables: [
      {
        name: 'step_list',
        description: 'The steps in the wizard, in order.',
        example:
          'Personal info, Household details, Income sources, (conditional) Self-employment details, Review',
        required: true,
      },
      {
        name: 'step_count',
        description:
          'How many steps exist in total, noting variability from conditional steps.',
        example: '5 (4 for users without self-employment income)',
        required: true,
      },
      {
        name: 'conditional_logic',
        description: 'The exact rule for when a step is skipped.',
        example:
          "If the user answers 'yes' to 'Do you have self-employment income?' on the Income sources step, insert the Self-employment details step before Review; otherwise skip it entirely",
        required: true,
      },
      {
        name: 'submit_handler_name',
        description: 'The name of the function that handles final submission.',
        example: 'submitApplication',
        required: true,
      },
      {
        name: 'persistence_note',
        description: 'Whether progress should survive a reload.',
        example:
          'Save progress to localStorage on every step change so a reload restores the user to where they left off, keyed by a draft ID.',
        required: false,
      },
      {
        name: 'visual_style',
        description: 'The overall visual direction.',
        example:
          'clean government-form aesthetic, generous spacing, no unnecessary color',
        required: false,
      },
    ],
    targetTools: ['v0'],
    tags: [
      'multi-step-form',
      'react-hook-form',
      'zod',
      'form-validation',
      'wizard',
      'conditional-logic',
    ],
    whyItWorks: `One shared react-hook-form instance across all steps, versus a separate instance per step, directly targets the most common multi-step-form bug. A per-step form instance means each step's data lives and dies with that step's own component mount, so navigating backward and forward — genuinely common wizard behavior — either loses previously entered data or requires a separate, error-prone manual state-syncing layer to shuttle values between step instances. A single instance spanning the whole wizard makes "don't lose data on back navigation" true by construction rather than something bolted on afterward as a special case.

Re-validating the combined form against the full schema at final submit, rather than trusting only the per-step gates that already passed, matters specifically because of the conditional-steps requirement. If an earlier answer changes what's actually required — self-employment details become mandatory only for some users — a per-step-only validation history can be stale the moment a user goes back and changes that earlier answer, since the step they already "passed" might no longer represent what the final combined schema actually needs from them now.

Keeping the progress indicator in sync with which steps are actually going to be shown to this particular user, rather than a fixed step count baked in at build time, is what stops a conditional wizard from producing a genuinely disorienting artifact. A static "step 4 of 7" indicator written assuming every step always appears will show the wrong step count and the wrong current position the instant a step gets conditionally skipped for a given user, and a user staring at a progress bar that doesn't match what's actually happening around them loses trust in the whole form — often abandoning it exactly at the point real submission friction should be lowest, not highest. This is also why the review step's per-group Edit links have to return to review rather than resuming forward navigation: jumping back into a linear Next-Next-Next flow after a targeted edit reintroduces the exact friction the review step exists to remove.`,
    exampleOutput: `A four-step flow for a user who answers "no" to self-employment income: the progress bar reads "Step 3 of 4" (Self-employment details never counted), and the review step shows three answer groups, each with a working Edit link that jumps back to its exact step and returns to review afterward.`,
    verifiedAgainst: [
      {
        tool: 'v0',
        version: 'v0 by Vercel (Next.js + shadcn/ui default stack)',
        date: '2026-08-02',
      },
    ],
    changelog: [
      {
        date: '2026-08-02',
        note: 'Initial publish, verified against v0 with a single shared form instance and a progress indicator scoped to the conditional step path.',
      },
    ],
  },
  {
    slug: 'v0-auth-screens-design-system-match',
    category: 'no-code-apps',
    title: 'Build login, signup, and reset screens that match an existing design system',
    description: `A v0 brief for auth screens built from an app's existing component library and design tokens instead of shadcn's defaults, with account-enumeration-safe error messages on both login and password reset.`,
    promptText: `Generate three auth screens — Login, Sign up, and Forgot password — for a Next.js App Router app, matching an EXISTING design system already in this codebase. Do not default to shadcn/ui's out-of-the-box look; match what's actually already here.

EXISTING DESIGN SYSTEM
{{existing_components}} — use these exact components and their existing prop APIs; do not generate a parallel set of new Input or Button components that happen to look similar, since that produces two different button styles living side by side in the same app the moment this gets merged.

DESIGN TOKENS
{{design_tokens}} — use these values via the existing Tailwind config or CSS variables already defined in the project, not new hardcoded hex values that happen to look close.

SCREENS
1. Login: email and password fields, a "remember me" checkbox, a primary submit button, and a "Forgot password?" link. Show a field-level error for an invalid email format before submit, and a single non-field-specific error banner for a failed login attempt (wrong credentials) — do not reveal whether the email or the password was the specific problem, which is a real account-enumeration risk if the two are distinguished.
2. Sign up: name, email, password, and a password-confirmation field with a live match/mismatch indicator as the user types the second field. Show password strength requirements ({{password_requirements}}) as a checklist that updates live as the user types, not only as an error after a failed submit attempt.
3. Forgot password: an email field and a submit button leading to a confirmation state that says a reset link was sent — this confirmation message must be shown whether or not the email actually exists in the system, since revealing "no account found for that email" on a password-reset form is the same account-enumeration risk as the login error above.

SHARED BEHAVIOR
All three screens should share one AuthLayout component for the surrounding page structure — the same centered card, the same logo placement ({{logo_asset}}), the same background — rather than three screens that each rebuild the layout slightly differently. Every submit button must show a pending state and be disabled while its request is in flight, and every form must be operable via keyboard alone, including submitting with Enter from any field.

CONSTRAINTS
{{routing_note}} Use the existing component library exactly as specified above — if a needed element genuinely doesn't exist in the existing system (for example, no password-strength-checklist component exists yet), say so explicitly and build a minimal new one that visually matches the existing tokens, rather than silently reaching for a shadcn default that will look inconsistent next to it.`,
    variables: [
      {
        name: 'existing_components',
        description: 'The exact existing component library and prop API to reuse.',
        example:
          'Button (variant: "primary" | "secondary" | "ghost"), Input (with built-in label and error-message slots), Checkbox — all in components/ui/, built on Radix primitives with the app\'s own Tailwind classes, not shadcn\'s default styling',
        required: true,
      },
      {
        name: 'design_tokens',
        description: 'The existing color, radius, and typography tokens to use.',
        example:
          'primary color var(--brand-600), border radius var(--radius-md) = 10px, font family already set globally via next/font — no new font import needed',
        required: true,
      },
      {
        name: 'password_requirements',
        description: 'The actual password rules to enforce and display.',
        example: 'at least 10 characters, one number, one symbol',
        required: true,
      },
      {
        name: 'routing_note',
        description: 'Where each screen lives and where a successful login redirects to.',
        example:
          'Login lives at /login, Sign up at /signup, Forgot password at /forgot-password — after a successful login, redirect to /dashboard',
        required: true,
      },
      {
        name: 'logo_asset',
        description:
          'The existing logo component or asset to reuse in the shared layout.',
        example:
          'the existing <Logo /> component from components/brand/logo.tsx, rendered at 32px height',
        required: false,
      },
    ],
    targetTools: ['v0'],
    tags: [
      'authentication',
      'design-system',
      'ui-consistency',
      'login-form',
      'account-security',
      'form-validation',
    ],
    whyItWorks: `v0's default behavior, with no explicit existing-component instruction, is to generate its own shadcn/ui-styled elements from scratch, because that's the stack it's tuned to produce well by default. For a genuinely new project that's fine; for an existing codebase with its own Button and Input components already in use elsewhere, an unscoped prompt produces auth screens that look like a different app was pasted in. Naming the exact existing components and their prop APIs is what actually gets v0 to compose with what's already there instead of quietly duplicating it with a second, slightly different set of primitives.

The non-specific login error and the always-shown reset-confirmation both target the same real vulnerability class: account enumeration. A login form that says "no account found" versus "wrong password" as two distinct messages lets an attacker efficiently discover which emails have accounts on the system by testing responses one at a time, and a password-reset flow that reveals "no account with that email" has exactly the same leak through a different door. Naming this explicitly as a security requirement, rather than an incidental UX choice left to the model's taste, is what keeps a generated auth flow from accidentally becoming a data-enumeration tool for anyone who probes it.

The shared AuthLayout requirement addresses a specific, common generation artifact: when a model is asked to build three related screens in one pass, each screen individually looks reasonable on its own, but small inconsistencies creep in between them — a slightly different card width, a logo placed a few pixels off — because each was generated as its own self-contained unit rather than composed from one shared piece. Forcing a shared layout component guarantees pixel-consistency between the three screens by construction, rather than by hoping the model happened to reproduce the same values three separate times.`,
    verifiedAgainst: [
      {
        tool: 'v0',
        version: 'v0 by Vercel (Next.js + shadcn/ui default stack)',
        date: '2026-08-04',
      },
    ],
    changelog: [
      {
        date: '2026-08-04',
        note: 'Initial publish, verified against v0 with an existing-component-library constraint and enumeration-safe error messaging on both flows.',
      },
    ],
  },
  {
    slug: 'v0-component-variant-system-documented',
    category: 'no-code-apps',
    title: 'Build a documented button, badge, and card variant system',
    description: `A v0 brief for a Button, Badge, and Card variant system sharing one prop name and one semantic color union, with a real stated contrast ratio checked per variant instead of a general accessibility assurance.`,
    promptText: `Build a small, documented component variant system — Button, Badge, and Card — for a Next.js design system, using class-variance-authority (cva) with Tailwind CSS, so every variant is type-safe and the whole set reads as one consistent system rather than three components that each invented their own variant naming.

VARIANT SPEC
- Button variants: {{button_variants}}. Sizes: {{button_sizes}}. Every Button must support a disabled state and a loading state (showing a spinner in place of, not alongside, the label) for each variant/size combination.
- Badge variants: {{badge_variants}} — these should reuse the same semantic color names as the Button variants where they overlap (a "destructive" Button and a "destructive" Badge should be visually related, not coincidentally similar).
- Card variants: {{card_variants}}, plus a consistent internal padding scale that Button and Badge components dropped inside a Card don't have to fight against with extra margin overrides.

CONSISTENCY RULES
Use the same prop name, variant, across all three components — never variant on Button and type or kind on Badge — so a developer who's learned one component's API can guess the others' correctly. Define the variant options as a single shared const array or union type where the semantic names overlap (destructive, for instance) rather than three separate, independently-typed unions that happen to contain the same strings today and can silently drift apart from each other during a future edit to just one of them.

ACCESSIBILITY PER VARIANT
For every variant/state combination — including disabled and each color variant — verify (state the actual contrast ratio, don't just assert it passes) that text stays at or above 4.5:1 contrast against its own background, and that a visible focus ring exists on every interactive variant, not just the default one. If a specific variant/state combination genuinely can't meet 4.5:1 with the given brand colors, name that combination explicitly rather than shipping it silently.

DOCUMENTATION
Alongside the components, generate a single documentation page rendering every variant of all three components side by side with its variant name labeled underneath, organized as one visual reference sheet — the equivalent of a Storybook page, but as one static route in this app, since not every project maintaining a small design system also runs Storybook.

CONSTRAINTS
{{color_tokens}} Export each component's variant type so consuming code gets autocomplete and a compile error on an invalid variant name, not a silent fallback to some default style. Keep every variant's default export tree-shakeable, so a project using only the Button doesn't pull the Badge and Card source into its bundle as well.`,
    variables: [
      {
        name: 'button_variants',
        description: 'The Button variants to build.',
        example: 'default, secondary, outline, ghost, destructive',
        required: true,
      },
      {
        name: 'button_sizes',
        description: 'The Button size options.',
        example: 'sm, default, lg, icon',
        required: true,
      },
      {
        name: 'badge_variants',
        description: 'The Badge variants to build.',
        example: 'default, secondary, destructive, outline',
        required: true,
      },
      {
        name: 'card_variants',
        description: 'The Card variants to build.',
        example:
          'default (bordered), elevated (shadow, no border), flat (no border or shadow, for use inside another card)',
        required: true,
      },
      {
        name: 'color_tokens',
        description: 'The actual brand color values these variants map to.',
        example:
          'Primary #4F46E5, Destructive #DC2626, Secondary #64748B — defined as CSS variables in globals.css, referenced through Tailwind, not hardcoded hex in component files',
        required: true,
      },
    ],
    targetTools: ['v0'],
    tags: [
      'design-system',
      'component-library',
      'class-variance-authority',
      'shadcn',
      'accessibility',
      'documentation',
    ],
    whyItWorks: `The shared variant prop-name and shared semantic-union-type rule targets the actual, well-documented failure mode of design systems that grow component by component instead of as one coordinated pass. cva makes it trivially easy to define a fresh, locally-sensible variant union per component, and without an explicit cross-component consistency rule, a Button's variant type and a Badge's independently-defined type will start out matching by coincidence and drift the moment either one is edited later, since nothing actually links them together. Naming a single shared union closes that drift at the type level, not just by a naming convention someone has to remember to follow by hand.

Requiring an actual stated contrast ratio per variant/state combination, rather than a general accessibility assurance, forces the check to happen at the level where color-contrast bugs actually live. A design system's "destructive" red might pass contrast comfortably as text on a white card background and fail badly as a Badge's own background color with white text sitting on top of it — contrast is a per-combination property of a specific foreground against a specific background, and a system-wide "make sure it's accessible" instruction tends to get checked once against the most obvious case and implicitly assumed to generalize to every other combination, when it simply doesn't.

Generating one documentation route that renders every variant side by side addresses a specific and common cost of a variant system that only exists in code. Without a single visual reference, every consumer of this design system has to either read the source to discover what variants exist or guess from partial usage elsewhere in the app, and inconsistencies — a "ghost" Button that looks nothing like anyone would expect a ghost variant to look — go unnoticed until a designer happens to spot it in an already-shipped screen, rather than being immediately visible on one reference page a reviewer can check the whole system against in a single glance.`,
    verifiedAgainst: [
      {
        tool: 'v0',
        version: 'v0 by Vercel (Next.js + shadcn/ui default stack)',
        date: '2026-07-31',
      },
    ],
    changelog: [
      {
        date: '2026-07-31',
        note: 'Initial publish, verified against v0 with a shared cva variant union across Button, Badge, and Card and a per-variant contrast check.',
      },
    ],
    relatedToolSlug: 'color-palette-generator',
  },
  {
    slug: 'v0-chat-interface-streaming-states',
    category: 'no-code-apps',
    title: 'Build a chat interface with real streaming, stop, and retry states',
    description: `A v0 brief for a chat UI where streaming state, auto-scroll, and retry are all scoped to the single message they belong to, not a global flag that drifts out of sync the moment two things happen at once.`,
    promptText: `Generate a ChatInterface component for a Next.js app — the UI layer for a streaming AI chat, built assuming the actual model call is wired up separately through {{streaming_source}}.

MESSAGE RENDERING
Render a scrollable list of messages, each tagged {{role_types}}, with clearly distinct visual treatment for each role — not just alignment, since color-blind users and quick visual scanning both need more than a left/right position to tell roles apart. Render assistant message content as Markdown, including fenced code blocks with syntax highlighting and a copy-to-clipboard button per code block — a chat UI that renders an assistant's code response as one unformatted paragraph is not shippable for {{use_case}}.

STREAMING BEHAVIOR
While an assistant response is streaming in, append incoming text to the same message bubble incrementally rather than replacing the whole bubble's content on every chunk, which causes a visible flash. Show a subtle typing/streaming indicator (a pulsing cursor at the end of the text, not a separate spinner element) only while that specific message is actively streaming, and remove it the instant streaming completes for that message — a stuck streaming indicator on a message that actually finished is a specific and common bug in chat UIs built without state explicitly scoped per-message. Provide a "Stop generating" button visible only while a response is streaming, wired to {{stop_mechanism}}; after stopping, the partial message that was already streamed in stays visible exactly as far as it got, marked with a small "stopped" label, rather than being cleared.

SCROLL BEHAVIOR
Auto-scroll to the newest message as it streams in, but only if the user was already at or near the bottom of the scroll area when the new content arrived — if the user has scrolled up to read an earlier message, do not yank them back down to the bottom mid-read; show a "New messages" button instead that scrolls down on click.

ERROR AND RETRY
If a message fails to send or a response errors out partway through streaming, show the error inline on that specific message, not as a global banner, with a "Retry" action that only resends that one failed message, not the entire conversation history. The input box must stay usable and retain whatever the user had typed if a send attempt fails, rather than clearing on a failed send the way it would on a successful one.

INPUT
A multi-line auto-growing textarea that submits on Enter and inserts a newline on Shift+Enter, disabled while a response is streaming, with a visible character or token count if {{length_limit}} applies.

CONSTRAINTS
{{visual_style}}`,
    variables: [
      {
        name: 'streaming_source',
        description: 'How the model response is actually delivered to the component.',
        example:
          'a Server-Sent Events endpoint at /api/chat that emits { delta: string } chunks and a final { done: true } event',
        required: true,
      },
      {
        name: 'role_types',
        description: 'The distinct message roles the UI needs to render.',
        example:
          'user, assistant, and system (system messages render as small centered notices, not chat bubbles)',
        required: true,
      },
      {
        name: 'use_case',
        description:
          'What the chat is actually for, since it changes rendering priorities.',
        example:
          'a developer-facing coding assistant, so code rendering quality matters more than usual',
        required: false,
      },
      {
        name: 'stop_mechanism',
        description: 'The exact mechanism the Stop button should use.',
        example:
          "an AbortController whose signal is passed into the fetch call, aborted when 'Stop generating' is clicked",
        required: true,
      },
      {
        name: 'length_limit',
        description: 'Any per-message length limit that should be shown to the user.',
        example: '4,000 characters per message',
        required: false,
      },
      {
        name: 'visual_style',
        description: 'The overall visual direction.',
        example:
          'dark theme by default, monospace font for code blocks, generous line height for readability',
        required: false,
      },
    ],
    targetTools: ['v0'],
    tags: [
      'chat-ui',
      'streaming',
      'ai-interface',
      'markdown-rendering',
      'ux-states',
      'conversational-ui',
    ],
    whyItWorks: `Per-message streaming state, rather than a single global "is streaming" flag, is what actually prevents the stuck-indicator bug the prompt calls out by name. A chat UI is naturally an array of independent messages, and if the streaming or typing indicator's visibility is tracked as one boolean at the conversation level instead of a property scoped to the specific message currently in flight, a user stopping a response and immediately regenerating it can end up with two messages both showing a streaming cursor, or a message that finished minutes ago still displaying one. Explicitly requiring per-message scope forces the state model to actually match the UI's own structure instead of a simpler-looking flag that doesn't.

The conditional auto-scroll — only scrolling down if the user was already near the bottom — targets a well-known and specifically annoying chat-UI failure. Naive implementations scroll to bottom on every new chunk unconditionally, which is fine while the user is passively watching a response stream in, but actively hostile the moment they've scrolled up mid-stream to reread an earlier message, since it yanks their scroll position away from what they're reading multiple times per second while tokens are still arriving. Checking scroll position before auto-scrolling is the actual fix, not a nice-to-have refinement layered on afterward.

Scoping retry to the single failed message rather than the whole conversation addresses a real data-loss and side-effect risk in chat apps. If a "Retry" button resends the entire message history to regenerate a response, and the underlying API call is not perfectly idempotent — a side-effecting tool call inside an earlier assistant turn, a rate-limited endpoint that behaves differently on a second full pass — a full-conversation retry can duplicate or re-trigger things that already happened once. A retry scoped to exactly the one failed message re-runs only the part that's actually known to have failed, which is both cheaper and safer by construction than resending everything just to fix one broken reply.`,
    verifiedAgainst: [
      {
        tool: 'v0',
        version: 'v0 by Vercel (Next.js + shadcn/ui default stack)',
        date: '2026-08-06',
      },
    ],
    changelog: [
      {
        date: '2026-08-06',
        note: 'Initial publish, verified against v0 with per-message streaming state and a conditional auto-scroll guard.',
      },
    ],
  },
  {
    slug: 'v0-email-template-react-email',
    category: 'no-code-apps',
    title: 'Build a transactional email template that survives real inboxes',
    description: `A v0 brief for a React Email template built around how email clients actually render HTML — table-based layout, a fixed safe width, and a genuine plain-text fallback, not browser assumptions ported over unchanged.`,
    promptText: `Generate a transactional email template for {{email_purpose}} using React Email (@react-email/components), built as a typed component that accepts props for the dynamic content — not a static template with the sample data hardcoded inside it.

CONTENT AND PROPS
Props: {{prop_shape}}. Render every piece of dynamic content from these props — no hardcoded name, amount, or link anywhere in the template that should have come from a prop instead.

EMAIL CLIENT REALITY
Email HTML rendering is far more constrained and inconsistent than a browser — build around that reality explicitly, not around how this would look as a regular web page:
- Use React Email's own layout components (Section, Row, Column, Container) rather than CSS flexbox or grid for layout — flexbox and grid support is unreliable across major email clients including Outlook desktop, which still uses a Word-based rendering engine for HTML email.
- Inline all styles — React Email handles this automatically when you use its components as intended, but if any custom style is added outside of them, keep it inline on the element, since many email clients strip <style> blocks in the <head> entirely.
- Keep the total template width at {{max_width}}px and design for that width being the maximum — email clients do not reliably respect viewport meta tags the way browsers do, so there is no real "responsive" behavior to lean on beyond a fixed, safely narrow layout.
- Include both a light-mode-safe and dark-mode-safe version of any image or logo, since a growing share of inboxes (Apple Mail, Outlook.com) apply automatic dark-mode inversion to email content in ways that can make a white-background logo turn into an unreadable dark blob — use React Email's built-in dark-mode support ({{dark_mode_approach}}) rather than hoping it renders fine either way.

CONTENT STRUCTURE
1. A clear, specific subject-line-matching preview text (using React Email's Preview component) — this is the snippet shown in the inbox list before the email is opened, and it must not just repeat the subject line.
2. A single primary call-to-action button with generous tap-target padding, since a meaningful share of these opens happen on a phone.
3. {{footer_requirements}} in the footer — an unsubscribe link if this is not a purely transactional message, and a plain-text company address if this is a marketing-adjacent send subject to CAN-SPAM.

FALLBACK
Generate the plain-text version alongside the HTML template — many email clients show this as an automatic fallback or use it for spam-score calculations, and a template with no plain-text counterpart, or one that's just an unformatted dump of the HTML, scores worse with spam filters than one with a genuine, readable plain-text equivalent.

CONSTRAINTS
{{brand_note}} Render the component with sample prop values as a preview so I can see it before wiring it to real data.`,
    variables: [
      {
        name: 'email_purpose',
        description: 'What this transactional email is for.',
        example: 'an order-shipped notification',
        required: true,
      },
      {
        name: 'prop_shape',
        description: 'The typed props the template should accept.',
        example:
          '{ customerName: string; orderNumber: string; items: { name: string; qty: number }[]; trackingUrl: string; estimatedDelivery: string }',
        required: true,
      },
      {
        name: 'max_width',
        description: 'The fixed maximum width in pixels for the template.',
        example: '600',
        required: false,
      },
      {
        name: 'dark_mode_approach',
        description: 'The specific mechanism used to handle dark-mode inversion.',
        example:
          "React Email's built-in prefers-color-scheme media query support inside the Head component, with a dark-mode variant of the logo swapped via that query",
        required: true,
      },
      {
        name: 'footer_requirements',
        description: 'What the footer legally or practically needs to include.',
        example:
          'company name, physical mailing address, and a one-line "questions? reply to this email" note — no unsubscribe link needed since this is a pure transactional shipping notice',
        required: true,
      },
      {
        name: 'brand_note',
        description: 'Brand colors and existing assets to use.',
        example:
          'Primary color #16A34A (green), logo already exists as a hosted PNG at a known URL — do not regenerate the logo',
        required: false,
      },
    ],
    targetTools: ['v0'],
    tags: [
      'react-email',
      'transactional-email',
      'email-templates',
      'html-email',
      'dark-mode',
      'deliverability',
    ],
    whyItWorks: `The explicit warning against flexbox and grid layout targets a real and specific rendering gap: Outlook desktop, still widely used in corporate environments, renders HTML email through a Word-based engine rather than a real browser engine, which has famously poor and inconsistent support for modern CSS layout. A model generating email markup the way it would generate a web page — because that's the vastly more common pattern in its training data — will reach for flexbox by default unless explicitly redirected to React Email's own layout primitives, which compile down to the table-based markup that email clients actually render reliably across the board.

Naming a fixed max-width and explaining why viewport-based responsiveness doesn't apply the same way addresses a category error a model can otherwise make by analogy to web design. "Make it responsive" is meaningful instruction for a webpage, but most email clients don't reliably run a full CSS engine that respects media queries or viewport units the way browsers do, so a template built with confident "responsive" web assumptions can render at a fixed, awkward width or with broken layout in exactly the clients that matter most. Stating the real constraint — design for one safe, fixed width — prevents that mismatched mental model from producing output that looks fine in a browser preview and breaks in a real inbox.

Requiring an explicit plain-text counterpart, not just an HTML template, targets something specific to how email deliverability actually works rather than a stylistic nicety. Many spam-filtering systems weight the presence and quality of a genuine plain-text alternative as one signal among several for whether a message is a legitimate transactional send or a low-effort mass mailing, so an HTML-only template — technically complete and pretty in a browser preview — can land in spam for reasons that have nothing to do with its actual content, a failure mode invisible until real send data comes back and hard to diagnose by looking at the HTML alone.`,
    verifiedAgainst: [
      {
        tool: 'v0',
        version: 'v0 by Vercel (Next.js + shadcn/ui default stack)',
        date: '2026-07-22',
      },
    ],
    changelog: [
      {
        date: '2026-07-22',
        note: 'Initial publish, verified against v0 with React Email table-based layout and a required plain-text fallback.',
      },
    ],
  },
  {
    slug: 'replit-agent-fastapi-backend-deploy',
    category: 'no-code-apps',
    title: 'Build and deploy a FastAPI backend with a real database',
    description: `A Replit Agent brief for a FastAPI backend that gets deployed for real, with secrets set for the deployed environment specifically and a health check that actually verifies the database connection.`,
    promptText: `Build and deploy a FastAPI backend for {{service_purpose}}, ending with it actually live at a real, reachable URL — not just runnable inside the Replit workspace.

API SURFACE
Endpoints: {{endpoint_list}}. Every request and response body gets a Pydantic model — no raw dict passed straight through from a request to a database call and back; the model is what gives me actual validation errors instead of a 500 when a client sends a malformed field.

DATA LAYER
Use {{database_choice}} for persistence, with the connection string read from a Replit Secret, never hardcoded in the code even for a "just testing" first pass — a hardcoded connection string committed once tends to stay committed. Write the actual schema (as SQLAlchemy models or raw SQL migrations, your call, but pick one and be consistent) rather than creating tables ad hoc from application code paths that happen to run first — I want a single, explicit place that defines the schema.

RELIABILITY AND HEALTH
Add a /healthz endpoint that checks the actual database connection (not just returning a static 200) and returns a non-200 status if the database is unreachable — this is what a deployment platform's health check should actually be pinging, not the root route. Handle the obvious failure modes explicitly: a request for a resource that doesn't exist returns 404 with a clear message, a validation failure returns 422 with the specific field that failed, and an unexpected exception is caught by a global exception handler that logs the real error server-side but returns a generic message to the client — never a raw stack trace in a production response.

AUTH
{{auth_requirement}}

DEPLOYMENT
Deploy this using Replit's {{deployment_type}} deployment, not just leaving it running in the workspace's dev server, which stops the moment I close the browser tab. Set up the environment variables/secrets needed for the deployed version specifically, since Replit's deployment environment does not automatically inherit whatever you typed into the workspace's dev-only shell session. After deploying, give me the real, live URL and the exact curl command to hit /healthz and confirm it's actually up, not just that the deploy step reported success.

DOCUMENTATION
Since this is an API with no UI, generate the OpenAPI docs FastAPI provides automatically at /docs, and confirm they're reachable at the deployed URL too, not only in the dev workspace — a common gap is deployment config that works for the app's main routes but accidentally blocks or misconfigures the docs route.

CONSTRAINTS
{{rate_limit_note}} Type every function signature — no bare dict or Any where a Pydantic model or a concrete type should be used instead.`,
    variables: [
      {
        name: 'service_purpose',
        description: 'What this API actually does and who calls it.',
        example:
          "a small internal API that a separate frontend team's app will call to look up and update shipment tracking records",
        required: true,
      },
      {
        name: 'endpoint_list',
        description: 'The exact endpoints to build.',
        example:
          'GET /shipments/{id}, GET /shipments (paginated, filterable by status), POST /shipments, PATCH /shipments/{id}/status',
        required: true,
      },
      {
        name: 'database_choice',
        description: 'The database to persist data in.',
        example: "Replit's managed Postgres database",
        required: true,
      },
      {
        name: 'deployment_type',
        description: 'Which Replit deployment type fits the traffic pattern.',
        example:
          'Autoscale (this API has bursty, unpredictable traffic rather than a constant load)',
        required: true,
      },
      {
        name: 'rate_limit_note',
        description: 'Any rate-limiting requirement.',
        example:
          'Add a basic per-API-key rate limit of 100 requests/minute — the frontend team will be given a single shared key for now.',
        required: false,
      },
      {
        name: 'auth_requirement',
        description: 'What kind of authentication this API needs, if any.',
        example:
          'A single static API key checked via an X-API-Key header — no full OAuth needed for this internal service yet.',
        required: false,
      },
    ],
    targetTools: ['Replit Agent'],
    tags: [
      'fastapi',
      'backend-api',
      'deployment',
      'postgres',
      'pydantic',
      'production-readiness',
    ],
    whyItWorks: `Replit Agent's ability to actually deploy, not just run inside an interactive dev session, is the specific capability this prompt is written around, and it's the thing the other three tools in this category don't do the same way — Lovable, Bolt.new, and v0's previews are all, in their own way, a session that ends the moment the tab closes. Naming the deployment type explicitly, Autoscale versus a Reserved VM, is necessary because Replit's own deployment product requires that choice and defaults to whichever type it built most recently in a given session rather than the one that actually fits a bursty API traffic pattern like the one described here.

Requiring secrets to be set for the deployment specifically, not just the workspace, targets a real and easy-to-miss gap in how Replit's environment model works. Values available to a workspace's interactive shell session are not automatically the same set of environment variables available to a deployed instance of that app, so a backend that works perfectly when tested inside the workspace can fail immediately on deploy with a missing-connection-string error — a failure that's confusing precisely because "it worked five minutes ago" was true, just in a different environment than the one that actually matters once it's live.

A health check that verifies the real database connection, rather than returning a static 200 regardless of backend state, addresses what a health-check endpoint is actually for in a deployed system. A platform's automated health monitor pinging /healthz is trying to answer whether this instance can actually serve real requests right now, and a health check that always returns 200 gives false confidence that masks exactly the failure — a lost database connection — that the endpoint exists to catch, right up until a real user's request fails for a reason the monitoring never flagged as a problem.`,
    verifiedAgainst: [
      {
        tool: 'Replit Agent',
        version: 'Replit Agent (chat-based build mode, with Replit Deployments)',
        date: '2026-08-03',
      },
    ],
    changelog: [
      {
        date: '2026-08-03',
        note: 'Initial publish, verified against Replit Agent with deployment-scoped secrets and a database-checking health endpoint.',
      },
    ],
  },
  {
    slug: 'replit-agent-debug-existing-app-bug',
    category: 'no-code-apps',
    title: 'Debug a specific, reproducible bug without triggering a rewrite',
    description: `A Replit Agent debugging brief that requires the bug to be reproduced before it's fixed, bans defensive checks that mask the real cause, and names the adjacent flows to re-check after the fix lands.`,
    promptText: `{{app_name}} is a working app you (or an earlier session) already built in Replit. It has one specific, reproducible bug. Fix exactly that bug with the smallest correct change — this is a debugging pass, not an invitation to refactor or rewrite anything else you notice along the way.

THE BUG
{{bug_description}}

STEPS TO REPRODUCE
{{repro_steps}}

EXPECTED VS ACTUAL
Expected: {{expected_behavior}}
Actual: {{actual_behavior}}

DEBUGGING DISCIPLINE
Before changing any code, reproduce the bug yourself using the steps above and confirm you're seeing the same actual behavior I'm describing — if you can't reproduce it with these exact steps, say so and ask what's different about my environment rather than guessing at a fix for a bug you haven't actually observed. Once reproduced, trace the actual root cause — the specific line, the specific piece of state, the specific request that's wrong — and explain it in plain language before touching any code, the same way a human engineer would explain a diagnosis before writing a fix. Do not fix the bug by wrapping the symptom in a defensive check that hides it (a try/catch that silently swallows the error, an if-statement that skips the broken code path) unless that genuinely is the correct fix — if the underlying cause is something else entirely and a defensive check would just mask it, say so and fix the actual cause instead. Make the smallest change that fixes the root cause. If you notice unrelated code nearby that looks wrong or outdated while you're in there, do not fix it as part of this change — name it separately, at the end, as something worth a future look, and leave it untouched.

VERIFICATION
After the fix, walk back through the exact repro steps above and confirm the actual behavior now matches expected. Then check the two or three most obviously related flows that touch the same code path — {{related_flows_to_check}} — and confirm the fix didn't change their behavior, since a fix scoped to one exact symptom can still have side effects on a shared function or shared piece of state used elsewhere.

OUTPUT
1. The root cause, in plain language.
2. The diff — only the lines that changed, nothing reformatted or touched that didn't need to be.
3. Confirmation that the original repro steps now produce the expected behavior.
4. Anything unrelated you noticed but deliberately left alone, per the rule above.`,
    variables: [
      {
        name: 'app_name',
        description: 'The existing app with the bug.',
        example: 'StudyBot (the Discord reminder bot)',
        required: true,
      },
      {
        name: 'bug_description',
        description: 'A short description of the bug itself.',
        example: 'The /remind command sometimes posts the reminder twice in the channel',
        required: true,
      },
      {
        name: 'repro_steps',
        description: 'The exact steps that reproduce the bug.',
        example:
          'Run /remind with a time less than 60 seconds away, then wait for it to fire — about 1 in 3 attempts posts the message twice, roughly 2 seconds apart',
        required: true,
      },
      {
        name: 'expected_behavior',
        description: 'What should happen.',
        example: 'exactly one reminder message posted at the scheduled time',
        required: true,
      },
      {
        name: 'actual_behavior',
        description: 'What actually happens.',
        example:
          'occasionally two identical reminder messages posted a couple seconds apart',
        required: true,
      },
      {
        name: 'related_flows_to_check',
        description: 'Nearby flows that share code with the buggy one.',
        example:
          'the /schedule command (uses the same scheduling function) and the daily automated reminder job',
        required: false,
      },
    ],
    targetTools: ['Replit Agent'],
    tags: [
      'debugging',
      'regression-testing',
      'root-cause-analysis',
      'bug-fix',
      'code-review',
      'iterative-development',
    ],
    whyItWorks: `Requiring the agent to actually reproduce the bug itself before proposing a fix targets a specific and common agentic-coding failure. Given a bug description in natural language, an agent can generate a plausible-sounding fix for a plausible-sounding cause without ever running the actual repro steps — and skipping that step is strictly worse in an environment like Replit's own always-running workspace, where the agent genuinely has the means to execute the app and watch it fail, than in a static code-review context where it never could. The prompt is what makes it use that means instead of pattern-matching a guess from the description alone.

The explicit ban on defensive-check fixes that mask a symptom addresses a known shortcut failure mode: a try/catch wrapped around a flaky database write can make an intermittent double-post disappear from the logs without fixing the actual race condition causing it. The bug looks fixed because the symptom stopped being visible, but the underlying non-idempotent scheduling logic — the likely real cause of a reminder firing twice — is untouched and will resurface differently later, quite possibly in a code path the defensive check never covered in the first place.

Naming specific related flows to re-check after the fix, rather than a generic "make sure nothing else broke," matters because Replit Agent operates across a real, shared codebase where a scheduling function fixed for one command is very likely reused by another command or an automated job. A fix verified only against the original repro steps can look complete while silently breaking a second caller of the same shared function that nobody thought to re-test — naming the specific adjacent flows up front turns "hopefully nothing else uses this" into an actual, bounded checklist someone can work through, rather than a hope resting on how thorough the fixing session happened to feel at the time.`,
    verifiedAgainst: [
      {
        tool: 'Replit Agent',
        version: 'Replit Agent (chat-based build mode in Replit)',
        date: '2026-07-25',
      },
    ],
    changelog: [
      {
        date: '2026-07-25',
        note: 'Initial publish, verified against Replit Agent with a mandatory reproduce-before-fix step and a ban on symptom-masking defensive checks.',
      },
    ],
  },
  {
    slug: 'replit-agent-add-auth-to-existing-app',
    category: 'no-code-apps',
    title: 'Add real authentication to an app that never had any',
    description: `A Replit Agent brief for retrofitting real login onto an app that's been running open, with an explicit route-by-route access audit and a stated decision about who owns the data that existed before users did.`,
    promptText: `{{app_name}} currently has no authentication at all — anyone who has the URL can use it fully. Add real login so only {{intended_users}} can access it, without breaking whatever already works today.

CURRENT STATE
{{current_app_summary}}

AUTH APPROACH
Use {{auth_method}} rather than hand-rolling password hashing, session tokens, or a login flow from scratch — authentication is one of the few areas where "write it yourself" is a real security liability, not just extra work, since a subtly wrong hashing scheme or a predictable session token is the kind of mistake that's invisible until it's exploited. If {{auth_method}} needs an external provider's client ID and secret, walk me through getting them and store them as Replit Secrets, never inline in the code.

MIGRATING EXISTING DATA
{{existing_data_note}} — since the app previously had no concept of a user who owns anything, decide explicitly what happens to data created before this change: does it get assigned to a designated first admin account, does it become globally visible to any logged-in user, or does it need a one-time manual assignment step. State which approach you're taking and why, rather than silently picking one.

ACCESS CONTROL
Every existing route and every existing background job that touches user data needs to be checked, not just the ones that were obviously "supposed" to be protected — walk through the app's actual route list and background jobs and confirm each one either requires a logged-in session or is deliberately, explicitly still public, naming which is which. A route that's accidentally still reachable without login after this change is a bug, not an acceptable gap, even if nobody happens to hit it during testing.

SESSION BEHAVIOR
Sessions should expire after {{session_duration}} of inactivity, and a logout action must actually invalidate the session server-side, not just clear a cookie client-side — a client-side-only logout leaves the session usable by anyone who still has the old cookie value.

ROLLOUT
Before this goes live for real users, confirm what happens to anyone currently using the app without an account — do they get logged out and asked to sign up, or is there a grace period. State this explicitly rather than leaving existing users to hit an unexplained wall.

OUTPUT
1. Every route/job audited, marked protected or intentionally public.
2. The existing-data migration decision and why.
3. The rollout plan for current users.
4. A short note on what you'd still want a human to double-check by hand before this goes live — a static audit of route protection is not the same thing as an actual penetration test of the finished login flow.`,
    variables: [
      {
        name: 'app_name',
        description: 'The app that currently has no auth.',
        example: 'the warehouse StockDesk tool',
        required: true,
      },
      {
        name: 'intended_users',
        description: 'Who should actually be able to log in.',
        example: 'the 6-person warehouse team, invite-only, no public sign-up',
        required: true,
      },
      {
        name: 'current_app_summary',
        description: 'What the app is and how it currently runs with no login.',
        example:
          'A Flask app with a Postgres database, three routes (products, orders, stock movements), currently reachable by anyone with the Repl URL — no login screen exists at all',
        required: true,
      },
      {
        name: 'auth_method',
        description: 'The specific library or approach to use for real auth.',
        example:
          "Flask-Login with password hashing via werkzeug's built-in generate_password_hash, plus an invite-only signup gated by a one-time invite token stored in the database",
        required: true,
      },
      {
        name: 'existing_data_note',
        description: 'What pre-existing data has no owner concept today.',
        example:
          'All 340 existing StockMovement rows have no created_by value today since there was no user concept when they were created',
        required: true,
      },
      {
        name: 'session_duration',
        description: 'How long a session should last before expiring.',
        example: '12 hours',
        required: false,
      },
    ],
    targetTools: ['Replit Agent'],
    tags: [
      'authentication',
      'session-management',
      'access-control',
      'security',
      'incremental-migration',
      'flask-login',
    ],
    whyItWorks: `The explicit "use a real library, never hand-rolled" instruction matters more here than in most feature-add prompts because authentication is a domain where a plausible-looking custom implementation — a self-written token scheme, a homegrown password comparison — can be subtly and catastrophically wrong in ways that don't show up in normal testing. A non-constant-time password comparison, a session token generated from a predictable source, a hashing scheme without a per-user salt are all mistakes an agent given a vague "add login" instruction with no library named has no particular reason to avoid, since something that looks correct and runs correctly for the one test case it tries reads as done.

The mandatory route-by-route audit targets the actual risk profile of adding auth to an app retrofitted after the fact rather than designed with it from day one. A fresh app built with auth from the start typically has every route behind a consistent middleware by construction; bolting auth onto an app that's been running open for a while means each existing route was written with no access-control assumption at all, so it's genuinely easy — for the agent or for a human — to protect the obvious routes like the main dashboard while missing a secondary API endpoint the frontend calls internally, or a background job that also touches the same data, neither of which "look like" login pages and are therefore easy to overlook without a forced, explicit walk-through of the full list.

Requiring an explicit decision about ownership of pre-existing, user-less data addresses a gap that has no natural default. Rows created before any concept of "user" existed genuinely have no correct owner to infer, and an agent that isn't asked to decide explicitly will often pick the path of least resistance — leaving created_by null forever, or silently assigning everything to whichever account happens to be first in the table — either of which is a real decision with real consequences for who can see or edit that historical data, and it deserves to be made deliberately rather than as an unexamined side effect of the migration.`,
    verifiedAgainst: [
      {
        tool: 'Replit Agent',
        version: 'Replit Agent (chat-based build mode in Replit)',
        date: '2026-07-29',
      },
    ],
    changelog: [
      {
        date: '2026-07-29',
        note: 'Initial publish, verified against Replit Agent with a full route-by-route access audit and an explicit pre-existing-data ownership decision.',
      },
    ],
  },
  {
    slug: 'replit-agent-scheduled-scraper-pipeline',
    category: 'no-code-apps',
    title: "Build a scheduled scraper pipeline that's safe to run unattended for months",
    description: `A Replit Agent brief for a scheduled scraping pipeline built to run unattended for months — idempotent upserts, per-item error isolation, and the raw response kept alongside the normalized result.`,
    promptText: `Build a scheduled data pipeline that runs {{schedule}}, pulls {{data_source_description}}, and stores clean, de-duplicated results in a database — built to run unattended for months, not just to work once when I watch it run manually.

PIPELINE STAGES
1. Fetch: pull from {{data_source_description}}. Respect {{rate_limit_note}} — this is someone else's server, and a scraper with no delay between requests is the kind of thing that gets an IP blocked, which would break every future run, not just this one.
2. Parse: extract {{fields_to_extract}} from the raw response.
3. Normalize: clean and standardize the extracted fields — {{normalization_rules}}.
4. Store: write to a database, keyed so that re-running the pipeline against the same source data never creates duplicate rows — use a natural unique key from the source data itself (not an auto-incrementing ID that would happily insert the same logical record twice) with an upsert, not a plain insert.

RELIABILITY RULES
If one item in a batch fails to parse or fetch, log that specific failure with enough detail to debug later and continue processing the rest of the batch — one bad item must never abort the whole run and silently skip every item after it. Store the raw fetched response alongside the normalized result, not just the normalized version, so that if a normalization rule turns out to be wrong later, the pipeline can be corrected and re-run against the original raw data rather than needing to re-scrape from scratch. Add a run log table recording every pipeline run — start time, end time, items processed, items failed, and a short status — so I can see the actual history of runs without digging through console output.

SCHEDULING AND ALERTING
Set this up using Replit's Scheduled Deployments (or the closest equivalent — cron-style scheduling, not a script that only runs while I happen to have the workspace open) to run {{schedule}}. If a run fails outright — the source is unreachable, an unexpected exception escapes the per-item error handling above — send a notification to {{alert_channel}} so I find out the same day, not the next time I happen to check manually and notice weeks of missing data.

CONSTRAINTS
{{storage_choice}} Handle the source being temporarily unreachable (a timeout, a 503) as a retryable condition with backoff, distinct from a genuinely malformed response that indicates the source's structure changed and needs a human to look at the parser, not just retry.`,
    variables: [
      {
        name: 'schedule',
        description: 'How often the pipeline should run.',
        example: 'once every night at 2am UTC',
        required: true,
      },
      {
        name: 'data_source_description',
        description: 'What the pipeline pulls data from.',
        example: 'a public list of competitor product prices from 40 known product URLs',
        required: true,
      },
      {
        name: 'rate_limit_note',
        description: 'The exact politeness rule to apply toward the scraped source.',
        example:
          'a fixed 2-second delay between requests, and treat a 429 or 503 response as a signal to back off and retry the whole run later rather than hammering the source immediately',
        required: true,
      },
      {
        name: 'fields_to_extract',
        description: 'The specific fields to pull from each item.',
        example: 'product name, current price, currency, and in-stock status',
        required: true,
      },
      {
        name: 'normalization_rules',
        description: 'How raw extracted fields should be cleaned and standardized.',
        example:
          'strip currency symbols and commas from price into a plain decimal, normalize in-stock text ("In Stock", "Available", "2 left") into a single boolean is_in_stock',
        required: true,
      },
      {
        name: 'alert_channel',
        description: 'Where a failed run should notify.',
        example:
          "an email to me via a simple SMTP send, since this doesn't warrant a full Slack integration for one person",
        required: false,
      },
      {
        name: 'storage_choice',
        description: 'The database and table split to use for raw vs normalized data.',
        example:
          "Replit's managed Postgres database, with a raw_snapshots table and a separate normalized products_daily table",
        required: false,
      },
    ],
    targetTools: ['Replit Agent'],
    tags: [
      'web-scraping',
      'scheduled-jobs',
      'data-pipeline',
      'idempotency',
      'cron',
      'error-handling',
    ],
    whyItWorks: `Replit's Scheduled Deployments — cron-style execution running independent of whether the workspace is open — is the actual capability this prompt is written around, and naming it explicitly, rather than "run this every night" with no mechanism specified, matters because the default, easiest-to-generate alternative is a script with a sleep loop running inside the interactive workspace. That approach stops the instant the workspace session ends or the Repl goes idle, which defeats the entire point of a job meant to run unattended for months; an unscoped prompt has no particular reason to prefer the platform's real scheduled-execution feature over the simpler-looking loop.

The upsert-on-natural-key requirement targets the single most common bug in scheduled scraping pipelines specifically. Because the whole point is to re-run repeatedly against a source that may or may not have changed since last time, a plain INSERT keyed only on an auto-incrementing ID will happily create a fresh duplicate row for the same real-world item every single run. This bug is invisible for a while — the pipeline "works" by every visible measure, running without errors — right up until someone queries the accumulated data three months later and finds each product appearing ninety times.

Storing the raw response alongside the normalized result addresses a specific and recoverable-versus-not distinction that matters a lot for a scraper meant to run unattended. Source websites change their markup or price-formatting conventions over time, and a normalization rule that was correct on day one can silently start producing wrong values — a price of "1,299" parsed as 1.299 after a formatting change upstream. Without the raw response retained, fixing that bug means the historical data is permanently wrong with no way to recover it; keeping the raw snapshot means a corrected normalization rule can simply be re-run against everything already collected.`,
    verifiedAgainst: [
      {
        tool: 'Replit Agent',
        version: 'Replit Agent (chat-based build mode, with Scheduled Deployments)',
        date: '2026-08-05',
      },
    ],
    changelog: [
      {
        date: '2026-08-05',
        note: 'Initial publish, verified against Replit Agent with cron-style Scheduled Deployments and a raw-plus-normalized storage split.',
      },
    ],
  },
  {
    slug: 'replit-agent-internal-tool-automation-ui',
    category: 'no-code-apps',
    title: 'Wrap a one-off automation script in a usable internal web tool',
    description: `A Replit Agent brief for wrapping a terminal-only script in a small internal web UI, with a real concurrency lock and an explicit confirmation step in front of any destructive side effect.`,
    promptText: `I have a Python script that {{script_purpose}}, and right now only I can run it because it lives in my terminal with hardcoded arguments. Wrap it in a small internal web UI on Replit so {{intended_users}} can trigger it themselves without touching code or a terminal.

CURRENT SCRIPT
{{script_summary}}

WHAT TO BUILD
1. A single-page web UI with a form matching the script's actual parameters — {{script_parameters}} — with real input validation matching what the script itself expects (a date picker for a date argument, a number input with the script's actual valid range for a numeric one), not a single freeform text box the user has to know the right syntax for.
2. A "Run" button that executes the script with the form's values and shows live output as it runs — streamed log lines appearing as they're produced, not a blank screen until the whole script finishes and then a wall of text all at once.
3. A run history list: every past run, who triggered it, when, with what parameters, and whether it succeeded or failed, with the ability to click into any past run and see its full captured output again.
4. If the script can take more than a few seconds, show a clear in-progress state and disable the Run button while a run is active — do not let the same job be started twice concurrently by two people clicking Run within a few seconds of each other, since {{concurrency_risk}}.

ACCESS CONTROL
{{access_control_note}} — this tool runs real automation with real side effects, so it should not be reachable by just anyone who finds the URL.

SAFETY RAILS
Before wiring the Run button to actually execute the script, confirm with me what the script's actual side effects are — {{side_effects_note}} — and add a confirmation step in the UI before running if any of those side effects are destructive or hard to undo, rather than making "click Run" as casual an action as loading the page. If the script can fail partway through in a way that leaves things in a bad intermediate state, note that risk explicitly rather than presenting the wrapped version as safer than the original script just because it now has a nicer UI.

CONSTRAINTS
Keep the script's own logic untouched — this is a UI wrapper around the existing script, not a rewrite of what it does.

OUTPUT
Alongside the UI, a short note on exactly how the web UI invokes the underlying script (subprocess call, direct function import, etc.) and what happens to its stdout/stderr to produce the live log view.`,
    variables: [
      {
        name: 'script_purpose',
        description: 'What the existing script actually does.',
        example:
          'regenerates and re-uploads the weekly sales report CSV to the shared drive',
        required: true,
      },
      {
        name: 'intended_users',
        description: 'Who should be able to trigger it from the new UI.',
        example: 'the 3-person ops team, none of whom write code',
        required: true,
      },
      {
        name: 'script_summary',
        description: 'What the script does today and how it currently runs.',
        example:
          'A Python script (report_gen.py) that takes a --week-start date argument, queries the sales database, builds a CSV, and uploads it via the Google Drive API — currently run manually from my laptop',
        required: true,
      },
      {
        name: 'script_parameters',
        description: 'The exact parameters the script accepts.',
        example:
          'week_start_date (required), and an optional --dry-run flag that skips the actual upload step',
        required: true,
      },
      {
        name: 'concurrency_risk',
        description: 'What specifically goes wrong if two runs happen at once.',
        example:
          'two simultaneous runs would both try to upload a file with the same name, and one upload could silently overwrite the other mid-transfer',
        required: true,
      },
      {
        name: 'access_control_note',
        description: 'How access to the UI itself should be gated.',
        example:
          "Gate the whole UI behind a single shared password for now — the ops team is small and this doesn't need individual logins yet, but it must not be reachable by an unauthenticated request",
        required: false,
      },
      {
        name: 'side_effects_note',
        description: 'The real, concrete side effects of running the script.',
        example:
          "it overwrites last week's file on the shared drive if run twice for the same week, and there is no automatic backup of the previous version",
        required: false,
      },
    ],
    targetTools: ['Replit Agent'],
    tags: [
      'internal-tool',
      'automation',
      'python',
      'concurrency-control',
      'access-control',
      'workflow',
    ],
    whyItWorks: `Matching the form fields exactly to the script's real parameters, with input types that constrain what can be entered — a date picker instead of a free-text field for a date argument — addresses the actual reason this wrapper is being built in the first place. The whole point is to let non-technical teammates run a script they can't run from a terminal, and a generic freeform text input just relocates the "you need to know the right syntax" problem from a command line to a web form instead of actually removing it. A wrapper that doesn't constrain input to valid values isn't meaningfully more usable than the original script; it's just a worse-documented version of the same interface.

The concurrency guard is specifically necessary because Replit Agent is being asked to build a genuinely new failure mode that the original single-person CLI script never had to handle. A script that only ever ran from one person's terminal, one invocation at a time, was implicitly safe from concurrent execution simply because only one person could run it. The moment it's exposed to multiple people through a shared web UI, simultaneous runs become a real possibility for the first time, and naming the specific concurrent-overwrite risk — rather than a generic "prevent double-clicking" — is what makes the agent actually implement a real run-lock rather than just disabling a button in one browser, which does nothing to stop two different browsers from both starting a run at nearly the same moment.

Requiring the script's actual side effects to be confirmed and, if destructive, gated behind an explicit confirmation step targets a real behavioral shift that happens when a script gets wrapped in a friendlier UI. A command someone had to type carefully, with the script's real argument names in front of them, has a natural amount of friction that a big green "Run" button removes entirely — and for a script whose actual effect is silently overwriting last week's file with no backup, that removed friction is a real regression in safety dressed up as a usability improvement, unless the wrapper explicitly reintroduces a deliberate pause before doing something hard to undo.`,
    verifiedAgainst: [
      {
        tool: 'Replit Agent',
        version: 'Replit Agent (chat-based build mode in Replit)',
        date: '2026-08-08',
      },
    ],
    changelog: [
      {
        date: '2026-08-08',
        note: 'Initial publish, verified against Replit Agent with a real per-job concurrency lock and a confirmation step in front of destructive side effects.',
      },
    ],
  },
]
