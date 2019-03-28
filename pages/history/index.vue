<template>
  <div class="container pt-5 pb-3">
    <h3>History Survey</h3>
    <div class="row mt-3">
      <div class="col-36">
        {{ getGroupHistory() }}
        <table class="table table-sm table-hover">
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
            <tr v-for="e in history" :key="e.nRow" :class="e.nFail > 0 ? 'table-danger' : ''" @click.prevent="onView(e.sKey)">
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
            </tr>
            <tr v-if="history.length === 0" class="text-center">
              <th colspan="7" class="text-center">No Transaction</th>
            </tr>
          </tbody>
        </table>
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
    getGroupHistory () {
      let group = this.history.map(e => moment(e.dCreated).format('YYYY-MM-DD'))
      return [ ...new Set(group) ]
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
      
      vm.$axios('/api/history/del/' + e).then(() => {
        vm.$toast.success('Task Delete')
        vm.$router.go()
      }).catch(ex => {
        vm.$toast.error(ex.message)
      })
    }
  }
}
</script>
<style>
.btn-icon {
  padding: .09rem 0.3rem;
}
tbody > tr {
  cursor: pointer;
}
</style>

