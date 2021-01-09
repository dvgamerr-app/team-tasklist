const jsonwebtoken = require('jsonwebtoken')
const md5 = require('md5')

if (!process.env.JWT_KEYHASH) throw new Error(`Environment name 'JWT_KEYHASH' is undefined.`)

module.exports = {
  basic: {
    encode () {

    },
    decode (raw) {
      raw = raw.replace(/^basic /ig, '')
      if (!raw || raw === 'undefined') return
      try {
        raw = Buffer.from(raw, 'base64').toString()
        if (!/.*?:.*/ig.test(raw)) return
      } finally {
        //
      }
      return (/(?<usr>.*?):(?<pwd>.*)/ig.exec(raw) || {}).groups
    }
  },
  bearer: {
    encode (raw) {
      const hashId = md5('enc-io_' + (+(new Date())))
      return jsonwebtoken.sign({ hash: hashId, raw }, process.env.JWT_KEYHASH)
    },
    decode (raw) {
      raw = raw.replace(/^bearer /ig, '')
      if (!raw || raw === 'undefined') return
      return jsonwebtoken.verify(raw, process.env.JWT_KEYHASH)
    }

  }
}
