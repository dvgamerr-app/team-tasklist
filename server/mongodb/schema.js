const mongoose = require('mongoose')
const { Schema } = mongoose
const { Mixed } = Schema.Types

module.exports = [
  {
    id: 'UserAccount',
    name: 'db-account',
    schema: Schema({
      username: { type: String, index: true },
      fullname: { type: String, index: true },
      email: { type: String, index: true },
      level: { type: Number, index: true },
      pwd: String,
      permission: Array,
      facebook: Object,
      line: Object,
      enabled: { type: Boolean, index: true },
      lasted: { type: Date, index: true },
      updated: Date,
      created: Date,
    })
  },
  {
    id: 'Todo',
    name: 'db-todo',
    schema: Schema({
      title: { type: String, index: true },
      description: String,
      project: { type: String, index: true },
      duedate: { type: Date, index: true },
      priority: { type: Number, index: true },
      assign: Array,
      owner: { name: String, id: String },
      tags: Array,
      status: { type: Number, index: true },
      private: { type: Boolean, index: true },
      deleted: { type: Boolean, index: true },
      updated: Date,
      created: Date,
    })
  },
  {
    id: 'TodoComment',
    name: 'db-todo-comment',
    schema: Schema({
      description: String,
      deleted: { type: Boolean, index: true },
      owner: { name: String, id: String },
      updated: Date,
      created: Date,
    })
  }
]
