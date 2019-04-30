<template lang="html">
  <div class="task">
    <div class="row">
      <div class="col-sm-36 title">
        <h3 class="mb-0">To-Do: {{ todo.title }}</h3>
        <small>{{ getDuedate() }} assign Kananek T.</small>
        <hr>
      </div>
    </div>
    <form>
      <div class="row" />
    </form>
  </div>
</template>
<script>
import moment from 'moment'

export default {
  head: {
    title: 'Todo'
  },
  data: () => ({
    saved: false,
    validate: {
      title: null
    },
    edit: {
      project: false,
      assign: false,
      duedate: false,
      priority: false,
      label: false
    },
    todo: {
      title: '',
      project: '',
      description: '',
      assign: [],
      duedate: null,
      priority: 0,
      status: 1,
      private: false
    },
    loading: {
      project: false
    },
    time: {
      project: 0
    },
    opt: {
      project: []
    },
    optAssign: [],
    optPriority: [
      { text: 'None', value: 0 },
      { text: 'Low', value: 1 },
      { text: 'Medium', value: 2 },
      { text: 'High', value: 3 }
    ]
  }),
  computed: {
    gravatar () {
      let avatar = this.$auth.user.email ? md5(this.$auth.user.email) : '00000'
      return `//www.gravatar.com/avatar/${avatar}?d=retro&size=64`
    }
  },
  async asyncData ({ $axios, params }) {
    let { data } = await $axios.get('/api/todo/' + params.id)
    return { todo: data }
  },
  methods: {
    getDuedate () {
      let diff = !this.todo.duedate ? null : moment().diff(moment(this.todo.duedate), 'day')
      return this.todo.duedate ? `${diff > 0 ? 'over deadline past' : 'deadline in'} ${moment(this.todo.duedate).fromNow(true)}` : ''
    },
  }
}
</script>
<style lang="scss">
.task {
  .title {
    h3 {
      display: inline-block;
      width: 100%;
      white-space: nowrap;
      overflow: hidden !important;
      text-overflow: ellipsis;
    }
  }
}
</style>

