const pkg = require('./package')

module.exports = {
  mode: 'universal',
  head: {
    title: 'SURVEY-POS',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: pkg.description }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  loading: { color: '#999' },
  css: [
    './assets/scss/index.scss'
  ],
  plugins: [
  ],
  router: {
    middleware: ['auth']
  },
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/auth',
    '@nuxtjs/pwa',
    'bootstrap-vue/nuxt'
  ],
  auth: {
    strategies: {
      local: {
        endpoints: {
          login: { url: '/auth/login', method: 'post', propertyName: 'token' },
          logout: { url: '/auth/logout', method: 'post' },
          user: { url: '/auth/user', method: 'get', propertyName: 'user' }
        }
      }
    },
    redirect: { login: '/sign-in', logout: '/sign-in', home: '/' }
  },
  bootstrapVue: { bootstrapCSS: false },
  axios: { baseURL: process.env.AXIOS_BASE_URL || 'http://127.0.0.1:3001/' },
  build: {
    extend(config, ctx) {
      // Run ESLint on save
      if (ctx.isDev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  }
}
