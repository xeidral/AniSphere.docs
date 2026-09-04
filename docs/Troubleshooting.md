# Troubleshooting

Start at **Settings, Connectivity**. It checks every source live from your own machine, so it shows
what is actually reachable for you rather than what a status page claims.

While a fresh sweep is running, services say that they are being checked. A stale HTTP status from
the previous sweep is not shown as a current failure.

## Nothing plays

**Every source offline on the board.** Your connection, a DNS filter, or a network that blocks these
hosts. A VPN often settles it either way, by fixing it or by proving the block.

**One source offline, the rest fine.** That site is down. The pool moves on by itself, so try
another episode or wait.

**Everything online but this episode will not start.** The provider lists the episode without having
a working source for it. Switch the track between subtitled and dubbed, or try a different provider
in Settings.

## The German dub for a later season is missing

The pool remembers a negative result for about half an hour, so a dub that has just appeared may not
show up immediately. Wait it out or restart the app.

Season matching is also involved: a per-season AniList entry has to be mapped onto one multi-season
provider slug. When that mapping fails, the season looks empty even though it exists. See
[Provider System](Provider-System).

## Metadata takes a long time

AniList publishes a per-address request budget and has run it as low as thirty requests a minute.
The catalogue is around thirty thousand titles at fifty per request, so the floor is roughly twenty
minutes and no amount of bandwidth changes it.

It runs in the background and does not hold the app up. Pages you open are fetched first, so the
parts you actually use fill in quickly.

If it stalls completely rather than being slow, check the board for AniList. When AniList is
unreachable, Kitsu supplies fallback details and rankings while stored local data stays available.

## The first start shows no catalogue

The catalogue is one file of roughly forty megabytes from the manami project on GitHub. If GitHub is
blocked on your network, that download is what failed. The startup screen offers a retry.

## Connecting AniList opens a sign-in page every time

Connecting hands the authorization link to whatever your desktop opens links with, and AniList shows
its approval page only in a browser you are already signed in to. If that is not your default
browser, you get its sign-in page instead. While the connect button is spinning there is a link
underneath it that copies the same URL, so you can paste it into the browser that holds the session.

## Discord shows nothing

The desktop Discord client has to be running, and **Settings, Activity Privacy, Display current
activity** has to be on. AniSphere reconnects every ten seconds, so start Discord and it will
appear.

Release builds carry an application id. A build from source shows no name or artwork unless you
supply your own, see [Development Setup](Development-Setup).

## A release build fails with "failed to remove anisphere.exe (os error 5)"

AniSphere is still running. Close it and build again.

## Windows or macOS refuses to open the installer

The builds are signed for the updater, not with a paid operating system certificate. See
[Installation](Installation) for how to get past SmartScreen and Gatekeeper.

## Everything is odd after an update

Settings has a cache clear for the image and stream caches, which is safe and keeps your library. If
that does not help, deleting the application data directory resets the app completely and loses your
profiles, so export or note anything you care about first. The location is in
[Data, Privacy and Security](Data-Privacy-And-Security).
