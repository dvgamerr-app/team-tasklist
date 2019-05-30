const mongo = require('../../mongodb')
const md5 = require('md5')

module.exports = async (req, res) => {
  let { id } = req.params
  try {
    await mongo.open()
    const { Account, Todo } = mongo.get()
    let item = await Todo.findOne({ _id: id })
    let owner = await Account.findOne({ _id: item.owner })
    let gravatar = md5(owner.email)
    res.json({
      gravatar: gravatar,
      owner: owner.fullname,
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
    res.json({ error: ex.message || ex })
  } finally {
    res.end()
  }
}
