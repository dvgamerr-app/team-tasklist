<template>
  <b-navbar v-if="$route.name !== 'sign-in'" type="dark" variant="dark">
    <b-navbar-brand to="/">
      [POS] SERVER SURVEY
    </b-navbar-brand>
    <b-navbar-nav class="ml-auto">
      <b-nav-item exact to="/">Home</b-nav-item>
      <b-nav-item to="/history">History</b-nav-item>
      <b-nav-item-dropdown :text="$auth.user.name" right>
        <b-dropdown-item @click.prevent="onSignOut">Logout</b-dropdown-item>
      </b-nav-item-dropdown>
    </b-navbar-nav>
  </b-navbar>
</template>
<script>
export default {
  created () {
  },
  methods: {
    onSignOut () {
      this.$auth.logout()
    }
  }
}
</script>


<style>

</style>
