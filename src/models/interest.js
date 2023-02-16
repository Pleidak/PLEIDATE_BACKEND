const sequelize = require("sequelize")
const mysqlSequelize = require("./mysqlConfig.js")

const interest = mysqlSequelize.define("Interest", {
    userId: {
        type: sequelize.BIGINT,
        foreignKey: true
    },
    hobby: sequelize.STRING
})

module.exports = interest