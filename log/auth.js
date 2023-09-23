const bcrypt = require('bcryptjs');
const { db_users } = require('./src/database_id.js');
const LocalStrategy = require('passport-local').Strategy;

module.exports = function (passport) {
    const findUserById = (id) => {
        return db_users.find(user => user.id === id);
    }

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const user = findUserById(id);
            if (!user) return done(null, false); // Usuário não encontrado

            done(null, user);
        } catch (error) {
            console.error(error);
            done(error, null);
        }
    });

    passport.use(new LocalStrategy({
        usernameField: 'id',
        passwordField: 'password'
    },
    async (id, password, done) => {
        try {
            const user = findUserById(id);
            if (!user) return done(null, false); // Usuário não encontrado

            const isValid = await bcrypt.compare(password, user.password);

            if (isValid) {
                return done(null, user);
            } else {
                return done(null, false, { message: 'Erro na autenticação' });
            }
        } catch (error) {
            console.error(error);
            return done(error, false);
        }
    }));
}
