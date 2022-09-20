const express = require('express')
const session = require('express-session')
const passport = require('passport')
const { Strategy } = require('passport-openidconnect')

app = express()

app.use(session({
    secret: 'myNewSecret',
    resave: false,
    saveUninitialized: true
}))

app.use(passport.initialize());
app.use(passport.session());

passport.use('oidc', new Strategy({
    issuer: 'https://dev-97369796.okta.com/oauth2/default',
    authorizationURL: 'https://dev-97369796.okta.com/oauth2/default/v1/authorize',
    tokenURL: 'https://dev-97369796.okta.com/oauth2/default/v1/token',
    userInfoURL: 'https://dev-97369796.okta.com/oauth2/default/v1/userinfo',
    clientID: '0oa6kwa0h4Fy66SWi5d7',
    clientSecret: '9MtTRX_Cbjp6P5Fd_BduoAzwkuFx3PNn4aqXp2LJ',
    callbackURL: 'http://localhost:3000/authorization-code/callback',
    scope: 'openid profile'
}, (issuer, profile, done)=>{
    return done (null, profile)
}))

passport.serializeUser((user, next)=>{
    next(null, user)
})

passport.deserializeUser((obj, next)=>{
    next(null, obj)
})

const port = process.env.PORT || 3000  //TODO: Voltar para 80 qdo for subir para o fargate.
app.listen(port, () =>
    console.log(`Server is listening on port ${port}.`)
)

app.use('/authorization-code/callback', passport.authenticate('oidc', {failureRedirect: '/error'}),
    (req, res) => {
    res.redirect('/')
    })

app.post('/logout', (req, res)=>{
    req.logout()
    req.session.destroy()
    res.redirect('/')
})

app.get('/login', passport.authenticate('oidc'))

app.get('/', (req, res)=>{
    res.send('hello-world, we know the user ?' + req.isAuthenticated())
})