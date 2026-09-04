# Providers Reference

One page per fact about every source AniSphere can play from. [Provider
System](Provider-System) explains the machinery. This page is the data.

Everything here is read off `src-tauri/src/providers/registry.rs`, which is the
single registration point. Its order **is** the playback failover order.

---

## The pool, in the order it is tried

| # | Id | Name | Tracks | Handle | Code |
|---|---|---|---|---|---|
| 1 | `anikoto` | Anikoto | `sub`, `dub` | AniList id | `providers/anikoto/` |
| 2 | `anikoto2` | Anikoto 2 | `sub`, `dub` | site slug | `providers/anikoto2/` |
| 3 | `anineko` | AniNeko | `sub`, `dub` | site slug | `providers/anineko/` |
| 4 | `animegg` | AnimeGG | `sub`, `dub` | site slug | `providers/animegg/` |
| 5 | `anidb` | AniDB | `sub`, `dub` | site slug | `providers/anidb/` |
| 6 | `aniworld` | AniWorld | `ger-dub`, `ger-sub` | site slug | `providers/aniworld/` |

A provider is only asked for tracks it declares, so a German request never
reaches the first five and an English one never reaches AniWorld. That is why
the German pool is effectively a pool of one, and why a German title that
AniWorld does not carry has nowhere else to come from.

**The ids are persisted.** They appear in the provider-mapping table and in the
user's disabled-provider setting. Renaming one orphans every mapping made
against it.

---

## Per provider

### Anikoto (`anikoto`)

* **Catalogue:** `https://anikotoapi.site`
* **Playback:** the [MegaPlay](#megaplay) embed
* **Handle:** the AniList id itself (`handle_is_anilist_id: true`)
* **Connectivity map:** Frankfurt (50.1, 8.7), observed host geolocated live

The only provider that needs no title matching at all. MegaPlay addresses a
title by the AniList id the catalogue already holds, so the handle is that id as
a string and the entire class of season-matching bugs does not apply to it.
That is why it is first in the pool.

It takes whatever the embed gives, which means no episode list of its own and no
per-episode server choice.

### Anikoto 2 (`anikoto2`)

* **Site:** `https://anikoto.cz`
* **Playback:** several servers per episode, most ending at [MegaPlay](#megaplay)
* **Handle:** site slug
* **Connectivity map:** 50.1, 14.4, observed host geolocated live

The sibling that walks the site rather than the embed: a slug names a show, the
show has an episode grid, and each episode lists servers. Because it reads a
real episode grid it can report per-track availability honestly, which the
first one cannot.

Parsing lives in `providers/anikoto2/parsing.rs` and is covered offline by
`tests/providers/anikoto2_parsing.rs`.

### AniNeko (`anineko`)

* **Site:** `https://anineko.to`
* **Handle:** site slug, from `href="/watch/<slug>"`
* **Connectivity map:** Singapore (1.35, 103.8), observed host geolocated live

Publishes sub and dub episode counts on its own cards, which the parser reads
per track, so an absent dub is reported as absent rather than as an error. It
also publishes episode titles, so it can answer `episode_titles_en`.

### AnimeGG (`animegg`)

* **Site:** `https://www.animegg.org`
* **Handle:** site slug
* **Connectivity map:** Amsterdam (52.4, 4.9), fixed, with no live geolocation

Sub and dub are separate entries on this site rather than two tracks of one
entry, which is the case the pool's alternate-handle tracking exists for. Its
sources are direct MP4s with a quality label rather than a playlist.

### AniDB (`anidb`)

* **Site:** `https://anidb.app`, overridable through `sources.json`
* **Handle:** site slug, taken from an `/anime/<slug>-<id>` link
* **Connectivity map:** 37.8, -122.4, fixed

**Gated on TLS fingerprint, not just headers.** The request has to look like a
browser all the way down to the handshake, which is why this provider's HTTP
client is built differently from the others. A correct-looking request with the
wrong client is refused.

### AniWorld (`aniworld`)

* **Site:** `https://aniworld.to`, overridable through `sources.json`
* **Tracks:** `ger-dub` and `ger-sub`, the only German source in the pool
* **Handle:** site slug, and **one handle covers the whole franchise**
  (`seasons_under_one_handle: true`)
* **Connectivity map:** Frankfurt (50.1, 8.7), observed host geolocated live
* **Extra:** its own DNS-over-HTTPS resolver, `providers/aniworld/doh.rs`

The one provider whose handle is not per season. A franchise lives on one
page and `solo-leveling` plus `staffel-2` is how season two is addressed, so
the pool works out the season ordinal, strips the marker off the title, and
asks for the base slug with a season hint.

The ordinal comes from three places, in order: the stored relation chain, the
season suffix in the title, and a romanised sequel marker. That last one is
easy to miss. `Yahari Ore no Seishun Love Comedy wa Machigatteiru. Zoku` is
season two of a series whose page is called `my-teen-romantic-comedy-snafu`,
and searching for the full title with `Zoku` still on it finds nothing at all.
`Zoku` means two, `Kan` and `Final` mean the last one.

Knowing the season is only half of it. The site answers a search with the
franchise page, and that page carries the franchise name, which is shorter than
the name of the season being looked for. `My Teen Romantic Comedy SNAFU` against
`My Teen Romantic Comedy SNAFU TOO!` is the whole difference between finding
season two and reporting it missing, and the marker is whatever the studio
called it. So for a provider that declares `seasons_under_one_handle`, a hit
whose name is where one of our titles starts, with at most two words left over,
is the franchise page. For the other five providers a shorter title is a
different show, and the rule is unreachable.

`MATCHING_REVISION` in `provider_pool/title_matching.rs` guards both. Raising it
makes the pool forget every remembered miss once at the next start, which is
what a fix to the matching rules needs in order to reach anyone who already ran
the broken version.

When a German season is missing, this is where to look first.

Its stream links are not on the site. Each episode lists hosters, and each
hoster is unwrapped separately. See [Stream hosts](#stream-hosts) below.

Descriptions are metadata, not provider data. AniList supplies them normally and Kitsu is the
fallback, so this adapter must not scrape them from the streaming site.

---

## Stream hosts

A provider hands back a page. The playable URL is usually another hop from there.

### MegaPlay

`providers/megaplay.rs`, shared by both Anikoto providers.

An embed page carries a numeric id, that id names a source document, and the
source document holds the playlist. **The CDN checks `Referer` and `Origin`
against the site root, not against the embed page it was linked from**, which
is the detail that breaks a naive implementation.

### VOE

`providers/aniworld/parsing/stream_hosts.rs`.

VOE bounces through a landing page (`window.location.href = ...`) to a mirror,
and the mirror's payload is obfuscated: a packed script, ROT13, or a JSON blob
in a `<script type="application/json">` tag depending on the day. All three
decoders are covered by fixtures in `tests/providers/aniworld_parsing.rs`.

### Filemoon

Also in `stream_hosts.rs`. A packed script whose unpacking yields an `.m3u8`.

---

## Everything a provider must answer

`src-tauri/src/providers/contract.rs`:

| Method | Answers |
|---|---|
| `search` | Titles matching a query, each with an opaque handle |
| `episodes` | Which episodes exist for a handle and a track |
| `episode_sources` | Playable stream links for one episode |
| `episode_titles_en` | Per-episode titles, when the site publishes them |

A handle is opaque on purpose: its shape is that site's business and changes
without warning, so nothing outside the provider parses one.

---

## Health probes

Every provider declares how to prove itself end to end. The connectivity board
runs these from the user's own machine, which is why it shows what is reachable
for them rather than what a status page claims.

| Provider | Probe |
|---|---|
| Anikoto, Anikoto 2, AniNeko, AnimeGG, AniDB | search `naruto`, `sub`, episode 1, first 4 of 5 hits |
| AniWorld | resolve slug `naruto` directly, `ger-sub`, episode 1 |

AniWorld skips the search step because its slug is known and stable, and a
search there costs more than it proves.

---

## Configuration and invalidation

`providers/provider_config.rs` holds a baked default and can load a
`sources.json` override from the app-data directory. Only a same-or-newer
version is applied.

When the version advances, **every provider mapping is dropped**
(`invalidate_stale_mappings`). A mapping is an agreement between one anime and
one provider's handle for it, reached against the host the configuration named
at the time. A new configuration voids that agreement.

---

## Caching, and the surprise in it

The pool remembers a resolved handle, and it also remembers a **negative**
result for a shorter time. The second half is what surprises people: when a
German dub has just appeared, AniSphere may not notice for up to half an hour.

Repeated failures trip a circuit breaker and take a provider out of rotation for
a while. `PROVIDER_BLOCKED` short-circuits that immediately, because a refusal
and an absence are different things: a provider that has no episode nine is
skipped, a provider that is blocking us is removed.

---

## Adding one

1. `src-tauri/src/providers/<name>/` with `mod.rs` and `parsing.rs`.
2. Keep `parsing.rs` pure. HTML or JSON in, structured data out, no network,
   so it stays testable without the site.
3. Implement `Provider` in `mod.rs`.
4. Register it in `providers/registry.rs` with its metadata and a health probe.
   Position in that list is failover position.
5. Offline tests in `src-tauri/src/tests/providers/`, against saved fixtures,
   plus an `#[ignore]` probe for the live path.

If you find yourself editing `provider_pool/` to special-case your provider, the
contract is wrong and worth fixing instead.

Read the [Legal Disclaimer](Legal-Disclaimer) before proposing a source.

---

## Things that will bite you

* **AniList's episode count is not permission to play.** The provider's list is
  the truth.
* **Sites change markup without notice.** Parsing is separate and fixture-backed
  so a break is a failing test rather than a mystery.
* **Some sites gate on TLS fingerprint**, so the HTTP client matters as much as
  the request.
* **Provider ids are persisted.** Changing one orphans every stored mapping.
* **One handle per franchise is the exception, not the rule.** Only AniWorld
  sets it, and nearly every German season bug traces back to it.
