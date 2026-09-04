# Testing

Different kinds of failure are kept apart, so a red suite tells you where to look before you read
a single line of output.

## Pick a suite

```bash
npm test
```

On its own that prints a menu:

```
Which tests should run?

  1  frontend   Frontend only, Vitest
  2  rust       Rust only, cargo test
  3  system     System workflows, real temporary SQLite
  4  network    Network only, the smoke suite plus every provider probe
  5  all        All tests, including UI, system, network and coverage
```

Every entry answers to its name or its number, so `npm test rust` and `npm test 2` do the same
thing. Four more suites sit off the menu and are reachable by name only, because each is a slice
of one that is on it: `ui`, `coverage`, `smoke` and `live`.

Piped or in CI, where there is no terminal to prompt, a bare `npm test` runs the frontend suite.

## The suites

| Suite | Command | Engine | Leaves the machine | Proves |
|---|---|---|---|---|
| Frontend | `npm run test:frontend` | Vitest | no | Pure rules, component contracts, and real click, input, focus and keyboard handling in jsdom |
| UI | `npm run test:ui` | Vitest | no | The interaction subset of the above, nothing else |
| Coverage | `npm run test:coverage` | Vitest | no | The frontend suite with an instrumented run and a report |
| Rust | `npm run test:rust` | cargo | no | Parsing, matching, shaping and service logic |
| System | `npm run test:system` | cargo | no | Several backend services together against a real temporary SQLite file, including a close and reopen cycle |
| Smoke | `npm test smoke` | cargo | yes | The catalogue, metadata and provider pipelines end to end |
| Live | `npm test live` | cargo | yes | One probe per provider against the real site |
| Network | `npm run test:network` | cargo | yes | Smoke and live together |
| Tooling | `npm run test:tooling` | node:test | no | That these scripts keep the contracts the other suites rely on |
| Everything | `npm test all` | all three | yes | Every layer, one pass per engine |

`npm test all` is deliberately three passes and not ten. Vitest runs once with coverage on, cargo
runs once with `--include-ignored` and `ANISPHERE_SMOKE=1` so the offline, system, smoke and live
layers all come out of the same compilation, and node:test runs the tooling contracts. Running
the suites separately would compile the same code four times.

## Filtering

Both engines take a name filter, and both understand a substring.

```bash
npx vitest run nearestTrack           # one frontend file
npx vitest run -t "falls through"     # one test, by name
cargo test --manifest-path src-tauri/Cargo.toml --lib title_matching
```

`npm run test:ui` is a filter and nothing more. Interaction tests name their `describe` block
`Interactions`, and that word is the whole selector.

Anything after a bare `--` reaches the test binary rather than cargo, which is where the harness
flags live:

```bash
# show output from passing tests too, instead of only failing ones
cargo test --manifest-path src-tauri/Cargo.toml --lib -- --nocapture

# one thread, so interleaved output stays readable
cargo test --manifest-path src-tauri/Cargo.toml --lib -- --test-threads=1

# the ignored tests, and only those
cargo test --manifest-path src-tauri/Cargo.toml --lib -- --ignored
```

## What the network suite is

Two groups, gated differently because they fail differently.

**The smoke suite** is gated behind the `ANISPHERE_SMOKE` environment variable rather than
`#[ignore]`, so it needs a name filter to select. It walks the catalogue, metadata and provider
pipelines end to end.

**The provider probes** are marked `#[ignore]` and sit beside the tests for the module each one
exercises. A probe for AniDB parsing belongs next to the AniDB parsing tests rather than in a
distant file of its own.

A failure in either group means an upstream service changed or went down. That is a signal to go
look, not a broken build, which is why CI runs them with `continue-on-error`.

Some probes skip themselves rather than fail. A site that answers `429 Too Many Requests` is
throttling everyone pointed at it, and its answer says nothing about this code, so the probe
prints a `[live] skipped` line and returns. The runner counts those separately and lists them
under the results.

A few probes read their target from the environment, so you can point one at whatever you are
actually debugging:

```bash
ANISPHERE_ANINEKO_HANDLE=naruto ANISPHERE_ANINEKO_EP=2 npm test live
```

## Where tests live

**Rust tests live in `src-tauri/src/tests/`**, mirroring the module tree, attached to their module
with `#[cfg(test)] #[path = "..."] mod tests;`. Keeping them out of the production file keeps that
file about the thing it does.

**Frontend tests live in a `tests/` folder inside the feature they cover**, so
`src/features/watch/tests/trackFallback.test.tsx` sits with the code it is about. Vitest is for
executable product behaviour. Repository-wide architecture, locale, documentation and asset
contracts are [Sonar project checks](#sonar-project-checks), not test files.

## Writing tests

**Name the behaviour, not the function.** `a_lagging_dub_is_not_padded_with_episodes_that_have_none`
tells you what broke. `test_episodes` does not.

**Assert something.** A test that only prints is a debugging scratchpad and does not belong in
the suite.

**Keep parsing pure and test it against fixtures.** Saved HTML or JSON in, structured data out.
When a site changes its markup that is a failing parser test rather than an afternoon of guessing.

**Put anything that touches the network behind a gate.** `#[ignore]` for a probe,
`ANISPHERE_SMOKE` for a pipeline. The offline suites have to stay runnable on a plane.

## The two gates

```bash
npm run verify
```

The frontend and Rust suites in parallel, nothing else. This is what runs in front of
`npm run tauri:dev`, and there it runs with `--changed` so only the side you edited goes. A side
is recorded as green only after it has actually passed, so a red suite is never skipped.

```bash
npm run ci:local
```

The full deterministic gate: tooling contracts, TypeScript, Prettier, ESLint at zero warnings,
Knip, the frontend suite, the frontend build, `cargo fmt --check`, the offline Rust suite, and
Clippy at `-D warnings`.

Sonar analysis is separate because it needs a running server and a token. The frontend and backend
have independent 80% and 60% gates; [SonarQube](SonarQube) documents the local workflow.

## Sonar project checks

```bash
npm run sonar:checks
```

This runs repository-specific static contracts from
`scripts/sonar/project-checks.mjs`: dependency direction and cycles, source and test layout,
Tauri command boundaries, matching error codes, file documentation and naming, locale parity and
placeholders, localized interface copy, safe resource reads, adaptive classes and static assets.

The command writes `.tool/sonar/external-issues-frontend.json` and
`.tool/sonar/external-issues-backend.json`. It does not pretend those findings are executable
tests; `npm run sonar` imports them beside Sonar's own JavaScript, TypeScript, Rust and Clippy
findings.

## Reading the output

All three engines print the same block, so the shape does not change when you switch suites:

```
 Test Files  67 passed (67)
      Tests  335 passed (335)
   Start at  02:34:56
   Duration  67.82s (build 27.70s, tests 40.12s)
```

For cargo, `build` and `tests` are split out because cargo times only the test phase. A long
build with a short test time means you changed something that forced a recompile, not that the
suite got slower.

## Coverage

```bash
npm run test:coverage:frontend
npm run test:coverage:rust
```

These write `coverage/lcov.info` and `coverage/rust-lcov.info`. Vitest and cargo-llvm-cov only
measure; Sonar enforces 80% for the frontend and 60% for the backend. `npm run sonar` rebuilds both
reports automatically. See [Coverage](/coverage) and [SonarQube](SonarQube).
