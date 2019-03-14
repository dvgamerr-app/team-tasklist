<template>
  <div class="container pt-5 pb-3">
    <div class="row">
      <div class="col-lg-36">
        <b-form class="mb-5" @submit.prevent="onSubmit" @reset.prevent="onReset">
          <div v-for="(e, i) in tasks" :key="e.nTaskId">
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
                <b class="checker-text"><span v-text="(i + 1) + '. ' + e.sSubject" /></b>
                <span class="checker-text d-none d-md-inline" v-html="e.sDetail" />
                <div v-if="e.problem">
                  <h6 v-if="e.sSolve" class="pt-2">Solve the problem</h6>
                  <span v-if="e.sSolve" class="checker-text" v-html="e.sSolve" />
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
          <b-button type="submit" :disabled="submited" variant="primary" v-text="submited ? 'Approving...' : 'Submit'" />
          <b-button type="reset" :disabled="submited" variant="danger">Reset</b-button>
        </b-form>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
export default {
  data: () => ({
    submited: false,
    current: moment(),
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
      let data = vm.tasks.map(e => {
        return { nTaskId: e.nTaskId, selected: e.selected, problem: e.problem || false, reason: e.reason || '' }
      })
      this.submited = true
      vm.$axios.post('/api/submit', {
        username: vm.$auth.user.user_name,
        name: vm.$auth.user.name,
        tasks: vm.tasks
      }).then(({ data }) => {
        if (data.success) {
          vm.$toast.success('Thanks.')
          vm.onReset()
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
      e.reason = ''
      this.$forceUpdate()
      this.onSave()
    }
  }
}
</script>

<style>
.checker-text {
  font-family: "Segoe UI";
  font-size: 13px;
}
</style>
