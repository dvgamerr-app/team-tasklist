<template lang="html">
  <div class="view-task">
    <div class="row">
      <div class="col-sm-36 title">
        <h3 class="mb-0">To-Do: {{ todo.title }}</h3>
        <small>{{ getDuedate() }} assign Kananek T.</small>
        <hr>
      </div>
    </div>
    <form>
      <div class="row">
        <div class="col-sm-36">
          <div class="d-flex flex-wrap flex-md-nowrap">
            <div class="v-md-thumbnail mr-3 d-none d-md-block">
              <img :src="gravatar" class="v-md-avatar">
            </div>
            <b-card class="arrow">
              <h6 slot="header" class="mb-0">Header Slot</h6>
              <h6 slot="footer" class="mb-0">Footer Slot</h6>
              <b-card-text>
                <markdownBody :content="todo.description" />
              </b-card-text>
            </b-card>
          </div>
        </div>
      
        <!-- <todo-dropdown v-if="!todo.private" label="Assign" :toggle-icon.sync="edit.assign" label-default="assign myself" :on-click="onToggle('assign')">
          <vue-multiselect
            id="assign" ref="assign" v-model="todo.assign" :options="opt.assign" :taggable="false"
            placeholder="Assign name" tag-placeholder="enter to add assign." track-by="id" label="fullname"
            :clear-on-select="true" :hide-selected="false" :searchable="true" :multiple="true"
            :loading="loading.assign" :internal-search="false" :block-keys="['Delete']"
            :close-on-select="true" :options-limit="100" :limit="5" :show-no-results="true"
            @tag="onAssignChange" @select="onAssignChange" @search-change="onAssignSearch"
          >
            <template slot="noResult" lang="html">
              No Result
            </template>
          </vue-multiselect>
          <template slot="value" lang="html">
            <client-only>
              <span v-for="user in todo.assign" :key="user.id" class="badge badge-primary">
                {{ user.fullname }}
                <span class="btn-close" @click.prevent="setTodo('assign', user.id)">&times;</span>
              </span>
            </client-only>
          </template>
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
        </todo-dropdown> -->


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
    </form>
  </div>
</template>
<script>
import dayjs from 'dayjs'

import markdownBody from '../../../components/todo/markdown-body.vue'

export default {
  head: {
    title: 'Todo'
  },
  components: {
    markdownBody
  },
  data: () => ({
    todo: {
    }
  }),
  computed: {
    gravatar () {
      return `//www.gravatar.com/avatar/${this.todo.gravatar}?d=retro&size=64`
    }
  },
  async asyncData ({ $axios, params }) {
    let { data } = await $axios.get('/api/todo/' + params.id)
    console.log('asyncData', data)
    return { todo: data }
  },
  methods: {
    getDuedate () {
      let diff = !this.todo.duedate ? null : dayjs().diff(dayjs(this.todo.duedate), 'day')
      return this.todo.duedate ? `${diff > 0 ? 'over deadline past' : 'deadline in'} ${dayjs(this.todo.duedate).fromNow(true)}` : ''
    },
  }
}
</script>
<style lang="scss">
.view-task {
  .title {
    h3 {
      display: inline-block;
      width: 100%;
      white-space: nowrap;
      overflow: hidden !important;
      text-overflow: ellipsis;
    }
  }
  .card {
    width: 80%;
  }
  .arrow:after, .arrow:before {
    right: 100%;
    top: 25px;
    border: solid transparent;
    content: " ";
    height: 0;
    width: 0;
    position: absolute;
    pointer-events: none;
  }
  .arrow:after {
    border-color: rgba(255, 255, 255, 0);
    border-right-color: #f7f7f7;
    border-width: 10px;
    margin-top: -10px;
  }
  .arrow:before {
    border-color: rgba(223, 223, 223, 0);
    border-right-color: #dfdfdf;
    border-width: 11px;
    margin-top: -11px;
  }

  @media screen and (max-width: 768px){
    .card {
      width: 100%;
    }
  }

}
</style>

