const sql = require('mssql')

const db = require('./db')
module.exports = () => new Promise((resolve, reject) => {
  const conn = new sql.ConnectionPool(db[!(process.env.NODE_ENV === 'production') ? 'dev' : 'prd'])
  conn.connect(err => {
    if (err) return reject(err)
    resolve(conn)
  })
})
