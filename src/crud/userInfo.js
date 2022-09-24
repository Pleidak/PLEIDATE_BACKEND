import UserProfile from '../models/userProfile.js';


const getOrUpdateUserInfo = async (userId, infoKey, InfoValue) => {
    try {
        await UserProfile.findOne({
            where: {
                userId: userId,
                [infoKey]: InfoValue
            }
        }).then(async (e) => {
            console.log(e)
            if (e){
                return e
            }
            else {
                try {
                    await UserProfile.update({
                        [infoKey]: InfoValue,
                    },{
                        where: {
                            userId: userId
                        }
                    }).then((rs) => {
                        console.log(rs)
                        return true
                    })
                }
                catch (err) {
                    console.log(err)
                    return false
                }
            }
        })
    }
    catch (error) {
        console.log(error)
        return false
    }
}

export { getOrUpdateUserInfo }