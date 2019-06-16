const {
    Movie,
    Sentence,
    Music
} = require('./classic')
// const { Favor } = require('@models/favor') 相互引用
const { NotFound } = require('@core/http-exception')
const {
    flatten
} = require('lodash') // 转一维数组
const { Op } = require('sequelize')
class Art {
    // constructor(art_id, type) {
    //     this.art_id = art_id
    //     this.type = type
    // }
    async getDetail(uid, art_id, type) {
        const art = await Art.getData(art_id, type)
        if (!art) {
            throw new NotFound()
        }
        const { Favor } = require('./favor') // 循环引用
        const like = await Favor.userLikeIt(art_id, type, uid)
        return {
            art,
            like_status: like
        }
    }
    static async getData(art_id, type, useScope = true) {

        let art = null
        // type = parseInt(type)
        // art_id = parseInt(art_id)
        const finder = {
            where: {
                id: art_id
            }
        }
        // const scope = useScope ? 'bh' : null
        const scope = useScope ? 'bh' : null
        switch (type) {
            case 100:
                art = await Movie.scope(scope).findOne(finder)
                break
            case 200:
                art = await Music.scope(scope).findOne(finder)
                break
            case 300:
                art = await Sentence.scope(scope).findOne(finder)
                break
            case 400:
                const { Book } = require('./book') // 循环引用
                art = await Book.scope(scope).findOne(finder)
                if(!art) {
                    art = Book.create({
                        id: art_id // fav_nums 有默认值
                    })
                }
                break
            default:
                break
        }
        return art
    }

    static async getList(artInfoList) {
        const artInfoObj = {
            100: [],
            200: [],
            300: [],
        }
        for (let artInfo of artInfoList) {
            artInfoObj[artInfo.type].push(artInfo.art_id)
        }
        const arts = []
        for (let key in artInfoObj) {
            const ids = artInfoObj[key]
            if (ids.length === 0) {
                continue
            }

            key = parseInt(key)
            arts.push(await Art._getListByType(ids, key))
        }

        return flatten(arts)
    }

    static async _getListByType(ids, type) { // useScope = false
        let art = null
        console.log('ids', ids)
        const finder = {
            where: {
                id: {
                    [Op.in]: ids
                }
            }
        }
        const scope = 'bh'
        switch (type) {
            case 100:
                art = await Movie.scope(scope).findAll(finder)
                break
            case 200:
                art = await Music.scope(scope).findAll(finder)
                break
            case 300:
                art = await Sentence.scope(scope).findAll(finder)
            case 400:
                break
            default:
                break
        }
        return art
    }
}

module.exports = {
    Art
}