const {gql} = require('apollo-server');

const typeDefs = gql `
    type User {
        id: ID!
        auth0_id: String!
    }

    type Query {
        users: [User]
        checkId(data: userInput!) : [User]
    }

    type userID {
        id: String
    }

    type Mutation {
        register(data: registerInput!) : AuthPayLoad!
        login(data: loginInput!) : AuthPayLoad!
        addUser(data: userInput!) : User!
    }

    input registerInput {
        username: String!
        name: String!
        password: String!
    }

    input userInput {
        auth0_id: String!
    }

    input loginInput {
        username: String!
        password: String!
    }

    type AuthPayLoad {
        token: String!
    }
`;

module.exports = typeDefs;