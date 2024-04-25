const userExtra = require('../models/userExtra.js')
const {Sequelize} = require('sequelize')

const getSuggestionUserInfo = async (userId) => {
    const currentUserExtra = await userExtra.findOne({
        where: {
            userId: userId
        }
    })
    let genderTarget = 0
    console.log(currentUserExtra.gender)
    if (currentUserExtra.gender == 0){genderTarget = 1}
    else if (currentUserExtra.gender == 1){genderTarget = 0}
    else {genderTarget = 2}

    if (currentUserExtra){
        const suggestionUsers = await userExtra.findAll({
            where: {
                gender: genderTarget,
                language: currentUserExtra.language
            },
            limit: 50,
            order: [
                Sequelize.fn( 'RAND' ),
            ],
        })
        return suggestionUsers
    }
}

module.exports = {getSuggestionUserInfo}