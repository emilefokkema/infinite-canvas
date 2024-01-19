import { fileURLToPath } from 'url'
import { defineConfig } from 'vitepress'
import { addExamples } from '../../examples/backend/vite-plugin'
import addApi from './api-docs/serve-plugin'
import replaceVersion from './replace-version'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "InfiniteCanvas",
  ignoreDeadLinks: true,
  description: "The HTML &lt;canvas&gt; element, made infinite",
  themeConfig: {
    logo: '/logo.svg',
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/guide' },
      { text: 'API', link: '/api/' }
    ],

    sidebar: [
      {
        text: 'Getting started',
        link: '/getting-started'
      },
      {
        text: 'Guide',
        link: '/guide'
      },
      {
        text: 'API',
        link: '/api/'
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/emilefokkema/infinite-canvas' }
    ],

    outline: [2, 3]
  },
  vite: {
    build: {
      emptyOutDir: false
    },
    resolve: {
      alias: {
        'infinite-canvas': fileURLToPath(new URL('../../src/infinite-canvas.ts', import.meta.url))
      }
    },
    plugins: [
      addExamples({external: {publicPath: '/examples'}}),
      addApi(),
      replaceVersion()
    ]
  }
})
