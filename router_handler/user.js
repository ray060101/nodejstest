const db = require('../db/index.js')
const validator = require('../validators/validators.js')
const config =require('../config.js')

const bcrypt = require('bcryptjs')

const jwt = require('jsonwebtoken')

exports.regUser = (req,res)=>{
    const userinfo = req.body
    const validationResult = validator.validateUser(userinfo); //去判斷帳密是否符合規則
    if (!validationResult.valid) return res.cc(validationResult.message);
    
    userinfo.password = bcrypt.hashSync(userinfo.password, 10) //加密

    const sqlStr = 'SELECT * FROM ev_users WHERE username=?'
    db.query(sqlStr, [userinfo.username], (err, results) => {
        if (err) return res.cc(err) 
        if (results.length > 0) return res.cc( '用戶名稱重複不可使用' )

        const sqlStrInPassword = 'INSERT INTO ev_users SET ?'
        db.query(sqlStrInPassword ,{  username: userinfo.username, password: userinfo.password},(err, results)=>{
            if (err) return res.cc(err) 
            if (results.affectedRows !== 1) return res.cc( '註冊用戶失敗請稍後再試' )
            console.log(userinfo)
            res.send({ status: 0, message: '註冊成功' })
        })

    });

}

exports.logIn = (req,res)=>{
    const userinfo = req.body
    const validationResult = validator.validateUser(userinfo); //去判帳密是否符合規則
    if (!validationResult.valid) return res.cc(validationResult.message);

    const sqlStr = 'SELECT * FROM ev_users WHERE username=?'
    db.query(sqlStr, [userinfo.username], (err, results) => {
        if (err) return res.cc(err) 
        if (results.length !== 1) return res.cc( '帳號錯誤 登入失敗' )

        const compareResult = bcrypt.compareSync(userinfo.password, results[0].password ) //bcryptjs的方法比對密碼

        if(!compareResult) return res.cc( '密碼錯誤 登入失敗' )

        const user = {...results[0], user_pic:'',password:''}

        const tokenStr = jwt.sign(user, config.jwtSecretKey,{expiresIn: config.expiresIn}) 

        res.send({ 
            status: 0, 
            message: '登入成功' ,
            token: 'Bearer ' + tokenStr
        })

    })

}


