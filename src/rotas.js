const express = require('express');
const root = express();
root.use(express.json());
root.use(express.urlencoded({ extended: true }));

const { loginPage, autLogin, register, registerPage, homePage } = require('./middle/users');




root.post('/', autLogin)
root.post('/cadastrar', register)
root.get('/', loginPage)
root.get('/cadastrar', registerPage)
root.get('/homeInicial', homePage)


module.exports = root