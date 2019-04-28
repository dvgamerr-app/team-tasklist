<template lang="html">
  <div class="task">
    <div class="row">
      <div class="col-sm-36">
        <h3 class="mb-0">To-Do</h3>
        <small>New Task-List with markdown description.</small>
        <hr>
      </div>
    </div>
    <form v-tabindex>
      <div class="row">
        <div class="col-lg-24">
          <b-form-group>
            <div class="d-flex flex-wrap flex-md-nowrap align-items-center">
              <div class="v-md-thumbnail mr-2 d-none d-md-block">
                <img :src="gravatar" class="v-md-avatar">
              </div>
              <div class="v-title">
                <b-form-input v-model="todo.title" :state="validate.title" tabindex="1" placeholder="Title" />
                <b-form-invalid-feedback>Please input subject or short description for task.</b-form-invalid-feedback>
              </div>
            </div>
          </b-form-group>
          <editor ref="editor" v-model="todo.description" auto-save :name="$route.params.id ? 'todo-edit' : 'todo-new'">
            <b-dropdown slot="button" split variant="success" class="f-sm editor-submit" @click.prevent="onSaveTask('1')">
              <template slot="button-content">
                <fa icon="clock" /> Submit waiting task
              </template>
              <b-dropdown-item href="#" class="f-sm" @click.prevent="onSaveTask('2')">
                <fa icon="code" style="width:21px;" /> Submit processing task
              </b-dropdown-item>
              <b-dropdown-item href="#" class="f-sm" @click.prevent="onSaveTask('3')">
                <fa icon="check" style="width:21px;" /> Task complated
              </b-dropdown-item>
            </b-dropdown>
          </editor>
        </div>
        
        <div class="col-lg-12 mt-sm-4 mt-lg-0">
          <b-form-group label-cols-sm="6" label="Project:" label-align-sm="right" label-for="project">
            <vue-multiselect
              id="project" v-model="todo.project" :options="optProject" :taggable="true"
              placeholder="Project name" tag-placeholder="enter to project created."
              @tag="onProjectChange"
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
              @tag="onAssignChange"
            />
          </b-form-group>

          <b-form-group label-cols-sm="6" label="Priority:" label-align-sm="right" class="mb-0" label-for="priority">
            <b-form-radio-group id="priority" v-model="todo.priority" class="pt-2" :options="optPriority" />
          </b-form-group>
          
          <!-- <b-form-group label-cols-sm="6" label="Status:" label-align-sm="right" class="mb-0" label-for="status">
            <b-form-radio-group id="status" v-model="todo.status" class="pt-2" :options="optStatus" />
          </b-form-group> -->
          
          <b-form-group label-cols-sm="6" label="Private:" label-align-sm="right" class="mb-0" label-for="private">
            <b-form-checkbox id="private" v-model="todo.private" class="pt-2" switch /> 
          </b-form-group>
        </div>
      </div>
    </form>
  </div>
</template>
<script>
import moment from 'moment'
import md5 from 'md5'
import Editor from '../../components/editor.vue'

export default {
  components: {
    Editor
  },
  data: () => ({
    saved: false,
    validate: {
      title: null
    },
    todo: {
      title: '',
      project: '',
      description: '',
      assign: [],
      duedate: null,
      priority: 0,
      status: 1,
      private: false
    },
    optTitle: [],
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
    ]
  }),
  computed: {
    gravatar () {
      let avatar = this.$auth.user.email ? md5(this.$auth.user.email) : '00000'
      return `//www.gravatar.com/avatar/${avatar}?d=retro&size=64`
    }
  },
  async asyncData ({ $axios, params }) {
    let project = await $axios.get('/api/todo/search/project')
    if (params.id) {

      return { todo: {} }
    }
  },
  created () {
  },
  methods: {
    async onSaveTask () {
      this.validate.title = this.todo.title ? null : false
      if (!this.todo.title) return this.$toast.open({ message: 'Title is empty.', type: 'warning' })
      if (!this.todo.project) return this.$toast.open({ message: 'Project name is empty.', type: 'warning' })
      if (!this.todo.description) return this.$toast.open({ message: 'Description is empty.', type: 'warning' })
      if (this.todo.assign.length === 0) return this.$toast.open({ message: 'Assign name for task.', type: 'warning' })
      try {
        this.saved = true
        let { data } = await this.$axios.post('/api/task-list', this.todo)
        this.saved = false
        if (data.error) throw new Error(data.error)
        this.$refs.editor.setText()
        this.$toast.open({ message: 'Task Added.', type: 'success' })
        this.$router.push({ name: 'todo-edit-id', params: { id: data.id } })
      } catch (ex) {
        this.$bvToast.toast(ex.message || ex, {
          title: 'Todo',
          toaster: 'b-toaster-bottom-right',
          variant: 'error',
          autoHideDelay: 5000
        })
      }
    },
    onProjectChange (value) {
      this.todo.project = value
    },
    onAssignChange (value) {
      this.todo.assign.push(value)
    },
    onDueDateChange (date) {
      this.todo.duedate = date.toISOString()
    }
  }
}
</script>
<style lang="scss">
  .task {
    h3 + small {
      font-size: 0.7rem;
    }
    .editor-submit {
      .dropdown-item {
        padding-left: 1rem;
      }
    }
  }
  .v-md-avatar {
    border-radius: .3rem;
  }
  .v-md-thumbnail {
    width: 64px;
    height: 64px;
  }
  .v-title {
    display: block;
    width: 100%;
    margin-top: -10px;
    .invalid-feedback {
      position: absolute;
      font-size: .7rem;
    }
  }
</style>

