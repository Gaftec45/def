const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/users'); // Adjust the path accordingly

function initialize(passport) {
    passport.use(new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
        try {
            const user = await User.findOne({ email: email });

            if (!user) {
                return done(null, false, { message: 'No User Found using that Email' });
            }

            // Check password directly (without hashing)
            if (password === user.password) {
                return done(null, user);
            } else {
                return done(null, false, { message: 'Incorrect Password' });
            }
        } catch (error) {
            return done(error);
        }
    }));

    passport.serializeUser((user, done) => {
        // Serialize only the user id into the session
        done(null, user.id);
    });
    
    passport.deserializeUser(async (id, done) => {
        const user = await User.findById(id);
        done(null, user);
    });
    
}

module.exports = initialize;