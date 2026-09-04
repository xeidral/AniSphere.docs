# Provider System

A provider is one streaming site. Each lives in its own folder under `src-tauri/src/providers/`,
implements one trait, and is declared once in `src-tauri/src/providers/mod.rs`. That registry is the
only place a provider is named. Failover, health probing, the connectivity board and the debug
selector all derive from it, so adding a source means writing the module and adding its entry.

## The contract

`src-tauri/src/providers/contract.rs` defines what every provider must answer:

| Method | Answers |
|---|---|
| `search` | Titles matching a query, each with an opaque handle |
| `episodes` | Which episodes exist for a handle and a track |
| `episode_sources` | Playable stream links for one episode |
| `episode_titles_en` | Per-episode titles, when the site publishes them |

A handle is the provider's own identifier, usually a slug. It is opaque on purpose. Nothing outside
the provider may parse it, because its shape is that site's business and changes without warning.

Some sites address a title by its AniList id instead of a slug of their own. Those set
`handle_is_anilist_id`, and the pool hands them the id directly rather than searching for a title
they may not list under the name the catalogue knows.

`ProviderMetadata` carries the stable identity: the persisted id, the display name, which tracks it
serves, whether one handle covers every season of a franchise, and where it sits on the connectivity
map.

## Tracks

A track is a language and dub combination: `sub`, `dub`, `raw`, `ger-sub`, `ger-dub`. A provider
declares which it serves, and the pool only asks it for those.

When the track you asked for has nothing, the app moves along a chain, and the chain gives up the
**language** before it gives up the **audio kind**. Someone who asked for a dub asked to hear the
show rather than read it, so a missing German dub is answered with an English dub, and subtitles
only come up once no dub exists at all: `ger-dub` to `dub` to `ger-sub` to `sub`. A preference in
English stays in English and never crosses into German, because someone watching in English would
rather read English subtitles than hear a German dub.

## The pool

`src-tauri/src/provider_pool/` sits between the application and the providers.

**Title matching.** The catalogue thinks in AniList ids, providers think in slugs. Matching bridges
the two, and it is the hardest part. A per-season AniList entry often maps onto one multi-season
provider slug: "Solo Leveling Season 2" becomes `solo-leveling` plus `staffel-2`, which is done by
detecting the season ordinal and stripping the suffix. See `title_matching.rs`.

**Failover.** Every eligible provider is asked at the same time, for the episode list and for the
stream links alike, and the first usable answer wins. They used to be asked in turn, which meant a
series nobody had a stored handle for paid a whole search per provider before the next one was even
started, and that was most of the wait before a first play began. Registry order still decides ties.
A refusal is not the same as an absence, and the difference matters: a provider that has no episode
nine is skipped, a provider that is blocking us is removed from rotation.

**The circuit breaker.** Repeated failures take a provider out for a while rather than retrying it
on every request. `PROVIDER_BLOCKED` short-circuits that immediately.

**Caching.** A resolved handle is remembered, and so is a negative result, for a shorter time. That
second part surprises people: if a German dub has just appeared, the app may not notice for half an
hour.

## Health

Every provider declares a `HealthProbe`, either resolving a known handle directly or searching for a
known title first. The connectivity board runs those live from your own machine, which is why it
shows what is actually reachable for you rather than what a status page claims.

## Adding a provider

1. Create `src-tauri/src/providers/<name>/` with `mod.rs` and a `parsing.rs`.
2. Keep parsing pure. Give it HTML or JSON in and structured data out, with no network calls. That
   is what makes it testable without touching the site.
3. Implement the `Provider` trait in `mod.rs`.
4. Declare it in `src-tauri/src/providers/mod.rs` with its metadata block.
5. Add tests under `src-tauri/src/tests/providers/`, offline ones against saved fixtures and an
   `#[ignore]` probe for the live path. See [Testing](Testing).

Nothing else needs touching. If you find yourself editing the pool to special-case your provider,
the contract is probably wrong and worth fixing instead.

## Things that will bite you

- **AniList's episode count is not permission to play.** The provider's list is the truth.
- **Sites change their markup without notice.** That is why parsing is separate and covered by
  fixtures, so a break is a failing test rather than a mystery.
- **Some sites gate on TLS fingerprint**, not just headers, so the HTTP client matters as much as
  the request.
- **Provider ids are persisted.** Changing one orphans every stored mapping.
