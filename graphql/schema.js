const {importSchema} = require('graphql-import');
const gql = require('graphql-tag');

const basicDefs = importSchema('./graphql/schema.graphql'); 

const mutationDefs = gql`
    extend type Mutation {
        uploadImages(images: [Upload!]): File!
        addEvent(data: EventCreateInput!, images: [Upload!]): Event!
        updateEvent(data: EventUpdateInput!, where: EventWhereUniqueInput!, images: [Upload!]): Event
    }
`
const typeDefs = [basicDefs, mutationDefs];

module.exports = typeDefs;
