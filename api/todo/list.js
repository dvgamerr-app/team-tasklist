// const { touno } = require('@touno-io/db/schema')

// module.exports = async (req, res) => {
//   try {
//     const { status } = req.params
//     const { Todo } = touno.get()
//     const item = await Todo.find({
//       $and: [
//         {
//           $or: [
//             { $and: [ { 'owner.id': req.auth._id }, { private: true } ] },
//             { private: false }
//           ]
//         },
//         { deleted: false },
//         { status }
//       ]
//     }, null, {
//       sort: { duedate: 1, created: -1 }
//     })
//     res.json(item)
//   } catch (ex) {
//     res.json({ error: ex.message || ex })
//   } finally {
//     res.end()
//   }
// }
