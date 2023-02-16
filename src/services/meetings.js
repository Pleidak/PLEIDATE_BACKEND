const SERVER_CONFIG = require("../config/server.js")
const calcCrow = require("../utils/CalculateDistance.js")
const jwt = require('jsonwebtoken')
const { getMeeting } = require("../crud/meeting.js")
const { getOrUpdateUserInfo } = require("../crud/userInfo.js")
const { getOrUpdateUserExtra } = require("../crud/userExtra.js")
const { crudUserInterest } = require("../crud/interest.js")
const { crudImage } = require("../crud/media.js")
const {cloudinary} = require('../utils/cloudidary.js')
const { likeOrDislikeUser } = require("../crud/likeUser.js")
const { crudGift } = require("../crud/gift.js")
const { ERROR_MESSAGES, SUCCESS_MESSAGES } = require('../config/messages.js')
const { createGiftGiving } = require("../crud/giftGiving.js")
const { getSuggestionUserInfo } = require("../crud/userSuggestion.js")


const meetings = async (req, res) => {
    const userId = jwt.decode(req.get("Authorization").split(' ')[1]).userId
    console.log(userId)
    let meetingResult = {
        meeting: [],
        userInfo: [],
        userExtra: [],
        userImage: [],
        userInterest: []
    }, count = 0
    getMeeting(userId).then(async(meetingRes)=>{
        if (meetingRes && meetingRes.length > 0){
            meetingRes.forEach(async(e)=>{
                await getOrUpdateUserInfo(e.passiveUserId, "READ", null, null).then(async(userInfo)=>{
                    await getOrUpdateUserExtra(e.passiveUserId, "READ", null, null).then(async(userExtra)=>{
                        await crudUserInterest(e.passiveUserId, "READ", null, null).then(async(userInterest)=>{
                            await crudImage(e.passiveUserId, "READ", null, null).then(async(userImages)=>{
                                userImages.sort((a,b)=> a.order - b.order)
                                let imageList = []
                                let buf = 0, validUserImage = true
                                userImages.forEach((img)=>{
                                    const cloudidaryUrl = cloudinary.url(img.imagePath)
                                    if (!img.imagePath || !cloudidaryUrl){buf ++}
                                    if (buf == userImages.length){validUserImage == false}
                                    imageList.push(cloudinary.url(img.imagePath))
                                })
                                if (validUserImage){
                                    console.log(imageList)
                                    meetingResult.meeting.push(e)
                                    meetingResult.userImage.push(imageList)
                                    meetingResult.userInfo.push(userInfo)
                                    meetingResult.userExtra.push(userExtra)
                                    meetingResult.userInterest.push(userInterest)
                                }
                                count ++
                                if (count == meetingRes.length){
                                    return res.status(200).json({meetingResult: meetingResult})
                                }
                            }, (err)=>{
                                console.log('5 err', err)
                                res.status(422).json({
                                    message: ERROR_MESSAGES.ERROR_OCCURRED,
                                })
                                return
                            })
                        }, (err)=>{
                            console.log('4 err', err)
                            res.status(422).json({
                                message: ERROR_MESSAGES.ERROR_OCCURRED,
                            })
                            return
                        })
                    }, (err)=>{
                        console.log('3 err', err)
                        res.status(422).json({
                            message: ERROR_MESSAGES.ERROR_OCCURRED,
                        })
                        return
                    })
                }, (err)=>{
                    console.log('2 err', err)
                    res.status(422).json({
                        message: ERROR_MESSAGES.ERROR_OCCURRED,
                    })
                    return
                })
            })
        }
        else {
            return res.status(200).json({meetingResult: meetingResult})
        }
    }, (err)=>{
        console.log('1 err', err)
        res.status(422).json({
            message: ERROR_MESSAGES.ERROR_OCCURRED,
        })
    })
}

const getUsers = async (req, res) => {
    const userId = jwt.decode(req.get("Authorization").split(' ')[1]).userId
    console.log(userId)
    let suggestionResult = {
        meeting: [],
        userInfo: [],
        userExtra: [],
        userImage: [],
        userInterest: []
    }, count = 0
    await getSuggestionUserInfo(userId).then(async(suggestionRes)=>{
        console.log(suggestionRes.length)
        if (suggestionRes && suggestionRes.length > 0){
            suggestionRes.forEach(async(e)=>{
                await getOrUpdateUserInfo(e.userId, "READ", null, null).then(async(userInfo)=>{
                    await getOrUpdateUserExtra(e.userId, "READ", null, null).then(async(userExtra)=>{
                        await crudUserInterest(e.userId, "READ", null, null).then(async(userInterest)=>{
                            await crudImage(e.userId, "READ", null, null).then(async(userImages)=>{
                                userImages.sort((a,b)=> a.order - b.order)
                                let imageList = []
                                let buf = 0, validUserImage = true
                                console.log(validUserImage)
                                userImages.forEach((img)=>{
                                    const cloudidaryUrl = cloudinary.url(img.imagePath)
                                    if (!img.imagePath || !cloudidaryUrl){buf ++}
                                    if (buf == userImages.length){validUserImage == false}
                                    imageList.push(cloudinary.url(img.imagePath))
                                })
                                if (validUserImage){
                                    suggestionResult.userImage.push(imageList)
                                    suggestionResult.userInfo.push(userInfo)
                                    suggestionResult.userExtra.push(userExtra)
                                    suggestionResult.userInterest.push(userInterest)
                                }
                                count ++
                                if (count == suggestionRes.length){
                                    return res.status(200).json({suggestionResult: suggestionResult})
                                }
                            }, (err)=>{
                                console.log(err)
                                res.status(422).json({
                                    message: ERROR_MESSAGES.ERROR_OCCURRED,
                                })
                                return
                            })
                        }, (err)=>{
                            console.log(err)
                            res.status(422).json({
                                message: ERROR_MESSAGES.ERROR_OCCURRED,
                            })
                            return
                        })
                    }, (err)=>{
                        console.log(err)
                        res.status(422).json({
                            message: ERROR_MESSAGES.ERROR_OCCURRED,
                        })
                        return
                    })
                }, (err)=>{
                    console.log(err)
                    res.status(422).json({
                        message: ERROR_MESSAGES.ERROR_OCCURRED,
                    })
                    return
                })
            })
        }
        else {
            return res.status(200).json({suggestionResult: suggestionResult})
        }
    }, (err)=>{
        console.log(err)
        res.status(422).json({
            message: ERROR_MESSAGES.ERROR_OCCURRED,
        })
    })
}

const likeUser = async (req, res) => {
    const userId = jwt.decode(req.get("Authorization").split(' ')[1]).userId
    await likeOrDislikeUser(userId, req.body.isLiked, req.body.meetOrSurf, req.body.userTarget).then((result)=>{
        console.log(result)
        return res.status(200).json({result: result})
    }, (err)=>{
        console.log(err)
        res.status(422).json({
            message: ERROR_MESSAGES.ERROR_OCCURRED,
        })
        return
    })
}

const getGiftColection = async(req, res) => {
    const userId = jwt.decode(req.get("Authorization").split(' ')[1]).userId
    await crudGift("READ", userId, null, null, null, null, null).then((result)=>{
        console.log(result)
        return res.status(200).json({result: result})
    }, (err)=>{
        console.log(err)
        res.status(422).json({
            message: ERROR_MESSAGES.ERROR_OCCURRED,
        })
        return
    })
}

const postGift = async(req, res) => {
    const userId = jwt.decode(req.get("Authorization").split(' ')[1]).userId
    console.log(req.body.userTarget)
    await crudGift("UPDATE", userId, req.body.giftId, null, null, -req.body.total, true).then(async()=>{
        await crudGift("CREATE", req.body.userTarget, req.body.giftId, req.body.name, req.body.rarity, req.body.total, false).then(async()=>{
            await createGiftGiving(userId, req.body.userTarget, req.body.giftId, req.body.message).then(()=>{
                return res.status(200).json({
                    message: "OK",
                })
            }, (err)=>{
                console.log(err)
                res.status(422).json({
                    message: ERROR_MESSAGES.ERROR_OCCURRED,
                })
                return
            })
        }, (err)=>{
            console.log(err)
            res.status(422).json({
                message: ERROR_MESSAGES.ERROR_OCCURRED,
            })
            return
        })
    }, (err)=>{
        console.log(err)
        res.status(422).json({
            message: ERROR_MESSAGES.ERROR_OCCURRED,
        })
        return
    })
}

module.exports = {meetings, likeUser, getGiftColection, postGift, getUsers}

    // const io = req.app.get('socketio')
    // const redisClient = req.app.get('redisClient')
    // console.log("go meetting")
    // io.once("connection", (socket) => {
    //     console.log("CONNECTED")
    //     socket.on("joinTracking", async (data) => {
    //     const authHeader = req.get("Authorization");
    //     // console.log(io)

    //         const joinStatus = {
    //             status: false
    //         }
    //         if (data.room && SERVER_CONFIG.ROOMS.includes(data.room)){
    //             socket.join(data.room)
    //             console.log("joined tracking")
    //             await redisClient.sAdd("trackingClientIds", socket.id)
    //             joinStatus.status = true
    //             socket.on("trackingLocation", async (trackingData) => {
    //                 const userId = jwt.decode(req.get("Authorization").split(' ')[1]).userId
    //                 console.log(trackingData)
    //                 trackingData.user = socket.id
    //                 // await redisClient.set("trackingData", JSON.stringify(trackingData));
    //                 try {
    //                     await redisClient.set(socket.id, JSON.stringify(trackingData))
    //                     const trackingClientIds = await redisClient.sMembers("trackingClientIds")
    //                     console.log(trackingClientIds)
    //                     for (let i = 0; i < trackingClientIds.length; i++) {
    //                         console.log(trackingClientIds[i])
    //                         if (trackingClientIds[i] != socket.id){
    //                             const locationInfo = await redisClient.get(trackingClientIds[i])
    //                             const targetLocation = JSON.parse(locationInfo)
    //                             if (calcCrow(trackingData.latitude, trackingData.longitude, targetLocation.latitude, targetLocation.longitude) < 0.01){
    //                                 console.log('met')
    //                             }
    //                         }
    //                     }
    //                 }
    //                 catch (error){
    //                     console.log(error)
    //                 }
    //             })
    //         }
    //         else {
    //             joinStatus.status = false
    //         }
    //         socket.emit("joinStatus", joinStatus)
    //     })
    //     socket.on('disconnect', async () => {
    //         await redisClient.del("trackingClientIds")
    //         console.log('user disconnected');
    //     })
    // })