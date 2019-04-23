<template>
  <div class="container pt-5 pb-3">
    <div class="row">
      <div class="col-sm-36 mb-2">
        <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-3">
          <h3 class="mb-0">Task-List</h3>
          <b-nav small pills class="small">
            <b-nav-item :active="status === 'pending'" to="/task/pending">Pending <b-badge v-if="pending > 0" variant="info" v-text="pending" /></b-nav-item>
            <b-nav-item :active="status === 'waiting'" to="/task/waiting">Waiting</b-nav-item>
            <b-nav-item :active="status === 'completed'" to="/task/completed">Completed</b-nav-item>
            <b-nav-item :active="status === 'deleted'" to="/task/deleted">Deleted</b-nav-item>
          </b-nav>
        </div>
      </div>
    </div>
    <nuxt-child />
  </div>
</template>

<script>
import moment from 'moment'
export default {
  auth: false,
  data: () => ({
    tasks: [],
    fields: [
      { key: 'description', label: 'Description', sortable: true },
      { key: 'project', label: 'Project', sortable: true },
      { key: 'duedate', label: 'Due', sortable: true },
      { key: 'tag', label: 'Tag', sortable: true },
      { key: 'priority', label: 'Priority', sortable: false },
      { key: 'action', label: 'Action', sortable: false }
    ],
    items: [
      // { description: 'Dickerson', project: 'Macdonald', duedate: 'Macdonald', tag: 'Macdonald', priority: 'Macdonald' },
      // { description: 'Dickerson', project: 'Macdonald', duedate: 'Macdonald', tag: 'Macdonald', priority: 'Macdonald' },
      // { description: 'Dickerson', project: 'Macdonald', duedate: 'Macdonald', tag: 'Macdonald', priority: 'Macdonald' },
      // { description: 'Dickerson', project: 'Macdonald', duedate: 'Macdonald', tag: 'Macdonald', priority: 'Macdonald' }
    ]
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
    // if (params.id) {
    //   let sKey = parseInt(params.id)
    //   if (sKey == NaN) return redirect('/history')

    //   let { data } = await $axios('/api/history/' + params.id)
    //   if (!data.records) return redirect('/history')
      
    //   return { editor: data.editor, tasks: data.records, taskKey: params.id }
    // } else {
    //   let { data } = await $axios('/api/history/detail/1')
    //   return { title: data.title, tasks: data.tasks, taskKey: null }
    // }
  },
  created () {
    // if (!this.taskKey) {
    //   setInterval((() => {
    //     this.current = moment()
    //   }).bind(this), 500)
    //   if (process.client) {
    //     let survey = window.localStorage.getItem('survey.tasks')
    //     if (survey) {
    //       survey = JSON.parse(survey)
    //       if (this.tasks.length === survey.length && survey.filter(s => s.reason !== '' || s.selected).length > 0) this.tasks = survey
    //       this.problem = 0
    //       for (const i of this.tasks) {
    //         this.problem += i.problem ? 1 : 0
    //       }
    //       this.$forceUpdate()
    //     }
    //   }
    // }
  },
  methods: {
    onSave () {
      if (!this.taskKey && process.client && this.tasks) {
        this.$nextTick((() => {
          window.localStorage.setItem('survey.tasks', JSON.stringify(this.tasks))
        }).bind(this))
      }
    },
    onCheckAll () {
      let checkAll = this.tasks.length ===  this.tasks.filter(e => e.selected).length
      if (checkAll) return this.onReset()
      
      for (const e of this.tasks) {
        e.selected = true
        e.problem = false
        e.reason = ''
        e.status = ''
      }
      this.problem = 0
      this.$forceUpdate()
      this.onSave()
    },
    onReset () {
      if (!this.taskKey) {
        this.problem = 0
        for (const e of this.tasks) {
          e.selected = false
          e.problem = false
          e.reason = ''
          e.status = ''
        }
        this.$forceUpdate()
        if (process.client && this.tasks) window.localStorage.removeItem('survey.tasks')
      }
    },
    onSubmit () {
      let vm = this
      let data = vm.tasks.map(e => {
        return {
          nTaskDetailId: e.nTaskDetailId,
          nOrder: e.nOrder,
          sSubject: e.sSubject,
          selected: e.selected,
          status: e.problem ? e.status : '',
          problem: e.problem || false,
          reason: e.problem ? e.reason : ''
        }
      })
      this.submited = true
      vm.$axios.post('/api/history/submit', {
        key: vm.taskKey,
        username: vm.$auth.user.user_name,
        name: vm.$auth.user.name,
        tasks: vm.tasks
      }).then(({ data }) => {
        if (data.success) {
          if (!this.taskKey) {
            vm.$toast.success('Thanks.')
            vm.onReset()
          } else {
            vm.$toast.success('Task Updated.')
            vm.$router.push('/history')
          }
        } else {
          vm.$toast.error('Error API')
        }
        this.submited = false
      }).catch(ex => {
        vm.$toast.error(ex.message)
        this.submited = false
      })
    },
    onReason (e) {
      e.selected = false
      e.problem = !e.problem
      if (!e.status) e.status = e.problem ? 'FAIL' : ''
      if (!e.problem) e.status = ''
      this.$forceUpdate()

      this.problem = 0
      for (const i of this.tasks) {
        this.problem += i.problem ? 1 : 0
      }
      if (this.taskKey) return
      this.onSave()
    },
    onChange () {
      this.$forceUpdate()
      if (this.taskKey) return
      this.onSave()
    },
    onStatus (e, text) {
      e.status = text
      this.$forceUpdate()
      if (this.taskKey) return
      this.onSave()
    }
  }
}
</script>

<style>

</style>
