const {sequelize} = require('@core/db')
const {
    Sequelize,
    Model,
    Op
} = require('sequelize')
const { Art } = require('./art') // art favor 相互引用 X getList undefind
const {
    LikeError,
    DislikeError,
    NotFound
} = require('@core/http-exception')
class Favor extends Model {
    static async like(art_id, type, uid) {
        const favor = await Favor.findOne({
            where: {
                art_id,
                type,
                uid
            }
        })
        if (favor) {
            throw new LikeError()
        }
        return sequelize.transaction( async t => { // 事务
            await Favor.create({
                art_id,
                type,
                uid
            }, {
                transaction: t
            })
            const art = await Art.getData(art_id, type, false)
            console.log(art)
            await art.increment('fav_nums', {
                by: 1,
                transaction: t
            }) // +1

        })
    }
    static async unlike(art_id, type, uid) {
        const favor = await Favor.findOne({
            where: {
                art_id,
                type,
                uid
            }
        })
        if (!favor) {
            throw new DislikeError()
        }
        return sequelize.transaction(async t => { // 事务
            await favor.destroy({ // 软删除
                force:true,
                transaction: t
            })
            const art = await Art.getData(art_id, type, false)
            await art.decrement('fav_nums',{ by:1, transaction:t })// -1
        })
    }

    static async userLikeIt(art_id, type, uid) {
        const isLike = await Favor.findOne({
            where: {
                art_id,
                type,
                uid
            }
        })
        return isLike ? true : false
    }

    static async getMyClassicFavor(uid) {
        const all = await Favor.findAll({
            where: {
                uid,
                type: {
                    [Op.not]: 400 // 排除书籍收藏
                }
            }
        })
        if (!all) {
            throw new NotFound()
        }
        console.log(all)
        return await Art.getList(all)
    }
}

Favor.init({
    uid: Sequelize.INTEGER,
    art_id: Sequelize.INTEGER,
    type: Sequelize.INTEGER
}, {
    sequelize,
    tableName: 'favor'
})

module.exports = {
    Favor
}