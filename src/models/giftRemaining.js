const sequelize = require("sequelize")
const mysqlSequelize = require("./mysqlConfig.js")

const giftReamaining = mysqlSequelize.define("GiftRemaining", {
    userId: {
        type: sequelize.BIGINT,
    },
    turnLeft: sequelize.INTEGER,
    lastTime: sequelize.DATE
})

module.exports = giftReamaining