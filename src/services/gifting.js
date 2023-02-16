const { giftList } = require("../config/giftList");
const { crudGiftRemaining, createGiftCatching, getGiftGiving } = require("../crud/giftGiving");
const jwt = require('jsonwebtoken');
const { crudGift } = require("../crud/gift");
const { ERROR_MESSAGES } = require("../config/messages");
const { getOrUpdateUserInfo } = require("../crud/userInfo");
const { crudImage } = require("../crud/media");
const { cloudinary } = require("../utils/cloudidary");

const randomWithProbability = (notRandomNumbers) => {
    var idx = Math.floor(Math.random() * notRandomNumbers.length);
    return notRandomNumbers[idx];
}

const randomGiftCatching = () =>{
    let randomGiftResult = []
    let randomList = []
    let normalList = [], mediumList = [], rarityList = [], epicList = [], legendList = []
    for (let i=0; i<giftList.length; i++){
        switch (giftList[i].rarity){
            case ("Thường"): {
                normalList.push(giftList[i])
                break
            }
            case ("Trung bình"):  {
                mediumList.push(giftList[i])
                break
            }
            case ("Quý hiếm"):  {
                rarityList.push(giftList[i])
                break
            }
            case ("Sử thi"): {
                epicList.push(giftList[i])
                break
            }
            case ("Huyền thoại"):  {
                legendList.push(giftList[i])
                break
            }
        }
    }

    const fillupRandomList = (targetList, amount) => {
        let targetListLength = targetList.length
        for (let i=0; i<targetListLength; i++){
            if (targetListLength < amount){
                targetList.push(targetList[i])
                targetListLength ++ 
            }
        }
        return targetList
    }

    let valiableList = [
        fillupRandomList(normalList, 700), fillupRandomList(mediumList, 250), fillupRandomList(rarityList, 30), fillupRandomList(epicList, 15), fillupRandomList(legendList, 5)
    ]

    valiableList.forEach((e)=>{
        randomList = randomList.concat(e)
    })

    for (let i=0; i<1000; i++){
        const randomData = randomWithProbability(randomList)
        randomGiftResult.push({
            id: i,
            giftId: randomData.giftId,
            name: randomData.name,
            rarity: randomData.rarity
        })
    }
    return randomGiftResult
}

const getRandomGiftCatching = async (req, res) => {
    const userId = jwt.decode(req.get("Authorization").split(' ')[1]).userId
    try {
        const randomGiftCatchingResult = randomGiftCatching()
        await crudGiftRemaining("GET", userId, null, null).then(async(giftRemaining)=>{
            console.log(giftRemaining)
            return res.status(200).json({randomGiftCatchingResult: randomGiftCatchingResult, giftRemaining: giftRemaining})
        })
    }
    catch (err) {
        console.log(err)
        res.status(422).json({
            message: ERROR_MESSAGES.ERROR_OCCURRED,
        })
    }
}

const createGiftCatchingHandler = async(req, res) => {
    const userId = jwt.decode(req.get("Authorization").split(' ')[1]).userId
    try {
        await crudGiftRemaining("UPDATE", userId, req.body.giftRemaining, Date.now()).then(async()=>{
            await createGiftCatching(userId, req.body.giftId, req.body.caughtTime, null).then(async(result)=>{
                if (result){
                    await crudGift("CREATE", userId, req.body.giftId, req.body.name, req.body.rarity, 1, true).then(async()=>{
                        console.log("OK")
                        return res.status(200).json({
                            success: true,
                        })
                    }, (err)=>{
                        console.log(err)
                        res.status(422).json({
                            message: ERROR_MESSAGES.ERROR_OCCURRED,
                        })
                        return
                    })

                }
                else {
                    return res.status(200).json({
                        success: false,
                    })
                }
            }, (err)=>{
                console.log(err)
                res.status(422).json({
                    message: ERROR_MESSAGES.ERROR_OCCURRED,
                })
            })
        }, (err)=>{
            console.log(err)
            res.status(422).json({
                message: ERROR_MESSAGES.ERROR_OCCURRED,
            })
        })
       
    }
    catch (err) {
        console.log(err)
        res.status(422).json({
            message: ERROR_MESSAGES.ERROR_OCCURRED,
        })
    }
}

const getGiftColectionHandler = async (req, res) => {
    const userId = jwt.decode(req.get("Authorization").split(' ')[1]).userId
    await crudGift("READ", userId, null, null, null, null, null).then(async (getGiftColectionResult)=>{
        await getGiftGiving(userId).then(async (giftGivingResult)=>{
            const giftGivingUsers = []
            const topGivingusers = {}, topGivingGifts = [], topGivingUserInfo = []
            for (let i=0; i<giftGivingResult.length; i++){
                giftGivingUsers.push(giftGivingResult[i].userId)
            }
            for (let i=0; i<getGiftColectionResult.length; i++){
                if (!getGiftColectionResult[i].ownOrReceived) {
                    topGivingGifts.push(getGiftColectionResult[i])
                }
            }
            giftGivingUsers.forEach(function (x) { topGivingusers[x] = (topGivingusers[x] || 0) + 1; })
            const resultTopGivingUsers = Object.keys(topGivingusers).sort(function(a,b){return topGivingusers[a]-topGivingusers[b]})
            console.log(resultTopGivingUsers)
            let count = 0
            if (resultTopGivingUsers > 0) {
                for (let i=0; i<resultTopGivingUsers.length; i++) {
                    await getOrUpdateUserInfo(resultTopGivingUsers[i], "READ", null, null).then(async(userInfo)=>{
                        await crudImage(resultTopGivingUsers[i], "READ", null, null).then(async(userImages)=>{
                            count ++
                            let mainAvatar = ''
                            userImages.forEach((e)=>{
                                if (e.isMainImage){
                                    const cloudidaryUrl = cloudinary.url(e.imagePath)
                                    mainAvatar = cloudidaryUrl
                                }
                            })
                            topGivingUserInfo.push({
                                userId: resultTopGivingUsers[i],
                                name: userInfo.name,
                                mainAvatar: mainAvatar
                            })
                            console.log(count)
                            if (count == resultTopGivingUsers.length) {
                                return res.status(200).json({giftColectionResult: getGiftColectionResult, topGivingUserInfo: topGivingUserInfo, topGivingGifts: topGivingGifts})
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
                }
            }
            else {
                return res.status(200).json({giftColectionResult: getGiftColectionResult, topGivingUserInfo: topGivingUserInfo, topGivingGifts: topGivingGifts})
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
}

module.exports = {getRandomGiftCatching, createGiftCatchingHandler, getGiftColectionHandler}