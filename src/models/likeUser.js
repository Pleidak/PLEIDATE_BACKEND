const sequelize = require("sequelize")
const mysqlSequelize = require("./mysqlConfig.js")

const likeUser = mysqlSequelize.define("LikeUser", {
    proactiveUserId: {
        type: sequelize.BIGINT,
    },
    passiveUserId: {
        type: sequelize.BIGINT,
    },
    meetOrSurf: sequelize.BOOLEAN,
    isLiked: sequelize.BOOLEAN,
    createdTime: sequelize.DATE
})

module.exports = likeUser