const express = require('express');
const session = require('express-session');
const fs = require('fs');
const path = require('path');

const passport = require('passport');

const app = express();

// Inicializa o Passport.js
app.use(passport.initialize());
app.use(passport.session());

// Configuração da sessão
app.use(session({
    secret: '123',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 30 * 60 * 1000 }
}));

require('../auth')(passport);

// Middleware de autenticação
function authenticMid(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

// Diretórios estáticos para CSS e JS
const static_css = path.join(__dirname, '../public');
const static_js = path.join(__dirname, '../script');

app.use(express.static(static_css));
app.use(express.static(static_js));


// Middleware de tratamento de erros
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send('Erro interno do servidor');
});

// Rota GET para a página de login
app.get('/login', authenticMid, (req, res) => {
    if (req.query.fail) {
        res.status(401).send('Usuário não autenticado');
    } else {
        const loginPath = path.join(__dirname, './log/pages/login.html');
        fs.readFile(loginPath, 'utf8', (err, login) => {
            if (err) {
                next(err); // Encaminhar erros para o middleware de tratamento de erros
                return;
            }
            res.send(login);
        });
    }
});

// Rota GET para a página de home
app.get('/home', authenticMid, (req, res) => {
    const homePath = path.join(__dirname, './log/pages/home.html');
    fs.readFile(homePath, 'utf8', (err, home) => {
        if (err) {
            next(err); // Encaminhar erros para o middleware de tratamento de erros
            return;
        }
        res.send(home);
    });
});

// Rota POST para autenticação
app.post('/login', passport.authenticate('local', {
    successRedirect: '/home',
    failureRedirect: '/login?fail=true'
}));

module.exports = app;