const express = require('express');
const server = express();

const rotas = require('./src/root');
server.use(rotas);


const port = 3500;



server.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
