// https://nuxt.com/docs/api/configuration/nuxt-config
// eslint-disable-next-line no-undef
export default defineNuxtConfig({
  // server: {
  //   port: 8080
  // },
  srcDir: './src',
  // head: {
  //   titleTemplate: `%s TEAMList`,
  //   meta: [
  //     { charset: 'utf-8' },
  //     { name: 'name', content: 'TEAM TaskList' },
  //     { name: 'application-name', content: 'TEAM TaskList' },
  //     { name: 'description', content: 'To-Do project project timeline with waterfall model.',
  //     },
  //     { name: 'viewport', content: 'width=device-width, initial-scale=1' },
  //     { hid: 'description', name: 'description', content: '' },
  //     { name: 'format-detection', content: 'telephone=no' },
  //   ],
  //   link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  // },
  css: ['primeflex/primeflex.css'],
  // plugins: [
  //   { src: './plugins/vue-loading.js', ssr: false },
  // ],
  // components: true,
  // buildModules: [
  //   '@nuxtjs/google-fonts',
  //   '@nuxtjs/eslint-module',
  //   '@nuxtjs/stylelint-module',
  // ],

  // Modules: https://go.nuxtjs.dev/config-modules
  // modules: [
  //   'primevue/nuxt',
  //   '@nuxtjs/axios',
  //   '@nuxtjs/pwa',
  // ],
  // googleFonts: {
  //   prefetch: false,
  //   families: {
  //     'Open Sans': [400, 500, 700],
  //     Roboto: [400, 700],
  //     Poppins: [400, 700],
  //     Mulish: [400, 700],
  //   },
  // },
  // axios: {
  //   baseURL: '/',
  // },
  // pwa: {
  //   manifest: {
  //     lang: 'en',
  //   },
  // },
  build: {
    transpile: ['primevue'],
  },
})
