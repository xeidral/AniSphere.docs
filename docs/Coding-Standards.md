# Coding Standards

Formatting is automated: Prettier for TypeScript, `rustfmt` for Rust, ESLint at zero warnings and
Clippy with warnings denied. `npm run ci:local` is the deterministic local gate; the
[SonarQube](SonarQube) analysis adds repository project checks, security and reliability rules,
and the 80% coverage conditions.

## Documentation

Every TypeScript and TSX file starts with a JSDoc block containing `@fileoverview`. It explains the
module's purpose and boundary, not its filename. Important exported functions and types carry JSDoc
at the declaration.

Every Rust file starts with inner module documentation (`//!`). Crate-public items carry `///`
Rustdoc. Public documentation describes the contract a caller can rely on. An implementation
comment records a non-obvious reason or an invariant, and nothing else.

Comments do not narrate syntax, address a person, or describe the change that produced the code.
They describe the code as it is. Longer architectural reasoning belongs on these pages.

## Names

- Use PascalCase for TSX component files and camelCase for TypeScript modules.
- Use snake_case for Rust modules and functions, and PascalCase for Rust types.
- Folders use kebab-case when a capability needs more than one word.
- Name factories after ownership and lifecycle: `create...` or `install...`.
- Do not repeat the feature name already present in the path.
- Avoid structural filler such as `helpers`, `utils`, `service`, `controller`, `component`,
  `manager` or `misc`. Name the capability or decision instead.
- Avoid abbreviations unless the protocol itself owns the abbreviation.
- Single letters are reserved for genuine coordinates and the conventional i18n `t` function.

## Structure

Frontend feature code uses `ui/io/model/tests`. Shared frontend code uses named capability
packages. Backend modules follow the subsystem map in [Backend Architecture](Architecture-Backend).

One file owns one coherent subject. File size is a signal, not a rule: split when rendering,
orchestration and policy are mixed, or when a section has a useful independent name and contract.
Do not split a cohesive algorithm merely to satisfy a line count.

Keep parsing and policy pure. IO gathers input and applies output, model code decides. A component
renders state and invokes named operations rather than embedding persistence or transport details.

## Imports and dependencies

- Use the `@/` alias for cross-package frontend imports and relative imports inside a tight local
  implementation only when clearer.
- UI never calls Tauri directly. `src/shared/ipc` is the frontend boundary to the backend.
- Feature model code does not import IO, UI, global state, media or network packages.
- Shared code never imports a feature. App composes features, and nothing points back at app.
- `src/config` imports nothing.
- No new barrel file is added merely to shorten imports. A barrel represents an intentional public
  package surface.

## Tests

Tests live with the capability they describe: `src/features/*/tests`, shared package `tests/`
folders, and `src-tauri/src/tests`. Repository-wide architecture, documentation, locale and asset
contracts live in `scripts/sonar/project-checks.mjs` and are imported as Sonar issues.

Prefer testing a public decision or interaction over private implementation details. Mock at the
IO boundary, not halfway through pure logic. Network smoke tests are explicitly opt-in.

## Compatibility contracts

These are changed only with an explicit migration or product decision:

- Command and event names and payloads
- Persisted schema, settings keys and avatar seeds
- Provider ids and ordering
- Routes and deep links
- Cleanup on profile switch and shutdown

Database migrations are additive. User data is not destroyed or recreated as a shortcut.

## Interface copy

Both locales carry the same keys. User-facing copy carries no em dashes. Use a comma or a full stop.
