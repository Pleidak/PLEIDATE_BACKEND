const userProfile = require('../models/userProfile.js')


const getOrUpdateUserInfo = async (userId, type, infoKey, InfoValue) => {
    const userInfoQr = await userProfile.findOne({
        where: {
            userId: userId,
            [infoKey ? infoKey: 'userId']: infoKey ? InfoValue: userId
        }
    })
    if (userInfoQr) {
        if (type=="READ"){
            return userInfoQr
        }
    }
    else {
        if (type=="UPDATE"){
            await userProfile.update({
                [infoKey]: InfoValue,
            },{
                where: {
                    userId: userId
                }
            }).then((rs) => {
                console.log(rs)
                return true
            })
        }
    }
}

module.exports = { getOrUpdateUserInfo }