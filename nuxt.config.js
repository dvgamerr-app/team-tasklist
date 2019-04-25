const pkg = require('./package')

module.exports = {
  mode: 'universal',
  head: {
    titleTemplate: title => `${title ? `${title} · ` : ''}Team Task-List`
  },
  meta: [
    { charset: 'utf-8' },
    { name: 'application-name', content: pkg.fullname },
    { name: 'name', content: pkg.fullname },
    { name: 'description', content: pkg.description, id: 'desc' },
    { name: 'viewport', content: 'width=device-width, user-scalable=no' },
    { name: 'author', content: 'Mr. Kananek T.' }
  ],
  manifest: {
    name: 'Team Task-List Projects',
    lang: 'en',
    description: '',
    short_name: 'Team Task-List',
    icons: [
      { src: '/favicon.ico', sizes: '16x16' }
    ],
    start_url: '/',
    display: 'standalone',
    orientation: 'portrait',
    theme_color: '#ffffff',
    background_color: '#ffffff',
    browser_action: {
      default_icon: '/favicon.ico',
      default_popup: '/'
    }
  },
  workbox: {
    globDirectory: '.nuxt',
    globPatterns: [ '**/*.{js,vue,html}' ],
    swDest: 'static/sw.js'
  },
  loading: { color: '#4caf50' },
  css: [
    './assets/scss/index.scss',
    'codemirror/lib/codemirror.css',
    'vue-multiselect/dist/vue-multiselect.min.css',
    'vue-datetime/dist/vue-datetime.css'
  ],
  plugins: [
    './plugins/vue-toast.js',
    './plugins/vue-multiselect.js',
    './plugins/vue-datepicker.js',
    { src: './plugins/vue-codemirror.js', ssr: false }
  ],
  router: {
    middleware: ['auth'],
    linkActiveClass: 'active',
    linkExactActiveClass: 'active'
  },
  modules: [ 'nuxt-fontawesome',
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
  fontawesome: {
    component: 'fa',
    imports: [
      { icons: ['fas'], set: '@fortawesome/free-solid-svg-icons' }
    ]
  },
  bootstrapVue: { bootstrapCSS: false },
  axios: { baseURL: process.env.AXIOS_BASE_URL || 'https://team.touno.io/' },
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
