import { APP_CONFIG_TOKEN, AppConfig, IAppConfig } from './app.config'
import { IRedisConfig, REDIS_CONFIG_TOKEN, RedisConfig } from './redis.config'
import { ITokenConfig, TOKEN_CONFIG_TOKEN, TokenConfig } from './token.config'

export interface AllConfigType {
    [APP_CONFIG_TOKEN]: IAppConfig
    [REDIS_CONFIG_TOKEN]: IRedisConfig
    [TOKEN_CONFIG_TOKEN]: ITokenConfig
}

export default { AppConfig, RedisConfig, TokenConfig }
