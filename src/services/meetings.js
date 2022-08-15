import { isAuth } from "../services/auth.js"

const meetings = (req, res) => {
    return res.status(200).json({message: "OK"})
}

export {meetings}