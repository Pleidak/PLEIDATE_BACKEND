const image = require("../models/image.js")
const video = require("../models/video.js")

const crudImage = async (userId, type, order, imagePath) => {
    const imgs = await image.findAll({
        where: {
            userId: userId,
        }
    })
    switch (type) {
        case "CREATE": {
            if (imgs.length < 3 && imgs.length < order) {
                await image.create({
                    userId: userId,
                    order: imgs.length + 1,
                    imagePath: imagePath,
                    isMainImage: order == 1 ? true: false,
                    createAt: Date.now()
                }).then(()=>{
                    return true
                })
            }
            else {return false}
        }
        case "READ": {
            if (imgs){return imgs}
            else {return false}
        }
        case "UPDATE": {
            if (imgs && imgs.length >= order){
                await image.update({
                    imagePath: imagePath,
                    isMainImage: order == 1 ? true: false,
                    createAt: Date.now()
                }, {
                    where: {
                        userId: userId,
                        order: order
                    }
                }).then(()=>{
                    return true
                })
            }
            else {return false}
        }
        case "DELETE": {
            if (imgs){
                if (imgs.includes(order)){
                    await image.delete({
                        where: {
                            userId: userId,
                            order: order
                        }
                    }).then(()=>{
                        return true
                    })
                }
                else {
                    return false
                }
            }
            else {return false}
        }
    }
}

const getOrUpdateVideo = async (userId, videoPath, isMainVideo) => {
    video.findOne({
        where: {
            userId: userId,
            videoPath: videoPath
        }
    }).then((i) => {
        if (i){return i}
        else {
            video.create({
                userId: userId,
                videoPath: videoPath,
                isMainVideo: isMainVideo,
                createAt: Date.now()
            }).then(()=>{
                return true
            })
        }
    })
}

module.exports = {crudImage, getOrUpdateVideo}