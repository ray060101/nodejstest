const express = require('express')
const app = express()

const cors = require('cors')
app.use(cors())

app.use(express.urlencoded({ extended: false}))

app.use((req,res,next)=>{
    res.cc = (err , status = 1)=>{
        res.send({status , message: err.instanceof? err.message:err})
    }
    next()
})

const config =require('./config.js')
const expressJWT = require('express-jwt')
app.use( expressJWT({ secret: config.jwtSecretKey, algorithms: ["HS256"] }).unless({ path: [/^\/api\//] }))

const userRoter = require('./router/user')
app.use('/api',userRoter)


const userinfoRoter = require('./router/userinfo')
app.use('/my',userinfoRoter)


app.use((err,req,res,next)=>{
    
    return res.cc(err)//錯誤捕獲
})

app.listen(3004,()=>{
    console.log('http://127.0.0.1:3004')
})