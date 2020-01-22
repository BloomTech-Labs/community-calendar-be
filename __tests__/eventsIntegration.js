const {constructTestServer} = require('./__testutils');
const {createTestClient} = require('apollo-server-testing');
const {
    GET_EVENTS,
    GET_EVENT_BY_ID
} = require('./__testQuery.js');


describe('Queries', () => {

  it('fetches events', async () => {
    const {server} = constructTestServer();

    const {query} = createTestClient(server);
    const res = await query({query: GET_EVENTS});

    let events = res.data.events;
    
    expect(events).toHaveLength(1);
  });

  it('fetches an event by id', async () => {
    const {server} = constructTestServer();

    // get id of first event to test GET_EVENT_BY_ID
    const {query} = createTestClient(server);
    const eventsRes = await query({query: GET_EVENTS});
    let eventId = eventsRes.data.events[0].id

    // test GET_EVENT_BY_ID
    const res = await query({query: GET_EVENT_BY_ID, variables: {id: eventId}});
    
    let event = res.data.events[0];

    expect(event.title).toContain("Art & Architecture - Downtown Walking Tour");

  });
});
