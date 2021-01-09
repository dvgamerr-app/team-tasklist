// const md5 = require('md5')
const { Server } = require('@hapi/hapi')
const hapiPlugin = require('@nuxtjs/hapi')

const logger = require('@touno-io/debuger')('NUXT.JS')

const host = process.env.HOST || '127.0.0.1'
const port = process.env.PORT || 3000

const routes = require('./api')
const authication = require('./api/authication')


const NuxtBuilder = async () => {
  const server = new Server({ port, host })
  await authication(server)
  await server.register({ plugin: hapiPlugin, options: {} })
  server.route(routes)

  const { nuxt, builder } = server.plugins.nuxt

  // Init Nuxt.js
  // await project.open()
  // const { Account } = project.get()
  // if (!(await Account.findOne({ username: 'dvgamerr' }))) {
  //   await new Account({
  //     username: 'dvgamerr',
  //     fullname: 'Kananek Thongkam',
  //     email: 'info.dvgamer@gmail.com',
  //     level: 3,
  //     pwd: md5('dvg7po8ai')
  //   }).save()
  // }
  await builder.build()
  await nuxt.ready()
  
  
  await server.start()
  logger.start(`Server running on ${server.info.uri}`)
}

process.on('unhandledRejection', (err) => {
  console.log(err)
  process.exit(1)
})

NuxtBuilder().catch(ex => {
  console.error(ex)
  process.exit(1)
})
