# SonarQube

AniSphere keeps its Sonar configuration in the application repository so a local SonarQube and
the hosted pipeline evaluate the same sources, project rules and quality gate. Docker runs the
local server and scanner; Node generates coverage and the repository-specific findings.

## Start the local server

Install Docker Desktop or another Docker Compose installation, prepare the checkout as described
under [Development Setup](Development-Setup), then run:

```bash
npm run sonar:up
```

The first start downloads SonarQube Community and takes a few minutes. Open
`http://localhost:9000` and wait until the server is ready. Generate tokens under **My Account,
Security**. Keep tokens in the shell environment only; they do not belong in `.env`, a command
committed to source control, or this documentation.

On PowerShell, set a token for the current terminal like this:

```powershell
$env:SONAR_TOKEN = 'your-token'
```

On macOS and Linux:

```bash
export SONAR_TOKEN='your-token'
```

Stop the containers with `npm run sonar:down`. The named Docker volumes keep findings and server
configuration for the next start.

## Prepare a fresh instance

Quality profiles, projects and gates live in SonarQube's database. With an administrator token in
`SONAR_TOKEN`, bootstrap a fresh server once:

```bash
npm run sonar:provision
npm run sonar
```

`sonar:provision` creates or updates `anisphere-frontend` and `anisphere-backend`, their separate
quality gates and the committed JavaScript and TypeScript profiles. It defines new code as the last
30 days and is idempotent, so run it again whenever `scripts/sonar/config/` changes.

The provisioning token needs permission to administer quality profiles, quality gates and the
project. Routine analysis can use a narrower token with **Execute Analysis** permission.

## Run an analysis

Install `cargo-llvm-cov` once with `cargo install cargo-llvm-cov --locked`, then run:

```bash
npm run sonar
```

The command always rebuilds its inputs before it scans, so stale reports cannot be uploaded:

1. It runs `test:coverage:frontend` and `test:coverage:rust`, then normalizes Rust LCOV paths.
2. It writes separate frontend and backend project-check reports and asks Clippy for JSON findings.
3. It scans `.github/sonar-project.properties` and `.github/sonar-backend.properties`, waiting for
   both quality gates.

Open `http://localhost:9000/dashboard?id=anisphere-frontend` and
`http://localhost:9000/dashboard?id=anisphere-backend` for the results. Running only
`npm run sonar:checks` is useful while editing a project rule, but it merely writes
`.tool/sonar/external-issues-frontend.json` and `.tool/sonar/external-issues-backend.json`; the
scanners import them. `.tool/` contains generated local reports only; all executable project and
pipeline helpers are versioned under `scripts/`.

## Project-specific checks

The project checks cover contracts that a general-purpose analyzer cannot infer:

- import cycles, feature boundaries, source roots, test placement and Tauri command boundaries
- one shared Rust clock and the bounded AniList query and metadata-cache policy
- matching frontend and backend error codes
- file headers, public documentation, naming, comment style and configuration boundaries
- localized copy, locale parity, encoding and placeholders
- settled resource reads, adaptive CSS classes and static asset structure

They are static analysis, not executable behaviour, so they do not live in Vitest or inflate test
counts and coverage. Findings appear in Sonar with their own rule ids under the
`anisphere-project` engine.

## Quality gate

Both gates require no new issues, A security and reliability ratings, at most 3% duplicated lines
on new code and all new security hotspots reviewed. Coverage stays separate so one half cannot hide
the other:

| Project | Overall coverage | New-code coverage |
|---|---:|---:|
| `anisphere-frontend` | at least 80% | at least 80% |
| `anisphere-backend` | at least 60% | at least 60% |

Vitest and `cargo llvm-cov` deliberately have no numeric threshold. They write the LCOV inputs;
Sonar owns the two gates.

## Hosted pipeline

The `sonar-frontend` and `sonar-backend` jobs in `.github/workflows/quality.yml` become active when
the repository defines `SONAR_ORGANIZATION` and the matching project-key variables. `SONAR_TOKEN`
is an Actions secret. Each job generates its own coverage and external-issue report before uploading
to SonarCloud; the backend job also imports Clippy.

Never put the token value in workflow YAML or a committed environment file.
