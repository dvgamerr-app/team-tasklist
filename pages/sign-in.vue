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
              <label>Email</label>
              <input v-model="username" type="text" class="form-control" placeholder="User Name">
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
    // await 
  },
  methods: {
    async onLogin () {
      if (!this.username || !this.password) return
      this.submitted = true
      try {
        let data = await this.$auth.loginWith('local', { data: { user: this.username.trim(), pass: this.password } })
        this.$router.replace('/')
      } catch (error) {
        console.log(error)
      }
      this.submitted = false
    }
  }
}
</script>

<style>

</style>
