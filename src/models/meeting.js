const sequelize = require("sequelize")
const mysqlSequelize = require("./mysqlConfig.js")

const meetting = mysqlSequelize.define("Meeting", {
    proactiveUserId: {
        type: sequelize.BIGINT,
    },
    passiveUserId: {
        type: sequelize.BIGINT,
    },
    proactiveLongitude: sequelize.STRING(250),
    proactiveLatitude: sequelize.STRING(250),
    passiveLongtitude: sequelize.STRING(250),
    passiveLatitude: sequelize.STRING(250),
    matchTime: sequelize.DATE
})

module.exports = meetting