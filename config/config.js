module.exports = {
    environment: 'dev',
    database: {
        dbname: 'island',
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: ''
    },
    security: {
        secretKey: 'abcdefg', // key要非常复杂，并且没有规律
        expiresIn: 60*60*24*30
    },
    wx: {
        loginUrl: 'https://api.weixin.qq.com/sns/jscode2session?appid=%s&secret=%s&js_code=%s&grant_type=authorization_code',
        appId: 'wxd9a2001d786dd2d0',
        appSecret: '5308e9f93b05abd9ae537feabaeac691'
    }
}