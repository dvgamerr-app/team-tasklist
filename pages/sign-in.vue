<template>
  <div>
    <div class="row sidenav d-none d-md-block">
      <div class="col-36 login-main-text">
        <h2>SURVEY<br> POS SERVER</h2>
        <p>Login or register from here to access.</p>
      </div>
    </div>
    <div class="row main">
      <div class="col-36 col-lg-24 col-xl-20 col-login mx-auto">
        <h2>Sign-In</h2>
        <div class="login-form">
          <form method="post" @submit.prevent="onLogin">
            <div class="form-group">
              <label>ADUser or Email</label>
              <input v-model="username" type="text" class="form-control" placeholder="@central.co.th">
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
export default {
  auth: false,
  middleware: ['signin'],
  data: () => ({
    username: '',
    password: '',
    submitted: false
  }),
  created () {
    if (this.$auth.loggedIn) this.$router.replace('/') 
    // await 
  },
  methods: {
    onLogin () {
      if (!this.username || !this.password) return
      this.submitted = true
      this.$auth.loginWith('local', { data: { user: this.username.trim(), pass: this.password } }).then(() => {
        if (this.$auth.loggedIn) {
          this.$router.push('/')
        } else {
          this.submitted = false
          this.$toast.error('Username or Password worng.', { duration: 1000 })
        }
      }).catch(ex => {
        this.submitted = false
        this.$toast.error(ex.message, { duration: 5000 })
        console.log(ex)
      })
    }
  }
}
</script>

<style>

</style>
