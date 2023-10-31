const UserSession = require('../models/user_session')
const { tokenExtractor } = require('../util/middleware')

const router = require('express').Router()

router.delete('/', tokenExtractor, async (req, res) => {
  const session = await UserSession.findOne({
    where: { userId: req.decodedToken.id },
  })
  await session.destroy()
  res.status(200).send({ message: 'logout' })
})

module.exports = router
