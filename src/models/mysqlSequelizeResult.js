const mysqlSequelize = require("./mysqlConfig.js")
const user = require("./user.js")
const userProfile = require("./userProfile.js")
const userExtra = require("./userExtra.js")
const meetting = require("./meeting.js")
const image = require("./image.js")
const video = require("./video.js")
const interest = require("./interest")
const likeUser = require("./likeUser.js")
const matching = require("./matching.js")
const giftReamaining = require("./giftRemaining.js")
const giftCatching = require("./giftCatching.js")

module.exports = createMysqlSequelize = ()=> {
    //userProfile
    user.hasOne(userProfile, {foreignKey: 'userId'})
    userProfile.belongsTo(user, {foreignKey: 'userId'})
    //userExtra
    user.hasOne(userExtra, {foreignKey: 'userId'})
    userExtra.belongsTo(user, {foreignKey: 'userId'})
    //meeting
    user.hasMany(meetting, {foreignKey: 'proactiveUserId'})
    meetting.belongsTo(user, {foreignKey: 'proactiveUserId'})
    user.hasMany(meetting, {foreignKey: 'passiveUserId'})
    meetting.belongsTo(user, {foreignKey: 'passiveUserId'})
    //interest
    user.hasMany(interest, {foreignKey: 'userId'})
    interest.belongsTo(user, {foreignKey: 'userId'})
    //media
    user.hasMany(image, {foreignKey: 'userId'})
    image.belongsTo(user, {foreignKey: 'userId'})
    user.hasMany(video)
    video.belongsTo(user)
    //likeUser
    user.hasMany(likeUser, {foreignKey: 'proactiveUserId'})
    likeUser.belongsTo(user, {foreignKey: 'proactiveUserId'})
    user.hasMany(likeUser, {foreignKey: 'passiveUserId'})
    likeUser.belongsTo(user, {foreignKey: 'passiveUserId'})
    //matching
    user.hasMany(matching, {foreignKey: 'proactiveUserId'})
    matching.belongsTo(user, {foreignKey: 'proactiveUserId'})
    user.hasMany(matching, {foreignKey: 'passiveUserId'})
    matching.belongsTo(user, {foreignKey: 'passiveUserId'})
    //gift
    user.hasMany(giftReamaining, {foreignKey: 'userId'})
    giftReamaining.belongsTo(user, {foreignKey: 'userId'})
    user.hasMany(giftCatching, {foreignKey: 'userId'})
    giftCatching.belongsTo(user, {foreignKey: 'userId'})

    return mysqlSequelize
}