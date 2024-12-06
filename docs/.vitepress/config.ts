import { fileURLToPath } from 'url'
import { defineConfig } from 'vitepress'
import { createViteConfig as createExamplesViteConfig } from '../../examples/runner/create-vite-config'
import { addInfiniteCanvas } from '../../src/add-infinite-canvas'
import { serveOther, buildOther, OtherOptions } from '../../utils/vite'
import addApi from './api-docs/serve-plugin'
import replaceVersion from './replace-version'

const exampleInfiniteCanvasPath = fileURLToPath(new URL('./theme/infinite-canvas-example/example-infinite-canvas.ts', import.meta.url))
const examplesOptions: OtherOptions = {
  id: 'examples',
  path: '/examples',
  config: createExamplesViteConfig({
    infiniteCanvasPath: exampleInfiniteCanvasPath
  })
};

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
    clearScreen: false,
    server: {
      port: 5173,
      strictPort: true
    },
    plugins: [
      addInfiniteCanvas(),
      serveOther({
        ...examplesOptions,
        server: {port: 5173}
      }),
      buildOther(examplesOptions),
      addApi(),
      replaceVersion()
    ]
  }
})
