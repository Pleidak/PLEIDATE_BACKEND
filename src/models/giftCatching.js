const sequelize = require("sequelize")
const mysqlSequelize = require("./mysqlConfig.js")

const giftCatching = mysqlSequelize.define("GiftCatching", {
    userId: {
        type: sequelize.BIGINT,
    },
    giftId: sequelize.STRING,
    caughtTime: sequelize.DATE,
    info: sequelize.STRING
})

module.exports = giftCatching