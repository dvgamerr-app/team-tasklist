const { createClient } = require('ldapjs')

// LDAP Connection Settings
const name = process.env.LDAP_NAME || 'central'
const server = process.env.LDAP_SERVER_NAME || `${name}.co.th`
const adSuffix = process.env.LDAP_SUFFIX || `dc=${name},dc=co,dc=th`
const timeout = process.env.LDAP_TIMEOUT || 10000

if (!server || !adSuffix) throw new Error('LDAP connection settings not found!')

module.exports = (usr, pwd, filter) => {
  if (!usr || !pwd) throw new Error('Username or Passoword is empty!')

  const username = usr.trim()
  const password = pwd.trim()
  const adUser = !/@/g.test(username)
  const searchOptions = { scope: 'sub', filter: filter || adUser ? `(sAMAccountName=${username})` : `(userPrincipalName=${username})` }

  // Create client and bind to AD
  const client = createClient({
    url: `ldap://${server}`,
    baseDN: adSuffix,
    timeout: timeout,
    connectTimeout: timeout,
    idleTimeout: timeout
  })
  
  return new Promise((resolve, reject) => {
    const resolveClient = (data) => client.unbind(err => {
      clearTimeout(manualTimeout)
      // console.log('unbind:', !err)
      if (err) return reject(err)
      resolve(data)
    })
    const rejectClient = (ex) => {
      client.unbind(err => {
        // console.log('unbind:', !err)
        reject(err || ex)
      })
    }
    let manualTimeout = setTimeout(() => {
      rejectClient('client bind timeout.')
    }, timeout)

    // console.log('user:', adUser ? `central\\${username}` : username, password)
    client.bind((adUser ? `${name}\\${username}` : username), password, err => {
      // console.log('bind:', !err)
      if (err) return resolveClient({ err: err.lde_message })
      // Search AD for user
      client.search(adSuffix, searchOptions, (err, res) => {
        if (err) return rejectClient(err)

        let result = []
        res.on('searchEntry', entry => {
          // console.log('search-entry:', !!entry)
          let user = entry.object
          let output = {
            title: user.title,
            company: user.company,
            department: user.department,
            office_name: user.physicalDeliveryOfficeName,
            description: user.description,
            name: user.name,
            mail: user.mail,
            display_name: user.displayName,
            telephone_no: user.telephoneNumber,
            user_name: user.sAMAccountName,
            user_type: user.sAMAccountType,
          }
          if (!filter) resolveClient(output); else result.push(output)
        })
        if (filter) res.on('search-end', () => {
          // console.log('end:', !!entry)
          resolveClient(result)
        })

        res.on('search-error', err => {
          // console.log('error:', !err)
          return rejectClient(err)
        })
      })
    })
  })  
}
