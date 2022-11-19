<!-- eslint-disable vue/no-v-html -->
<template lang="html">
  <div class="todo">
    <client-only>
      <div class="row">
        <div class="col-sm-36">
          <h3>History Version</h3>
          <small
            >by <b>{{ editor }}</b> at {{ getTaskDateTime }}</small
          >
          <hr />
        </div>
      </div>
      <div class="row">
        <div class="col-sm-36">
          <div v-for="(e, i) in getLastVersion()" :key="e.nTaskDetailId">
            <b-form-group :label-for="'chkTaskList' + e.nTaskDetailId">
              <fa :class="'text-' + getColor(e)" :icon="getIcon(e)" />
              <b class="history-text"
                ><span v-text="i + 1 + '. ' + e.sSubject"
              /></b>
              <small
                >at {{ parseDate(e.dCreated) }}
                {{ e.nVersion !== 1 ? 'updated' : 'submited' }} by
                {{ e.sName }}</small
              >
              <div
                class="history-text d-none d-md-block ml-35"
                v-html="e.sDetail"
              />
              <pre v-if="e.problem" class="ml-35" v-html="e.reason" />
              <div v-if="e.nVersion !== 1" class="history-detail">
                <div
                  v-for="d in getDetailVersion(e.nTaskDetailId)"
                  :key="d.nVersion"
                >
                  <div v-if="e.nVersion != d.nVersion">
                    <fa :class="'text-' + getColor(d)" :icon="getIcon(d)" />
                    {{ parseDate(d.dCreated) }}
                    {{ d.nVersion !== 1 ? 'updated' : 'submited' }} by
                    {{ d.sName }}
                    <pre v-if="d.problem" v-html="d.reason" />
                  </div>
                </div>
              </div>
            </b-form-group>
          </div>
        </div>
      </div>
    </client-only>
  </div>
</template>

<script>
import dayjs from 'dayjs'
export default {
  async asyncData({ redirect, params, $axios }) {
    const sKey = parseInt(params.id)
    if (isNaN(sKey)) return redirect('/history')

    const { data } = await $axios('/api/history/version/' + params.id)
    if (!data.records) return redirect('/history')

    return { editor: data.editor, tasks: data.records, taskKey: params.id }
  },
  data: () => ({
    taskKey: null,
    editor: 'Guest',
    tasks: [],
  }),
  computed: {
    getTaskDateTime() {
      return dayjs(this.taskKey, 'YYYYMMDDHHmmssSSS').format(
        'DD MMMM YYYY HH:mm:ss'
      )
    },
  },
  methods: {
    getIcon(e) {
      if (e.status === 'FAIL') {
        return 'times-circle'
      } else if (e.status === 'WARN') {
        return 'exclamation-circle'
      } else if (e.status === 'INFO') {
        return 'info-circle'
      } else if (e.status === 'PASS') {
        return 'check-circle'
      }
    },
    getColor(e) {
      if (e.status === 'FAIL') {
        return 'danger'
      } else if (e.status === 'WARN') {
        return 'warning'
      } else if (e.status === 'INFO') {
        return 'info'
      } else if (e.status === 'PASS') {
        return 'success'
      }
    },
    parseDate(date) {
      return dayjs(date).format('DD MMM YYYY HH:mm:ss')
    },
    getLastVersion() {
      const nTask = []
      return this.tasks.filter((e) => {
        if (!nTask.includes(e.nTaskDetailId)) {
          nTask.push(e.nTaskDetailId)
          return true
        } else {
          return false
        }
      })
    },
    getDetailVersion(nTaskDetailId) {
      return this.tasks.filter((e) => e.nTaskDetailId === nTaskDetailId)
    },
  },
}
</script>

<style>
.history-text {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-size: 14px;
}

.history-detail {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-size: 12px;
  color: #525252;
  padding-left: 20px;
}

.history-detail svg {
  width: 14px !important;
}

.text-fail {
  color: #ca3232;
}

.text-pass {
  color: #4caf50;
}

.ml-35 {
  margin-left: 20px;
}
</style>
