const Router = require('koa-router')
const { LikeValidator } = require('@validator/validator')
const { Favor } = require('@models/favor')
const { Auth } = require('@middlewares/auth')
const { Success } = require('@core/http-exception')
const router = new Router({
    prefix: '/v1/like'
})
router.post('/', new Auth().m, async (ctx) => {
    const v = await new LikeValidator().validate(ctx, {
        id: 'art_id' // 别名
    })
    await Favor.like(v.get('body.art_id'), v.get('body.type'), ctx.auth.uid) // 安全 uid 不从前端传，token中传
    throw new Success()
})

router.post('/cancel', new Auth().m, async (ctx) => {
    const v = await new LikeValidator().validate(ctx, {
        id: 'art_id' // 别名
    })
    await Favor.unlike(v.get('body.art_id'), v.get('body.type'), ctx.auth.uid)
    throw new Success()
})

module.exports = router