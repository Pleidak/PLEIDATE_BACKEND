import sequelize from "sequelize"
import MYSQL_CONFIG from "../configs/mysql.js"


const mysqlSequelize = new sequelize({
    database: "pleidate",
    username: MYSQL_CONFIG.username,
    password: MYSQL_CONFIG.password,
    host: MYSQL_CONFIG.host,
    port: MYSQL_CONFIG.port,
    dialect: "mysql",
    dialectOptions: {
        ssl: false
    },
    define: {
        freezeTableName: true
    },
    logging: false
})

mysqlSequelize.authenticate()

export default mysqlSequelize