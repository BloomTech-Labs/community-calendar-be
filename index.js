require('dotenv').config();
const {ApolloServer, gql} = require('apollo-server');
const {prisma} = require('./prisma-client/generated/prisma-client');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({req}) => ({
        prisma,
        req
    }),
    introspection: true,
    playground: true
});

server.listen({port: process.env.PORT || 4000}).then(({url}) => {
    console.log(`Server ready at ${url}`)
});

