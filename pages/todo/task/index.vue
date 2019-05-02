<template lang="html">
  <div class="task-list">
    <div class="row">
      <div class="col-sm-36 mb-2 ">
        <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-3">
          <h3 class="mb-0">Task-List</h3>
          <div class="box-filter">
            aa
          </div>
          <!-- <b-nav small pills class="small">
            <b-nav-item :active="status === 'pending'" to="/todo/task/pending">Pending <b-badge v-if="pending > 0" variant="info" v-text="pending" /></b-nav-item>
            <b-nav-item :active="status === 'processing'" to="/todo/task/processing">Processing</b-nav-item>
            <b-nav-item :active="status === 'completed'" to="/todo/task/completed">Completed</b-nav-item>
            <b-nav-item :active="status === 'deleted'" to="/todo/task/deleted">Deleted</b-nav-item>
          </b-nav> -->
        </div>
        <hr>
      </div>
    </div>
    <div class="row">
      <div class="col-sm-36 box f-sm">
        <div v-for="e in getFilterItems()" :key="e._id" class="box-row pb-2 border-bottom pl-2 pt-1">
          <span class="pr-1">
            <fa :icon="getTaskIcon(e)" :class="getTaskClass(e)" />
          </span>
          <nuxt-link :to="`/todo/task/${e._id}`" class="v-align-middle no-underline h5" v-text="e.title" />
          <div class="f-xs text-muted pl-3 ml-1">
            <span v-if="e.duedate" class="duedate-by" v-text="getDuedate(e)" />
            <span v-else class="opened-by" v-text="getOpened(e)" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
export default {
  head: {
    title: 'Tasks'
  },
  data: () => ({
    filter: {
      status: 1
    },
    items: []
  }),
  computed: {
  },
  async asyncData ({ $axios, params }) {
    const { data } = await $axios.get(`/api/todo/list/1`)
    return { items: data }
  },
  created () {
  },
  methods: {
    isOverDuedate (date) {
      return !e.duedate ? false : moment().diff(moment(date), 'day') > 0
    },
    getFilterItems () {
      let data = this.items.filter(e => e.status === this.filter.status)
      data = data.sort((a, b) => !a.duedate || !b.duedate ? -1 : a.duedate > b.duedate ? 1 : -1)
      return data
    },
    getDuedate (e) {
      let diff = !e.duedate ? null : moment().diff(moment(e.duedate), 'day')
      return e.duedate ? `${diff > 0 ? 'over deadline past' : 'deadline in'} ${moment(e.duedate).fromNow(true)}` : ''
    },
    getOpened (e) {
      return `opened ${moment(e.created).fromNow()} by ${e.owner.name}`
    },
    getTaskIcon (e) {
      return e.private ? 'lock' : 'clock'
    },
    getTaskClass (e) {
      let diff = !e.duedate ? null : moment().diff(moment(e.duedate), 'day')
      return !e.duedate ? 'text-muted' : diff === null ? '' : diff >= -1 ? 'text-danger' : diff > -7 ? 'text-warning' : ''
    }
  }
}
</script>

<style lang="scss" scoped>
.box-row {
  display: inline-block;
  width: 100%;
  white-space: nowrap;
  overflow: hidden !important;
  text-overflow: ellipsis;
  .h5.no-underline {
    text-decoration: none;
    color: #333;
  }
  .h5.no-underline:hover {
    color: #0366d6;
  }
}
</style>

