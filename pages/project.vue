<template lang="html">
  <div class="container pt-5 pb-3 projects">
    <div class="row">
      <div class="col-sm-36">
        <h3>Projects</h3>
        <small>History project detail and hide at 30 days lasted and completed.</small>
        <hr>
      </div>
    </div>
    <div class="row mt-3">
      <div class="col-36">
        <div class="card mb-2">
          <div class="card-header">
            <div class="d-flex flex-wrap">
              <nuxt-link to="/">
                <h5 class="mr-3 mb-1">Team Task-List</h5>
              </nuxt-link>
              <b-badge v-if="1 > 1" variant="success" v-text="'Completed'" />
              <b-badge v-if="1 > 0" variant="info" v-text="'To-do ' + 2" />
              <b-badge v-if="1 > 0" variant="warning" v-text="'Issue ' + 3" />
            </div>
            <b-progress :value="30" height="0.5rem" animated />
          </div>
          <div class="card-body pt-0">
            <div class="group-detail">
              <b>DueDate:</b> 26 Apr 2019
              <b>Assign: </b> Kananek Thongkam
              <p>update dashboard.</p>
            </div>
          </div>
        </div>
        <div class="card mb-2">
          <div class="card-header">
            <div class="d-flex flex-wrap">
              <nuxt-link to="/">
                <h5 class="mr-3 mb-1">Team Task-List Server-Side</h5>
              </nuxt-link>
              <b-badge variant="success" v-text="'Completed'" />
            </div>
            <b-progress v-if="false" :value="30" height="0.5rem" animated />
          </div>
          <div class="card-body pt-0">
            <div class="group-detail">
              <b>Assign: </b> Kananek Thongkam
            </div>
          </div>
        </div>
        <div v-for="(day, i) in getGroupHistory()" :key="day" class="group-history">
          <h6 v-text="parseDays(day)" />
          <div v-for="e in filterHistory(day)" :key="e.nRow" class="text-inline">
            <button v-if="$auth.user.user_level >= 4" type="button" class="btn btn-sm btn-icon" @click.prevent="onDelete(e.sKey)">
              <fa icon="trash-alt" />
            </button>
            <button type="button" class="btn btn-sm btn-icon" @click.prevent="onEdit(e.sKey)">
              <fa icon="edit" />
            </button>
            <span><fa :icon="getIcon(e)" :class="'text-'+getColor(e)" /></span>
            <b><a href="#" @click.prevent="onView(e.sKey)" v-text="e.sTitleName" /></b>
            <b v-text="toTime(e.dCreated, i)" />
            <b-badge v-if="e.nFail > 0" variant="danger" v-text="'Fail ' + e.nFail" />
            <b-badge v-if="e.nWarn > 0" variant="warning" v-text="'Warning ' + e.nWarn" />
            <b-badge v-if="e.nInfo > 0" variant="info" v-text="'Info ' + e.nInfo" />
            <small v-text="'by ' + e.sName" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'

export default {
  data: () => ({
    history: [],
    editor: false
  }),
  async asyncData ({ $axios }) {
    return { history: [] }
  },
  methods: {
    toTime (datetime, i) {
      return (i > 0 ? moment(datetime).format('[at] HH:mm') : moment(datetime).fromNow())
    },
    parseDays (day) {
      return moment(day).calendar(null, {
        sameDay: '[Today]',
        nextDay: '[Tomorrow]',
        nextWeek: 'dddd',
        lastDay: '[Yesterday]',
        lastWeek: '[Last] dddd',
        sameElse: 'DD MMM YYYY'
      })
    },
    filterHistory (day) {
      return this.history.filter(e => day === moment(e.dCreated).format('YYYY-MM-DD')).sort(() => 1)
    },
    getGroupHistory () {
      let group = this.history.map(e => moment(e.dCreated).format('YYYY-MM-DD'))
      return ([ ...new Set(group) ]).sort(() => 1)
    },
    getIcon (e) {
      if (e.nFail > 0) {
        return 'times-circle'
      } else if (e.nWarn > 0) {
        return 'exclamation-circle'
      } else if (e.nInfo > 0) {
        return 'info-circle'
      } else if (e.nPass > 0) {
        return 'check-circle'
      }
    },
    getColor (e) {
      if (e.nFail > 0) {
        return 'danger'
      } else if (e.nWarn > 0) {
        return 'warning'
      } else if (e.nInfo > 0) {
        return 'info'
      } else if (e.nPass > 0) {
        return 'success'
      }
    },
    onView (e) {
      if (!this.editor) this.$router.push({ name: 'history-version-id', params: { id: e } })
    },
    onEdit (e) {
      this.editor = true
      this.$router.push({ name: 'history-edit-id', params: { id: e } })
    },
    onDelete (e) {
      let vm = this
      this.editor = true
      let index = -1
      let item = this.history.filter((a, i) => {
        if (a.sKey === e) index = i
        return a.sKey === e
      })
      // console.log(index, item)
      // if (item.length > 1) return this.$toast.error(`${item.length} Tasks can't remove.`)
      this.history.splice(item, 1)
      vm.$axios.post('/api/history/del/' + e).then(() => {
        vm.$toast.success('Task Delete')
        // vm.$router.go()
      }).catch(ex => {
        vm.$toast.error(ex.message)
      })
    }
  }
}
</script>

<style lang="scss">
.card-header {
  background: transparent;
  border-bottom: none;
  span.badge {
    display: inline-table;
    margin: 4px 4px;
  }
}
.text-inline {
  font-size: 14px;
  padding: 3px 9px;
}
.btn-icon {
  font-size: 11px;
  padding: 0rem 0.1rem;
  margin-top: -2px;
}
tbody > tr {
  cursor: pointer;
}
</style>
