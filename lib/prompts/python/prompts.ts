import type { Prompt } from '../types'

export const prompts: readonly Prompt[] = [
  {
    slug: 'python-function-spec-to-typed-code',
    category: 'python',
    title: 'Turn a plain-English function spec into fully type-hinted Python',
    description:
      'A prompt that converts a rough description of what a function should do into PEP 484-typed Python with explicit edge-case handling and a docstring, instead of untyped happy-path code.',
    promptText: `You are writing a single Python function to a strict spec, not a rough sketch. Every parameter, return value, and raised exception must be typed and documented before you write the implementation.

SPEC
{{function_spec}}

TARGET ENVIRONMENT
Python {{python_version}}. Use only the standard library, plus these packages if genuinely needed: {{allowed_packages}}

REQUIREMENTS
1. Full type hints on every parameter and the return type — no bare Any unless you name, in a comment, why nothing more specific is possible.
2. A docstring in Google or NumPy style: one-line summary, Args, Returns, Raises.
3. Explicit handling for: {{edge_cases}}. Do not silently swallow an error — raise a specific exception type, never a bare except with no type named.
4. If the function has an obvious failure mode not covered by {{edge_cases}}, name it and handle it anyway — don't wait to be told about every case.
5. No print statements for control flow or debugging — use the logging module if you need to observe behavior during development.

OUTPUT FORMAT
1. The function, fully typed and documented.
2. A short note for each edge case in {{edge_cases}}: one line on how it's handled and what it returns or raises.
3. One realistic call example showing the happy path, and one showing a handled failure.`,
    variables: [
      {
        name: 'function_spec',
        description:
          'What the function should do, in plain English, including inputs and the shape of the output.',
        example:
          'Given a list of order dicts (each with "amount" and "currency"), return the total in USD, converting non-USD amounts using a provided rate table.',
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
          'empty list input, an order missing the "amount" key, a currency not present in the rate table, a negative amount',
        required: true,
      },
    ],
    targetTools: [
      'ChatGPT (GPT-5.1)',
      'Claude (Sonnet 4.6)',
      'GitHub Copilot Chat',
      'Cursor 2.1',
    ],
    tags: ['type-hints', 'function-generation', 'mypy', 'pep-484', 'python'],
    whyItWorks:
      'Naming the edge cases explicitly in the prompt, rather than trusting the model to infer them, directly counters the well-documented happy-path bias of LLM-generated code — a model asked to just "write this function" will produce a version that works for the example in its head and silently mishandles everything else. Requiring the exception type and forbidding a bare except turns "handle errors" from a vague aspiration into something a reviewer can check by reading the except clauses. The instruction to name a failure mode not on the list, and handle it anyway, matters because the edge_cases variable can never be exhaustive — this is what stops the model from treating the given list as a ceiling rather than a floor. Finally, forcing full type hints before implementation, rather than as cleanup afterward, produces code that a strict mypy pass actually has a chance of accepting on the first try, instead of hints bolted on that quietly widen to Any wherever the model wasn\'t sure.',
    exampleOutput: `def total_in_usd(orders: list[dict[str, str | float]], rate_table: dict[str, float]) -> float:
    """Sum order amounts converted to USD.

    Args:
        orders: Each dict must have "amount" (float) and "currency" (str).
        rate_table: Maps currency code to its USD conversion rate.

    Returns:
        Total value in USD, rounded to 2 decimal places.

    Raises:
        KeyError: If an order is missing "amount" or "currency".
        ValueError: If a currency isn't in rate_table, or amount is negative.
    """
    total = 0.0
    for order in orders:
        amount = float(order["amount"])
        currency = str(order["currency"])
        if amount < 0:
            raise ValueError(f"negative amount not allowed: {amount}")
        if currency == "USD":
            total += amount
        elif currency in rate_table:
            total += amount * rate_table[currency]
        else:
            raise ValueError(f"no conversion rate for currency: {currency}")
    return round(total, 2)

Edge case notes: empty list returns 0.0 (loop just doesn't execute); missing "amount"/"currency" raises KeyError from the dict access itself; unknown currency raises ValueError naming the currency; negative amount raises ValueError before any arithmetic happens.`,
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-07-14' },
      { tool: 'Claude', version: 'Sonnet 4.6', date: '2026-07-16' },
    ],
    changelog: [
      {
        date: '2026-07-16',
        note: 'Initial publish, verified against ChatGPT (GPT-5.1) and Claude (Sonnet 4.6).',
      },
    ],
  },
  {
    slug: 'fastapi-endpoint-from-requirements',
    category: 'python',
    title: 'Scaffold a FastAPI endpoint with real validation and status codes',
    description:
      'A prompt that turns an endpoint requirement into a complete FastAPI route with Pydantic v2 models, correct HTTP status codes, and dependency-injected services, instead of a bare route stub returning a dict.',
    promptText: `Scaffold one FastAPI endpoint. This is a real service route, not a toy example — include validation, correct status codes, and dependency injection.

ENDPOINT REQUIREMENT
{{endpoint_requirements}}

CONVENTIONS TO FOLLOW
- Use APIRouter, mounted under /api/v1, resource name {{resource_name}}.
- Request and response bodies are Pydantic v2 models (BaseModel, not raw dicts) with Field constraints matching the requirement — don't accept a wider type than the spec allows.
- Use response_model on the route decorator, and the correct status code from fastapi.status (201 for creation, 204 for delete with no body, 404 when a lookup fails — 422 is Pydantic's job, not yours to hand-roll).
- Inject dependencies (DB session, current user, etc.) via Depends(...), never instantiate them inside the handler. Assume this dependency already exists and is wired: {{db_dependency_description}}.
- Auth: {{auth_requirement}}. If it's "none," don't add an auth dependency; don't invent one either.
- All I/O is async def. If a called function is genuinely synchronous or CPU-bound, say so explicitly and wrap it with run_in_threadpool rather than blocking the event loop silently.
- Raise HTTPException with a specific status and detail message for every failure path named in the requirement — don't let an unhandled case fall through to a generic 500.

OUTPUT FORMAT
1. The Pydantic request/response models.
2. The route function.
3. A one-line note per status code used, mapping it to the requirement it satisfies.`,
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
    ],
    targetTools: [
      'GitHub Copilot Chat',
      'Cursor 2.1',
      'Claude Code',
      'ChatGPT (GPT-5.1)',
    ],
    tags: ['fastapi', 'api-design', 'pydantic', 'rest-api', 'python'],
    whyItWorks:
      "FastAPI derives its automatic OpenAPI schema and request validation directly from the type hints on the route function and the Pydantic models it declares, so a scaffold that skips response_model or accepts a raw dict quietly loses the framework's main benefit — it still runs, but the generated docs and validation are wrong or missing. Naming the exact status codes per failure path (404 for a missing lookup, 409 for a conflict) stops the common default of returning 200 with an error message in the body, which breaks every client that checks the HTTP status rather than parsing the payload. The explicit instruction to wrap blocking calls with run_in_threadpool addresses FastAPI's single most common production bug: an async def handler that calls a synchronous, blocking function directly, which stalls the entire event loop for every other request being served by that worker, not just the slow one.",
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
    if await user_has_active_subscription(db, current_user.id):
        raise HTTPException(status_code=409, detail="User already has an active subscription")
    subscription = await create_subscription_record(db, current_user.id, body)
    return subscription

Status codes: 201 on success (subscription created); 404 when plan_id doesn't match a real plan; 409 when the user already has an active subscription.`,
    verifiedAgainst: [
      { tool: 'GitHub Copilot Chat', version: '1.260 (VS Code)', date: '2026-07-20' },
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
    slug: 'pytest-suite-from-function-behavior',
    category: 'python',
    title: 'Generate a pytest suite that tests behavior, not implementation',
    description:
      'A test-generation prompt that requires parametrized cases, isolated external dependencies, and named edge-case coverage, instead of a handful of near-duplicate happy-path tests.',
    promptText: `Write a pytest test suite for the code below. Test the documented behavior and contract, not the internal implementation — if the function's logic were rewritten to do the same thing differently, these tests should still mostly pass.

CODE UNDER TEST
{{target_code}}

EXTERNAL DEPENDENCIES TO ISOLATE
{{external_dependencies}}. Mock or fake these — do not let the test suite depend on a real network call, real file I/O, or a real database. Use pytest-mock's mocker fixture or unittest.mock.patch.

REQUIREMENTS
1. Use @pytest.mark.parametrize for any case that shares the same assertion shape with different inputs — don't hand-write five near-identical test functions.
2. Use fixtures for setup shared across tests, and scope each fixture (function, module, session) to the narrowest scope that's still correct.
3. Cover: the happy path, {{known_edge_cases}}, and at least one case not listed that you judge worth testing — name why you added it.
4. For anything defined with async def, use pytest-asyncio's async test support — don't wrap async code in asyncio.run() inside a synchronous test.
5. Name each test after the behavior it verifies (e.g. test_returns_empty_list_when_no_matches), not test_1 or test_case_a.
6. Assert on outcomes and raised exceptions with pytest.raises, never on internal call counts unless the actual requirement is "this must call X exactly once."

OUTPUT FORMAT
The test file, followed by a short list of anything you could not test without more context (e.g. a fixture needing real credentials) and why.`,
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
    tags: ['pytest', 'testing', 'test-generation', 'mocking', 'python'],
    whyItWorks:
      'Explicitly requiring parametrize over hand-written near-duplicates changes the shape of the output, not just its length: a table of parametrized cases makes a missing row visually obvious to a reviewer, where a missing copy-pasted test function is easy to not notice at all. Naming "test behavior, not implementation" directly targets a common LLM test-generation failure — asserting on internal state or call counts that make the suite brittle against any refactor, even a correct one. The dependency-isolation instruction is what keeps a generated suite from silently becoming an integration test that fails in CI for reasons unrelated to the code under test, such as a network blip or a shared database fixture colliding with another test run. And the instruction to add one edge case not on the known list, and justify it, forces the model to actually reason about the function\'s contract instead of just executing the given checklist.',
    verifiedAgainst: [
      { tool: 'Claude Code', version: 'Sonnet 4.6', date: '2026-07-18' },
      { tool: 'Cursor', version: '2.1', date: '2026-07-19' },
    ],
    changelog: [
      {
        date: '2026-07-19',
        note: 'Initial publish, verified against Claude Code (Sonnet 4.6) and Cursor 2.1 on pytest 8.3.',
      },
    ],
  },
  {
    slug: 'pandas-dataframe-cleaning-pipeline',
    category: 'python',
    title: 'Turn a messy DataFrame into a documented, reproducible cleaning pipeline',
    description:
      'A prompt for building a pandas cleaning pipeline as small, named, chainable functions with logged row drops and a schema check at the end, instead of one long unexplained block of reassignments.',
    promptText: `Write a pandas data-cleaning pipeline for the DataFrame described below. The output must be a set of small, named, testable functions chained together — not one long block of unexplained df[...] reassignments.

INPUT DATA
{{dataframe_description}}

KNOWN ISSUES TO FIX
{{known_issues}}

TARGET SCHEMA
{{target_schema}}

REQUIREMENTS
1. Each cleaning step is its own function taking a DataFrame and returning a DataFrame (e.g. def drop_duplicate_orders(df: pd.DataFrame) -> pd.DataFrame), so the pipeline reads as df.pipe(step_a).pipe(step_b)... — reviewable and testable step by step, not one monolithic function.
2. Never mutate the input DataFrame in place inside a step; return a new one (copy() where needed) so steps stay composable and order-independent bugs are easier to spot.
3. For every row dropped or value changed, log a count — a silent drop of bad rows is a data-loss bug wearing a clean-code costume.
4. Validate the final shape against {{target_schema}}: correct dtypes (don't leave a date column as object), no unexpected nulls in required columns, and fail loudly with a clear message if the result doesn't match, rather than returning a DataFrame that's quietly wrong.
5. Use vectorized pandas operations; only drop to apply() with a Python-level loop if you can state why a vectorized approach isn't possible.

OUTPUT FORMAT
1. Each step function, in order.
2. The pipe() chain that composes them.
3. One validation function that checks the result against {{target_schema}} and raises if it doesn't match.`,
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
    ],
    targetTools: [
      'ChatGPT (GPT-5.1)',
      'Claude (Sonnet 4.6)',
      'Jupyter AI',
      'GitHub Copilot Chat',
    ],
    tags: ['pandas', 'data-cleaning', 'etl', 'dataframe', 'python'],
    whyItWorks:
      'Composing the pipeline with pipe() over small, pure, named functions means each step can be reviewed, unit-tested, and reordered independently — a single 40-line block of chained df[...] assignments cannot be tested at all except end-to-end, which hides exactly which step introduced a bug. Requiring a logged count for every row dropped or value changed targets the single most common and most dangerous pandas cleaning mistake: a filter or dropna() that silently removes far more data than intended, discovered weeks later when a downstream report looks wrong with no trail back to the cause. The schema validation at the end catches a specific, very real pandas failure mode — a date column that parsed as object instead of datetime64 because one row had a malformed value, which then breaks every downstream .dt accessor call with a confusing error far from the actual cause.',
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
)`,
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-07-25' }],
    changelog: [
      {
        date: '2026-07-25',
        note: 'Initial publish, verified against ChatGPT (GPT-5.1) on pandas 2.2.',
      },
    ],
  },
  {
    slug: 'python-script-to-cli-tool',
    category: 'python',
    title: 'Turn a one-off Python script into a proper CLI tool',
    description:
      'A prompt that converts a script with hardcoded values or manual sys.argv indexing into a Typer or Click CLI with real help text, validation, and exit codes.',
    promptText: `Convert the script described below into a real command-line tool — not a script with sys.argv indexing, and not one that still has hardcoded values a user has to edit before running it.

CURRENT SCRIPT
{{script_description}}

FRAMEWORK
Use {{cli_framework}}. If it's Typer, define arguments as type-hinted function parameters — that's Typer's actual mechanism — rather than manually building a parser. If it's Click, use the @click.command() and @click.option/@click.argument decorators. If it's argparse, use argparse.ArgumentParser with explicit type=, required=, and help= on every argument.

COMMANDS NEEDED
{{commands_needed}}

REQUIREMENTS
1. Every option has a help string a stranger could act on without reading the source.
2. Every option with a sensible default gets one; every option that doesn't must be required and say so, rather than silently defaulting to None and failing three lines later with an unrelated error.
3. Validate inputs at the CLI boundary (file exists, path is a directory not a file, number is in range) and exit with a clear message and a non-zero exit code — never a raw traceback as the user-facing output.
4. Use meaningful exit codes: 0 for success, and distinct non-zero codes for distinct failure classes if there's more than one, documented in a comment.
5. If the tool does anything destructive (deletes files, overwrites data), add a --dry-run flag and default destructive behavior to off unless --yes or --force is passed.

OUTPUT FORMAT
1. The CLI entry point code.
2. The exact pyproject.toml [project.scripts] entry needed to install it as a real command.
3. Three example invocations: one happy path, one that fails validation, one using --dry-run if applicable.`,
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
    ],
    targetTools: [
      'Claude Code',
      'ChatGPT (GPT-5.1)',
      'GitHub Copilot Chat',
      'Cursor 2.1',
    ],
    tags: ['cli', 'typer', 'click', 'argparse', 'python'],
    whyItWorks:
      'Naming the exact mechanism for the chosen framework — Typer\'s type-hinted parameters versus Click\'s decorator-based options versus argparse\'s explicit ArgumentParser calls — stops the model from defaulting to whichever pattern shows up most in its training data regardless of which library was actually requested, a common mismatch when a prompt just says "use Typer" with no further detail. Requiring a --dry-run flag and an explicit opt-in for destructive behavior is a real safety practice lifted from how production CLI tools are actually built, and it\'s the detail a bare "turn this into a CLI" request reliably skips. Requiring the pyproject.toml [project.scripts] entry, not just the code, is what makes the result an installable command a user runs by name, rather than something still invoked as python script.py with a longer argument list.',
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
) -> None:
    cutoff = datetime.now() - timedelta(days=days_old)
    targets = [f for f in folder.glob(f"*{extension}") if datetime.fromtimestamp(f.stat().st_mtime) < cutoff]
    if dry_run:
        typer.echo(f"Would delete {len(targets)} files.")
        raise typer.Exit(code=0)
    for f in targets:
        f.unlink()
    typer.echo(f"Deleted {len(targets)} files.")

[project.scripts]
logclean = "logclean.cli:app"`,
    verifiedAgainst: [
      { tool: 'Claude Code', version: 'Sonnet 4.6', date: '2026-07-28' },
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-07-29' },
    ],
    changelog: [
      {
        date: '2026-07-29',
        note: 'Initial publish, verified against Claude Code (Sonnet 4.6) and ChatGPT (GPT-5.1) on Typer 0.13.',
      },
    ],
  },
  {
    slug: 'sync-to-async-python-refactor',
    category: 'python',
    title: 'Refactor blocking Python code to async without breaking it silently',
    description:
      'A prompt for converting synchronous I/O-bound code to async/await that separates what genuinely benefits from async, wraps unavoidable blocking calls correctly, and checks every caller — instead of prefixing every function with async def.',
    promptText: `Refactor the code below from synchronous to async — but only where it actually matters. Do not prefix every function with async def reflexively; that adds overhead without benefit for CPU-bound code and creates a false sense of concurrency.

CODE
{{target_code}}

I/O OPERATIONS INVOLVED
{{io_operations}}

GOAL
{{concurrency_goal}}

REQUIREMENTS
1. For each I/O operation, identify whether an async-native library exists (httpx's AsyncClient instead of requests, an async database driver instead of a sync one, aiofiles for file I/O) and use it. If no async equivalent exists for something in {{io_operations}}, say so explicitly and wrap it with asyncio.to_thread rather than calling it directly inside an async def and silently blocking the event loop.
2. Any genuinely CPU-bound work (parsing, computation) stays synchronous, or is offloaded to asyncio.to_thread or a ProcessPoolExecutor if it's heavy enough to matter — making it async def alone does nothing for CPU-bound code.
3. Use asyncio.gather, or a TaskGroup on Python 3.11+, to run independent I/O calls concurrently where {{concurrency_goal}} calls for it — don't await a list of calls sequentially and call it async.
4. Propagate cancellation and timeouts correctly: wrap calls that should have a deadline in asyncio.timeout(...), and don't swallow asyncio.CancelledError with a bare except Exception.
5. Every function whose signature changes from sync to async must have every one of its callers updated too — list them, don't leave a caller doing result = my_func() on a coroutine it never awaits.

OUTPUT FORMAT
1. The refactored code.
2. A table: function name, sync or async now, and the reason.
3. Every caller found that also needed updating, and confirmation each one now awaits correctly.`,
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
    ],
    targetTools: [
      'Claude Code',
      'ChatGPT (GPT-5.1)',
      'Claude (Sonnet 4.6)',
      'Cursor 2.1',
    ],
    tags: ['async', 'asyncio', 'concurrency', 'refactoring', 'python'],
    whyItWorks:
      "The explicit instruction against reflexively adding async def everywhere addresses a real, common misconception: async does nothing for CPU-bound work and adds event-loop overhead for no benefit, so a refactor that async-ifies indiscriminately can make code slower and harder to reason about while looking more modern. Naming asyncio.to_thread for any I/O operation with no async-native library available solves the single most common asyncio production bug directly — a blocking call left inside an async def function, which stalls the entire event loop for every concurrent request being served by that worker, not just the one making the slow call. Requiring the caller list is what catches the failure mode that's easy to miss and doesn't raise an exception when it happens: calling a newly-async function without awaiting it produces a coroutine object and a RuntimeWarning, not a crash, so the code silently does nothing at that call site unless someone specifically checks.",
    exampleOutput: `async def fetch_all_prices(product_ids: list[str]) -> list[Price]:
    async with httpx.AsyncClient() as client:
        results = await asyncio.gather(*(fetch_price(client, pid) for pid in product_ids))
    return results

Table: fetch_price -> async (network I/O, httpx.AsyncClient); fetch_all_prices -> async (fans out via gather); parse_price_response -> stays sync (pure CPU-bound parsing, no I/O).
Callers updated: report_generator.build_report() now does "prices = await fetch_all_prices(ids)" instead of a direct call — confirmed it runs inside an async context.`,
    verifiedAgainst: [
      { tool: 'Claude Code', version: 'Sonnet 4.6', date: '2026-08-02' },
      { tool: 'Claude', version: 'Sonnet 4.6', date: '2026-08-03' },
    ],
    changelog: [
      {
        date: '2026-08-03',
        note: 'Initial publish, verified against Claude Code and Claude (Sonnet 4.6) on Python 3.12.',
      },
    ],
  },
  {
    slug: 'pydantic-v2-model-design-from-domain',
    category: 'python',
    title: 'Design Pydantic v2 models that validate a real domain, not just shapes',
    description:
      'A prompt for designing Pydantic v2 models with field constraints, cross-field validators, and deliberate optional/required decisions from a description of real-world business rules.',
    promptText: `Design Pydantic v2 models for the domain below. The goal is models that reject bad data at the boundary, not models that just describe field names and types.

DOMAIN
{{domain_description}}

BUSINESS RULES TO ENFORCE
{{business_rules}}

REQUIREMENTS
1. Use Pydantic v2 syntax specifically: model_config = ConfigDict(...), not the v1-style class Config. Use Field(...) constraints (gt, max_length, pattern, etc.) for anything checkable declaratively, before reaching for a custom validator.
2. Use @field_validator for single-field logic that Field() can't express, and @model_validator(mode="after") for anything depending on more than one field (e.g. end_date must be after start_date). Name which business rule each validator enforces, in a comment.
3. Be deliberate about Optional versus required — a field should only be optional if the domain genuinely allows it to be absent, not because it's convenient during construction. Justify each optional field in one line.
4. Use Annotated[...] types for any constraint you'd otherwise repeat across multiple models, instead of copy-pasting the same Field(...) arguments everywhere.
5. Serialization: {{serialization_needs}}. If any field needs a different name on the wire than in Python, use alias or an AliasGenerator and set populate_by_name correctly, rather than manually renaming keys after the fact.
6. Give every model a docstring stating what real-world entity it represents and what invalid state it's specifically guarding against.

OUTPUT FORMAT
1. The models, in dependency order.
2. A short table: business rule, and which model or validator enforces it.
3. One example payload that should raise ValidationError, and what the error tells the caller.`,
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
          "check-out date must be after check-in date; number of guests can't exceed the property's max_occupancy; a booking under 2 nights requires a minimum-stay override flag",
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
    whyItWorks:
      'Requiring Pydantic v2 syntax by name matters because a large share of tutorials and training data still show v1 patterns (class Config, the bare @validator decorator), and an underspecified prompt will produce a plausible-looking mix of both APIs that fails at import time on a v2-only install. Requiring a one-line justification for every Optional field directly counters the reflexive habit of marking everything Optional to avoid construction friction during development, which quietly defeats the entire point of using Pydantic for validation — a field that\'s "optional" only because it was annoying to require lets genuinely missing data flow silently downstream. Separating @field_validator from @model_validator(mode="after") by exact use case, rather than leaving the choice to the model, mirrors the real API distinction: a single-field validator literally cannot see other fields, so a cross-field rule like end date after start date has to live in the model-level validator or it can\'t be expressed at all.',
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

Rule table: "check-out after check-in" -> check_out_after_check_in model_validator; "guest_count <= max_occupancy" -> field_validator cross-checked against the Property model at the service layer (not a static Field constraint, since it depends on another record).
Invalid payload: {"checkInDate": "2026-09-10", "checkOutDate": "2026-09-09", "guestCount": 2} raises ValidationError: "check_out must be after check_in" — tells the caller exactly which rule failed, not just that the payload is invalid.`,
    verifiedAgainst: [
      { tool: 'Claude Code', version: 'Sonnet 4.6', date: '2026-07-21' },
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-07-23' },
    ],
    changelog: [
      {
        date: '2026-07-23',
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
    promptText: `Diagnose this Python environment or dependency problem. Do not propose a fix until you've stated a specific hypothesis for the root cause — "try reinstalling" is not a diagnosis.

ERROR
{{error_output}}

ENVIRONMENT
{{environment_info}}

PACKAGE MANAGER IN USE
{{package_manager}}

DIAGNOSTIC PROCESS
1. Identify the failure category first: a version conflict between two packages' requirements, a missing system-level dependency (compiler, system library), a wrong or stale virtual environment being activated, a Python version mismatch (a package with no wheel for this Python version), or a corrupted/partial install. State which one this looks like and why, citing the specific line in the error output.
2. Ask for exactly the information you're missing to confirm the hypothesis, if anything — pip list output, the package manager's version, which python, or the lockfile — rather than guessing further.
3. Once confirmed, give the fix as ordered, copy-pasteable commands, not a paragraph description. Note which command is destructive (e.g. deleting a virtual environment) before it runs.
4. Give one prevention step specific to this failure category — pinning a version range, adding a lockfile, using a resolver like uv or pip-tools for reproducible installs — not a generic "keep dependencies updated."

CONSTRAINTS
- Don't suggest pip install --upgrade or --force-reinstall as a first move; that can mask the real problem and break other packages pinned lower in the dependency tree.
- If the fix could change behavior elsewhere in the project (a major version bump), say so and ask before assuming it's fine.

OUTPUT FORMAT
Root cause hypothesis, then confirming evidence needed if any, then exact fix commands, then one line on preventing this category next time.`,
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
    ],
    targetTools: [
      'ChatGPT (GPT-5.1)',
      'Claude (Sonnet 4.6)',
      'Claude Code',
      'Perplexity',
    ],
    tags: ['dependency-management', 'virtualenv', 'pip', 'uv', 'python'],
    whyItWorks:
      'Forcing a stated hypothesis, with a cited line from the error output, before any fix is proposed directly prevents the most common LLM failure mode on dependency errors: pattern-matching the error text to a generic "reinstall your packages" answer that either doesn\'t address the real conflict or actively masks it by upgrading something that was correctly pinned. Naming the real failure categories — a missing wheel for the installed Python version, a stale virtual environment still pointing at an old interpreter, a native compiler dependency the OS doesn\'t have — gives the model concrete diagnostic branches to reason through instead of one catch-all response. The explicit ban on leading with --force-reinstall reflects real practitioner knowledge: in a project with pinned versions, a force-reinstall of one package can silently pull in incompatible versions of its own dependencies, turning one broken import into three.',
    verifiedAgainst: [{ tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-07-11' }],
    changelog: [
      {
        date: '2026-07-11',
        note: 'Initial publish, verified against ChatGPT (GPT-5.1) on a uv-managed Python 3.12 project.',
      },
    ],
  },
  {
    slug: 'python-performance-profiling-plan',
    category: 'python',
    title: 'Find out why Python code is actually slow before optimizing it',
    description:
      'A profiling-first prompt that requires naming the real bottleneck category with a specific tool and command before suggesting any optimization, instead of guessing at generic speedups.',
    promptText: `This code is slow. Before you suggest any optimization, help me find out why — an optimization based on a guess is as likely to make no difference as to help.

CODE
{{slow_code}}

SYMPTOM
{{performance_symptom}}

CONSTRAINTS ON THE FIX
{{constraints}}

PROCESS
1. Classify the likely bottleneck category: CPU-bound (the computation itself is slow), I/O-bound (waiting on network, disk, or a database), memory-bound (excessive allocation, GC pressure, or swapping), or algorithmic (the wrong Big-O for the input size). State which you suspect and the specific line or pattern that makes you suspect it.
2. Name the exact profiling step to confirm it before changing anything: cProfile or snakeviz for CPU hotspots, py-spy for profiling a running process without modifying code, memory_profiler or tracemalloc for memory, line_profiler for line-by-line cost inside one function. Give the actual command to run, not just the tool's name.
3. Once the bottleneck is confirmed, propose the fix ranked by likely impact per effort — an algorithmic fix that changes O(n squared) to O(n) ranks above micro-optimizing a loop's variable access.
4. For any fix that trades memory for speed, or changes behavior under concurrency, say so explicitly.
5. State how to verify the fix actually helped: re-run the same profiling step and compare numbers, not "this should be faster."

OUTPUT FORMAT
Bottleneck hypothesis, then the profiling command to confirm it, then a ranked fix list, then the verification step.`,
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
    tags: ['performance', 'profiling', 'cprofile', 'optimization', 'python'],
    whyItWorks:
      "Forcing a bottleneck classification before any fix counters the default behavior of proposing generic micro-optimizations — swapping a for loop for a list comprehension, say — that often don't touch the actual bottleneck at all and can leave the real problem completely unaddressed. Naming specific real tools with their actual invocation (cProfile's command-line module flag, py-spy for a running process with zero code changes, line_profiler for per-line cost) turns \"profile your code\" from an aspiration into an executable next step. Ranking fixes by algorithmic impact before micro-optimization reflects the real order-of-magnitude difference at scale: an O(n squared) membership check against a growing list, fixed by switching to a set, changes a 40-second run into a sub-second one, which no amount of loop micro-tuning would ever reach — and naming that ranking explicitly stops the model from leading with the least impactful fix just because it's the easiest to describe.",
    exampleOutput: `Bottleneck hypothesis: algorithmic — "if item not in seen_list" inside the loop is an O(n) scan against a growing Python list, making the whole dedupe O(n squared).
Confirm with: python -m cProfile -s cumulative dedupe_script.py — expect the membership-check line to dominate cumulative time at this input size.
Fix, ranked: 1) swap seen_list for a set() — O(1) average membership check, changes the loop to O(n) overall. 2) (lower impact) avoid re-hashing unhashable row objects by deduping on a derived key instead.
Verify: re-run the same cProfile command on the 500k-row input and confirm total runtime drops from ~40s to sub-second, not just "looks faster."`,
    verifiedAgainst: [
      { tool: 'Claude Code', version: 'Sonnet 4.6', date: '2026-07-30' },
      { tool: 'Claude', version: 'Sonnet 4.6', date: '2026-07-31' },
    ],
    changelog: [
      {
        date: '2026-07-31',
        note: 'Initial publish, verified against Claude Code and Claude (Sonnet 4.6) on Python 3.12 with cProfile and py-spy.',
      },
    ],
  },
  {
    slug: 'python-package-pyproject-distribution',
    category: 'python',
    title: 'Package a Python project for real distribution with pyproject.toml',
    description:
      'A prompt for producing a complete, modern src-layout package with a real pyproject.toml, dev/test dependency groups, and a verified build step, instead of a bare setup.py or an incomplete pyproject stub.',
    promptText: `Package the project below for real distribution — not a script that only runs from inside its own folder.

PROJECT
{{project_description}}

RUNTIME DEPENDENCIES
{{dependencies}}

DISTRIBUTION TARGET
{{distribution_target}}

REQUIREMENTS
1. Use a src/ layout (src/<package_name>/..., inferring the actual package name from the project description) so the package can't accidentally be imported from the repo root during development, hiding a packaging bug that only shows up after a real install.
2. A complete pyproject.toml: [build-system] naming a specific backend (hatchling or setuptools>=68 — say which and why), [project] with name, version, requires-python, dependencies pinned with sensible lower bounds, and [project.optional-dependencies] for dev/test tooling (pytest, ruff, mypy) kept separate from runtime deps.
3. If this needs a CLI entry point, define it under [project.scripts].
4. A .gitignore covering build artifacts (dist/, *.egg-info, __pycache__/) and a minimal README.md with install and usage instructions matching {{distribution_target}}.
5. If {{distribution_target}} is public PyPI, flag what else is needed before publishing — a unique name check, a license file, a long_description sourced from the README — rather than assuming it's ready.
6. State the exact commands to build and locally verify the package installs cleanly: build it, install the built wheel into a fresh throwaway virtual environment, and import it, before it's ever pushed anywhere.

OUTPUT FORMAT
1. The file tree.
2. The full pyproject.toml.
3. The build-and-verify commands, in order.`,
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
    ],
    targetTools: [
      'Claude Code',
      'ChatGPT (GPT-5.1)',
      'GitHub Copilot Chat',
      'Cursor 2.1',
    ],
    tags: ['packaging', 'pyproject-toml', 'uv', 'distribution', 'python'],
    whyItWorks:
      'Requiring the src/ layout by name matters because it prevents the single most common packaging bug: a package that imports fine during development purely because the current working directory happens to be on sys.path, then fails on a genuinely clean install because a missing __init__.py or a broken relative import was never actually exercised until now. Requiring the build backend to be named and justified, rather than left to the model\'s default, matters because pyproject.toml\'s [build-system] table is exactly the part that varies most across tutorials of different vintages — an unconstrained prompt is as likely to produce a stale setup.py-based flow as a modern one. Requiring the fresh-venv install-and-import step as an explicit output, not just the config file, is what catches "works on my machine" packaging bugs — a dependency that was actually already installed globally, or a file that exists locally but was never added to the package manifest — before they reach a real install anywhere else.',
    verifiedAgainst: [
      { tool: 'Claude Code', version: 'Sonnet 4.6', date: '2026-08-01' },
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-08-02' },
    ],
    changelog: [
      {
        date: '2026-08-02',
        note: 'Initial publish, verified against Claude Code (Sonnet 4.6) and ChatGPT (GPT-5.1) using uv 0.5 for the build/verify step.',
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
    promptText: `Build a validation layer for the data pipeline below. The goal is a pipeline that tells you exactly which records are bad and why — not one that either crashes on the first bad row or silently accepts everything.

DATA SOURCE
{{data_source_description}}

VALIDATION RULES
{{validation_rules}}

FAILURE POLICY
{{failure_policy}}

REQUIREMENTS
1. Define the expected schema explicitly — a Pydantic model if records are processed one at a time, or a pandera DataFrameSchema if this is a bulk DataFrame pipeline. Don't validate ad hoc with scattered if checks; one schema is the single source of truth for what "valid" means.
2. Validate every record or row against the schema and classify each as valid, or invalid with the specific rule or rules it broke — not just "invalid." A record failing three rules should report all three, not just the first one that failed.
3. Apply {{failure_policy}} precisely: if it says quarantine bad records and continue, invalid rows go to a separate output (a rejects table or file with the original data plus the reason) and valid rows proceed — the pipeline does not fail the whole batch for a few bad rows. If it says fail the batch above a threshold, implement that threshold explicitly rather than an arbitrary cutoff you invented.
4. Log a run summary: total records, valid count, invalid count broken down by which rule failed most often — this is what tells a human whether a new failure pattern just appeared upstream.
5. Never let a validation failure raise an unhandled exception that kills the whole pipeline run unless {{failure_policy}} explicitly says that should happen for that condition.

OUTPUT FORMAT
1. The schema definition.
2. The validation and routing function (valid versus quarantined).
3. The run summary logger.
4. One worked example: a batch with a mix of valid and invalid records, showing what gets quarantined and why.`,
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
    ],
    targetTools: [
      'ChatGPT (GPT-5.1)',
      'Claude (Sonnet 4.6)',
      'Claude Code',
      'GitHub Copilot Chat',
    ],
    tags: ['data-validation', 'pandera', 'pydantic', 'data-pipeline', 'python'],
    whyItWorks:
      'Making "quarantine and continue" versus "fail the batch above a threshold" an explicit, named decision operationalizes a choice that\'s usually left implicit in a bare "add validation" request, and defaults to whichever is easiest to write — which in practice means crashing on the first bad row. Requiring one schema, named specifically to the record-shape (Pydantic for one-at-a-time, pandera for a DataFrame), as the single source of truth prevents validation logic from drifting across scattered ad hoc if-checks added at different times by different people, each with a slightly different idea of what "valid" means. Requiring every broken rule per record, not just the first, matters operationally: someone fixing an upstream data issue needs the full list of what a record violated, not whichever check happened to run first and short-circuit the rest. The rule-by-rule summary logging is what actually surfaces a new upstream failure pattern — a spike in one specific rule failing is a signal worth acting on, where a bare "142 rows rejected" count is not actionable at all.',
    exampleOutput: `class CustomerRecord(BaseModel):
    email: EmailStr
    signup_date: date
    country: str = Field(pattern=r"^[A-Z]{2}$")

    @field_validator("signup_date")
    @classmethod
    def not_in_future(cls, v: date) -> date:
        if v > date.today():
            raise ValueError("signup_date is in the future")
        return v

Run summary: 50,000 records — 48,910 valid, 1,090 invalid (612 invalid country code, 401 malformed email, 77 future signup_date). Batch proceeds: 1,090/50,000 = 2.2%, below the 10% abort threshold.
Quarantined example: {"email": "not-an-email", "country": "USA"} -> rejected for both "malformed email" and "country must be 2-letter ISO code," written to rejects.csv with both reasons attached.`,
    verifiedAgainst: [
      { tool: 'ChatGPT', version: 'GPT-5.1', date: '2026-07-17' },
      { tool: 'Claude', version: 'Sonnet 4.6', date: '2026-07-18' },
    ],
    changelog: [
      {
        date: '2026-07-18',
        note: 'Initial publish, verified against ChatGPT (GPT-5.1) and Claude (Sonnet 4.6) using pandera 0.20 and Pydantic 2.9.',
      },
    ],
  },
  {
    slug: 'python-idiomaticity-review',
    category: 'python',
    title: 'Get Python code reviewed for idiomaticity, not just correctness',
    description:
      'A review prompt that separates "is this correct" from "is this how an experienced Python developer would write it," with a closed set of idiom categories so the review surfaces real foot-guns instead of restating the code.',
    promptText: `Review this code for idiomaticity — assume it already works. Your job is to say where it doesn't read like Python an experienced developer would write, and why the idiomatic version is actually better, not just different.

CODE
{{target_code}}

TARGET PYTHON VERSION
{{python_version}} — flag anything that's idiomatic for an older version but has a cleaner equivalent available now (e.g. pre-3.10 code that could use structural pattern matching, or manual dict-default handling that could use dict.setdefault, defaultdict, or the walrus operator where it genuinely improves clarity rather than just being clever).

STYLE GUIDE
{{style_guide}}

REVIEW CATEGORIES
1. Pythonic idioms — list, dict, or set comprehensions where a manual loop is just building a collection; enumerate or zip instead of manual indexing; context managers for anything with cleanup; pathlib.Path instead of os.path string joining.
2. Truthiness and comparisons — "if not x" versus "if x is None" used correctly, since they are not interchangeable for empty collections versus None; "is" and "is not" for None and singleton checks; never "== None".
3. Mutability bugs — mutable default arguments, accidental aliasing, modifying a list while iterating over it.
4. Error handling style — specific exception types over a bare except with no type, using exceptions for genuinely exceptional cases rather than control flow, not catching and re-raising without adding information.
5. Naming and structure — does a function do one thing; is a "utils" grab-bag hiding what should be several named functions.

OUTPUT FORMAT
For each finding: category, the line or snippet, what's non-idiomatic about it, the idiomatic rewrite, and one sentence on why it's actually better, not just shorter. If a "clever" one-liner would be less readable than the original, say so explicitly and leave it — idiomatic doesn't mean maximally compact.
End with a verdict: how many findings per category, and whether the code is idiomatic enough to ship as-is or needs the listed changes first.`,
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
    ],
    targetTools: [
      'Claude Code',
      'ChatGPT (GPT-5.1)',
      'GitHub Copilot Chat',
      'Cursor 2.1',
    ],
    tags: ['code-review', 'idiomatic-python', 'pep-8', 'best-practices', 'python'],
    whyItWorks:
      'Separating "is this correct" from "is this idiomatic" as an explicit framing keeps the review from defaulting to the most common failure mode of an open-ended "review this" prompt — restating the code\'s logic back to the requester instead of judging its style. The closed category list forces coverage of specific, well-documented Python foot-guns that a generic review reliably misses, most notably the mutable default argument bug, where a function like def get_config(name, cache={}) shares one cache dict across every call that doesn\'t pass one explicitly, because default argument values are evaluated exactly once at function-definition time, not per call. Requiring "why it\'s actually better, not just shorter" as a mandatory field directly counters a real failure mode of AI-suggested Python rewrites: compressing readable code into a dense one-liner that a human reviewer would reasonably reject in a real pull request for being harder to follow, not more idiomatic. The explicit permission to leave a comparison unchanged when a compact rewrite would hurt readability stops the review from treating brevity as a proxy for good style.',
    exampleOutput: `Finding 1 [Mutability bugs]: cache={} as a default argument — this dict is created once at function definition and shared across every call that doesn't explicitly pass a cache, so entries silently accumulate across unrelated calls. Rewrite: use cache: dict | None = None, then cache = cache if cache is not None else {} inside the function. This is actually better, not just different, because it removes state that persists between calls without any caller asking for it — a real, reproducible bug source, not a style preference.
Finding 2 [Truthiness and comparisons]: cache.get(name) == None — should be cache.get(name) is None, since None is a singleton and == can be overridden by a class's __eq__, making "is" both the correct and the faster check.
Verdict: 2 findings (1 mutability, 1 comparison). Needs the mutable-default fix before shipping; the comparison fix is minor but should be bundled in.`,
    verifiedAgainst: [
      { tool: 'Claude Code', version: 'Sonnet 4.6', date: '2026-07-27' },
      { tool: 'GitHub Copilot Chat', version: '1.260 (VS Code)', date: '2026-07-28' },
    ],
    changelog: [
      {
        date: '2026-07-28',
        note: 'Initial publish, verified against Claude Code (Sonnet 4.6) and GitHub Copilot Chat.',
      },
    ],
  },
]
