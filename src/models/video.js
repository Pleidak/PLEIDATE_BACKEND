import sequelize from "sequelize"
import mysqlSequelize from "./mysqlConfig.js"

const video = mysqlSequelize.define("Video", {
    videoPath: sequelize.STRING,
    isMainVideo: sequelize.BOOLEAN,
})

export default video