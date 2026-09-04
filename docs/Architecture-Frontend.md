# Frontend Architecture

The frontend is SolidJS, TypeScript and Tailwind built by Vite under `src/`. Its structure is based
on product features and explicit dependency direction.

## Source tree

```text
src/
|- app/                 boot, routes, global wiring and shell components
|- assets/              static data shipped as files
|- config/              timing, limit and layout tuning values
|- features/
|  |- anime/
|  |- command-palette/
|  |- connectivity/
|  |- discover/
|  |- downloads/
|  |- library/
|  |- player/
|  |- profile/
|  |- settings/
|  |- stats/
|  `- watch/
|     |- ui/
|     |- io/
|     |- model/
|     `- tests/
`- shared/             named cross-feature capabilities
```

Files do not sit loose in a feature root. Each module must reveal whether it renders, performs IO,
models a decision or tests behaviour.

## Feature layers

### `ui/`

Solid components, JSX composition and rendering-specific behaviour. UI calls named operations from
its feature's `io/` layer and consumes model types. It never imports `invoke` or the backend API
directly. Component files use PascalCase and match the symbol they render.

### `io/`

Effectful feature orchestration: Solid resources, persistence, shared API calls, timers, media and
platform lifecycles. Factory names start with an action that describes ownership, normally
`create...` or `install...`. IO never imports UI.

### `model/`

Pure policy and transformations. Model code can be tested without a browser, backend, clock or
network. It does not import feature IO, rendering, process-wide state or effectful shared packages.

### `tests/`

Tests are colocated with the feature they protect. Pure model tests and rendered interaction tests
live together because both describe the same product capability.

## Shared capabilities

`src/shared` contains code with more than one real feature consumer. A folder names the capability,
not an implementation layer.

| Package | Contract |
|---|---|
| `anime` | Cross-feature anime card, episode and cache-key concepts |
| `cache` | Stale-while-revalidate resources and the cache they read |
| `catalog` | Catalogue warmup, refresh and the detail prefetch |
| `colour` | Colour parsing and derivation |
| `easter-egg` | The one hidden branch, kept where it can be found again |
| `errors` | Frontend error normalisation and reporting |
| `formatting` | Generic display formatting |
| `i18n` | Translation runtime, locale types and dictionaries |
| `images` | Cached image URLs, loading and prefetch |
| `ipc` | Typed Tauri command wrappers, the only frontend home of `invoke` |
| `keyboard` | Shortcut parsing and keyboard coordination |
| `logging` | Scoped diagnostics, and webview failures forwarded to the application log |
| `media` | Shared media element and HLS behaviour |
| `network` | Reachability and latency state |
| `notifications` | Application notification state |
| `platform` | Frontend adapters for native integrations |
| `preferences` | Persisted preferences and active-profile state |
| `providers` | The provider registry the interface reads labels from |
| `reactive` | Small framework-level reactive utilities |
| `track` | Playback language and dub or sub policy |
| `ui` | Reusable visual primitives grouped by role |

Code is promoted to shared only after multiple features need the same contract. Sharing code merely
because two implementations look similar creates coupling and is not a reason to move it here.

## Application shell

`src/app/shell` holds layout that composes the whole application: sidebar, title bar, route error,
offline gate and startup overlays. The app layer may import features. No feature and no shared
package may import back into app.

## Configuration and assets

`src/config/timing.ts`, `limits.ts` and `layout.ts` own adjustable technical constants. Each
value is named and documented with the reason for its size. Domain ids, locale keys and CSS classes
stay with their owner. Only values that are genuinely tuned belong in config.

Large static datasets are assets rather than TypeScript modules. World-country geometry is stored
in `src/assets/geo/world-countries.json` and validated by a schema-oriented test, which keeps generated
data out of the code and coverage reports.

## Solid reactivity

Components execute once and establish reactive computations. Do not flatten a reactive prop into a
plain value:

```ts
const language = props.language        // captured once
const language = () => props.language  // remains reactive
```

The same applies to destructuring props. Preserve accessors until the value is actually consumed.
Effects own cleanup for every listener, interval, media handler and process-wide subscription they
install.

## Naming

- Folders use kebab-case for multiword feature and capability names.
- Components use PascalCase: `EpisodeTimeline.tsx`.
- Other TypeScript files use camelCase: `episodePaging.ts`.
- Factories name lifecycle: `createWatchPlaybackLifecycle.ts`.
- A filename does not repeat its containing feature: `player/model/state.ts`, not
  `player/model/playerState.ts`.
- Avoid structural names such as `helpers`, `utils`, `service`, `controller` or `component`.

Architecture, naming, file headers and documentation are enforced by
`eslint.config.js` and the repository-specific checks imported into Sonar. Run
`npm run sonar:checks` to generate their issue report locally.
