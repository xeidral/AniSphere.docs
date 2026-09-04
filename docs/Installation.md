# Installation

Grab the newest build from the
[releases page](https://github.com/xeidral/anisphere/releases/latest) and pick the file for your
platform.

| Platform | File | Notes |
|---|---|---|
| Windows | `.exe` installer, or `.msi` | Windows 11 already has the WebView2 runtime. On Windows 10 the installer fetches it |
| macOS | `.dmg` | Drag it to Applications |
| Linux | `.AppImage` | Mark it executable and run it, no install needed |
| Linux, Debian and Ubuntu | `.deb` | `sudo apt install ./anisphere_*.deb` |

## Unsigned builds

The releases are signed for the auto-updater, not with a paid operating system certificate, so both
Windows and macOS will warn you the first time.

**Windows.** SmartScreen shows "Windows protected your PC". Choose More info, then Run anyway.

**macOS.** Gatekeeper says the developer cannot be verified. Open System Settings, go to Privacy and
Security, and choose Open Anyway next to the AniSphere entry. Or right-click the app and choose Open.

If that is not acceptable to you, building from source is the alternative and takes about ten
minutes. See [Development Setup](Development-Setup).

## First start

The first run downloads the catalogue, which is a single file of roughly forty megabytes from the
[manami project](https://github.com/manami-project/anime-offline-database). That is the only thing
that holds the app up, and it takes well under a minute on a normal connection.

Nothing else has to finish. Descriptions, artwork and episode counts are fetched from AniList for
the titles a page is showing, a page at a time, so the app is usable the moment the catalogue is
written and there is no second wait to sit through. See
[Getting Started](Getting-Started).

## Updating

AniSphere checks for updates on launch and installs them quietly when you agree. Nothing is
downloaded without the signature being verified against a key compiled into the build.

## Uninstalling

Use the normal uninstaller on Windows, delete the app on macOS, or remove the package on Linux. Your
data is separate, and where to find it is in
[Data, Privacy and Security](Data-Privacy-And-Security).
