import express from 'express';

import { login, verify, logout } from '../services/auth.js';
import { meetings } from '../services/meetings.js';

const router = express.Router()

router.post('/login', login)
router.post('/verify', verify)
router.get('/logout', logout)
router.get('/meetings', meetings)

router.get('/public', (req, res, next) => {
    res.status(200).json({ message: "here is your public resource" })
})

export default router