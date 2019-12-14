const {gql} = require('apollo-server')

const typeDefs = gql`
  type User {
    id: ID!
    auth0_id: String!
  }

  type Query {
    users: [User]
    checkId(data: userInput!): [User]
  }

  type Mutation {
    addUser(data: userInput!): User!
  }

  input userInput {
    auth0_id: String!
  }
`

module.exports = typeDefs
