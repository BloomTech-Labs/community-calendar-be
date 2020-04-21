// test utilties
const {constructTestServer, prismaConnection} = require('./__testutils');
const {createTestClient} = require('apollo-server-testing');
const uuidv4 = require('uuid/v4');

// graphql
const {GET_EVENTS, GET_EVENT_BY_ID} = require('./__testQuery.js');
const {ADD_EVENT, DELETE_EVENT} = require('./__testMutation.js');


// setup and teardown
const testAuth0Id = uuidv4();
let testUser
const testEvent = { 
  title: "test event title", 
  description: 'test event description',
  start: "2020-01-22T17:00:00.000Z",
  end: "2020-01-22T19:30:00.000Z",
  placeName: "test placeName",
  streetAddress: "test streetAddress",
  city: "test city",
  state: "MI",
  zipcode: 48202,
  ticketPrice: 0.00
}
let testEventId

// add a testUser directly to the prisma ORM and create an event to query
beforeAll(async () => {
  // directly add a testUser to the prisma ORM
  testUser = await prismaConnection().createUser({auth0Id: testAuth0Id});
  const server = constructTestServer(testUser.id);
  const addEventRes = await createTestClient(server).mutate({
    mutation: ADD_EVENT,
    variables: testEvent
  });
  testEventId = addEventRes.data.addEvent.id;
})

// remove the testUser and testEvent from the prisma ORM
afterAll(async () => {
  const deleteUser = await prismaConnection().deleteUser({auth0Id: testAuth0Id});
  const server = constructTestServer(testUser.id);
  const deleteEvent = await createTestClient(server).mutate({
    mutation: DELETE_EVENT,
    variables: {id: testEventId}
  });
})

// tests
describe('Queries', () => {

  it('fetches events', async () => {
    const server = constructTestServer();
    const res = await createTestClient(server).query({query: GET_EVENTS});
    const events = res.data.events;
    expect(events).not.toHaveLength(0);
  });

  it('fetches an event by id', async () => {
    const server = constructTestServer();
    const res = await createTestClient(server).query({
      query: GET_EVENT_BY_ID, 
      variables: {id: testEventId}
    });
    let event = res.data.events[0];
    expect(event.title).toContain("test event title");
  });
});
