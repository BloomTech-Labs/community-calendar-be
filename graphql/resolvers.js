const distance = require('@turf/distance').default;
const { point } = require('@turf/helpers');

const {convertTags, tagsToRemove} = require('./helpers');

const resolvers = {
  //prisma bindings, otherwise fields would be null in queries/mutations
  Event: {
    creator: (parent, args, {prisma}) =>
      prisma.event({id: parent.id}).creator(),
    event_images: (parent, args, {prisma}) =>
      prisma.event({id: parent.id}).event_images(),
    rsvps: (parent, args, {prisma}) => prisma.event({id: parent.id}).rsvps(),
    urls: (parent, args, {prisma}) => prisma.event({id: parent.id}).urls(),
    admins: (parent, args, {prisma}) => prisma.event({id: parent.id}).admins(),
    locations: async (parent, {userLatitude, userLongitude, distanceUnit = "miles", ...args}, {prisma}) => {
      // find the locations for the current event
      const location = await prisma.event({id: parent.id}).locations();
      if (userLatitude && userLongitude) {
        let userLocation = point([userLatitude, userLongitude]);
        let eventLocation = point([location[0].latitude, location[0].longitude])
        let options = { units: distanceUnit };
        
        // calculate and add distanceFromUser property to each location object
        location[0].distanceFromUser = distance(userLocation, eventLocation, options);

        // add distanceUnit to each location object, which will default to miles
        location[0].distanceUnit = distanceUnit;
 
          } 
      return location
    },
    tags: (parent, args, {prisma}) => prisma.event({id: parent.id}).tags(),
  },
  User: {
    rsvps: (parent, args, {prisma}) => prisma.user({id: parent.id}).rsvps(),
  },
  Tag: {
    events: (parent, args, {prisma}) => prisma.tag({id: parent.id}).events(),
  },
  Query: {
    users: async (root, args, {prisma, req, decodedToken}, info) => {
      try {
        const decoded = await decodedToken(req); //requires token to be sent in authorization headers
        return prisma.users({...args});
      } catch (err) {
        throw err;
      }
    },
    tags: async (root, args, {prisma}, info) => {
      try {
        return prisma.tags({...args});
      } catch (err) {
        throw err;
      }
    },
    //check if auth0 id is in the database
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

    events: async (root, args, {prisma, req}, info) => {
      return await prisma.events({...args})
    },

    ticketMasterEvents: async (root, args, {dataSources}) => {
      return await dataSources.ticketMasterAPI.getEvents({...args});
    },
    ticketMasterEventsAlt: async (root, args, {dataSources}) => {
      return await dataSources.ticketMasterAPI.getEventsAlt({...args});
    },
  },

  Mutation: {
    addUser: async (root, args, {prisma}, info) => {
      try {
        const {data} = args;
        const user = await prisma.createUser(data);
        return user;
      } catch (err) {
        throw err;
      }
    },

    addEvent: async (root, args, {prisma, req, decodedToken}, info) => {
      const {data} = args;
      try {
        const decoded = await decodedToken(req); //requires token to be sent in authorization headers
        const tagsInDb = await prisma.tags(); //array of tags objects from the database
        if (data.tags) {
          data.tags = convertTags(data.tags, tagsInDb);
        }

        // data['creator'] = {connect: {id: decoded['http://cc_id']}};
        data['creator'] = {connect: {id: 'ck54gh4m9000y0758k2u3qgow'}};

        return await prisma.createEvent(data);
      } catch (err) {
        throw err;
      }
    },
    updateEvent: async (root, args, {prisma, req, decodedToken}, info) => {
      const {data, where} = args;
      try {
        const [{creator}] = await prisma.events({where}).creator();
        const decoded = await decodedToken(req); //requires token to be sent in authorization headers

        if (decoded['http://cc_id'] === creator.id) {
          //check if logged in user created the event
          const tagsInDb = await prisma.tags(); //array of tags objects from the database
          const tags = await prisma.event({id: where.id}).tags();

          if (data.tags.length) {
            const disconnect = tagsToRemove(tags, data.tags);
            data.tags = convertTags(data.tags, tagsInDb);

            if (disconnect.length) {
              data.tags.disconnect = disconnect;
            }
          }
          return await prisma.updateEvent(where, data);
        } else {
          throw 'You do not have permission to update this event.';
        }
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
    deleteEvent: async (root, args, {prisma, req, decodedToken}, info) => {
      const {where} = args;
      try {
        const [{creator}] = await prisma.events({where}).creator();
        const decoded = await decodedToken(req); //requires token to be sent in authorization headers
        if (decoded['http://cc_id'] === creator.id) {
          //check if logged in user created the event
          return await prisma.deleteEvent(where);
        } else {
          throw 'You do not have permission to delete this event.';
        }
      } catch (err) {
        throw err;
      }
    },
    addRsvp: async (root, args, {prisma, req, decodedToken}, info) => {
      try {
        const decoded = await decodedToken(req); //requires token to be sent in authorization headers
        const {
          event: {id},
        } = args;
        return prisma.updateUser({
          where: {id: decoded['http://cc_id']},
          data: {rsvps: {connect: {id}}},
        });
      } catch (err) {
        throw err;
      }
    },
    removeRsvp: async (root, args, {prisma, req, decodedToken}, info) => {
      try {
        const decoded = await decodedToken(req);
        const {
          event: {id},
        } = args;
        return prisma.updateUser({
          where: {id: decoded['http://cc_id']},
          data: {rsvps: {disconnect: {id}}},
        });
      } catch (err) {
        throw err;
      }
    },
  },
};

module.exports = resolvers;
