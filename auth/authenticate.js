const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');

const client = jwksClient({
  jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`,
});

function getKey(header, cb) {
  client.getSigningKey(header.kid, function(err, key) {
    let signingKey = key.publicKey || key.rsaPublicKey;
    cb(null, signingKey);
  });
}

const options = {
  audience: process.env.API_AUDIENCE,
  issuer: `https://${process.env.AUTH0_DOMAIN}/`,
  algorithms: ['RS256'],
};

const decodedToken = (req, requireAuth = true) => {
  const token =
    req.headers.authorization &&
    req.headers.authorization.replace('Bearer ', '');

  if (!token) {
    throw 'No token was found in header.';
  }

  const decoded = new Promise((resolve, reject) => {
    jwt.verify(token, getKey, options, (err, decoded) => {
      if (err) {
        return reject(err);
      }

      resolve(decoded);
    });
  });

  if (token) {
    console.log('token: ', token);
    return decoded;
  }

  if (requireAuth) {
    throw new Error('You are not logged in');
  }
  return null;
};

module.exports = {decodedToken};
