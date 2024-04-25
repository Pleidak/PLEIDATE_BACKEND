const User = require('../models/user.js')


const getOrUpdateUser = async (userId, type, infoKey, InfoValue) => {
    const user = await User.findOne({
        where: {
            userId: userId,
            [infoKey ? infoKey: 'userId']: infoKey ? InfoValue: userId
        }
    })
    if (user) {
        if (type=="READ"){
            return user
        }
    }
    else {
        if (type=="UPDATE"){
            await User.update({
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

module.exports = { getOrUpdateUser }