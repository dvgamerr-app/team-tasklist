const request = require('request-promise')

// var http = require('http')

function buildAuthHeader(user, pass) {
    return 'Basic ' + Buffer.from(user + ':' + pass).toString('base64')
}

// proxy = 'proxy99.central.co.th'
// proxy_port = 8080
// host = 'intense-citadel-55702.herokuapp.com'
// url = 'https://intense-citadel-55702.herokuapp.com'
// user = 'wisupach'
// pass = 'aem9203915'

// var options = {
//   port: proxy_port,
//   host: proxy,
//   path: url,
//   headers: {
//     Host: host,
//     'Proxy-Authorization': 'Basic Y21nXHJpc3NkMzA0OlIhJCRkMzA0XzI=',
//   }
// }

// http.get(options, function(res) {
//   console.log("StatusCode: " + res.statusCode + " Message: " + res.statusMessage)
// })

request({
  method: 'PUT',
  proxy: 'http://61.90.197.11',
  url: `https://intense-citadel-55702.herokuapp.com/sd3-robo/C4af566ba4cf77cbc04dd1eff2f3bda38`,
  headers: {
    Host: 'intense-citadel-55702.herokuapp.com',
    'Proxy-Authorization': buildAuthHeader('central.co.th\\posalert', '111111'),
  },
  body: {
    type: 'text',
    text: 'test proxy'
  },
  json: true
}).then(data => {
  console.log('success:', data)
}).catch(ex => {
  console.error(ex.message)
  console.log(ex.options)
})
