const {decodedToken} = require('../auth/authenticate');

const resolvers = {
  Event: {
    creator: (parent, args, {prisma}) =>
      prisma.event({id: parent.id}).creator(),
  },
  Query: {
    users: async (root, args, {prisma, req}, info) => {
      try {
        const decoded = await decodedToken(req);
        return prisma.users();
      } catch (err) {
        throw err;
      }
    },
    checkId: async (root, args, {prisma}, info) => {
      const {
        data: {auth0_id},
      } = args;
      try {
        const user = await prisma.users({
          where: {
            auth0_id: auth0_id,
          },
        });
        return user;
      } catch (err) {
        throw err;
      }
    },
    events: async (root, args, {prisma}, info) => {
      return await prisma.events();
    },
  },

  Mutation: {
    addUser: async (root, args, {prisma}, info) => {
      const {
        data: {auth0_id},
      } = args;
      const user = await prisma.createUser({
        auth0_id,
      });
      return user;
    },
    addEvent: async (root, args, {prisma, req}, info) => {
      const {data} = args;
      try {
        const decoded = await decodedToken(req);
        data['creator'] = {connect: {id: decoded['http://cc_id']}};
        return await prisma.createEvent(data);
      } catch (err) {
        throw err;
      }
    },
    updateEvent: async (root, args, {prisma, req}, info) => {
      const {data, where} = args;
      try {
        const [{creator}] = await prisma.events({where}).creator();
        const decoded = await decodedToken(req);
        if (decoded['http://cc_id'] === creator.id) {
          return await prisma.updateEvent(where, data);
        } else {
          throw 'You do not have permission to update this event.';
        }
      } catch (err) {
        throw err;
      }
    },
    deleteEvent: async (root, args, {prisma, req}, info) => {
      const {where} = args;
      console.log(where);
      try {
        const [{creator}] = await prisma.events({where}).creator();
        const decoded = await decodedToken(req);
        if (decoded['http://cc_id'] === creator.id) {
          return await prisma.deleteEvent(where);
        } else {
          throw 'You do not have permission to delete this event.';
        }
      } catch (err) {
        throw err;
      }
    },
  },
};

module.exports = resolvers;
