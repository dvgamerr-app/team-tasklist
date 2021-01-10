<template lang="html">
  <div class="task-list">
    <div class="row">
      <div class="col-sm-36 mb-2 ">
        <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-3">
          <h3 class="mb-0">Task-List</h3>
          <div class="box-filter">
            <b-dropdown slot="button" variant="outline-primary" right size="sm">
              <template slot="button-content">Status</template>
              <b-dropdown-item :active="filter.status === 1" href="#" class="f-sm" @click.prevent="setStatus(1)">Processing</b-dropdown-item>
              <b-dropdown-item :active="filter.status === 2" href="#" class="f-sm" @click.prevent="setStatus(2)">Waiting</b-dropdown-item>
              <b-dropdown-item :active="filter.status === 3" href="#" class="f-sm" @click.prevent="setStatus(3)">Complaed</b-dropdown-item>
            </b-dropdown>
          </div>
        </div>
        <hr>
      </div>
    </div>
    <div class="row">
      <div v-if="items.length === 0" class="col-md-24 offset-md-6 box f-sm">
        <div class="todos-empty-content">
          <h4>Todos let you see what you should do next</h4>
          <p>When todo assigned to you this will trigger a new item in your todo list, automatically.</p>
          <p>You will always know what to work on next.</p>
        </div>
      </div>
      <div class="col-sm-36 box f-sm">
        <div v-for="e in getFilterItems()" :key="e._id" class="box-row pb-2 border-bottom pl-2 pt-1">
          <span class="icon">
            <fa :icon="getTaskIcon(e)" :class="getTaskClass(e)" />
          </span>
          <nuxt-link :to="`/todo/task/${e._id}`" class="v-align-middle no-underline h5" v-text="e.title" />
          <div class="f-xs text-muted desc">
            <span v-if="e.priority" class="badge badge-warning priority" v-text="getPriority(e)" />
            <span v-if="e.duedate" class="duedate-by" v-text="getDuedate(e)" />
            <span v-else class="opened-by" v-text="getOpened(e)" />
            <span v-for="user in e.assign" :key="user._id" class="badge badge-info" v-text="user.name" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs'
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
  async asyncData ({ $axios }) {
    // const { data } = await $axios.get(`/api/todo/list/1`)
    // if (data.error) throw new Error(data.error)
    return { items: [] }
  },
  created () {
  },
  methods: {
    getFilterItems () {
      let data = this.items.filter(e => e.status === this.filter.status)
      data = data.sort((a, b) => !a.duedate || !b.duedate ? -1 : a.duedate > b.duedate ? 1 : -1)
      return data
    },
    getDuedate (e) {
      let diff = !e.duedate ? null : dayjs().diff(dayjs(e.duedate), 'day')
      return e.duedate ? `${diff > 0 ? 'over deadline past' : 'deadline in'} ${dayjs(e.duedate).fromNow(true)}` : ''
    },
    getOpened (e) {
      return `opened ${dayjs(e.created).fromNow()} by ${e.owner.name}`
    },
    getPriority (e) {
      return e.priority === 1 ? 'Low' : e.priority === 2 ? 'Medium' : e.priority === 3 ? 'High' : ''
    },
    getTaskIcon (e) {
      return e.private ? 'lock' : e.duedate ? 'clock' : 'thumbtack'
    },
    getTaskClass (e) {
      let diff = !e.duedate ? null : dayjs().diff(dayjs(e.duedate), 'day')
      return !e.duedate ? 'text-muted' : diff === null ? '' : diff >= -1 ? 'text-danger' : diff > -7 ? 'text-warning' : ''
    },
    async setStatus (data) {
      if (this.filter.status === data) return
      this.filter.status = data
      await this.reloadTodoItems()
    },
    async reloadTodoItems () {
      const { data } = await this.$axios.get(`/api/todo/list/${this.filter.status}`)
      this.items = data
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
  .icon {
    width: 18px;
    display: inline-block;
  }
  .desc {
    margin-left: 1.45rem;
  }
  .h5.no-underline {
    text-decoration: none;
    color: #333;
  }
  .h5.no-underline:hover {
    color: #0366d6;
  }
}
</style>

