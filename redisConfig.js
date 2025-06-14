const redisbli = require('redis');
const client = redisbli.createClient();
client.connect();

client.on('error', err => {
    console.log('Procurando conexao', err)
})
try {
    async function getRedis(key) {
        return await client.get(key);
    }
    async function setRedis(key, value) {
        return await client.set(key, value);
    }

    module.exports = {
        getRedis,
        setRedis
    }
} catch (err) {
    throw err;
}