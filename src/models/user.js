import sequelize from "sequelize"
import mysqlSequelize from "./mysqlConfig.js"

const user = mysqlSequelize.define("User", {
    userId: {
        type: sequelize.BIGINT,
        primaryKey: true
    },
    phone: sequelize.BIGINT,
    password: sequelize.STRING(250),
    facebookEmail: sequelize.STRING(250),
    facebookPhone: sequelize.STRING(250),
    isActive: sequelize.BOOLEAN,
})

export default user