# Build Notes

Details that are surprising enough to cost someone an afternoon.

## Node version

Node 20 or newer is supported. The lockfile no longer needs direct `@emnapi` dependencies.

## The release profile

`Cargo.toml` sets `panic = "abort"`, `lto = true`, `codegen-units = 1`, `opt-level = "s"` and
`strip = true`. That is what keeps the binary small, at the cost of a slow release build. Debug
builds are unaffected.

## Window background colour

`tauri.conf.json` sets `backgroundColor` to the application's own dark shade. Without it the window
paints white for a frame before the interface loads, which reads as a flash on every launch.

The window also starts with `visible: false` and is shown once the interface is ready, for the same
reason.

## The AppImage is repacked

The stock Tauri bundler copies WebKitGTK and its dependencies into the AppImage. Every supported
Linux installation already provides that stack, so `scripts/tauri-build.mjs` asks `ldd` for the
complete system WebKit dependency closure, excludes exactly those libraries and repacks the image.

The script logs the size before and after. It keeps the original as `.orig` until repacking has
succeeded, restores it on failure and removes it only after the replacement is usable.

## Compile-time values

`ANISPHERE_ANILIST_CLIENT_ID`, `ANISPHERE_DISCORD_APP_ID` and `ANISPHERE_DISCORD_IMAGE` are read
at compile time and baked in. Changing one means rebuilding.

All three are public values. The AniList login runs on the implicit grant, which is the flow for
clients that cannot hold a secret, so there is no secret to bake in.

The updater values are read at bundle time instead, so they only matter when producing installers.

A build with none of them set works. AniList login, Discord presence and auto-update simply stay
off.

## Three files carry the version

`package.json`, `src-tauri/Cargo.toml` and `src-tauri/tauri.conf.json`. The release workflow refuses
a tag that disagrees with any of them, because the bundler reads `tauri.conf.json` and a mismatch
there ships installers whose version disagrees with the tag, which then breaks the updater's
comparison.

Bumping the version also means regenerating `Cargo.lock`, which `cargo check` does.

## Bundle size warning

The frontend build warns that a chunk is over 500 kB. That is the globe on the connectivity board,
which is a WebGL library loaded on one screen. It is a warning, not a problem.
