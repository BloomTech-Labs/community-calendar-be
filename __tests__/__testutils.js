// ensure SECRET and PRISMA are defined for the TEST ENVIRONMENT in the root .env file
require('dotenv').config();

// import ApolloServer and important pieces for creating test server
const {
  typeDefs,
  resolvers,
  ApolloServer
} = require('../index.js');

// import Prisma to connect to test database
const {Prisma} = require('../prisma-client/generated/prisma-client');

/**
 * Integration testing utils
 */
const constructTestServer = () => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({req}) => ({
      prisma: new Prisma({
        secret: process.env.SECRET,
        endpoint: process.env.PRISMA,
      }),
      req,
      // decoded token id will be different each time database reseeded
      decodedToken: async () => ({'http://cc_id': 'ck4d7l0vj00ff0784lxympdik'})
    }),
  });

  return { server };
};

module.exports = {
  constructTestServer
};