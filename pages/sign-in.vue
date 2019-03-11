<template>
  <div>
    <div class="row sidenav d-none d-md-block">
      <div class="col-36 login-main-text">
        <h2>SURVEY<br> POS SERVER</h2>
        <p>Login or register from here to access.</p>
      </div>
    </div>
    <div class="row main">
      <div class="col-36 col-lg-24 col-xl-20 col-login mx-auto pt-5">
        <h2>Sign-In</h2>
        <div class="login-form">
          <form>
            <div class="form-group">
              <label>User Name</label>
              <input type="text" class="form-control" placeholder="User Name">
            </div>
            <div class="form-group">
              <label>Password</label>
              <input type="password" class="form-control" placeholder="Password">
            </div>
            <button type="submit" class="btn btn-success">Login</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    loggingIn: false,
    username: '',
    password: '',
    submitted: false
  }),
  created () {
  },
  methods: {
  }
}
</script>

<style>

</style>
