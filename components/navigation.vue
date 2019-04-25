<template lang="html">
  <b-navbar class="border-bottom mb-3">
    <no-ssr>
      <vue-loading :active="fullscreen" :is-full-screen="true" />
    </no-ssr>
    <b-container>
      <b-navbar-brand to="/">
        <fa icon="calendar-check" /> <b>TEAM</b> <small>Todo</small>
      </b-navbar-brand>
      <b-navbar-nav v-if="$auth.loggedIn" class="ml-auto">
        <b-nav-item-dropdown :text="'TODO'" right>
          <b-dropdown-item exact to="/task-new"><fa icon="plus" /> Add Task</b-dropdown-item>
          <b-dropdown-item to="/task">Tasks</b-dropdown-item>
          <b-dropdown-item to="/project">Projects</b-dropdown-item>
        </b-nav-item-dropdown>
        <b-nav-item-dropdown :text="'Setting'" right>
          <b-dropdown-item @click.prevent="onSignOut"><fa icon="sign-out-alt" /> Logout</b-dropdown-item>
        </b-nav-item-dropdown>
      </b-navbar-nav>
    </b-container>
  </b-navbar>
</template>
<script>
export default {
  data: () => ({
    fullscreen: false
  }),
  methods: {
    async onSignOut () {
      this.fullscreen = true;
      await this.$auth.logout()
      this.fullscreen = false;
    }
  }
}
</script>

<style lang="scss">
.navbar {
  padding: 0rem 1rem;
  font-family: 'Segoe UI';
  .navbar-brand {
    color: #ee5151 !important;
    small {
      color: #3f3f3f;
    }
    .svg-inline--fa {
      color: #ee5151;
      margin-top: 3px;
      vertical-align: top;
      font-size:1.4rem;
    }
  }
}

</style>
