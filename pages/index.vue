<template>
  <div class="container pt-5 pb-3">
    <b-form @submit.prevent="onSubmit" @reset.prevent="onReset">
      <div v-if="taskKey" class="row">
        <div class="col-sm-36">
          <h3>History Servey</h3>
          <small>by <b>{{ editor }}</b> at {{ getTaskDateTime }}</small>
        </div>
      </div>
      <div class="row mb-5">
        <div class="col-sm-36">
          <div v-for="(e, i) in tasks" :key="e.nTaskId">
            <b-form-group :label-for="'chkTaskList' + e.nTaskId">
              <b-form-checkbox
                :id="'chkTaskList' + e.nTaskId"
                v-model="e.selected"
                :disabled="e.problem" switch required
                class="tasklist"
                name="check-button"
                @change="onChange"
              >
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
                    @change="onChange"
                  />
                </div>
              </b-form-checkbox>
            </b-form-group>
          </div>
          <hr>
        </div>
        <div class="col-sm-18">
          <div v-if="!taskKey">
            <span><b>Tasks:</b> {{ tasks.length }}</span>
            <span><b>Completed:</b> {{ getTaskSuccess }}</span>
            <span><b>Problem:</b> {{ getTaskProblem }}</span>
          </div>
        </div>
        <div class="col-sm-18 text-right">
          <b-button type="submit" :disabled="submited" variant="primary" v-text="submited ? 'Approving...' : taskKey ? 'Save' : 'Submit'" />
          <b-button v-if="!taskKey" type="reset" :disabled="submited" variant="danger">Reset</b-button>
          <nuxt-link v-else tag="button" to="/history" type="button" class="btn btn-secondary">Back</nuxt-link>
        </div>
      </div>
    </b-form>
  </div>
</template>

<script>
import moment from 'moment'
export default {
  data: () => ({
    taskKey: null,
    editor: 'Guest',
    submited: false,
    current: moment(),
    tasks: []
  }),
  computed: {
    getTaskDateTime () {
      return moment(this.taskKey, 'YYYYMMDDHHmmssSSS').format('DD MMMM YYYY HH:mm:ss')
    },
    getDateTime () {
      return this.current.format('DD MMMM YYYY HH:mm:ss')
    },
    getTaskSuccess () {
      return this.tasks.filter(e => e.selected).length
    },
    getTaskProblem () {
      return this.tasks.filter(e => e.problem).length
    }
  },
  async asyncData ({ redirect, params, $axios }) {
    if (params.id) {
      let sKey = parseInt(params.id)
      if (sKey == NaN) return redirect('/history')

      // let { data } = await $axios('/api/history/' + sKey)
      return { tasks: [], taskKey: sKey }
    } else {
      let { data } = await $axios('/api/list')
      return { tasks: data, taskKey: null }
    }
  },
  created () {
    if (!this.taskKey) {
      setInterval((() => {
        this.current = moment()
      }).bind(this), 500)
      if (process.client) {
        let survey = window.localStorage.getItem('survey.tasks')
        if (survey) {
          survey = JSON.parse(survey)
          if (this.tasks.length === survey.length && survey.filter(s => s.reason !== '' || s.selected).length > 0) this.tasks = survey
          this.$forceUpdate()
        }
      }
    }
  },
  methods: {
    onSave () {
      if (!this.taskKey && process.client && this.tasks) {
        this.$nextTick((() => {
          window.localStorage.setItem('survey.tasks', JSON.stringify(this.tasks))
        }).bind(this))
      }
    },
    onReset () {
      if (!this.taskKey) {
        for (const e of this.tasks) {
          e.selected = false
          e.problem = false
          e.reason = ''
        }
        if (process.client && this.tasks) window.localStorage.removeItem('survey.tasks')
      }
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
      if (this.taskKey) return
      this.onSave()
    },
    onChange (e) {
      this.$forceUpdate()
      if (this.taskKey) return
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
button[type=submit] {
  min-width: 120px;
}
</style>
