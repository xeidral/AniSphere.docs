# Legal Disclaimer

This mirrors `DISCLAIMER.md` in the repository. Read it before you use AniSphere.

## AniSphere is a client, not a service

AniSphere does not host, store, upload, seed or distribute any anime. It ships with no media files.
It operates no streaming service and has no affiliation with any of the sites it can talk to.

What it does is send requests to third-party websites that were already publicly reachable from your
browser, read the responses, and render the result. Every episode you see comes from a server the
project neither owns nor controls. It is a user agent, in the same sense that a browser or a feed
reader is one.

The catalogue works the same way. Titles, cover art, descriptions and episode counts come from
public metadata services. Those services own that data and can change or withdraw it at any time.

## The law is not the same everywhere

Whether it is lawful to stream from unofficial sources depends on where you are. Some countries
treat it as clearly illegal, some as a grey area, some place the liability entirely on whoever hosts
the content rather than whoever watches it, and some have no settled answer. This changes over time
and no file in a repository can answer it for you.

**You are responsible for your own use of this software.** Find out what applies where you live. If
streaming from these sources is not lawful there, do not use it for that.

Nothing here is legal advice.

## The contributors are not responsible for what you do with it

Everyone who writes, maintains, reviews, translates or packages AniSphere:

- does not operate, sponsor or endorse the third-party sites it can reach,
- does not choose, review or moderate what those sites make available,
- does not know what any individual user does with the software,
- and accepts no liability for how you use it.

Publishing source code is not the same as encouraging any particular use of it.

This sits on top of, not instead of, the warranty and liability disclaimers in sections 15 and 16 of
the GNU General Public License version 3, which governs this software. In short: no warranty of any
kind, and nobody who contributed owes you damages if it goes wrong.

## Support the people who make anime

Where an official, licensed way to watch a show exists in your region, use it. Legal services pay
the studios, and the studios pay the people who actually draw the thing. AniSphere is not a
substitute for that and is not meant to be a reason to avoid it.

## For rights holders

If you hold rights to a work and believe this project is a problem for you, please open an issue or
contact a maintainer before escalating. Two things usually come up:

AniSphere contains no copyrighted media. There is nothing in the repository to take down in that
sense. The images that ship with the application are listed with their sources in `ATTRIBUTION.md`.

Support for an individual site is a self-contained module under `src-tauri/src/providers/`, wired in
through a single registry. Making a specific site unreachable from the application is a small and
entirely feasible change, and a request to make it will be taken seriously.

## Trademarks

Anime titles, studio names, service names and logos belong to their respective owners. They are used
to identify those works and services, which is the only way to build a catalogue at all. No
affiliation or endorsement is implied.
