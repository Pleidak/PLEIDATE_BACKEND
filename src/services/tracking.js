import jwt from 'jsonwebtoken'
import calcCrow from '../utils/CalculateDistance.js';
import meetting from '../models/meeting.js';


const tracking = async (req, res) => {
    const redisClient = req.app.get('redisClient')
    const { body } = req;
    const userId = jwt.decode(req.get("Authorization").split(' ')[1]).userId.toString()
    console.log(userId)
    await redisClient.sAdd("trackingUsers", userId)
    const trackingData = {
        longitude: body.location.coords.longitude ,
        latitude: body.location.coords.latitude,
        timestamp: body.location.timestamp
    }
    await redisClient.set(userId, JSON.stringify(trackingData));
    const trackingUsers = await redisClient.sMembers("trackingUsers")
    for (let i = 0; i < trackingUsers.length; i++) {
        console.log(trackingUsers[i])
        if (trackingUsers[i] != userId){
            const locationInfo = await redisClient.get(userId)
            const targetLocation = JSON.parse(locationInfo)
            const distance = calcCrow(trackingData.latitude, trackingData.longitude, targetLocation.latitude, targetLocation.longitude)
            if (distance && distance < 0.03){
                console.log('met')
                meetting.findOne({
                    where: {
                        proactiveUserId: {
                            [Op.or]: [userId, trackingUsers[i]]
                        },
                        passiveUserId: {
                            [Op.or]: [userId, trackingUsers[i]]
                        }
                    }
                }).then((e) => {
                    if (!e){
                        meetting.create({
                            proactiveUserId: userId,
                            passiveUserId: trackingUsers[i],
                            proactiveLongtitude: trackingData.longitude,
                            proactiveLatitude: trackingData.latitude,
                            passiveLongtitude: targetLocation.longitude,
                            passiveLatitude: targetLocation.latitude,
                            matchTime: Date.now()
                        })
                        console.log("added a meeting")
                    }
                })
            }
        }
    }
    return res.send({ success: true });
}

export {tracking}