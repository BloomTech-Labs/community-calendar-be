const {createTestClient} = require('apollo-server-testing');

const {constructTestServer} = require('./__testutils');

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

    expect(events).toMatchSnapshot();
    
    expect(events).toHaveLength(7);
  });

  it('fetches an event by id', async () => {
    const {server} = constructTestServer();

    const {query} = createTestClient(server);
    const res = await query({query: GET_EVENT_BY_ID, variables: {id: "ck4d7l1bx00ge0784nlj6j3am"}});
    
    let event = res.data.events[0];

    expect(event).toMatchSnapshot();

    expect(event.title).toContain("Art & Architecture - Downtown Walking Tour");


  });
});
