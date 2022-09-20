const express = require('express')
const OktaJwtVerifier = require('@okta/jwt-verifier')

const oktaJwtVerifier = new OktaJwtVerifier({
    issuer: 'https://dev-97369796.okta.com/oauth2/default'
})

const audience = 'api://default'

app = express()

const authRequired = async (req, res,next)=>{
    const authHeader = req.headers.authorization || ''
    const match = authHeader.match(/Bearer (.+)/)

    if(!match){
        return res.status(401).send()
    }

    try{
        const accessToken = match[1]
        if(!accessToken){
            return res.status(401, 'Not authorized').send()
        }
        req.jwt = await oktaJwtVerifier.verifyAccessToken(accessToken, audience)
        next()
    } catch(err){
        return res.status(401).send(err.message)
    }
}

app.get('/', (req, res)=>{
    res.send('hello-world')
})


app.get('/api/hello', (req,res)=>{
    res.send('Hello world')
})

app.get('/api/whoami', authRequired, (req,res)=>{
    res.json(req.jwt?.claims)
})

const port = process.env.PORT || 3000  //TODO: Voltar para 80 qdo for subir para o fargate.
app.listen(port, () =>
    console.log(`Server is listening on port ${port}.`)
)