// import ApolloServer and important pieces for creating test server
const {
  typeDefs,
  resolvers,
  ApolloServer
} = require('../index.js');

// import Prisma to connect to test database
const {Prisma} = require('../prisma-client/testing/generated/prisma-client');

// Create a server instance that can be used for each test suite
const constructTestServer = () => {

  // construct prismaServer outside of ApolloServer 
  const prismaServer = new Prisma({
    endpoint: "http://localhost:4466",
  });

  // construct apollo server
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({req}) => ({
      prisma: prismaServer,
      req,
      // query prisma directly for seeded user's unique id
      // necesarry to mock auth0 functionality
      decodedToken: async () => {
        const user = await prismaServer.users().then(res => {
          return res[0]
        })
        return {'http://cc_id': user.id}
      }
    }),

  });

  return { server };
};

module.exports = {
  constructTestServer
};