const mongo = require('@touno-io/db')('db-touno-io')
mongo.set(require('./schema'))
module.exports = mongo

