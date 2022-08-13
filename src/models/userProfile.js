import sequelize from "sequelize"
import mysqlSequelize from "./mysqlConfig.js"

const userProfile = mysqlSequelize.define("UserProfile", {
    userId: {
        type: sequelize.BIGINT,
        primaryKey: true
    },
    is_verified: sequelize.BOOLEAN,
    name: sequelize.STRING,
    nickname: sequelize.STRING,
    gift: sequelize.INTEGER,
    coins: sequelize.INTEGER,
    age: sequelize.INTEGER,
    gender: sequelize.STRING,
    location: sequelize.STRING,
    hometown: sequelize.STRING,
    bio: sequelize.STRING,
    work: sequelize.STRING,
    education: sequelize.STRING
})

export default userProfile