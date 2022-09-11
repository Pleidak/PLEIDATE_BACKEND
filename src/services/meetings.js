import SERVER_CONFIG from "../configs/server.js"
import calcCrow from "../utils/CalculateDistance.js"
import jwt from 'jsonwebtoken';

const meetings = (req, res) => {
    const io = req.app.get('socketio')
    const redisClient = req.app.get('redisClient')
    console.log("go meetting")
    // console.log(io)
    io.on("connection", (socket) => {
        console.log("CONNECTED")
        socket.on("joinTracking", async (data) => {
        const authHeader = req.get("Authorization");
        console.log(authHeader)
        // console.log(io)

            const joinStatus = {
                status: false
            }
            if (data.room && SERVER_CONFIG.ROOMS.includes(data.room)){
                socket.join(data.room)
                await redisClient.sAdd("trackingClientIds", socket.id)
                joinStatus.status = true
                socket.on("trackingLocation", async (trackingData) => {
                    const userId = jwt.decode(req.get("Authorization").split(' ')[1]).userId
                    console.log(trackingData)
                    trackingData.user = socket.id
                    // await redisClient.set("trackingData", JSON.stringify(trackingData));
                    try {
                        await redisClient.set(socket.id, JSON.stringify(trackingData))
                        const trackingClientIds = await redisClient.sMembers("trackingClientIds")
                        console.log(trackingClientIds)
                        for (let i = 0; i < trackingClientIds.length; i++) {
                            console.log(trackingClientIds[i])
                            if (trackingClientIds[i] != socket.id){
                                const locationInfo = await redisClient.get(trackingClientIds[i])
                                const targetLocation = JSON.parse(locationInfo)
                                if (calcCrow(trackingData.latitude, trackingData.longitude, targetLocation.latitude, targetLocation.longitude) < 0.01){
                                    console.log('met')
                                }
                            }
                        }
                    }
                    catch (error){
                        console.log(error)
                    }
                })
            }
            else {
                joinStatus.status = false
            }
            socket.emit("joinStatus", joinStatus)
        })
        socket.on('disconnect', async () => {
            await redisClient.del("trackingClientIds")
            console.log('user disconnected');
        })
    })
    return res.status(200).json({message: "OK"})
}

export {meetings}