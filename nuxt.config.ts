// https://nuxt.com/docs/api/configuration/nuxt-config

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
  ]
})
