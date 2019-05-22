const logger = require('@debuger')('SERVER')
const mongo = require('@mongo')
const md5 = require('md5')


module.exports = async (req, res) => {
  let { id } = req.params
  try {
    const { UserAccount, Todo } = await mongo.open()
    let item = await Todo.findOne({ _id: id })
    let owner = await UserAccount.findOne({ _id: item.owner.id })
    let gravatar = md5(owner.email)
    res.json({
      title: item.title,
      project: item.project,
      description: item.description,
      assign: item.assign,
      duedate: item.duedate,
      priority: item.priority,
      status: item.status,
      private: item.private,
      gravatar: gravatar,
      owner: owner.fullname
    })
  } catch (ex) {
    logger.warning(req.url, ex.message || ex)
    res.json({ error: ex.message || ex })
  } finally {
    res.end()
  }
}
