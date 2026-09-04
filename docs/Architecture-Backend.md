# Backend Architecture

Rust under `src-tauri/src/` owns persistence, remote access, media transport, downloads and native
behaviour. The frontend reaches it only through typed Tauri commands.

## Module map

### `app/`

Builds the Tauri application, registers state and commands, and owns tray and window lifecycle.
`ipc.rs` is the complete command registration surface. Registration tests keep command declarations
and the handler in sync.

### `commands/`

The IPC boundary, grouped by subject. Commands validate and normalise input, delegate to backend
subsystems and return serializable results. Reusable policy and parsing do not live here because
they must remain testable without a Tauri runtime.

### `catalog/`

Imports the manami title database, which is the whole local catalogue and the only thing fetched
in bulk. Everything AniList adds is fetched for the titles on a screen: `catalog/rankings.rs` asks
for the four home orderings in one request and stores them, and `catalog/metadata/on_demand.rs`
fills the cache for the titles a page is holding. `catalog/metadata/transport.rs` owns pacing and
priority, so every caller in the process shares one request budget, and it reads what AniList states
is left of it. Kitsu supplies a smaller metadata result when AniList is unavailable.

`catalog/skip_times.rs` imports the published AniSkip database as one file, the way the catalogue is
imported. `catalog/seasons.rs` walks a franchise and keeps the answer, serving the stored one while
a day-old walk is repeated behind the reader.

### `database/`

SQLite schema, migrations, persisted types and query families. `database/discovery/` separates
anime, artwork, featured, ranking and studio reads. Migrations are additive and columns exist before
indexes that depend on them are created.

### `providers/` and `provider_pool/`

Each provider adapter implements the common contract. Parsing remains separate and pure. The pool
owns title and handle resolution, episode and source selection, health, circuit breaking, stream
length validation and failover. See [Provider System](Provider-System).

### `server/`

The loopback server exposes controlled routes for remote images, local files and proxied media.
Media playlists are rewritten so their segments remain reachable under the WebView content policy;
range requests preserve seeking. Image fetching accepts HTTPS and rejects private targets.

### `downloads/`

`queue.rs` schedules jobs, `transfer/` handles direct and HLS bytes, `ffmpeg.rs` assembles media,
and `offline/` stores the snapshot that keeps downloaded titles browsable without a connection.

### `integrations/`

AniList account and sync behaviour, Discord Rich Presence, translated descriptions, AniSkip data and
list imports. AniList tokens use the operating-system credential store, with a compatible settings
fallback on systems that provide no secret store.

### `platform/`

Target-specific modules expose one surface for Windows, Linux and unsupported targets. Unsafe code
is confined to the documented Windows system calls that require it.

## Error and boundary rules

- Fallible application work returns `AppResult<T>` and a stable `AppError` code.
- Data crossing IPC derives the required Serde traits.
- Remote payload parsing is pure and fixture-testable.
- Provider ids, command names, event names and stored keys are compatibility contracts.
- Network requests use shared client identity and explicit timeouts.
- Tokens and secrets are never written to logs.

## Documentation and tests

Every Rust source begins with an inner `//!` comment explaining the module boundary. Every
crate-public function, type, constant and static has `///` documentation. A frontend Vitest guard
checks this property because it can inspect the complete Rust tree quickly; `cargo check`,
`cargo fmt --check` and Clippy then validate Rust itself.

Deterministic tests mirror backend subsystems under `src-tauri/src/tests/`. Tests that contact real
providers or metadata services are opt-in smoke tests and are not part of the ordinary deterministic
suite.
