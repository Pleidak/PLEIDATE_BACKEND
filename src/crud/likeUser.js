const likeUser = require('../models/likeUser.js')
const matching = require('../models/matching.js')
const {Op} = require('sequelize')

const likeOrDislikeUser = async (userId, isLiked, meetOrSurf, userTarget) => {
    const userLike = await likeUser.findOne({
        where: {
            proactiveUserId: userId,
            passiveUserId: userTarget
        }
    })
    if (userLike){
        const userMatching = await matching.findOne({
            where: {
                [Op.or]: [
                    {
                        proactiveUserId: userId,
                        passiveUserId: userTarget
                    },
                    {
                        proactiveUserId: userTarget,
                        passiveUserId: userId
                    }
                ]
               
            }
        })
        if (!userMatching){
            await likeUser.update({
                isLiked: isLiked,
                meetOrSurf: meetOrSurf
            }, {
                where: {
                    proactiveUserId: userId,
                    passiveUserId: userTarget
                }
            })
            return {success: true, isMatched: false}
        }
       
    }
    else {
        const newLikeUserRecord = await likeUser.create({
            proactiveUserId: userId,
            passiveUserId: userTarget,
            isLiked: isLiked,
            meetOrSurf: meetOrSurf,
            createTime: Date.now()
        })
        console.log(newLikeUserRecord)
        if (newLikeUserRecord){
            const targetLike = await likeUser.findOne({
                where: {
                    proactiveUserId: userTarget,
                    passiveUserId: userId
                }
            })
            if (targetLike){
                return {success: true, isMatched: true}
            }
            else {
                return {success: true, isMatched: false}
            }
        }
    }
}

module.exports = {likeOrDislikeUser}
