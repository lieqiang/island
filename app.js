const Koa = require('koa')
// const Router = require('koa-router')
const app = new Koa()
const axios = require('axios')
const parser = require('koa-bodyparser') // 获取body参数
const InitManager = require('./core/init')
const catchError = require('./middlewares/exception')
require('./app/models/user')
app.use(catchError)
app.use(parser())
InitManager.initCore(app)
app.listen(3000)
// nodemon 自动重启