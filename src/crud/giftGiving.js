const giftGiving = require("../models/giftGiving.js")
const giftReamaining = require("../models/giftRemaining.js")
const {Op} = require('sequelize')
const giftCatching = require("../models/giftCatching.js")
const e = require("express")

const createGiftGiving = async (userId, targetId, giftId, message) => {
    await giftGiving.create({
        userId: userId,
        targetId: targetId,
        giftId: giftId,
        message: message
    })
}

const getGiftGiving = async (userId) => {
    const result = await giftGiving.findAll({
        where: {
            targetId: userId
        }
    })
    return result
}

const crudGiftRemaining = async (type, userId, turnLeft, lastTime) => {
    const result = await giftReamaining.findOne({
        where: {
            userId: userId
        }
    })
    if (!result){
        await giftReamaining.create({
            userId: userId,
            turnLeft: 10,
            lastTime: Date.now()
        })
        return false
    }
    else {
        if (type == "GET"){
            if (result.turnLeft == 0 ){
                if ((Date.now() - new Date(result.lastTime))/1000/60/60 >= 3) {
                    const updateRecord = await giftReamaining.update({
                        turnLeft: 10,
                        lastTime: Date.now() 
                    }, {
                        where: {
                            userId: userId
                        }
                    })
                    return updateRecord
                }
                else {
                    return result
                }
            }
            else {
                return result
            }
        }
        else {

            if (turnLeft >= 0 && turnLeft <= result.turnLeft) {
                await giftReamaining.update({
                    turnLeft: turnLeft,
                    lastTime: lastTime
                }, {
                    where: {
                        userId: userId
                    }
                })
            }
            else {
                return false
            }
        }
    }
}

const createGiftCatching = async (userId, giftId, caughtTime, info) => {
    const historyCatching = await giftCatching.findAll({
        where: {
            userId: userId,
            caughtTime: {
                [Op.gte]: Date.now() - 3*60*60*1000
            }
        }
    })
    console.log(historyCatching)
    if (historyCatching.length <= 10) {
        await giftCatching.create({
            userId: userId,
            giftId: giftId,
            caughtTime: caughtTime,
            info: info
        })
        return true
    }
    else {
        return false
    }
}

module.exports = {createGiftGiving, crudGiftRemaining, createGiftCatching, getGiftGiving}