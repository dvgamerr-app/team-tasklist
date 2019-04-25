<template>
  <div class="container pt-5 pb-3 projects">
    <div class="row">
      <div class="col-sm-36">
        <h3>To-Do</h3>
        <small>New Task-List with markdown description.</small>
        <hr>
      </div>
    </div>
    <div class="row mt-3">
      <div class="col-lg-18">
        <editor v-model="todo.description" :options="optDescription" />
      </div>
      
      <div class="col-lg-18 mt-sm-4 mt-lg-0">
        <b-form-group label-cols-sm="6" label="Project:" label-align-sm="right" label-for="project">
          <vue-multiselect
            id="project" v-model="todo.project" :options="optProject" :taggable="true"
            placeholder="Project name" tag-placeholder="enter to project created."
            @select="onProjectSelect" @tag="onProjectChange"
          />
        </b-form-group>

        <b-form-group class="d-none d-md-flex" label-cols-sm="6" label="Due:" label-align-sm="right" label-for="dueweb">
          <vue-datepicker
            id="dueweb" ref="datepicker" :value="todo.duedate" format="dd MMMM yyyy"
            input-class="form-control" placeholder="Due Date" @selected="onDueDateChange"
          >
            <span slot="afterDateInput" class="placeholder-icon">
              <fa icon="calendar-alt" />  
            </span>
          </vue-datepicker>
        </b-form-group>
        <b-form-group class="d-flex d-md-none" label-cols-sm="6" label="Due:" label-align-sm="right" label-for="duemobile">
          <vue-datemobile 
            id="duemobile" ref="datemobile" v-model="todo.duedate" format="dd MMMM yyyy"
            input-class="form-control" placeholder="Due Date"
          >
            <span slot="after" class="placeholder-icon">
              <fa icon="calendar-alt" />  
            </span>
          </vue-datemobile>
        </b-form-group>

        <b-form-group label-cols-sm="6" label="Assign:" label-align-sm="right" label-for="assign">
          <vue-multiselect
            id="assign" v-model="todo.assign" :options="optAssign"
            placeholder="Worker" tag-placeholder="enter to assign name"
            label="name" track-by="_id" :multiple="true"
            @select="onAssignSelect" @tag="onAssignChange"
          />
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
        <b-form-group label-cols-sm="6" label-align-sm="right" class="mb-0 pt-2">
          <b-button variant="primary" @click.prevent="onSaveTask">Primary</b-button>
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
    saved: false,
    todo: {
      duedate: (new Date()).toISOString(),
      project: '',
      description: '',
      assign: [],
      priority: 0,
      status: 1,
      private: false
    },
    optProject: [],
    optAssign: [
      { name: 'Kananek T.', _id: '23423tgasdfgWHZDS' }
    ],
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
  async asyncData ({ $axios, param, params }) {
    console.log(param, params)
    return { history: [] }
  },
  created () {
  },
  methods: {
    async onSaveTask () {
      if (!this.todo.project) return this.$toast.open({ message: 'Project name is empty.', type: 'warning' })
      if (!this.todo.description) return this.$toast.open({ message: 'Description is empty.', type: 'warning' })
      if (this.todo.assign.length === 0) return this.$toast.open({ message: 'Assign name for task.', type: 'warning' })
      try {
        this.saved = true
        let { data } = await this.$axios.post('/api/task-list', this.todo)
        this.saved = false
        if (data.error) throw new Error(data.error)
        this.$toast.open({ message: 'Task Added.', type: 'success' })
        this.$router.push({ name: 'task-id', param: { id: data.id } })
      } catch (ex) {
        this.$bvToast.toast(ex.message || ex, {
          title: 'Task-List',
          toaster: 'b-toaster-bottom-right',
          variant: 'error',
          autoHideDelay: 5000
        })
      }
    },
    onProjectChange (value) {
      // console.log('onProjectChange', value)
      this.todo.project = value
      // this.$refs.dueweb.focus()
    },
    onProjectSelect (option) {
      // console.log('onProjectSelect', option)
    },
    onAssignChange (value) {
      this.todo.assign.push(value)
    },
    onAssignSelect (option) {
      // console.log('onAssignSelect', option)
    },
    onDueDateChange (date) {
      this.todo.duedate = date.toISOString()
    }
  }
}
</script>
<style lang="scss">

</style>

