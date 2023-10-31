const UserSession = require('../models/user_session')
const { SECRET } = require('./config')
const jwt = require('jsonwebtoken')

const tokenExtractor = async (req, res, next) => {
  const authorization = req.get('authorization')
  const session = await UserSession.findOne({
    where: { token: authorization.substring(7) },
  })
  if (
    authorization &&
    authorization.toLowerCase().startsWith('bearer ') &&
    session
  ) {
    try {
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET)
    } catch (error) {
      console.log(error)
      return res.status(401).json({ error: 'token invalid' })
    }
  } else {
    return res.status(401).json({ error: 'token missing' })
  }

  next()
}

module.exports = { tokenExtractor }
