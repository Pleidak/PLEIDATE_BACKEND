import sequelize from "sequelize"
import mysqlSequelize from "./mysqlConfig.js"

const image = mysqlSequelize.define("Image", {
    userId: {
        type: sequelize.BIGINT,
    },
    imagePath: sequelize.STRING,
    isMainImage: sequelize.BOOLEAN,
})

export default image