import express from 'express';

import { login, verify, logout, authChecker } from '../services/auth.js';
import { meetings } from '../services/meetings.js';

const router = express.Router();

router.post('/login', login);
router.post('/verify', verify);
router.post('/logout', logout);
router.get('/meetings', meetings);

router.get('/public', (req, res, next) => {
    res.status(200).json({ message: "here is your public resource" });
});

// router.use('/', (req, res, next) => {
//     const authResponse = isAuth(req, res)
//     if (authResponse.status != 200) {
//         res.status(422).json({error : "not logged in"})
//     }
//     else {
//         res.status(404).json({error : "page not found"})
//     }
// });

export default router;