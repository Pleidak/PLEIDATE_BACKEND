
import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import Twilio from 'twilio';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '../configs/messages.js';
import TWILIO_CONFIG from '../configs/twilio.js';
const twilio = new Twilio(TWILIO_CONFIG.ACCOUNT_SID, TWILIO_CONFIG.AUTH_TOKEN);

const getRndInteger = (min, max) => {
    return Math.floor(Math.random() * (max - min)) + min;
}

const login = (req, res) => {
    console.log(req.body.phone)
    twilio
    .verify
    .services(TWILIO_CONFIG.SERVICE_SID)
    .verifications
    .create({
        to: req.body.phone,
        channel: req.query.channel==='call' ? 'call' : 'sms' 
    })
    .then(data => {
        res.status(200).json({
            message: SUCCESS_MESSAGES.CODE_SENT,
            phone: req.body.phone,
            data
        })
    })
    .catch((err) => {
        console.log(err)
        return res.status(422).json({
            message: ERROR_MESSAGES.ERROR_OCCURRED
        })
    })
}

const verify = (req, res) => {
    if (req.body.phone && req.body.code && (req.body.code).length === 6) {
        twilio
        .verify
        .services(TWILIO_CONFIG.SERVICE_SID)
        .verificationChecks
        .create({
            to: req.body.phone,
            code: req.body.code
        })
        .then(data => {
            if (true) {
                const uid = getRndInteger(1000000000, 10000000000)
                User.findOne({ where : {
                    userId: uid
                }})
                .then(dbUser => {
                    if (dbUser && dbUser.userId == uid) {
                        return res.status(422).json({
                            message: ERROR_MESSAGES.ERROR_OCCURRED
                        })
                    } 
                    else {
                        const token = jwt.sign({ phone: req.body.phone }, 'pleidatesecret');
                        res.status(200).json({
                            message: "OK",
                            token: token,
                            userId: uid
                        })
                    }
                })
                .catch(err => {
                    console.log('error', err)
                })
            }
            else {
                res.status(422).send({
                    message: ERROR_MESSAGES.INVALID_CODE,
                })
            }
        })
    } else {
        res.status(422).send({
            message: ERROR_MESSAGES.WRONG_PHONE_OR_CODE,
        })
    }
}

const logout = (req, res) => {
    return res.status(200).json({message: "OK"})
}

const isAuth = (req, res) => {
    const authHeader = req.get("Authorization");
    if (!authHeader) {
        return res.status(422).json({ message: 'not authenticated' });
    };
    const token = authHeader.split(' ')[1];
    let decodedToken; 
    try {
        decodedToken = jwt.verify(token, 'pleidatesecret');
    } catch (err) {
        return res.status(500).json({ message: err.message || 'could not decode the token' });
    };
    if (!decodedToken) {
        res.status(422).json({ message: 'unauthorized' });
    } else {
        res.status(200).json({ message: 'OK' });
    };
};

const authChecker = (req, res, next)=> {
    let isAuth = false
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
    if (isAuth || req.path==='/login' || req.path==="/verify") {next()}
    else {res.status(500).json("not authenticated")}
}

export { login, verify, logout, isAuth, authChecker};