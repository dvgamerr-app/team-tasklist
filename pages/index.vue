<template>
  <div class="container">
    <div class="row">
      <div class="col-lg-36">
        <h2 class="mt-5 mb-5" />
        <b-form class="mb-5" @submit.prevent="onSubmit" @reset.prevent="onReset">
          <div v-for="e in tasks" :key="e.nTaskId">
            <b-form-group :label-for="'chkTaskList' + e.nTaskId">
              <b-form-checkbox :id="'chkTaskList' + e.nTaskId" v-model="e.selected" :disabled="e.problem" switch required class="tasklist" name="check-button">
                <b-button
                  class="problem"
                  type="button"
                  size="sm"
                  :variant="!e.problem ? 'outline-secondary' : 'outline-danger'"
                  @click="onReason(e)"
                  v-text="!e.problem ? 'Problem' : 'Cancel'"
                />
                <b><span v-text="e.sSubject" /></b>
                <span class="d-none d-md-inline" v-html="e.sDetail" />
                <div v-if="e.problem">
                  <h4 v-if="e.sSolve">Solve the problem</h4>
                  <span v-if="e.sSolve" v-html="e.sSolve" />
                  <b-form-textarea
                    id="txtReason"
                    v-model="e.reason"
                    class="mt-3"
                    style="width:600px;"
                    :required="e.problem"
                    :state="e.reason.length >= 10"
                    size="sm"
                    maxlength="500"
                    placeholder="Enter at least 10 characters"
                    rows="3"
                  />
                </div>
              </b-form-checkbox>
            </b-form-group>
          </div>
          <b-button type="submit" variant="primary">Submit</b-button>
          <b-button type="reset" variant="danger">Reset</b-button>
        </b-form>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
export default {
  data: () => ({
    current: moment(),
    username: '',
    tasks: []
  }),
  computed: {
    getDateTime () {
      return this.current.format('DD MMMM YYYY HH:mm:ss')
    }
  },
  async asyncData ({ $axios }) {
    let { data } = await $axios('/api/list')
    return { tasks: data }
  },
  created () {
    setInterval((() => {
      this.current = moment()
      this.onSave()
    }).bind(this), 500)
    if (process.client) {
      this.username = window.localStorage.getItem('survey.username') || ''
      let survey = window.localStorage.getItem('survey.tasks')
      if (survey && survey !== '') {
        survey = JSON.parse(survey)
        if (this.tasks.length === survey.length && survey.filter(s => s.reason !== '' || s.selected).length > 0) this.tasks = survey
        this.$forceUpdate()
      }
    }
  },
  methods: {
    onSave () {
      if (process.client) {
        window.localStorage.setItem('survey.username', this.username)
        if(this.tasks) window.localStorage.setItem('survey.tasks', JSON.stringify(this.tasks))
      }
    },
    onReset () {
      for (const e of this.tasks) {
        e.selected = false
        e.problem = false
        e.reason = ''
      }
      this.onSave()
    },
    onSubmit () {
      let vm = this
      vm.$axios.post('/api/submit', {
        username: vm.username,
        tasks: vm.tasks
      }).then(res => {
        console.log(res)
        vm.onReset()
      }).catch(ex => {
        console.error(ex)
      })
    },
    onReason (e) {
      e.selected = false
      e.problem = !e.problem
      e.reason = ''
      this.$forceUpdate()
      this.onSave()
    }
  }
}
</script>

<style>

</style>
