// const { touno } = require('@touno-io/db/schema')

// module.exports = async (req, res) => {
//   const { auth, body } = req
//   try {
//     const { Todo } = touno.get()
//     const item = await new Todo(Object.assign(body, {
//       duedate: body.duedate ? new Date(body.duedate) : null,
//       owner: { id: auth._id, name: auth.username },
//       tags: []
//     })).save()
//     res.json({ id: item._id })
//   } catch (ex) {
//     res.json({ error: ex.message || ex })
//   } finally {
//     res.end()
//   }
// }
