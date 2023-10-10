const express = require('express');
const srv = express();
const session = require('express-session');

const fs = require('fs');
const path = require('path');

const bcrypt = require('bcrypt');
const saltRounds = 10;

require('dotenv').config();

srv.use(express.static('../src/public/'));
srv.use(express.static('/views/public'));


const users = [
    {
      login: 'f',
      senha: '$2b$10$xHRuWobhu/QHIOmArToEwe/SuQe42ExVqINo..Bu73iZOHftNHPpm'
    }
  ];


// Rota GET para a página inicial
const loginPage = (req, res) => {
  if( req.session.logado === true) res.redirect('/homeInicial')
  else{
    const loginPath = path.join(__dirname, '../views/login.html');
    fs.readFile(loginPath, 'utf8', (err, login) => {
      if (err) {
        console.error(err);
        res.status(500).send('Erro interno do servidor');
        return;
      }
      res.send(login);
    });
    
  }
  };

  // Rota POST para login
const autLogin = async (req, res) => {
  try {
      const login = await req.body.login;
      const senha = await req.body.senha;
    
      const user = users.find((user) => user.login === login);
    
      if (user && (await bcrypt.compare(senha, user.senha))) {
        req.session.logado = true;
        req.session.login = login;
        console.log(req.session.logado, req.session.login);
        res.status(200).redirect('/homeInicial')
      } else {
        res.redirect('/');
      }
  } catch (error) {
   console.log(error)   
  }};

  
// Rota GET para o registro de usuários
const registerPage = (req, res) => {
    const loginPath = path.join(__dirname, '../views/cadastrar.html');
    fs.readFile(loginPath, 'utf8', (err, login) => {
        if (err) {
            console.error(err);
            res.status(500).send('Erro interno do servidor');
            return;
        }
        res.send(login);
    });
  };
  
// Rota POST para o registro de usuários
const register = async (req, res) => {
    const login = req.body.login;
    const senha = req.body.senha;
   try {
       // Hash da senha antes de armazenar no banco de dados (array)
       const hashedPassword = await bcrypt.hash(senha, saltRounds);
       const newUser = { login, senha: hashedPassword };
       users.push(newUser);
       console.log(users)
       console.log('Usuário cadastrado com sucesso!');
       res.status(204).redirect('/');
   
    } catch (error) {
    console.log(error)
   }
}
  


  
  
// Rota GET para página inicial após o login
const homePage =  (req, res) => {
    if (req.session.logado) {
      const loginPath = path.join(__dirname, '../views/homeInicial.html');
      
      fs.readFile(loginPath, 'utf8', (err, login) => {
        if (err) {
          console.error(err);
          res.status(500).send('Erro interno do servidor');
          return;
        }
        res.send(login);
      });
    } else {
      res.redirect('/');
    }
  };

module.exports = {
    loginPage,
    autLogin,
    homePage,
    register,
    registerPage
 }