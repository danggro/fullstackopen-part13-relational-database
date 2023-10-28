require('dotenv').config()
const { Sequelize, QueryTypes } = require('sequelize')
const sequelize = new Sequelize(process.env.DATABASE_URL)

const main = async () => {
  const notes = await sequelize.query('SELECT * FROM blogs', {
    type: QueryTypes.SELECT,
  })
  console.log(notes)
  sequelize.close()
}

main()
