const express = require('express')
const router = express.Router()

const userInfoHandler = require('../router_handler/userinfo')

router.get('/userinfo',userInfoHandler.info)
router.post('/userinfoupdate',userInfoHandler.updateUserInfo)
router.post('/userpasswordupdate',userInfoHandler.updateUserPassword)
router.post('/update/avatar',userInfoHandler.updateAvatar)


module.exports = router