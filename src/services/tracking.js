
const tracking = (req, res) => {
    if (req.body.longtitude && req.body.latitude && req.body.timestamp){
        return res.status(200).json({message: "OK"})
    }
    else {
        return res.status(422).json({message: "OK"})
    }
}

export {tracking}