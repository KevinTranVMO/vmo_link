const passport = require('passport')
const googleStrategy = require('passport-google-oauth2').Strategy
const localStrategy = require('passport-local')
const account = require('../models/account')
const bcrypt = require('bcrypt')

passport.serializeUser((acc, done) => {
    done(null, acc._id)
})

passport.deserializeUser((id, done) => {
    account.findById(id)
        .then(acc => done(null, acc))
        .catch(err => done(err))
})

passport.use('google.login',
    new googleStrategy({
        clientID: process.env.clientID,
        clientSecret: process.env.clientSecret,
        callbackURL: process.env.nameDomain + 'auth/google/callback'
    }, (accessToken, refreshToken, profile, done) => {
        if (profile.id) {
            account.findOne({ 'google.api_id': profile.id })
                .then(acc => {
                    if (acc) {
                        if ( acc.local.is_block === true ) 
                            return done(null, false, { message: 'your account was blocked'})
                        else return done(null, acc)
                    }
                    else {
                        let newAcc = new account()
                        newAcc.google.api_id = profile.id
                        newAcc.google.api_email = profile.email
                        newAcc.info.firstname = profile.name.familyName
                        newAcc.info.lastname = profile.name.givenName
                        newAcc.local.is_active = true
                        newAcc.save((err) => {
                            if (err) return done(err)
                            else return done(null, newAcc)
                        })
                    }
                })
                .catch(err => done(err))
        }
    })
)

passport.use('local.login', 
    new localStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallBack: false
    }, (email, password, done)=>{
        account.findOne({ 'local.email': email})
            .then(async acc => {
                if ( !acc ) return done(null, false, { message: 'account not found'})
                else if ( acc.local.is_active === false) 
                    return done(null, false, {message: 'account is not active, create new account.'})
                else if ( acc.local.is_block === true ) 
                    return done(null, false, { message: 'your account was blocked'})
                else if (await bcrypt.compare(password, acc.local.password)) return done(null, acc)
                else return done(null, false, { message: 'your email or password incorrect'})
            })
            .catch(err => done(err))
    })
)
