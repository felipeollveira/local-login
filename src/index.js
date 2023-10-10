const express = require('express');
const root = require('./rotas');
const session = require('express-session');
const server = express();

server.use(session({ secret: process.env.private_key, resave: true, saveUninitialized: true }));


server.use(express.static('../src/public/'));
server.use(express.static('../public'));

server.use(express.json())
server.use(root)

// Iniciand o servidor
const PORT = process.env.PORT || 3000; 
server.listen(PORT, () => {
  console.log(`Servidor iniciado em http://localhost:${PORT}/`);
});
