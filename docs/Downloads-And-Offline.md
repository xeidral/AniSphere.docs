# Downloads and Offline

Saving a title takes its page with it: the description, the characters, the artwork, the episode
titles and thumbnails, and the franchise it belongs to, all fetched before the snapshot is written
rather than assumed to be there. A saved episode then plays from the disk whether there is a
connection or not, and is found under the track it was saved as rather than only the one being
watched.

## Where things go

Two locations, on purpose.

**Media** goes where you chose, under `<your folder>/<language>/<anime>/`. It is yours, readable by
any player, and untouched by uninstalling the app.

**Everything else** stays in the application data directory: the queue, progress, and the offline
snapshot. See [Data, Privacy and Security](Data-Privacy-And-Security).

## The pipeline

`src-tauri/src/downloads/`:

1. **`queue.rs`** schedules. Several episodes can be requested at once, and the queue bounds how
   many transfer at a time so downloading does not starve playback.
2. **`transfer/`** moves bytes. A direct file is a ranged fetch. HLS is different: fetch the
   playlist, fetch every segment, decrypt AES-128 where the playlist says to, then assemble.
3. **`ffmpeg.rs`** assembles segments into one playable file.
4. **`offline/`** writes the snapshot.
5. **`paths.rs`** owns naming and layout, so the same episode always lands in the same place.

Progress is reported per episode as an event, which is what the offline page draws.

## The snapshot

A downloaded episode without its metadata is a file with a cryptic name. The snapshot is what makes
the library still work offline: the title, the description, the cover and the episode titles,
written beside the media when the download completes.

That is why the offline page shows real cards rather than filenames, and why it survives a cache
clear. Reopening the offline page restores those caches from the snapshots.

## Reconciliation

Files disappear. Users move folders, delete episodes, or restore from a backup. On opening the
offline page the app reconciles: rows whose file is gone are dropped, and files it finds again are
picked back up.

This is also why the download directory can be changed without losing what you already have.

## Failures

A failed download stays visible with a retry rather than vanishing, because the usual causes are
temporary: the source went down, the network dropped, the disk filled. Retrying resumes rather than
starting over where the source supports ranges.

## Things worth knowing

- **HLS downloads are many small requests**, not one big one. A show with long episodes is hundreds
  of segments, and a single failed segment fails the episode rather than producing a broken file.
- **Assembly needs ffmpeg**, which ships with the app.
- **A partial or empty assembly is never trusted.** It is treated as a failure, because handing the
  player a truncated file is worse than reporting the download did not work.
