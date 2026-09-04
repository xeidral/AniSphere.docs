# Playback and Proxy

## Why a proxy exists

A provider hands back a stream URL, usually an HLS playlist. The WebView cannot simply load it:

- The content security policy does not allow arbitrary third-party media hosts.
- The origin expects a `Referer` and often a specific user agent, which a media element will not
  send.
- An HLS playlist contains absolute URLs to more third-party hosts, so even a permitted playlist
  points at forbidden segments.

So media goes through a small HTTP server on loopback, in `src-tauri/src/server/`.

## What the proxy does

`media_proxy.rs`:

- Carries the headers the origin expects, including the referer the provider specified.
- Rewrites HLS manifests so every variant and segment URL points back at the proxy. Both the master
  playlist and the media playlists it references are rewritten.
- Forwards range requests in both directions, which is what makes seeking work rather than
  re-downloading from the start.
- Allows a segment host only once a playlist from this session has named it, so the proxy cannot be
  aimed at an arbitrary address.

`images.rs` does the same job for artwork, with a permanent on-disk cache keyed by a hash of the
URL. It refuses anything but HTTPS and blocks private and loopback hosts.

## Resolving an episode

1. The pool matches the AniList id to a provider handle. See [Provider System](Provider-System).
2. Every provider that carries the requested track is asked for its episode list at once, and the
   first list that matches the episode count AniList publishes wins. Where no count is known, the
   fullest list wins instead, because any non-empty list would clear the bar and the quickest
   provider is not necessarily the one with the whole season.
3. Choosing an episode asks the provider for stream links.
4. Links are ranked, preferring HLS and higher resolution.
5. The chosen URL is handed to the player as a proxy URL.
6. If a provider fails at any step, the pool tries the next one.

Nobody waits indefinitely. The race gives every provider fifteen seconds together, and whoever is
still going past that is left to finish unheard, because a race lasts as long as its slowest entrant
even when none of them has the episode. The whole resolution, the race and the alternate-handle
ladder after it, has thirty seconds. An episode nobody carries is answered in half a minute, and the
other track is usually a second away.

A refusal and an absence are different. A provider without episode nine is skipped quietly. A
provider that is blocking us is taken out of rotation.

## The player

`hls.js` where HLS is not native, the platform player where it is. On top of that:

- **Opening and ending skip** from [AniSkip](https://aniskip.com). The project publishes its whole
  database as one file, which is imported and kept locally, so a marker is a local read rather than
  a request. One episode carries markers from several sites submitted against several cuts of it, so
  the runtime each was measured against is matched against the episode being played before votes
  decide. The API is asked only for what the file does not cover.
- **Auto-play next**, which reads the same episode list the page used.
- **Speed control** and a track selector.
- **A mini-player** that keeps the same video element while floating.

The episode rail and the full **More episodes** dialog share the same merged episode assets, so
each row uses its own available title and still rather than repeating the series banner.
- **A pop-out window**, a real always-on-top native window.

The mini-player and pop-out re-parent the existing element rather than creating a second one, which
is why playback does not restart when you switch. It also means every handler attached to that
element has to be released by its owner on teardown, or it leaks across the transition.

### Controls and shortcuts

The video surface does not treat every click as play or pause. The play button owns that action;
clicking or dragging the timeline seeks without changing the playback state, and the volume,
speed, track, help, pop-out and fullscreen controls perform only their named action.

The speaker reflects the audible volume with one, two or three waves. Muted and zero volume use a
separate compact crossed-speaker mark. The slider changes volume in five-percent steps.

Player keyboard shortcuts run only without `Ctrl`, `Cmd` or `Alt`, and never while typing into a
field. In particular, plain `K` toggles playback while `Ctrl`/`Cmd` + `K` remains the application
search shortcut. `Space` also toggles playback, arrows seek and change volume, and the help button
lists the remaining keys.

Clicking or tapping the mini-player video returns to the full watch page. Dragging the box only
repositions it, and its play, pop-out, retry and close buttons do not accidentally expand it.

### Resuming where you left off

The position an episode resumes from is a read of its own, and opening one from
continue watching navigates immediately, so the element can already be playing
from zero by the time that position arrives. It is applied when it lands, as
long as only the first seconds have played and you have not seeked yourself.

## Progress

Progress is written as you watch, throttled, and again on pause and teardown. It is per profile and
per track, so subtitled and dubbed are recorded separately for the same episode.

Pre-translating descriptions pauses while playback runs so it does not compete for bandwidth.
