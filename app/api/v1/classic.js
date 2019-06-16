const Router = require('koa-router')
const { Flow } = require('@models/flow')
const { Art } = require('@models/art')
const { Favor } = require('@models/favor')
const {  PositiveIntegerValidator, ClassicValidator } = require('@validator/validator')
const { NotFound } = require('@core/http-exception')
const router = new Router({
    prefix: '/v1/classic'
})
const { Auth } = require('@middlewares/auth')
router.get('/latest', new Auth(1).m, async (ctx, next) => { // new Auth().m 中间件，才能阻止后面中间件的执行
    const flow = await Flow.findOne({ // 获取最新一条
        order: [
            ['index', 'DESC']
        ]
    })
    const art = await Art.getData(flow.art_id, flow.type)
    const like = await Favor.userLikeIt(flow.art_id, flow.type, ctx.auth.uid)
    art.setDataValue('index', flow.index)
    art.setDataValue('like_status', like)
    // art.exclude = ['index', 'fav_nums'] 排除对应字段 排除当前 排除所有视频
    ctx.body = art
})
// 获取上一期、下一期
router.get('/:index/next', new Auth().m, async (ctx, next) => { // new Auth().m 中间件，才能阻止后面中间件的执行
    const v = await new PositiveIntegerValidator().validate(ctx, {
        id: 'index'
    })
    const index = v.get('path.index')
    const flow = await Flow.findOne({
        where: {
            index: index + 1
        }
    })
    if (!flow) {
        throw new NotFound()
    }
    const art = await Art.getData(flow.art_id, flow.type)
    const likeNext = await Favor.userLikeIt(flow.art_id, flow.type, ctx.auth.uid)
    art.setDataValue('index', flow.index)
    art.setDataValue('like_status', likeNext)
    ctx.body = art
})

router.get('/:index/previous', new Auth().m, async (ctx) => {
    const v = await new PositiveIntegerValidator().validate(ctx, {
        id: 'index'
    })
    const index = v.get('path.index')
    const flow = await Flow.findOne({
        where: {
            index: index - 1
        }
    })
    if (!flow) {
        throw new NotFound()
    }
    const art = await Art.getData(flow.art_id, flow.type)
    const likePrevious = await Favor.userLikeIt(
        flow.art_id, flow.type, ctx.auth.uid)
    art.setDataValue('index', flow.index)
    art.setDataValue('like_status', likePrevious)
    ctx.body = art
})

router.get('/:type/:id/favor', new Auth().m, async (ctx) => { // new Auth().m 中间件，才能阻止后面中间件的执行
    const v = await new ClassicValidator().validate(ctx)
    const id = v.get('path.id')
    const type = parseInt(v.get('path.type'))
    const artDetail = await new Art().getDetail(ctx.auth.uid, id, type)
    ctx.body = {
        fav_nums: artDetail.art.fav_nums,
        like_status: artDetail.like_status
    }
    // ctx.body = {
    //     fav_nums: likeDetail.art.fav_nums,
    //     fav_nums: likeDetail.fav_nums
    // }
})
// 获取期刊详情
router.get('/:type/:id', new Auth().m, async (ctx) => {
    const v = await new ClassicValidator().validate(ctx)
    const id = v.get('path.id')
    const type = parseInt(v.get('path.type'))
    const artDetail = await new Art().getDetail(ctx.auth.uid, id, type)
    artDetail.art.setDataValue('like_status', artDetail.like_status)
    ctx.body = artDetail.art
})

router.get('/favor', new Auth().m, async (ctx) => {
    ctx.body = await Favor.getMyClassicFavor( ctx.auth.uid)
})
module.exports = router
