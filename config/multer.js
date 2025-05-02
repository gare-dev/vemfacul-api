const multer = require('multer');

const upload = multer({ storage: multer.memoryStorage() }); // Armazena o arquivo na memória RAM

module.exports = upload;

