// @ts-check
'use strict';

const natural = require('natural');

const {
  cloudinaryImage,
  convertTags,
  convertImages,
  tagsToRemove,
  imagesToRemove,
} = require('./helpers');

const Mutation = {
  addUser: async (_parent, args, { prisma }) => {
    const { data } = args;
    data.profileImage =
      data.profileImage ||
      'https://res.cloudinary.com/communitycalendar/image/upload/c_scale,w_70/v1580068501/C_ncfz11.svg';
    const user = await prisma.createUser(data);

    return user;
  },
  updateUser: async (_, args, { prisma, user }) => {
    const { data, image } = args;

    if (image) {
      // upload image to cloudinary and get secured image url
      const imageUrl = await image.then(cloudinaryImage);

      data.profileImage = imageUrl;
    }

    const updateUser = await prisma.updateUser({
      data,
      where: { id: user.id },
    });
    return updateUser;
  },

  addEvent: async (_, args, context) => {
    const { prisma, user } = context;

    const tagsInDb = await prisma.tags();
    const imagesInDb = await prisma.eventImages();

    if (args.data.tags) {
      args.data.tags = convertTags(args.data.tags, tagsInDb);
    }

    if (args.images && args.images.length) {
      const promises = args.images.map((file) => file.then(cloudinaryImage));
      const urls = await Promise.all(promises);
      const newImages = urls.map((url) => ({ url }));
      args.data.eventImages =
        args.data.eventImages && args.data.eventImages.length
          ? [...args.data.eventImages, ...newImages]
          : newImages;
    }

    if (args.data.eventImages) {
      args.data.eventImages = convertImages(
        args.data.eventImages,
        imagesInDb,
        context.user.id,
      );
    }
    if (user === 'null') {
      throw new Error('Not Authenticated');
    } else {
      args.data.creator = { connect: { id: user.id } };
    }

    args.data.index =
      ',' +
      Array.from(
        new Set(
          natural.LancasterStemmer.tokenizeAndStem(
            args.data.title + ' ' + args.data.description,
          ),
        ),
      ).join(',') +
      ',';
    return await prisma.createEvent(args.data);
  },
  updateEvent: async (_, args, { prisma, user }) => {
    if (!user.id) {
      throw new Error('Not authenticated');
    }
    const { data, where } = args;

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
      const { creator, title, description } = await prisma
        .event(where)
        .$fragment(eventCreatorFragment);

      if (user.id === creator.id) {
        let forStemmer = '';

        if (data.title && data.description) {
          forStemmer += data.title + ' ' + data.description;
        } else if (data.title || data.description) {
          if (data.title) {
            forStemmer += data.title + ' ' + description;
          } else {
            forStemmer += title + ' ' + data.description;
          }
        }
        if (forStemmer.length) {
          data.index =
            ',' +
            Array.from(
              new Set(
                natural.LancasterStemmer.tokenizeAndStem(
                  data.title + ' ' + data.description,
                ),
              ),
            ).join(',') +
            ',';
        }

        const tagsInDb = await prisma.tags();
        const tags = await prisma.event({ id: where.id }).tags();
        const imagesInDb = await prisma.event({ id: where.id }).eventImages();

        if (data.tags && data.tags.length) {
          const disconnect = tags.length && tagsToRemove(tags, data.tags);
          data.tags = convertTags(data.tags, tagsInDb);

          if (disconnect && disconnect.length) {
            data.tags.disconnect = disconnect;
          }
        } else if (data.tags && tags && tags.length) {
          data.tags.disconnect = tags.map((tag) => ({ id: tag.id }));
        }

        if (eventImages && eventImages.length && imagesInDb.length) {
          const disconnect = imagesToRemove(imagesInDb, eventImages);
          if (disconnect.length) {
            data.eventImages.disconnect = disconnect;
          }
        } else if (eventImages && imagesInDb.length) {
          data.eventImages.disconnect = imagesInDb.map((image) => ({
            id: image.id,
          }));
        }
        if (args.images && args.images.length) {
          const promises = args.images.map((file) =>
            file.then(cloudinaryImage),
          );
          const urls = await Promise.all(promises);
          const newImages = urls.map((url) => ({ url }));
          eventImages =
            eventImages && eventImages.length
              ? [...eventImages, ...newImages]
              : newImages;
        }

        if (eventImages) {
          data.eventImages = {
            disconnect: data.eventImages.disconnect,
            ...convertImages(eventImages, imagesInDb, user.id),
          };
        }
        data.tags = { ...data.tags };
        return await prisma.updateEvent({ where, data });
      } else {
        throw new Error('You do not have permission to update this event.');
      }
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
  deleteEvent: async (_, args, { prisma, user }) => {
    const { where } = args;

    const [{ creator }] = await prisma.events({ where }).creator();

    if (typeof user.id !== 'string' || user === 'null') {
      throw new Error('Not Authenticated');
    } else if (user.id !== creator.id) {
      throw new Error('You do not have permission to delete this event');
    } else {
      return await prisma.deleteEvent(where);
    }
  },
  rsvpEvent: async (_, args, { prisma, user }) => {
    const {
      event: { id },
    } = args;
    if (user === 'null') {
      throw new Error('Not authenticated');
    } else {
      const getRsvpFragment = `
      fragment getRsvpUser on Event {
        rsvps(where: { id: "${user.id}"}){ id }
      }
    `;
      const { rsvps } = await prisma.event({ id }).$fragment(getRsvpFragment);

      const action = rsvps.length ? { disconnect: { id } } : { connect: { id } };

      const userRsvpFragment = `
      fragment getUserEventRsvp on User {
        rsvps(where: { id: "${id}"}){ id }
      }
    `;

      const { rsvps: userRsvp } = await prisma
        .updateUser({
          where: { id: user.id },
          data: { rsvps: action },
        })
        .$fragment(userRsvpFragment);
      return !!userRsvp.length;
    }
  },
  saveEvent: async (_, args, { prisma, user }) => {
    const {
      event: { id },
    } = args;

    const getSavedFragment = `
      fragment getSavedUser on Event {
        saved(where: { id: "${user.id}"}){ id }
      }
    `;
    const { saved } = await prisma.event({ id }).$fragment(getSavedFragment);

    const action = saved.length ? { disconnect: { id } } : { connect: { id } };

    const userSavedFragment = `
      fragment getUserEvent on User {
        saved(where: { id: "${id}"}){ id }
      }
    `;
    const { saved: userSaved } = await prisma
      .updateUser({
        where: { id: user.id },
        data: { saved: action },
      })
      .$fragment(userSavedFragment);

    return !!userSaved.length;
  },
  createSeries: async (_, args, { prisma }) => {
    const { data } = args
    if (args.data.events && args.data.events.length) {
      args.data.events.connect = args.data.events
    }
    const newSeries = await prisma
      .createSeries(data)
    return newSeries
  },
  deleteSeries: async (_, args, { prisma }) => {
    const { where } = args
    return await prisma.deleteSeries(where)
  },
  updateSeries: async (_, args, { prisma }) => {
    const { where, data } = args
    return await prisma.updateSeries({
      where: where,
      data: data
    })
  }
};


module.exports = Mutation;
