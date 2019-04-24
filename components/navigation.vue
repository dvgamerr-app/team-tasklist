<template>
  <b-navbar class="border-bottom">
    <b-container>
      <b-navbar-brand to="/">
        <fa icon="calendar-check" style="margin-top:3px;vertical-align:top;font-size:1.4rem;" />
      </b-navbar-brand>
      <b-navbar-nav>
        <b-nav-item to="/task">Tasks</b-nav-item>
        <b-nav-item to="/project">Projects</b-nav-item>
      </b-navbar-nav>
      <b-navbar-nav class="ml-auto">
        <b-nav-item exact to="/task-new"><fa icon="plus" /> Add Task</b-nav-item>
        <b-nav-item-dropdown :text="'User'" right>
          <b-dropdown-item @click.prevent="onSignOut"><fa icon="sign-out-alt" /> Logout</b-dropdown-item>
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


<style lang="scss">
.navbar {
  padding: 0rem 1rem;
  font-weight: bold;
  font-family: 'Segoe UI';
  .svg-inline--fa {
    font-weight: 100 !important;
  }
}

</style>
