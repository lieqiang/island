const {sequelize} = require('../../core/db')
const {
    Sequelize,
    Model
} = require('sequelize')

const classicFields = {
    image: Sequelize.STRING,
    content: Sequelize.STRING,
    pubdate: Sequelize.DATEONLY,
    fav_nums: Sequelize.INTEGER,
    title: Sequelize.STRING,
    type: Sequelize.TINYINT,
}

class Movie extends Model {
    // console.log(this.dataValues)
    // toJSON() { // json序列化，返回需要等待字段
        // const obj = this.dataValues
        // delete(obj.created_at)
        // delete(obj.deleted_at)
        // delete(obj.updated_at)
        // return obj
        // return {
            // image: this.getDataValue('image'),
            // content: this.getDataValue('content'),
            // pubdate: this.getDataValue('pubdate'),
            // fav_nums: this.getDataValue('fav_nums'),
            // title: this.getDataValue('title'),
            // type: this.getDataValue('type'),
            // fav_nums: this.getDataValue('fav_nums'),
            // index: this.getDataValue('index')
        // }
    // }
}

Movie.init(classicFields, { // 定义模型
    sequelize,
    tableName: 'movie'
})

class Sentence extends Model {

}

Sentence.init(classicFields, {
    sequelize,
    tableName: 'sentence'
})


class Music extends Model {

}

const musicFields = Object.assign({
    url:Sequelize.STRING
}, classicFields)

Music.init(musicFields,{
    sequelize,
    tableName: 'music'
})


module.exports = {
    Movie,
    Sentence,
    Music
}