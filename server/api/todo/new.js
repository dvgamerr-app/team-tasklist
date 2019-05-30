const mongo = require('../../mongodb')

module.exports = async (req, res) => {
  let { auth, body } = req
  try {
    await mongo.open()
    const { Todo } = mongo.get()
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
