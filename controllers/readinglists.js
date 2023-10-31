const UserReads = require('../models/user_read')

const router = require('express').Router()

router.get('/', async (req, res) => {
  const readingList = await UserReads.findAll({
    attributes: ['user_id', 'blog_id'],
  })
  res.json(readingList)
})

router.put('/:id', async (req, res) => {
  const read = await UserReads.findByPk(req.params.id)
  if (read) {
    read.read = req.body.read
    await read.save()
    res.json(read)
  } else {
    res.sendStatus(404)
  }
})
module.exports = router
