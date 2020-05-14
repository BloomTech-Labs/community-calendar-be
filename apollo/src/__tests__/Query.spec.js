const fs = require('fs')
const { mockServer } = require('graphql-tools')
const mockContext = jest.genMockFromModule('../context')
const mockPrismaClient = jest.genMockFromModule('../generated/prisma-client')
mockPrismaClient.user = jest.fn()
mockPrismaClient.users = jest.fn()
mockPrismaClient.events = jest.fn()
mockPrismaClient.checkId = jest.fn()
mockContext.prisma = mockPrismaClient
const schema = fs.readFileSync('./schema/generated/prisma.graphql', 'utf8')
const generatedPrisma = require('../generated/prisma-client')
const MyServer = mockServer(schema)

const { user, users, events, checkId } = require('../resolvers/Query')

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
})
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
