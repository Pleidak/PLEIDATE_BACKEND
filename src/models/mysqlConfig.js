const sequelize = require("sequelize")
const MYSQL_CONFIG = require("../config/mysql.js")


const mysqlSequelize = new sequelize({
    database: "pleidate",
    username: MYSQL_CONFIG.USERNAME,
    password: MYSQL_CONFIG.PASSWORD,
    host: MYSQL_CONFIG.HOST,
    port: MYSQL_CONFIG.PORT,
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

module.exports = mysqlSequelize