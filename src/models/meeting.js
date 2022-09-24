import sequelize from "sequelize"
import mysqlSequelize from "./mysqlConfig.js"

const meetting = mysqlSequelize.define("Meeting", {
    proactiveUserId: {
        type: sequelize.BIGINT,
    },
    passiveUserId: {
        type: sequelize.BIGINT,
    },
    proactiveLongtitude: sequelize.STRING(250),
    proactiveLatitude: sequelize.STRING(250),
    passiveLongtitude: sequelize.STRING(250),
    passiveLatitude: sequelize.STRING(250),
    matchTime: sequelize.DATE
})

export default meetting