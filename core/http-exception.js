class HttpException extends Error {
    constructor(msg = '服务器错误', errorCode = 10000, code = 400) {
        super()
        this.errorCode = errorCode
        this.code = code
        this.msg= msg
        // this.path = `${ctx.method} ${ctx.path}`
    }
}

// 特定异常类
class ParameterException extends HttpException { // 参数异常类
    constructor(msg, errorCode) {
        super()
        this.code = 400
        this.msg = msg || '参数错误'
        this.errorCode = errorCode || 10000
    }
}

// 操作数据异常类
class Success extends HttpException {
    constructor(msg, errorCode) {
        super()
        this.code = 201
        this.msg = msg || 'ok'
        this.errorCode = errorCode || 0
    }
}

class NotFound extends HttpException {
    constructor(msg, errorCode) {
        super()
        this.code = 404
        this.msg = msg || '资源未找到'
        this.errorCode = errorCode || 10000
    }
}

class AuthFailed extends HttpException {
    constructor(msg, errorCode) {
        super()
        this.code = 401
        this.msg = msg || '授权失败'
        this.errorCode = errorCode || 10004
    }
}

class Forbbiden extends HttpException{
    constructor(msg, errorCode) {
        super()
        this.msg = msg || '禁止访问'
        this.errorCode = errorCode || 10006
        this.code = 403
    }
}

module.exports = {
    HttpException,
    ParameterException,
    Success,
    NotFound,
    AuthFailed,
    Forbbiden
}