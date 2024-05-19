import bcrypt from 'bcrypt'

/**
 * @description 密码加密
 * @param {string} password 原始密码
 * @returns {Promise<string>}
 */
export function passwordEncryption(password: string) {
    // 10位的盐
    return bcrypt.hash(password, 10)
}

/**
 * @description 密码验证
 * @param {string} password 原始密码
 * @param {string} hash 加密后的密码
 * @returns {Promise<boolean>}
 */
export function comparePassword(
    password: string,
    hash: string,
): Promise<boolean> {
    return bcrypt.compare(password, hash)
}
