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
      enabled: { type: Boolean, index: true },
      lasted: { type: Date, index: true },
      updated: Date,
      created: Date,
    })
  },
  {
    id: 'TaskList',
    name: 'db-tasklist',
    schema: Schema({
      description: String,
      project: { type: String, index: true },
      duedate: { type: Date, index: true },
      priority: { type: Number, index: true },
      assign: Array,
      owner: String,
      tags: Array,
      status: { type: Number, index: true },
      private: { type: Boolean, index: true },
      deleted: { type: Boolean, index: true },
      updated: Date,
      created: Date,
    })
  },
  {
    id: 'TaskListHistory',
    name: 'db-tasklist-history',
    schema: Schema({
      description: String,
      project: { type: String, index: true },
      duedate: { type: Date, index: true },
      priority: { type: Number, index: true },
      tags: Array,
      deleted: { type: Boolean, index: true },
      updated: Date,
      created: Date,
    })
  }
]
