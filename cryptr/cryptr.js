const Cryptr = require("cryptr");

const cryptr = new Cryptr(process.env.CRYPTR_KEY, {
    encoding: "base64",
    pbkdf2Iterations: 1000,
    saltLength: 10,
});

module.exports = cryptr;