process.env.NODE_ENV === 'development' && require('dotenv').config(); //only use dotenv in development environment

const {ApolloServer} = require('apollo-server');
const {Prisma} = require('./prisma-client/generated/prisma-client');
const typeDefs = require('./graphql/schema');
const resolvers = require('./graphql/resolvers');
const {decodedToken} = require('./auth/authenticate');

// REST data sources
const TicketMasterAPI = require('./ticket-master/tm.datasource');

// Schema Configuration
const server = new ApolloServer({
  typeDefs,
  resolvers,
  // Classes used to fetch data from REST apis
  dataSources: () => {
    return {
      ticketMasterAPI: new TicketMasterAPI(),
    };
  },
  context: ({req}) => ({
    //store prisma in context to use prisma in resolvers
    prisma: new Prisma({
      secret: process.env.SECRET,
      endpoint: process.env.PRISMA,
    }),

    req, //necessary to get user token from header
    decodedToken, //used to verify token with auth0 and returns decoded token
    // Ticket Master API key
    tm_key: process.env.TICKET_MASTER,
  }),
  introspection: true,
  playground: true,
});

// Start our server if we're not in a test env.
// if we're in a test env, we'll manually start it in a test

if (process.env.NODE_ENV !== 'testing') {
  server.listen({port: process.env.PORT || 4000}).then(({url}) => {
    console.log(`Server ready at ${url}`);
  });
}

// export all the important pieces for integration/e2e tests to use
module.exports = {
  typeDefs,
  resolvers,
  ApolloServer,
  server,
};
