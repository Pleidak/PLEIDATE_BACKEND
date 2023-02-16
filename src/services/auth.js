
const jwt = require('jsonwebtoken')
const User = require('../models/user.js')
const Twilio = require('twilio')
const { ERROR_MESSAGES, SUCCESS_MESSAGES } = require('../config/messages.js')
const TWILIO_CONFIG = require('../config/twilio.js')
const twilio = new Twilio(TWILIO_CONFIG.ACCOUNT_SID, TWILIO_CONFIG.AUTH_TOKEN);
const { getOrUpdateUser } = require('../crud/user.js')
const { getOrUpdateUserInfo } = require('../crud/userInfo.js')
const { getOrUpdateUserExtra } = require('../crud/userExtra.js')
const { crudUserInterest } = require('../crud/interest.js')
const { crudImage } = require('../crud/media.js')
const userProfile = require('../models/userProfile.js')
// const { AWSUpload } = require('../utils/Cloud.js';
const {cloudinary} = require('../utils/cloudidary.js')
const formidable = require("formidable")
const e = require('express')
const userExtra = require('../models/userExtra.js')


const getRndInteger = (min, max) => {
    return Math.floor(Math.random() * (max - min)) + min;
}

const login = (req, res) => {
    console.log(req.body.phone)
    // twilio
    // .verify
    // .services(TWILIO_CONFIG.SERVICE_SID)
    // .verifications
    // .create({
    //     to: req.body.phone,
    //     channel: req.query.channel==='call' ? 'call' : 'sms' 
    // })
    // .then(data => {
        return res.status(200).json({
            message: SUCCESS_MESSAGES.CODE_SENT,
            phone: req.body.phone,
        })
    // })
    // .catch((err) => {
    //     console.log(err)
    //     return res.status(422).json({
    //         message: ERROR_MESSAGES.ERROR_OCCURRED
    //     })
    // })
}

const verify = (req, res) => {
    console.log(req.body.code)
    console.log(req.body.phone)
    if (req.body.phone && req.body.code && (req.body.code).length === 6) {
        console.log(1)
        // twilio
        // .verify
        // .services(TWILIO_CONFIG.SERVICE_SID)
        // .verificationChecks
        // .create({
        //     to: req.body.phone,
        //     code: req.body.code
        // })
        // .then(data => {
        //     console.log(333)
        //     if (true) {
                const signToken = (userId, mainAvatar, isActive) => {
                    const token = jwt.sign({ userId: userId }, 'pleidatesecret');
                        res.status(200).json({
                            message: "OK",
                            userId: userId,
                            mainAvatar: mainAvatar,
                            token: token,
                            isActive: isActive
                        })
                }
                User.findOne({ where : {
                    phone: req.body.phone
                }})
                .then(async (dbUser) => {
                    if (!dbUser) {
                        const createUser = async () => {
                            const uid = getRndInteger(1000000000, 10000000000)
                            console.log(uid)
                            await User.findOne({
                                where: {
                                    userId: uid
                                }
                            }).then(async (existUidUser) => {
                                if (existUidUser){
                                    await createUser()
                                }
                                else {
                                    try {
                                        User.create({
                                            userId: uid,
                                            phone: req.body.phone,
                                            facebookMail: null,
                                            facebookPhone: null,
                                            isActive: false
                                        }).then(rs => {
                                            if (rs){
                                                try {
                                                    userProfile.create({
                                                        userId: uid,
                                                        isVerified: false,
                                                        name: null,
                                                        nickname: null,
                                                        gifts: 0,
                                                        coins: 0,
                                                        age: 0,
                                                        gender: null,
                                                        location: null,
                                                        hometown: null,
                                                        bio: null,
                                                        work: null,
                                                        education: null 
                                                    }).then(()=>{
                                                        userExtra.create({
                                                            userId: uid,
                                                            height: null,
                                                            exercise: null,
                                                            educationLevel: null,
                                                            smoking: 0,
                                                            Gender: null,
                                                            kids: null,
                                                            starSign: null,
                                                            politics: null,
                                                            religion: null,
                                                            language: null
                                                        }).then(()=>{
                                                            const beginGifts = beginGifts
                                                            beginGifts.forEach(gift => {
                                                                gift.create({
                                                                    userId: uid,
                                                                    giftId: beginGifts.giftId,
                                                                    name: beginGifts.name,
                                                                    rarity: beginGifts.rarity,
                                                                    amount: beginGiftsbeginGifts.amount,
                                                                    ownOrReceived: beginGifts.ownOrReceived 
                                                                })
                                                            })
                                                            signToken(rs.userId, '', false)
                                                        })
                                                    })
                                                    
                                                }
                                                catch (err) {
                                                    return res.status(422).json({
                                                        message: ERROR_MESSAGES.ERROR_OCCURRED
                                                    })
                                                }
                                            }
                                            else {
                                                return res.status(422).json({
                                                    message: ERROR_MESSAGES.ERROR_OCCURRED
                                                })
                                            }
                                        })
                                    }
                                    catch (err){
                                        return res.status(422).json({
                                            message: ERROR_MESSAGES.ERROR_OCCURRED
                                        })
                                    }
                                }
                            })
                            return 
                        }
                        createUser()
                    } 
                    else {
                        console.log(dbUser.isActive)
                        let mainAvatar = ''
                        let order = 3
                        const imgs = await crudImage(dbUser.userId, "READ", 0, null)
                        console.log(imgs.length)
                        if (imgs.length > 0){
                            for (let i=0; i<imgs.length; i++){
                                console.log(imgs[i].order)
                                if (imgs[i].order <= order){
                                    order = imgs[i].order
                                    mainAvatar = imgs[i].imagePath
                                    console.log(mainAvatar)

                                }
                            }
                            console.log(mainAvatar)
                            signToken(dbUser.userId, cloudinary.url(mainAvatar), dbUser.isActive)
                        }
                        else {
                            signToken(dbUser.userId, mainAvatar, dbUser.isActive)
                        }
                    }
                })
                .catch(err => {
                    console.log('error', err)
                })
        //     }
        //     else {
        //         res.status(422).json({
        //             message: ERROR_MESSAGES.INVALID_CODE,
        //         })
        //     }
        // })
    } else {
        res.status(422).json({
            message: ERROR_MESSAGES.WRONG_PHONE_OR_CODE,
        })
    }
}

const addUserBegin = async (req, res) => {
    const userId = jwt.decode(req.get("Authorization").split(' ')[1]).userId
    if (req.body.infoKey && req.body.infoValue){
        await getOrUpdateUser(userId, "UPDATE", req.body.infoKey, req.body.infoValue).then(async()=>{
            res.status(200).json({
                    message: "OK",
                })
            }, (err) => {
                console.log(err)
                res.status(422).json({
                    message: ERROR_MESSAGES.ERROR_OCCURRED,
                })
            }
        )      
        
    }
}

const addUserInfoBegin = async (req, res) => {
    const userId = jwt.decode(req.get("Authorization").split(' ')[1]).userId
    if (req.body.infoKey && req.body.infoValue){
        await getOrUpdateUserInfo(userId, "UPDATE", req.body.infoKey, req.body.infoValue).then(async()=>{
            res.status(200).json({
                    message: "OK",
                })
            }, (err) => {
                console.log(err)
                res.status(422).json({
                    message: ERROR_MESSAGES.ERROR_OCCURRED,
                })
            }
        )      
        
    }
}

const addUserExtraBegin = async (req, res) => {
    const userId = jwt.decode(req.get("Authorization").split(' ')[1]).userId
    console.log(req.body.infoKey)
    console.log(req.body.infoValue)
    if (req.body.infoKey && req.body.infoValue){
        await getOrUpdateUserExtra(userId, "UPDATE", req.body.infoKey, req.body.infoValue).then(async()=>{
            res.status(200).json({
                    message: "OK",
                })
            }, (err) => {
                console.log(err)
                res.status(422).json({
                    message: ERROR_MESSAGES.ERROR_OCCURRED,
                })
            }
        )      
        
    }
}

const addUserInterestBegin = async (req, res) => {
    const userId = jwt.decode(req.get("Authorization").split(' ')[1]).userId
    if (req.body.infoKey && req.body.infoValue){
        const interest = req.body.infoValue
        let count = 0
        console.log(interest)
        for (let i=0; i<interest.length; i++){
            if (interest[i]){
                await crudUserInterest(userId, 'CREATE', 'hobby', interest[i]).then(async()=>{
                    count ++
                    if (count == interest.length){
                    console.log(count)

                        res.status(200).json({
                            message: "OK",
                        })
                    }
                }, (err) => {
                    console.log(err)
                    res.status(422).json({
                        message: ERROR_MESSAGES.ERROR_OCCURRED,
                    })
                    return                
                }
            )      
            }
        }
    }
}

const addMedia = async (req, res) => {
    console.log(123)
    const userId = jwt.decode(req.get("Authorization").split(' ')[1]).userId
    const form = formidable({ multiples: true });

    form.parse(req, async (err, fields, f) => {
        let avatar = f.files
        let count = 0
        let mainAvatarUrl = ''
        console.log(!Array.isArray(avatar))
        if (!Array.isArray(avatar)){avatar = [avatar]}
        for (let i=0; i<avatar.length; i++){
            try {
                console.log(avatar[i])
                const dotType = avatar[i].mimetype.substring(avatar[i].mimetype.indexOf("/") + 1)
                await cloudinary.uploader.upload(avatar[i].filepath, {
                    public_id: `avatar_${userId}_${i}`
                }, (error, result)=>{
                    console.log(result, error);
                    if (!error){
                        crudImage(userId, "CREATE", fields.order[i], `avatar_${userId}_${i}.${dotType}`).then(()=>{
                            count ++
                            if (i==0){
                                mainAvatarUrl = result.url
                            }
                            console.log(1)
                            if (count== avatar.length){
                                res.status(200).json({
                                    message: "OK",
                                    mainAvatar: mainAvatarUrl
                                })
                            }
                        }, async ()=>{
                            await crudImage(userId, "UPDATE", fields.order[i], `avatar_${userId}_${i}.${dotType}`).then(()=>{
                                count ++
                                console.log(2)
                                if (count == avatar.length){
                                    res.status(200).json({
                                        message: "OK",
                                    })
                                }
                            }, ()=>{
                                console.log(3)
                                res.status(422).json({
                                    message: ERROR_MESSAGES.ERROR_OCCURRED,
                                })
                                return
                            })
                        })
                    }
                    else {
                        res.status(422).json({
                            message: ERROR_MESSAGES.ERROR_OCCURRED,
                        })
                        return
                    }
                })
            } catch (err) {
                console.log(err)
                res.status(422).json({
                    message: ERROR_MESSAGES.ERROR_OCCURRED,
                })
                return
            }
            
        }
    })
}

const logout = (req, res) => {
    return res.status(200).json({message: "OK"})
}

// const isAuth = (req, res) => {
//     const authHeader = req.get("Authorization");
//     console.log(authHeader)
//     if (!authHeader) {
//         return res.status(422).json({ message: 'not authenticated' });
//     };
//     const token = authHeader.split(' ')[1];
//     let decodedToken; 
//     try {
//         decodedToken = jwt.verify(token, 'pleidatesecret');
//     } catch (err) {
//         return res.status(500).json({ message: err.message || 'could not decode the token' });
//     };
//     if (!decodedToken) {
//         res.status(422).json({ message: 'unauthorized' });
//     } else {
//         res.status(200).json({ message: 'OK' });
//     };
// };

const authChecker = (req, res, next)=> {
    let isAuth = false
    console.log("path",req.path)
    const exceptPaths = ["/login", "/verify"]
    if (!exceptPaths.includes(req.path)) {
        const authHeader = req.get("Authorization")
        console.log(authHeader)
        if (authHeader){
            const token = authHeader.split(' ')[1]
            let decodedToken
            try {
                decodedToken = jwt.verify(token, 'pleidatesecret');
            } catch (err) {console.log(err)}
            if (decodedToken) {isAuth = true} 
        }
    }
    else {isAuth = true}
    console.log(isAuth)
    if (isAuth){next()}
    else {res.status(500).json("not authenticated")}
}

module.exports = { login, verify, logout, authChecker, addUserBegin, addUserInfoBegin, addUserExtraBegin, addUserInterestBegin, addMedia};