<template>
  <b-navbar class="border-bottom">
    <b-container>
      <b-navbar-brand to="/">
        <img src="~assets/time_data-512.png" style="width:24px;padding-top:3px;vertical-align:top;">
      </b-navbar-brand>
      <b-navbar-nav>
        <b-nav-item to="/task">Tasks</b-nav-item>
        <b-nav-item to="/project">Projects</b-nav-item>
      </b-navbar-nav>
      <b-navbar-nav class="ml-auto">
        <b-nav-item exact to="/task-new"><fa icon="plus" /> Add Task</b-nav-item>
        <b-nav-item-dropdown :text="'User'" right>
          <b-dropdown-item @click.prevent="onSignOut">Logout</b-dropdown-item>
        </b-nav-item-dropdown>
      </b-navbar-nav>
    </b-container>
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
.navbar {
  padding: 0rem 1rem;
  font-weight: bold;
  font-family: 'Segoe UI';
}
</style>
