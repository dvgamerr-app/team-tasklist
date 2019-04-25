<template lang="html">
  <div class="row">
    <div class="col-sm-36">
      <b-table striped hover small :items="items" :fields="fields" show-empty>
        <template slot="table-colgroup">
          <col style="width:30px">
          <col style="">
          <col style="width:10%">
          <col style="width:20%">
          <col style="width:15%">
          <col style="width:80px">
        </template>
        <template slot="index" slot-scope="data" lang="html">
          <span v-text="data.index + 1" />
        </template>
        <template slot="assign" slot-scope="data" lang="html">
          <b-badge v-for="name in data.item.assign" :key="name" variant="light" v-text="name" />
        </template>
        <template slot="description" slot-scope="data" lang="html">
          <input type="text" :value="data.item.description">
          <b-badge v-if="data.item.priority === 1" variant="low">Low</b-badge>
          <b-badge v-if="data.item.priority === 2" variant="medium">Medium</b-badge>
          <b-badge v-if="data.item.priority === 3" variant="high">High</b-badge>
        </template>
        <template slot="action" lang="html">
          <b-button-group size="sm">
            <b-button variant="outline"><fa icon="comment-dots" class="text-muted" /></b-button>
            <b-button variant="outline"><fa icon="edit" class="text-muted" /></b-button>
            <b-button variant="outline"><fa icon="trash-alt" class="text-muted" /></b-button>
          </b-button-group>
        </template>
        <template slot="empty" lang="html">
          <h6 class="text-center mb-1 mt-1">No Task-List to do.</h6>
        </template>
        <template slot="emptyfiltered" lang="html">
          <h6>Task-List not found.</h6>
        </template>
      </b-table>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    items: {
      type: Array,
      default: () => ([])
    }
  },
  data: () => ({
    fields: [
      { key: 'index', label: '#', sortable: false, class: 'text-center' },
      { key: 'description', label: 'Description', sortable: true, class: '' },
      { key: 'project', label: 'Project', sortable: true, class: '' },
      { key: 'duedate', label: 'Due', sortable: true, class: 'text-center' },
      { key: 'assign', label: 'Assign', sortable: true, class: '' },
      { key: 'action', label: '', sortable: false, class: '' }
    ] 
  }),
  computed: {
    status () {
      return this.$route.params.status || 'pending'
    }
  },
  async asyncData ({ redirect, params, $axios }) {
  },
  created () {
  },
  methods: {
  }
}
</script>

<style lang="css">
button.btn.btn-outline {
  padding: 0px 3px;
}
.btn-group.btn-group-sm {
  vertical-align: top;
}
.table-sm tr > td {
  font-size: 0.85rem;
}
.badge.badge-none {
  color: #FFF;
  background-color: gray;
}
.badge.badge-low {
  color: #FFF;
  background-color: orange;
}
.badge.badge-medium {
  color: #FFF;
  background-color: orangered;
}
.badge.badge-high {
  color: #FFF;
  background-color: red;
}
</style>
