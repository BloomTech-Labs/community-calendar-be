const distance = require('@turf/distance').default;
const {point} = require('@turf/helpers');
const circle = require('@turf/circle').default;
const transformRotate = require('@turf/transform-rotate').default;
const inPolygon = require('@turf/boolean-point-in-polygon').default;
const natural = require('natural');
// natural.PorterStemmer.attach();

const {
  convertTags,
  tagsToRemove,
  convertImages,
  imagesToRemove,
  cloudinaryImage,
} = require('./helpers');

const resolvers = {
  //prisma bindings, otherwise fields would be null in queries/mutations
  Event: {
    creator: (parent, args, {prisma}) =>
      prisma.event({id: parent.id}).creator(),
    eventImages: (parent, args, {prisma}) =>
      prisma.event({id: parent.id}).eventImages(),
    rsvps: (parent, args, {prisma}) => prisma.event({id: parent.id}).rsvps(),
    urls: (parent, args, {prisma}) => prisma.event({id: parent.id}).urls(),
    admins: (parent, args, {prisma}) => prisma.event({id: parent.id}).admins(),
    locations: async (
      parent,
      {userLatitude, userLongitude, distanceUnit = 'miles', ...args},
      {prisma},
    ) => {
      // find the locations for the current event
      const eventLocations = await prisma.event({id: parent.id}).locations();

      //if userLatitude and userLongitude are passed as arguments for location
      if (userLatitude && userLongitude) {
        eventLocations.forEach(location => {
          if (location.latitude && location.longitude) {
            let userLocation = point([userLongitude, userLatitude]);
            let eventLocation = point([location.longitude, location.latitude]);
            let options = {units: distanceUnit}; //default miles

            // calculate and add distanceFromUser property to each location object
            location.distanceFromUser = distance(
              userLocation,
              eventLocation,
              options,
            );

            // add distanceUnit to each location object, which will default to miles
            location.distanceUnit = distanceUnit;
          } else {
            location.distanceFromUser = null;
            location.distanceUnit = null;
          }
        });
      }

      return eventLocations;
    },
    tags: (parent, args, {prisma}) => prisma.event({id: parent.id}).tags(),
  },
  User: {
    rsvps: (parent, args, {prisma}) => prisma.user({id: parent.id}).rsvps(),
    createdImages: (parent, args, {prisma}) =>
      prisma.user({id: parent.id}).createdImages(),
  },
  Tag: {
    events: (parent, args, {prisma}) => prisma.tag({id: parent.id}).events(),
  },
  Query: {
    users: async (root, args, {prisma, req, decodedToken}, info) => {
      try {
        //const decoded = await decodedToken(req); //requires token to be sent in authorization headers
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
        data: {auth0Id},
      } = args;
      try {
        const user = await prisma.users({
          where: {
            auth0Id,
          },
        });
        return user;
      } catch (err) {
        throw err;
      }
    },

    events: async (
      root,
      {
        searchFilters = {},
        ...args
      },
      {prisma, req, decodedToken},
      info,
    ) => {
      const searchArray = [];

      const {
        dateRangeSearch,
        indexSearch,
        ticketPriceSearch,
        locationSearch,
        tagsSearch,
      } = searchFilters;

      //filter events in between start and end date
      if (dateRangeSearch) {
        const {start, end} = dateRangeSearch;
        searchArray.push({
          OR: [
            {AND: [{start_lte: start}, {end_gte: end}]},
            {AND: [{start_gte: start}, {end_lte: end}]},
            {
              AND: [
                {AND: [{start_gte: start}, {start_lte: end}]},
                {end_gte: end},
              ],
            },
            {
              AND: [
                {start_lte: start},
                {AND: [{end_lte: end}, {end_gte: start}]},
              ],
            },
          ],
        });
      }

      if (ticketPriceSearch) {
        const [result] =
          ticketPriceSearch.map(({minPrice, maxPrice}) =>
            minPrice !== undefined && maxPrice !== undefined
              ? {
                  AND: [
                    {ticketPrice_gte: minPrice},
                    {ticketPrice_lte: maxPrice},
                  ],
                }
              : maxPrice !== undefined
              ? {ticketPrice_lte: maxPrice}
              : {ticketPrice_gte: minPrice},
          );
          searchArray.push(result);
      }

      if (indexSearch) {
        searchArray.push({
          OR: Array.from(
            new Set(natural.LancasterStemmer.tokenizeAndStem(indexSearch)),
          ).map(token => ({index_contains: ',' + token + ','})),
        });
      }

      if (tagsSearch) {
        searchArray.push({tags_some: {title_in: tagsSearch}});
      }

      if (locationSearch) {
        const {userLatitude, userLongitude, radius} = locationSearch;
        const center = [parseFloat(userLongitude), parseFloat(userLatitude)];
        //calculate coordinates using calculated diagonal from radius
        //rSC is rotated square coordinates
        const {
          geometry: {
            coordinates: [rSC],
          },
        } = transformRotate(
          circle(center, Math.ceil(Math.sqrt(2) * radius), {
            steps: 4,
            units: 'miles',
          }),
          45,
        );

        //square min/max longitude/latitude values
        const sMinLongitude = Math.min(
          ...[rSC[0][0], rSC[1][0], rSC[2][0], rSC[3][0]],
        );
        const sMaxLongitude = Math.max(
          ...[rSC[0][0], rSC[1][0], rSC[2][0], rSC[3][0]],
        );
        const sMinLatitude = Math.min(
          ...[rSC[0][1], rSC[1][1], rSC[2][1], rSC[3][1]],
        );
        const sMaxLatitude = Math.max(
          ...[rSC[0][1], rSC[1][1], rSC[2][1], rSC[3][1]],
        );

        const eventsLocationsFragment = `
          fragment eventsWithLocations on Event {
            id
            locations {
              latitude
              longitude
            }
          }
        `;
        const whereArgs = args.where ? [...searchArray, args.where] : [...searchArray];
        
        const eventsInSquare = await prisma
          .events({
            ...args,
            where: {
              AND: [
                ...whereArgs,
                {
                  locations_every: {
                    AND: [
                      {
                        AND: [
                          {longitude_gte: sMinLongitude},
                          {longitude_lte: sMaxLongitude},
                        ],
                      },
                      {
                        AND: [
                          {latitude_gte: sMinLatitude},
                          {latitude_lte: sMaxLatitude},
                        ],
                      },
                    ],
                  },
                },
              ],
            },
          })
          .$fragment(eventsLocationsFragment);
        const userCircle = circle(center, radius, {steps: 10, units: 'miles'});
        return prisma.events({
          where: {
            id_in: eventsInSquare
              .filter(event => inPolygon(center, userCircle))
              .map(event => event.id),
          },
        });
      } else {
        const whereArgs = args.where ? [...searchArray, args.where] : [...searchArray];
        console.log(whereArgs);
        return prisma.events({
          ...args,
          where: {AND: whereArgs},
        });
      }
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
      const {data, images} = args;
      
      try {
        const decoded = await decodedToken(req); //requires token to be sent in authorization headers
        const tagsInDb = await prisma.tags(); //array of tag objects from the database
        const imagesInDb = await prisma.eventImages(); //array of image objects from the database

        if (data.tags) {
          //convert tags array to match prisma schema
          data.tags = convertTags(data.tags, tagsInDb);
        }

        if (images && images.length) {
          //upload images to cloudinary and get secured image urls
          const promises = args.images.map(file => file.then(cloudinaryImage));
          const urls = await Promise.all(promises);
          const newImages = urls.map(url => ({url}));
          data.eventImages =
            data.eventImages && data.eventImages.length
              ? [...data.eventImages, ...newImages]
              : newImages;
        }

        //convert images array to match prisma schema and add user as the image creator
        if (data.eventImages) {
          data.eventImages = convertImages(
            data.eventImages,
            imagesInDb,
            decoded['http://cc_id'],
          );
        }

        //set user as event creator
        data['creator'] = {connect: {id: decoded['http://cc_id']}};
        data['index'] = ',' + Array.from(new Set(natural.LancasterStemmer.tokenizeAndStem(data['title'] + ' ' + data['description']))).join(',') + ',';
        return await prisma.createEvent(data);
      } catch (err) {
        throw err;
      }
    },
    updateEvent: async (root, args, {prisma, req, decodedToken}, info) => {
      const {data, where, images} = args;
      let eventImages = data.eventImages;
      data.eventImages = {};
      try {
        const eventCreatorFragment = `
          fragment eventWithCreator on Event {
            title
            description
            creator {
              id
            }
          }
        `;
        const {creator, title, description} = await prisma.event({where}).$fragment(eventCreatorFragment);
        const decoded = await decodedToken(req); //requires token to be sent in authorization headers
        let forStemmer = '';

        if(data.title && data.description){
          forStemmer += data.title + ' ' + data.description;
        }else if(data.title || data.description){
          if(data.title){
            forStemmer += data.title + ' ' + description;
          }else{
            forStemmer += title + ' ' + data.description;
          }
        }

        if(forStemmer.length){
          data['index'] = ',' + Array.from(new Set(natural.LancasterStemmer.tokenizeAndStem(data['title'] + ' ' + data['description']))).join(',') + ',';
        }

        //check if user created the event
        if (decoded['http://cc_id'] === creator.id) {
          //check if logged in user created the event
          const tagsInDb = await prisma.tags(); //array of tags objects from the database
          const tags = await prisma.event({id: where.id}).tags();
          const imagesInDb = await prisma.event({id: where.id}).eventImages(); //array of event's image objects from the database

          //determine which tags to remove/connect/disconnect and convert tags array to match prisma schema
          if (data.tags && data.tags.length) {
            const disconnect = tags.length && tagsToRemove(tags, data.tags);
            data.tags = convertTags(data.tags, tagsInDb);

            if (disconnect && disconnect.length) {
              data.tags.disconnect = disconnect;
            }
          } else if (data.tags && tags && tags.length) {
            data.tags.disconnect = tags.map(tag => ({id: tag.id}));
          }

          //determine which images to remove/connect/disconnect and convert images array to match prisma schema
          if (eventImages && eventImages.length && imagesInDb.length) {
            const disconnect = imagesToRemove(imagesInDb, eventImages);
            if (disconnect.length) {
              data.eventImages.disconnect = disconnect;
            }
          } else if (eventImages && imagesInDb.length) {
            data.eventImages.disconnect = imagesInDb.map(image => ({
              id: image.id,
            }));
          }

          //upload image files to cloudinary and get secured urls
          if (images && images.length) {
            const promises = args.images.map(file =>
              file.then(cloudinaryImage),
            );
            const urls = await Promise.all(promises);
            const newImages = urls.map(url => ({url}));
            eventImages =
              eventImages && eventImages.length
                ? [...eventImages, ...newImages]
                : newImages;
          }

          if (eventImages) {
            data.eventImages = {
              disconnect: data.eventImages.disconnect,
              //convert images to match prisma schema
              ...convertImages(
                eventImages,
                imagesInDb,
                decoded['http://cc_id'],
              ),
            };
          }
          //converts tags array to an object
          data.tags = {...data.tags};
          return await prisma.updateEvent({where, data});
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
        //check if logged in user created the event
        if (decoded['http://cc_id'] === creator.id) {
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
        //connects the event to the user. rsvps will also show when querying event
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
        //removes event connection from user
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
