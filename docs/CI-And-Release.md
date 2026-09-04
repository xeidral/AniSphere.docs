# CI and Release

Two workflows are committed: one for continuous quality analysis and one for signed releases.

## Quality

`.github/workflows/quality.yml` runs on pushes and pull requests whose changes are not limited to
Markdown or the licence.

| Job | Runs on | Does |
|---|---|---|
| `frontend` | Linux | Prettier, TypeScript, ESLint at zero warnings and Knip |
| `rust` | Linux, only when `src-tauri` or the workflow changed | `cargo fmt --check` and Clippy at `-D warnings` |
| `sonar-frontend` | Linux, when the frontend Sonar variables exist | Frontend coverage, frontend project checks and the 80% Sonar gate |
| `sonar-backend` | Linux, when the backend Sonar variables exist | Rust coverage, backend project checks, Clippy and the 60% Sonar gate |

The Sonar jobs are inert in forks and before `SONAR_ORGANIZATION` and their project keys have been
configured. Their token is the `SONAR_TOKEN` Actions secret. The scanners read separate LCOV and
external-issue reports, so frontend and backend cannot hide each other's missing coverage. See
[SonarQube](SonarQube) for the local equivalent.

The workflow does not replace the full executable test gate. Run `npm run ci:local` before a pull
request; [Testing](Testing) lists the focused and network suites.

## Release

`.github/workflows/release.yml`, triggered by hand with a tag.

**check** runs before any secret is in scope. It verifies the actor is allowed to release, that the
tag matches `package.json`, `Cargo.toml` and `tauri.conf.json`, and that the tag does not already
exist. The three-way version check matters: the bundler reads `tauri.conf.json`, so a mismatch there
ships installers whose version disagrees with the tag and breaks the updater comparison.

**build** runs on Linux, Windows and macOS with the signing key in scope, produces installers for
all three, and fails if no `.sig` was produced, because an unsigned build cannot be updated into.

Linux produces a `.deb`, an `.AppImage` and an `.rpm`. The AppImage build removes the complete
system WebKit dependency closure before repacking, logs its size before and after, and keeps the
original until the replacement succeeds.

**publish** collects every artifact, refuses if two platforms produced the same filename, generates
`latest.json` for the updater, and creates the release as a draft unless you asked for it to be
published.

## Cutting a release

1. Bump the version in `package.json`, `src-tauri/Cargo.toml` and `src-tauri/tauri.conf.json`.
2. Regenerate `Cargo.lock` with `cargo check`.
3. Update the changelog.
4. Run `npm run ci:local`, merge to `main` and wait for Quality.
5. Run the Release workflow with the tag, for example `v2.0.0`.
6. Review the draft and publish it.

Build locally first and check it by hand. A green pipeline proves it compiles, not that it works.

## Updates

The updater endpoint serves `latest.json` and the assets. Every download is checked against a public
key compiled into the build, so a tampered artifact is refused rather than installed. The repository
holding the update assets must stay public and hold nothing but those assets.
