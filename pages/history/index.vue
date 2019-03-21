<template>
  <div class="container pt-5 pb-3">
    <h3>History Survey</h3>
    <div class="row mt-3">
      <div class="col-36">
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
            <tr v-for="e in history" :key="e.nRow" :class="e.nFail > 0 ? 'table-warning' : ''" @click.prevent="onView(e.sKey)">
              <td class="text-center"><fa :icon="e.nFail > 0 ? 'times' : 'check'" :class="e.nFail > 0 ? 'text-danger' : 'text-success'" /></td>
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
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
<script>
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

