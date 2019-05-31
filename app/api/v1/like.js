const Router = require('koa-router')
const { likeValidator } = require('../../validator/validator')
const { Favor } = require('../../models/favor')
const { Auth } = require('../../../middlewares/auth')
const router = new Router({
    prefix: '/v1/like'
})
router.post('/', new Auth().m, async (ctx, next) => {
    const v = await new likeValidator().validate(ctx, {
        id: art_id // 别名
    })
    await Favor.like(v.get('body.art_id'), v.get('body.type'), ctx.auth.uid) // 安全 uid 不从前端传，token中传
})

module.exports = router