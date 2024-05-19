import { RedisKeys } from 'src/constant/cache.constant'

/** 生成验证码 redis key */
export function genCaptchaImgKey(val: string | number) {
    return `${RedisKeys.CAPTCHA_IMG_PREFIX}${String(val)}`
}

export function getUserCacheKey(val: string) {
    return `${RedisKeys.USER_CACHE_PREFIX}${val}`
}
