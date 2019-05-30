const Router = require('koa-router')
const { RegisterValidator } = require('../../validator/validator')
const User = require('../../models/user')
const { Success } = require('../../../core/http-exception')
const router = new Router({
    prefix: '/v1/user/' // 指定注册路由url前缀
})

router.post('register', async (ctx) => {
    // new RegisterValidator().validate(ctx) 为什么是这种写法，而不是中间件的形式 中间件只实例化一次，会导致 valiate错乱
    const v = await new RegisterValidator().validate(ctx) // 异步操作 await
    const user = {
        email: v.get('body.email'),
        password: v.get('body.password1'),
        nickname: v.get('body.nickname')
    }
    const r = await User.create(user)
    // 操作数据库的方法都依赖自己创建的models类
    throw new Success()
})
module.exports = router
