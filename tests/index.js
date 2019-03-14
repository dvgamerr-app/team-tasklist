const ldapAuth = require('../server/authication/ldap')

// .then(data => {
  // console.log(data)
// }).catch(ex => {
  // console.log(ex)
// })
let res = {}
const pwd = 'asdasd3'
const ldapTest = async () => {
  try {
    res = await ldapAuth('thkanane', pwd)
    // console.log('auth: pass, ', res.display_name)
  } catch (ex) {
    // console.log('auth: fail, ', ex)
  }
  // console.log('')
  try {
    res = await ldapAuth('thkananek@central.co.th', pwd)
    // console.log('auth: pass, ', res.display_name)
  } catch (ex) {
    // console.log('auth: fail, ', ex)
  }
  // console.log('')
  try {
    res = await ldapAuth('thkananek', pwd)
    // console.log('auth: pass, ', res && res.display_name)
  } catch (ex) {
    // console.log('auth: fail, ', ex)
  }
  // console.log('')
  try {
    res = await ldapAuth('thka', pwd)
    // console.log('auth: pass, ', res && res.display_name)
  } catch (ex) {
    // console.log('auth: fail, ', ex)
  }
}
ldapTest()