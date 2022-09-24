import express from 'express';

import { login, verify, addInfoBegin, logout } from '../services/auth.js';
import { meetings } from '../services/meetings.js';
import { tracking} from '../services/tracking.js';

const router = express.Router()

router.post('/login', login)
router.post('/verify', verify)
router.post('/addInfoBegin', addInfoBegin)
router.get('/logout', logout)
router.get('/meetings', meetings)
router.post('/api/locations',  tracking)


router.get('/public', (req, res, next) => {
    res.status(200).json({ message: "here is your public resource" })
})

export default router