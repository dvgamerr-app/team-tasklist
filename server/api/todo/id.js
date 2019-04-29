const logger = require('@debuger')('SERVER')
const mongo = require('@mongo')


module.exports = async (req, res) => {
  let { id } = req.params
  try {
    const { Todo } = await mongo.open()
    let item = await Todo.findOne({ _id: id })
    res.json({
      title: item.title,
      project: item.project,
      description: item.description,
      assign: item.assign,
      duedate: item.duedate,
      priority: item.priority,
      status: item.status,
      private: item.private
    })
  } catch (ex) {
    logger.warning(req.url, ex.message || ex)
    res.json({ error: ex.message || ex })
  } finally {
    res.end()
  }
}
