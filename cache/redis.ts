import { Redis } from "ioredis";


export class RedisClient {
    /**
     * Redis client class for interacting with a Redis server.
     */
    private redis: Redis;

    constructor() {
        /**
         * Constructor that initializes the Redis connection and sets up error handling.
         */
        this.redis = new Redis();

        this.redis.on("error", (err) => {
            console.error("Redis error:", err);
        });
    }

    async get(key: string) {
        /**
         * Retrieves a value from the Redis store for a given key.
         * 
         * @param {string} key - The key of the data to retrieve.
         * @returns {Promise<string | null>} - A promise that resolves to the value stored under the key, or null if the key doesn't exist.
         */
        return new Promise((resolve, reject) => {
            this.redis.get(key, (err, reply) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(reply);
                }
            });
        });
    }
    
    async set(key: string, value: string, duration: number) {
        /**
         * Stores a key-value pair in the Redis store with an optional expiration time.
         * 
         * @param {string} key - The key under which to store the data.
         * @param {string} value - The data to store.
         * @param {number} duration - The expiration time in seconds (optional).
         * @returns {Promise<string>} - A promise that resolves to "OK" on successful storage.
         */
        return new Promise((resolve, reject) => {
            this.redis.set(key, value, "EX", duration, (err, reply) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(reply);
                }
            });
        });
    }
    
    async delAll() {
        /**
         * Deletes all keys from the current Redis database.
         * 
         * @returns {Promise<string>} - A promise that resolves to "OK" on successful deletion.
         */
        return new Promise((resolve, reject) => {
            this.redis.flushall((err, reply) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(reply);
                }
            });
        });
    }
}

const redisClient = new RedisClient();
export { redisClient };