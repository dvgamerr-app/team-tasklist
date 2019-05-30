const { ObjectId } = require('@touno-io/db/type')

module.exports = [
  {
    id: 'Account',
    name: 'team-account',
    schema: {
      username: { type: String, index: true, require: true, unique: true },
      pwd: { type: String, index: true, require: true },
      fullname: { type: String, index: true },
      email: { type: String, index: true },
      level: { type: Number, index: true },
      permission: { type: Array, default: null },
      facebook: { type: Object, default: null },
      line: { type: Object, default: null },
      enabled: { type: Boolean, index: true, default: true },
      lasted: { type: Date, index: true, default: Date.now },
      updated: { type: Date, index: true, default: Date.now },
      created: { type: Date, index: true, default: Date.now }
    }
  },
  {
    id: 'Todo',
    name: 'team-todo',
    schema: {
      owner: { type: ObjectId, index: true },
      title: { type: String, index: true },
      description: String,
      project: { type: String, index: true },
      duedate: { type: Date, index: true },
      priority: { type: Number, index: true },
      assign: [
        { type: ObjectId, index: true }
      ],
      tags: [ String ],
      status: { type: Number, index: true, default: 0 },
      private: { type: Boolean, index: true, default: false  },
      deleted: { type: Boolean, index: true, default: false  },
      updated: { type: Date, index: true, default: Date.now },
      created: { type: Date, index: true, default: Date.now },
    }
  },
  {
    id: 'Comment',
    name: 'team-comment',
    schema: {
      todo: { type: ObjectId, index: true },
      owner: { type: ObjectId, index: true },
      description: String,
      deleted: { type: Boolean, index: true },
      updated: { type: Date, index: true, default: Date.now },
      created: { type: Date, index: true, default: Date.now },
    }
  }
]
