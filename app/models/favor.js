const {sequelize} = require('../../core/db')
const {
    Sequelize,
    Model
} = require('sequelize')
const { Art } = require('./art')
const {
    LikeError,
    DislikeError
} = require('../../core/http-exception')
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
            }, { transaction: t })
            const art = await Art.getData(art_id, type)
            await art.increment('fav_nums', { by: 1, transaction: t }) // +1

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
            const art = await Art.getData(art_id, type)
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