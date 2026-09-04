# FAQ

**Is this legal?**

That depends entirely on where you live, and it is your call to make. AniSphere hosts nothing and
ships with no media. Read the [Legal Disclaimer](Legal-Disclaimer) before you use it.

**Do I need an account?**

No. There is no AniSphere account and no server belonging to the project. Profiles are local. An
AniList account is optional and only there if you want your list synchronised.

**Does it work offline?**

Browsing does, completely, once the catalogue is downloaded. Search, the library, statistics and
covers all work with no connection, because the catalogue is a local database and images are cached
after first sight. Playing needs a connection, unless you downloaded the episode.

**Why does the first start take a while?**

It downloads the catalogue, one file of roughly forty megabytes. That is the only blocking step.
Metadata for what is on the screen arrives behind it and never holds the app up.

**Why is metadata so slow?**

AniList publishes a per-address request budget and has run it as low as thirty requests a minute.
At fifty titles per request, a full catalogue is around twenty minutes at best. Bandwidth does not
change it. It runs in the background, and pages you actually open are fetched first.

**Something is not playing.**

Check Settings, Connectivity. It tests every source live from your machine. See
[Troubleshooting](Troubleshooting).

**Can I add a streaming site?**

Yes, and it is deliberately self-contained: one folder and one registry entry. See
[Provider System](Provider-System).

**Where are my downloads?**

Where you chose, laid out as `<your folder>/<language>/<anime>/`. Ordinary files, playable in any
player, untouched by uninstalling.

**Can I move the download folder?**

Yes, in Settings. Existing downloads are reconciled rather than lost.

**Does it collect anything about me?**

No telemetry, no analytics, no account. What leaves the machine is listed host by host in
[Data, Privacy and Security](Data-Privacy-And-Security).

**Why does Windows or macOS warn me?**

The builds are signed for the updater, not with a paid operating system certificate. See
[Installation](Installation).

**Is there a mobile version?**

No.

**Can I use it in another language?**

English ships in the app. The companion `AniSphere.i18n` catalogue lists more than 100 display
languages and generated packs are loaded by BCP 47 tag; a missing or invalid pack falls back to
English. Playback language is a separate setting, so display language does not change the audio.

**How do I contribute?**

Read [Development Setup](Development-Setup) and [Coding Standards](Coding-Standards), then run
`npm run ci:local` before opening a pull request.
