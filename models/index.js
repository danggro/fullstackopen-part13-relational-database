const Blog = require('./blog')
const User = require('./user')
const UserReads = require('./user_read')
const UserSession = require('./user_session')

User.hasMany(Blog)
Blog.belongsTo(User)

User.belongsToMany(Blog, { through: UserReads, as: 'readings' })
Blog.belongsToMany(User, { through: UserReads, as: 'listed_user' })

UserSession.belongsTo(User)

module.exports = {
  Blog,
  User,
}
