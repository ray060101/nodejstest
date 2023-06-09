const db = require('../db/index.js')
const validator = require('../validators/validators.js')

const bcrypt = require('bcryptjs')

//user這個屬性是express-jwt解析後的值 信息
exports.info = ((req,res)=>{
    sqlStr = 'SELECT id, username, nickname, email, user_pic FROM ev_users WHERE id=?'
    db.query(sqlStr, req.user.id ,(err,results)=>{
        if(err)return res.cc(err)
        if(results.length !== 1)return res.cc('用戶信息取得失敗')
        
        res.send({ 
            status: 0, 
            message: '獲取用戶信息' ,
            data: results[0]
        })
    } )
})

exports.updateUserInfo = ((req,res)=>{
    req.body.id = req.user.id

    const validationResult = validator.validateUserInof(req.body); //去判斷帳密是否符合規則
    if (!validationResult.valid) return res.cc(validationResult.message);

    sqlStr = 'UPDATE ev_users SET ? WHERE id=? ' //nickname, email,
    db.query(sqlStr, [req.body,req.user.id] ,(err,results)=>{
        if(err)return res.cc(err)
        if(results.affectedRows !== 1)return res.cc('更新失敗')
        
        res.send({ 
            status: 0, 
            message: '資料更新成功' 
        })
    } )

})

exports.updateUserPassword = ((req,res)=>{
    const userinfo = req.body
    const validationResult = validator.validateUserUpdatePassword(userinfo) //去判斷新舊密碼是否符合規則
    if (!validationResult.valid) return res.cc(validationResult.message)

    userinfo.newpassword = bcrypt.hashSync(userinfo.newpassword, 10) //加密
    
    console.log( req.user)

    sqlStr = 'SELECT password FROM ev_users WHERE id=?'
    db.query(sqlStr, req.user.id ,(err,results)=>{
        if(err)return res.cc(err)
        if(results.length !== 1)return res.cc('用戶信息取得失敗')
        
        const compareResult = bcrypt.compareSync(userinfo.oidpassword, results[0].password )
        if(!compareResult) return res.cc( '舊密碼錯誤 無法更新密碼' )

        sqlUpdateStr = 'UPDATE ev_users SET password = ? WHERE id = ?'
        db.query(sqlUpdateStr,[userinfo.newpassword, req.user.id],(err,results)=>{
            if(err)return res.cc(err)
            if(results.affectedRows !== 1)return res.cc('更新資料失敗')

            res.send({
                status: 0, 
                message: '密碼更新成功' 
            })
        })
    } )

})

exports.updateAvatar= ((req,res)=>{
    const userinfo = req.body
    const validationResult = validator.validateUserUpdateAvatar(userinfo) //去判斷新舊密碼是否符合規則
    if (!validationResult.valid) return res.cc(validationResult.message)

    sqlUpdateStr = 'UPDATE ev_users SET user_pic = ? WHERE id = ?'
    db.query(sqlUpdateStr,[userinfo.avatar, req.user.id],(err,results)=>{
        if(err)return res.cc(err)
        if(results.affectedRows !== 1)return res.cc('更新頭像資料失敗')

        res.send({
            status: 0, 
            message: '更新成功' 
        })
    })


})