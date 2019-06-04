const Router = require('koa-router')
const router = new Router() // 浏览器url只能发送 get请求
// 参数传递方式
const { HttpException, ParameterException } = require('@core/http-exception')
const { PositiveIntegerValidator } = require('@validator/validator')
router.post('/v1/:id/book/latest', async (ctx, next) => {
    // ctx.request 获取参数 ：id url ？后面参数 ，header
    const path = ctx.params
    const query = ctx.request.query
    const header = ctx.request.header
    const body = ctx.request.body
    const a = await new PositiveIntegerValidator().validate(ctx) // await 不加的话得到的是 promise 本身
    // if (true) {
    //     // const error = new HttpException('参数错误', 10001, 400)
    //     const error = new ParameterException()
    //     throw error
    // }
})
module.exports = router // 下面写法也行，app.js需要对应
// module.exports = {
    // router，
    // 其他方法
// }
// 这种写法 require-directory 需要做兼容处理