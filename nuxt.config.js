const isDev = process.env.NODE_ENV === 'development'

export default {
  server: { port: 8080 },
  head: {
    titleTemplate: `%s TList`,
    meta: [
      { charset: 'utf-8' },
      { name: 'name', content: 'TEAM TaskList' },
      { name: 'application-name', content: 'TEAM TaskList' },
      {
        name: 'description',
        content: 'To-Do project project timeline with waterfall model.',
        id: 'desc',
      },
      { 'http-equiv': 'X-UA-Compatible', content: 'IE=edge' },
      {
        name: 'viewport',
        content:
          'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no',
      },
      { name: 'MobileOptimized', content: 'width' },
      { name: 'HandheldFriendly', content: 'true' },
      { name: 'author', content: 'Mr. Kananek T.' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    script: [
      isDev
        ? ''
        : {
            src: 'https://static.cloudflareinsights.com/beacon.min.js',
            'data-cf-beacon': '{"token": "fb5b3ae4504f483f8a77f9d83d215c9c"}',
            defer: true,
          },
    ],
  },
  css: ['~/assets/scss/index.scss'],
  components: true,
  buildModules: [
    '@nuxtjs/google-fonts',
    '@nuxt/typescript-build',
    '@nuxtjs/stylelint-module',
  ],
  modules: ['@nuxtjs/axios', '@nuxtjs/pwa', '@nuxtjs/auth-next'],
  plugins: [
    // './plugins/vue-fontawesome.js',
    // './plugins/vue-toast.js',
    // './plugins/vue-tabindex.js',
    // './plugins/vue-multiselect.js',
    { src: './plugins/vue-loading.js', ssr: false },
    // { src: './plugins/vue-codemirror.js', ssr: false }
  ],
  googleFonts: {
    prefetch: false,
    families: {
      'Open Sans': [400, 500, 700],
      Roboto: [400, 700],
      Poppins: [400, 700],
      Mulish: [400, 700],
    },
  },
  axios: {
    baseURL: '/',
  },
  pwa: {
    manifest: {
      lang: 'en',
    },
  },
  build: {},
}
