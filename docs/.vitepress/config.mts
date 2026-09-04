import { defineConfig } from 'vitepress'
import { withMermaid } from 'vitepress-plugin-mermaid'

/**
 * The documentation site.
 *
 * Every page under docs/ is written here rather than mirrored from anywhere:
 * this is the one place they live. Application coverage is measured outside
 * this site and the coverage page documents where its local and Sonar reports live.
 */
export default withMermaid(
  defineConfig({
  title: 'AniSphere Docs',
  titleTemplate: ':title | AniSphere Docs',
  description: 'A desktop anime client. Search, watch, track and download, from one window.',
  lang: 'en',
  // Pages serves a project site under the repository's own name, so every asset
  // the build emits is addressed from there. Without this they are addressed
  // from the domain root, where the stylesheet is not, and the site renders
  // unstyled.
  base: '/AniSphere.docs/',
  cleanUrls: true,
  lastUpdated: true,

  head: [
    ['link', { rel: 'icon', href: '/favicon.png' }],
    ['meta', { property: 'og:title', content: 'AniSphere' }],
    ['meta', { property: 'og:image', content: '/home.webp' }],
    [
      'meta',
      {
        property: 'og:description',
        content: 'Search, watch, track and download anime, from one window.',
      },
    ],
  ],

  themeConfig: {
    logo: '/logo.png',
    siteTitle: 'AniSphere Docs',

    // The row along the top, which is what the site is navigated by.
    nav: [
      { text: 'Using it', link: '/Installation', activeMatch: '/(Installation|Getting|Trouble|FAQ)' },
      {
        text: 'Architecture',
        link: '/Architecture-Overview',
        activeMatch: '/(Architecture|Provider|Data-Sources|Playback|Downloads)',
      },
      {
        text: 'Contributing',
        link: '/Development-Setup',
        activeMatch: '/(Development|Testing|Sonar|Coding|CI-And|Build|Glossary|Changelog)',
      },
      { text: 'Coverage', link: '/coverage' },
      { text: 'Legal', link: '/Legal-Disclaimer', activeMatch: '/(Legal|Licensing|Data-Privacy)' },
    ],

    sidebar: [
      {
        text: 'Using it',
        collapsed: false,
        items: [
          { text: 'Installation', link: '/Installation' },
          { text: 'Getting started', link: '/Getting-Started' },
          { text: 'Troubleshooting', link: '/Troubleshooting' },
          { text: 'FAQ', link: '/FAQ' },
        ],
      },
      {
        text: 'Architecture',
        collapsed: false,
        items: [
          { text: 'Overview', link: '/Architecture-Overview' },
          { text: 'Backend', link: '/Architecture-Backend' },
          { text: 'Frontend', link: '/Architecture-Frontend' },
          { text: 'Boundaries', link: '/Architecture-Boundaries' },
          { text: 'Provider system', link: '/Provider-System' },
          { text: 'Providers reference', link: '/Providers-Reference' },
          { text: 'Data sources', link: '/Data-Sources' },
          { text: 'Playback and proxy', link: '/Playback-And-Proxy' },
          { text: 'Downloads and offline', link: '/Downloads-And-Offline' },
        ],
      },
      {
        text: 'Contributing',
        collapsed: false,
        items: [
          { text: 'Development setup', link: '/Development-Setup' },
          { text: 'Testing', link: '/Testing' },
          { text: 'SonarQube', link: '/SonarQube' },
          { text: 'Coding standards', link: '/Coding-Standards' },
          { text: 'CI and release', link: '/CI-And-Release' },
          { text: 'Build notes', link: '/Build-Notes' },
          { text: 'Glossary', link: '/Glossary' },
          { text: 'Changelog', link: '/Changelog' },
        ],
      },
      {
        text: 'Reference',
        collapsed: false,
        items: [
          { text: 'Coverage', link: '/coverage' },
          { text: 'Legal disclaimer', link: '/Legal-Disclaimer' },
          { text: 'Licensing', link: '/Licensing' },
          { text: 'Data, privacy and security', link: '/Data-Privacy-And-Security' },
        ],
      },
    ],

    socialLinks: [{ icon: 'github', link: 'https://github.com/xeidral/anisphere' }],

    search: { provider: 'local' },

    outline: { level: [2, 3], label: 'On this page' },

    editLink: {
      pattern: 'https://github.com/xeidral/anisphere-site/edit/main/docs/:path',
      text: 'Edit this page',
    },

    footer: {
      message:
        'AniSphere is a client. It hosts nothing and streams nothing of its own.',
      copyright: 'GPLv3',
    },
  },

  // mermaid ships as ESM that Vite has to pre-bundle, and the server render
  // has to be allowed to reach into it. Without both the page renders empty.
  vite: {
    optimizeDeps: {
      include: ['mermaid'],
    },
    ssr: {
      noExternal: ['mermaid', 'vitepress-plugin-mermaid'],
    },
  },

  markdown: {
    theme: { light: 'github-light', dark: 'github-dark' },
    lineNumbers: false,
  },

  // A diagram mermaid cannot draw leaves nothing behind. Its default is to
  // append an error card to the end of the body, and in a single page app that
  // card then sits under every page the reader visits next.
  mermaid: {
    suppressErrorRendering: true,
  },
  }),
)
