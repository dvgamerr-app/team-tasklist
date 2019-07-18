const { touno } = require('@touno-io/db/schema')

module.exports = async (req, res) => {
  let { auth, body } = req
  try {
    const { Todo } = touno.get()
    let item = await Todo.insert(Object.assign(body, {
      duedate: body.duedate ? new Date(body.duedate) : null,
      owner: { id: auth._id, name: auth.username },
      tags: []
    }))
    res.json({ id: item._id })
  } catch (ex) {
    res.json({ error: ex.message || ex })
  } finally {
    res.end()
  }
}
