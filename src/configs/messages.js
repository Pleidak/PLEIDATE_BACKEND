const ERROR_MESSAGES = {
    phoneAlreadyExists: "số điện thoại đã được sử dụng",
    couldntHashPassword: "couldn't hash the password",
    errorOccurred: "đã có lỗi xảy ra khi tạo người dùng",
    passwordNotProvided: "mật khẩu không được để trống",
    phoneNotProvided: "số điện thoại không được để trống",
    phoneNotExists: "không tìm thấy tài khoản với số điện thoại được cung cấp",
    passwordComparingError: "error while checking user password",
    passworDoesntMatch: "mật khẩu không chính xác"
}

const SUCCESS_MESSAGES = {
    userCreated: "Đăng ký tài khoản thành công!"
}
  
export {ERROR_MESSAGES, SUCCESS_MESSAGES}  