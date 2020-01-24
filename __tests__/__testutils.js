// import ApolloServer and important pieces for creating test server
const {
  typeDefs,
  resolvers,
  ApolloServer
} = require('../index.js');

// import Prisma to connect to test database
const {Prisma} = require('../prisma-client/testing/generated/prisma-client');

// Create a prisma instance that can be used for directly modifying the
// prisma ORM in tests
const constructPrismaConnection = () => {
  const prismaServer = new Prisma({
    endpoint: "http://localhost:4466",
  });

  return {prismaServer}
}

// Create a server instance that can be used for each test suite
const constructTestServer = (testUserId = null) => {

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({req}) => ({
      prisma: new Prisma({
        endpoint: "http://localhost:4466",
      }),
      req,
      decodedToken: {'http://cc_id': testUserId}
    }),

  });

  return { server };
};

module.exports = {
  constructTestServer,
  constructPrismaConnection
};