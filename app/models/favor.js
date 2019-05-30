const {sequelize} = require('../../core/db')
const {
    Sequelize,
    Model
} = require('sequelize')
class Favor extends Model {
    static async like(art_id, type, uid) {

    }
    static async unlike(art_id, type, uid) {

    }
}

Favor.init({
    uid: Sequelize.INTEGER,
    art_id: Sequelize.INTEGER,
    type: Sequelize.INTEGER
})
