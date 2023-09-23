const testlog = (id, pass) => {
    try {
      
        const clienteEncontrado = id_database.clientes.find(cliente => cliente.id === id);
        if (clienteEncontrado) {
             if (pass === clienteEncontrado.senha) {
                console.log('OK');
            } else {
                throw new Error('Erro na autenticação.');
            }
        } else {
            throw new Error('Erro na autenticação (ID não encontrado).');
        }
    } catch (error) {
        console.error(error.message);
    }

    function btnLogin() {
        const id = parseInt(inputID.value);
        const senha = inputPassword.value;
    
        testlog(id, senha);
    };

};



module.exports = {
    testlog,

}