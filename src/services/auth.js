
import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import Twilio from 'twilio';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '../configs/messages.js';
import TWILIO_CONFIG from '../configs/twilio.js';
const twilio = new Twilio(TWILIO_CONFIG.ACCOUNT_SID, TWILIO_CONFIG.AUTH_TOKEN);
import { sign } from '../utils/jwt.js'
import { getOrUpdateUserInfo } from '../crud/userInfo.js';
import { getOrUpdateImage } from '../crud/media.js';
import userProfile from '../models/userProfile.js';
// import { AWSUpload } from '../utils/Cloud.js';
import {cloudinary} from '../utils/cloudidary.js'
import formidable from "formidable";


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
                const signToken = (userId, isActive) => {
                    const token = jwt.sign({ userId: userId }, 'pleidatesecret');
                        res.status(200).json({
                            message: "OK",
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
                                                        signToken(rs.userId, false)
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
                        signToken(dbUser.userId, dbUser.isActive)
                    }
                })
                .catch(err => {
                    console.log('error', err)
                })
        //     }
        //     else {
        //         res.status(422).send({
        //             message: ERROR_MESSAGES.INVALID_CODE,
        //         })
        //     }
        // })
    } else {
        res.status(422).send({
            message: ERROR_MESSAGES.WRONG_PHONE_OR_CODE,
        })
    }
}

const addInfoBegin = async (req, res) => {
    const userId = jwt.decode(req.get("Authorization").split(' ')[1]).userId
    if (req.body.infoKey && req.body.infoValue){
        await getOrUpdateUserInfo(userId, req.body.infoKey, req.body.infoValue).then(async()=>{
                res.status(200).json({
                    message: "OK",
                })
            }, () => {
                res.status(422).send({
                    message: ERROR_MESSAGES.ERROR_OCCURRED,
                })
            }
        )      
        
    }
}

const addMedia = async (req, res) => {
    const userId = jwt.decode(req.get("Authorization").split(' ')[1]).userId
    const form = formidable({ multiples: true });
    console.log(123)

    form.parse(req, async (err, fields, f) => {
        console.log(err)
        console.log(f.files)
        // let avatar = req.body.avatar
        // if (typeof(req.body.avatar) == 'string'){avatar = [req.body.avatar]}
        // console.log("oke")
        const avatar = f.files
        let isMainImage = true
        let count = 0
        for (let i=0; i<avatar.length; i++){
            if (i!=0){isMainImage==false}
            try {
                console.log(222)

                await cloudinary.uploader.upload(avatar[i].filepath, {
                    public_id: `avatar_${userId}_${i}`
                })
                console.log(321)
                await getOrUpdateImage(userId, avatar[i].filepath, isMainImage).then(async ()=>{
                    count ++
                    console.log(count)
                    if (count == avatar.length){
                        res.status(200).json({
                            message: "OK",
                        })
                    }
                }, () => {
                    res.status(422).send({
                        message: ERROR_MESSAGES.ERROR_OCCURRED,
                    })
                })
            } catch (err) {
                console.log(err)
                res.status(422).send({
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

export { login, verify, logout, authChecker, addInfoBegin, addMedia};