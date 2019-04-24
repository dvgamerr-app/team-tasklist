<template>
  <div class="container pt-5 pb-3 projects">
    <div class="row">
      <div class="col-sm-36">
        <h3>To-Do</h3>
      </div>
    </div>
    <div class="row mt-3">
      <div class="col-md-18">
        <no-ssr placeholder="Loading">
          <editor v-model="todo.description" :options="optDescription" />
        </no-ssr>
      </div>
      
      <div class="col-md-18">
        <b-form-group label-cols-sm="6" label="Project:" label-align-sm="right" label-for="project">
          <b-form-input id="project" />
        </b-form-group>

        <b-form-group label-cols-sm="6" label="Due:" label-align-sm="right" label-for="duedate">
          <b-form-input id="duedate" />
        </b-form-group>

        <b-form-group label-cols-sm="6" label="Assign:" label-align-sm="right" label-for="assign">
          <b-form-input id="assign" />
        </b-form-group>

        <b-form-group label-cols-sm="6" label="Priority:" label-align-sm="right" class="mb-0" label-for="priority">
          <b-form-radio-group id="priority" v-model="todo.priority" class="pt-2" :options="optPriority" />
        </b-form-group>
        
        <b-form-group label-cols-sm="6" label="Status:" label-align-sm="right" class="mb-0" label-for="status">
          <b-form-radio-group id="status" v-model="todo.status" class="pt-2" :options="optStatus" />
        </b-form-group>
        
        <b-form-group label-cols-sm="6" label="Private:" label-align-sm="right" class="mb-0" label-for="private">
          <b-form-checkbox id="private" v-model="todo.private" class="pt-2" switch /> 
        </b-form-group>
      </div>
    </div>
  </div>
</template>
<script>
import moment from 'moment'
import Editor from '../components/editor.vue'

export default {
  components: {
    Editor
  },
  data: () => ({
    todo: {
      description: '',
      priority: 0,
      status: 1,
      private: false
    },
    optStatus: [
      { text: 'Waiting', value: 1 },
      { text: 'Pending', value: 2 },
      { text: 'Completed', value: 3 }
    ],
    optPriority: [
      { text: 'None', value: 0 },
      { text: 'Low', value: 1 },
      { text: 'Medium', value: 2 },
      { text: 'High', value: 3 }
    ],
    optDescription: {                   
      lineNumbers: true,
      styleActiveLine: true,
      styleSelectedText: true,
      lineWrapping: true,
      indentWithTabs: true,
      tabSize: 2,
      indentUnit: 2
    }
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

