
const fs = require('fs');
const path = require('path');

const bcrypt = require('bcrypt');
const saltRounds = 10;

require('dotenv').config();



const users = [
    {
      login: 'adm',
      senha: '$2b$10$8Vpdl8oKP2AEnWstMCzcqOPcB24sVLaCbsNRU0kFWjyqhi0HR9mq6'
    }
  ];


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


const autLogin = async (req, res) => {
  try {
      const login = await req.body.login;
      const senha = await req.body.senha;
    
      const user = users.find((user) => user.login === login);
    
      if (user && (await bcrypt.compare(senha, user.senha))) {
        req.session.logado = true;
        req.session.login = login;
        //console.log(req.session.login);
        res.status(200).redirect('/homeInicial')
      } else {
        res.redirect('/');
      }
  } catch (error) {
    console.error({message: 'Erro interno'})  
     return res.status(401); 
  }};

  

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
  

const register = async (req, res) => {
    const login = req.body.login;
    const senha = req.body.senha;
   try {
    const user = users.find((user) => user.login === login);
    if (user)return res.status(401).redirect('/cadastrar');

       // Hash da swnha
       const hashedPassword = await bcrypt.hash(senha, saltRounds);
       const newUser = { login, senha: hashedPassword };
       users.push(newUser);
       //console.log(users)
       console.log('Usuário cadastrado com sucesso!');
       res.status(204).redirect('/');
   
    } catch (error) {
    console.log(error)
   }
}
  

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