import "reflect-metadata";
import VueClipboard from 'vue3-clipboard'

export default defineNuxtPlugin(nuxtApp => {
  // Doing something with nuxtApp
  nuxtApp.vueApp.use(VueClipboard, {
    autoSetContainer: true,
    appendToBody: true,
  })
})
