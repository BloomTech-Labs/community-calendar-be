const jwt = require('jsonwebtoken');
const {secret} = require('./token');
const jwksClient = require('jwks-rsa');

const client = jwksClient({
    jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`
});

function getKey(header, cb){
    client.getSigningKey(header.kid, function(err, key){
        let signingKey = key.publicKey || key.rsaPublicKey;
        cb(null, signingKey);
    });
}

const options = {
    audience: process.env.API_AUDIENCE,
    issuer: `https://${process.env.AUTH0_DOMAIN}/`,
    algorithms: ['RS256']
};



const decodedToken = (req, requireAuth = true) => {
    const token = req.headers.authorization.replace('Bearer ', '');
    // console.log(options.audience, options.issuer, options.algorithms);
    console.log('token: ',token);
    const decoded = new Promise((resolve, reject) => {
        jwt.verify(token, getKey, options, (err, decoded) => {
            if(err){
                return reject(err);
            }

            resolve(decoded);
        });
    });

    if(token){
        return decoded;
    }

    if(requireAuth){
        throw new Error('You are not logged in');
    }
    return null;
}

module.exports = {decodedToken};