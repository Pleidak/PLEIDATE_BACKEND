import mysqlSequelize from "./mysqlConfig.js"
import user from "./user.js"
import userProfile from "./userProfile.js"

export default function createMysqlSequelize(){
    user.hasMany(userProfile, {foreignKey: 'userId'})
    userProfile.belongsTo(user, {foreignKey: 'userId'})
    return mysqlSequelize
}