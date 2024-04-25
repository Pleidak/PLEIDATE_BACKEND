const sequelize = require("sequelize")
const mysqlSequelize = require("./mysqlConfig.js")

const matching = mysqlSequelize.define("Matching", {
    proactiveUserId: {
        type: sequelize.BIGINT,
    },
    passiveUserId: {
        type: sequelize.BIGINT,
    },
    meetOrSurf: sequelize.BOOLEAN,
    matchingTime: sequelize.DATE
})

module.exports = matching