# Data, Privacy and Security

## What stays on your machine

Everything. Profiles, library entries, watch progress, settings, the catalogue and every cache live
in one SQLite database plus a few cache folders, under the operating system's application data
directory:

| Platform | Location |
|---|---|
| Windows | `%APPDATA%\com.anisphere.desktop\` |
| macOS | `~/Library/Application Support/com.anisphere.desktop/` |
| Linux | `~/.local/share/com.anisphere.desktop/` |

There is no AniSphere account, no server belonging to the project, and no telemetry. Nothing about
what you watch is reported anywhere, unless you sign in to AniList yourself and switch on
synchronisation, which then does exactly what you asked it to.

## What leaves your machine

Only what a feature needs, when that feature runs.

| Host | When | What it learns |
|---|---|---|
| `github.com` | Catalogue download and update checks | Your address, and that you use AniSphere |
| `graphql.anilist.co` | Metadata, and account sync when signed in | The titles being looked up |
| `kitsu.io` | Metadata fallback, rankings, episode titles and thumbnails | The titles being looked up |
| `myanimelist.net` | Importing a public list | The account name being imported |
| `api.aniskip.com` | Opening and ending timestamps | The episode being watched |
| Streaming providers | Searching, listing and playing | The titles and episodes requested |
| `discord.com` | Rich Presence, if enabled | The title and episode playing |
| `ipwho.is` | The connectivity map | Your address |
| `youtube-nocookie.com` | Trailers on the hover preview | That a trailer was shown |

Provider hosts are listed on the connectivity board inside the app, and each one is a separate
module under `src-tauri/src/providers/`.

Images are not loaded by the WebView directly. They go through a loopback proxy that fetches them
once and keeps the bytes on disk, so the same cover is never fetched twice and no page can be
fingerprinted by its image requests.

## Removing it all

Settings has a clear-cache action for the image and stream caches. To remove everything, delete the
application data directory listed above. Downloads live wherever you pointed them and are not
touched by that.

## Security boundaries

Some parts of the codebase are load-bearing for safety, and changing them deserves focused tests
and a careful review rather than a drive-by edit:

- The content security policy in `src-tauri/tauri.conf.json`
- The Tauri capability allowlist in `src-tauri/capabilities/`
- The loopback proxy, which refuses anything but HTTPS and blocks private and loopback hosts so it
  cannot be turned into a probe of the local network
- The AniList OAuth flow and the token store
- The updater endpoint and its signature check

## Credentials

There are none to protect. AniSphere signs in to AniList through the authorization flow desktop
applications are meant to use: the browser does the signing in, the application never sees the
password, and no client secret is compiled into the binary. A secret shipped inside an installer
is a secret anyone can read out of it, so there is not one to read.

What is stored is the access token AniList hands back for the account you signed in with, in the
application's own data directory, and it is only ever sent back to AniList. Signing out removes it.

Logs and diagnostics must never contain tokens, complete media URLs, personal data or private
filesystem paths.

## Reporting a vulnerability

Through GitHub's private vulnerability reporting, under Security then Advisories, rather than a
public issue. See `.github/SECURITY.md` in the repository.
