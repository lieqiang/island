const axios = require('axios')
const util = require('util') // node.js 处理url
const User = require('@models/user')
const { generateToken } = require('@core/util')
const { Auth } = require('@middlewares/auth')
const { AuthFailed } = require('@core/http-exception')

class WXManager {
    constructor() {

    }
    static async codeToToken(code) {
        const url = util.format(global.config.wx.loginUrl, global.config.wx.appId, global.config.wx.appSecret, code)
        const result = await axios.get(url)
        if (result.status !== 200) {
            throw new AuthFailed('openid获取失败')
        }
        if (result.data.errcode) {
            throw new AuthFailed('opid获取失败：' + result.data.errmsg)
        }
        let user = await User.getUserByOpenid(result.data.openid)
        if (!user) {
            user = await User.registerByOpenid(result.data.openid)
        }
        return generateToken(user.id, Auth.USER) // 返回token令牌
    }
}

module.exports = {
    WXManager
}