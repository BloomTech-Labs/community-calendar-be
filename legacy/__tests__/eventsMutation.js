// test utilities
const {prismaConnection, constructTestServer} = require('./__testutils');
const {createTestClient} = require('apollo-server-testing');
const uuidv4 = require('uuid/v4');

// graphql
const {GET_EVENT_BY_ID} = require('./__testQuery.js');
const {ADD_EVENT, UPDATE_EVENT, DELETE_EVENT} = require('./__testMutation.js');

// setup and teardown
// randomly generate a unique id for the testUser
// must pass `testUserId` into the `constructTestServer` to get in context
// `testUserId` is required by the mutation resolvers for authorization
const testAuth0Id = uuidv4();
let testUser

beforeAll(async () => {
  // directly add a testUser to the prisma ORM
  testUser = await prismaConnection().createUser({auth0Id: testAuth0Id});
})

afterAll(() => {
  return prismaConnection().deleteUser({auth0Id: testAuth0Id});
})

// tests
describe('Mutations', () => {
  // scope `newEvent` and `newEvent` to be used in all tests
  let newEventId
  let newEvent

  it('creates an event', async () => {
    const server = constructTestServer(testUser.id);
    const {query, mutate} = createTestClient(server);

    // test ADD_EVENT
    const addEventRes = await mutate({
      mutation: ADD_EVENT,
      variables: { 
        title: "test event title", 
        description: "test event description",
        start: "2020-01-22T17:00:00.000Z",
        end: "2020-01-22T19:30:00.000Z",
        placeName: "test placeName",
        streetAddress: "test streetAddress",
        city: "test city",
        state: "MI",
        zipcode: 48202,
        ticketPrice: 0.00
      }
    });
    newEventId = addEventRes.data.addEvent.id;
    expect(newEventId).toBeDefined();

    // query server to ensure new event is there
    const getEventRes = await query({
      query: GET_EVENT_BY_ID, 
      variables: {id: newEventId}});
    newEvent = getEventRes.data.events[0];
    expect(newEvent).toBeDefined();
    expect(newEvent.title).toContain("test event title");
  });

  it('updates an event when all values provided', async () => {
    const server = constructTestServer(testUser.id);
    const {query, mutate} = createTestClient(server);

    // test UPDATE_EVENT
    const updateEventRes = await mutate({
      mutation: UPDATE_EVENT,
      variables: {
        eventId: newEventId,
        locationId: newEvent.locations[0].id,
        title: "updated test event title", 
        description: 'updated test event description',
        start: "2020-01-22T17:00:00.000Z",
        end: "2020-01-22T19:30:00.000Z",
        placeName: "test placeName",
        streetAddress: "test streetAddress",
        city: "updated test city",
        state: "MI",
        zipcode: 48202,
        ticketPrice: 0.00
       }
    });
    const updatedEventId = updateEventRes.data.updateEvent.id
    expect(updatedEventId).toBeDefined();
    expect(updatedEventId).toBe(newEventId);

    // query server to ensure changes are recorded
    const getEventRes = await query({
      query: GET_EVENT_BY_ID, 
      variables: {id: newEventId}});
    const updatedEvent = getEventRes.data.events[0];
    expect(updatedEvent).toBeDefined();
    expect(updatedEvent.title).toContain("updated test event title");
    expect(updatedEvent.locations[0].city).toContain("updated test city");
  });

  it('updates an event when only one value provided', async () => {
    const server = constructTestServer(testUser.id);
    const {query, mutate} = createTestClient(server);

    // test UPDATE_EVENT
    const updateEventRes = await mutate({
      mutation: UPDATE_EVENT,
      variables: {
        eventId: newEventId,
        locationId: newEvent.locations[0].id,
        title: "updated test event title"
       }
    });
    const updatedEventId = updateEventRes.data.updateEvent.id
    expect(updatedEventId).toBeDefined();
    expect(updatedEventId).toBe(newEventId);

    // query server to ensure changes are recorded
    const getEventRes = await query({
      query: GET_EVENT_BY_ID, 
      variables: {id: newEventId}});
    const updatedEvent = getEventRes.data.events[0];
    expect(updatedEvent).toBeDefined();
    // test new values
    expect(updatedEvent.title).toContain("updated test event title");
    // test retention of original values
    expect(updatedEvent.description).toContain("test event description")
    expect(updatedEvent.locations[0].name).toContain("test placeName")

  });

  it('updates an event when only one vaue for the location provided', async () => {
    const server = constructTestServer(testUser.id);
    const {query, mutate} = createTestClient(server);

    // test UPDATE_EVENT
    const updateEventRes = await mutate({
      mutation: UPDATE_EVENT,
      variables: {
        eventId: newEventId,
        locationId: newEvent.locations[0].id,
        placeName: "updated test placeName"
       }
    });
    const updatedEventId = updateEventRes.data.updateEvent.id
    expect(updatedEventId).toBeDefined();
    expect(updatedEventId).toBe(newEventId);

    // query server to ensure changes are recorded
    const getEventRes = await query({
      query: GET_EVENT_BY_ID, 
      variables: {id: newEventId}});
    const updatedEvent = getEventRes.data.events[0];
    expect(updatedEvent).toBeDefined();
    // test new values
    expect(updatedEvent.locations[0].name).toContain("updated test placeName");
  });


  it('deletes an event', async () => {
    const server = constructTestServer(testUser.id);

    const {query, mutate} = createTestClient(server);

    // test DELETE_EVENT
    const deleteEventRes = await mutate({
      mutation: DELETE_EVENT,
      variables: {id: newEventId}
    }); 
    expect(deleteEventRes).toBeDefined();

    // get test event by id to ensure it's deleted
    const getEventRes = await query({
      query: GET_EVENT_BY_ID, 
      variables: {id: newEventId}});
    const deletedEvent = getEventRes.data.events[0];
    expect(deletedEvent).not.toBeDefined();
  })
});
