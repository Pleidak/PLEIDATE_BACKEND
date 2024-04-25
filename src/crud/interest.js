const interest = require('../models/interest.js')


const crudUserInterest = async (userId, type, infoKey, infoValue) => {
    const userInterest = await interest.findOne({
        where: {
            userId: userId,
            [infoKey ? infoKey: 'userId']: infoKey ? infoValue: userId
        }
    })
    if (userInterest) {
        if (type != 'READ'){
            await interest.update({
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
        else {
            return userInterest
        }
    }
    else {
        await interest.create({
            userId: userId,
            [infoKey]: infoValue
        }).then((rs) => {
            console.log(rs)
            return true
        })
    }
}

module.exports = { crudUserInterest }