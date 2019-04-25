<template lang="html">
  <div class="row">
    <div class="d-none d-md-flex col-36" style="height:10vh" />
    <div class="d-none d-lg-flex col-lg-12 col-xl-16 mx-auto" />
    <div class="col-36 col-lg-24 col-xl-20 mx-auto">
      <div class="row">
        <div class="col-30 col-md-24 mx-auto">
          <h2>Sign-In</h2>
          <small>Please sign-in with TOUNO.io ID to proceed.</small>
          <div class="login-form pt-3">
            <form @submit.prevent="onLogin">
              <div class="form-group">
                <input v-model="username" type="text" class="form-control username" placeholder="TEAM Account ID (@touno.io)">
                <input v-model="password" type="password" class="form-control password" placeholder="Password">
              </div>
              <div class="form-group">
                <b-form-checkbox name="checkbox-1"> Remember Me</b-form-checkbox>
              </div>
              <button :disabled="submitted" type="submit" class="btn btn-block btn-primary" v-text="submitted ? 'Please wait...' : 'Sign In'" />
            </form>
            <div class="row forgot-menu">
              <div class="col-36 pt-3">
                <b-link href="/forgot-id?username"><fa icon="external-link-alt" style="font-size:0.65rem;" /> Forgot your account ID?</b-link>
              </div>
              <div class="col-36 pt-1">
                <b-link href="/forgot-id?password"><fa icon="external-link-alt" style="font-size:0.65rem;" /> Forgot your password?</b-link>
              </div>
            </div>
          </div>
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
      })
    }
  }
}
</script>

<style lang="scss">
.login-form {
  .custom-control-label {
    font-size: 0.9rem;
  }
  .form-control {
    &.username {
      border-radius: 2px 2px 0 0;
    }
    &.password {
      margin-top: -2px;
      border-radius: 0 0 2px 2px;
    }
    &:hover, &:focus, &:active {
      box-shadow: none;
    }
  }
  .forgot-menu {
    font-size: 0.8rem;
  }
}
</style>
