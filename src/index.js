const express = require('express');
const app = express();
const session = require('express-session');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const fs = require('fs');
const path = require('path');

require('dotenv').config()

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('./src/public/'));
app.use(express.static('src/public/views'));
app.use(session({ secret: process.env.private_key, resave: true, saveUninitialized: true }));

// Simulação de banco de dados c array
const users = [
  {
    login: 'f',
    senha: '$2b$10$xHRuWobhu/QHIOmArToEwe/SuQe42ExVqINo..Bu73iZOHftNHPpm'
  }
];

// Rota GET para a página inicial
app.get('/', (req, res) => {
  const loginPath = path.join(__dirname, '/views/login.html');
  fs.readFile(loginPath, 'utf8', (err, login) => {
      if (err) {
          console.error(err);
          res.status(500).send('Erro interno do servidor');
          return;
      }
      res.send(login);
  });
});

// Rota GET para o registro de usuários
app.get('/cadastrar', (req, res) => {
  const loginPath = path.join(__dirname, '/views/cadastrar.html');
  fs.readFile(loginPath, 'utf8', (err, login) => {
      if (err) {
          console.error(err);
          res.status(500).send('Erro interno do servidor');
          return;
      }
      res.send(login);
  });
});

// Rota POST para o registro de usuários
app.post('/cadastrar', async (req, res) => {
  const login = req.body.login;
  const senha = req.body.senha;

  // Verifica se o usuário já existe no banco de dados
  const existingUser = users.find((user) => user.login === login);

  if (existingUser) {
    console.log('Usuário já cadastrado!');
    res.redirect('/');
  } else {
    // Hash da senha antes de armazenar no banco de dados (array)
    const hashedPassword = await bcrypt.hash(senha, saltRounds);
    const newUser = { login, senha: hashedPassword };
    users.push(newUser);
    console.log(users)
    console.log('Usuário cadastrado com sucesso!');
    res.redirect('/');
  }
});

// Rota POST para login
app.post('/', async (req, res) => {
  const login = req.body.login;
  const senha = req.body.senha;

  const user = users.find((user) => user.login === login);

  if (user && (await bcrypt.compare(senha, user.senha))) {
    req.session.logado = true;
    req.session.login = login;
    console.log(req.session.logado, req.session.login);
    res.redirect('/homeInicial');
  } else {
    res.redirect('/');
  }
});


// Rota GET para página inicial após o login
app.get('/homeInicial', (req, res) => {
  if (req.session.logado) {
    const loginPath = path.join(__dirname, '/views/homeInicial.html');
    
    // Lê o arquivo HTML
    fs.readFile(loginPath, 'utf8', (err, login) => {
      if (err) {
        console.error(err);
        res.status(500).send('Erro interno do servidor');
        return;
      }
      
      // Substitui placeholders no HTML com os dados da sessão
      //login = login.replace('{{loginNome}}', req.session.login);

      // Envia o HTML renderizado como resposta
      res.send(login);
    });
  } else {
    res.redirect('/');
  }
});


// Inicie o servidor
const PORT = process.env.PORT || 3000; 
app.listen(PORT, () => {
  console.log(`Servidor iniciado na porta ${PORT}`);
});