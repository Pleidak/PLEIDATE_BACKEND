import express from 'express';

import { login, verify, logout, addInfoBegin, addMedia } from '../services/auth.js';
import { meetings } from '../services/meetings.js';
import { tracking} from '../services/tracking.js';
import multipart from 'connect-multiparty';

const router = express.Router()
const multipartMiddleware = multipart();

router.post('/login', login)
router.post('/verify', verify)
router.post('/addInfoBegin', addInfoBegin)
router.post('/addMedia', addMedia)
router.get('/logout', logout)
router.get('/meetings', meetings)
router.post('/api/locations',  tracking)


router.get('/public', (req, res, next) => {
    res.status(200).json({ message: "here is your public resource" })
})

export default router