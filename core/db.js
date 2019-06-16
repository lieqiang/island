const { Sequelize, Model } = require('sequelize')
const { clone, unset, isArray } = require('lodash')
const {
    dbname,
    host,
    port,
    user,
    password
} = require('../config/config').database
const sequelize = new Sequelize(dbname, user, password, {
    dialect: 'mysql',
    host,
    port,
    logging: true, // 是否显示具体sql操作
    timezone: '+08:00',
    define: {
        //create_time  update_time delete_time
        timestamps:true,
        paranoid:true, // 软删除 生成 delete_time
        createdAt:'created_at',
        updatedAt:'updated_at',
        deletedAt:'deleted_at',
        underscored:true,
        freezeTableName:true,
        scopes: {
            bh: {
                attributes: {
                    excluse: ['created_at', 'updated_at', 'deleted_at'] // 全局scope
                }
            }
        }
    }
})
sequelize.sync({
    force:false // true 会覆盖之前数据
}) // 加上这段sequelize才会把模型创建到数据库上去

Model.prototype.toJSON = function() { // 不可传参
    let data = clone(this.dataValues)
    unset(data, 'updated_at')
    unset(data, 'created_at')
    unset(data, 'deleted_at')
    if (isArray(this.exclude)) {
        this.exclude.forEach((value) => {
            unset(data, value)
        })
    }
    return data
}
module.exports = {
    sequelize
    // db: sequelize
}