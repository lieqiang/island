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

    constructor(art_id, type) {
        this.art_id = art_id
        this.type = type
    }
    async getDetail(uid) {
        const art = await Art.getData(this.art_id, this.type)
        if (!art) {
            throw new NotFound()
        }
        const Favor = require('@models/favor')
        const like = await Favor.userLikeIt(this.art_id, this.type, uid)
        return {
            art,
            is_love: like
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
            case 400:
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
                art = await Movie.scope(scope).findOne(finder)
                break
            case 200:
                art = await Music.scope(scope).findOne(finder)
                break
            case 300:
                art = await Sentence.scope(scope).findOne(finder)
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