const express = require('express')

const { login, verify, logout, addUserBegin, addUserInfoBegin, addUserExtraBegin, addMedia, addUserInterestBegin } = require('../services/auth.js')
const { meetings, likeUser, getGiftColection, postGift, getUsers, } = require('../services/meetings.js')
const { getRandomGiftCatching, createGiftCatchingHandler, getGiftColectionHandler } = require('../services/gifting.js')
const { tracking} = require('../services/tracking.js')

const router = express.Router()

router.post('/login', login)
router.post('/verify', verify)
router.post('/add-user-begin', addUserBegin)
router.post('/add-user-info-begin', addUserInfoBegin)
router.post('/add-user-extra-begin', addUserExtraBegin)
router.post('/add-user-interest-begin', addUserInterestBegin)
router.post('/add-media', addMedia)
router.get('/gifts', getGiftColection)
router.post('/gifts', postGift)
router.get('/gifts/random-catching', getRandomGiftCatching)
router.post('/gifts/caught', createGiftCatchingHandler)
router.get('/gifts/colection', getGiftColectionHandler)
router.get('/users', getUsers)
router.post('/liked', likeUser)
router.get('/logout', logout)
router.get('/meetings', meetings)
router.post('/api/locations',  tracking)


router.get('/public', (req, res, next) => {
    res.status(200).json({ message: "here is your public resource" })
})

module.exports = router