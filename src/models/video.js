const sequelize = require("sequelize")
const mysqlSequelize = require("./mysqlConfig.js")

const video = mysqlSequelize.define("Video", {
    videoPath: sequelize.STRING,
    isMainVideo: sequelize.BOOLEAN,
})

module.exports = video