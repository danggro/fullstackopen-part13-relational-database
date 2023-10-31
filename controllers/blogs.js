const router = require('express').Router()
const { Blog, User } = require('../models')
const { Op } = require('sequelize')
const { tokenExtractor } = require('../util/middleware')

router.get('/', async (req, res) => {
  const where = {}

  if (req.query.search) {
    where[Op.or] = [
      {
        title: {
          [Op.iLike]: `%${req.query.search}%`,
        },
      },
      {
        author: {
          [Op.iLike]: `%${req.query.search}%`,
        },
      },
    ]
  }

  const blogs = await Blog.findAll({
    attributes: { exclude: ['userId'] },
    include: {
      model: User,
      attributes: ['name'],
    },
    where,
    order: [['likes', 'DESC']],
  })
  console.log(JSON.stringify(blogs, null, 2))
  res.json(blogs)
})

router.post('/', tokenExtractor, async (req, res) => {
  const user = await User.findByPk(req.decodedToken.id)
  const blog = await Blog.create({ ...req.body, userId: user.id })
  res.json(blog)
})

const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id)
  next()
}

router.put('/:id', blogFinder, async (req, res) => {
  if (req.blog) {
    req.blog.likes = req.body.likes
    await req.blog.save()
    res.json(req.blog)
  } else {
    res.sendStatus(404)
  }
})

router.delete('/:id', blogFinder, tokenExtractor, async (req, res) => {
  if (req.decodedToken.id !== req.blog.userId) {
    return res.status(401).json({ error: 'no authorization' })
  }
  if (req.blog) {
    await req.blog.destroy()
    res.sendStatus(204)
  } else {
    res.sendStatus(404)
  }
})

module.exports = router
