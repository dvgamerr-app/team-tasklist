// // const logger = require('@debuger')('Mailer')

// module.exports = (options, templateName = null) => {
//   // if (!process.env.GMAIL_USR && !process.env.GMAIL_PWD) return logger.warning('Mailer is disabled.')
  
//   const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: { user: process.env.GMAIL_USR, pass: process.env.GMAIL_PWD }
//   })

//   // if (templateName) {

//   // }
//   // let mailOptions = {
//   //   from: 'TEAM Touno.io <info@touno.io>',
//   //   to: 'Kananek Thongkam <info.dvgamer@gmail.com>',
//   //   subject: 'Welcome to my TEAM Touno.io',
//   //   html: '<b>Do you receive this mail?</b>'
//   // }
//   return new Promise((resolve, reject) => {
//     transporter.sendMail(options, (err, info) => {
//       if (err) reject(err.response)
//       resolve({
//         error: !!err,
//         message: err.response,
//         info: info
//       })
//    })
//   })
// }