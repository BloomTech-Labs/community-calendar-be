const {ApolloServer} = require('apollo-server');
const {Prisma} = require('./prisma-client/generated/prisma-client');
const typeDefs = require('./graphql/schema');
const resolvers = require('./graphql/resolvers');

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({req}) => ({
    //store prisma in context to use prisma in resolvers
    prisma: new Prisma({
      secret: process.env.SECRET,
      endpoint: process.env.PRISMA,
    }),
    //necessary to get user token from header
    req,
  }),
  introspection: true,
  playground: true,
});

server.listen({port: process.env.PORT || 4000}).then(({url}) => {
  console.log(`Server ready at ${url}`);
});
