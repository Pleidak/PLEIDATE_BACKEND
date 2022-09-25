import mysqlSequelize from "./mysqlConfig.js"
import user from "./user.js"
import userProfile from "./userProfile.js"
import meetting from "./meeting.js"
import image from "./image.js"
import video from "./video.js"

export default function createMysqlSequelize(){
    //userProfile
    user.hasOne(userProfile, {foreignKey: 'userId'})
    userProfile.belongsTo(user, {foreignKey: 'userId'})
    //meeting
    user.hasMany(meetting)
    meetting.belongsTo(user)
    //media
    user.hasMany(image)
    image.belongsTo(user)
    user.hasMany(video)
    video.belongsTo(user)
    
    return mysqlSequelize
}