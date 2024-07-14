// https://nuxt.com/docs/api/configuration/nuxt-config

// https://github.com/nuxt/nuxt/issues/14126
import typescript from '@rollup/plugin-typescript'

// Modify the `nuxt.config.ts` file by adding to the `export default defineNuxtConfig()`
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["vuetify-nuxt-module"],
  vuetify: {
    vuetifyOptions: {
      icons: {
        defaultSet: 'fa-svg',
        svg: {
          fa: {
            libraries: [
              [/* default export? */false, /* export name */ 'fas', /* library */ '@fortawesome/free-solid-svg-icons']
            ]
          }
        }
      }
    }
  },
  css: [
    '@fortawesome/fontawesome-svg-core/styles.css'
  ],
  // https://vitejs.dev/config/
  vite: {
    plugins: [typescript()],
  },
  // https://stackoverflow.com/questions/76130373/nuxt3-how-to-use-rxjs-in-development-mode
  build: {
    transpile: ['rxjs']
  },
  imports: {
    dirs: ['models/**', 'view-models/**', 'services/**', 'common/**'],
  },
})
