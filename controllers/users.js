const router = require('express').Router()
const bcrypt = require('bcrypt')
const { User, Blog } = require('../models')

router.get('/', async (req, res) => {
  const users = await User.findAll({
    include: {
      model: Blog,
      attributes: { exclude: ['userBlogId'] },
    },
  })
  res.json(users)
})

router.post('/', async (req, res) => {
  const saltRounds = 10
  const passwordHash = await bcrypt.hash(req.body.password, saltRounds)
  const user = await User.create({ ...req.body, passwordHash })

  res.status(201).json({ username: user.username, name: user.name })
})

router.put('/:id', async (req, res) => {
  const user = await User.findByPk(req.params.id)
  if (user) {
    user = req.body
    user.save()
    res.json(user)
  } else {
    res.status(404).end()
  }
})

module.exports = router
