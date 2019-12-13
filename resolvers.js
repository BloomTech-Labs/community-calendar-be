const bcrypt = require('bcryptjs');
const {decodedToken} = require('./auth/authenticate');
const {generateToken} = require('./auth/token');

const resolvers = {
    Query: {
        users: async (root, args, {prisma, req}, info) => {
            try {
                const decoded = await decodedToken(req);
                return prisma.users();
            }catch(err){
                throw err;
            }
        },
        checkId: async (root, args, {prisma}, info) => {
            const {data: {auth0_id}} = args;
            console.log(auth0_id);
            try{
                const user = await prisma.users({
                    where: {
                        auth0_id: auth0_id
                    }
                });
                return user;
            }catch(err){
                throw err;
            }
        }
    },

    Mutation: {
        register: async (root, args, {prisma}, info) => {
            const {data: {username, name, password} } = args;
            const user = await prisma.createUser({
                username,
                name,
                password: bcrypt.hashSync(password, 8)
            });

            console.log(user);
            return {token: generateToken(user)};
        },
        login: async (root, args, {prisma}, info) => {
            const {data: {username, password} } = args;
            const [user] = await prisma.users({
                where: {
                    username
                }
            });

            console.log(user);
            if(user && bcrypt.compareSync(password, user.password)){
                return {token: generateToken(user)};
            }else{
                throw new Error('Invalid username or password');
            }
        },
        addUser: async (root, args, {prisma}, info)=> {
            const {data: {auth0_id}} = args;
            const user = await prisma.createUser({
                auth0_id
            });
            console.log(user);
            return user;
        }
        
    }
};

module.exports = resolvers;