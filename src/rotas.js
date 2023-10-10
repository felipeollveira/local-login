const express = require('express');
const root = express();


const { loginPage, autLogin, register, registerPage, homePage } = require('./root/root');
root.use(express.json());
root.use(express.urlencoded({ extended: true }));

root.use(express.static('../src/public/'));
root.use(express.static('../public'));


root.post('/', autLogin)
root.post('/cadastrar', register)
root.get('/', loginPage)

root.get('/cadastrar', registerPage)

root.get('/homeInicial', homePage)


module.exports = root