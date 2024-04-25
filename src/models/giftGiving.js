const sequelize = require("sequelize")
const mysqlSequelize = require("./mysqlConfig.js")

const giftGiving = mysqlSequelize.define("GiftGiving", {
    userId: {
        type: sequelize.BIGINT,
    },
    targetId: sequelize.STRING,
    giftId: sequelize.STRING,
    message: sequelize.STRING
})

module.exports = giftGiving