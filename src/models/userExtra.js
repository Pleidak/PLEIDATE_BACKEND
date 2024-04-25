const sequelize = require("sequelize")
const mysqlSequelize = require("./mysqlConfig.js")

const userExtra = mysqlSequelize.define("UserExtra", {
    userId: {
        type: sequelize.BIGINT,
        primaryKey: true
    },
    height: sequelize.STRING,
    exercise: sequelize.STRING,
    educationLevel: sequelize.STRING,
    drinking: sequelize.STRING,
    smoking: sequelize.STRING,
    gender: sequelize.INTEGER,
    kids: sequelize.STRING,
    starSign: sequelize.STRING,
    politics: sequelize.STRING,
    religion: sequelize.STRING,
    language: sequelize.STRING
})

module.exports = userExtra