<template>
  <div class="container pt-5 pb-3">
    <div class="row">
      <div class="col-sm-36">
        <h3>History</h3>
        <small>History group by date and lastet 100 rows.</small>
        <hr>
      </div>
    </div>
    <div class="row mt-3">
      <div class="col-36">
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
          <!--<table class="table table-sm table-hover">
            <thead class="thead-light">
              <tr>
                <th scope="col" style="width: 40px" />
                <th scope="col" class="text-center" style="width: 40px">#</th>
                <th scope="col">Name</th>
                <th scope="col" class="text-center" style="width: 80px">Fail</th>
                <th scope="col" class="text-center" style="width: 160px">Created</th>
                <th scope="col" class="text-center" style="width: 160px">Updated</th>
                <th scope="col" class="text-center" style="width: 80px" />
              </tr>
            </thead>
            <tbody>
              <tr v-for="e in filterHistory(day)" :key="e.nRow" :class="e.nFail > 0 ? 'table-danger' : ''" @click.prevent="onView(e.sKey)">
                <td class="text-center"><fa :icon="getIcon(e)" :class="'text-'+getColor(e)" /></td>
                <th class="text-center" scope="row" v-text="e.nRow" />
                <td v-text="e.sName" />
                <td class="text-center" v-text="e.nFail" />
                <td class="text-center" v-text="e.dCreated" />
                <td class="text-center" v-text="e.dModified" />
                <td class="text-center">
                  <button type="button" class="btn btn-sm btn-icon" @click.prevent="onEdit(e.sKey)">
                    <fa icon="edit" />
                  </button>
                  <button v-if="$auth.user.user_level >= 3" type="button" class="btn btn-sm btn-icon" @click.prevent="onDelete(e.sKey)">
                    <fa icon="trash-alt" />
                  </button>
                </td>
              </div>
              <tr v-if="history.length === 0" class="text-center">
                <th colspan="7" class="text-center">No Transaction</th>
              </tr>
            </tbody>
          </table> -->
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
    let { data } = await $axios('/api/history')
    return { history: data }
  },
  created () {
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
<style>
.group-history {
  padding-bottom: 10px;
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

