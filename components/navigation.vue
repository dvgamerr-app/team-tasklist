<template lang="html">
  <b-navbar class="border-bottom mb-3">
    <no-ssr>
      <vue-loading :active="fullscreen" :is-full-screen="true" />
    </no-ssr>
    <b-container>
      <b-navbar-brand to="/">
        <fa icon="calendar-check" /> <b>TEAM</b> <small>Task List</small>
      </b-navbar-brand>
      <b-navbar-nav v-if="$auth.loggedIn" class="ml-auto">
        <b-nav-item-dropdown size="sm" text="Todo" right>
          <b-dropdown-item to="/todo/new"><fa icon="plus" /> New</b-dropdown-item>
          <b-dropdown-divider />
          <b-dropdown-item to="/todo/task">Tasks List</b-dropdown-item>
          <b-dropdown-item to="/todo/project">Project</b-dropdown-item>
        </b-nav-item-dropdown>
        <b-nav-item-dropdown size="sm" no-caret right>
          <template slot="button-content" lang="html">
            <fa icon="cog" />
          </template>
          <b-dropdown-header>Account</b-dropdown-header>
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
      margin-top: 5px;
      vertical-align: top;
      font-size:1.4rem;
    }
  }
  .nav-item {
    font-size: 0.85rem;
    cursor: pointer;
  }
}

</style>
