
require('dotenv').config() 
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
const prismaConnection = () => {
  const prismaServer = new Prisma({
    secret: process.env.TEST_SECRET || null,
    endpoint: process.env.TEST_PRISMA,
  });
  return prismaServer
}

// Create a server instance that can be used for each test suite
const constructTestServer = (testUserId = null) => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({req}) => ({
      prisma: new Prisma({
        secret: process.env.TEST_SECRET || null,
        endpoint: process.env.TEST_PRISMA,
      }),
      req,
      // mock authorization function from context
      decodedToken: async () => ({'http://cc_id': testUserId})
    }),
  });
  return server;
};

module.exports = {
  constructTestServer,
  prismaConnection
};