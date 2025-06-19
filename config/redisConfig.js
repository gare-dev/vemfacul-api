const redisbli = require('redis');
const client = redisbli.createClient();
client.connect();

client.on('error', err => {
    console.log('Procurando conexao', err)
})
try {
    async function getRedis(key, array, index) {
        const value = JSON.parse(await client.get(key));
        if (!value) return null
        return array ? value[index] : value;
    }
    async function setRedis(key, value, timeExpiration) {
        return await client.set(key, JSON.stringify(value), { EX: timeExpiration });
    }

    module.exports = {
        getRedis,
        setRedis
    }
} catch (err) {
    throw err;
}