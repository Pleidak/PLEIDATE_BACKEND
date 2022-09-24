import mysqlSequelize from "./mysqlConfig.js"
import user from "./user.js"
import userProfile from "./userProfile.js"
import meetting from "./meeting.js"

export default function createMysqlSequelize(){
    //userProfile
    user.hasMany(userProfile, {foreignKey: 'userId'})
    userProfile.belongsTo(user, {foreignKey: 'userId'})
    //meeting
    user.hasMany(meetting)
    meetting.belongsTo(user)
    
    return mysqlSequelize
}