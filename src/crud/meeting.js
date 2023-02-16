const meeting = require("../models/meeting")
const likeUser = require('../models/likeUser.js')
const {Op} = require('sequelize')

const getMeeting = async (userId) => {
    let meetingObj = await meeting.findAll({
        where: {
            [Op.or]: [
                {
                    proactiveUserId: userId,
                },
                {
                    passiveUserId: userId
                }
            ]
        },
        order: [
            ['matchTime', 'DESC'],
        ],
    })
    if (meetingObj.length > 0){
        let result = []
        // let result = []
        // proactiveUserIdList = []
        // passiveUserIdList = []
        // meetingObj.forEach(async(m) => {
        //     proactiveUserIdList.push(m.proactiveUserId)
        //     passiveUserIdList.push(m.passiveUserId)
        // })
        // const userLikeList1 = await likeUser.findAll({
        //     where: {
        //         passiveUserId: {
        //             [Op.in]: passiveUserIdList
        //         },
        //         isLiked: true
        //     }
        // })
        for (let i=0; i<meetingObj.length; i++){
            const userLiked = await likeUser.findOne({
                where: {
                    proactiveUserId: userId,
                    passiveUserId: meetingObj[i].proactiveUserId==userId ? meetingObj[i].passiveUserId: meetingObj[i].proactiveUserId,
                }
            })
            console.log(userLiked)
            if (!userLiked){
                result.push(meetingObj[i])
            }
        }
        return result
        // console.log(meetingObj.length)
        // console.log(userLikeList1.length)
        // if (userLikeList1.length > 0){
        //     for (let i=0; i<userLikeList1.length; i++){
        //         // result = meetingObj.filter((m)=>m.proactiveUserId != userLikeList1[i].proactiveUserId)
        //     }  
        //     console.log(result)
        // }
        // const userLikeList2 = await likeUser.findAll({
        //     where: {
        //         passiveUserId: {
        //             [Op.in]: proactiveUserIdList
        //         },
        //         isLiked: true
        //     }
        // })
        // console.log(userLikeList2.length)
        // if (userLikeList2.length > 0){
        //     for (let i=0; i<userLikeList1.length; i++){
        //         meetingObj = meetingObj.filter((m)=>{return m.userId != userLikeList1.proactiveUserId})
        //     }  
        // }
        // console.log(result)
        // return result
    }
    else {
        return meetingObj
    }
}

module.exports = {getMeeting}