<template lang="html">
  <div class="row">
    <div class="d-none d-md-flex col-36" style="height: 10vh" />
    <div class="d-none d-lg-flex col-lg-12 col-xl-16">
      <img class="ml-auto todos" src="~/assets/todos_empty.svg" />
    </div>
    <div class="col-36 col-lg-24 col-xl-20 mx-auto">
      <div class="row">
        <div class="col-30 col-md-24 mx-auto">
          <h2>Sign-In</h2>
          <small>Please sign-in with TOUNO.io ID to proceed.</small>
          <div class="login-form pt-3">
            <form v-tabindex @submit.prevent="onLogin">
              <div class="form-group">
                <input
                  v-model="username"
                  tabindex="1"
                  type="text"
                  class="form-control username"
                  placeholder="TEAM Account ID (@touno.io)"
                />
                <input
                  v-model="password"
                  tabindex="2"
                  type="password"
                  class="form-control password"
                  placeholder="Password"
                />
                <small class="help-block text-danger text-bold">
                  <span v-if="errorMessage">
                    <fa icon="exclamation-triangle" />
                    {{ errorMessage }}
                  </span>
                </small>
              </div>
              <div class="form-group">
                <b-form-checkbox v-model="remember">
                  Remember Me</b-form-checkbox
                >
              </div>
              <button
                :disabled="submitted"
                tabindex="3"
                type="submit"
                class="btn btn-block btn-primary"
                v-text="
                  submitted
                    ? 'Please wait...'
                    : retry > 0
                    ? 'Retry again, Sign In'
                    : 'Sign In'
                "
              />
            </form>
            <div class="row forgot-menu">
              <div class="col-36 pt-3">
                <b-link href="/forgot-id?username"
                  ><fa icon="external-link-alt" style="font-size: 0.65rem" />
                  Forgot your account ID?</b-link
                >
              </div>
              <div class="col-36 pt-1">
                <b-link href="/forgot-id?password"
                  ><fa icon="external-link-alt" style="font-size: 0.65rem" />
                  Forgot your password?</b-link
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import bcrypt from 'bcryptjs'

export default {
  auth: false,
  middleware: 'authenticated',
  data: () => ({
    username: '',
    password: '',
    remember: false,
    submitted: false,
    retry: 0,
    errorMessage: null,
  }),
  created() {
    const signin = this.$auth.$storage.getLocalStorage('signin-remember', true)
    if (!signin) return

    if (signin.username) this.username = signin.username
    if (signin.remember) {
      this.password = signin.password
      this.remember = signin.remember
    }
    if (this.$auth.loggedIn) this.$router.replace('/')
  },
  methods: {
    async onLogin() {
      if (!this.username.trim()) {
        this.errorMessage = 'Username is empty.'
        return
      }
      if (!this.password) {
        this.errorMessage = 'Password is empty.'
        return
      }
      try {
        this.submitted = true
        const hash = bcrypt.hashSync(this.password, 4)

        await this.$auth.loginWith('local', {
          headers: {
            Authorization: `Basic ${Buffer.from(
              `${this.username.trim()}:${hash}`
            ).toString('base64')}`,
          },
          data: { expired: !this.remember },
        })
        // console.log('$auth', this.$auth)

        if (!this.$auth.loggedIn) throw new Error('Username or Password worng.')
        this.submitted = false

        this.$auth.$storage.setLocalStorage(
          'signin-remember',
          {
            username: this.username.trim(),
            password: hash,
            remember: this.remember,
          },
          true
        )

        this.$router.push({
          path: '/',
          query: JSON.parse(JSON.stringify(this.$route.query)),
        })
      } catch (ex) {
        this.errorMessage = !ex.response
          ? ex.message
          : ex.response.status > 400
          ? 'Username or Password worng.'
          : 'Server endpoint is offline.'
        this.submitted = false
        this.retry++
      }
    },
  },
}
</script>

<style lang="scss">
img.todos {
  max-width: 450px;
  width: 264px;
}
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
    &:hover,
    &:focus,
    &:active {
      box-shadow: none;
    }
  }
  .forgot-menu {
    font-size: 0.8rem;
  }
}
</style>
