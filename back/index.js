const express = require('express')

app = express()

app.get('/', (req, res)=>{
    res.send('hello-world')
})

const port = process.env.PORT || 80
app.listen(port, () =>
    console.log(`Server is listening on port ${port}.`)
)