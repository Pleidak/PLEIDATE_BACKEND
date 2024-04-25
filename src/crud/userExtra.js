const userExtra = require('../models/userExtra.js')

const getOrUpdateUserExtra = async (userId, type, infoKey, infoValue) => {
    const userExtraQr = await userExtra.findOne({
        where: {
            userId: userId,
            [infoKey ? infoKey: 'userId']: infoKey ? infoValue: userId
        }
    })
    if (userExtraQr) {
        if (type=="READ"){
            return userExtraQr
        }
    }
    else {
        if (type=="UPDATE"){
            await userExtra.update({
                [infoKey]: infoValue,
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

module.exports = { getOrUpdateUserExtra }