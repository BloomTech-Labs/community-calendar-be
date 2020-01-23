const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');

const client = jwksClient({
  jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`,
});

//get RSA signing key from auth0 endpoint
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
  //remove Bearer from authorization header
  const token =
    req.headers.authorization &&
    req.headers.authorization.replace('Bearer ', '');

  if (!token) {
    throw 'No token was found in header.';
  }

  //verify token with auth0 and decode the token
  const decoded = new Promise((resolve, reject) => {
    jwt.verify(token, getKey, options, (err, decoded) => {
      if (err) {
        return reject(err);
      }

      resolve(decoded);
    });
  });

  //return decoded token if token was valid
  if (token) {
    return decoded;
  }

  if (requireAuth) {
    throw new Error('You are not logged in');
  }
  return null;
};

module.exports = {decodedToken};
