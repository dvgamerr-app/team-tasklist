
const logger = require('./debuger')('LINE')
const request = require('request-promise')
// Import and Set Nuxt.js options
const LINE_API = process.env.LINE_API || 'Ca2338af8e1ae465a2541acde69cd4e0c'
module.exports = async (body) => {
  await request({ method: 'PUT', url: `http://10.101.147.48:3000/cmgpos-bot/${LINE_API}`, body, json: true })
  logger.info('Push FlexMessage.')
}
