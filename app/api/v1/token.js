const Router = require('koa-router')
const User = require('@models/user')
const { TokenValidator, NotEmptyValidator } = require('@validator/validator')
const { LoginType } = require('@lib/enum')
const { ParameterException } = require('@core/http-exception')
const { generateToken } = require('@core/util')
const { Auth } = require('@middlewares/auth')
const { WXManager } = require('../../services/wx')
const router = new Router({
    prefix: '/v1'
})
router.post('/token', async (ctx, next) => {
    const v = await new TokenValidator().validate(ctx)
    let token
    switch(v.get('body.type')) {
        case LoginType.USER_EMAIL:
            token = await emailLogin(v.get('body.account'), v.get('body.secret'))
            break
        case LoginType.USER_MINI_PROGRAM: // wechat
            token = await WXManager.codeToToken(v.get('body.account'))
            break
        default:
            throw new ParameterException('没有相应的处理函数')
    }
    ctx.body = {
        token
    }
})

async function emailLogin(account, secret) {
    const user = await User.verifyEmailPassword(account, secret)
    return token = generateToken(user.id, Auth.USER) // scope 2
}


router.post('/verify', async (ctx) => {
    const v = await new NotEmptyValidator().validate(ctx)
    const result = Auth.verifyToken(v.get('body.token'))
    ctx.body = {
        is_valide: result
    }
})
module.exports = router