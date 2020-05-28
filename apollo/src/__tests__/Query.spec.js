const fs = require('fs')
const { mockServer } = require('graphql-tools')
const mockContext = jest.genMockFromModule('../context')
const mockPrismaClient = jest.genMockFromModule('../generated/prisma-client')
mockPrismaClient.user = jest.fn()
mockPrismaClient.users = jest.fn()
mockPrismaClient.events = jest.fn()
mockPrismaClient.checkId = jest.fn()
mockPrismaClient.tags = jest.fn()
mockPrismaClient.series = jest.fn()
mockPrismaClient.serieses = jest.fn()
mockContext.prisma = mockPrismaClient
const schema = fs.readFileSync('./schema/generated/prisma.graphql', 'utf8')
const generatedPrisma = require('../generated/prisma-client')
const MyServer = mockServer(schema)

const { user, users, events, checkId, series, serieses, tags } = require('../resolvers/Query')

// Queries for user

describe('User', () => {
    it('user query is there', async () => {
        const server = MyServer
        const query = `
            {
                user(where: {id: "123" } ) {
                    firstName
                    lastName
                }
            }
        `

        await expect(server.query(query)).resolves.toBeTruthy()

        const { errors } = await server.query(query)
        expect(errors).not.toBeTruthy()
    })
    it('should throw an error if where argument is not provided', async () => {
        const dummyUser = { firstName: "Bob" }
        jest.spyOn(mockContext.prisma, 'user').mockImplementation(async () => { return false })
        await expect(user(undefined, undefined, mockContext, undefined)).rejects.toThrow("Cannot read property 'where' of undefined")
    })
    it('should return the user from the Prisma Client', async () => {
        const args = { where: { id: "123" } }
        const dummyUser = { firstName: 'Bob' }
        jest.spyOn(mockContext.prisma, 'user').mockImplementation(async () => { return dummyUser })
        const returnedUser = await user(undefined, args, mockContext, undefined)
        expect(returnedUser).toEqual(dummyUser)
        expect(mockContext.prisma.user).toHaveBeenCalledWith(expect.objectContaining({
            id: '123'
        }))
        expect(mockContext.prisma.user).toHaveBeenCalledTimes(1)
        expect(dummyUser.firstName).toBe('Bob')
    })

})
// Queries for User 
describe('Users', () => {
    it('users query is there', async () => {
        const server = MyServer
        const query = `
            {
                users {
                    firstName
                    lastName
                }
            }
        `
        await expect(server.query(query)).resolves.toBeTruthy()
        const { errors } = await server.query(query)
        expect(errors).not.toBeTruthy()
    })
    it('should return an array of users from Primsa Client', async () => {
        const dummyUsers = [{ firstName: "Bob" }, { firstName: 'Sally' }]
        jest.spyOn(mockContext.prisma, 'users').mockImplementation(async () => { return dummyUsers })
        const usersArr = await users(undefined, undefined, mockContext, undefined)
        expect(usersArr).toEqual(dummyUsers)
        expect(mockContext.prisma.users).toHaveBeenCalledTimes(1)
        expect(dummyUsers[0].firstName).toBe('Bob')
        expect(dummyUsers[1].firstName).toBe('Sally')
    })
})
// Queries for Events
describe('Events', () => {
    it('events query is there', async () => {
        const server = MyServer
        const query = `
            {
                events {
                    title
                    description
                }
            }
        `
        await expect(server.query(query)).resolves.toBeTruthy()
        const { errors } = await server.query(query)
        expect(errors).not.toBeTruthy()
    })
    it('should return an array of events from Prisma Client', async () => {
        const args = { searchFilters: {} }
        const dummyEvents = [{ title: "Title" }, { title: "New Title" }]
        jest.spyOn(mockContext.prisma, 'events').mockImplementation(async () => { return dummyEvents })
        const eventsArr = await events(undefined, args, mockContext, undefined)
        expect(mockContext.prisma.events).toHaveBeenCalledTimes(1)
        expect(eventsArr).toEqual(dummyEvents)
        expect(dummyEvents[0].title).toBe('Title')
        expect(dummyEvents[1].title).toBe('New Title')

    })
    it('should return a single event by id', async () => {
        const args = { where: { id: "123" } }
        const dummyEvent = { title: 'Event Title' }
        jest.spyOn(mockContext.prisma, 'events').mockImplementation(async () => { return dummyEvent })
        const returnedEvent = await events(undefined, args, mockContext, undefined)
        expect(returnedEvent).toEqual(dummyEvent)
        expect(mockContext.prisma.events).toHaveBeenCalledWith(expect.objectContaining({
            where: { AND: [{ id: "123" }] }
        }))
        expect(mockContext.prisma.events).not.toHaveBeenCalledTimes(0)
        expect(dummyEvent.title).toBe('Event Title')
    })
})
// Queries for User's OktaID
describe('CheckID', () => {
    it('checkId query is there', async () => {
        const server = MyServer
        const query = `
            {
                checkId(data: {oktaId: "123"}) {
                    firstName
                    lastName
                }
            }
        `
        await expect(server.query(query)).resolves.toBeTruthy()
        const { errors } = await server.query(query)
        expect(errors).toBeTruthy()
    })
    it('should check the okta id of user', async () => {
        const args = { data: { oktaId: "123" } }
        const user = await mockContext.prisma.users(args)
        jest.spyOn(mockContext.prisma, 'checkId').mockImplementation(async () => { return user })
        const verifiedUser = await checkId(undefined, args, mockContext, undefined)
        expect(verifiedUser).toEqual(user)

    })
})
// Queries for tags
describe('Tags', () => {
    it('tags query is there', async () => {
        const server = MyServer
        const query = `
            {
                tags {
                    id
                    title
                }
            }
        `;
        await expect(server.query(query)).resolves.toBeTruthy()
        const { errors } = await server.query(query)
        expect(errors).not.toBeTruthy()
    })
    it('should return an array of tags', async () => {
        const dummyTags = [{ title: "free" }, { title: "beer" }]
        jest.spyOn(mockContext.prisma, 'tags').mockImplementation(async () => { return dummyTags })
        const tagsArr = await tags(undefined, undefined, mockContext, undefined)
        expect(mockContext.prisma.tags).toHaveBeenCalledTimes(1)
        expect(tagsArr).not.toHaveLength(0)
        expect(tagsArr).toHaveLength(2)
        expect(tagsArr).toEqual(dummyTags)
        expect(tagsArr[0].title).toBe("free")
        expect(tagsArr[1].title).not.toBe('gold coins')
        expect(tagsArr[1].title).toBe('beer')

    })
    it('fetches a tag by id', async () => {
        const args = { where: { id: "123" } }
        const dummyTag = { id: "123", title: "beer" }
        jest.spyOn(mockContext.prisma, 'tags').mockImplementation(async () => { return dummyTag })
        const returnedTag = await tags(undefined, args, mockContext, undefined)
        expect(mockContext.prisma.tags).toHaveBeenCalledTimes(2)
        expect(returnedTag.id).toEqual(dummyTag.id)
        expect(returnedTag.title).toBe('beer')
        expect(returnedTag.title).not.toBe('giraffe')
    })
})


// Queries for single series
describe('Series', () => {
    it('series query is there', async () => {
        const server = MyServer
        const query = `
            {
                series(where: { id: "123"}) {
                    id
                    frequency  
                }
            }
        `
        await expect(server.query(query)).resolves.toBeTruthy()
        const { errors } = await server.query(query)
        expect(errors).not.toBeTruthy()
    })
    it('should throw an error if where argument is not provided', async () => {
        jest.spyOn(mockContext.prisma, 'series').mockImplementation(async () => { return false })
        await expect(series(undefined, undefined, mockContext, undefined)).rejects.toThrow("Cannot read property 'where' of undefined")
    })
    it('should return the series from the Prisma Client', async () => {
        const args = { where: { id: "123" } }
        const dummySeries = { frequency: 'WEEKLY' }
        jest.spyOn(mockContext.prisma, 'series').mockImplementation(async () => { return dummySeries })
        const returnedSeries = await series(undefined, args, mockContext, undefined)
        expect(returnedSeries).toEqual(dummySeries)
        expect(mockContext.prisma.series).toHaveBeenCalledWith(expect.objectContaining({
            id: '123',
        }))
        expect(mockContext.prisma.series).toHaveBeenCalledTimes(1)
        expect(dummySeries.frequency).toBe('WEEKLY')
    })
    it('should return an array of events connected to it', async () => {
        const args = { where: { id: "123" } }
        const dummySeries = {
            events:
                [
                    { title: "Title One", id: "234" },
                    { title: "Title Two", id: "345" }
                ]
        }
        jest.spyOn(mockContext.prisma, 'series').mockImplementation(async () => { return dummySeries })
        const eventsArr = await series(undefined, args, mockContext, undefined)
        expect(eventsArr).toEqual(dummySeries)
        expect(mockContext.prisma.series).not.toHaveBeenCalledTimes(0)
        expect(dummySeries.events[0].title).toBe('Title One')
        expect(dummySeries.events[1].title).toBe('Title Two')
        expect(dummySeries.events[0].title).not.toBe('Something Else')
    })
})
// Queries for all series
describe('Serieses', () => {
    it('Serieses query is there', async () => {
        const server = MyServer
        const query = `
            {
                serieses {
                    id
                    events {
                        id
                    }
                }
            }
        `
        await expect(server.query(query)).resolves.toBeTruthy()
        const { errors } = await server.query(query)
        expect(errors).not.toBeTruthy()
    })
    it('should return an array of series from Prisma Client', async () => {
        const dummySeries = [{ id: "123" }, { id: "234" }]
        jest.spyOn(mockContext.prisma, 'serieses').mockImplementation(async () => { return dummySeries })
        const seriesArr = await serieses(undefined, undefined, mockContext, undefined)
        expect(seriesArr).toEqual(dummySeries)
    })
    it('should return an array of events in each series', async () => {
        const dummySeries = [
            {
                id: "123",
                events: [
                    { title: "Title One" },
                    { title: "Title Two" },
                    { title: "Title Five" }
                ]
            },
            {
                id: "234",
                events: [
                    { title: "Title Three" },
                    { title: "Title Four" }
                ]
            }
        ]
        jest.spyOn(mockContext.prisma, 'serieses').mockImplementation(async () => { return dummySeries })
        const seriesArr = await serieses(undefined, undefined, mockContext, undefined)
        expect(seriesArr).toEqual(dummySeries)
        expect(mockContext.prisma.serieses).not.toHaveBeenCalledTimes(0)
        expect(dummySeries[0].events[0].title).toBe('Title One')
        expect(dummySeries[0].events[0].title).not.toBe('Title')
        expect(dummySeries[0].events).toHaveLength(3)
        expect(dummySeries[1].events).toHaveLength(2)
    })
})
