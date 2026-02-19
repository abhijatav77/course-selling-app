import express from 'express'
import { login, logout, register } from '../controllers/admin.controller.js'
const router = express()

router.post('/register', register)
router.post('/login', login)
router.get('/logout', logout)

export default router;