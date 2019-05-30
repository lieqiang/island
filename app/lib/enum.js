function isThisType(type) {
    for(let key in this) {
        if (this[key] === type) {
            return true
        }
    }
    return false
}

const LoginType = {
    USER_MINI_PROGRAM: 100,
    USER_EMAIL: 101,
    USER_MOBILE: 102,
    isThisType
}

module.exports = {
    LoginType
}