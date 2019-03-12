<template>
  <div class="container pt-5 pb-3">
    <h2>History Servey</h2>
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
              <th scope="col" class="text-center" style="width: 80px" />
            </tr>
          </thead>
          <tbody>
            <tr v-for="e in history" :key="e.nRow" :class="e.nFail > 0 ? 'table-warning' : ''">
              <td class="text-center"><fa :icon="e.nFail > 0 ? 'times' : 'check'" :class="e.nFail > 0 ? 'text-danger' : 'text-success'" /></td>
              <th class="text-center" scope="row" v-text="e.nRow" />
              <td v-text="e.sName" />
              <td class="text-center" v-text="e.nFail" />
              <td class="text-center" v-text="e.dCheckIn" />
              <td class="text-center">
                <button type="button" class="btn btn-sm btn-icon"><fa icon="edit" /></button>
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
    history: []
  }),
  async asyncData ({ $axios }) {
    let { data } = await $axios('/api/history')
    return { history: data }
  },
}
</script>
<style>
.btn-icon {
  padding: .09rem 0.3rem;
}
</style>

