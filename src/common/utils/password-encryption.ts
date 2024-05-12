import bcrypt from 'bcrypt'

export async function passwordEncryption(password: string) {
    // 10位的盐
    return await bcrypt.hash(password, 10)
}

/**
 * @description 密码验证
 * @param {string} password 原始密码
 * @param {string} hash 加密后的密码
 * @returns {Promise<boolean>}
 */
export async function comparePassword(
    password: string,
    hash: string,
): Promise<boolean> {
    return await bcrypt.compare(password, hash)
}
