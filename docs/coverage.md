# Coverage

Coverage is generated in the application checkout and evaluated by Sonar. Run:

```bash
npm run test:coverage:frontend
npm run test:coverage:rust
```

The frontend command prints a summary, writes a browsable report to `coverage/index.html` and
writes `coverage/lcov.info`. The Rust command runs the library suite through `cargo llvm-cov` and
writes `coverage/rust-lcov.info`. `npm run sonar` regenerates both reports before every scan. The
documentation build does not generate or publish a fresh application report of its own.

## What is measured

| Suite | Runner | What it covers |
|---|---|---|
| Frontend | Vitest with the V8 provider | Product TypeScript and TSX under `src/` |
| Rust | `cargo llvm-cov --lib` | Product Rust under `src-tauri/src/`; ignored live probes stay outside the deterministic report |
| Project scripts and Sonar tooling | Excluded | Commands are analyzed for quality but are not browser application code |
| Locales, declarations, tests and `src/app/main.tsx` | Excluded | Static tables, harness code and the application entry point do not describe executable product branches |

Install the report tool once with `cargo install cargo-llvm-cov --locked`. Windows paths are remapped
by the committed command so the Linux scanner container resolves them to the same Rust sources.

## Reading it

A file with no coverage is not automatically a problem, and a file with full coverage is not
automatically correct. The report is most useful for finding untested decisions and error paths.

Vitest and cargo-llvm-cov do not reject a percentage themselves. The frontend Sonar gate requires
80% coverage; the backend gate requires 60% coverage of deterministic domain logic. Tauri, OS,
external-process and live-provider adapters stay statically analyzed but are excluded from the
offline backend coverage denominator. See [SonarQube](SonarQube) for the exact workflow.

Architecture, documentation, locale and asset invariants are not measured as executable tests.
They are project-specific Sonar issues, described under
[Architecture boundaries](/Architecture-Boundaries) and [Testing](/Testing).
