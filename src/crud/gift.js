const gift = require("../models/gift.js")
const {Op} = require('sequelize')

const crudGift = async (type, userId, giftId, name, rarity, amount, ownOrReceived) => {
    const query = await gift.findAll({
        where: {
            userId: userId,
            giftId: giftId ? giftId : {
                [Op.not]: null
            },
            rarity: rarity ? rarity : {
                [Op.not]: null
            },
            ownOrReceived: ownOrReceived ? ownOrReceived : {
                [Op.not]: null
            }
        }
    })
    switch (type) {
        case "CREATE": {
            if (query.length > 0){
                await gift.update({
                    amount: query[0].amount + amount,
                    ownOrReceived: ownOrReceived 
                }, {
                    where: {
                        userId: userId,
                        giftId: giftId,
                    }
                })
                return true
            }
            else {
                await gift.create({
                    userId: userId,
                    giftId: giftId,
                    name: name,
                    rarity: rarity,
                    amount: amount,
                    ownOrReceived: ownOrReceived 
                })
                return true
            }
        }
        case "READ": {
            if (query.length > 0){
                order = [ 'Thường', 'Trung bình', 'Quý hiếm', 'Sử thi', 'Huyền thoại']
                query.sort(function(a, b){
                    return order.indexOf(a.rarity) - order.indexOf(b.rarity)
                });                
                return query
            }
            else {return false}
        }
        case "UPDATE": {
            if (query.length > 0){
                await gift.update({
                    amount: query[0].amount + amount,
                    ownOrReceived: ownOrReceived 
                }, {
                    where: {
                        userId: userId,
                        giftId: giftId,
                    }
                })
                return true
            }
        }
        // case "DELETE": {
        //     if (query){
        //         console.log(query.amount)
        //         console.log(amount)
        //         await gift.update({
        //             amount: query.amount + amount,
        //         },{
        //             where: {
        //                 userId: userId,
        //                 giftId: giftId,
        //             }
        //         })
        //         return true
        //     }
        //     else {return false}
        // }
    }
}


module.exports = {crudGift}