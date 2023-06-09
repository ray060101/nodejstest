const express = require('express')
const router = express.Router()

const userHandler = require('../router_handler/user.js')

router.post('/reguer',userHandler.regUser)

router.post('/login',userHandler.logIn)

module.exports = router

