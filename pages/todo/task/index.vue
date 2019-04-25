<template lang="html">
  <div class="task-list">
    <div class="row">
      <div class="col-sm-36 mb-2">
        <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-3">
          <h3 class="mb-0">Task-List</h3>
          <b-nav small pills class="small">
            <b-nav-item :active="status === 'pending'" to="/todo/task/pending">Pending <b-badge v-if="pending > 0" variant="info" v-text="pending" /></b-nav-item>
            <b-nav-item :active="status === 'waiting'" to="/todo/task/waiting">Waiting</b-nav-item>
            <b-nav-item :active="status === 'completed'" to="/todo/task/completed">Completed</b-nav-item>
            <b-nav-item :active="status === 'deleted'" to="/todo/task/deleted">Deleted</b-nav-item>
          </b-nav>
        </div>
      </div>
    </div>
    <nuxt-child :items="items" />
  </div>
</template>

<script>
import moment from 'moment'
export default {
  data: () => ({
    items: []
  }),
  computed: {
    status () {
      return this.$route.params.status || 'pending'
    },
    pending () {
      return this.items.filter(e => e.status === 'pending').length
    }
  },
  async asyncData ({ redirect, params, $axios }) {
  },
  created () {
    // this.$bvToast.toast(`This is toast`, {
    //   title: 'BootstrapVue Toast',
    //   autoHideDelay: 2000,
    //   appendToast: false
    // })
  },
  methods: {
  }
}
</script>

<style>

</style>
