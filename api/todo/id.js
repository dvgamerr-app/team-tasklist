// const { touno } = require('@touno-io/db/schema')
// const md5 = require('md5')

// module.exports = async (req, res) => {
//   const { id } = req.params
//   try {
//     const { Account, Todo } = touno.get()
//     const item = await Todo.findOne({ _id: id })
//     const owner = await Account.findOne({ _id: item.owner })
//     const gravatar = md5(owner.email)
//     res.json({
//       gravatar,
//       owner: owner.fullname,
//       title: item.title,
//       project: item.project,
//       description: item.description,
//       assign: item.assign,
//       duedate: item.duedate,
//       priority: item.priority,
//       status: item.status,
//       private: item.private
//     })
//   } catch (ex) {
//     res.json({ error: ex.message || ex })
//   } finally {
//     res.end()
//   }
// }
