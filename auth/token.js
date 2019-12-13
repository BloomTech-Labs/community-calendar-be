const jwt = require('jsonwebtoken');

const secret = process.env.JWT_SECRET || 'super duper secret secret';

async function generateToken(user){
    const payload = {
        subject: user.id
    };

    const options = {
        expiresIn: '24h'
    };

    return jwt.sign(payload, secret, options);
}

module.exports = {
    secret,
    generateToken
}