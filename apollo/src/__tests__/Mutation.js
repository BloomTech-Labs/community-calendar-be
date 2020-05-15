const mockContext = jest.genMockFromModule('../context');
const fs = require('fs')
const { mockServer } = require('graphql-tools')

const schema = fs.readFileSync('./schema/generated/prisma.graphql', 'utf8')
const mockPrismaClient = jest.genMockFromModule('../generated/prisma-client');
const Server = mockServer(schema)
mockPrismaClient.addEvent = jest.fn();
mockPrismaClient.addUser = jest.fn();
mockPrismaClient.updateUser = jest.fn();
mockPrismaClient.deleteEvent = jest.fn();
mockPrismaClient.updateEvent = jest.fn();
mockPrismaClient.rsvpEvent = jest.fn();
mockPrismaClient.saveEvent = jest.fn();
mockPrismaClient.tags = jest.fn();
mockPrismaClient.eventImages = jest.fn();
mockPrismaClient.events = jest.fn();
mockPrismaClient.creator = jest.fn();
mockContext.prisma = mockPrismaClient;
mockContext.user = 'Mock';

const { addEvent, deleteEvent } = require('../resolvers/Mutation');

describe('Add Event', () => {
  it('addEvent query is there', async () => {
    const server = Server
    const mutation = `
      mutation {
        addEvent(data: {title: "title", description: "desc", "start": "2020-05-19T17:00:00.000Z"
        "end": "2020-05-20T11:00:00.000Z", locations: [
          {streetAddress: "600 Woodward Avenue", city: "Detroit"}
        ]
        eventImages: [
          {url: "www.url.com"}
        ]
      })
      }
    `
    await expect(server.query(mutation)).resolves.toBeTruthy()
    const { errors } = await server.query(mutation)

  })
  it('throws an error when no args are given', async () => {
    jest.spyOn(mockContext.prisma, 'addEvent').mockImplementation(async () => {
      return {};
    });
    await expect(
      addEvent(undefined, undefined, mockContext, undefined),
    ).rejects.toThrow();
    expect(mockContext.prisma.addEvent).toHaveBeenCalledTimes(0);
  });
  it('throws an error when user is undefined', async () => {
    jest.spyOn(mockContext.prisma, 'addEvent').mockImplementation(async () => {
      return {};
    });
    await expect(
      addEvent(undefined, undefined, mockContext, undefined),
    ).rejects.toThrow();
    expect(mockContext.prisma.addEvent).toHaveBeenCalledTimes(0);
  });
  it('should return event from Prisma client', async () => {
    const args = { data: { title: 'title', description: 'description' } };
    const dummyEvent = args.data;

    jest.spyOn(mockContext.prisma, 'addEvent').mockImplementation(async () => {
      return dummyEvent;
    });
    const returnedEvent = await addEvent(
      undefined,
      args,
      mockContext,
      undefined,
    );
    expect(returnedEvent).toEqual(dummyEvent);

    expect(mockContext.prisma.addEvent).toHaveBeenCalledTimes(1);
  });
});
describe('Delete Event', () => {
  it('delete mutation is there', async () => {
    const server = Server
    const mutation = `
      {
        deleteEvent(where: { id: "213"}) {
          title
        }
      }
    `
    await expect(server.query(mutation)).resolves.toBeTruthy()
  })
  it('throws an error if where arg is not given', async () => {
    jest
      .spyOn(mockContext.prisma, 'deleteEvent')
      .mockImplementation(async () => {
        return {};
      });
    await expect(
      deleteEvent(undefined, undefined, mockContext, undefined),
    ).rejects.toThrow();
    expect(mockContext.prisma.deleteEvent).toHaveBeenCalledTimes(0);
  });
  it.skip('deletes an event', async () => {
    const args = { where: { id: '123' } };
    mockContext.user = mockPrismaClient.creator();
    const deleteID = args;
    jest
      .spyOn(mockContext.prisma, 'deleteEvent')
      .mockImplementation(async () => {
        return {};
      });
    const removeEvent = await deleteEvent(
      undefined,
      args,
      mockContext,
      undefined,
    );
    expect(removeEvent).toEqual(deleteID);
  });
});
describe('Rsvp Event', () => {
  it('rsvp mutation is there', async () => {
    const server = Server
    const mutation = `
      {
        rsvpEvent(event: {id: "123"}) {
        }
      }
    `
    await expect(server.query(mutation)).resolves.toBeTruthy()
  })
});
describe('Save Event', () => {
  it('save mutation is there', async () => {
    const server = Server
    const mutation = `
      {
        saveEvent(event: { id: "123"})
      }
    `
    await expect(server.query(mutation)).resolves.toBeTruthy()
  })
});
