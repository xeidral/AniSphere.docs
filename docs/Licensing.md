# Licensing

## The software

AniSphere is released under the **[GNU General Public License version 3 or later](https://www.gnu.org/licenses/gpl-3.0.html)**.

In practice that means you may use it, study it, change it and share it, and anything you distribute
that is built on it has to carry the same freedoms. It also means the software comes with no
warranty, which sections 15 and 16 spell out.

The full text is in `LICENSE` in the repository.

There is no per-file licence header. GPLv3 does not require one, and five hundred files of
boilerplate is the opposite of readable. The licence is declared once in `LICENSE`, once in
`package.json`, once in `Cargo.toml`, and once in the bundle configuration so the installers carry
it.

## Dependencies

The Rust and npm trees are overwhelmingly MIT and Apache-2.0, both of which combine with GPLv3
without trouble. Anything under a licence that does not, such as SSPL or a source-available licence,
cannot be added.

Check before adding a dependency:

```bash
cargo tree
npm ls --all
```

## Bundled artwork

The wallpapers and preset avatars that ship inside the application are credited in `ATTRIBUTION.md`,
with the creator and source for each one where those are known.

The application icon, logo and interface artwork are original work by the contributors and fall
under the project's GPLv3 licence.

## Data

AniSphere reads from several services, each with its own terms. `ATTRIBUTION.md` lists them with the
endpoint used and a link to the terms.

One deserves highlighting because it carries an actual obligation rather than a courtesy:

**[manami-project / anime-offline-database](https://github.com/manami-project/anime-offline-database)**
is released under the **Open Database License v1.0 plus the Database Contents License v1.0**. ODbL
is a copyleft licence for databases and **requires attribution**. That attribution is the entry in
`ATTRIBUTION.md`, and it must stay there.

## Anime itself

Nothing about any of the above applies to the anime. Titles, cover art, banners, character images
and the media itself belong to the studios and licensors that made them. AniSphere redistributes
none of it, and everything it displays is fetched at runtime and cached locally. See
[Legal Disclaimer](Legal-Disclaimer).
