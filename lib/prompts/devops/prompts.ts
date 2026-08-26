import type { Prompt } from '../types'

export const prompts: readonly Prompt[] = [
  {
    slug: 'devops-dockerfile-multi-stage-build-hardening',
    category: 'devops',
    title: `Turn a working Dockerfile into a multi-stage build that doesn't ship your build toolchain to production`,
    description: `Rewrites a single-stage Dockerfile into a hardened multi-stage build with a minimal runtime image, a non-root user, and an explicit rationale for every layer decision, so image size and attack surface actually get reviewed instead of copy-pasted from a tutorial.`,
    promptText: `You are a senior software engineer rewriting a Dockerfile for production use, not for a quick local demo. I'll give you the current Dockerfile (or a description of the app if none exists yet) and the runtime constraints, and you produce a multi-stage version plus a short review of what you changed and why.

CURRENT DOCKERFILE OR APP DESCRIPTION
{{current_dockerfile}}

RUNTIME (language/framework, version)
{{runtime_stack}}

BASE IMAGE CONSTRAINT
{{base_image_constraint}}

SECRETS OR BUILD-TIME ARGS IN USE
{{build_time_secrets}}

DEPLOYMENT TARGET
{{deployment_target}}

RULES FOR THE REWRITE
Separate the build stage from the runtime stage explicitly — compilers, dev dependencies, and build tools must never appear in the final layer. Pin the base image to a specific digest or exact version tag, never \`latest\`, and justify the choice against the base image constraint given. Run the final container as a non-root user created in the Dockerfile, not root with a comment saying to fix it later. If build-time secrets are involved, use BuildKit secret mounts or multi-stage copy tricks to keep them out of any layer's history — never bake a credential into an \`ENV\` or \`ARG\` that persists in the image. Order instructions so that the least-frequently-changing layers (dependency installation) come before the most-frequently-changing ones (application source) to maximize build cache hits. Add a \`HEALTHCHECK\` instruction appropriate to the deployment target, and explain why you picked its interval and retry values rather than using defaults with no reasoning.

WHAT NOT TO DO
Do not add unrelated optimizations the user didn't ask about (multi-arch builds, distroless conversion) without flagging them as a separate optional suggestion at the end, clearly separated from the required rewrite. Do not silently drop a system dependency the original Dockerfile installed without confirming it's actually unused by the runtime stack given.

OUTPUT FORMAT
1. The full rewritten Dockerfile in a single code block.
2. A short table: layer/instruction, what changed, why.
3. One paragraph on the resulting image size trade-off and any caching implications.
4. A separate 'optional, not applied' list for anything you noticed but didn't change unprompted.`,
    variables: [
      {
        name: 'current_dockerfile',
        description: `Paste the existing Dockerfile as-is, or describe the app's dependencies and entrypoint if starting from scratch.`,
        example: `FROM node:20
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
CMD ["node", "dist/server.js"]`,
        required: true,
      },
      {
        name: 'runtime_stack',
        description: `The language, framework, and version the container needs to run.`,
        example: `Node.js 20 LTS, Express API, no native addons`,
        required: true,
      },
      {
        name: 'base_image_constraint',
        description: `Any organizational rule about which base images are allowed (registry, vendor, CVE scanning policy).`,
        example: `Must come from our internal Artifactory mirror of official Docker Hub images; Alpine variants preferred for size but must pass Trivy scan with zero criticals`,
        required: false,
      },
      {
        name: 'build_time_secrets',
        description: `Any credentials or tokens the build needs, such as a private npm registry token.`,
        example: `A read-only npm token for our private @acme scope, currently passed as a plain ARG (this is the bug we're fixing)`,
        required: false,
      },
      {
        name: 'deployment_target',
        description: `Where the image actually runs, since health check and signal-handling behavior depends on the orchestrator.`,
        example: `AWS ECS Fargate, tasks get SIGTERM on deploy with a 30-second grace period`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `docker`,
      `dockerfile`,
      `containers`,
      `image-security`,
      `ci-cd`,
      `build-optimization`,
    ],
    whyItWorks: `The rewrite works because it forces the model to reason about the two Dockerfiles that actually matter — the one that builds and the one that ships — as separate artifacts with separate concerns, which is exactly the distinction most tutorial-derived Dockerfiles skip; a single-stage build has no structural way to keep a compiler or dev-dependency tree out of the final image, so asking generically to 'optimize' a Dockerfile without naming the multi-stage requirement tends to produce cosmetic changes like combining RUN lines rather than the actual attack-surface reduction. Pinning the base image to a digest instead of a tag matters mechanically because \`latest\` and even semver tags are mutable pointers — a rebuild six months later can silently pull a different image with different CVEs, which defeats any scanning done at review time; naming this explicitly stops GPT-5.1 from defaulting to the more common but weaker \`FROM node:20-alpine\` pattern it has seen far more often in training data than the pinned-digest form. The non-root user requirement addresses a specific, checkable failure mode: a container running as root inside is one kernel-level container-escape bug away from root on the host, and this is exactly the kind of finding that gets deferred as 'we'll fix it later' unless the Dockerfile is rejected for missing it up front. The layer-ordering instruction is a direct lever on build cache economics — Docker invalidates every layer after the first changed one, so copying source before installing dependencies means every single build reinstalls all dependencies from scratch, which compounds into real CI minutes and cost at scale; stating the ordering rule explicitly prevents the model from defaulting to whatever order the original Dockerfile happened to use.`,
    exampleOutput: `\`\`\`dockerfile
# ---- build stage ----
FROM node:20.11.1-bookworm-slim@sha256:abcd... AS build
WORKDIR /app
COPY package*.json ./
RUN --mount=type=secret,id=npm_token \\
    NPM_TOKEN=$(cat /run/secrets/npm_token) npm ci
COPY . .
RUN npm run build

# ---- runtime stage ----
FROM node:20.11.1-bookworm-slim@sha256:abcd... AS runtime
RUN useradd --uid 1001 --create-home appuser
WORKDIR /app
COPY --from=build --chown=appuser:appuser /app/dist ./dist
COPY --from=build --chown=appuser:appuser /app/node_modules ./node_modules
USER appuser
HEALTHCHECK --interval=15s --timeout=3s --retries=3 CMD node healthcheck.js
CMD ["node", "dist/server.js"]
\`\`\`
Layer table follows, noting the npm token now never touches a committed layer and the image dropped from 1.1GB to roughly 240MB.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-08' }],
    changelog: [
      {
        date: '2026-08-08',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'devops-ci-workflow-flaky-test-triage-and-pipeline-design',
    category: 'devops',
    title: `Design a CI workflow that fails fast, isolates flaky tests, and doesn't punish contributors for a broken shared runner`,
    description: `Builds a CI pipeline configuration (jobs, stages, caching, retry policy) for a real repo's constraints, plus an explicit flaky-test quarantine strategy, instead of a generic lint-test-build template that ignores how the team's tests actually behave today.`,
    promptText: `Act as a senior software engineer who owns CI reliability for this team. I need a CI workflow designed for a specific repo and its specific pain points, not a generic starter template. Work through this in phases.

PHASE 1 — UNDERSTAND CURRENT STATE
Repo and stack:
{{repo_stack}}

Current CI provider and constraints:
{{ci_provider_constraints}}

Known pain points:
{{known_pain_points}}

Ask me up to three clarifying questions only if something above is ambiguous enough to change the design meaningfully (for example, whether tests can run in parallel across multiple containers, or whether secrets are already in a vault). Do not ask questions you could reasonably infer.

PHASE 2 — PIPELINE DESIGN
Propose the stage structure (e.g., lint → unit → integration → build → deploy-gate) with what runs in parallel versus what must be sequential, and why. For each stage, specify what causes it to fail fast versus what's allowed to be non-blocking (informational only). Design a caching strategy for dependencies and build artifacts specific to the stack given, not a generic 'cache node_modules' answer — name the actual cache keys and invalidation triggers.

PHASE 3 — FLAKY TEST HANDLING
Given the known pain points, propose a concrete quarantine mechanism: how a flaky test gets flagged, where it's tracked, how it's prevented from blocking merges while still being visible so it doesn't get forgotten forever, and who is accountable for un-quarantining it. This must be a real, checkable process, not just 'add retries to flaky tests' — retries alone hide a flaky test's existence instead of fixing it.

PHASE 4 — FAILURE MODES
Name the two most likely ways this pipeline design breaks in practice (e.g., cache poisoning across branches, a shared runner pool getting starved during a release week) and what monitoring or alert would catch each one.

OUTPUT FORMAT
1. Any clarifying questions (skip if none needed).
2. The pipeline stage diagram described in prose or an ordered list.
3. The actual CI config file for the provider given, in a code block.
4. The flaky-test quarantine process as a numbered procedure.
5. The two failure modes and their corresponding alerts.`,
    variables: [
      {
        name: 'repo_stack',
        description: `The language, test framework, and rough repo size/test count.`,
        example: `Python 3.12 monorepo, pytest with ~4,200 tests across 6 services, roughly 40 PRs merged per week`,
        required: true,
      },
      {
        name: 'ci_provider_constraints',
        description: `Which CI system is in use and any hard limits (runner count, minutes budget, self-hosted vs. hosted).`,
        example: `GitHub Actions, self-hosted runner pool of 8 machines, no budget for GitHub-hosted large runners`,
        required: true,
      },
      {
        name: 'known_pain_points',
        description: `The actual, specific problems the team has today, not a generic wishlist.`,
        example: `Three integration tests fail intermittently about 15% of the time depending on run order, and PRs regularly get re-run 2-3 times before merging`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `ci-cd`,
      `github-actions`,
      `flaky-tests`,
      `pipeline-design`,
      `test-automation`,
    ],
    whyItWorks: `Structuring this as sequential phases matters because CI design has a dependency chain that a single flat request tends to skip over: you cannot design a sensible quarantine mechanism before understanding what actually causes the flakiness, and you cannot pick a caching strategy without knowing the CI provider's actual constraints, so collapsing all of it into one unstructured ask produces a plausible-sounding but generic pipeline that ignores the team's real bottleneck. Naming that retries alone are not a fix directly heads off GPT-5.1's most common default answer to 'handle flaky tests,' which is to suggest a retry-on-failure wrapper — a real fix but one that, applied alone, actively makes the flakiness invisible in dashboards and removes the pressure to ever actually diagnose it, which is worse than doing nothing if the goal is reliability rather than a quieter merge queue. Asking for actual cache keys and invalidation triggers rather than 'cache dependencies' forces engagement with the specific stack's lockfile format and build tool, since a wrong cache key (for example, keyed on branch name instead of lockfile hash) silently serves stale dependencies across PRs, a bug that's expensive to diagnose precisely because CI passing gives false confidence. The failure-modes phase exists because a pipeline design reviewed only for the happy path is exactly the kind of artifact that looks complete in a PR review but has no answer for what happens during a release-week runner crunch — asking for this explicitly, and pairing each failure mode with a specific alert, converts the deliverable from a static config file into an operationally accountable design a team can actually run without surprises.`,
    exampleOutput: `Clarifying question: Can integration tests run against ephemeral per-PR databases, or do they share one staging DB today? Assuming shared DB based on the pain point described.

Stage design: lint (parallel, fails fast) -> unit tests sharded across 4 runners (fails fast) -> integration tests (sequential, non-blocking for the 3 known-flaky tests, tracked separately) -> build -> deploy-gate (manual approval).

... [full Actions YAML and quarantine procedure follow]`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-10' }],
    changelog: [
      {
        date: '2026-08-10',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'devops-kubernetes-manifest-resource-limits-and-rollout-safety',
    category: 'devops',
    title: `Write a Kubernetes manifest that won't get OOMKilled at 2am because nobody set real resource limits`,
    description: `Generates a Deployment/Service manifest set with resource requests and limits derived from actual observed usage, a rollout strategy suited to the workload, and readiness/liveness probes that won't cause a self-inflicted outage during deploy.`,
    promptText: `You are a senior software engineer producing Kubernetes manifests for a workload that's about to go into a shared cluster, where a badly configured resource limit or probe can take down more than just this one service. I'll give you the app details; you produce the manifests plus a note on every number you chose.

APP AND WORKLOAD TYPE
{{app_workload_type}}

OBSERVED RESOURCE USAGE
{{observed_resource_usage}}

CLUSTER CONSTRAINTS
{{cluster_constraints}}

TRAFFIC PATTERN AND STARTUP BEHAVIOR
{{startup_behavior}}

REQUIREMENTS
Set CPU and memory requests based on the observed usage given, not round-number guesses — requests should reflect steady-state usage so the scheduler doesn't over- or under-pack the node, and limits should give headroom for the traffic pattern described without being so loose that one pod can starve its neighbors. If observed usage isn't given for a number you need, say so explicitly and propose a conservative starting value with an instruction to revisit it after real metrics exist, rather than inventing a number that looks authoritative. Design readinessProbe and livenessProbe separately and explain the difference in consequence if each is misconfigured: a wrong readiness probe removes a pod from load balancing, a wrong liveness probe kills and restarts a container, which is a much more disruptive failure if the timing is wrong for a slow-starting app. Choose a rollout strategy (RollingUpdate parameters, or a note on why Recreate might apply) based on the startup behavior given, and set \`maxUnavailable\`/\`maxSurge\` values you can justify rather than leaving Kubernetes defaults unexamined. Include a PodDisruptionBudget if the cluster constraints suggest node maintenance or autoscaling events are a real risk for this workload.

WHAT NOT TO DO
Do not add a HorizontalPodAutoscaler, NetworkPolicy, or other manifest the user didn't ask about — list them as a separate 'you might also want' suggestion instead of inlining them into the required output. Do not set \`limits\` equal to \`requests\` by default (this causes CPU throttling under normal load) without explicitly confirming that's actually what's wanted here.

OUTPUT FORMAT
1. The full manifest YAML (Deployment, Service, and PodDisruptionBudget if applicable) in one code block.
2. A table of every resource/probe/rollout value chosen, the reasoning, and whether it's based on real data or a conservative placeholder.
3. A short 'you might also want' list of manifests not included.`,
    variables: [
      {
        name: 'app_workload_type',
        description: `What the app is and its general workload shape (stateless API, batch worker, stateful service).`,
        example: `Stateless Go REST API, no local disk state, currently 3 replicas manually`,
        required: true,
      },
      {
        name: 'observed_resource_usage',
        description: `Real metrics if you have them (from Prometheus, kubectl top, or a load test), or state that none exist yet.`,
        example: `p95 CPU around 180m and memory steady around 220Mi under normal load, based on 2 weeks of Prometheus data; no data yet for peak traffic events`,
        required: true,
      },
      {
        name: 'cluster_constraints',
        description: `Node sizes, autoscaling behavior, and any policies the cluster already enforces.`,
        example: `Shared EKS cluster, nodes are m5.xlarge, cluster-autoscaler scales nodes down aggressively overnight`,
        required: true,
      },
      {
        name: 'startup_behavior',
        description: `How long the app takes to become ready and whether it has a slow warm-up (JIT, cache priming, DB connection pool).`,
        example: `Takes about 12 seconds to accept traffic after container start due to a connection pool warm-up; no slow JIT concerns since it's compiled Go`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`kubernetes`, `k8s-manifests`, `resource-limits`, `rollout-strategy`, `sre`],
    whyItWorks: `Requiring the model to tie CPU and memory requests to actual observed usage, and to say so explicitly when no data exists, closes off the most common failure mode in generated manifests: a plausible-looking \`resources\` block with round numbers like \`500m\`/\`512Mi\` that were never checked against anything and that either starve the pod under real load or waste so much capacity that the scheduler can't bin-pack the node efficiently — both outcomes look fine in a code review and only surface as an incident later. Separating the readiness and liveness probe reasoning is a direct fix for a specific, well-documented Kubernetes footgun: a liveness probe timed too aggressively for an app with a real startup delay causes Kubernetes to kill and restart a container that was simply still warming up, which creates a crash loop that looks like an application bug but is actually a probe misconfiguration — asking the model to reason about consequence-of-misconfiguration per probe type, rather than filling in both with the same default timing, is what prevents this. Tying the rollout strategy's \`maxUnavailable\`/\`maxSurge\` to the startup behavior given, rather than accepting Kubernetes' defaults silently, matters because the default RollingUpdate settings assume a fast-starting pod; an app with a 12-second warm-up rolled out with default surge settings can end up briefly under-capacity during a deploy in exactly the way a PodDisruptionBudget and correct probe timing together are meant to prevent. Explicitly excluding HPA and NetworkPolicy unless asked keeps the deliverable scoped to what was actually requested instead of the model padding the answer with tangentially related manifests that dilute review attention away from the resource and probe numbers that actually carry risk here.`,
    exampleOutput: `resources:
  requests: { cpu: "200m", memory: "256Mi" }
  limits: { cpu: "500m", memory: "384Mi" }
(based on p95 CPU 180m + 10% headroom; memory limit set above the 220Mi steady-state to absorb GC spikes, not equal to request to avoid CPU throttling)
readinessProbe: initialDelaySeconds 15, periodSeconds 5 (accounts for the 12s warm-up plus margin)
livenessProbe: initialDelaySeconds 30, periodSeconds 10, failureThreshold 3 (deliberately looser than readiness so a slow warm-up never triggers a restart)...`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-12' }],
    changelog: [
      {
        date: '2026-08-12',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'devops-security-review-pre-merge-infra-change-audit',
    category: 'devops',
    title: `Get a security review of an infrastructure change before it merges, not a generic OWASP checklist`,
    description: `Reviews a specific infrastructure or config change (IaC diff, new service, permission grant) for concrete security issues tied to what actually changed, ranked by exploitability, instead of a boilerplate security checklist that doesn't engage with the diff.`,
    promptText: `Review the following infrastructure change for security issues before it merges. Focus only on what this specific change introduces or alters — do not produce a general security checklist unrelated to the diff.

THE CHANGE
{{the_change}}

SYSTEM CONTEXT
{{system_context}}

WHO/WHAT CAN REACH THIS
{{exposure_surface}}

COMPLIANCE OR POLICY CONSTRAINTS THAT APPLY
{{compliance_constraints}}

For every issue you find, state: what specifically in the change causes it, how it could actually be exploited given the exposure surface described (not a hypothetical worst case unrelated to this system), and how confident you are that it's a real issue versus something that needs a human to verify (e.g., you can't see the full IAM policy, only this diff). Rank issues by exploitability given the actual exposure surface, not by textbook severity alone — a critical-sounding misconfiguration on an internal-only service reachable by nobody outside a VPN is lower priority than a moderate one on something internet-facing. If the change looks fine, say so plainly rather than manufacturing a minor finding to seem thorough. Do not invent a specific CVE, compliance clause, or statistic — if you reference a class of vulnerability or a compliance requirement, describe it generically and tell me to verify the specific clause number or CVE ID myself rather than stating one as fact.

WHAT NOT TO DO
Do not produce a generic 'security best practices' list disconnected from this specific diff. Do not flag something as an issue without stating the concrete exploit path — 'this could be a security risk' without a mechanism is not a usable finding.

OUTPUT FORMAT
1. Verdict: change looks safe to merge / has issues that should block merge / has issues worth fixing but not blocking, with one-line reasoning.
2. Findings table: issue, exact location in the diff, concrete exploit path given the exposure surface, confidence (high/needs-human-verification), severity given actual exposure.
3. Anything you could not fully assess because you can't see surrounding context (e.g., the full network policy, the rest of the IAM role) — name exactly what additional context would let you finish the assessment.`,
    variables: [
      {
        name: 'the_change',
        description: `The actual diff, config snippet, or description of what's being added or modified.`,
        example: `Terraform diff adding an S3 bucket policy that grants \`s3:GetObject\` to \`Principal: "*"\` for a bucket storing generated PDF invoices`,
        required: true,
      },
      {
        name: 'system_context',
        description: `What this piece of infrastructure is part of and what data or function it handles.`,
        example: `Invoice generation pipeline; bucket holds customer-facing PDF invoices with names, addresses, and line-item pricing, no payment card data`,
        required: true,
      },
      {
        name: 'exposure_surface',
        description: `Who or what can actually reach this — internal only, authenticated users, fully public internet.`,
        example: `Bucket is currently only linked from authenticated customer portal pages, but the new policy would make objects fetchable by anyone with the URL, authenticated or not`,
        required: true,
      },
      {
        name: 'compliance_constraints',
        description: `Any policy or regulatory framework relevant to this data, without asserting specific clause text.`,
        example: `This data falls under our internal PII handling policy; not sure if GDPR data-residency rules apply since some customers are in the EU`,
        required: false,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [`security-review`, `infrastructure-as-code`, `appsec`, `iam`, `compliance`],
    whyItWorks: `Anchoring the review to the actual diff and exposure surface, rather than inviting a general security checklist, is what stops GPT-5.1 from defaulting to its most common failure mode on open-ended security prompts: producing a broad, textbook-derived list of best practices (rotate keys, enable MFA, use least privilege) that sounds thorough but doesn't engage with what the specific change actually does, which reads well in a PR comment but gives the reviewer nothing they couldn't have found in a generic OWASP page. Requiring a concrete exploit path per finding, tied to the stated exposure surface, forces the model to reason about actual reachability rather than severity in the abstract — a public S3 read policy is a very different risk on an internal-tools bucket behind a VPN than on a customer-facing invoice bucket, and ranking by textbook severity alone (which is what an unscoped prompt tends to produce) would flag both identically, burying the finding that actually matters under equally-weighted noise. The explicit ban on inventing a specific CVE or compliance clause number addresses a known and serious failure mode of LLM-generated security content: models will confidently cite a plausible-sounding CVE ID or GDPR article that does not correspond to the real one, which is actively dangerous in a security review because a wrong citation can make a reviewer trust a finding (or dismiss one) based on authority that doesn't actually exist — instructing the model to describe the vulnerability class generically and defer the specific citation to human verification keeps the review useful without smuggling in fabricated authority. The confidence field matters because a static diff reviewer genuinely cannot see the full IAM role, the rest of the network policy, or runtime behavior, and a review that doesn't distinguish 'I can see this is wrong' from 'I can't rule this out without more context' invites false confidence in exactly the kind of review meant to prevent it.`,
    exampleOutput: `Verdict: has issues that should block merge. Finding: the new bucket policy statement grants \`s3:GetObject\` to \`Principal: "*"\`, meaning any unauthenticated party with an object URL or key pattern can fetch invoice PDFs containing customer names and addresses; exploit path is trivial URL enumeration or leaked link sharing, no auth bypass needed since none exists in the new policy. Confidence: high, based directly on the diff. Needs human verification: whether object keys are guessable/sequential, which I can't assess from this diff alone.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-13' }],
    changelog: [
      {
        date: '2026-08-13',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'devops-dependency-upgrade-major-version-breaking-change-plan',
    category: 'devops',
    title: `Plan a major dependency upgrade so breaking changes get caught before your users find them`,
    description: `Turns a scary major-version dependency bump into a scoped upgrade plan — breaking-change inventory, migration order, and a rollback trigger — based on the actual changelog and codebase usage instead of a blind bump-and-hope.`,
    promptText: `I need to upgrade {{dependency_name}} from {{current_version}} to {{target_version}} and I want a real migration plan, not just 'bump the version and run the tests.'

DEPENDENCY AND VERSIONS
{{dependency_name}} from {{current_version}} to {{target_version}}

HOW WE USE IT
{{usage_pattern}}

CHANGELOG OR RELEASE NOTES I HAVE
{{changelog_excerpt}}

TEST COVERAGE ON AFFECTED CODE
{{test_coverage_state}}

Go through this as a plan, not a single answer dump:

Step 1 — From the changelog excerpt given, list every breaking change that plausibly touches the usage pattern I described. If the changelog excerpt doesn't mention something you'd expect to be relevant (e.g., a known common breaking pattern for this kind of library), say so and tell me what to go check in the full release notes rather than guessing at what it says.

Step 2 — For each breaking change identified, state the specific code pattern in our codebase that would need to change, based on the usage pattern described, and roughly how mechanical versus how risky that specific change is.

Step 3 — Given the test coverage state described, tell me plainly whether it's safe to make this upgrade with confidence, or whether specific tests should be written first before touching the dependency — name what those tests should assert, not just 'add more tests.'

Step 4 — Propose a migration order (e.g., which breaking changes to fix first, whether to do it in one PR or several) and a concrete rollback trigger: what specific signal after deploy would tell us this upgrade needs to be reverted, not a vague 'if something breaks.'

Do not invent specific breaking changes that aren't grounded in the changelog excerpt I gave you — if you're inferring a likely issue rather than reading it directly from the changelog, label it explicitly as an inference to verify against the real release notes.

OUTPUT FORMAT
1. Breaking changes table: change, why it matters to our usage, mechanical or risky, source (from changelog / inferred - verify).
2. Test coverage verdict and any tests to write first.
3. Migration order and PR-splitting recommendation.
4. The specific rollback trigger signal(s) to watch post-deploy.`,
    variables: [
      {
        name: 'dependency_name',
        description: `The package being upgraded.`,
        example: `SQLAlchemy`,
        required: true,
      },
      {
        name: 'current_version',
        description: `The version currently in use.`,
        example: `1.4.51`,
        required: true,
      },
      {
        name: 'target_version',
        description: `The version being upgraded to.`,
        example: `2.0.29`,
        required: true,
      },
      {
        name: 'usage_pattern',
        description: `How the dependency is actually used in the codebase — which APIs, patterns, or extensions.`,
        example: `Used across ~30 model files with the legacy Query API and implicit autocommit sessions in a Flask app; no async usage`,
        required: true,
      },
      {
        name: 'changelog_excerpt',
        description: `The relevant portion of the release notes or migration guide you have on hand.`,
        example: `Migration guide states Query.get() is removed in favor of Session.get(), and autocommit mode is removed entirely in 2.0`,
        required: true,
      },
      {
        name: 'test_coverage_state',
        description: `How well the affected code is currently tested.`,
        example: `Model layer has maybe 40% coverage, mostly happy-path CRUD tests, nothing testing transaction/rollback behavior`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT (GPT-5.1)`],
    tags: [
      `dependency-management`,
      `major-version-upgrade`,
      `migration-planning`,
      `breaking-changes`,
      `test-coverage`,
    ],
    whyItWorks: `Grounding the breaking-change inventory explicitly in the changelog excerpt provided, with a required label distinguishing 'from the changelog' versus 'inferred, verify yourself,' is the single most important guard here: major-version migration guides are exactly the kind of specific, verifiable technical content where an LLM will otherwise blend real changes it has seen in training with plausible-sounding ones it's pattern-matching from similar libraries, and for something like a SQLAlchemy 1.4-to-2.0 upgrade, an invented breaking change that isn't real wastes engineering time chasing a non-issue while a real one that gets missed ships silently. Sequencing this as four dependent steps rather than one combined answer mirrors how the actual risk assessment has to work — you cannot sensibly recommend a rollback trigger before knowing which breaking changes are risky, and you cannot judge whether existing tests are sufficient without first knowing what specifically needs to keep working, so a flattened single-pass prompt tends to produce a rollback trigger like 'watch error rates' that's too vague to act on because it wasn't derived from the actual risky code paths identified two steps earlier. The requirement to name what specific tests to write, rather than a generic 'improve test coverage' recommendation, matters because 'add more tests' is unfalsifiable advice that every migration plan could say regardless of the dependency; naming the actual assertion (in the example output, transaction rollback behavior under the new engine) ties the recommendation to the exact gap the test-coverage description revealed. Asking for a concrete post-deploy rollback signal rather than accepting 'monitor closely' forces the plan to commit to something operationally checkable, which is the difference between a migration plan a team can actually execute against and one that reads well but leaves the hardest judgment call — when do we actually revert — unanswered.`,
    exampleOutput: `Breaking change: Query.get() removed, replaced by Session.get() (source: changelog, directly stated). Affects roughly 30 model files using the legacy Query API — mechanical find-and-replace with a signature change, low risk. Breaking change: autocommit mode removed entirely (source: changelog). This is the risky one given your Flask app relies on implicit autocommit — every place a session currently commits implicitly now needs an explicit commit() call, and since your test coverage doesn't currently assert transaction/rollback behavior, this is the specific gap to close with tests before touching the dependency, not the CRUD happy-path tests you already have...`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-14' }],
    changelog: [
      {
        date: '2026-08-14',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
]
