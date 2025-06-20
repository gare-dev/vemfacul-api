// lib/redis.js
const { createClient } = require('redis');

let client;

async function getClient() {
  if (!client) {
    client = createClient({
      url: process.env.REDIS_URL 
    });

    client.on('error', (err) => {
      console.error('Redis connection error:', err);
    });

    await client.connect();
  }

  return client;
}

async function getRedis(key, array, index) {
  const client = await getClient();
  const value = JSON.parse(await client.get(key));
  if (!value) return null;
  return array ? value[index] : value;
}

async function setRedis(key, value, timeExpiration) {
  const client = await getClient();
  return await client.set(key, JSON.stringify(value), { EX: timeExpiration });
}

module.exports = {
  getRedis,
  setRedis,
};
