const crypto = require('crypto')
const {json} = require("express");

const iv = crypto.randomBytes(16)

//const mySecretMsg = 'hh.0oa6kwa0h4Fy66SWi5d7.9MtTRX_Cbjp6P5Fd_BduoAzwkuFx3PNn4aqXp2LJ'
const mySecretMsg = 'hassmann'
const myS = json.toString({
    supplier: 'hh',
    clientID: '0oa6kwa0h4Fy66SWi5d7',
    clientSecret: '9MtTRX_Cbjp6P5Fd_BduoAzwkuFx3PNn4aqXp2LJ',
})

const algorithm = 'aes-256-cbc'

const key = 'pipoca'

const hashKey = crypto.createHash('sha256').update(key).digest()

const cipher = crypto.createCipheriv('aes256', hashKey, iv)

let encryptedData = cipher.update(mySecretMsg, "utf-8", "hex");
encryptedData += cipher.final("hex");

const ivString = Buffer.from(iv, 'binary').toString('base64');
const hashString = Buffer.from(hashKey, 'binary').toString('base64');

console.log(encryptedData)
console.log(hashString)
console.log(ivString)

const decipher = crypto.createDecipheriv(algorithm, hashKey, iv);

let decryptedData = decipher.update(encryptedData, "hex", "utf-8");
decryptedData += decipher.final("utf8");

console.log(decryptedData)

