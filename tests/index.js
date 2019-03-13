const ldapAuth = require('../server/authication/ldap')

ldapAuth('ad_user', 'pwd').then(data => {
  console.log(data)
}).catch(ex => {
  console.log(ex)
})