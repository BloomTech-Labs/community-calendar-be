//test utilities
const {
  prismaConnection,
  constructTestServer,
} = require('./__testutils');
const {createTestClient} = require('apollo-server-testing');
const uuidv4 = require('uuid/v4');

// graphql
const {GET_TEST_USER} = require('./__testQuery.js');

// setup and teardown
// randomly generate a unique id for the testUser
const testUserId = uuidv4();

// tests
describe('it creates and deletes test users', () => {

  // test creates a user
  it('creates a user', async () => {
    // directly add a testUser to the prisma ORM
    const testUser = await prismaConnection().createUser({auth0Id: testUserId})
    expect(testUser).toBeDefined();
    expect(testUser.auth0Id).toBe(testUserId);
  });

  it('deletes a user', async () => {
    // directly delete testUser from the prisma ORM
    const deleteRes = await prismaConnection().deleteUser({auth0Id: testUserId});
    expect(deleteRes).toBeDefined();
    expect(deleteRes.auth0Id).toBe(testUserId);
    
  });

  it('ensures user has been deleted', async () => {
    // query apollo server to ensure testUser is deleted
    const server = constructTestServer();
    const {query} = createTestClient(server);
    const {data} = await query({
      query: GET_TEST_USER,
      variables: {auth0Id: testUserId}
    });
    // let testUser = testUserQueryRes.data.users[0];
    console.log(data)
    expect(data.users).toBeDefined();
    expect(data.users.length).toBe(0);
  })
});
