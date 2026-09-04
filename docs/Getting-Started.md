# Getting Started

## The first launch

Three things happen in order, and only the first one holds the app up.

**The catalogue arrives.** A single file from the manami project, giving titles, synonyms, covers
and the bridge between AniList and MyAnimeList ids. Under a minute on a normal connection. The
startup screen shows this one because there is nothing to browse without it.

**You make a profile.** A name and a picture. Everything you watch, rate and save belongs to a
profile, and a profile never leaves your machine.

**Metadata arrives with what you are looking at.** Descriptions, characters, banners, airing dates
and episode counts come from AniList, for the titles on your screen and no others. Opening the home
screen costs one request, and every card it drew is fetched together shortly after, so the page you
open next is already there.

There is no catalogue-wide pass and nothing to wait for. What you have already looked at is kept, up
to a ceiling, so a second visit costs nothing at all.

## Finding something to watch

- **Search** with `Ctrl`/`Cmd` + `K` from anywhere. It searches the local catalogue, so it answers
  instantly and works offline. Promotional clips, music videos and Chinese animation are omitted;
  visible pages are checked against the already requested AniList metadata before they appear.
- **Trending, Popular, Top rated and Upcoming** are on the home page.
- **Seasonal** shows what is airing now, and lets you walk to other years.
- **Genres** gives a wall of one cover per genre.
- Hovering a card opens a preview with the description, the score and, when there is one, the
  trailer.

## Watching

Open a title and press Watch, or use the Watch button on the hover preview to skip the detail page.

The player has opening and ending skip when [AniSkip](https://aniskip.com) has timestamps for the
episode, auto-play next, speed control, and a track selector for subtitled or dubbed.

Use the dedicated play button or press `Space` or `K` without a command modifier to toggle
playback. `Ctrl`/`Cmd` + `K` still opens search while watching and does not also pause the video.
Keyboard shortcuts are listed from the help button in the player.

## Building a library

Every title has five states: watching, completed, plan to watch, on hold and dropped. Progress is
recorded as you watch, so continue-watching on the home page stays correct without any bookkeeping.

**Offline** cuts across those states and shows what is downloaded to this machine. **Top lists** are
your own ordered lists, separate from the watch states.

**Importing.** Settings has an import for a public AniList or MyAnimeList list. Matching is by id,
so nothing is guessed.

## Profiles

Several profiles share one installation and one catalogue, but nothing else. Switching profiles
stops playback cleanly and lands on that profile's home page.

## Offline

Any episode can be downloaded, and its metadata and artwork are stored beside it, so a downloaded
show stays browsable with no connection at all. Downloads go where you choose, everything else stays
in the application data directory.

## When something looks wrong

See [Troubleshooting](Troubleshooting). The connectivity board under Settings checks every source
live from your own machine and is usually the fastest way to see what is actually down.
