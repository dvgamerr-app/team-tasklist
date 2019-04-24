<template>
  <div>
    <div class="row sidenav d-none d-md-block">
      <div class="col-36 login-main-text">
        <h2>TEAM<br> TASK-LIST</h2>
        <p>Login or register from touno.io</p>
      </div>
    </div>
    <div class="row main">
      <div class="col-36 col-lg-24 col-xl-20 col-login mx-auto">
        <h2>Sign-In</h2>
        <div class="login-form">
          <form method="post" @submit.prevent="onLogin">
            <div class="form-group">
              <label>Username</label>
              <input v-model="username" type="text" class="form-control" placeholder="@touno.io">
            </div>
            <div class="form-group">
              <label>Password</label>
              <input v-model="password" type="password" class="form-control" placeholder="Password">
            </div>
            <button :disabled="submitted" type="submit" class="btn btn-success" v-text="submitted ? 'Please wait...' : 'Login'" />
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import md5 from 'md5'

export default {
  auth: false,
  middleware: 'authenticated',
  data: () => ({
    username: '',
    password: '',
    submitted: false
  }),
  created () {
    console.log('loggedIn', this.$auth.loggedIn)
    // if (process.client && window.localStorage.getItem('_token.local') !== 'false') this.$router.replace('/')
  },
  methods: {
    onLogin () {
      let vm = this
      if (!vm.username || !vm.password) return
      vm.submitted = true
      vm.$auth.loginWith('local', { data: { username: vm.username.trim(), password: md5(vm.password) } }).then(() => {
        if (vm.$auth.loggedIn) {
          vm.$router.replace('/')
        } else {
          vm.submitted = false
          vm.$toast.error('Username or Password worng.', { duration: 1000 })
        }
      }).catch(ex => {
        vm.submitted = false
        vm.$toast.error(ex.message, { duration: 5000 })
        console.log(ex)
      })
    }
  }
}
</script>

<style>

</style>
