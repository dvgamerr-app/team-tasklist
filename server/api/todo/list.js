const logger = require('@debuger')('SERVER')
const mongo = require('@mongo')

module.exports = async (req, res) => {
  try {
    const { status } = req.params
    const { Todo } = await mongo.open()
    let item = await Todo.find({
      $and: [ 
        {
          $or: [
            { $and: [ { 'owner.id': req.auth._id }, { private: true } ] },
            { private: false }
          ]
        },
        { deleted: false },
        { status: status }
      ]
    }, null, {
      sort: { duedate: 1, created: -1 }
    })
    res.json(item)
  } catch (ex) {
    logger.warning(req.url, ex.message || ex)
    res.json({ error: ex.message || ex })
  } finally {
    res.end()
  }
}
