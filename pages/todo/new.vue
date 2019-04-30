<template lang="html">
  <div class="task">
    <div class="row">
      <div class="col-sm-36">
        <h3 v-if="!$route.params.id" class="mb-0">Create new Todo</h3>
        <h3 v-else class="mb-0">To-Do: {{ todo.title }}</h3>
        <small>Todo with markdown description.</small>
        <hr>
      </div>
    </div>
    <form v-tabindex>
      <div class="row">
        <div class="col-lg-24 col-xl-26">
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
            <b-dropdown slot="button" split variant="success" class="f-sm editor-submit" @click.prevent="onSaveTask(1)">
              <template slot="button-content">
                <fa icon="clock" /> Submit waiting task
              </template>
              <b-dropdown-item href="#" class="f-sm" @click.prevent="onSaveTask(2)">
                <fa icon="code" style="width:21px;" /> Submit processing task
              </b-dropdown-item>
              <b-dropdown-item href="#" class="f-sm" @click.prevent="onSaveTask(3)">
                <fa icon="check" style="width:21px;" /> Task complated
              </b-dropdown-item>
            </b-dropdown>
          </editor>
        </div>
        
        <div class="col-lg-12 col-xl-10 mt-sm-4 mt-lg-0">
          <div>
            <div class="d-flex align-items-center box-private">
              <label for="private"><b>Private</b></label>
              <b-checkbox id="private" v-model="todo.private" switch /> 
            </div>
          </div>
          <todo-dropdown label="Project" :toggle-icon.sync="edit.project" :label-value="todo.project" :on-click="onProjectToggle">
            <vue-multiselect
              id="project" ref="project" :options="opt.project" :taggable="true"
              placeholder="Project name" tag-placeholder="enter to project created."
              :clear-on-select="false" :hide-selected="true" :searchable="true" 
              :loading="loading.project" :internal-search="false" :block-keys="['Delete']"
              :close-on-select="false" :options-limit="100" :limit="5" :show-no-results="false"
              @tag="onProjectChange" @select="onProjectChange" @search-change="onProjectSearch"
            />
            <template slot="value" lang="html">
              <no-ssr>
                <span class="badge badge-primary">
                  {{ todo.project }}
                  <span class="btn-close" @click.prevent="setTodo('project', '')">&times;</span>
                </span>
              </no-ssr>
            </template>
          </todo-dropdown>
          <todo-dropdown v-if="!todo.private" label="Assign" :toggle-icon.sync="edit.assign" label-default="assign myself">
            <div>
              Due
            </div>
          </todo-dropdown>
          <todo-dropdown label="Due" :toggle-icon.sync="edit.duedate">
            <div>
              Due
            </div>
          </todo-dropdown>
          <todo-dropdown label="Priority" :toggle-icon.sync="edit.priority">
            <div>
              Priority
            </div>
          </todo-dropdown>
          <todo-dropdown label="Lables" :toggle-icon.sync="edit.lable">
            <div>
              editor
            </div>
          </todo-dropdown>


          <!-- <b-form-group label-cols-sm="6" label="Assignees" label-align-sm="right" label-for="project">
            <vue-multiselect
              id="project" v-model="todo.project" :options="opt.project" :taggable="true"
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
          </b-form-group> -->
          
          <!-- <b-form-group label-cols-sm="6" label="Status:" label-align-sm="right" class="mb-0" label-for="status">
            <b-form-radio-group id="status" v-model="todo.status" class="pt-2" :options="optStatus" />
          </b-form-group> -->
        </div>
      </div>
    </form>
  </div>
</template>
<script>
import md5 from 'md5'
import Editor from '../../components/todo/editor.vue'
import TodoDropdown from '../../components/todo/todo-dropdown.vue'

export default {
  head: {
    title: 'Create new Todo'
  },
  components: {
    Editor,
    TodoDropdown
  },
  data: () => ({
    saved: false,
    validate: {
      title: null
    },
    edit: {
      project: false,
      assign: false,
      duedate: false,
      priority: false,
      label: false
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
    loading: {
      project: false
    },
    time: {
      project: 0
    },
    opt: {
      project: []
    },
    optAssign: [],
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
    if (params.id) {
      let { data } = await $axios.get('/api/todo/' + params.id)
      return { todo: data }
    }
    return {
    }
  },
  methods: {
    async onSaveTask (status) {
      this.validate.title = this.todo.title ? null : false
      this.todo.status = status
      if (!this.todo.title) return this.$toast.open({ message: 'Title is empty.', type: 'warning' })
      if (!this.todo.project) return this.$toast.open({ message: 'Project name is empty.', type: 'warning' })
      if (!this.todo.description) return this.$toast.open({ message: 'Description is empty.', type: 'warning' })
      if (this.todo.assign.length === 0 && status === 3) return this.$toast.open({ message: 'Assign name for task.', type: 'warning' })
      try {
        this.saved = true
        let { data } = await this.$axios.post('/api/todo', this.todo)
        this.saved = false
        if (data.error) throw new Error(data.error)
        this.$refs.editor.setText()
        this.$toast.open({ message: 'Task Added.', type: 'success' })
        this.$router.push({ name: 'todo-id', params: { id: data.id } })
      } catch (ex) {
        this.$bvToast.toast(ex.message || ex, {
          title: 'Todo',
          toaster: 'b-toaster-bottom-right',
          variant: 'error',
          autoHideDelay: 5000
        })
      }
    },
    onProjectToggle () {
      if (this.edit.project) {
        let vm = this
        this.$nextTick(() => {
          vm.$refs.project.$refs.search.focus()
        })
      }
    },
    onProjectSearch (value) {
      let vm = this
      if (this.time.project) clearTimeout(this.time.project)

      vm.time.project = setTimeout(() => {
        vm.onSearchItems('project', value)
        clearTimeout(vm.time.project)
      }, 200)
    },
    async onSearchItems (name, value) {
      if (!value || !value.trim()) return

      value = value.replace(/[\\\/]/ig, '')
      this.loading[name] = true
      try {
        const { data } = await this.$axios.get(`/api/todo/search/${name}/` + value)
        this.opt[name] = data
      } catch (ex) {
        console.log(ex)
        this.opt[name] = []
      } finally {
        this.loading[name] = false
      }
    },
    onProjectChange (value) {
      if (!value || !value.trim()) return

      value = value.trim().replace(/[\\\/]/ig, '')
      if (value.length < 3) return this.$toast.open({ message: 'Project name short.', type: 'warning' })
      this.todo.project = value.trim().replace(/[\\\/]/ig, '')
      this.edit.project = false
    },
    onAssignChange (value) {
      this.todo.assign.push(value)
    },
    onDueDateChange (date) {
      this.todo.duedate = date.toISOString()
    },
    setTodo (name, val) {
      this.todo[name] = val
      this.edit[name] = false
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
    .box-private {
      padding: .9rem 0;
      > label {
        margin-bottom: 0px;
        margin-right: .5rem;
      }
    }
    .multiselect {
      min-height: 32px;
      &.multiselect--active {
        color: #495057 !important;
        box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
        outline: 0;
        .multiselect__tags {
          border-color: #80bdff !important;
        }
        .multiselect__select {
          height: 20px;
        }
        .multiselect__content-wrapper {
          box-shadow: 0.1rem 0.2rem 0.2rem 0.01rem rgba(173, 173, 173, 0.25);
        }
      }
      .multiselect__spinner {
        right: 10px;
        top: 6px;
        width: 22px;
        height: 22px;
      }

      .multiselect__tags, 
      .multiselect__input,
      .multiselect__option,
      .multiselect__option:after {
        font-size: 0.8rem;
      }
      .multiselect__tags {
        padding: .4em 2.5em 0 .1em;
        height: 32px;
        min-height: 32px;
      }
      .multiselect__input {
        height: 20px;
      }
      .multiselect__select {
        width: 34px;
        height: 33px;
        transition: none;
        transition: none;
        transition: none;
      }
      .multiselect__placeholder {
        margin-bottom: 0px;
      }
      .multiselect__option, .multiselect__option:after {
        padding: 6px;
        min-height: 20px;
        line-height: 20px;
      }
      .multiselect__option:after {
        font-size: inherit;
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
  }
  
</style>

