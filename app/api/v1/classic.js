const Router = require('koa-router')
const { Flow } = require('../../models/flow')
const { Art } = require('../../models/art')
const router = new Router({
    prefix: '/v1/classic'
})
const { Auth } = require('../../../middlewares/auth')
router.get('/latest', new Auth(1).m, async (ctx, next) => { // new Auth().m 中间件，才能阻止后面中间件的执行
    // ctx.body = 'classic'
    // ctx.body = {
    //     name: ctx.auth.uid,
    //     scope: ctx.auth.scope
    // }
    const flow = await Flow.findOne({ // 获取最新一条
        order: [
            ['index', 'DESC']
        ]
    })
    const art = await Art.getData(flow.art_id, flow.type)
    art.setDataValue('index', flow.index)
    ctx.body = art
})
module.exports = router