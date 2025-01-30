import Redis from 'ioredis';

const REDIS_HOST = process.env.REDIS_HOST;
const REDIS_PASSWORD = process.env.REDIS_PASSWORD;
const REDIS_PORT = process.env.REDIS_PORT;

const EXPIRATION_TIME = 60;

interface RedisObject {
    userId: number;
    dataType: 'briefing' | 'video';
}

if (!(REDIS_HOST && REDIS_PASSWORD && REDIS_PORT))
    throw new Error(
        'Redis configuration must be set on .env (REDIS_HOST, REDIS_PASSWORD, REDIS_PORT)',
    );

const redis = new Redis({
    host: REDIS_HOST,
    port: parseInt(REDIS_PORT || '6379'),
    password: REDIS_PASSWORD,
    db: 0,
});

redis.on('connect', () => {
    console.log('Redis is successfully connected.');
});

redis.on('error', (err) => {
    console.error('Error on redis:', err);
});

function buildKey({ userId, dataType }: RedisObject) {
    return `update:${userId}:${dataType}`;
}

export async function insertRedisData(insertionObject: RedisObject) {
    const key = buildKey(insertionObject);
    await redis.set(key, 'true', 'EX', EXPIRATION_TIME);
}

export async function getData(searchObject: RedisObject) {
    const key = buildKey(searchObject);
    const existingKey = await redis.get(key);

    if (existingKey) {
        await redis.del(key);
        return true;
    }

    return false;
}
