import image from "../models/image.js";
import video from "../models/video.js";

const getOrUpdateImage = async (userId, imagePath, isMainImage) => {
    try {
        await image.findOne({
            where: {
                userId: userId,
                imagePath: imagePath
            }
        }).then(async (i) => {
            if (i){return i}
            else {
                console.log(345)
                try {
                    await image.create({
                        userId: userId,
                        imagePath: imagePath,
                        isMainImage: isMainImage,
                        createAt: Date.now()
                    }).then(()=>{
                        return true
                    })
                }
                catch (err){
                    console.log(err)
                    return false
                }
            }
        })
    }
    catch (err){
        console.log(err)
        return false
    }
}

const getOrUpdateVideo = async (userId, videoPath, isMainVideo) => {
    try {
        video.findOne({
            where: {
                userId: userId,
                videoPath: videoPath
            }
        }).then((i) => {
            if (i){return i}
            else {
                try {
                    video.create({
                        userId: userId,
                        videoPath: videoPath,
                        isMainVideo: isMainVideo,
                        createAt: Date.now()
                    }).then(()=>{
                        return true
                    })
                }
                catch (err){
                    console.log(err)
                    return false
                }
            }
        })
    }
    catch (err){
        console.log(err)
        return false
    }
}

export {getOrUpdateImage, getOrUpdateVideo}