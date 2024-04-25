const sequelize = require("sequelize")
const mysqlSequelize = require("./mysqlConfig.js")

const image = mysqlSequelize.define("Image", {
    userId: {
        type: sequelize.BIGINT,
    },
    order: sequelize.INTEGER,
    imagePath: sequelize.STRING,
    isMainImage: sequelize.BOOLEAN,
})

module.exports = image