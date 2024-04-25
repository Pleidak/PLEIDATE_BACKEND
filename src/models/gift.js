const sequelize = require("sequelize")
const mysqlSequelize = require("./mysqlConfig.js")

const gift = mysqlSequelize.define("Gift", {
    userId: {
        type: sequelize.BIGINT,
    },
    giftId: sequelize.STRING,
    name: sequelize.STRING,
    rarity: sequelize.STRING,
    amount: sequelize.INTEGER,
    ownOrReceived: sequelize.BOOLEAN
})

module.exports = gift