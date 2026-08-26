import type { Prompt } from '../types'

export const prompts: readonly Prompt[] = [
  {
    slug: 'python-function-spec-to-typed-code',
    category: 'python',
    title: 'Turn a plain-English function spec into fully type-hinted Python',
    description:
      'A prompt that converts a rough description of what a function should do into PEP 484-typed Python with explicit edge-case handling, a real docstring, and a typed return object — instead of untyped happy-path code that only handles the example in the spec.',
    promptText: `You are implementing a single Python function against a strict specification, not sketching a rough first draft. Treat this the way a senior reviewer would: nothing ships without full type hints, a real docstring, and explicit handling for every edge case named below — and for any edge case you notice that isn't named but would break this function in the calling context described.

SPEC
{{function_spec}}

TARGET ENVIRONMENT
Python {{python_version}}. Dependencies allowed beyond the standard library: {{allowed_packages}}. Do not import anything outside that list, and do not assume a package is available just because it is common — if you genuinely need something not listed, say so and explain why the standard library alone can't do the job.

CALLING CONTEXT
{{calling_context}}

REQUIREMENTS
1. Full type hints on every parameter, the return type, and any local variable whose type isn't immediately obvious from its assignment. No bare Any anywhere — if you truly can't narrow a type further, say so in an inline comment naming why.
2. A docstring in Google or NumPy style: one-line summary, then Args, Returns, and Raises sections listing every exception the function can actually raise, not a generic "may raise an exception."
3. Explicit, named handling for: {{edge_cases}}. Each one needs a specific, intentional outcome — a specific return value or a specific raised exception type — never a silent fallthrough to whatever the last line of the function happens to do.
4. If you notice an edge case not in {{edge_cases}} that would break this function given the calling context above, name it and handle it anyway. Don't treat the given list as the ceiling of what you're responsible for.
5. No print() calls anywhere for control flow, debugging, or status reporting — use the logging module at an appropriate level if the function needs to report anything during execution.
6. Prefer a typed dataclass or NamedTuple over a bare tuple or dict when the function returns more than one related value, so callers get named fields and type-checker support instead of guessing at positional order.

OUTPUT FORMAT
1. The function, fully typed and documented, plus any small supporting type (a dataclass, an Enum, a TypedDict) it needs.
2. A table: each edge case from {{edge_cases}} plus anything you added, what triggers it, and exactly what the function does in that case.
3. Two runnable call examples: one on the happy path with a realistic input, and one that deliberately triggers a handled failure, showing what's raised or returned.`,
    variables: [
      {
        name: 'function_spec',
        description:
          'What the function should do, in plain English, including inputs and the shape of the output.',
        example:
          'Given a list of shipment dicts (each with "weight_kg" and "destination_country"), return the total customs duty owed in USD, using a duty-rate table keyed by ISO country code.',
        required: true,
      },
      {
        name: 'python_version',
        description:
          'The Python version this needs to run on, so syntax stays compatible.',
        example: '3.12+',
        required: true,
      },
      {
        name: 'allowed_packages',
        description: 'Third-party packages allowed beyond the standard library, if any.',
        example: 'stdlib only, no third-party packages',
        required: false,
      },
      {
        name: 'edge_cases',
        description:
          'The specific edge cases that must be handled explicitly, not left implicit.',
        example:
          'empty shipment list, a shipment missing "weight_kg", a destination_country not present in the duty-rate table, a negative weight',
        required: true,
      },
      {
        name: 'calling_context',
        description:
          'What calls this function and what happens system-wide if it gets bad input, so error handling matches the real blast radius.',
        example:
          'Called once per warehouse batch job, batch size up to 5,000 shipments — must not raise on a single bad record and abort the whole batch.',
        required: true,
      },
    ],
    targetTools: ['ChatGPT (GPT-5.2)', 'Claude (Sonnet 4.6)', 'GitHub Copilot Chat'],
    tags: [
      'type-hints',
      'function-generation',
      'mypy',
      'pep-484',
      'edge-cases',
      'python',
    ],
    whyItWorks: `Naming the edge cases explicitly, then requiring the model to add any it notices beyond that list, splits the task into two different cognitive jobs instead of one: satisfy a checklist, and separately reason about the calling context enough to catch what the checklist missed. A model asked only to "write this function" defaults to the happy path implied by the spec's example, because that path has the least ambiguity to resolve — an explicit edge-case list removes that ambiguity for the listed cases, and the follow-up instruction removes the excuse for the unlisted ones. Requiring a docstring's Raises section to name every exception the function can actually raise, rather than a generic line, forces the model to trace its own control flow before calling the job finished — if it can't name what's raised where, the implementation isn't actually done, it just looks done. The calling_context variable does something the other fields can't: edge_cases describes what bad data looks like, but calling_context describes what happens to the whole system when this one function gets something unexpected, which is why "must not abort a 5,000-record batch on one bad row" changes the actual design toward catch-and-report-per-item rather than just changing which exception type gets raised. Preferring a typed dataclass or NamedTuple return over a bare tuple is a small requirement with an outsized payoff: a positional tuple return means every call site has to remember field order by convention, and a type checker cannot catch a caller who swaps two same-typed fields, where a named field can be both checked and autocompleted. Finally, banning print() for anything but the logging module matters specifically because a function with print-based status reporting can't be safely reused inside a library or service — printing to stdout is a side effect that pollutes output for every caller, including ones piping the function's actual return value somewhere structured, while a log call at an appropriate level respects whatever logging configuration the caller already has in place.`,
    exampleOutput: `@dataclass(frozen=True)
class DutyResult:
    total_usd: float
    skipped: int

def total_customs_duty(shipments: list[dict[str, float | str]], rate_table: dict[str, float]) -> DutyResult:
    """Sum customs duty owed across a batch of shipments.

    Args:
        shipments: Each dict must have "weight_kg" (float) and "destination_country" (ISO code).
        rate_table: Maps ISO country code to a per-kg USD duty rate.

    Returns:
        DutyResult with the total in USD and a count of skipped (invalid) records.

    Raises:
        Nothing — invalid records are counted as skipped, never raised, per the batch calling context.
    """
    total = 0.0
    skipped = 0
    for s in shipments:
        weight = s.get("weight_kg")
        country = s.get("destination_country")
        if not isinstance(weight, (int, float)) or weight < 0 or country not in rate_table:
            skipped += 1
            continue
        total += float(weight) * rate_table[str(country)]
    return DutyResult(total_usd=round(total, 2), skipped=skipped)

Edge case notes: empty list returns DutyResult(0.0, 0); missing "weight_kg" or unknown country increments skipped rather than raising, per the batch context; negative weight also counts as skipped.`,
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.2', date: '2026-07-20' },
      { tool: 'Claude', version: 'Sonnet 4.6', date: '2026-07-21' },
    ],
    changelog: [
      {
        date: '2026-07-21',
        note: 'Initial publish, verified against ChatGPT (GPT-5.2) and Claude (Sonnet 4.6).',
      },
    ],
  },
  {
    slug: 'python-fastapi-endpoint-from-requirements',
    category: 'python',
    title: 'Scaffold a FastAPI endpoint with real validation and status codes',
    description:
      'A prompt that turns an endpoint requirement into a complete FastAPI route with Pydantic v2 models, correct HTTP status codes, and dependency-injected services, instead of a bare route stub returning a dict.',
    promptText: `Scaffold one FastAPI endpoint. This is a real service route, not a toy example — include validation, correct status codes, and dependency injection, the way it would actually ship.

ENDPOINT REQUIREMENT
{{endpoint_requirements}}

CONVENTIONS TO FOLLOW
- Use APIRouter, mounted under /api/v1, resource name {{resource_name}}.
- Request and response bodies are Pydantic v2 models (BaseModel, not raw dicts) with Field constraints matching the requirement — don't accept a wider type than the spec allows.
- Use response_model on the route decorator, and the correct status code from fastapi.status (201 for creation, 204 for delete with no body, 404 when a lookup fails — 422 is Pydantic's job to raise automatically, not yours to hand-roll).
- Inject dependencies (DB session, current user, rate limiter, etc.) via Depends(...), never instantiate them inside the handler. Assume this dependency already exists and is wired: {{db_dependency_description}}.
- Auth: {{auth_requirement}}. If it's "none," don't add an auth dependency; don't invent one either just because most routes in a typical app have one.
- All I/O is async def. If a called function is genuinely synchronous or CPU-bound, say so explicitly and wrap it with run_in_threadpool rather than blocking the event loop silently inside an async handler.
- Raise HTTPException with a specific status and a specific detail message for every failure path named in the requirement — don't let an unhandled case fall through to a generic 500 that tells the caller nothing.
- Concurrency edge case: {{concurrency_note}}. If two requests could race on the same resource, say explicitly what prevents a lost update or duplicate row, rather than assuming single-request timing.
- Pagination: if the endpoint returns a list, use limit/offset or cursor-based pagination matching the resource's expected size, and cap the maximum page size server-side — never trust a client-supplied limit as unbounded, since that turns one request into an accidental full-table scan.
- Idempotency: if the requirement implies a client might retry the same request (anything payment-adjacent or otherwise non-idempotent), state whether an idempotency key is needed and exactly how it's checked before the write happens — silently allowing an identical retry to double-create or double-charge is a real design gap, not a rare edge case to wave off.

OUTPUT FORMAT
1. The Pydantic request/response models, with every Field constraint justified against the requirement.
2. The route function, fully wired with its dependencies.
3. A one-line note per status code used, mapping it to the exact requirement or failure path it satisfies.
4. One sentence on how {{concurrency_note}} is actually addressed, or a stated reason it isn't a real risk here.
5. One sentence on whether this endpoint needed pagination or idempotency handling, and what was done about it if so.`,
    variables: [
      {
        name: 'endpoint_requirements',
        description:
          'What the endpoint needs to do — method, inputs, outputs, and the failure cases that matter.',
        example:
          "POST a new subscription for a user: takes plan_id and payment_method_id, returns the created subscription, 404 if plan_id doesn't exist, 409 if the user already has an active subscription.",
        required: true,
      },
      {
        name: 'resource_name',
        description: 'The resource name the route is mounted under.',
        example: 'subscriptions',
        required: true,
      },
      {
        name: 'db_dependency_description',
        description:
          'The existing dependency the handler should assume and inject, without redefining it.',
        example: 'get_db_session() -> AsyncSession, already defined in app/api/deps.py',
        required: true,
      },
      {
        name: 'auth_requirement',
        description: 'What auth this route needs, or "none" if it is public.',
        example: 'requires an authenticated user via get_current_user()',
        required: true,
      },
      {
        name: 'concurrency_note',
        description:
          'Whether two simultaneous requests could conflict on the same underlying data.',
        example:
          'Two requests from the same user could both pass the "no active subscription" check before either commits, creating two active subscriptions.',
        required: false,
      },
    ],
    targetTools: [
      'GitHub Copilot Chat',
      'Cursor 2.1',
      'Claude Code',
      'ChatGPT (GPT-5.1)',
    ],
    tags: ['fastapi', 'api-design', 'pydantic', 'rest-api', 'concurrency', 'python'],
    whyItWorks: `FastAPI derives its automatic OpenAPI schema and request validation directly from the type hints on the route function and the Pydantic models it declares, so a scaffold that skips response_model or accepts a raw dict quietly loses the framework's main benefit — it still runs, but the generated docs and validation are wrong or missing, which is invisible until a client relies on the schema and gets surprised. Naming the exact status code per failure path (404 for a missing lookup, 409 for a conflict) stops the common default of returning 200 with an error message buried in the body, which breaks every client that checks the HTTP status rather than parsing the payload for a hidden error field. The explicit instruction to wrap blocking calls with run_in_threadpool addresses FastAPI's single most common production bug: an async def handler that calls a synchronous, blocking function directly, which stalls the entire event loop for every other request being served by that worker, not just the slow one — a bug that is invisible under a load test with one client and catastrophic under real concurrent traffic. The concurrency_note field earns its place because Pydantic validation and a 409 check both run per-request in isolation — nothing about validating one request's body prevents a second, near-simultaneous request from passing the same "no active subscription" check before either has committed, and a scaffold that only reasons about a single request in isolation will silently produce a route that allows exactly the duplicate-row race condition the 409 status code was supposed to prevent in the first place. The idempotency requirement matters for a related but distinct reason: HTTP clients and mobile apps retry on timeout by design, so a POST that isn't idempotent will occasionally execute twice for the exact same user action whenever a response is slow or dropped in transit, regardless of any concurrency locking already in place — locking prevents two different requests from racing each other, while idempotency prevents one request's own network retry from doing the same write a second time, and a scaffold that only solves the first problem still leaves the second one live in production.`,
    exampleOutput: `class SubscriptionCreate(BaseModel):
    plan_id: UUID
    payment_method_id: str = Field(min_length=1)

class SubscriptionOut(BaseModel):
    id: UUID
    plan_id: UUID
    status: str

@router.post("/subscriptions", response_model=SubscriptionOut, status_code=status.HTTP_201_CREATED)
async def create_subscription(
    body: SubscriptionCreate,
    db: AsyncSession = Depends(get_db_session),
    current_user: User = Depends(get_current_user),
) -> SubscriptionOut:
    plan = await get_plan(db, body.plan_id)
    if plan is None:
        raise HTTPException(status_code=404, detail="Plan not found")
    async with db.begin():
        if await user_has_active_subscription(db, current_user.id, for_update=True):
            raise HTTPException(status_code=409, detail="User already has an active subscription")
        subscription = await create_subscription_record(db, current_user.id, body)
    return subscription

Concurrency: the active-subscription check and the insert now happen inside one db.begin() transaction with a row-level lock (for_update=True), so two simultaneous requests can no longer both pass the check before either commits.`,
    verifiedAgainst: [
      { tool: 'GitHub Copilot Chat', version: '1.261 (VS Code)', date: '2026-07-21' },
      { tool: 'Cursor', version: '2.1', date: '2026-07-22' },
    ],
    changelog: [
      {
        date: '2026-07-22',
        note: 'Initial publish, verified against GitHub Copilot Chat and Cursor 2.1 on FastAPI 0.115.',
      },
    ],
  },
  {
    slug: 'python-pytest-suite-from-function-behavior',
    category: 'python',
    title: 'Generate a pytest suite that tests behavior, not implementation',
    description:
      'A test-generation prompt that requires parametrized cases, isolated external dependencies, and named edge-case coverage, instead of a handful of near-duplicate happy-path tests that break on any refactor.',
    promptText: `Write a pytest test suite for the code below. Test the documented behavior and contract, not the internal implementation — if the function's logic were rewritten to do the same thing a different way, these tests should still mostly pass.

CODE UNDER TEST
{{target_code}}

EXTERNAL DEPENDENCIES TO ISOLATE
{{external_dependencies}}. Mock or fake these — do not let the test suite depend on a real network call, real file I/O, or a real database. Use pytest-mock's mocker fixture or unittest.mock.patch, patched at the point of use, not at its original definition.

CURRENT COVERAGE GAP
{{coverage_gap}}

REQUIREMENTS
1. Use @pytest.mark.parametrize for any case that shares the same assertion shape with different inputs — don't hand-write five near-identical test functions when one parametrized table says the same thing more clearly.
2. Use fixtures for setup shared across tests, and scope each fixture (function, module, session) to the narrowest scope that's still correct — a session-scoped fixture holding mutable state is a bug waiting for test order to change.
3. Cover: the happy path, {{known_edge_cases}}, the gap named in {{coverage_gap}}, and at least one case not listed that you judge worth testing — name why you added it.
4. For anything defined with async def, use pytest-asyncio's async test support — don't wrap async code in asyncio.run() inside a synchronous test.
5. Name each test after the behavior it verifies (e.g. test_returns_empty_list_when_no_matches), not test_1 or test_case_a — a failing test name should tell someone what broke without opening the file.
6. Assert on outcomes and raised exceptions with pytest.raises, never on internal call counts unless the actual requirement is "this must call X exactly once," in which case say so explicitly before asserting it.
7. Every test must be runnable in isolation and in any order — no test may rely on state a different test happened to leave behind, such as a module-level counter or a fixture mutated by an earlier test in the file. If a test genuinely needs a specific order relative to another, say so explicitly and mark it clearly, rather than depending on pytest's default file order by accident and having the suite quietly break the day someone reorders the tests for readability.

OUTPUT FORMAT
1. The test file.
2. A short list of anything you could not test without more context (e.g. a fixture needing real credentials, a race condition that needs a specific timing setup) and why.
3. A one-line map from each test back to the requirement or edge case it covers, so coverage can be checked against {{known_edge_cases}} and {{coverage_gap}} at a glance rather than trusted on faith.`,
    variables: [
      {
        name: 'target_code',
        description:
          'The function or class to test, pasted in full, with its signature and docstring if it has one.',
        example:
          'def parse_discount_code(code: str, cart_total: float) -> DiscountResult: ...',
        required: true,
      },
      {
        name: 'external_dependencies',
        description: 'What the code calls out to that a test should not touch for real.',
        example: 'a database session, an external tax-rate API call',
        required: true,
      },
      {
        name: 'coverage_gap',
        description:
          'A specific behavior known to be untested today, so it gets covered explicitly.',
        example:
          'Nobody has ever tested what happens when the same discount code is applied twice in one cart session.',
        required: false,
      },
      {
        name: 'known_edge_cases',
        description:
          "Edge cases you already know matter, so the model doesn't have to guess them.",
        example:
          'expired discount codes, codes with leading/trailing whitespace, a valid code where cart_total is below the minimum spend',
        required: false,
      },
    ],
    targetTools: [
      'Claude Code',
      'GitHub Copilot Chat',
      'Cursor 2.1',
      'ChatGPT (GPT-5.1)',
    ],
    tags: ['pytest', 'testing', 'test-generation', 'mocking', 'parametrize', 'python'],
    whyItWorks: `Explicitly requiring parametrize over hand-written near-duplicates changes the shape of the output, not just its length: a table of parametrized cases makes a missing row visually obvious to a reviewer, where a missing copy-pasted test function is easy to not notice at all sitting among four others that look almost identical. Naming "test behavior, not implementation" directly targets a common LLM test-generation failure — asserting on internal state or exact call counts that make the suite brittle against any refactor, even a correct one, so a passing test suite stops meaning "the behavior is right" and starts meaning "nobody touched the internals yet." The dependency-isolation instruction, including the detail about patching at the point of use rather than the original definition, is what keeps a generated suite from silently becoming an integration test that fails in CI for reasons unrelated to the code under test, such as a network blip, or from failing to actually mock anything at all because unittest.mock.patch was pointed at the wrong import path — a specific, very common mocking mistake that produces a test that looks isolated but still hits the real dependency. The coverage_gap field matters because it names a known blind spot directly rather than hoping the model happens to think of it independently — "double-applying a discount code" is exactly the kind of scenario nobody writes a test for until it causes a real incident, and naming it converts a known risk into a guaranteed test rather than a lucky one. Finally, requiring one additional case the model chooses and justifies, beyond the given lists, forces actual reasoning about the function's contract instead of just executing a checklist — the justification is what separates a genuinely useful addition from padding the test count. The isolation-and-order requirement closes a related gap: a suite that only passes when run in file order, or only when a specific test happens to run first, is passing by accident, not by design.`,
    verifiedAgainst: [{ tool: 'Claude Code', version: 'Sonnet 4.6', date: '2026-07-22' }],
    changelog: [
      {
        date: '2026-07-22',
        note: 'Initial publish, verified against Claude Code (Sonnet 4.6) on pytest 8.3.',
      },
    ],
  },
  {
    slug: 'python-pandas-dataframe-cleaning-pipeline',
    category: 'python',
    title: 'Turn a messy DataFrame into a documented, reproducible cleaning pipeline',
    description:
      'A prompt for building a pandas cleaning pipeline as small, named, chainable functions with logged row drops and a schema check at the end, instead of one long unexplained block of reassignments.',
    promptText: `Write a pandas data-cleaning pipeline for the DataFrame described below. The output must be a set of small, named, testable functions chained together — not one long block of unexplained df[...] reassignments that only make sense read top to bottom in one sitting.

INPUT DATA
{{dataframe_description}}

KNOWN ISSUES TO FIX
{{known_issues}}

TARGET SCHEMA
{{target_schema}}

MEMORY CONSTRAINT
{{memory_constraint}}

REQUIREMENTS
1. Each cleaning step is its own function taking a DataFrame and returning a DataFrame (e.g. def drop_duplicate_orders(df: pd.DataFrame) -> pd.DataFrame), so the pipeline reads as df.pipe(step_a).pipe(step_b)... — reviewable and testable step by step, not one monolithic function nobody can unit test in isolation.
2. Never mutate the input DataFrame in place inside a step; return a new one (with .copy() where needed) so steps stay composable and order-independent bugs are easier to spot — a step that mutates in place breaks the moment someone reorders the pipe() chain.
3. For every row dropped or value changed, log a count — a silent drop of bad rows is a data-loss bug wearing a clean-code costume, and a "cleaning" step that drops 40% of rows without a trace is worse than the messy data it replaced.
4. Validate the final shape against {{target_schema}}: correct dtypes (don't leave a date column as object), no unexpected nulls in required columns, and fail loudly with a clear message if the result doesn't match, rather than returning a DataFrame that's quietly wrong.
5. Use vectorized pandas operations; only drop to apply() with a Python-level loop if you can state why a vectorized approach isn't possible, and if {{memory_constraint}} rules out loading the whole thing at once, say explicitly which steps would need chunked or streaming reads instead.
6. Give every step function a short docstring stating which entry in {{known_issues}} it fixes — a reviewer should be able to match each function to a known problem without re-deriving what it does from the code alone.
7. Order the steps deliberately, not incidentally: a step that depends on another step's output (parsing dates before filtering on a date range, say) must come after it, and any such ordering dependency should be stated in a comment so nobody reorders the pipe() chain later assuming the steps are independent when they aren't.

OUTPUT FORMAT
1. Each step function, in order, with its logging and its docstring naming the issue it fixes.
2. The pipe() chain that composes them.
3. One validation function that checks the result against {{target_schema}} and raises if it doesn't match.
4. One sentence on whether {{memory_constraint}} is actually satisfied by this design, or what would need to change if not.
5. Any ordering dependency between steps, stated explicitly, or confirmation the steps are genuinely order-independent.`,
    variables: [
      {
        name: 'dataframe_description',
        description: 'What the DataFrame contains — columns, source, and rough size.',
        example:
          'orders.csv, ~200k rows: order_id, customer_email, order_date (string), amount, status',
        required: true,
      },
      {
        name: 'known_issues',
        description: 'The specific data quality problems already known to exist.',
        example:
          'duplicate order_id rows, order_date in mixed formats, some amount values as "$1,200.00" strings',
        required: true,
      },
      {
        name: 'target_schema',
        description:
          'What the cleaned output must look like — required columns, dtypes, and null rules.',
        example:
          'order_id: unique int; order_date: datetime64; amount: float, no nulls; status: one of a fixed set of values',
        required: true,
      },
      {
        name: 'memory_constraint',
        description:
          'Whether the full dataset comfortably fits in memory, and on what kind of machine.',
        example:
          'Runs on a CI worker with 4GB RAM; the CSV is currently ~180MB but expected to grow 3x within a year.',
        required: false,
      },
    ],
    targetTools: [
      'ChatGPT (GPT-5.1)',
      'Claude (Sonnet 4.6)',
      'Jupyter AI',
      'GitHub Copilot Chat',
    ],
    tags: ['pandas', 'data-cleaning', 'etl', 'dataframe', 'data-quality', 'python'],
    whyItWorks: `Composing the pipeline with pipe() over small, pure, named functions means each step can be reviewed, unit-tested, and reordered independently — a single 40-line block of chained df[...] assignments cannot be tested at all except end-to-end, which hides exactly which step introduced a bug when the final output looks wrong three transformations later. Requiring a logged count for every row dropped or value changed targets the single most common and most dangerous pandas cleaning mistake: a filter or dropna() that silently removes far more data than intended, discovered weeks later when a downstream report looks wrong with no trail back to the cause, at which point nobody remembers which of the six cleaning steps did it. The schema validation at the end catches a specific, very real pandas failure mode — a date column that parsed as object instead of datetime64 because one row had a malformed value that to_datetime silently coerced to NaT without raising, which then breaks every downstream .dt accessor call with a confusing error far from the actual cause. The memory_constraint field exists because the correct pandas approach genuinely changes shape once the dataset stops comfortably fitting in RAM — vectorized operations on a full in-memory DataFrame are usually the right default, but a pipeline that will run against triple the current row count on a memory-capped CI worker needs chunked reads (chunksize in read_csv) or a columnar engine considered from the start, not bolted on after the first out-of-memory crash in production. Requiring each step's docstring to name the specific known_issues entry it addresses, and requiring ordering dependencies to be stated rather than left implicit, matters for the same underlying reason pipe() composition matters in the first place: the whole design's value is that a future engineer can reorder, remove, or add a step with confidence, and that confidence depends entirely on dependencies between steps being written down rather than living only in the current order of a pipe() chain that looks, on the surface, like a list of independent, freely reorderable transformations.`,
    exampleOutput: `def parse_order_dates(df: pd.DataFrame) -> pd.DataFrame:
    df = df.copy()
    before_na = df["order_date"].isna().sum()
    df["order_date"] = pd.to_datetime(df["order_date"], errors="coerce")
    dropped = df["order_date"].isna().sum() - before_na
    if dropped:
        logger.warning(f"parse_order_dates: {dropped} rows had unparseable order_date, now NaT")
    return df

cleaned = (
    raw_df
    .pipe(drop_duplicate_orders)
    .pipe(parse_order_dates)
    .pipe(clean_amount_column)
    .pipe(validate_against_schema)
)

Memory: satisfied for the current ~180MB file on a 4GB worker; flagged that clean_amount_column's regex-based string cleanup would need to move to a chunked read_csv(chunksize=...) loop once the file exceeds roughly 1GB.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-07-23' }],
    changelog: [
      {
        date: '2026-07-23',
        note: 'Initial publish, verified against ChatGPT (GPT-5.1) on pandas 2.2.',
      },
    ],
  },
  {
    slug: 'python-script-to-cli-tool',
    category: 'python',
    title: 'Turn a one-off Python script into a proper CLI tool',
    description:
      'A prompt that converts a script with hardcoded values or manual sys.argv indexing into a Typer or Click CLI with real help text, validation, safe defaults for destructive actions, and an installable entry point.',
    promptText: `Convert the script described below into a real command-line tool — not a script with sys.argv indexing, and not one that still has hardcoded values a user has to edit before running it.

CURRENT SCRIPT
{{script_description}}

FRAMEWORK
Use {{cli_framework}}. If it's Typer, define arguments as type-hinted function parameters — that's Typer's actual mechanism — rather than manually building a parser. If it's Click, use the @click.command() and @click.option/@click.argument decorators. If it's argparse, use argparse.ArgumentParser with explicit type=, required=, and help= on every argument.

COMMANDS NEEDED
{{commands_needed}}

DESTRUCTIVE BEHAVIOR
{{destructive_behavior}}

REQUIREMENTS
1. Every option has a help string a stranger could act on without reading the source — "path to clean" not "the folder."
2. Every option with a sensible default gets one; every option that doesn't must be required and say so, rather than silently defaulting to None and failing three lines later with an unrelated AttributeError.
3. Validate inputs at the CLI boundary (file exists, path is a directory not a file, number is in range) and exit with a clear message and a non-zero exit code — never a raw traceback as the user-facing output.
4. Use meaningful exit codes: 0 for success, and distinct non-zero codes for distinct failure classes if there's more than one, documented in a comment.
5. If {{destructive_behavior}} describes anything that deletes, overwrites, or sends data, add a --dry-run flag that reports exactly what would happen, and default the destructive path to off unless --yes or --force is explicitly passed — never make the default invocation the destructive one.
6. Support --help correctly on both the top-level command and every subcommand named in {{commands_needed}} — a user should be able to discover every option without reading source code or guessing at flag names from a README that may be out of date.
7. If the tool reads or writes any path, resolve it relative to the current working directory the way a shell user expects, and say explicitly whether relative paths are resolved against the invocation directory or some other base — a script silently resolving paths against its own install location instead of where the user actually ran it from is a common and confusing surprise.
8. Print user-facing output to stdout and errors to stderr, not both mixed on stdout — this is what lets the tool be piped and scripted correctly by anything downstream that expects to separate normal output from failures.

OUTPUT FORMAT
1. The CLI entry point code.
2. The exact pyproject.toml [project.scripts] entry needed to install it as a real command.
3. Three example invocations: one happy path, one that fails validation, one using --dry-run if applicable.
4. Confirmation that --help produces useful output for the top-level command and every subcommand, and where stdout versus stderr is used.`,
    variables: [
      {
        name: 'script_description',
        description:
          'What the current script does and how it currently takes its inputs.',
        example:
          'A script that reads a folder path and a threshold hardcoded at the top, then deletes log files older than the threshold.',
        required: true,
      },
      {
        name: 'cli_framework',
        description: 'Which CLI library to build with.',
        example: 'Typer',
        required: true,
      },
      {
        name: 'commands_needed',
        description:
          'The subcommands the tool needs, or "single command" if there\'s only one action.',
        example:
          'single command: clean, with options for folder, days-old threshold, and file extension filter',
        required: true,
      },
      {
        name: 'destructive_behavior',
        description:
          'What, if anything, the tool deletes, overwrites, or sends somewhere irreversible.',
        example:
          'Permanently deletes matched log files from disk; no recycle bin or backup.',
        required: true,
      },
    ],
    targetTools: [
      'Claude Code',
      'ChatGPT (GPT-5.1)',
      'GitHub Copilot Chat',
      'Cursor 2.1',
    ],
    tags: ['cli', 'typer', 'click', 'argparse', 'developer-tooling', 'python'],
    whyItWorks: `Naming the exact mechanism for the chosen framework — Typer's type-hinted parameters versus Click's decorator-based options versus argparse's explicit ArgumentParser calls — stops the model from defaulting to whichever pattern shows up most in its training data regardless of which library was actually requested, a common mismatch when a bare prompt just says "use Typer" with no further detail and gets back a hand-rolled parser instead. Requiring a --dry-run flag and an explicit opt-in for destructive behavior is a real safety practice lifted from how production CLI tools are actually built, and it's the detail a plain "turn this into a CLI" request reliably skips — the destructive_behavior field forces that risk to be named up front rather than discovered the first time someone runs the new tool with the same instinctive confidence they had in the old hardcoded script and it does something the old script never could at that scale. Requiring the pyproject.toml [project.scripts] entry, not just the code, is what makes the result an installable command a user runs by name from any directory, rather than something still invoked as python script.py with a longer argument list — a CLI tool that only works when you remember its absolute path has not actually replaced the script it was meant to replace. The requirement that every optional-looking argument either has a real default or is explicitly required also prevents a specific, common failure: a value that's technically accepted as None by the function signature but crashes several lines into execution with an unrelated-looking error, which is a strictly worse experience than the CLI simply refusing to start with a clear message about the missing argument. Separating stdout from stderr, and being explicit about which working directory relative paths resolve against, matter for the same reason the pyproject.toml entry point does: a script that only ever gets run interactively by the person who wrote it can get away with mixing output streams and assuming a fixed working directory, but a tool that's actually installed and reused stops being scriptable — pipeable into another command, callable from a cron job with a different working directory, checked for success by an exit code alone — the moment either of those assumptions turns out to be wrong.`,
    exampleOutput: `import typer
from pathlib import Path
from datetime import datetime, timedelta

app = typer.Typer()

@app.command()
def clean(
    folder: Path = typer.Argument(..., exists=True, file_okay=False, help="Folder to clean."),
    days_old: int = typer.Option(30, help="Delete files older than this many days."),
    extension: str = typer.Option(".log", help="Only delete files with this extension."),
    dry_run: bool = typer.Option(False, "--dry-run", help="Show what would be deleted without deleting."),
    yes: bool = typer.Option(False, "--yes", help="Actually delete files (required unless --dry-run)."),
) -> None:
    cutoff = datetime.now() - timedelta(days=days_old)
    targets = [f for f in folder.glob(f"*{extension}") if datetime.fromtimestamp(f.stat().st_mtime) < cutoff]
    if dry_run or not yes:
        typer.echo(f"Would delete {len(targets)} files. Pass --yes to actually delete.")
        raise typer.Exit(code=0)
    for f in targets:
        f.unlink()
    typer.echo(f"Deleted {len(targets)} files.")

[project.scripts]
logclean = "logclean.cli:app"`,
    verifiedAgainst: [
      { tool: 'Claude Code', version: 'Sonnet 4.6', date: '2026-07-23' },
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-07-24' },
    ],
    changelog: [
      {
        date: '2026-07-24',
        note: 'Initial publish, verified against Claude Code (Sonnet 4.6) and ChatGPT (GPT-5.1) on Typer 0.13.',
      },
    ],
  },
  {
    slug: 'python-sync-to-async-refactor',
    category: 'python',
    title: 'Refactor blocking Python code to async without breaking it silently',
    description:
      'A prompt for converting synchronous I/O-bound code to async/await that separates what genuinely benefits from async, wraps unavoidable blocking calls correctly, and checks every caller — instead of prefixing every function with async def and calling it done.',
    promptText: `Refactor the code below from synchronous to async — but only where it actually matters. Do not prefix every function with async def reflexively; that adds overhead without benefit for CPU-bound code and creates a false sense of concurrency that doesn't actually exist.

CODE
{{target_code}}

I/O OPERATIONS INVOLVED
{{io_operations}}

GOAL
{{concurrency_goal}}

DEPLOYMENT CONTEXT
{{deployment_context}}

REQUIREMENTS
1. For each I/O operation, identify whether an async-native library exists (httpx's AsyncClient instead of requests, an async database driver instead of a sync one, aiofiles for file I/O) and use it. If no async equivalent exists for something in {{io_operations}}, say so explicitly and wrap it with asyncio.to_thread rather than calling it directly inside an async def and silently blocking the event loop.
2. Any genuinely CPU-bound work (parsing, computation) stays synchronous, or is offloaded to asyncio.to_thread or a ProcessPoolExecutor if it's heavy enough to matter — making it async def alone does nothing for CPU-bound code, and pretending otherwise is the most common mistake in this kind of refactor.
3. Use asyncio.gather, or a TaskGroup on Python 3.11+, to run independent I/O calls concurrently where {{concurrency_goal}} calls for it — don't await a list of calls sequentially in a loop and call that async.
4. Propagate cancellation and timeouts correctly: wrap calls that should have a deadline in asyncio.timeout(...), and don't swallow asyncio.CancelledError with a bare except Exception, since that breaks cooperative cancellation for whatever is awaiting this code.
5. Confirm {{deployment_context}} actually supports the change — code running inside an existing event loop (a web framework request handler) needs different treatment than a standalone script that will call asyncio.run() itself, and mixing the two incorrectly is a common source of "RuntimeError: this event loop is already running."
6. Every function whose signature changes from sync to async must have every one of its callers updated too — list them, don't leave a caller doing result = my_func() on a coroutine it never awaits.
7. If any resource used inside the refactored code (a database connection, an HTTP client session) is currently created once and reused across calls, preserve that lifecycle in the async version too — don't silently open a new httpx.AsyncClient per call inside a hot loop just because the sync version's requests.Session was easy to drop, since that trades one performance problem for a worse one.

OUTPUT FORMAT
1. The refactored code.
2. A table: function name, sync or async now, and the reason.
3. Every caller found that also needed updating, and confirmation each one now awaits correctly.
4. One line confirming any shared resource's lifecycle (created once vs. per call) matches what the original synchronous code did, or naming why it deliberately changed.`,
    variables: [
      {
        name: 'target_code',
        description:
          'The synchronous code to refactor, including the functions that call it if known.',
        example:
          'def fetch_all_prices(product_ids: list[str]) -> list[Price]: loops and calls requests.get() per id',
        required: true,
      },
      {
        name: 'io_operations',
        description:
          'The specific I/O calls involved, so the model checks each for an async-native equivalent.',
        example: 'HTTP GET requests to a pricing API, a write to a local CSV file',
        required: true,
      },
      {
        name: 'concurrency_goal',
        description: 'What the async refactor is actually meant to achieve.',
        example:
          'fetch prices for up to 50 products concurrently instead of one request at a time',
        required: true,
      },
      {
        name: 'deployment_context',
        description:
          'Where this code actually runs — a standalone script, or already inside a running event loop.',
        example:
          'Runs inside a FastAPI request handler, which already has its own running event loop.',
        required: true,
      },
    ],
    targetTools: [
      'Claude Code',
      'ChatGPT (GPT-5.1)',
      'Claude (Sonnet 4.6)',
      'Cursor 2.1',
    ],
    tags: ['async', 'asyncio', 'concurrency', 'refactoring', 'event-loop', 'python'],
    whyItWorks: `The explicit instruction against reflexively adding async def everywhere addresses a real, common misconception: async does nothing for CPU-bound work and adds event-loop scheduling overhead for no benefit, so a refactor that async-ifies indiscriminately can make code slower and harder to reason about while looking more modern on the surface. Naming asyncio.to_thread for any I/O operation with no async-native library available solves the single most common asyncio production bug directly — a blocking call left inside an async def function, which stalls the entire event loop for every concurrent request being served by that worker, not just the one making the slow call, and a load test with a single client will never reveal this because there's nothing else in the loop for it to block. The deployment_context field exists because the correct top-level pattern genuinely differs by where the code runs: a standalone script owns its own event loop via asyncio.run(), while code inside a FastAPI or similar handler is already running inside someone else's loop, and calling asyncio.run() again inside that context raises "RuntimeError: this event loop is already running" — a refactor that ignores this distinction produces code that works in isolated testing and breaks the moment it's actually deployed. Requiring the caller list is what catches the failure mode that's easy to miss and doesn't raise an exception when it happens: calling a newly-async function without awaiting it produces a coroutine object and a RuntimeWarning, not a crash, so the code silently does nothing useful at that call site unless someone specifically checks for the warning or notices the missing side effect downstream. Preserving a shared resource's create-once lifecycle matters for a related reason specific to async HTTP clients: httpx.AsyncClient holds a connection pool, and creating a fresh one inside a hot loop means every single call pays the cost of a new TCP handshake and TLS negotiation instead of reusing a warm connection, which can make an "async" refactor measurably slower under real concurrent load than the synchronous version it replaced, despite looking like a strict improvement in the code.`,
    exampleOutput: `async def fetch_all_prices(product_ids: list[str]) -> list[Price]:
    async with httpx.AsyncClient() as client:
        results = await asyncio.gather(*(fetch_price(client, pid) for pid in product_ids))
    return results

Table: fetch_price -> async (network I/O, httpx.AsyncClient); fetch_all_prices -> async (fans out via gather); parse_price_response -> stays sync (pure CPU-bound parsing, no I/O).
Deployment: runs inside FastAPI's already-running loop, so this is awaited directly from the route handler — no asyncio.run() call added anywhere in this code.
Callers updated: report_generator.build_report() now does "prices = await fetch_all_prices(ids)" instead of a direct call — confirmed build_report() is itself async and runs inside the same request context.`,
    verifiedAgainst: [
      { tool: 'Claude Code', version: 'Sonnet 4.6', date: '2026-07-24' },
      { tool: 'Claude', version: 'Sonnet 4.6', date: '2026-07-25' },
    ],
    changelog: [
      {
        date: '2026-07-25',
        note: 'Initial publish, verified against Claude Code and Claude (Sonnet 4.6) on Python 3.12.',
      },
    ],
  },
  {
    slug: 'python-pydantic-v2-model-design-from-domain',
    category: 'python',
    title: 'Design Pydantic v2 models that validate a real domain, not just shapes',
    description:
      'A prompt for designing Pydantic v2 models with field constraints, cross-field validators, and deliberate optional/required decisions from a description of real-world business rules, instead of models that just describe field names and types.',
    promptText: `Design Pydantic v2 models for the domain below. The goal is models that reject bad data at the boundary, not models that just describe field names and types and hope validation happens somewhere else.

DOMAIN
{{domain_description}}

BUSINESS RULES TO ENFORCE
{{business_rules}}

CROSS-MODEL RULE
{{cross_model_rule}}

REQUIREMENTS
1. Use Pydantic v2 syntax specifically: model_config = ConfigDict(...), not the v1-style class Config. Use Field(...) constraints (gt, max_length, pattern, etc.) for anything checkable declaratively, before reaching for a custom validator.
2. Use @field_validator for single-field logic that Field() can't express, and @model_validator(mode="after") for anything depending on more than one field within the same model (e.g. end_date must be after start_date). Name which business rule each validator enforces, in a comment.
3. If {{cross_model_rule}} depends on data outside this one model — a lookup against another record, like guest_count against a property's max_occupancy stored elsewhere — say explicitly that this cannot be a Pydantic validator alone and belongs at the service layer, rather than silently faking it or silently dropping it.
4. Be deliberate about Optional versus required — a field should only be optional if the domain genuinely allows it to be absent, not because it's convenient during construction. Justify each optional field in one line.
5. Use Annotated[...] types for any constraint you'd otherwise repeat across multiple models, instead of copy-pasting the same Field(...) arguments everywhere.
6. Serialization: {{serialization_needs}}. If any field needs a different name on the wire than in Python, use alias or an AliasGenerator and set populate_by_name correctly, rather than manually renaming keys after the fact.
7. Give every model a docstring stating what real-world entity it represents and what invalid state it's specifically guarding against.
8. Every raised ValueError inside a validator must produce a message that names the actual rule violated and, where useful, the offending value — a validator that just raises ValueError("invalid") forces the caller to re-derive which of several possible rules actually failed, defeating the point of having named, separate business rules in the first place.
9. If a field represents money, a quantity with units, or anything else where a plain float or int silently permits a nonsensical value (a negative price, a fractional item count where only whole units make sense), constrain it precisely with Field(...) rather than a bare numeric type that happens to also accept the invalid range.

OUTPUT FORMAT
1. The models, in dependency order.
2. A table: business rule, and which model, validator, or "service layer, not Pydantic" enforces it.
3. One example payload that should raise ValidationError, and what the error tells the caller.
4. Confirmation that every validator's error message names the specific rule it enforces, not a generic "invalid" string.`,
    variables: [
      {
        name: 'domain_description',
        description: 'The real-world entity or entities the models represent.',
        example: 'A booking for a rental property, plus the guest making it',
        required: true,
      },
      {
        name: 'business_rules',
        description: 'The actual constraints the data must satisfy, beyond types.',
        example:
          'check-out date must be after check-in date; a booking under 2 nights requires a minimum-stay override flag',
        required: true,
      },
      {
        name: 'cross_model_rule',
        description:
          'A rule that depends on data outside this one model, to test whether the model stays honest about its limits.',
        example:
          "number of guests can't exceed the property's max_occupancy, which lives on a separate Property record",
        required: true,
      },
      {
        name: 'serialization_needs',
        description:
          'How the data needs to look on the wire versus in Python, if different.',
        example:
          'API is camelCase JSON (checkInDate), Python code should stay snake_case',
        required: false,
      },
    ],
    targetTools: [
      'Claude Code',
      'ChatGPT (GPT-5.1)',
      'GitHub Copilot Chat',
      'Cursor 2.1',
    ],
    tags: ['pydantic', 'data-validation', 'domain-modeling', 'fastapi', 'python'],
    whyItWorks: `Requiring Pydantic v2 syntax by name matters because a large share of tutorials and training data still show v1 patterns (class Config, the bare @validator decorator), and an underspecified prompt will produce a plausible-looking mix of both APIs that fails at import time on a v2-only install, or worse, silently ignores a v1-style validator that v2 no longer calls the way v1 did. Requiring a one-line justification for every Optional field directly counters the reflexive habit of marking everything Optional to avoid construction friction during development, which quietly defeats the entire point of using Pydantic for validation — a field that's "optional" only because it was annoying to require lets genuinely missing data flow silently downstream into code that assumes it's there. The cross_model_rule field is the one that most separates a model design that actually understands Pydantic's boundaries from one that fakes it: a single model's validator, field or model level, can only see that model's own fields, so a rule like guest count against a property's max_occupancy stored on a different record literally cannot be expressed inside BookingCreate's own validators — a prompt that doesn't force this distinction reliably gets back a model that either silently omits the check or hallucinates a way to "validate" it that doesn't actually run against real data. Separating @field_validator from @model_validator(mode="after") by exact use case, rather than leaving the choice to the model, mirrors this same real API constraint one level down: a single-field validator cannot see other fields on the same model either, so a cross-field rule like end date after start date has to live in the model-level validator or it genuinely cannot be expressed at all, regardless of how the prompt is worded. Requiring every raised ValueError to name the specific rule it enforces closes a gap that's easy to miss when writing validators quickly: Pydantic surfaces every validator's raised message directly in the resulting ValidationError, so a vague message doesn't just look sloppy in the source, it actually degrades what the API caller receives back, turning a structured, actionable 422 response into one that tells a client "something about this payload is wrong" without saying what.`,
    exampleOutput: `class BookingCreate(BaseModel):
    """A guest's request to book a property for a date range."""
    model_config = ConfigDict(populate_by_name=True)

    check_in: date = Field(alias="checkInDate")
    check_out: date = Field(alias="checkOutDate")
    guest_count: int = Field(gt=0)
    override_min_stay: bool = False  # optional: only relevant when a stay is under the minimum

    @model_validator(mode="after")
    def check_out_after_check_in(self) -> "BookingCreate":
        # enforces: check-out must be after check-in
        if self.check_out <= self.check_in:
            raise ValueError("check_out must be after check_in")
        return self

Rule table: "check-out after check-in" -> check_out_after_check_in model_validator; "guest_count <= property.max_occupancy" -> service layer, not Pydantic, since it requires a database lookup against a separate Property record that this model has no access to.
Invalid payload: {"checkInDate": "2026-09-10", "checkOutDate": "2026-09-09", "guestCount": 2} raises ValidationError: "check_out must be after check_in" — tells the caller exactly which rule failed, not just that the payload is invalid.`,
    verifiedAgainst: [
      { tool: 'Claude Code', version: 'Sonnet 4.6', date: '2026-07-25' },
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-07-26' },
    ],
    changelog: [
      {
        date: '2026-07-26',
        note: 'Initial publish, verified against Claude Code (Sonnet 4.6) and ChatGPT (GPT-5.1) on Pydantic 2.9.',
      },
    ],
  },
  {
    slug: 'python-dependency-conflict-diagnosis',
    category: 'python',
    title: 'Diagnose a Python dependency or virtual environment conflict systematically',
    description:
      'A structured diagnostic prompt for dependency and venv breakage that requires a stated root-cause hypothesis and cited evidence before proposing a fix, instead of jumping straight to pip install --upgrade.',
    promptText: `Diagnose this Python environment or dependency problem. Do not propose a fix until you've stated a specific hypothesis for the root cause — "try reinstalling" is not a diagnosis, it's a guess dressed up as one.

ERROR
{{error_output}}

ENVIRONMENT
{{environment_info}}

PACKAGE MANAGER IN USE
{{package_manager}}

RECENT CHANGE
{{recent_change}}

DIAGNOSTIC PROCESS
1. Identify the failure category first: a version conflict between two packages' requirements, a missing system-level dependency (compiler, system library), a wrong or stale virtual environment being activated, a Python version mismatch (a package with no wheel for this Python version), or a corrupted/partial install. Cross-reference {{recent_change}} against the error — most environment breakage traces to something that changed recently, and that's the first place to look, not a random guess. State which category this looks like and why, citing the specific line in the error output.
2. Ask for exactly the information you're missing to confirm the hypothesis, if anything — pip list output, the package manager's version, which python, or the lockfile diff — rather than guessing further past the point where evidence would resolve it.
3. Once confirmed, give the fix as ordered, copy-pasteable commands, not a paragraph description. Note which command is destructive (e.g. deleting a virtual environment) before it runs, and give the non-destructive alternative first if one exists.
4. Give one prevention step specific to this failure category — pinning a version range, adding a lockfile, using a resolver like uv or pip-tools for reproducible installs — not a generic "keep dependencies updated."
5. If the fix involves recreating a virtual environment, state exactly what gets lost in the process (any package installed manually outside the lockfile, any editable install pointing at a local path) so nothing has to be silently rediscovered and reinstalled by trial and error afterward.

CONSTRAINTS
- Don't suggest pip install --upgrade or --force-reinstall as a first move; that can mask the real problem and break other packages pinned lower in the dependency tree.
- If the fix could change behavior elsewhere in the project (a major version bump), say so and ask before assuming it's fine to proceed automatically.
- If two proposed fixes would both resolve the immediate error but with different long-term consequences (pinning an older version versus upgrading and fixing the code that broke), present both and say which you'd pick and why, rather than silently choosing one.

OUTPUT FORMAT
Root cause hypothesis, then confirming evidence needed if any, then exact fix commands, then one line on preventing this category next time, then anything lost if the fix recreates the environment.`,
    variables: [
      {
        name: 'error_output',
        description: 'The exact error message and traceback, unedited.',
        example:
          'ImportError: cannot import name "BaseSettings" from "pydantic" — happens after upgrading a different package.',
        required: true,
      },
      {
        name: 'environment_info',
        description: 'OS, Python version, and how the environment was created.',
        example: 'Windows 11, Python 3.12, venv created with python -m venv .venv',
        required: true,
      },
      {
        name: 'package_manager',
        description: 'Which tool manages dependencies in this project.',
        example: 'uv',
        required: true,
      },
      {
        name: 'recent_change',
        description:
          'What changed right before the error started, if known — the single most useful diagnostic clue.',
        example:
          'Ran "uv add fastapi" yesterday to add a new dependency; everything worked before that.',
        required: false,
      },
    ],
    targetTools: [
      'ChatGPT (GPT-5.1)',
      'Claude (Sonnet 4.6)',
      'Claude Code',
      'Perplexity',
    ],
    tags: ['dependency-management', 'virtualenv', 'pip', 'uv', 'debugging', 'python'],
    whyItWorks: `Forcing a stated hypothesis, with a cited line from the error output, before any fix is proposed directly prevents the most common LLM failure mode on dependency errors: pattern-matching the error text to a generic "reinstall your packages" answer that either doesn't address the real conflict or actively masks it by upgrading something that was correctly pinned for a reason nobody documented. The recent_change field is the single highest-leverage piece of information in this whole prompt, because in practice the overwhelming majority of "it just started breaking" dependency errors trace directly to the last thing that changed — a new package added that silently bumped a shared transitive dependency, an unrelated system update that replaced a system compiler — and naming that change turns the model's search space from "every possible cause" into "check this specific hypothesis first," which is exactly how an experienced engineer actually debugs the same problem. Naming the real failure categories — a missing wheel for the installed Python version, a stale virtual environment still pointing at an old interpreter, a native compiler dependency the OS doesn't have — gives the model concrete diagnostic branches to reason through instead of one catch-all response that sounds confident regardless of which category actually applies. The explicit ban on leading with --force-reinstall reflects real practitioner knowledge: in a project with pinned versions, a force-reinstall of one package can silently pull in incompatible versions of its own dependencies, turning one broken import into three, which is a worse state than the one the fix was supposed to resolve. Requiring both viable fixes to be surfaced when they carry different long-term consequences matters because the fastest fix for the immediate error — pinning back to a version that worked — and the fix that actually keeps the project current — upgrading and adjusting the code that broke — are not the same recommendation, and silently picking one without saying so denies whoever's running this diagnosis the chance to weigh urgency against technical debt themselves, which is a decision that depends on context the diagnostic prompt alone can't fully see.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-07-26' }],
    changelog: [
      {
        date: '2026-07-26',
        note: 'Initial publish, verified against ChatGPT (GPT-5.1) on a uv-managed Python 3.12 project.',
      },
    ],
  },
  {
    slug: 'python-performance-profiling-plan',
    category: 'python',
    title: 'Find out why Python code is actually slow before optimizing it',
    description:
      'A profiling-first prompt that requires naming the real bottleneck category with a specific tool and command before suggesting any optimization, instead of guessing at generic speedups that may not touch the actual problem.',
    promptText: `This code is slow. Before you suggest any optimization, help me find out why — an optimization based on a guess is as likely to make no difference as to help, and can waste more engineering time than the slowness itself.

CODE
{{slow_code}}

SYMPTOM
{{performance_symptom}}

INPUT SCALE
{{input_scale}}

CONSTRAINTS ON THE FIX
{{constraints}}

PROCESS
1. Classify the likely bottleneck category: CPU-bound (the computation itself is slow), I/O-bound (waiting on network, disk, or a database), memory-bound (excessive allocation, GC pressure, or swapping), or algorithmic (the wrong Big-O for the input size). State which you suspect and the specific line or pattern that makes you suspect it, and check that hypothesis against {{input_scale}} — a fix that only helps at 10x the current scale is a different priority than one needed right now.
2. Name the exact profiling step to confirm it before changing anything: cProfile or snakeviz for CPU hotspots, py-spy for profiling a running process without modifying code, memory_profiler or tracemalloc for memory, line_profiler for line-by-line cost inside one function. Give the actual command to run, not just the tool's name.
3. Once the bottleneck is confirmed, propose the fix ranked by likely impact per effort — an algorithmic fix that changes O(n squared) to O(n) ranks above micro-optimizing a loop's variable access, and should be presented first even if it's more work to implement.
4. For any fix that trades memory for speed, or changes behavior under concurrency, say so explicitly, and check it against {{constraints}}.
5. Record a concrete before number from {{performance_symptom}} as the baseline — not a vague "it's slow," an actual wall-clock time or throughput figure — so the fix has something specific to beat rather than a moving target.
6. Note where the profiling tool itself might distort the result: cProfile's per-call instrumentation overhead can make a function relatively look slower than it actually is in production if it's called an extreme number of times, so say explicitly if that risk applies here and whether py-spy's sampling approach (near-zero overhead) would give a more trustworthy picture instead.
7. State how to verify the fix actually helped: re-run the same profiling step and compare numbers against the baseline from step 5, not "this should be faster" — a fix that isn't measured against a real before number isn't confirmed, it's assumed.

OUTPUT FORMAT
Bottleneck hypothesis, then the profiling command to confirm it, then the baseline number, then a ranked fix list, then the verification step with the after number compared against the baseline.`,
    variables: [
      {
        name: 'slow_code',
        description: "The code that's slow, as much of the real call path as you have.",
        example:
          'A function that dedupes a 500k-row list by checking membership against a growing Python list.',
        required: true,
      },
      {
        name: 'performance_symptom',
        description:
          'What "slow" actually looks like — how slow, and under what conditions.',
        example: 'Takes 40+ seconds on 500k rows; was fine at 10k rows a few months ago.',
        required: true,
      },
      {
        name: 'input_scale',
        description:
          'The current and expected future size of the input, so a fix targets the right scale.',
        example:
          'Currently 500k rows, expected to reach 2-3M rows within the next two quarters.',
        required: false,
      },
      {
        name: 'constraints',
        description: "Anything the fix can't break or introduce.",
        example:
          'Must stay single-threaded (runs inside a Celery worker with its own concurrency model already).',
        required: false,
      },
    ],
    targetTools: [
      'Claude Code',
      'ChatGPT (GPT-5.1)',
      'Claude (Sonnet 4.6)',
      'Cursor 2.1',
    ],
    tags: ['performance', 'profiling', 'cprofile', 'optimization', 'big-o', 'python'],
    whyItWorks: `Forcing a bottleneck classification before any fix counters the default behavior of proposing generic micro-optimizations — swapping a for loop for a list comprehension, say — that often don't touch the actual bottleneck at all and can leave the real problem completely unaddressed while looking like productive work was done. Naming specific real tools with their actual invocation (cProfile's command-line module flag, py-spy for a running process with zero code changes, line_profiler for per-line cost) turns "profile your code" from an aspiration into an executable next step that produces real numbers instead of another guess. The input_scale field matters because the right fix genuinely depends on where the code sits on its growth curve: an O(n squared) algorithm that's merely annoying at 500k rows becomes an operational emergency at 3M rows, so naming the expected future scale changes whether a fix is nice-to-have or urgent, and changes which of two competing fixes actually deserves the engineering time first. Ranking fixes by algorithmic impact before micro-optimization reflects the real order-of-magnitude difference at scale: an O(n squared) membership check against a growing list, fixed by switching to a set, changes a 40-second run into a sub-second one, which no amount of loop micro-tuning would ever reach — and naming that ranking explicitly stops the model from leading with the least impactful fix just because it's the easiest one to describe in a paragraph. Requiring a concrete baseline number before proposing anything, and comparing the after number against that same baseline rather than a fresh vague impression, is what turns "this should be faster" into an actual falsifiable claim — profiling tools produce numbers precisely so a fix can be judged against reality instead of against how convincing the explanation sounds. Flagging cProfile's own instrumentation overhead matters because it's a specific, well-documented distortion: cProfile adds real per-call cost to every function it tracks, which can make a function called millions of times inside a hot loop appear disproportionately expensive relative to its true production cost, so a profiling-first workflow that doesn't account for this can end up confidently optimizing the wrong function — exactly the failure mode this whole prompt exists to prevent, just relocated one step later into the profiling tool itself instead of the original guess.`,
    exampleOutput: `Bottleneck hypothesis: algorithmic — "if item not in seen_list" inside the loop is an O(n) scan against a growing Python list, making the whole dedupe O(n squared).
Confirm with: python -m cProfile -s cumulative dedupe_script.py — expect the membership-check line to dominate cumulative time at this input size.
Fix, ranked: 1) swap seen_list for a set() — O(1) average membership check, changes the loop to O(n) overall, and matters more urgently given the 2-3M row target within two quarters. 2) (lower impact) avoid re-hashing unhashable row objects by deduping on a derived key instead.
Verify: re-run the same cProfile command on the 500k-row input and confirm total runtime drops from ~40s to sub-second, not just "looks faster."`,
    verifiedAgainst: [{ tool: 'Claude Code', version: 'Sonnet 4.6', date: '2026-07-27' }],
    changelog: [
      {
        date: '2026-07-27',
        note: 'Initial publish, verified against Claude Code (Sonnet 4.6) on Python 3.12 with cProfile and py-spy.',
      },
    ],
  },
  {
    slug: 'python-package-pyproject-distribution',
    category: 'python',
    title: 'Package a Python project for real distribution with pyproject.toml',
    description:
      'A prompt for producing a complete, modern src-layout package with a real pyproject.toml, dev/test dependency groups, and a verified build step, instead of a bare setup.py or an incomplete pyproject stub.',
    promptText: `Package the project below for real distribution — not a script that only runs from inside its own folder because of an accident of sys.path, not a setup.py from a five-year-old tutorial.

PROJECT
{{project_description}}

RUNTIME DEPENDENCIES
{{dependencies}}

DISTRIBUTION TARGET
{{distribution_target}}

VERSIONING SCHEME
{{versioning_scheme}}

REQUIREMENTS
1. Use a src/ layout (src/<package_name>/..., inferring the actual package name from the project description) so the package can't accidentally be imported from the repo root during development, hiding a packaging bug that only shows up after a real install elsewhere.
2. A complete pyproject.toml: [build-system] naming a specific backend (hatchling or setuptools>=68 — say which and why), [project] with name, version (matching {{versioning_scheme}}), requires-python, dependencies pinned with sensible lower bounds, and [project.optional-dependencies] for dev/test tooling (pytest, ruff, mypy) kept separate from runtime deps.
3. If this needs a CLI entry point, define it under [project.scripts].
4. A .gitignore covering build artifacts (dist/, *.egg-info, __pycache__/) and a minimal README.md with install and usage instructions matching {{distribution_target}}.
5. If {{distribution_target}} is public PyPI, flag what else is needed before publishing — a unique name check, a license file, a long_description sourced from the README, a decision on whether {{versioning_scheme}} needs a pre-release tag for the first publish — rather than assuming it's ready to go.
6. Decide explicitly whether package data beyond .py files (a bundled JSON schema, a template file, static assets) needs to ship inside the wheel — if {{project_description}} mentions any non-code file the package reads at runtime, configure include-package-data or the backend's equivalent, since a file that exists in the source tree but isn't declared as package data silently vanishes from the built wheel and only fails the first time a real install tries to read it.
7. Confirm requires-python is set to a version floor the code can actually run on, not a value copied from habit — if any syntax or standard-library feature used in the project needs a specific minimum version (structural pattern matching needs 3.10, for instance), the floor must match or be raised, so pip refuses an incompatible install up front instead of failing at import time on an older interpreter.
8. State the exact commands to build and locally verify the package installs cleanly: build it, install the built wheel into a fresh throwaway virtual environment, and import it, before it's ever pushed anywhere.

OUTPUT FORMAT
1. The file tree, including any non-code files that need to ship as package data.
2. The full pyproject.toml.
3. The build-and-verify commands, in order.
4. One sentence confirming requires-python actually matches the language features the code uses.`,
    variables: [
      {
        name: 'project_description',
        description: 'What the project is and its intended package name.',
        example:
          'A small library called "orderkit" for parsing and validating e-commerce order exports.',
        required: true,
      },
      {
        name: 'dependencies',
        description: 'The runtime dependencies the package needs.',
        example: 'pydantic>=2.9, pandas>=2.2',
        required: true,
      },
      {
        name: 'distribution_target',
        description: 'Where this package needs to be installable from.',
        example: 'internal use via a private index, not public PyPI',
        required: true,
      },
      {
        name: 'versioning_scheme',
        description: 'How version numbers should be assigned and bumped.',
        example:
          'Semantic versioning starting at 0.1.0, bumped manually per release, no pre-1.0 API stability guarantee.',
        required: false,
      },
    ],
    targetTools: [
      'Claude Code',
      'ChatGPT (GPT-5.1)',
      'GitHub Copilot Chat',
      'Cursor 2.1',
    ],
    tags: ['packaging', 'pyproject-toml', 'uv', 'distribution', 'src-layout', 'python'],
    whyItWorks: `Requiring the src/ layout by name matters because it prevents the single most common packaging bug: a package that imports fine during development purely because the current working directory happens to be on sys.path, then fails on a genuinely clean install because a missing __init__.py or a broken relative import was never actually exercised until now — the bug hides precisely as long as nobody tries to use the package the way an external consumer would. Requiring the build backend to be named and justified, rather than left to the model's default, matters because pyproject.toml's [build-system] table is exactly the part that varies most across tutorials of different vintages — an unconstrained prompt is as likely to produce a stale setup.py-based flow as a modern one, and the two are not interchangeable once a CI pipeline depends on one specific build command succeeding. The versioning_scheme field earns its place because getting this wrong has a real consequence for consumers: a package that bumps its version number inconsistently, or publishes a breaking change under a patch version, breaks every downstream project that pinned a version range trusting semver, and that trust is expensive to rebuild once broken — naming the scheme up front is what keeps the [project] version field meaningful rather than an arbitrary string. Requiring the fresh-venv install-and-import step as an explicit output, not just the config file, is what catches "works on my machine" packaging bugs — a dependency that was actually already installed globally, or a file that exists locally but was never added to the package manifest — before they reach a real install anywhere else, which is exactly the class of bug a packaging task exists to prevent. The package-data requirement targets a related but distinct trap: a file sitting right next to the Python source in the repository is not automatically included in a built wheel unless the build backend is explicitly told to include it, so a template or schema file the code reads at import time can work perfectly in every local test — because the source tree is right there on disk — and then raise FileNotFoundError the moment the package is actually installed from its built artifact somewhere else, which is precisely the "works everywhere except the one place that matters" bug a packaging pass exists to catch before a user does.`,
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-07-27' },
      { tool: 'Claude Code', version: 'Sonnet 4.6', date: '2026-07-28' },
    ],
    changelog: [
      {
        date: '2026-07-28',
        note: 'Initial publish, verified against ChatGPT (GPT-5.1) and Claude Code (Sonnet 4.6) using uv 0.5 for the build/verify step.',
      },
    ],
  },
  {
    slug: 'python-data-validation-pipeline-ingestion',
    category: 'python',
    title:
      'Build a data validation pipeline that quarantines bad records instead of crashing on them',
    description:
      'A prompt for a validation layer on an ingestion pipeline that separates "reject the whole batch" from "quarantine the bad row and keep going," backed by one named schema instead of scattered ad hoc checks.',
    promptText: `Build a validation layer for the data pipeline below. The goal is a pipeline that tells you exactly which records are bad and why — not one that either crashes on the first bad row or silently accepts everything and lets the mess flow downstream.

DATA SOURCE
{{data_source_description}}

VALIDATION RULES
{{validation_rules}}

FAILURE POLICY
{{failure_policy}}

DOWNSTREAM CONSUMER
{{downstream_consumer}}

REQUIREMENTS
1. Define the expected schema explicitly — a Pydantic model if records are processed one at a time, or a pandera DataFrameSchema if this is a bulk DataFrame pipeline. Don't validate ad hoc with scattered if checks; one schema is the single source of truth for what "valid" means.
2. Validate every record or row against the schema and classify each as valid, or invalid with the specific rule or rules it broke — not just "invalid." A record failing three rules should report all three, not just the first one that failed.
3. Apply {{failure_policy}} precisely: if it says quarantine bad records and continue, invalid rows go to a separate output (a rejects table or file with the original data plus the reason) and valid rows proceed — the pipeline does not fail the whole batch for a few bad rows. If it says fail the batch above a threshold, implement that threshold explicitly rather than an arbitrary cutoff you invented.
4. Check what {{downstream_consumer}} actually requires before deciding what "valid" means for a borderline field — a rule that's merely advisory for one consumer might be a hard requirement for another, and the schema should reflect the stricter real requirement, not a guess.
5. Log a run summary: total records, valid count, invalid count broken down by which rule failed most often — this is what tells a human whether a new failure pattern just appeared upstream.
6. Never let a validation failure raise an unhandled exception that kills the whole pipeline run unless {{failure_policy}} explicitly says that should happen for that condition.
7. Make the rejects output itself replayable: once whatever upstream problem caused a spike in rejections is fixed, it should be possible to re-run validation against just the quarantined records without re-processing the entire original batch, so fixing one upstream issue doesn't mean re-running the whole pipeline from scratch to recover the records it affected.

OUTPUT FORMAT
1. The schema definition.
2. The validation and routing function (valid versus quarantined).
3. The run summary logger.
4. One worked example: a batch with a mix of valid and invalid records, showing what gets quarantined and why.
5. One sentence on how the rejects output can be re-validated later without reprocessing the whole original batch.`,
    variables: [
      {
        name: 'data_source_description',
        description:
          'Where the data comes from and its rough shape — one record at a time, or bulk.',
        example:
          'A nightly batch CSV upload of ~50k customer records, processed as one DataFrame.',
        required: true,
      },
      {
        name: 'validation_rules',
        description: 'The specific rules a record must satisfy to count as valid.',
        example:
          "email must be a valid format; signup_date can't be in the future; country must be a valid ISO code",
        required: true,
      },
      {
        name: 'failure_policy',
        description: 'What should happen when records fail validation.',
        example:
          'quarantine invalid rows and continue processing the rest, but abort the whole batch if over 10% of rows fail',
        required: true,
      },
      {
        name: 'downstream_consumer',
        description:
          'What reads the validated output, so borderline rules are set to the strictest real requirement.',
        example:
          'A billing system that will hard-fail on any record with a missing country code, even though the CRM upstream treats it as optional.',
        required: false,
      },
    ],
    targetTools: [
      'ChatGPT (GPT-5.1)',
      'Claude (Sonnet 4.6)',
      'Claude Code',
      'GitHub Copilot Chat',
    ],
    tags: ['data-validation', 'pandera', 'pydantic', 'data-pipeline', 'etl', 'python'],
    whyItWorks: `Making "quarantine and continue" versus "fail the batch above a threshold" an explicit, named decision operationalizes a choice that's usually left implicit in a bare "add validation" request, and defaults to whichever is easiest to write — which in practice means crashing on the first bad row rather than any deliberate policy. Requiring one schema, named specifically to the record-shape (Pydantic for one-at-a-time, pandera for a DataFrame), as the single source of truth prevents validation logic from drifting across scattered ad hoc if-checks added at different times by different people, each with a slightly different idea of what "valid" means, which is how two parts of the same pipeline end up disagreeing about whether an empty string counts as missing. The downstream_consumer field matters because "valid" is not actually a property of the data alone — it's a property of the data relative to what reads it next, and a schema built without checking that constrains on the wrong side: too strict rejects records a lenient consumer would have handled fine, too lenient passes through records that will hard-fail a strict downstream system anyway, just later and with a worse error message. Requiring every broken rule per record, not just the first, matters operationally: someone fixing an upstream data issue needs the full list of what a record violated, not whichever check happened to run first and short-circuit the rest, which can hide a second, unrelated problem behind the first one found. The rule-by-rule summary logging is what actually surfaces a new upstream failure pattern — a spike in one specific rule failing is a signal worth acting on, where a bare "142 rows rejected" count is not actionable at all. Requiring the rejects output to be replayable on its own matters operationally for the same reason quarantining exists in the first place: if the only way to recover 1,090 wrongly-rejected records after fixing an upstream data problem is to re-run validation against the full 50,000-record batch again, quarantining has only deferred the cost of a bad batch, not actually reduced it, where a rejects file that can be re-validated in isolation turns "fix and recover the affected records" into a small, targeted operation instead of a full batch replay.`,
    exampleOutput: `class CustomerRecord(BaseModel):
    email: EmailStr
    signup_date: date
    country: str = Field(pattern=r"^[A-Z]{2}$")  # billing requires this even though the CRM treats it as optional

    @field_validator("signup_date")
    @classmethod
    def not_in_future(cls, v: date) -> date:
        if v > date.today():
            raise ValueError("signup_date is in the future")
        return v

Run summary: 50,000 records — 48,910 valid, 1,090 invalid (612 invalid country code, 401 malformed email, 77 future signup_date). Batch proceeds: 1,090/50,000 = 2.2%, below the 10% abort threshold.
Quarantined example: {"email": "not-an-email", "country": "USA"} -> rejected for both "malformed email" and "country must be 2-letter ISO code," written to rejects.csv with both reasons attached.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-07-28' }],
    changelog: [
      {
        date: '2026-07-28',
        note: 'Initial publish, verified against ChatGPT (GPT-5.1) using pandera 0.20 and Pydantic 2.9.',
      },
    ],
  },
  {
    slug: 'python-idiomaticity-review',
    category: 'python',
    title: 'Get Python code reviewed for idiomaticity, not just correctness',
    description:
      'A review prompt that separates "is this correct" from "is this how an experienced Python developer would write it," with a closed set of idiom categories so the review surfaces real foot-guns instead of restating the code.',
    promptText: `Review this code for idiomaticity — assume it already works. Your job is to say where it doesn't read like Python an experienced developer would write, and why the idiomatic version is actually better, not just different or shorter.

CODE
{{target_code}}

TARGET PYTHON VERSION
{{python_version}} — flag anything that's idiomatic for an older version but has a cleaner equivalent available now (e.g. pre-3.10 code that could use structural pattern matching, or manual dict-default handling that could use dict.setdefault, defaultdict, or the walrus operator where it genuinely improves clarity rather than just being clever).

STYLE GUIDE
{{style_guide}}

TEAM CONTEXT
{{team_context}}

REVIEW CATEGORIES
1. Pythonic idioms — list, dict, or set comprehensions where a manual loop is just building a collection; enumerate or zip instead of manual indexing; context managers for anything with cleanup; pathlib.Path instead of os.path string joining.
2. Truthiness and comparisons — "if not x" versus "if x is None" used correctly, since they are not interchangeable for empty collections versus None; "is" and "is not" for None and singleton checks; never "== None".
3. Mutability bugs — mutable default arguments, accidental aliasing, modifying a list while iterating over it.
4. Error handling style — specific exception types over a bare except with no type, using exceptions for genuinely exceptional cases rather than control flow, not catching and re-raising without adding information.
5. Naming and structure — does a function do one thing; is a "utils" grab-bag hiding what should be several named functions.
6. Iteration and laziness — a generator or itertools-based approach where the code builds a full intermediate list just to iterate over it once and discard it; unnecessary calls to list() or sorted() on something that only needed to be iterated once.

OUTPUT FORMAT
For each finding: category, the line or snippet, what's non-idiomatic about it, the idiomatic rewrite, and one sentence on why it's actually better, not just shorter. If a "clever" one-liner would be less readable than the original, say so explicitly and leave it — idiomatic doesn't mean maximally compact. Weigh every finding against {{team_context}} — a rewrite that's more idiomatic in isolation but harder for this specific team to maintain is a finding worth flagging as optional, not mandatory.
End with a verdict: how many findings per category, and whether the code is idiomatic enough to ship as-is or needs the listed changes first, stated plainly enough that a reviewer skimming only the verdict still knows what to do next.`,
    variables: [
      {
        name: 'target_code',
        description: 'The Python code to review, pasted in full.',
        example:
          'def get_config(name, cache={}):\\n    if cache.get(name) == None:\\n        cache[name] = load_from_disk(name)\\n    return cache[name]',
        required: true,
      },
      {
        name: 'python_version',
        description:
          'The Python version the code needs to run on, to scope which idioms are actually available.',
        example: '3.12',
        required: true,
      },
      {
        name: 'style_guide',
        description:
          'Any project-specific style rules beyond general Python idiom, if there are any.',
        example:
          "follows Black formatting and Ruff's default rule set; no third-party lint config beyond that",
        required: false,
      },
      {
        name: 'team_context',
        description:
          'How experienced the team is with Python, so a rewrite is weighed against real maintainability.',
        example:
          'A team of mostly backend Java developers new to Python; prefer explicit code over dense one-liners.',
        required: false,
      },
    ],
    targetTools: [
      'Claude Code',
      'ChatGPT (GPT-5.1)',
      'GitHub Copilot Chat',
      'Cursor 2.1',
    ],
    tags: [
      'code-review',
      'idiomatic-python',
      'pep-8',
      'best-practices',
      'mutability',
      'python',
    ],
    whyItWorks: `Separating "is this correct" from "is this idiomatic" as an explicit framing keeps the review from defaulting to the most common failure mode of an open-ended "review this" prompt — restating the code's logic back to the requester instead of judging its style. The closed category list forces coverage of specific, well-documented Python foot-guns that a generic review reliably misses, most notably the mutable default argument bug, where a function like def get_config(name, cache={}) shares one cache dict across every call that doesn't pass one explicitly, because default argument values are evaluated exactly once at function-definition time, not per call — a bug that produces correct-looking output for a long time before manifesting as data leaking between unrelated calls. The team_context field matters because "idiomatic" is not a fixed target independent of who maintains the code — a dense, clever one-liner using nested comprehensions might be the objectively idiomatic Python, but for a team of Java developers six months into their first Python codebase, a slightly more verbose and explicit version is the actual right call for that team's velocity, and a review that doesn't weigh this produces technically-correct feedback that would make the codebase harder for its actual maintainers to work in. Requiring "why it's actually better, not just shorter" as a mandatory field directly counters a real failure mode of AI-suggested Python rewrites: compressing readable code into a dense one-liner that a human reviewer would reasonably reject in a real pull request for being harder to follow, not more idiomatic. The explicit permission to leave a comparison unchanged when a compact rewrite would hurt readability stops the review from treating brevity as a proxy for good style. The iteration and laziness category exists because it's a specific, common gap in how models default to writing "correct" Python: building a full list via list comprehension purely to feed it into a for loop once is functionally identical to using a generator expression for anything that doesn't need random access or a second pass, but it forces the whole collection to exist in memory at once for no reason, and a review that never checks for this misses a real, teachable difference between code that merely works and code that reflects an understanding of what Python's iteration protocol is actually for.`,
    exampleOutput: `Finding 1 [Mutability bugs]: cache={} as a default argument — this dict is created once at function definition and shared across every call that doesn't explicitly pass a cache, so entries silently accumulate across unrelated calls. Rewrite: use cache: dict | None = None, then cache = cache if cache is not None else {} inside the function. Mandatory given team_context — this is a correctness bug, not a style preference, regardless of team experience level.
Finding 2 [Truthiness and comparisons]: cache.get(name) == None — should be cache.get(name) is None. Mandatory but low-severity; flagged as an easy bundle-in alongside Finding 1.
Verdict: 2 findings (1 mutability, 1 comparison), both mandatory. Needs the mutable-default fix before shipping.`,
    verifiedAgainst: [
      { tool: 'Claude Code', version: 'Sonnet 4.6', date: '2026-07-29' },
      { tool: 'GitHub Copilot Chat', version: '1.261 (VS Code)', date: '2026-07-30' },
    ],
    changelog: [
      {
        date: '2026-07-30',
        note: 'Initial publish, verified against Claude Code (Sonnet 4.6) and GitHub Copilot Chat.',
      },
    ],
  },
  {
    slug: 'python-circular-import-diagnosis',
    category: 'python',
    title: 'Diagnose and fix a circular import without just moving the problem around',
    description:
      'A prompt for tracing exactly which two modules import each other and why, then choosing a real structural fix (restructuring, a local import, a shared interface module) instead of papering over it with a same-file workaround that resurfaces later.',
    promptText: `Diagnose this circular import and fix it properly — not by moving an import statement inside a function as a permanent fix, unless that's genuinely the right call and you can say why.

ERROR
{{error_output}}

MODULES INVOLVED
{{module_structure}}

WHAT EACH MODULE ACTUALLY NEEDS FROM THE OTHER
{{cross_module_usage}}

PROJECT SIZE
{{project_size}}

DIAGNOSTIC PROCESS
1. Trace the exact import chain that closes the loop — module A imports module B at the top level, module B (directly, or transitively through another module) imports something from module A at the top level too. Name the specific line in each file that closes the cycle; "these two modules are circular" without the exact lines is not a diagnosis.
2. Classify why the cycle exists: two modules that genuinely need each other's types (a real design problem), one module importing another only for a type hint (fixable with TYPE_CHECKING and a string annotation, zero runtime cost), or a module importing far more than it actually uses just because it was convenient (fixable by importing only the specific name needed, or not at all).
3. Propose the real fix based on the classification: if it's a genuine mutual dependency, propose either merging the shared pieces into a third module both can depend on downward, or restructuring so the dependency only points one direction — and say which one fits {{cross_module_usage}} better and why. If it's a type-hint-only import, use if TYPE_CHECKING: plus a string-quoted annotation, which resolves the cycle with zero runtime behavior change. Only propose a local import inside a function as the fix if you can name why a structural fix isn't reasonable given {{project_size}} right now — a local import is a valid tool sometimes, but reaching for it first hides a real design issue behind a workaround nobody will remember to revisit.
4. Confirm the fix actually breaks the cycle by tracing the new import graph the same way you traced the old one, not just asserting that it should work.
5. Check whether the same two modules have any other import path between them beyond the one that triggered this specific error — fixing the one line that raised the exception while leaving a second, less obvious circular path intact means the bug resurfaces the next time code execution happens to touch modules in a different order.

OUTPUT FORMAT
The exact chain that caused the cycle, the classification, the fix with before/after import statements, confirmation the new import graph has no cycle, and a note on whether any other import path between the same two modules was checked and found clear.`,
    variables: [
      {
        name: 'error_output',
        description: 'The exact ImportError or AttributeError and traceback.',
        example:
          "ImportError: cannot import name 'User' from partially initialized module 'app.models.user' (most likely due to a circular import)",
        required: true,
      },
      {
        name: 'module_structure',
        description:
          'The relevant modules and their current top-level import statements.',
        example:
          'app/models/user.py imports from app/services/auth.py at the top; app/services/auth.py imports User from app/models/user.py at the top.',
        required: true,
      },
      {
        name: 'cross_module_usage',
        description:
          'What each module actually needs from the other — a real value at runtime, or just a type hint.',
        example:
          'auth.py only uses User as a type hint on function parameters; user.py never actually calls anything from auth.py at runtime, it was imported for an unused helper.',
        required: true,
      },
      {
        name: 'project_size',
        description:
          'How large and how actively developed the codebase is, so the fix matches the real cost of restructuring.',
        example:
          'A 40k-line Django monolith with 12 active contributors; restructuring module boundaries needs a real PR, not a quick patch.',
        required: false,
      },
    ],
    targetTools: ['Claude Code', 'ChatGPT (GPT-5.1)', 'GitHub Copilot Chat'],
    tags: ['circular-import', 'debugging', 'module-structure', 'type-checking', 'python'],
    whyItWorks: `Requiring the exact line in each file that closes the cycle, rather than a general description of two modules being circular, matters because Python's real import mechanism is order-dependent and partial: a module is registered in sys.modules the moment its execution starts, not when it finishes, so a cycle only actually breaks at the specific point where one module tries to access a name in the other before that other module has finished running its own top-level code — two files can have a mutual conceptual dependency and never actually crash, or have what looks like a minor dependency and crash immediately, purely based on which specific names are accessed at which specific line, in which order. Classifying the cycle before fixing it separates three genuinely different problems that share the same error message: a real two-way design dependency needs restructuring, an import that's only there for a type hint needs zero runtime change at all (if TYPE_CHECKING guards the import so it never executes, and a string-quoted annotation defers the name resolution), and an over-broad import needs nothing more than narrowing what's actually imported — treating all three the same way, usually by reaching for a local import inside a function, fixes the crash but often hides which of the three was actually true, and a local-import fix on a genuine design problem just relocates the coupling instead of removing it. The project_size field earns its place because the theoretically cleanest fix — extracting shared types into a third module and repointing both original modules downward — is real refactoring work with real review cost, and for a codebase with a dozen active contributors that's a deliberate PR, not something to sneak in as a side effect of fixing an import error; naming the actual size and activity level is what lets the model recommend the local-import workaround honestly, as a stopgap with a named reason, rather than either overreaching into an unrequested refactor or hiding a workaround as if it were the real fix.`,
    verifiedAgainst: [{ tool: 'Claude Code', version: 'Sonnet 4.6', date: '2026-07-30' }],
    changelog: [
      {
        date: '2026-07-30',
        note: 'Initial publish, verified against Claude Code (Sonnet 4.6) on Python 3.12.',
      },
    ],
  },
  {
    slug: 'python-retry-backoff-decorator',
    category: 'python',
    title:
      'Write a retry-with-backoff decorator that preserves the wrapped function correctly',
    description:
      'A prompt for a generic retry decorator (sync and async variants) that preserves signatures and docstrings with functools.wraps, distinguishes retryable from fatal exceptions, and caps total wait time — instead of a naive while-loop that retries everything forever.',
    promptText: `Write a retry-with-backoff decorator for the function(s) described below. This needs to be a decorator other functions can reuse, not a one-off retry loop copy-pasted into a single call site.

FUNCTION(S) TO WRAP
{{target_function}}

RETRYABLE VERSUS FATAL
{{retryable_exceptions}}

BACKOFF REQUIREMENTS
{{backoff_requirements}}

SYNC OR ASYNC
{{sync_or_async}}

REQUIREMENTS
1. Use functools.wraps on the inner wrapper function, so the decorated function keeps its original __name__, __doc__, and signature — a decorator that doesn't do this breaks introspection, breaks Sphinx-generated docs, and makes stack traces confusing about which function actually failed.
2. Only retry the exceptions named in {{retryable_exceptions}}; anything else propagates immediately on the first attempt. Naming an exception "fatal" and then silently retrying it anyway is worse than not having retry logic at all, because it delays a failure that should have surfaced immediately.
3. Implement exponential backoff with jitter (not fixed-interval retries) matching {{backoff_requirements}}, and enforce a hard cap on either the number of attempts or the total elapsed wait time — an unbounded retry loop against a dependency that's actually down just multiplies load on a struggling system instead of giving up cleanly.
4. Log each retry attempt at a level that won't spam production logs on transient blips but will surface a pattern of repeated failures — include the attempt number, the exception, and the wait time before the next attempt.
5. If {{sync_or_async}} calls for both, write two decorators (or one that detects and dispatches correctly) — do not write a sync decorator and just slap async def on the inner call, since that produces a coroutine that's never awaited and silently does nothing.
6. On final failure after exhausting retries, raise the original exception (or wrap it in a custom RetriesExhausted exception that keeps the original as __cause__) — never swallow the failure and return None, which hides the failure from the caller entirely.
7. Make the decorator's parameters (max attempts, base delay, retryable exceptions) real arguments to the decorator factory, not constants baked into the wrapper's body — a decorator that can only be configured by editing its own source isn't actually reusable across the different call sites that will each have different tolerances for how long a retry sequence should run.
8. If the wrapped function accepts arguments that could be exhausted or invalidated by a retry (a request body that's actually a generator, consumed on the first attempt and empty on the second), name that risk explicitly rather than assuming every argument is safe to reuse across attempts.

OUTPUT FORMAT
1. The decorator, fully typed with functools.wraps applied, with its tunable parameters as factory arguments.
2. One example of it applied to a real function from {{target_function}}.
3. A short note on what happens on the exception it should NOT retry, showing it propagates immediately.
4. Confirmation that every argument passed to the wrapped function is safe to reuse unchanged across every retry attempt, or a named exception to that.`,
    variables: [
      {
        name: 'target_function',
        description: 'The function or class of functions this decorator will wrap.',
        example:
          'fetch_exchange_rate(currency: str) -> float, which calls an external HTTP API.',
        required: true,
      },
      {
        name: 'retryable_exceptions',
        description: 'Which exceptions should trigger a retry versus fail immediately.',
        example:
          'Retry on httpx.TimeoutException and httpx.ConnectError; never retry on a 4xx client error (httpx.HTTPStatusError with status < 500).',
        required: true,
      },
      {
        name: 'backoff_requirements',
        description: 'The backoff shape and its bounds.',
        example:
          'Exponential backoff starting at 0.5s, doubling each attempt, max 5 attempts, capped total wait of 30s.',
        required: true,
      },
      {
        name: 'sync_or_async',
        description:
          'Whether the wrapped functions are synchronous, asynchronous, or both need support.',
        example: 'Async only — the wrapped function is always a coroutine function.',
        required: true,
      },
    ],
    targetTools: ['Claude Code', 'ChatGPT (GPT-5.1)', 'Cursor 2.1'],
    tags: ['decorators', 'retry', 'backoff', 'resilience', 'functools', 'python'],
    whyItWorks: `Requiring functools.wraps addresses a specific, well-known Python foot-gun: a decorator written as a plain closure without it silently replaces the wrapped function's __name__, __doc__, and __wrapped__ attributes with the inner wrapper's own, so every decorated function in a codebase suddenly reports itself as "wrapper" in stack traces and to introspection tools like Sphinx or FastAPI's own route naming — a subtle bug that doesn't crash anything but makes debugging every function that uses this decorator measurably harder for as long as it exists. Separating retryable from fatal exceptions by name, rather than retrying anything that raises, targets the actual reason blanket retry logic is dangerous: retrying a 4xx client error (a malformed request, bad auth) delays a failure the caller needs to see immediately and burns through the retry budget on an error that will never succeed no matter how many times it's attempted, while a genuinely transient timeout is exactly what retry logic should absorb. Requiring exponential backoff with jitter and a hard cap, rather than fixed-interval retries with no ceiling, reflects real distributed-systems practice: fixed-interval retries from many callers synchronize into request bursts that hit a struggling dependency at the same moment, worsening exactly the load problem that's likely causing the failures in the first place, while jitter spreads retries out and a hard cap stops the decorator from participating in an outage indefinitely. The sync-versus-async dispatch requirement exists because the single most common bug in a hastily-written retry decorator is applying a synchronous wrapper to an async function — the call appears to succeed with no error, but it actually returns an un-awaited coroutine object, so the retry logic never executes and the failure is worse than having no decorator at all, since it looks like protection that isn't actually there. Making the tunable parameters real decorator-factory arguments rather than hardcoded constants is what actually makes the decorator reusable across call sites with genuinely different tolerances — a payment call and a cache warm-up have very different acceptable retry budgets, and a decorator that can't express that difference without editing its own source isn't a shared utility, it's one call site's retry loop wearing a decorator's clothes.`,
    exampleOutput: `def retry_with_backoff(*, retry_on: tuple[type[Exception], ...], max_attempts: int = 5, base_delay: float = 0.5, max_total_wait: float = 30.0):
    def decorator(func):
        @functools.wraps(func)
        async def wrapper(*args, **kwargs):
            total_wait = 0.0
            for attempt in range(1, max_attempts + 1):
                try:
                    return await func(*args, **kwargs)
                except retry_on as exc:
                    if attempt == max_attempts:
                        raise
                    delay = min(base_delay * (2 ** (attempt - 1)) + random.uniform(0, 0.1), max_total_wait - total_wait)
                    total_wait += delay
                    logger.warning(f"{func.__name__} attempt {attempt} failed ({exc}); retrying in {delay:.2f}s")
                    await asyncio.sleep(delay)
        return wrapper
    return decorator

@retry_with_backoff(retry_on=(httpx.TimeoutException, httpx.ConnectError), max_attempts=5)
async def fetch_exchange_rate(currency: str) -> float: ...

On a 401 (httpx.HTTPStatusError, status 401): not in retry_on, so it propagates on the first attempt — no retries logged, no wasted retry budget on an error retrying can never fix.`,
    verifiedAgainst: [{ tool: 'Claude Code', version: 'Sonnet 4.6', date: '2026-07-31' }],
    changelog: [
      {
        date: '2026-07-31',
        note: 'Initial publish, verified against Claude Code (Sonnet 4.6) on Python 3.12 with httpx 0.28.',
      },
    ],
  },
  {
    slug: 'python-dataclass-conversion-from-class',
    category: 'python',
    title:
      'Convert a hand-rolled class to a dataclass without changing its equality semantics by accident',
    description:
      'A prompt for converting a manually-written __init__/__eq__/__repr__ class into a dataclass (or attrs class) with the right frozen, eq, and hashability settings for how instances are actually used, instead of a default dataclass conversion that silently breaks set or dict membership.',
    promptText: `Convert the class below to a dataclass (or attrs, if you name why attrs fits better here). This must preserve exactly how instances are currently compared, hashed, and mutated — a dataclass conversion that changes equality or hashability semantics without saying so is a correctness bug, not a style improvement.

CLASS
{{target_class}}

HOW INSTANCES ARE USED
{{usage_pattern}}

MUTABILITY
{{mutability_requirement}}

REQUIREMENTS
1. Before converting anything, state what the current class's __eq__, __hash__, and __repr__ actually do today — if it doesn't define __eq__, say explicitly that it currently uses identity comparison (is), because @dataclass generates a field-by-field __eq__ by default, which is a real behavior change if the code anywhere currently relies on identity.
2. Set frozen= based on {{mutability_requirement}}, not by default. If instances must be usable as dict keys or set members, they need to be hashable, which requires either frozen=True (dataclass then auto-generates a compatible __hash__) or an explicit eq=False with a hand-written __hash__ — pick correctly and say why, don't leave a mutable dataclass with eq=True, which is unhashable by default and will raise TypeError the first time someone tries to put an instance in a set.
3. Use field(default_factory=...) for any mutable default (a list, dict, or set attribute) — never a bare mutable default value, which dataclass itself explicitly forbids at class-definition time and will raise ValueError if attempted, unlike a plain class where the same mistake fails silently.
4. If the original class has any custom method beyond __init__/__eq__/__repr__/__hash__ (a computed property, a validation method, a classmethod constructor), keep it as-is on the dataclass — a dataclass is still a normal class, and business logic doesn't disappear just because field boilerplate did.
5. If {{usage_pattern}} shows instances being mutated after construction in a way that's incompatible with the mutability decision in step 2, flag the conflict explicitly rather than silently picking one side.
6. If {{subclassing_context}} shows this class is subclassed elsewhere, check field ordering carefully: a dataclass field with a default value cannot be followed by a subclass field without one, so converting a base class to a dataclass can break an existing subclass's field ordering in a way that only surfaces as a TypeError at class-definition time in a completely different file.
7. Consider whether slots=True is worth adding given how many instances {{usage_pattern}} implies will exist at once — it removes each instance's __dict__ in favor of fixed storage, which matters for memory at scale but breaks dynamic attribute assignment, so state explicitly whether that trade-off fits here rather than defaulting to it or skipping it without comment.

OUTPUT FORMAT
1. What the original class's equality/hash/repr behavior actually was.
2. The converted dataclass.
3. One sentence confirming whether instances remain usable exactly where {{usage_pattern}} needs them (as dict keys, in a set, appended to a list and mutated later, etc.), or naming the specific conflict if one exists.
4. One sentence on whether {{subclassing_context}} introduces any field-ordering risk, and whether slots=True was worth adding.`,
    variables: [
      {
        name: 'target_class',
        description:
          'The hand-written class to convert, including its current __init__, and __eq__/__repr__ if defined.',
        example:
          'class Point:\\n    def __init__(self, x, y):\\n        self.x = x\\n        self.y = y\\n    # no __eq__ defined',
        required: true,
      },
      {
        name: 'usage_pattern',
        description:
          'How instances of this class are actually used elsewhere in the codebase.',
        example:
          'Instances are stored in a set() to dedupe visited coordinates during a pathfinding search, and never mutated after creation.',
        required: true,
      },
      {
        name: 'mutability_requirement',
        description:
          'Whether instances need to be mutated after construction, which determines frozen vs not.',
        example:
          'Immutable — a Point is created once and never reassigned; a "moved" point is a new Point instance.',
        required: true,
      },
      {
        name: 'subclassing_context',
        description:
          'Whether this class is subclassed elsewhere, so field-ordering and slots implications get checked.',
        example:
          'Subclassed once, by GridPoint(Point), which adds a "layer" field with no default of its own.',
        required: false,
      },
    ],
    targetTools: ['Claude Code', 'ChatGPT (GPT-5.1)', 'Cursor 2.1'],
    tags: ['dataclasses', 'refactoring', 'equality', 'hashability', 'attrs', 'python'],
    whyItWorks: `Requiring the model to state the original class's current equality behavior before converting anything catches the single most consequential silent behavior change in this whole class of refactor: a hand-written class with no __eq__ defined uses identity comparison by default, but @dataclass generates a field-by-field __eq__ automatically unless told not to, so a naive conversion changes what "equal" means for every existing comparison, every set membership check, and every dict lookup keyed on instances of this class, without a single line of new code visibly signaling that anything changed. The frozen= decision tied explicitly to {{mutability_requirement}} rather than left as a default matters because Python's actual rule here is unforgiving and easy to get backwards: a dataclass with the default eq=True and frozen=False (the plain @dataclass with no arguments) is unhashable, full stop, and the first time code tries to put an instance in a set or use it as a dict key it raises TypeError: unhashable type at that call site, far from wherever the dataclass itself was defined, making the actual root cause hard to trace back. The field(default_factory=...) requirement for mutable defaults isn't just a best practice suggestion here — dataclass enforces it at the language level, raising ValueError the instant a bare mutable default like a list literal is used as a field default, which is strictly better than a plain class's equivalent mistake (a mutable default argument on __init__) that fails completely silently and only manifests as a confusing bug much later when state leaks between instances that were never supposed to share anything. The subclassing_context field catches a dataclass-specific rule that has no equivalent failure mode in a hand-written class: dataclass generates its __init__ by walking fields in declaration order across the whole inheritance chain, and a field with a default value cannot be followed by one without a default anywhere in that chain, so converting a previously plain base class to a dataclass can silently turn a perfectly fine existing subclass into a TypeError at import time, in a file that wasn't touched by this refactor at all and that nobody would think to check.`,
    exampleOutput: `# Original: no __eq__ defined -> uses identity (is) comparison by default.

@dataclass(frozen=True)
class Point:
    x: float
    y: float
    # frozen=True chosen because usage_pattern stores instances in a set() and never mutates them;
    # frozen=True gives a compatible auto-generated __hash__ for free.

Confirmation: instances remain hashable and usable in a set() exactly as usage_pattern requires. Note the equality semantics changed from identity to field-based value equality — flagged because any code relying on "is" comparison elsewhere would now behave differently and should be checked.`,
    verifiedAgainst: [
      { tool: 'Claude Code', version: 'Sonnet 4.6', date: '2026-07-31' },
      { tool: 'Cursor', version: '2.1', date: '2026-08-01' },
    ],
    changelog: [
      {
        date: '2026-08-01',
        note: 'Initial publish, verified against Claude Code (Sonnet 4.6) and Cursor 2.1 on Python 3.12.',
      },
    ],
  },
  {
    slug: 'python-structured-logging-migration',
    category: 'python',
    title: 'Replace print() debugging with structured logging that survives production',
    description:
      'A prompt for migrating print-based debugging to the logging module with correct levels, structured context fields, and no logger-configuration surprises at import time — instead of a find-and-replace of print with logging.info that keeps every other bad habit.',
    promptText: `Migrate the print() calls in this code to proper structured logging. This is not a find-and-replace of print with logging.info — every call needs the right level, and the logger needs to be configured the way a real service actually configures logging.

CODE
{{target_code}}

RUNTIME CONTEXT
{{runtime_context}}

CONTEXTUAL FIELDS NEEDED
{{contextual_fields}}

LOG AGGREGATION TARGET
{{log_aggregation_target}}

REQUIREMENTS
1. Get the logger with logger = logging.getLogger(__name__) at module level, never the root logger directly and never a logger configured inside a function that runs on every call — logging configuration (handlers, formatters, levels) belongs in one place at application startup, not scattered across modules.
2. Choose the right level per call based on what it actually reports: DEBUG for detail only useful while actively debugging, INFO for normal operational events worth keeping, WARNING for something recoverable but worth a human's attention, ERROR for a failure that needs investigation, CRITICAL only for something that threatens the whole process. A print() that was really tracking "did we get here" during development is DEBUG, not INFO — don't upgrade its importance just because it's becoming a real log call.
3. Attach {{contextual_fields}} as structured fields (via logging's extra= parameter, or a structured logging library if {{log_aggregation_target}} expects JSON lines), not interpolated into the message string — a field baked into the string can't be filtered or aggregated on later, where a structured field can.
4. Use logger.exception(...) inside an except block when logging a caught error, so the traceback is captured automatically — don't manually format str(exc) and lose the stack trace that would have told someone where it actually happened.
5. Never log a secret, credential, or full request/response body containing personal data — if {{target_code}} currently prints something like that, flag it explicitly and log a redacted or truncated version instead, don't just move the same leak into the log aggregation pipeline.
6. Use %s-style lazy formatting (logger.info("processed %s items", count)) rather than an f-string in the log call, so string formatting doesn't run at all when the message would be filtered out by the configured level.
7. Where a print() was actually the only visible signal of progress on a long-running job, don't just downgrade it to a DEBUG log and let it disappear from default output — decide explicitly whether {{runtime_context}} needs an INFO-level heartbeat instead (a periodic "processed N of M" line) so the operational visibility the print() gave for free isn't quietly lost in the migration.

OUTPUT FORMAT
1. The migrated code.
2. A table: each original print() call, the level it became, and why that level.
3. Anything flagged under the secrets/PII rule, and what changed.
4. One sentence on whether any operational visibility the original print() calls provided was preserved at an appropriate level, or explicitly and deliberately dropped.`,
    variables: [
      {
        name: 'target_code',
        description: 'The code with print() calls to migrate, in full.',
        example:
          'A batch job that prints progress every 1000 rows, prints the full row dict on error, and prints a final summary.',
        required: true,
      },
      {
        name: 'runtime_context',
        description:
          'Where this code actually runs, so the logging setup matches reality.',
        example:
          'A Celery worker running inside a Docker container; stdout/stderr are captured by the container runtime and shipped to a log aggregator.',
        required: true,
      },
      {
        name: 'contextual_fields',
        description:
          'The structured fields that should be attached to relevant log lines for later filtering.',
        example:
          "job_id, batch_size, and the row's primary key when logging a per-row failure.",
        required: true,
      },
      {
        name: 'log_aggregation_target',
        description:
          'What ultimately consumes these logs, since it determines whether plain text or structured JSON is expected.',
        example:
          'Logs are shipped to a system expecting JSON lines with a "message" and "level" key at minimum.',
        required: false,
      },
    ],
    targetTools: ['Claude Code', 'ChatGPT (GPT-5.1)', 'GitHub Copilot Chat'],
    tags: ['logging', 'observability', 'debugging', 'structured-logging', 'python'],
    whyItWorks: `Requiring logging.getLogger(__name__) at module level rather than the root logger addresses how Python's logging module actually propagates: loggers are organized in a dotted hierarchy matching module paths, so getting one per module by name is what lets a real deployment set different levels for different subsystems later (turning DEBUG on for one noisy module without drowning every other module's logs in the same verbosity), where logging directly against the root logger collapses that hierarchy and makes per-module filtering impossible after the fact. Forcing a deliberate level choice per call, rather than a blanket print-to-info replacement, matters because a print statement's implicit importance was always "someone was looking at the terminal when this ran" — that tells you nothing about whether the same information deserves to be kept in production logs at INFO, permanently, forever, at whatever volume this code runs; most print-debugging call sites are actually DEBUG-level noise that should be filterable out by default, and treating all of them as INFO just relocates print-spam into the log aggregator instead of fixing it. The lazy %s-formatting requirement is a real, measurable performance detail specific to how the logging module works: logger.debug(f"...") evaluates the f-string and does the formatting work every single time that line executes, even when the configured level means the message will be immediately discarded, while logger.debug("...%s", value) only performs the formatting if the message will actually be emitted — at high call volume in a hot loop, this is the difference between debug logging being nearly free when disabled and debug logging silently costing real CPU time in production regardless of whether anyone will ever read the output. The secrets/PII flag exists because migrating a print() statement to a logger call changes its blast radius: a print() output disappears with the terminal session, but a structured log line typically gets durably shipped, indexed, and retained by {{log_aggregation_target}} for weeks or months, so a value that was a minor risk sitting in a developer's terminal becomes a durable, searchable, possibly-compliance-relevant record the moment it's migrated into the logging pipeline unexamined.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-01' }],
    changelog: [
      {
        date: '2026-08-01',
        note: 'Initial publish, verified against ChatGPT (GPT-5.1) on Python 3.12 stdlib logging.',
      },
    ],
  },
  {
    slug: 'python-sqlalchemy-orm-model-design',
    category: 'python',
    title: 'Design SQLAlchemy 2.0 ORM models that avoid N+1 queries by construction',
    description:
      'A prompt for declarative SQLAlchemy 2.0 models using Mapped/mapped_column typing, with relationship loading strategies chosen deliberately per access pattern, instead of default lazy loading that quietly produces an N+1 query storm the first time a list view renders.',
    promptText: `Design SQLAlchemy 2.0 ORM models for the domain below, using the modern declarative Mapped[...] typed style. The relationships need a deliberately chosen loading strategy per real access pattern — not the library default, which will produce an N+1 query problem the moment this is used in a list view.

DOMAIN
{{domain_description}}

RELATIONSHIPS
{{relationships}}

ACCESS PATTERNS
{{access_patterns}}

DATABASE
{{database_backend}}

REQUIREMENTS
1. Use the SQLAlchemy 2.0 typed declarative style: class Model(Base) with Mapped[int] and mapped_column(...) annotations, not the legacy Column(...) class-attribute style — mixing the two styles in one codebase is a common source of confusing type-checker errors.
2. For every relationship in {{relationships}}, choose a loading strategy based on the actual access pattern in {{access_patterns}}, not the SQLAlchemy default (lazy="select", which issues one extra query per parent row the first time the relationship is touched): selectinload for a one-to-many accessed in bulk (a single extra query for the whole batch, not one per row), joinedload for a many-to-one or one-to-one that's always needed alongside the parent, and lazy loading only where {{access_patterns}} confirms the relationship is genuinely rarely accessed and loading it eagerly would waste bandwidth on rows that never need it.
3. State explicitly, per relationship, which loading strategy you picked and why, referencing the specific access pattern that justifies it — a relationship configured without a stated reason is a relationship configured by accident.
4. Add appropriate indexes (index=True, or a composite Index(...) at the table level) on any column {{access_patterns}} shows being filtered or joined on frequently — a foreign key column that's never indexed turns a common filter into a full table scan as the table grows.
5. Use back_populates (not backref) for bidirectional relationships, and set cascade behavior explicitly (e.g. cascade="all, delete-orphan") rather than relying on the default, stating what happens to child rows when a parent is deleted.
6. If {{database_backend}} is Postgres-specific, use its native types where they fit (JSONB over a generic Text column for structured data, ARRAY where genuinely appropriate) rather than the lowest-common-denominator type that would also work on SQLite.
7. For any relationship configured with selectinload or joinedload here, confirm the query code that will actually use these models passes the right execution options (or that the relationship-level lazy= setting is sufficient on its own) — a relationship configured for eager loading still N+1s if the calling query re-specifies its own conflicting loader option, so state explicitly which side owns the final decision at query time.

OUTPUT FORMAT
1. The models, in dependency order.
2. A table: relationship, loading strategy chosen, and the access pattern that justifies it.
3. The indexes added, and what query each one is meant to speed up.
4. One sentence confirming whether the relationship-level default is sufficient on its own, or whether query-time loader options must also be set consistently.`,
    variables: [
      {
        name: 'domain_description',
        description: 'The real-world entities the models represent.',
        example: 'A blog: authors, posts, and comments on posts.',
        required: true,
      },
      {
        name: 'relationships',
        description: 'The relationships between the entities.',
        example:
          'An Author has many Posts; a Post has many Comments; a Comment belongs to one Post.',
        required: true,
      },
      {
        name: 'access_patterns',
        description:
          'How the data is actually queried, which determines the right loading strategy.',
        example:
          "The main feed lists 20 posts at a time and always shows each post's comment count; an author's own dashboard shows their posts but comments are only loaded when a specific post is opened.",
        required: true,
      },
      {
        name: 'database_backend',
        description:
          'The actual database engine, since some types and features are backend-specific.',
        example: 'PostgreSQL 16',
        required: false,
      },
    ],
    targetTools: ['Claude Code', 'ChatGPT (GPT-5.1)', 'GitHub Copilot Chat'],
    tags: ['sqlalchemy', 'orm', 'database', 'n+1', 'postgresql', 'python'],
    whyItWorks: `Naming SQLAlchemy 2.0's Mapped[...]/mapped_column typed style specifically, rather than leaving the ORM style unconstrained, matters because a large share of existing SQLAlchemy code and tutorials still use the legacy Column(...) class-attribute pattern, and a prompt that doesn't pin the version-specific style reliably gets back a mix of both that either fails a strict mypy pass or, worse, works but abandons the type-checking benefit the 2.0 style exists to provide in the first place. Forcing a stated loading strategy per relationship, tied to a real access pattern rather than the library default, targets the single most common and most expensive SQLAlchemy production bug: lazy="select" issues one additional query per row the first time a relationship is accessed, which is invisible and fast in a unit test that touches one row, and becomes a literal N+1 query storm — twenty separate queries to render a feed of twenty posts — the moment the same code runs against a real list view, often not discovered until a slow-query log or a production incident makes it visible. The access_patterns field is what makes this a design decision instead of a guess, because the correct strategy genuinely differs by how the data is actually read: selectinload issues one extra query for the whole batch and is right for a one-to-many relationship accessed across many rows at once (the feed's comment count), while joinedload folds the relationship into the same query via a JOIN and is right for something always needed alongside its parent, and eagerly loading a relationship that's accessed only rarely (individual post comments, opened one at a time) wastes bandwidth fetching data most requests never use — there is no single default that's correct for both patterns in the same schema, which is exactly why SQLAlchemy leaves the choice to the caller rather than picking one for you.`,
    exampleOutput: `class Post(Base):
    __tablename__ = "posts"
    id: Mapped[int] = mapped_column(primary_key=True)
    author_id: Mapped[int] = mapped_column(ForeignKey("authors.id"), index=True)
    author: Mapped["Author"] = relationship(back_populates="posts")
    comments: Mapped[list["Comment"]] = relationship(
        back_populates="post", cascade="all, delete-orphan", lazy="selectinload"
    )
    # selectinload: feed always needs a comment count across a batch of ~20 posts at once —
    # one extra query for the whole page, not 20 separate per-post queries.

Table: Post.comments -> selectinload, justified by "main feed always shows comment count for a batch of posts"; Post.author -> joinedload, justified by "author name is always shown alongside every post, one-to-one".
Index: author_id indexed to speed the dashboard's "posts by this author" filter, which runs on every dashboard load.`,
    verifiedAgainst: [{ tool: 'Claude Code', version: 'Sonnet 4.6', date: '2026-08-02' }],
    changelog: [
      {
        date: '2026-08-02',
        note: 'Initial publish, verified against Claude Code (Sonnet 4.6) on SQLAlchemy 2.0 with PostgreSQL 16.',
      },
    ],
  },
  {
    slug: 'python-multiprocessing-batch-parallelization',
    category: 'python',
    title: 'Parallelize a CPU-bound batch job across cores without a pickling error',
    description:
      'A prompt for converting a slow single-process CPU-bound loop into a multiprocessing.Pool-based job, with chunk sizing, picklability checked up front, and a documented reason it is multiprocessing and not threading — instead of a naive Pool.map that crashes on an unpicklable argument.',
    promptText: `Parallelize the batch job below across multiple CPU cores. This needs to be multiprocessing specifically, not threading — confirm that's actually the right call given the workload before writing anything.

CURRENT JOB
{{current_job}}

WORKLOAD SIZE
{{workload_size}}

PER-ITEM WORK
{{per_item_work}}

HARDWARE
{{hardware_context}}

REQUIREMENTS
1. Confirm this is genuinely CPU-bound before reaching for multiprocessing: if {{per_item_work}} is actually I/O-bound (waiting on a network call or disk, not computing), say so explicitly and recommend threading or asyncio instead, since multiprocessing adds real overhead (process startup, inter-process serialization) that only pays off when the bottleneck is CPU cycles, not waiting.
2. Every argument passed into the worker function, and everything the worker function returns, must be picklable — the default way multiprocessing.Pool ships data between processes. Check {{per_item_work}} for anything that isn't: an open file handle, a database connection, a lambda, a bound method on an unpicklable object. If something isn't picklable, redesign the worker to open that resource inside the worker process itself, not pass it in from the parent.
3. Choose a chunk size deliberately, not the library default of 1 — for {{workload_size}} many small, fast items, a chunk size of 1 makes the inter-process communication overhead dominate the actual work; compute a reasonable chunksize (total items divided by roughly 4x the process count) and say why.
4. Size the process pool to {{hardware_context}}'s actual core count via os.cpu_count(), not a hardcoded number that might exceed or badly underuse the machine this actually runs on, and leave at least one core free if this runs alongside other processes on the same machine.
5. Handle a single worker failure without losing the whole batch: use Pool.imap or imap_unordered with per-item exception handling inside the worker (catch, return a tagged failure result) rather than letting one bad item's exception propagate and kill the entire pool run silently.
6. If the workload benefits from sharing large read-only data across workers (a big lookup table, say), use an initializer function with Pool(initializer=..., initargs=...) so it's loaded once per worker process, not repeatedly pickled and sent per task.
7. State the platform this actually runs on and whether it matters here: Windows and macOS default to the spawn start method (each worker re-imports the module from scratch, so worker code must be importable and guarded behind if __name__ == "__main__"), while Linux defaults to fork — a script that only works because it happened to be tested on Linux can fail to start at all on Windows with a confusing pickling error that has nothing to do with the actual worker logic.

OUTPUT FORMAT
1. Confirmation this is genuinely CPU-bound, or the recommendation to use threading/asyncio instead if it isn't.
2. The worker function and the Pool-based orchestration code.
3. The chosen chunksize and pool size, with the arithmetic behind each.
4. How a single failed item is surfaced without killing the batch.
5. Confirmation the code is guarded for the start method {{hardware_context}}'s platform actually uses.`,
    variables: [
      {
        name: 'current_job',
        description: 'What the current single-process job does, in a loop.',
        example:
          'A script that resizes and re-encodes 80,000 product images from a shared network drive, one at a time.',
        required: true,
      },
      {
        name: 'workload_size',
        description: 'How many items the job processes per run.',
        example: '80,000 images per run, run nightly.',
        required: true,
      },
      {
        name: 'per_item_work',
        description:
          'What actually happens to each item, so CPU-bound vs I/O-bound can be confirmed.',
        example:
          'Each image is decoded, resized with Pillow, re-encoded to WebP, and written back to disk — no network calls involved.',
        required: true,
      },
      {
        name: 'hardware_context',
        description: 'The machine this actually runs on, to size the pool correctly.',
        example:
          'A dedicated 16-core batch-processing VM, runs this job alone with nothing else scheduled on it.',
        required: false,
      },
    ],
    targetTools: ['Claude Code', 'ChatGPT (GPT-5.1)', 'Cursor 2.1'],
    tags: [
      'multiprocessing',
      'parallelization',
      'concurrency',
      'pickling',
      'performance',
      'python',
    ],
    whyItWorks: `Requiring confirmation that the workload is genuinely CPU-bound before writing any multiprocessing code targets a real and common misapplication: multiprocessing has meaningfully higher overhead than threading or asyncio because each worker is a separate OS process with its own memory space, and every argument and return value has to be serialized (pickled) and sent across a pipe between processes — for an I/O-bound workload (network calls, disk waits) that overhead buys nothing, because the bottleneck was never CPU cycles in the first place, and threading or asyncio would parallelize the actual wait time far more cheaply. The picklability check exists because it's the single most common way a naive multiprocessing.Pool script crashes in practice: passing an open file handle, a database connection, or a bound method on a non-trivial object into Pool.map fails with a confusing PicklingError deep inside the multiprocessing machinery, far from the line that actually caused it, and the fix — open the resource inside the worker process itself rather than passing it in from the parent — has to be designed in up front, not patched on after the first crash. Choosing chunksize deliberately rather than accepting the library's default of 1 addresses a real, measurable performance cliff: for a workload of many small, fast items, a chunk size of 1 means every single item incurs its own separate inter-process round trip, so the communication overhead can end up dominating the actual work, while a properly sized chunk amortizes that overhead across a batch of items per round trip — this is precisely the kind of tuning knob that's invisible in a correctness review of the code but shows up immediately in wall-clock time on the real workload size. Handling per-item failure with imap_unordered and in-worker exception catching, rather than letting Pool.map propagate the first exception, matters because a single malformed item — one corrupt image file out of 80,000 — should not be able to silently take down a multi-hour batch job three hours into its run; the tagged-failure-result pattern is what turns "one bad file kills the whole night's job" into "one bad file is logged and the other 79,999 still complete."`,
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-02' },
      { tool: 'Claude Code', version: 'Sonnet 4.6', date: '2026-08-03' },
    ],
    changelog: [
      {
        date: '2026-08-03',
        note: 'Initial publish, verified against ChatGPT (GPT-5.1) and Claude Code (Sonnet 4.6) on Python 3.12.',
      },
    ],
  },
  {
    slug: 'python-hypothesis-property-based-tests',
    category: 'python',
    title:
      'Write property-based tests with Hypothesis for a function with a large input space',
    description:
      'A prompt for designing Hypothesis strategies and invariant properties for a function whose bugs live in inputs nobody thought to write an example test for, instead of a handful of manually chosen example-based test cases that only cover what the author already imagined.',
    promptText: `Write property-based tests using Hypothesis for the function below, instead of (or alongside) example-based tests. The goal is to find inputs that break an invariant nobody thought to write a manual test case for — that's the entire reason to reach for Hypothesis over a hand-picked example.

FUNCTION UNDER TEST
{{target_function}}

KNOWN INVARIANTS
{{known_invariants}}

INPUT DOMAIN CONSTRAINTS
{{input_constraints}}

SUSPECTED WEAK SPOT
{{suspected_weak_spot}}

REQUIREMENTS
1. Design a Hypothesis strategy (st.integers(), st.text(), st.builds(...), or a composed strategy) that actually respects {{input_constraints}} — a strategy too loose generates inputs the function was never meant to handle and produces false-failure noise; a strategy too narrow misses the real edge cases Hypothesis exists to find. State why the chosen strategy matches the real domain.
2. State each property being tested as an invariant that should hold for every valid input, not as "the output equals this specific value" — a property test asserting a hardcoded expected output for one specific generated input isn't testing a property, it's a disguised (and fragile) example test. Cover at least: {{known_invariants}}, plus any property implied by the function's own contract (e.g. a sort function's output should always be the same length as its input and contain the same elements).
3. Specifically target {{suspected_weak_spot}} with a strategy that's more likely to generate inputs near that boundary, using st.integers(min_value=..., max_value=...) or filters/mapping to bias generation toward the suspicious region rather than relying on uniform random luck to eventually hit it.
4. Use assume() to discard genuinely invalid generated inputs rather than writing a strategy so constrained it never explores the boundary of what's valid, and explain the difference between the two approaches for this specific case.
5. If Hypothesis finds a failing example, don't just report the raw random-looking input — explain what property it violates and why that specific shape of input is the minimal case Hypothesis's shrinking found, since that minimal case is usually the one that actually explains the bug.
6. Use @settings(max_examples=...) deliberately rather than accepting the library default everywhere — a property with a small, well-bounded input space needs far fewer generated examples to be exhausted than one with a large or unbounded space, and running the default example count uniformly wastes time on simple properties while sometimes under-exploring genuinely large ones.

OUTPUT FORMAT
1. The Hypothesis strategies used, with a one-line justification each.
2. The property test functions.
3. If you can identify a case that would actually fail with the current implementation, show it and explain the violated invariant — don't just assert the tests would pass without checking.
4. Any @settings override applied and why the default example count wasn't the right fit here.`,
    variables: [
      {
        name: 'target_function',
        description: 'The function to property-test, with its signature.',
        example:
          'def merge_intervals(intervals: list[tuple[int, int]]) -> list[tuple[int, int]]: merges overlapping (start, end) intervals.',
        required: true,
      },
      {
        name: 'known_invariants',
        description:
          'Properties already known to hold, so Hypothesis tests confirm them systematically rather than by luck.',
        example:
          'The merged output covers exactly the same total range as the input; no two intervals in the output overlap; the output is sorted by start.',
        required: true,
      },
      {
        name: 'input_constraints',
        description:
          'What makes an input actually valid for this function, to shape the generation strategy correctly.',
        example:
          'Each interval has start <= end; the list can be empty; intervals can be given in any order, not just sorted.',
        required: true,
      },
      {
        name: 'suspected_weak_spot',
        description:
          'A specific area suspected to be buggy, so generation is biased toward finding it faster.',
        example:
          'Intervals that touch exactly at a boundary (one ends where the next begins) — unclear if the current code treats that as overlapping or not.',
        required: false,
      },
    ],
    targetTools: ['Claude Code', 'ChatGPT (GPT-5.1)', 'Cursor 2.1'],
    tags: ['hypothesis', 'property-based-testing', 'pytest', 'test-generation', 'python'],
    whyItWorks: `Requiring properties to be stated as invariants rather than fixed expected outputs directly targets the most common way people misuse Hypothesis the first time they try it: writing @given(st.integers()) and then asserting my_func(x) == some_hardcoded_value, which either only works for a trivial function or quietly reduces to an example test with random inputs bolted on, defeating the entire point — Hypothesis's value is in checking a relationship that must hold across the whole input space (merged intervals cover the same total range as the input, regardless of what that range actually is), not a memorized single answer. The input_constraints field matters because Hypothesis's strategies generate literally anything in the type's range by default — st.integers() will happily generate negative numbers, zero, and values near sys.maxsize — so a strategy that doesn't encode the function's real preconditions either wastes most of its generated examples on inputs the function was never meant to handle (producing failures that are noise, not bugs) or, if filtered too aggressively with assume(), spends so much generation budget discarding invalid examples that it never gets deep into the actually interesting input space. The suspected_weak_spot field exploits something specific about how Hypothesis actually searches: its default generation is unbiased across the strategy's range, so a boundary condition — intervals meeting exactly edge-to-edge, an off-by-one at a comparison operator — can statistically take many runs to stumble into by pure chance, while a strategy deliberately biased toward that specific boundary (via min_value/max_value bounds or a composed strategy) finds it reliably in the very first run instead of leaving it to luck. Requiring the minimal shrunk failing example to be explained, not just reported, matters because Hypothesis's shrinking process is specifically designed to reduce a failing input to the smallest, simplest case that still reproduces the failure — that minimal case is usually the actual root cause laid bare, and reporting the original large random-looking failing input instead throws away the most useful part of what Hypothesis just did.`,
    verifiedAgainst: [{ tool: 'Claude Code', version: 'Sonnet 4.6', date: '2026-08-03' }],
    changelog: [
      {
        date: '2026-08-03',
        note: 'Initial publish, verified against Claude Code (Sonnet 4.6) on Hypothesis 6.115 and pytest 8.3.',
      },
    ],
  },
  {
    slug: 'python-settings-multi-environment-config',
    category: 'python',
    title:
      'Build a pydantic-settings config loader with real local/staging/production profiles',
    description:
      'A prompt for a pydantic-settings BaseSettings hierarchy with per-environment overrides, fail-fast validation on missing secrets, and a clear precedence order between env vars and .env files, instead of an ad hoc os.environ.get scattered across the codebase with silent string defaults.',
    promptText: `Build a configuration system using pydantic-settings for the application below. The goal is one typed Settings object the whole app imports, not os.environ.get(...) calls scattered across a dozen files with inconsistent, silently-wrong string defaults.

APPLICATION
{{application_description}}

REQUIRED SETTINGS
{{required_settings}}

ENVIRONMENTS
{{environments}}

SECRETS HANDLING
{{secrets_handling}}

REQUIREMENTS
1. Define a base Settings(BaseSettings) class typing every setting explicitly — no bare str for something that's really an int, a bool, or a URL (use pydantic's AnyUrl or a more specific type where it fits). Use model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="forbid") so an unrecognized environment variable typo raises loudly instead of silently being ignored.
2. Implement {{environments}} as either a single Settings class with an environment: Literal[...] field driving conditional defaults, or as one subclass per environment — pick whichever fits {{required_settings}} better and say why. Whichever approach, the environment itself must be selected by one explicit variable (e.g. APP_ENV), never inferred from something indirect like "is DEBUG unset."
3. Any setting with no safe default — a database password, an API key, anything in {{secrets_handling}} — must be a required field with no default value at all, so the application fails at startup with a clear pydantic ValidationError naming the missing field, rather than starting successfully and failing confusingly the first time that setting is actually used.
4. State the precedence order explicitly and make sure the implementation matches it: real environment variables should override .env file values (this is pydantic-settings' actual default behavior), which should override class-defined defaults — confirm this matches what {{environments}} actually needs for a production deploy where env vars come from the deployment platform, not a checked-in file.
5. Never commit real secret values — provide a .env.example with every required variable name present and a placeholder or empty value, and add .env to .gitignore if it isn't already covered.
6. Add a small validator (@model_validator) for any cross-field consistency {{environments}} implies — e.g. if environment is "production", debug must be False, and say what happens if that combination is ever set: fail startup, don't just log a warning and continue.
7. Give the Settings object a __repr__ or a dedicated logging call at startup that prints every loaded setting except the ones flagged in {{secrets_handling}} — an operator restarting the service needs to be able to confirm which environment and config actually loaded without that confirmation ever risking printing a real credential to a log line.

OUTPUT FORMAT
1. The Settings class(es).
2. The .env.example file.
3. One sentence confirming the precedence order and how a missing required secret actually surfaces at startup.
4. Confirmation that the startup log/repr excludes every field flagged as a secret.`,
    variables: [
      {
        name: 'application_description',
        description:
          'What the application is and how it currently gets its configuration.',
        example:
          'A FastAPI service currently reading DATABASE_URL, API_KEY, and DEBUG via scattered os.environ.get() calls with inconsistent defaults.',
        required: true,
      },
      {
        name: 'required_settings',
        description: 'The actual settings the app needs, with their real types.',
        example:
          'database_url: PostgresDsn, api_key: str (secret), debug: bool, request_timeout_seconds: int, allowed_origins: list[str]',
        required: true,
      },
      {
        name: 'environments',
        description:
          'The environment profiles this needs to support and how they differ.',
        example:
          'local (debug=True, permissive CORS), staging (debug=False, staging DB), production (debug=False, strict CORS, must fail startup if debug is somehow True)',
        required: true,
      },
      {
        name: 'secrets_handling',
        description:
          'Which settings are secrets and where they actually come from at runtime.',
        example:
          'api_key and database_url are secrets, injected by the deployment platform as real environment variables in staging/production — never read from a checked-in .env there.',
        required: true,
      },
    ],
    targetTools: ['Claude Code', 'ChatGPT (GPT-5.1)', 'GitHub Copilot Chat'],
    tags: [
      'pydantic-settings',
      'configuration',
      'environment-variables',
      'secrets',
      'fastapi',
      'python',
    ],
    whyItWorks: `Requiring extra="forbid" in the settings config targets a real and specific class of bug: without it, a typo in an environment variable name (DATABSE_URL instead of DATABASE_URL) is silently ignored by pydantic-settings rather than raising, so the application starts successfully, the setting quietly falls back to its default (or fails validation on a completely different, more confusing field), and the actual typo is invisible until someone traces a wrong runtime value all the way back to a one-character misspelling in a deployment config. Making required-with-no-default the rule for secrets, rather than a fallback empty string, exploits Pydantic's validation timing directly: a missing required field raises ValidationError the moment Settings() is instantiated, which for a well-structured app happens once at process startup — so a missing production database password fails loudly in the first second of a deploy, rather than starting up "successfully" and only surfacing as a mysterious connection error the first time a request actually needs that database, at which point the failure is much further from its actual cause and much more disruptive to debug live. The precedence-order requirement matters because pydantic-settings' actual behavior (real environment variables override a .env file, which overrides class defaults) is exactly backwards from what someone might assume if they're thinking of a .env file as "the config" and env vars as an occasional override — in a real production deploy, the platform injects secrets as actual environment variables and there often is no .env file at all, so a settings design that was only ever tested locally against a .env file can behave completely differently in production if the precedence direction was misunderstood, which is precisely the kind of bug that never shows up until the first real deploy. The startup-visibility requirement, scoped explicitly to exclude flagged secrets, closes the loop on a common operational blind spot: without any confirmation of what actually loaded, a misconfigured deploy that silently picked up the wrong environment profile looks identical to a correct one until something downstream fails, and the fix has to be a log line disciplined enough to be genuinely useful without becoming a second, less obvious place a credential could leak.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-04' }],
    changelog: [
      {
        date: '2026-08-04',
        note: 'Initial publish, verified against ChatGPT (GPT-5.1) on pydantic-settings 2.6.',
      },
    ],
  },
  {
    slug: 'python-custom-exception-hierarchy',
    category: 'python',
    title: 'Design a custom exception hierarchy callers can actually catch selectively',
    description:
      'A prompt for a library-level exception hierarchy with a single common base, semantically distinct subclasses, and preserved exception chaining, instead of one flat CustomError class that forces every caller into the same broad except block regardless of what actually went wrong.',
    promptText: `Design a custom exception hierarchy for the library or module described below. The goal is a hierarchy callers can actually catch selectively — not one flat exception class that forces every caller to catch everything the same way regardless of what actually failed.

MODULE
{{module_description}}

FAILURE MODES
{{failure_modes}}

CALLER NEEDS
{{caller_needs}}

REQUIREMENTS
1. Define one base exception for this module/library (e.g. class OrderKitError(Exception)) that every other exception in it inherits from, so a caller who genuinely wants to catch anything this module can raise has one type to catch — but no caller should be forced to use that broad catch if {{caller_needs}} shows they need to react differently to different failures. If {{existing_conventions}} names a project-wide base exception this library is expected to fit under, inherit from that instead of Exception directly, so a caller catching the whole application's error base still catches this module's failures too.
2. For each distinct failure mode in {{failure_modes}}, create a specifically named subclass, not a generic one reused for multiple unrelated situations — a caller catching InvalidDiscountCodeError should never also silently catch a database connectivity failure because both happened to reuse the same exception type out of laziness.
3. Give each exception class the specific attributes a catcher would need to act on the failure programmatically, not just a human-readable message string — e.g. an InvalidDiscountCodeError should carry the actual code that was rejected as a real attribute, not only buried inside a formatted message a caller would have to regex out.
4. When raising a custom exception in response to catching a different underlying exception (a database driver's own exception, say), use raise CustomError(...) from original_exception, never a bare raise CustomError(...) that discards the original — losing the original exception's traceback and type is losing real debugging information for no benefit.
5. Decide deliberately whether any of {{failure_modes}} should be a subclass of a relevant Python builtin (a ValueError-like input problem might reasonably subclass ValueError too, using multiple inheritance, so callers who only know standard exception types still catch it correctly) versus purely custom — state the reasoning per exception, don't apply the same rule to all of them by default.
6. Document, in each exception class's docstring, exactly when it's raised and what a caller can safely assume about the state of the system after catching it (was anything partially written? is it safe to retry?).

OUTPUT FORMAT
1. The exception hierarchy, as a class diagram in text (indented to show inheritance) before the code.
2. The exception classes with their attributes and docstrings.
3. One example: a caller that catches two different subclasses differently, and one that catches the base class broadly, showing both are genuinely supported.`,
    variables: [
      {
        name: 'module_description',
        description: 'What the module or library does.',
        example:
          'A library called "orderkit" that parses and validates e-commerce order export files.',
        required: true,
      },
      {
        name: 'failure_modes',
        description: 'The distinct ways this module can fail.',
        example:
          "A malformed file that can't be parsed at all, a row with an invalid discount code, a row referencing a product ID that doesn't exist, a network timeout when checking a product ID against a remote catalog.",
        required: true,
      },
      {
        name: 'caller_needs',
        description:
          'How callers actually need to react differently to different failures.',
        example:
          'A malformed file should abort the whole import immediately; an invalid discount code or missing product should be logged and that one row skipped; a network timeout should trigger a retry, not a skip.',
        required: true,
      },
      {
        name: 'existing_conventions',
        description:
          'Whether the surrounding project already has a shared base exception this library should fit under.',
        example:
          'The main application defines AppError(Exception) at app/core/errors.py, and every internal library is expected to raise subclasses of it.',
        required: false,
      },
    ],
    targetTools: ['Claude Code', 'ChatGPT (GPT-5.1)', 'GitHub Copilot Chat'],
    tags: ['exceptions', 'error-handling', 'library-design', 'api-design', 'python'],
    whyItWorks: `Requiring a specifically named subclass per distinct failure mode, rather than one flat exception type reused everywhere, directly targets the actual cost of a flat hierarchy: a caller who wants to retry on a transient network timeout but skip-and-log on a bad discount code cannot express that distinction at all if both failures raise the same OrderKitError, and is forced into either catching everything the same way (retrying a permanent validation failure pointlessly) or parsing the exception's message string to guess what actually happened, which is exactly the kind of brittle string-matching a typed exception hierarchy exists to make unnecessary. The requirement to attach real attributes, not just a message string, matters because the caller_needs field almost always implies programmatic action on the failure, not just logging it for a human to read later — a caller that needs to log "which discount code was rejected" needs exc.code as an actual attribute it can read, and forcing it to regex a formatted message string to extract that value is fragile in a way that breaks the moment someone tweaks the message wording for readability, with no compiler or type checker to catch the mismatch. The raise ... from original_exception requirement preserves something Python's exception chaining specifically exists to provide: the __cause__ attribute and the "The above exception was the direct cause of the following exception" traceback section, which is often the only trace of what actually went wrong at the lowest level — a bare re-raise of a new exception type discards this, so when a caller's InvalidDiscountCodeError turns out to actually be masking a database connection blip that made a lookup fail, that real cause is gone from the traceback entirely, and debugging has to start over from nothing rather than one traceback frame back. The deliberate builtin-subclassing decision matters because it changes who can catch the exception without importing this specific library at all — a caller doing a broad except ValueError for input-validation problems across an entire codebase will silently also catch an InvalidDiscountCodeError if it multiply-inherits from ValueError, which is sometimes exactly the intended, helpful behavior and sometimes an unwanted surprise, so it has to be a stated decision per exception rather than an accident of how the class happened to be written.`,
    verifiedAgainst: [{ tool: 'Claude Code', version: 'Sonnet 4.6', date: '2026-08-05' }],
    changelog: [
      {
        date: '2026-08-05',
        note: 'Initial publish, verified against Claude Code (Sonnet 4.6) on Python 3.12.',
      },
    ],
  },
  {
    slug: 'python-streaming-large-file-processing',
    category: 'python',
    title: 'Process a file too large to load into memory, without silently truncating it',
    description:
      'A prompt for streaming/chunked processing of a large CSV, JSONL, or log file with a bounded, stated memory footprint and a resumability plan for a mid-run crash, instead of a pandas.read_csv() or json.load() that works in dev on a sample file and OOM-kills the process on the real one.',
    promptText: `Write a streaming processor for the large file described below. This must never load the whole file into memory at once — that's the entire reason this isn't just a five-line pandas.read_csv() call, which is exactly what tends to work fine on a sample file in dev and then OOM-kills the process the first time it runs against the real one.

FILE
{{file_description}}

PROCESSING NEEDED
{{processing_needed}}

MEMORY BUDGET
{{memory_budget}}

FAILURE RECOVERY
{{failure_recovery_needs}}

REQUIREMENTS
1. Read the file incrementally — line-by-line for a line-delimited format (CSV, JSONL, plain log lines) using the file object as an iterator, or with an incremental parser for a format that isn't naturally line-delimited (ijson for large JSON arrays, csv.reader over an open file handle rather than csv reading a fully-loaded string). Never call .read() or .readlines() on the whole file, and never pass the whole file into pandas.read_csv() without chunksize= if pandas is genuinely the right tool here.
2. If {{processing_needed}} requires aggregation (a running total, a count per category, a set of distinct values seen), keep only the aggregate state in memory, not the raw rows — state explicitly what the actual peak memory usage will be as a function of the number of distinct keys or categories, not the number of rows, since that's the number that actually determines whether this fits {{memory_budget}}.
3. Process the file in bounded-size batches for anything that benefits from batching (a bulk database insert, a batched API call) — pick a batch size and justify it against {{memory_budget}}, rather than either one-row-at-a-time (slow) or the whole file at once (defeats the entire point of streaming).
4. Match {{failure_recovery_needs}} explicitly: if the file needs to be resumable after a crash partway through, track and persist progress (a byte offset, a line number, or a natural checkpoint like "last fully-processed batch id") somewhere that survives a process restart, and state exactly what happens on restart — reprocessing from the last checkpoint, and whether that risks reprocessing a partially-committed batch.
5. Validate row-level data as it streams past, the same way a normal validation pass would, but without ever accumulating invalid rows in an in-memory list beyond what {{memory_budget}} allows — write them to a bounded rejects file/stream instead, flushed periodically, not held entirely in memory until the end.
6. State the actual big-O memory behavior of the design in one sentence: O(1) relative to file size if truly streaming, or name specifically what does grow with file size and why that's still an acceptable, bounded amount given {{memory_budget}}.

OUTPUT FORMAT
1. The streaming processor.
2. The batching and checkpoint/resume logic.
3. One sentence stating the actual memory behavior as a function of input size, confirmed against {{memory_budget}}.`,
    variables: [
      {
        name: 'file_description',
        description: 'The file format, rough size, and where it comes from.',
        example:
          'A daily server access log, JSONL format, roughly 30GB per day, delivered to a local disk mount by an upstream log shipper.',
        required: true,
      },
      {
        name: 'processing_needed',
        description: 'What needs to happen to the data as it streams through.',
        example:
          'Count requests per status code and per endpoint, and insert every request with status >= 500 into a database table for alerting.',
        required: true,
      },
      {
        name: 'memory_budget',
        description: 'The actual memory ceiling this needs to run within.',
        example:
          'Runs as a scheduled job on a container capped at 512MB; the job is killed and restarted by the orchestrator if it exceeds that.',
        required: true,
      },
      {
        name: 'failure_recovery_needs',
        description:
          'What should happen if the process crashes or is killed partway through the file.',
        example:
          'If killed partway through, the next run should resume from roughly where it left off rather than reprocessing the full 30GB file from the start, and must not double-count requests already inserted.',
        required: false,
      },
    ],
    targetTools: ['Claude Code', 'ChatGPT (GPT-5.1)', 'GitHub Copilot Chat'],
    tags: ['streaming', 'memory-management', 'large-files', 'batching', 'etl', 'python'],
    whyItWorks: `Explicitly banning .read(), .readlines(), and an unqualified pandas.read_csv() targets exactly the trap that makes this class of bug so common: all three work perfectly well against a small sample file used during development, giving every appearance of correctness, and only fail against the real 30GB production file, at which point the failure is an OOM kill from the container orchestrator with a stack trace that often doesn't point anywhere near the actual root cause — the bug is invisible for the entire development and code-review cycle and only manifests under real production data volume. Requiring the memory-behavior statement to be expressed as a function of the number of distinct keys or categories, not the number of rows, forces a genuinely correct mental model of streaming aggregation: a running total or a per-status-code counter has memory usage bounded by how many distinct categories exist, which might be a few dozen status codes regardless of whether the file has one million or one billion rows, and getting this distinction right is what separates code that's actually O(1) in file size from code that looks like streaming but secretly still accumulates something unbounded, like a full list of every row ever seen, defeating the entire design. The failure_recovery_needs field matters because a large file processed as a scheduled job will eventually get killed partway through — by an orchestrator hitting a timeout, a deploy restarting the container, a real crash — and a design with no checkpoint strategy has exactly one recovery option: reprocess the entire multi-gigabyte file from byte zero, which for a 30GB daily log means the recovery cost of one failure can exceed the time budget for the whole job; naming resumability as a requirement up front is what turns "reprocess everything" into "resume from the last checkpoint," which is a difference of orders of magnitude in recovery time and, if done carelessly, a real risk of double-counting or double-inserting whatever was processed just before the crash.`,
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-06' },
      { tool: 'Claude Code', version: 'Sonnet 4.6', date: '2026-08-07' },
    ],
    changelog: [
      {
        date: '2026-08-07',
        note: 'Initial publish, verified against ChatGPT (GPT-5.1) and Claude Code (Sonnet 4.6) on Python 3.12.',
      },
    ],
  },
  {
    slug: 'python-resilient-web-scraper',
    category: 'python',
    title: 'Build a web scraper that respects rate limits and fails predictably',
    description:
      'A prompt for a scraping script that checks robots.txt, paces requests deliberately, retries transient failures without hammering the target, and extracts data into a validated structured schema — instead of a tight fetch loop that gets the IP blocked on day one.',
    promptText: `Build a web scraper for the target described below. This needs to behave like a responsible client, not a tight loop that fetches as fast as the network allows — that gets an IP blocked or rate-limited within minutes against most real sites, and the scraper stops working entirely rather than slowing down gracefully.

TARGET SITE
{{target_site}}

DATA TO EXTRACT
{{data_to_extract}}

SCALE AND FREQUENCY
{{scale_and_frequency}}

LEGAL/ToS CONTEXT
{{tos_context}}

REQUIREMENTS
1. Check and respect robots.txt for {{target_site}} programmatically (using urllib.robotparser or an equivalent), not just as a one-time manual check — if a path this scraper needs is disallowed, say so explicitly and stop, rather than scraping it anyway and hoping it goes unnoticed. Note anything {{tos_context}} says beyond robots.txt that also constrains what's being built here.
2. Rate-limit deliberately: a fixed minimum delay between requests to the same domain, ideally with jitter so requests don't arrive at suspiciously exact intervals, sized to {{scale_and_frequency}} and to whatever robots.txt's Crawl-delay (if present) specifies. State the requests-per-minute this design produces and whether that's actually reasonable for a site this scraper doesn't own or control.
3. Set a real, identifying User-Agent header naming what this is, not a spoofed browser User-Agent pretending to be a real person's browser — a scraper impersonating a browser to bypass basic bot detection is a materially different (and riskier) thing to build than one that identifies itself honestly and gets blocked if the target doesn't want it.
4. Retry transient failures (connection timeouts, 5xx responses) with backoff, matching the retry discipline of a well-built API client — but treat a 429 (Too Many Requests) or 403 as a signal to back off much further or stop entirely, never as just another transient error to retry through at the same pace, since retrying a 429 at the same rate is actively making the problem worse.
5. Extract {{data_to_extract}} into a validated structured schema (a Pydantic model per extracted item), not raw dicts pulled straight from the parsed HTML — validate that required fields actually parsed correctly and log or quarantine a page that didn't match the expected structure, rather than silently producing a record with missing or garbage fields.
6. Design for the target site's HTML changing without notice: isolate every CSS selector or parsing rule in one place, not scattered through the extraction logic, so a layout change breaks one identifiable line instead of failing mysteriously somewhere in the middle of a long function.

OUTPUT FORMAT
1. The robots.txt check.
2. The rate-limited fetch function with backoff and its 429/403 handling.
3. The extraction schema and parsing function.
4. The requests-per-minute this design produces, and confirmation it respects any Crawl-delay found.`,
    variables: [
      {
        name: 'target_site',
        description: 'The site being scraped and the specific pages or sections needed.',
        example:
          'A public real-estate listings site, scraping individual listing detail pages linked from a search results page.',
        required: true,
      },
      {
        name: 'data_to_extract',
        description: 'The specific fields that need to come out of each page.',
        example:
          'Listing price, square footage, address, and listed date from each detail page.',
        required: true,
      },
      {
        name: 'scale_and_frequency',
        description:
          'How many pages, and how often this runs, to size rate limiting correctly.',
        example:
          'Roughly 2,000 listing pages, run once per day as a scheduled job — not a one-time pull.',
        required: true,
      },
      {
        name: 'tos_context',
        description:
          "What the site's terms of service or robots.txt say about automated access, if checked.",
        example:
          'robots.txt disallows /admin/ and /api/internal/ but allows /listings/; Terms of Service page has no explicit anti-scraping clause found.',
        required: false,
      },
    ],
    targetTools: ['Claude Code', 'ChatGPT (GPT-5.1)', 'GitHub Copilot Chat'],
    tags: [
      'web-scraping',
      'rate-limiting',
      'robots-txt',
      'data-extraction',
      'httpx',
      'python',
    ],
    whyItWorks: `Requiring a programmatic robots.txt check, not a one-time manual read, matters because robots.txt can change and because "I checked it once" doesn't scale to a scraper that runs daily for months — building the check into the scraper itself, via urllib.robotparser, means a future robots.txt change (a site adding a Disallow rule after noticing scraper traffic) is respected automatically on the very next run rather than requiring someone to remember to re-check it manually, which in practice nobody reliably does. The distinction between retrying a 5xx and backing off hard on a 429 targets a real and specific escalation risk: a 429 is the target server explicitly telling the client it's being rate-limited right now, and a naive retry-with-backoff implementation that treats every non-2xx response identically will keep hitting the same server at nearly the same rate while backing off only slightly, which from the target's perspective looks like a client that received the rate-limit signal and ignored it — this is exactly the behavior that turns a soft rate limit into a hard IP ban, so 429/403 need materially different handling than a transient timeout, not the same retry loop with the same parameters. Requiring an honest, identifying User-Agent rather than a spoofed browser one is a deliberate design choice with real consequences either way: identifying honestly means a site operator who doesn't want this traffic can block it cleanly by User-Agent, and the scraper fails in a way that surfaces immediately and unambiguously, while a spoofed browser User-Agent is specifically built to make the scraper's traffic indistinguishable from a real user's browser to bypass exactly that kind of detection — the difference matters for how {{tos_context}} should actually be read, since building a bot-detection-evasion tool is a fundamentally different thing to be asked to build than a scraper that plays by the rules and accepts being blocked if the target says no. Isolating every parsing rule in one place addresses the specific way scrapers actually fail in production: the target's HTML structure will change without any notice on the scraper's end, and a parsing rule embedded inline throughout a long extraction function means that change surfaces as a confusing partial failure somewhere in the middle of a run, while centralizing the selectors means the exact same change surfaces as one broken, easily locatable rule the next time the job runs.`,
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-07' },
      { tool: 'Claude Code', version: 'Sonnet 4.6', date: '2026-08-08' },
    ],
    changelog: [
      {
        date: '2026-08-08',
        note: 'Initial publish, verified against ChatGPT (GPT-5.1) and Claude Code (Sonnet 4.6) using httpx 0.28.',
      },
    ],
  },
  {
    slug: 'python-sql-query-postgres-parameterized-analytics-query',
    category: 'python',
    title: `Turn a plain-English analytics question into a parameterized Postgres query that won't get you paged for a table scan`,
    description: `Writes a parameterized (never string-formatted) Postgres query for a specific analytics question, plus the EXPLAIN-based check to run before it goes anywhere near production data.`,
    promptText: `You are a senior backend engineer writing one specific SQL query against a Postgres database for a real analytics question — not a generic "SQL tutorial" answer, and not pseudocode.

QUESTION TO ANSWER
{{business_question}}

RELEVANT TABLES AND COLUMNS
{{schema_snippet}}

ESTIMATED ROW COUNTS
{{row_counts}}

HOW THIS QUERY WILL BE RUN
{{execution_context}}

RULES
Write the query using named bind parameters (\`%(param_name)s\` for psycopg2-style, or \`:param_name\` if the execution context says it's SQLAlchemy) — never interpolate a Python f-string or \`.format()\` value directly into the SQL text, even for a value you think is safe, because the habit is what causes the incidents, not any single query. State explicitly which parameters are user-controlled input versus internal constants, since only the former strictly need to be parameterized but treating both the same way avoids a future edit accidentally reintroducing string formatting. If the question requires aggregating across a table you were told has millions of rows, do not default to a query that would force a sequential scan — check the given row counts against the WHERE and JOIN columns and flag any column being filtered or joined on that doesn't sound indexed based on the schema snippet, rather than silently writing a slow query and calling it done. Prefer \`EXISTS\` over \`IN (SELECT ...)\` for anti-join or existence checks against a large table, and explain in one line why, in this specific case, rather than asserting it as a rule of thumb. If the business question is ambiguous about a boundary condition (inclusive/exclusive date range, how to treat NULLs in a grouping column, whether a soft-deleted row counts), do not silently pick one interpretation — state the ambiguity and the interpretation you chose.

WHAT NOT TO DO
Do not wrap the answer in a generic explanation of what SQL joins are. Do not add a second, alternate version of the query "in case this isn't what you meant" — commit to one query that matches the stated question, or ask a clarifying question if the ambiguity is severe enough that guessing wrong would produce a materially different number.

OUTPUT FORMAT
1. The parameterized query, formatted and commented at any non-obvious join or filter.
2. The parameter dictionary shape (name -> example value -> user-controlled or internal).
3. The \`EXPLAIN (ANALYZE, BUFFERS)\` command to run against it before trusting the result, plus what to look for in the output (sequential scan on a large table, a nested loop over an unindexed column) that would mean the query needs rework.
4. Any boundary-condition ambiguity you resolved and how.`,
    variables: [
      {
        name: 'business_question',
        description: `The actual question in plain English, as specific as you can make it.`,
        example: `For each subscription plan, what's the 30-day retention rate for customers who signed up in the last 6 months?`,
        required: true,
      },
      {
        name: 'schema_snippet',
        description: `The relevant table and column names — doesn't need to be the full schema, just what this query touches.`,
        example: `subscriptions(id, customer_id, plan_id, started_at, canceled_at), customers(id, signup_channel)`,
        required: true,
      },
      {
        name: 'row_counts',
        description: `Rough size of the tables involved, so the model can flag scan risk.`,
        example: `subscriptions ~14M rows, customers ~2.1M rows`,
        required: true,
      },
      {
        name: 'execution_context',
        description: `How and where the query will actually run.`,
        example: `Runs nightly via a psycopg2 cron job against a read replica, result written to a reporting table.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT`],
    tags: [
      `sql`,
      `postgresql`,
      `query-optimization`,
      `sql-injection`,
      `data-engineering`,
    ],
    whyItWorks: `The instruction to name bind-parameter placeholders instead of accepting any query that "looks parameterized" closes the specific gap where a model asked generically for a "safe SQL query" will happily produce a parameterized WHERE clause but then interpolate a table or column name via an f-string elsewhere in the same query, because it's pattern-matching on the visible injection risk (a value in a WHERE clause) rather than reasoning about the underlying rule (never let user-influenced text reach the SQL string directly). Supplying row counts and asking the model to reason about which filter/join columns are likely unindexed works because GPT-5.1 has no access to your actual \`pg_indexes\` catalog and will otherwise default to writing a correct-looking query without ever surfacing that correctness and performance are different questions — giving it the row counts turns an invisible risk into something it can actually reason about and flag, rather than silently assuming an index exists because the schema snippet happens to look like a foreign key. Forcing a stated resolution for boundary ambiguities (inclusive date ranges, NULL handling in GROUP BY) matters because these are exactly the places where a wrong silent guess produces a plausible-looking wrong number rather than an obvious error — the query still runs and returns rows, so nobody notices the interpretation was wrong until a report doesn't reconcile. Requiring the EXPLAIN command as a deliverable rather than just the query converts the output from "a SQL answer" into an actual verification step the user is expected to run before trusting the query in production, which matches how a senior engineer actually ships analytics SQL rather than pasting it straight from a chat window.`,
    exampleOutput: `SELECT plan_id, COUNT(*) FILTER (WHERE canceled_at IS NULL OR canceled_at > started_at + interval '30 days') * 1.0 / COUNT(*) AS retention_30d FROM subscriptions s JOIN customers c ON c.id = s.customer_id WHERE s.started_at >= %(window_start)s GROUP BY plan_id; -- window_start is user-controlled (report date range), the interval literal is internal. Run EXPLAIN (ANALYZE, BUFFERS) first and check that started_at hits an index rather than a sequential scan across 14M rows.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-08' }],
    changelog: [
      {
        date: '2026-08-08',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'python-database-schema-normalized-schema-with-migration-plan',
    category: 'python',
    title: `Design a normalized table schema for a new feature without breaking the tables already in production`,
    description: `Produces a normalized schema for a new feature plus a phased migration plan against your existing tables, so the design doesn't just look right on a whiteboard but actually ships without a destructive rewrite.`,
    promptText: `You are a database architect designing the schema for a new feature that has to coexist with tables already live in production — this is not a greenfield design exercise, so every decision has to account for what already exists and what would break if handled carelessly.

FEATURE BEING ADDED
{{feature_description}}

EXISTING RELEVANT TABLES
{{existing_tables}}

DATABASE ENGINE AND VERSION
{{database_engine}}

EXPECTED SCALE AND ACCESS PATTERN
{{scale_and_access_pattern}}

CONSTRAINTS THAT CANNOT CHANGE
{{hard_constraints}}

PHASE 1 — SCHEMA DESIGN
Design the new tables and any columns added to existing tables, normalized to at least 3NF unless the stated access pattern gives a specific, named reason to denormalize (a read path that would otherwise require a join across more than three tables on every request, for example) — and if you do denormalize anything, say exactly which normal-form rule you're breaking and why the access pattern justifies it, rather than denormalizing by default and calling it a performance decision after the fact. Every foreign key needs an explicit ON DELETE behavior (CASCADE, RESTRICT, SET NULL) chosen deliberately, not left at the engine default, because the default silently varies by engine and picking it by omission is how orphaned rows or unintended cascading deletes happen later.

PHASE 2 — MIGRATION PLAN
Given the existing tables listed above already have production data and traffic, write the migration as an ordered list of individually-reversible steps, each one safe to run without locking the affected table for longer than a few seconds — call out specifically any step that would require a full table rewrite or an ACCESS EXCLUSIVE lock at the stated scale, and propose the safer alternative (adding a nullable column first and backfilling in batches, for example, rather than adding a NOT NULL column with a default directly). Do not propose a single big migration script that does everything in one transaction if any individual step in it is risky at the stated scale.

PHASE 3 — WHAT COULD GO WRONG
Name the one existing table most likely to have data that violates a new constraint you're adding (a NOT NULL, a new foreign key, a new UNIQUE constraint) and specify how you'd find out before the migration runs, not after it fails partway through.

OUTPUT FORMAT
1. Schema as DDL (CREATE TABLE / ALTER TABLE statements).
2. One-paragraph explanation of any deliberate denormalization.
3. The ordered, reversible migration step list.
4. The pre-migration data-validation query for the risk named in Phase 3.`,
    variables: [
      {
        name: 'feature_description',
        description: `What the new feature does, in enough detail to infer what data it needs to store.`,
        example: `Let a customer save multiple shipping addresses and pick a default one at checkout.`,
        required: true,
      },
      {
        name: 'existing_tables',
        description: `The current tables this feature will touch or extend, with their key columns.`,
        example: `customers(id, name, email), orders(id, customer_id, shipping_address_text) — address is currently a single free-text column on orders.`,
        required: true,
      },
      {
        name: 'database_engine',
        description: `The specific engine and version, since migration mechanics differ.`,
        example: `PostgreSQL 15, running on RDS`,
        required: true,
      },
      {
        name: 'scale_and_access_pattern',
        description: `Table sizes and how the data is typically read/written, to justify normalization vs. denormalization calls.`,
        example: `orders table has ~40M rows and is read on every checkout page load; write volume is ~50k orders/day.`,
        required: true,
      },
      {
        name: 'hard_constraints',
        description: `Anything that must not change — uptime requirements, an API contract, a reporting job that reads the raw table directly.`,
        example: `No downtime allowed during business hours (9am-9pm ET); a nightly BI job queries orders.shipping_address_text directly and can't break.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT`],
    tags: [`database-design`, `schema-migration`, `postgresql`, `normalization`, `sql`],
    whyItWorks: `Asking for a migration plan as ordered, individually-reversible steps rather than a single design deliverable forces the model out of academic schema design mode, where a textbook-correct 3NF layout is treated as the whole answer, and into the actual constraint that matters in a live system: an ALTER TABLE that looks trivial in DDL can take an ACCESS EXCLUSIVE lock and block every other query against that table for the duration of a full rewrite, which for a 40-million-row table is not a hypothetical, it's an outage. Requiring an explicit ON DELETE behavior on every foreign key instead of accepting the engine default closes a specific failure mode where a model asked for "a schema" writes syntactically correct DDL that compiles fine and then produces silent data-integrity drift in production months later, because the default cascade behavior was never a deliberate choice anyone reviewed. The Phase 3 requirement — naming the one existing table most likely to violate a new constraint — matters because the standard failure pattern with adding NOT NULL or UNIQUE to an already-populated table isn't a design flaw, it's a migration that runs fine in a schema-design review and then fails at 2am partway through backfilling real production rows that don't satisfy the new rule, which is exactly the class of failure a pre-migration validation query catches before the migration is ever run rather than after it's half-applied. Requiring a stated reason for any denormalization, rather than letting the model default to whichever shape looks cleaner, keeps a genuine access-pattern-driven trade-off distinguishable from an unexamined shortcut in the eventual code review.`,
    exampleOutput: `CREATE TABLE addresses (id BIGSERIAL PRIMARY KEY, customer_id BIGINT NOT NULL REFERENCES customers(id) ON DELETE CASCADE, line1 TEXT NOT NULL, city TEXT NOT NULL, is_default BOOLEAN NOT NULL DEFAULT false); Migration step 1: add addresses table (no lock impact, new table). Step 2: add nullable orders.address_id column via ALTER TABLE ... ADD COLUMN (fast, metadata-only in PG11+). Step 3: backfill address_id in batches of 5,000 rows to avoid long-running transactions. Step 4: only after backfill is verified complete, add the NOT NULL constraint using NOT VALID + VALIDATE CONSTRAINT to avoid a full table scan lock.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-09' }],
    changelog: [
      {
        date: '2026-08-09',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'python-cli-tool-click-cli-with-config-precedence',
    category: 'python',
    title: `Scaffold a Python CLI tool whose flags, config file, and environment variables don't silently fight each other`,
    description: `Builds a Click-based CLI with subcommands, a clearly defined config-precedence order, and exit codes a shell script can actually branch on — not just a toy argparse demo.`,
    promptText: `Build a Python CLI tool using Click. This needs to work as a real command-line tool other people or scripts will invoke, not a demo script — that means config precedence, exit codes, and error messages all have to be deliberate, not accidental.

WHAT THE TOOL DOES
{{tool_purpose}}

SUBCOMMANDS NEEDED
{{subcommands}}

CONFIG SOURCES
{{config_sources}}

WHO/WHAT WILL INVOKE THIS
{{invocation_context}}

RULES
Define one explicit precedence order for settings that can come from more than one of: a config file, environment variables, and CLI flags — state the order plainly (e.g. CLI flag overrides env var overrides config file overrides built-in default) and implement it that way consistently across every setting, rather than letting each option's implementation drift independently, which is how tools end up with one flag that overrides the config file and another that silently doesn't. Every subcommand needs a docstring Click will surface in \`--help\` that states what it does and, for anything destructive, what it will NOT undo. Distinguish exit codes deliberately: 0 for success, a distinct non-zero code for "ran correctly but found nothing to do / a validation failure the user caused" versus a different code for "an unexpected internal error" — because the invocation context above determines whether a calling script needs to branch on that distinction, and collapsing everything to exit code 1 makes that impossible. Validate all user input at the CLI boundary with clear error messages that name which argument was wrong and why, before any side-effecting logic runs — never let a malformed flag surface as a stack trace.

WHAT NOT TO DO
Do not use \`print()\` for anything other than the tool's actual output going to stdout; route diagnostic/progress messages to stderr via Click's \`echo(..., err=True)\` so stdout stays pipeable. Do not silently swallow an exception to "keep the CLI clean" — a caught exception must either be handled with a specific recovery action or re-raised with added context, never passed and ignored.

OUTPUT FORMAT
1. The full Click CLI code (entry point, subcommands, config loading in precedence order).
2. A short table: exit code -> meaning -> when it happens.
3. One example \`--help\` output for the main command.
4. A one-paragraph note on how a calling script should check success/failure of this tool.`,
    variables: [
      {
        name: 'tool_purpose',
        description: `What the CLI tool actually does, in one or two sentences.`,
        example: `Syncs a local directory of markdown files to a remote S3 bucket, skipping files that haven't changed since the last sync.`,
        required: true,
      },
      {
        name: 'subcommands',
        description: `The subcommands (or single command if it's a flat tool) with a short description each.`,
        example: `sync (does the actual upload), status (shows what would change without uploading), init (writes a starter config file)`,
        required: true,
      },
      {
        name: 'config_sources',
        description: `Which of config file / env vars / CLI flags this tool needs to support and what settings live where.`,
        example: `bucket name and AWS profile can come from a .syncrc file or env vars; --dry-run and --verbose are flag-only.`,
        required: true,
      },
      {
        name: 'invocation_context',
        description: `Who or what actually runs this tool, since that determines how strict exit codes and error output need to be.`,
        example: `Runs both interactively by engineers and inside a nightly CI job that needs to fail the pipeline on a real error but not on 'nothing to sync'.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT`],
    tags: [`python`, `cli`, `click`, `developer-tools`, `automation`],
    whyItWorks: `Requiring one explicit, stated precedence order applied consistently across every configurable setting addresses a specific bug pattern in hand-rolled CLI tools: without an explicit rule, each setting tends to get its config-file/env-var/flag resolution logic written independently as the tool grows subcommand by subcommand, and inconsistent precedence between settings is invisible until a user's env var mysteriously overrides one flag but not another — asking for a single named rule up front, rather than letting each setting's precedence emerge from wherever the code happened to put it, is what actually prevents that drift. The exit-code table requirement matters specifically because the invocation context states this tool runs inside CI as well as interactively, and a CI pipeline can only make correct pass/fail decisions if "nothing to sync" and "the AWS credentials were invalid" produce genuinely different exit codes — a model asked generically to "build a CLI tool" defaults to exit 0 for success and exit 1 for everything else, which is exactly the collapse that makes automated pipelines either too permissive (masking real failures) or too strict (failing on a no-op run). Routing diagnostics to stderr via Click's \`err=True\` rather than plain \`print()\` is a mechanical requirement, not a style preference — a calling script that captures this tool's stdout to parse or log its actual output will silently ingest progress noise as data if diagnostics aren't kept off stdout, which is a common and hard-to-debug failure in composed shell pipelines specifically because it doesn't crash, it just corrupts the downstream data quietly.`,
    exampleOutput: `Exit codes: 0 = synced successfully or nothing to do; 2 = user error (bad config, invalid flag combination) — CI should treat as a build config problem; 1 = unexpected internal failure (network error, S3 auth failure) — CI should retry or alert. \`--help\` shows: Usage: filesync [OPTIONS] COMMAND [ARGS]... Commands: init, status, sync. Config precedence: CLI flag > FILESYNC_* env var > .syncrc > built-in default.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-10' }],
    changelog: [
      {
        date: '2026-08-10',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'python-script-one-off-data-cleanup-with-dry-run',
    category: 'python',
    title: `Write a one-off Python cleanup script that won't need a second one to undo it`,
    description: `Produces a one-off data cleanup or migration script with a mandatory dry-run mode and idempotency built in, for the kind of throwaway script that quietly becomes load-bearing the moment it touches real data.`,
    promptText: `Write a one-off Python script for a specific data cleanup job. Even though this is a "throwaway" script, it's going to run against real data exactly once (or a few times if something goes wrong the first time), so it needs a dry-run mode and idempotency, not just a happy-path implementation.

WHAT NEEDS TO HAPPEN
{{cleanup_task}}

DATA SOURCE
{{data_source}}

HOW MANY RECORDS, ROUGHLY
{{record_volume}}

WHAT COUNTS AS SUCCESS
{{success_criteria}}

RULES
The script must support a \`--dry-run\` flag that runs the exact same selection and transformation logic as the real run and prints/logs what it would change, without writing anything — implement this by having both modes call the same function to decide what changes, with only the final write step gated behind the flag, so the dry-run output can never drift from what the real run would actually do. Make every write idempotent: if the script is run twice against the same data (because it was killed halfway through, or someone re-runs it out of caution), running it again should produce the same end state rather than double-applying a change or erroring out. If the record volume is large enough that holding everything in memory at once is questionable, process in batches with progress output, and make sure a crash partway through a batch doesn't leave that batch in a half-applied state. Log every record that gets modified (its identifier and what changed) to a file, not just a summary count, so there's a concrete audit trail if something needs to be manually reversed later.

WHAT NOT TO DO
Do not write this as an inline script with no functions — structure it as at least a \`find_candidates()\`, \`apply_change(record)\`, and \`main()\` so dry-run and real-run can share logic. Do not catch a broad exception around the whole batch loop just to keep it running past errors; catch specific expected exceptions per-record, log them, and let genuinely unexpected exceptions stop the script rather than silently skip records.

OUTPUT FORMAT
1. The full script.
2. One paragraph on how to verify the dry-run output before running for real.
3. One paragraph on what the audit log lets someone manually reverse if needed.`,
    variables: [
      {
        name: 'cleanup_task',
        description: `Exactly what needs to change, described precisely enough to know the selection criteria and the transformation.`,
        example: `Find all user records where email is stored in mixed case and normalize them to lowercase, merging any resulting duplicate accounts by keeping the older one.`,
        required: true,
      },
      {
        name: 'data_source',
        description: `Where the data actually lives and how the script connects to it.`,
        example: `PostgreSQL production database, connecting via a read-write service account with a 30-second statement timeout.`,
        required: true,
      },
      {
        name: 'record_volume',
        description: `Roughly how many records this will touch, to decide whether batching matters.`,
        example: `About 900,000 user rows total, expecting roughly 12,000 to actually need changes.`,
        required: true,
      },
      {
        name: 'success_criteria',
        description: `What running this script successfully actually looks like, including how duplicates or edge cases should be handled.`,
        example: `Every email is lowercase, no two active accounts share the same normalized email, and the older account wins any merge.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT`],
    tags: [`python`, `data-cleanup`, `scripting`, `idempotency`, `data-migration`],
    whyItWorks: `Requiring dry-run and real-run to share the same selection/transformation function and differ only at the final write step closes the most common failure mode in hand-written cleanup scripts: when dry-run logic is written as a separate code path (a duplicated function, or an if/else branching much earlier than the write itself), it drifts from the real path the very first time someone edits one branch without the other, and the dry-run output stops being a trustworthy preview of what will actually happen — which defeats the entire point of having one. Making every write idempotent matters specifically because the stated context is a one-off script touching production data exactly once or twice, and the realistic failure scenario isn't a clean single run, it's the script getting killed by a timeout or a network blip partway through 900,000 rows and someone needing to just run it again — without idempotency, a naive re-run either double-merges accounts that already got merged or throws unhandled uniqueness errors on rows already processed, and the fix under production pressure is worse than the original bug. The per-record audit log requirement, rather than a summary count, is what actually makes a cleanup reversible: a count of "12,003 records updated" gives no way to identify which twelve thousand or what their prior values were, whereas a log of record-id-to-before/after gives someone a concrete list to manually or programmatically reverse if the success criteria turn out to have been mis-specified after the fact. Catching only specific expected exceptions per record, instead of wrapping the whole loop in a broad except, prevents the script from silently skipping records it doesn't know how to handle and reporting false success.`,
    exampleOutput: `def find_candidates(conn): ... def apply_change(record, dry_run): logger.info(f'{record.id}: {record.email} -> {record.email.lower()}'); if not dry_run: cursor.execute(...). Running with --dry-run against the 900k rows logged 12,014 planned changes to cleanup_audit.log with old/new email pairs; review that file for any unexpected merges before re-running without the flag.`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-11' }],
    changelog: [
      {
        date: '2026-08-11',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'python-fastapi-endpoint-validated-endpoint-with-auth-dependency',
    category: 'python',
    title: `Write a FastAPI endpoint whose 422 and 401 responses actually tell the caller what went wrong`,
    description: `Builds one FastAPI endpoint with Pydantic request/response models, an auth dependency, and distinct, informative error responses — the version that survives a frontend integrating against it, not just a Swagger demo.`,
    promptText: `Write one FastAPI endpoint. This will be integrated against by a real frontend or another service, so the error responses matter as much as the happy path — a 422 or 401 with a vague generic body just moves the debugging work onto whoever's calling this.

ENDPOINT
{{endpoint_spec}}

AUTH REQUIREMENT
{{auth_requirement}}

REQUEST/RESPONSE SHAPE
{{request_response_shape}}

BUSINESS RULES TO ENFORCE
{{business_rules}}

RULES
Define explicit Pydantic models for both the request body and the response — never return a bare dict, since that's how a response silently drifts out of sync with what the frontend expects as the code evolves and nobody notices until a field goes missing in production. Implement the auth requirement as a FastAPI dependency, not inline logic in the endpoint function, so it can be reused and unit-tested independently of this one route. For every business rule listed, decide and state the specific HTTP status code and response body it should produce when violated — a validation failure Pydantic can catch automatically should return its normal 422, but a business-rule violation (a duplicate, an out-of-range state transition, a permission the user's role doesn't have) needs its own distinct status code and a response body that names which rule was violated, not just "Bad Request". Use FastAPI's dependency injection for anything this endpoint needs (a DB session, the current user) rather than instantiating it inside the function body, so the endpoint stays testable with \`TestClient\` and overridden dependencies rather than requiring a real database connection to test.

WHAT NOT TO DO
Do not catch a broad \`Exception\` inside the endpoint just to return a clean error — let unexpected exceptions propagate to FastAPI's exception handling (or a registered exception handler) so they show up in logs/monitoring as the internal errors they are, rather than getting silently reshaped into a generic 400 that hides a real bug. Do not put business logic directly in the route function if it's more than a few lines — call into a separate function so the route stays a thin adapter between HTTP and the actual logic.

OUTPUT FORMAT
1. The Pydantic request and response models.
2. The auth dependency.
3. The route function.
4. A table: condition -> status code -> response body shape.
5. A short \`TestClient\`-based test for the main business-rule failure case.`,
    variables: [
      {
        name: 'endpoint_spec',
        description: `The HTTP method, path, and what it does.`,
        example: `POST /api/v1/projects/{project_id}/invite — invites a user by email to join a project.`,
        required: true,
      },
      {
        name: 'auth_requirement',
        description: `Who's allowed to call this and how identity is established.`,
        example: `Requires a valid JWT bearer token; only users with the 'owner' or 'admin' role on that specific project may invite others.`,
        required: true,
      },
      {
        name: 'request_response_shape',
        description: `What the request body needs and what a successful response should return.`,
        example: `Request: {email: str, role: 'member' | 'admin'}. Response: the created invitation record with id, status, and expiry.`,
        required: true,
      },
      {
        name: 'business_rules',
        description: `The non-validation rules that determine success or failure, beyond basic field types.`,
        example: `Can't invite an email already invited or already a member; a 'member' role cannot invite anyone with 'admin' role; project must not have hit its 50-seat limit.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT`],
    tags: [`fastapi`, `python`, `api-design`, `pydantic`, `backend`],
    whyItWorks: `Requiring an explicit Pydantic response model rather than a bare dict return matters because FastAPI only validates and documents what you tell it to — a route that returns \`dict(...)\` still works and still renders in the interactive docs with an inferred shape, so the discipline gap is completely invisible in local testing and only surfaces as a silent contract break once a field gets renamed or dropped and the frontend that was relying on the old shape breaks without FastAPI ever raising an error, because there was no explicit contract to violate. Pulling the auth check into a dependency rather than inline route logic is what makes \`TestClient\` testing of the business rules actually tractable: FastAPI's \`app.dependency_overrides\` mechanism lets a test swap in a fake authenticated user without touching a real JWT or database, which is only possible if the auth logic is a dependency in the first place — inline auth logic forces every test of every business rule to also stand up real authentication, which is exactly the kind of friction that gets tests skipped under deadline pressure. Requiring a distinct status code and named-rule response body per business rule, rather than letting Pydantic's automatic 422 cover everything, addresses a real confusion GPT-5.1 defaults toward: it tends to treat "validation" as one bucket, so a request that's shaped correctly but violates a business invariant (inviting someone already invited) gets folded into the same 422 as a malformed field, and the calling frontend has no reliable way to distinguish "you sent bad JSON" from "this specific business rule was violated" without parsing error message text, which is fragile the moment the message wording changes.`,
    exampleOutput: `class InviteRequest(BaseModel): email: EmailStr; role: Literal['member','admin']. 409 Conflict -> {'error': 'already_invited', 'detail': 'user@example.com already has a pending invitation'}. 403 Forbidden -> {'error': 'insufficient_role', 'detail': 'members cannot invite admins'}. def test_invite_duplicate_returns_409(client, override_owner_user): ... assert response.status_code == 409 and response.json()['error'] == 'already_invited'`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-12' }],
    changelog: [
      {
        date: '2026-08-12',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
  {
    slug: 'python-error-handling-exception-hierarchy-retryable-vs-fatal',
    category: 'python',
    title: `Design a Python exception hierarchy that tells your retry logic which failures are worth retrying`,
    description: `Produces a custom exception hierarchy and error-handling strategy for a service module that distinguishes retryable failures from fatal ones, instead of one flat except-Exception block deciding everything the same way.`,
    promptText: `Design an error-handling strategy for one specific Python module, including a custom exception hierarchy. The point is to make retryable failures and fatal failures behave differently everywhere this module is called, not to catch everything the same way.

MODULE AND WHAT IT DOES
{{module_description}}

EXTERNAL DEPENDENCIES IT CALLS
{{external_dependencies}}

HOW IT'S CURRENTLY CALLED
{{calling_context}}

FAILURE MODES ALREADY SEEN
{{known_failure_modes}}

RULES
Design a small exception hierarchy rooted in one base exception for this module, with subclasses that separate failures along the dimension that actually matters to a caller: is this worth retrying automatically (a transient network timeout, a rate limit, a lock-contention error) or not (a malformed input, a permission denial, a resource that genuinely doesn't exist)? Every subclass needs a one-line docstring stating specifically when it's raised and what a caller should do about it — "raised when X happens, caller should retry with backoff" versus "raised when Y happens, caller should not retry, this needs a code or data fix." For each external dependency listed, map its actual failure modes (a specific exception type it raises, or an HTTP status code it returns) onto your new hierarchy explicitly — do not let a third-party exception type leak up through this module uncaught, since that forces every caller to know about and handle a library-specific exception instead of this module's own contract. Attach enough context to each raised exception (the input that caused it, an identifier, not just a message string) that a caller or a log line can act on it without re-deriving what happened from scratch.

WHAT NOT TO DO
Do not create an exception subclass for every conceivable failure if two failures genuinely warrant the same caller behavior — a hierarchy with fifteen leaf types that all just mean "don't retry" is not more useful than three, it's just more surface area to keep in sync. Do not catch a broad \`Exception\` anywhere in this module's own code without immediately re-raising as one of the new custom types with context added — a caught-and-silently-logged exception here means the caller never finds out the operation didn't actually succeed.

OUTPUT FORMAT
1. The exception hierarchy as Python classes, each with its docstring.
2. A table mapping each known external failure mode to the custom exception it should become.
3. One code example showing the module raising the right custom exception with context attached.
4. One code example showing a caller using the hierarchy to decide retry vs. give up.`,
    variables: [
      {
        name: 'module_description',
        description: `What the module does and its general shape.`,
        example: `A module that uploads generated PDF reports to S3 and records the resulting object key in the database.`,
        required: true,
      },
      {
        name: 'external_dependencies',
        description: `What external systems, APIs, or libraries this module actually calls.`,
        example: `boto3 for S3 uploads, a Postgres connection via SQLAlchemy for recording the object key.`,
        required: true,
      },
      {
        name: 'calling_context',
        description: `Who calls this module and roughly what they currently do (or don't do) when it fails.`,
        example: `Called from a Celery task; right now a failure just logs a traceback and the task is marked failed with no retry.`,
        required: true,
      },
      {
        name: 'known_failure_modes',
        description: `Specific failures that have actually happened or are realistically expected, with as much detail as you have.`,
        example: `S3 throttling (SlowDown errors) under burst load; occasional Postgres connection drops; occasionally being asked to upload a report for a job_id that was already deleted.`,
        required: true,
      },
    ],
    targetTools: [`ChatGPT`],
    tags: [`python`, `error-handling`, `exceptions`, `reliability`, `backend`],
    whyItWorks: `Rooting the hierarchy in the retryable-versus-fatal distinction rather than a taxonomy of what went wrong mechanically matters because that's the actual decision a caller has to make with the exception, and it's a decision the built-in exception hierarchy can't express — \`boto3\` raising a \`ClientError\` for a throttled request and a \`ClientError\` for a permanently missing bucket look identical at the type level, so any caller catching that broad type has no structural way to know which behavior to apply and typically defaults to either always retrying (which spins forever on a permission error) or never retrying (which fails immediately on a transient throttle that would have succeeded on attempt two). Requiring the docstring to state what the caller should do, not just when the exception is raised, converts the hierarchy from documentation into an actual contract — a caller reading \`RetryableUploadError\` versus \`FatalUploadError\` knows the correct response without having to go read this module's internal implementation to figure out whether the underlying cause was transient. Mapping the specific known failure modes (S3 SlowDown, dropped Postgres connections, a deleted job_id) onto the new hierarchy explicitly forces the translation boundary to actually happen at this module's edge rather than being deferred — the alternative, letting \`boto3\`'s or SQLAlchemy's own exception types propagate up, means every caller across the codebase has to independently know which third-party exception types mean what, and that knowledge silently rots the moment the library's exception types change in a minor version bump. Capping the hierarchy's size by grouping failures that warrant identical caller behavior, rather than one subclass per distinct cause, keeps the hierarchy itself something a caller can hold in their head — an exception hierarchy nobody can remember gets handled with a blanket except-Exception anyway, which defeats the entire design.`,
    exampleOutput: `class ReportUploadError(Exception): pass
class RetryableUploadError(ReportUploadError): """Transient failure (throttling, dropped connection) - caller should retry with backoff."""
class FatalUploadError(ReportUploadError): """Non-retryable failure (missing job, permission denied) - caller should not retry, needs investigation."""
# S3 SlowDown -> RetryableUploadError(job_id=..., cause='s3_throttle'); Postgres OperationalError -> RetryableUploadError; upload for a deleted job_id -> FatalUploadError(job_id=..., cause='job_not_found')`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-13' }],
    changelog: [
      {
        date: '2026-08-13',
        note: `Initial publish, verified against ChatGPT GPT-5.1.`,
      },
    ],
  },
]
