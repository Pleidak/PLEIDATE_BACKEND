
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Op } from "sequelize"
import User from '../models/user.js';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '../configs/messages.js';

const getRndInteger = (min, max) => {
    return Math.floor(Math.random() * (max - min)) + min;
}

const signup = (req, res, next) => {
    // checks if phone already exists
    const uid = getRndInteger(1000000000, 10000000000)
    User.findOne({ where : {
        [Op.or]: [
            {userId: uid}, {phone: req.body.phone}
        ]
    }})
    .then(dbUser => {
        if (dbUser) {
            if (dbUser.userId == uid){
                return res.status(422).json({
                    message: ERROR_MESSAGES.errorOccurred
                })
            }
            else {
                return res.status(422).json({
                    message: ERROR_MESSAGES.phoneAlreadyExists
                })
            }
        } else if (req.body.phone && req.body.password) {
            // password hash
            bcrypt.hash(req.body.password, 12, (err, passwordHash) => {
                if (err) {
                    return res.status(500).json({message: ERROR_MESSAGES.couldntHashPassword}); 
                } else if (passwordHash) {
                    return User.create(({
                        userId: uid,
                        phone: req.body.phone,
                        password: passwordHash,
                        facebookEmail: null,
                        facebookPhone: null,
                        isActive: true
                    }))
                    .then(() => {
                        res.status(200).json({message: SUCCESS_MESSAGES.userCreated});
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(422).json({message: ERROR_MESSAGES.errorOccurred});
                    });
                };
            });
        } else if (!req.body.password) {
            return res.status(422).json({message: ERROR_MESSAGES.passwordNotProvided});
        } else if (!req.body.phone) {
            return res.status(422).json({message: ERROR_MESSAGES.phoneNotProvided});
        };
    })
    .catch(err => {
        console.log('error', err);
    });
};

const login = (req, res, next) => {
    // checks if phone exists
    if (!req.body.phone){
        res.status(422).json({message: ERROR_MESSAGES.phoneNotProvided});
    }
    else if (!req.body.password){
        res.status(422).json({message: ERROR_MESSAGES.passwordNotProvided});
    }
    else{
        User.findOne({ where : {
            phone: req.body.phone, 
        }})
        .then(dbUser => {
            if (!dbUser) {
                return res.status(404).json({message: ERROR_MESSAGES.phoneNotExists});
            } else {
                // password hash
                bcrypt.compare(req.body.password, dbUser.password, (err, compareRes) => {
                    if (err) { // error while comparing
                        res.status(422).json({message: ERROR_MESSAGES.passwordComparingError});
                    } else if (compareRes) { // password match
                        const token = jwt.sign({ phone: req.body.phone }, 'secret', { expiresIn: '1h' });
                        res.status(200).json({message: "OK", "token": token});
                    } else { // password doesnt match
                        res.status(422).json({message: ERROR_MESSAGES.passworDoesntMatch});
                    };
                });
            };
        })
        .catch(err => {
            console.log('error', err);
        });
    }
};

const isAuth = (req, res, next) => {
    const authHeader = req.get("Authorization");
    if (!authHeader) {
        return res.status(422).json({ message: 'not authenticated' });
    };
    const token = authHeader.split(' ')[1];
    let decodedToken; 
    try {
        decodedToken = jwt.verify(token, 'secret');
    } catch (err) {
        return res.status(500).json({ message: err.message || 'could not decode the token' });
    };
    if (!decodedToken) {
        res.status(401).json({ message: 'unauthorized' });
    } else {
        res.status(200).json({ message: 'OK' });
    };
};

export { signup, login, isAuth };