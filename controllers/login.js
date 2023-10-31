const jwt = require('jsonwebtoken')
const router = require('express').Router()
const bcrypt = require('bcrypt')

const { SECRET } = require('../util/config')
const User = require('../models/user')
const UserSession = require('../models/user_session')

router.post('/', async (request, response) => {
  const { username, password } = request.body

  const user = await User.findOne({
    where: { username },
  })

  if (user.disabled) {
    return response
      .status(401)
      .json({ error: 'your account disabled by admin' })
  }
  const session = await UserSession.findOne({
    where: { userId: user.id },
  })

  if (session) {
    return response.json({ token: session.token, username: user.username })
  }

  const passwordCorrect =
    user === null ? false : await bcrypt.compare(password, user.passwordHash)

  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'invalid username or password',
    })
  }

  const userForToken = {
    username: user.username,
    id: user.id,
  }

  const token = jwt.sign(userForToken, SECRET)

  await UserSession.create({ userId: user.id, token })

  response.status(200).send({ token, username: user.username, name: user.name })
})

module.exports = router
