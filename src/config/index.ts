import { APP_CONFIG_TOKEN, IAppConfig, AppConfig } from './app.config'
import { REDIS_CONFIG_TOKEN, IRedisConfig, RedisConfig } from './redis.config'

export interface AllConfigType {
    [APP_CONFIG_TOKEN]: IAppConfig
    [REDIS_CONFIG_TOKEN]: IRedisConfig
}

export default { AppConfig, RedisConfig }
