export enum ErrorEnum {
    SERVER_ERROR = '500:服务繁忙，请稍后再试',

    SYSTEM_USER_EXISTS = '1001:系统用户已存在',
    INVALID_VERIFICATION_CODE = '1002:验证码填写有误',
    INVALID_USERNAME_PASSWORD = '1003:用户名密码有误',
    INVALID_PASSWORD = '1004:密码有误',
    USER_NOT_FOUND = '1101: 用户不存在',
}

export const SUCCESS_CODE = 0
