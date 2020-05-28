//const mockContext = jest.genMockFromModule('../context');
const fs = require('fs')
const { mockServer } = require('graphql-tools')
const mockContext = require('../context/__mocks__')

const schema = fs.readFileSync('./schema/generated/prisma.graphql', 'utf8')
const mockPrismaClient = jest.genMockFromModule('../generated/prisma-client');
const Server = mockServer(schema)
mockPrismaClient.addEvent = jest.fn();
mockPrismaClient.createEvent = jest.fn();
mockPrismaClient.addUser = jest.fn();
mockPrismaClient.createUser = jest.fn();
mockPrismaClient.updateUser = jest.fn();
mockPrismaClient.deleteEvent = jest.fn();
mockPrismaClient.updateEvent = jest.fn();
mockPrismaClient.rsvpEvent = jest.fn();
mockPrismaClient.saveEvent = jest.fn();
mockPrismaClient.tags = jest.fn();
mockPrismaClient.eventImages = jest.fn();
mockPrismaClient.events = jest.fn();
mockPrismaClient.creator = jest.fn();
mockPrismaClient.createSeries = jest.fn();
mockPrismaClient.deleteSeries = jest.fn();
mockPrismaClient.events = jest.fn();
mockContext.prisma = mockPrismaClient;
mockContext.user = 'Mock';

const { addEvent, deleteEvent, createSeries, deleteSeries, updateUser, addUser, updateEvent } = require('../resolvers/Mutation');


describe('addUser', () => {
  it('addUser mutation is there', async () => {
    const server = Server
    const mutation = `
     mutation {
       createUser(data: {oktaId: "555", firstName: "Name", lastName: "Last" }) {
         
          id
          firstName
          lastName
        }
      }
    `
    await expect(server.query(mutation)).resolves.toBeTruthy()
    const { errors } = await server.query(mutation)
    expect(errors).not.toBeTruthy()
  })
  it('should add a user to the database', async () => {
    const args = { data: { firstName: "First", lastName: "Last", profileImage: "http://res.cloudinary.com/pic" } }
    const dummyUser = args
    jest.spyOn(mockContext.prisma, 'createUser').mockImplementation(async () => { return dummyUser })
    const returnedUser = await addUser(undefined, args, mockContext, undefined)
    expect(returnedUser).toEqual(dummyUser)
    expect(dummyUser.data.firstName).toBe('First')
    expect(dummyUser.data.lastName).not.toBe('First')
  })
})

describe('UpdateUser', () => {
  it('updateUser mutation is there', async () => {
    const server = Server
    const mutation = `
     mutation {
        updateUser(where: { id: "123" } data: { firstName: "New" }) {
          id
          firstName
        }
      }
    `
    await expect(server.query(mutation)).resolves.toBeTruthy()
    const { errors } = await server.query(mutation)
    expect(errors).not.toBeTruthy()
  })
  it('should throw an error if args are not given', async () => {
    jest.spyOn(mockContext.prisma, 'updateUser').mockImplementation(async () => { return false })
    await expect(updateUser(undefined, undefined, mockContext, undefined)).rejects.toThrow()
    expect(mockContext.prisma.updateUser).toHaveBeenCalledTimes(0)
  })
  it("should throw an error when user is undefined", async () => {
    const args = { where: { id: "123" } }
    jest.spyOn(mockContext.prisma, 'updateUser').mockImplementation(async () => { return false })
    await expect(updateUser(undefined, args, undefined, undefined)).rejects.toThrow()
  })
  it('should update user when args are provided', async () => {
    const args = { where: { id: "123" }, data: { firstName: "New" } }
    const dummyUser = args.data
    jest.spyOn(mockContext.prisma, 'updateUser').mockImplementation(async () => { return dummyUser })
    const returnedUser = await updateUser(undefined, args, mockContext, undefined)
    expect(returnedUser).toEqual(dummyUser)
    expect(mockContext.prisma.updateUser).toHaveBeenCalledTimes(1);
  })
})

describe('Add Event', () => {
  it('addEvent query is there', async () => {
    const server = Server
    const mutation = `
      mutation {
        createEvent(data: {
          locations:{create:{streetAddress:"2092 Linden ave", city:"Memphis", zipcode:38104, state:"TN", name:"Place"}} 
      title:"deleting series test", 
    	description:"for testing updates of location/images", start:"2020-07-14T10:00:00.000Z", end:"2020-05-14T10:00:00.000Z", 
      ticketPrice:0.00, index: "deleting"
        }) {
          id
          title
          description
        }
      }
    `
    await expect(server.query(mutation)).resolves.toBeTruthy()
    const { errors } = await server.query(mutation)
    expect(errors).not.toBeTruthy()

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

    jest.spyOn(mockContext.prisma, 'createEvent').mockImplementation(async () => {
      return dummyEvent;
    });
    const returnedEvent = await addEvent(
      undefined,
      args,
      mockContext,
      undefined,
    );
    expect(returnedEvent).toEqual(dummyEvent);

    expect(mockContext.prisma.createEvent).toHaveBeenCalledTimes(1);
  });
  it('should create a series', async () => {
    const args = {
      data: {
        series: {
          create: { frequency: "WEEKLY", series_end: "2020-07-14T10:00:00.000Z" }
        },
        title: 'title', description: 'description'
      }
    }
    const dummyEvent = args.data
    jest.spyOn(mockContext.prisma, 'createEvent').mockImplementation(async () => { return dummyEvent })
    const returnedEvent = await addEvent(undefined, args, mockContext, undefined)
    expect(returnedEvent).toEqual(dummyEvent)
    expect(mockContext.prisma.createEvent).not.toHaveBeenCalledTimes(0)
    expect(dummyEvent.series.create.frequency).toBe('WEEKLY')
    expect(mockContext.prisma.createEvent).toHaveBeenCalledWith(expect.objectContaining({
      series: { create: { frequency: 'WEEKLY', series_end: "2020-07-14T10:00:00.000Z" } }
    }))
  })
  it('should connect to an exsisting series', async () => {
    const args = {
      data: {
        series: {
          connect: { id: "123" }
        },
        title: "title", description: "description"
      }
    }
    const dummyEvent = args.data
    jest.spyOn(mockContext.prisma, 'createEvent').mockImplementation(async () => { return dummyEvent })
    const returnedEvent = await addEvent(undefined, args, mockContext, undefined)
    expect(returnedEvent).toEqual(dummyEvent)
    expect(mockContext.prisma.createEvent).not.toHaveBeenCalledTimes(0)
    expect(dummyEvent.series.connect.id).toBe('123')
    expect(mockContext.prisma.createEvent).toHaveBeenCalledWith(expect.objectContaining({
      series: { connect: { id: '123' } }
    }))
  })
});
describe('Update Event', () => {
  it('update event mutation is there', async () => {
    const server = Server
    const mutation = `
      mutation {
        updateEvent(where: { id: "123"}, data: { title: "new title"}) {
          id
          title
        }
      }
    `
    await expect(server.query(mutation)).resolves.toBeTruthy()
    const { errors } = await server.query(mutation)
    expect(errors).not.toBeTruthy()

  })
  it('should throw when not signed in', async () => {
    const args = { where: { id: "123" }, data: { title: "new title" } }

    jest.spyOn(mockContext.prisma, 'updateEvent').mockImplementation(async () => { return false })
    await expect(updateEvent(undefined, args, mockContext, undefined)).rejects.toThrow("Not authenticated")
  })
  it.skip('should update an event', async () => {
    const args = { where: { id: "123" }, data: { title: "new title" } }
    const dummyEvent = args.data
    const { id } = mockContext.user
    const user = mockContext.user
    jest.spyOn(mockContext.prisma, 'updateEvent').mockImplementation(async () => { return dummyEvent })
    const returnedEvent = await updateEvent(undefined, args, { mockContext, id }, undefined)
    expect(returnedEvent).toEqual(dummyEvent)
  })
})
describe('Delete Event', () => {
  it('delete mutation is there', async () => {
    const server = Server
    const mutation = `
     mutation {
        deleteEvent(where: { id: "213"}) {
          title
        }
      }
    `
    await expect(server.query(mutation)).resolves.toBeTruthy()
    const { errors } = await server.query(mutation)
    expect(errors).not.toBeTruthy()
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
    const removed = { id: "123" }

    jest
      .spyOn(mockContext.prisma, 'deleteEvent')
      .mockImplementation(async () => {
        return { removed };
      });
    const removeEvent = await deleteEvent(
      undefined,
      args,
      mockContext,
      undefined,
    );
    expect(removeEvent).toEqual(removed);
  });
});
describe('Rsvp Event', () => {
  it('rsvp mutation is there', async () => {
    const server = Server
    const mutation = `
     mutation {
        rsvpEvent(event: {id: "123"}) 
        
      }
    `
    await expect(server.query(mutation)).resolves.toBeTruthy()

  })
  it('should return true on rsvp', async () => {
    const server = Server
    const mutation = `
     mutation {
        rsvpEvent(event: {id: "123"}) 
        
      }
    `
    await expect(server.query(mutation)).resolves.toBeTruthy()
    const args = { data: { rsvps: true } }
    const dummyRSVP = args.data
    jest.spyOn(mockContext.prisma, 'updateUser').mockImplementation(async () => { return dummyRSVP })
    const returnRSVP = await updateUser(undefined, args, mockContext, undefined)
    expect(returnRSVP).toEqual(dummyRSVP)
  })
});
describe('Save Event', () => {
  it('save mutation is there', async () => {
    const server = Server
    const mutation = `
     mutation {
        saveEvent(event: { id: "123"})
      }
    `
    await expect(server.query(mutation)).resolves.toBeTruthy()
  })
  it('returns true on save', async () => {
    const server = Server
    const mutation = `
     mutation {
        saveEvent(event: { id: "123"})
    }
    `
    await expect(server.query(mutation)).resolves.toBeTruthy()
    const args = { data: { saved: true } }
    const dummySave = args.data
    jest.spyOn(mockContext.prisma, 'updateUser').mockImplementation(async () => { return dummySave })
    const returnSaved = await updateUser(undefined, args, mockContext, undefined)
    expect(returnSaved).toEqual(dummySave)

  })
});

describe('Create Series', () => {
  it('Create series mutation is there', async () => {
    const server = Server
    const mutation = `
     mutation {
        createSeries(data: {frequency: WEEKLY, series_end: "2020-06-02T03:00:00.000Z"}) 
        {
          id
          frequency
        }
      }
    `
    await expect(server.query(mutation)).resolves.toBeTruthy()
    const { errors } = await server.query(mutation)
    expect(errors).not.toBeTruthy()
  })
  it('throws an error when no args are given', async () => {
    jest.spyOn(mockContext.prisma, 'createSeries').mockImplementation(async () => { return false })
    await expect(createSeries(undefined, undefined, mockContext, undefined)).rejects.toThrow()
    expect(mockContext.prisma.createSeries).toHaveBeenCalledTimes(0);
  })
  it('should return a series from Prisma Client', async () => {
    const args = { data: { frequency: "WEEKLY", series_end: "2020-06-02T03:00:00.000Z" } }
    const dummySeries = args.data
    jest.spyOn(mockContext.prisma, 'createSeries').mockImplementation(async () => { return dummySeries })
    const returnedSeries = await createSeries(undefined, args, mockContext, undefined)
    expect(returnedSeries).toEqual(dummySeries)
    expect(mockContext.prisma.createSeries).toHaveBeenCalledTimes(1);
  })
})

describe('Delete Series', () => {
  it('Delete series mutation is there', async () => {
    const server = Server
    const mutation = `
      mutation {
        deleteSeries(where: { id: "123" }) {
          id
        }
      }
    `
    await expect(server.query(mutation)).resolves.toBeTruthy()
    const { errors } = await server.query(mutation)
    expect(errors).not.toBeTruthy()
  })
  it('should delete a series when given the id', async () => {
    const args = { where: { id: "123" } }
    const removed = { id: "123" }
    jest.spyOn(mockContext.prisma, 'deleteSeries').mockImplementation(async () => { return removed })
    const deletedSeries = await deleteSeries(undefined, args, mockContext, undefined)
    expect(deletedSeries).toEqual(removed)
    expect(mockContext.prisma.deleteSeries).toHaveBeenCalledTimes(1)
  })
})
