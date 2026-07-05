import { createClient } from 'redis';
import { promisify } from 'util';

class RedisClient {
  constructor() {
    // Create the Redis client
    this.client = createClient();

    // Display any error of the redis client in the console
    this.client.on('error', (err) => {
      console.error(`Redis client error: ${err}`);
    });
  }

  /**
   * Checks if the connection to Redis is successful and alive.
   * @returns {boolean} true if connected, false otherwise.
   */
  isAlive() {
    return this.client.connected;
  }

  /**
   * Retrieves the value of a given key from Redis.
   * @param {string} key - The key to search for.
   * @returns {Promise<string>} The value stored in Redis, or null if it doesn't exist.
   */
  async get(key) {
    const getAsync = promisify(this.client.get).bind(this.client);
    return getAsync(key);
  }

  /**
   * Stores a key-value pair in Redis with an expiration duration.
   * @param {string} key - The key to store.
   * @param {string|number} value - The value to store.
   * @param {number} duration - The expiration time in seconds.
   * @returns {Promise<void>}
   */
  async set(key, value, duration) {
    // setex takes arguments: key, seconds, value
    const setexAsync = promisify(this.client.setex).bind(this.client);
    return setexAsync(key, duration, value);
  }

  /**
   * Deletes a key from Redis.
   * @param {string} key - The key to delete.
   * @returns {Promise<void>}
   */
  async del(key) {
    const delAsync = promisify(this.client.del).bind(this.client);
    return delAsync(key);
  }
}

// Create and export a single instance of RedisClient
const redisClient = new RedisClient();
export default redisClient;