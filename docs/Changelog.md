# Changelog

Release notes live with the code, so they are versioned alongside what they describe and can never
drift from the tag they belong to.

- **[CHANGELOG.md](https://github.com/xeidral/anisphere/blob/main/CHANGELOG.md)** covers every
  release, newest first.
- **[Releases](https://github.com/xeidral/anisphere/releases)** carries the installers and the
  signed update manifest for each version.

## Versioning

AniSphere follows semantic versioning. The major number moves when something a user or a packager
depends on changes shape: the licence, the IPC surface, the on-disk layout, or the update channel.
The minor number moves for features, the patch number for fixes.

Three files carry the version and must always agree, which the release workflow enforces before it
builds anything:

| File | Read by |
|---|---|
| `package.json` | The frontend build and the release tag check |
| `src-tauri/Cargo.toml` | The Rust crate |
| `src-tauri/tauri.conf.json` | The bundler, and through it the updater's version comparison |

A mismatch here ships installers whose version disagrees with the tag, which breaks the update check
for everyone who already has the app.
