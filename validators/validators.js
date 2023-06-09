//驗證規則
exports.validateUsername = (username) => {
    const regexUsername = /^[a-zA-Z\d]{1,50}$/
    return regexUsername.test(username)
};

exports.validatePassword = (password) => {
    const regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,20}$/
    return regexPassword.test(password)
};

exports.validateId = (id) => {
    const regexId = /^\d+$/
    return regexId.test(id)
};

exports.validateEmail = (email) => {
    const regexEmail = /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/
    return regexEmail.test(email);
};

exports.validateNickname = (nickname) => {
    const regexNickname = /^[\u4E00-\u9FFFa-zA-Z\d\s]{1,20}$/
    return regexNickname.test(nickname);
};

exports.validateAvatar= (avatar) => {
    const regexAvatar =  /^data:image\/\w+;base64,/
    return regexAvatar.test(avatar);
};

//以下為組合使用

exports.validateUser = (userinfo) => {

    if (!exports.validateUsername(userinfo.username)) return { valid: false, message: '帳號需為1-50個字母之間不能包含英文和數字以外符號' }
    
    if (!exports.validatePassword(userinfo.password)) return { valid: false, message: '密碼需為8-20個字母,包含至少一個大寫字母、一個小寫字母和一個數字' }

    return { valid: true }
}

exports.validateUserInof = (userinfo) => {

    if (!exports.validateId(userinfo.id)) return { valid: false, message: 'id不符合規則' }

    if (!exports.validateEmail(userinfo.email)) return { valid: false, message: 'email格式不正確' }

    if (!exports.validateNickname(userinfo.nickname)) return { valid: false, message: 'nickname格式不正確' }

    return { valid: true };
}

exports.validateUserUpdatePassword = (userinfo) => {

    if (!exports.validatePassword(userinfo.oidpassword)) return { valid: false, message: '密碼需為8-20個字母,包含至少一個大寫字母、一個小寫字母和一個數字' }

    if (!exports.validatePassword(userinfo.newpassword)) return { valid: false, message: '新密碼需為8-20個字母,包含至少一個大寫字母、一個小寫字母和一個數字' }

    if (userinfo.newpassword == userinfo.oidpassword) return { valid: false, message: '新密碼與舊密碼相同' }

    return { valid: true }
}

exports.validateUserUpdateAvatar = (userinfo) => {

    if (!exports.validateAvatar(userinfo.avatar)) return { valid: false, message: '圖片格式異常' }

    return { valid: true }
}
/*用法
    const validationResult = validator.validateUser(userinfo); //去判斷帳密是否符合規則userinfo可以是任何要用的東西
    if (!validationResult.valid) return res.cc(validationResult.message);
*/