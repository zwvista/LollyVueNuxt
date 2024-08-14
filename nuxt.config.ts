// https://nuxt.com/docs/api/configuration/nuxt-config

// https://github.com/nuxt/nuxt/issues/14126
import typescript from '@rollup/plugin-typescript'

// Modify the `nuxt.config.ts` file by adding to the `export default defineNuxtConfig()`
export default defineNuxtConfig({
  devServer: {
    port: 3600
  },
  devtools: { enabled: true },
  modules: ["vuetify-nuxt-module"],
  vuetify: {
    vuetifyOptions: {
      icons: {
        defaultSet: 'fa-svg',
        svg: {
          fa: {
            libraries: [
              [/* default export? */false, /* export name */ 'fas', /* library */ '@fortawesome/free-solid-svg-icons'],
              [/* default export? */false, /* export name */ 'far', /* library */ '@fortawesome/free-regular-svg-icons'],
              [/* default export? */false, /* export name */ 'fab', /* library */ '@fortawesome/free-brands-svg-icons'],
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
  build: {
    transpile: [
      // https://stackoverflow.com/questions/76130373/nuxt3-how-to-use-rxjs-in-development-mode
      'rxjs',
      // https://stackoverflow.com/questions/75728338/fontawesome-6-nuxt-3-could-not-find-one-or-more-icons-prefix-fab-icon
      '@fortawesome/vue-fontawesome'
    ]
  },
  imports: {
    dirs: ['models/**', 'view-models/**', 'services/**', 'common/**'],
    presets: [
      {
        from: 'tsyringe',
        imports: ['container']
      }
    ]
  },
})
