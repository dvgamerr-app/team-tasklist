<template>
  <div class="container pt-5 pb-3">
    <no-ssr>
      <div class="row">
        <div class="col-sm-36">
          <h3>History Version</h3>
          <small>by <b>{{ editor }}</b> at {{ getTaskDateTime }}</small>
          <hr>
        </div>
      </div>
      <div class="row">
        <div class="col-sm-36">
          <div v-for="(e, i) in getLastVersion()" :key="e.nTaskId">
            <b-form-group :label-for="'chkTaskList' + e.nTaskId">
              <fa :class="!e.problem ? 'text-pass' : 'text-fail'" :icon="!e.problem ? 'check-square' : 'window-close'" />
              <b class="history-text"><span v-text="(i + 1) + '. ' + e.sSubject" /></b>
              <span class="history-text d-none d-md-inline" v-html="e.sDetail" />
              <div v-if="e.nVersion !== 1" class="history-detail">
                <div v-for="d in getDetailVersion(e.nTaskId)" :key="d.nVersion">
                  <fa :class="!d.problem ? 'text-pass' : 'text-fail'" :icon="!d.problem ? 'check-square' : 'window-close'" />
                  {{ parseDate(d.dCreated) }} updated by {{ d.sName }}
                  <pre v-if="d.problem" v-html="d.reason" />
                </div>
              </div>
            </b-form-group>
          </div>
        </div>
      </div>
    </no-ssr>
  </div>
</template>

<script>
import moment from 'moment'
export default {
  data: () => ({
    taskKey: null,
    editor: 'Guest',
    tasks: []
  }),
  computed: {
    getTaskDateTime () {
      return moment(this.taskKey, 'YYYYMMDDHHmmssSSS').format('DD MMMM YYYY HH:mm:ss')
    }
  },
  async asyncData ({ redirect, params, $axios }) {
    let sKey = parseInt(params.id)
    if (sKey == NaN) return redirect('/history')

    let { data } = await $axios('/api/version/' + sKey)
    if (!data.records) return redirect('/history')
    
    return { editor: data.editor, tasks: data.records, taskKey: sKey }
  },
  methods: {
    parseDate (date) {
      return moment(date).format('DD MMM YYYY HH:mm:ss')
    },
    getLastVersion () {
      let nTask = []
      return this.tasks.filter(e => {
        if (nTask.indexOf(e.nTaskId) === -1) {
          nTask.push(e.nTaskId)
          return true
        } else {
          return false
        }
      })
    },
    getDetailVersion (nTaskId) {
      return this.tasks.filter(e => e.nTaskId === nTaskId)
    }
  }
}
</script>

<style>
.history-text {
  font-family: "Segoe UI";
  font-size: 14px;
}
.history-detail {
  font-family: "Segoe UI";
  font-size: 12px;
  color: #525252;
  padding-left: 20px;
}
.history-detail svg {
  width: 14px !important;
}
.text-fail {
  color: #ca3232
}
.text-pass {
  color: #4caf50
}
</style>
