const logger = require('@debuger')('SERVER')
const mongo = require('@mongo')

module.exports = async (req, res) => {
  let { auth, body } = req
  try {
    const { TaskList } = await mongo.open()
    let item = await new TaskList(Object.assign(body, {
      duedate: new Date(body.duedate),
      owner: { id: auth._id, name: auth.username },
      tags: [],
      deleted: false,
      updated: new Date(),
      created: new Date(),
    })).save()
    res.json({ id: item._id })
  } catch (ex) {
    logger.warning(req.url, ex.message || ex)
    res.json({ error: false })
  } finally {
    res.end()
  }
}
