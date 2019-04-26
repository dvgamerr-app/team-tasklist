const logger = require('@debuger')('SERVER')
const mongo = require('@mongo')

module.exports = async (req, res) => {
  let { auth, body } = req
  try {
    const { Todo } = await mongo.open()
    let item = await new Todo(Object.assign(body, {
      duedate: body.duedate ? new Date(body.duedate) : null,
      owner: { id: auth._id, name: auth.username },
      tags: [],
      deleted: false,
      updated: new Date(),
      created: new Date(),
    })).save()
    res.json({ id: item._id })
  } catch (ex) {
    logger.warning(req.url, ex.message || ex)
    res.json({ error: true })
  } finally {
    res.end()
  }
}
