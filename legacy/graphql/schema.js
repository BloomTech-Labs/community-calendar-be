const {importSchema} = require('graphql-import');
const gql = require('graphql-tag');
const {disableFragmentWarnings} = require('graphql-tag');
const basicDefs = importSchema('./graphql/schema.graphql');

disableFragmentWarnings();

//fixes issue of Upload type not being recognized in schema.graphql
const mutationDefs = gql`
  extend type Mutation {
    addEvent(data: EventCreateInput!, images: [Upload!]): Event!
    updateEvent(
      data: EventUpdateInput
      where: EventWhereUniqueInput!
      images: [Upload!]
    ): Event
    updateUser(
      data: UserUpdateInput
      image: Upload
    ): User!
  }
`;
//combine imported schema and extended schema
const typeDefs = [basicDefs, mutationDefs];

module.exports = typeDefs;
