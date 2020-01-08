const {createTestClient} = require('apollo-server-testing');
const gql = require('graphql-tag');

const {constructTestServer} = require('./__testutils');

//queries
// const {
//     GET_EVENTS
// } = require('./testQuery.js');

const GET_EVENTS = gql`
  query {
      events {
          title
          description
      }
  }`

describe('Queries', () => {

  it('fetches events', async () => {
    const {server} = constructTestServer();

    const {query} = createTestClient(server);
    const res = await query({query: GET_EVENTS});
    expect(res).toMatchSnapshot();
  });
});
