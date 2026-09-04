# Glossary

**AniList.** A public anime database with a GraphQL API. Owns episode counts, airing dates,
descriptions, characters and banners in this project. Also the optional account you can sync a
library to.

**AniSkip.** A community service publishing opening and ending timestamps per episode, which is what
the skip buttons use.

**Backdrop root.** A CSS concept. An ancestor below full opacity, or carrying a filter or a mask,
forms one, and any `backdrop-filter` inside it can only sample that group rather than the real page
behind. It is why a fade on a parent breaks the frosted look on a child.

**Circuit breaker.** The pool's rule that a provider failing repeatedly is taken out of rotation for
a while, rather than being retried on every request.

**Handle.** A provider's own identifier for a title, usually a slug. Opaque on purpose: nothing
outside that provider may parse it.

**HLS.** HTTP Live Streaming. A playlist file listing video variants and many small media segments,
fetched over ordinary HTTP. Most providers serve this rather than a single file.

**Kitsu.** The metadata and ranking fallback when AniList cannot answer. It also provides
per-episode titles and thumbnails, matched through the MyAnimeList id.

**manami.** Short for
[manami-project / anime-offline-database](https://github.com/manami-project/anime-offline-database).
One file giving titles, synonyms, covers and the bridge between AniList and MyAnimeList ids. It is
the local catalogue, and the only reason search works offline.

**Pacer.** The gate in `catalog/metadata/transport.rs` that every AniList request queues through, so
the whole process together stays inside the per-address budget AniList publishes.

**Pool.** `provider_pool/`. The layer that matches titles to handles, caches, fails over between
providers and tracks their health.

**Provider.** One streaming site, behind a shared contract, in its own folder.

**Rate budget.** The number of requests AniList allows per minute from one address. It is published
on every response and has been as low as thirty, which is why nothing may assume a fixed number.

**Snapshot.** The metadata and artwork written beside a download, so the show stays browsable with
no connection.

**SWR.** Stale while revalidate. Show what is cached, refetch behind it, swap the answer in.
`src/shared/cache/createSwrResource.ts`.

**Track.** A language and dub combination: `sub`, `dub`, `raw`, `ger-sub`, `ger-dub`. Progress is
recorded per track, so subtitled and dubbed are separate.

**Prefetch.** Fetching metadata for the titles a page is holding, drawn or not, so opening one of
them is a local read. Bounded by what the screen shows, never by the size of the catalogue.
