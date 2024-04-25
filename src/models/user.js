const sequelize = require("sequelize")
const mysqlSequelize = require("./mysqlConfig.js")

const user = mysqlSequelize.define("User", {
    userId: {
        type: sequelize.BIGINT,
        primaryKey: true
    },
    phone: sequelize.BIGINT,
    password: sequelize.STRING(250),
    facebookEmail: sequelize.STRING(250),
    facebookPhone: sequelize.STRING(250),
    isActive: sequelize.BOOLEAN,
})

module.exports = user