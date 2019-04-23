<template>
  <div class="container pt-5 pb-3 projects">
    <div class="row">
      <div class="col-sm-36">
        <h3>To-Do</h3>
      </div>
    </div>
    <div class="row mt-3">
      <div class="col-36">
        <b-form-group
          label-cols-sm="6"
          label="Street:"
          label-align-sm="right"
          label-for="nested-street"
        >
          <b-form-input id="nested-street" />
        </b-form-group>

        <b-form-group
          label-cols-sm="6"
          label="City:"
          label-align-sm="right"
          label-for="nested-city"
        >
          <b-form-input id="nested-city" />
        </b-form-group>

        <b-form-group
          label-cols-sm="6"
          label="State:"
          label-align-sm="right"
          label-for="nested-state"
        >
          <b-form-input id="nested-state" />
        </b-form-group>

        <b-form-group
          label-cols-sm="6"
          label="Country:"
          label-align-sm="right"
          label-for="nested-country"
        >
          <b-form-input id="nested-country" />
        </b-form-group>

        <b-form-group
          label-cols-sm="6"
          label="Ship via:"
          label-align-sm="right" class="mb-0"
        >
          <b-form-radio-group
            class="pt-2"
            :options="['Air', 'Courier', 'Mail']"
          />
        </b-form-group>
      </div>
    </div>
  </div>
</template>
<script>
import moment from 'moment'

export default {
  auth: false,
  data: () => ({
    history: [],
    editor: false
  }),
  async asyncData ({ $axios }) {
    return { history: [] }
  },
  created () {
  },
  methods: {
  }
}
</script>
<style lang="scss">

</style>

