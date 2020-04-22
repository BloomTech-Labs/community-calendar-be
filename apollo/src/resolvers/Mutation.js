// @ts-check
'use strict'

const natural = require('natural'); 


const {
  cloudinaryImage, 
  convertTags, 
  convertImages, 
  tagsToRemove, 
  imagesToRemove
} = require('./helpers');


module.exports.createUser = (_parent, args, { prisma }) => {
  console.log('createUser.args: %j', args)
  const { data } = args 
  data.profileImage =
      data.profileImage ||
      'https://res.cloudinary.com/communitycalendar/image/upload/c_scale,w_70/v1580068501/C_ncfz11.svg'
  const user = prisma.createUser(data)

  return user
}

module.exports.updateUser = async (_, args, { prisma, req, decodedToken }) => {

    const decoded = await decodedToken(req);
    const { data, image } = args 
    if (image) {
      const imageUrl = await image.then(cloudinaryImage);
      data.profileImage = imageUrl 
    }

    const user = await prisma.updateUser({
      data, 
      where: { id: decoded['http://cc_id']}
    })
    return user
}
module.exports.createEvent = async (_, args, { prisma, req, decodedToken }) => {
  const { data, images } = args 
  console.log("DecodedToken", decodedToken)
    const decoded = await decodedToken(req);
    const tagsInDb = await prisma.tags()
    const imagesInDb = await prisma.eventImages();

    if(data.tags) {
      data.tags = convertTags(data.tags, tagsInDb)
    }

    if(images && images.length) {
      const promises = args.images.map(file => file.then(cloudinaryImage));
      const urls = await Promise.all(promises);
      const newImages = urls.map(url => ({ url }));
      data.eventImages = data.eventImages && data.eventImages.length
      ? [...data.eventImages, ...newImages]
      : newImages; 
    }

    if (data.eventImages) {
      data.eventImages = convertImages(
        data.eventImages, imagesInDb, decoded['http://cc_id']
      );
    }

    data['creator'] = {connect: { id: decoded['http://cc_id']}};
    data['index'] = ',' + Array.from(
      new Set(natural.LancasterStemmer.tokenizeAndStem(data['title'] + ' ' + data['description'],
      ), 
      ),
    ).join(',') + 
    ',';
    return await prisma.createEvent(data);
  
}

module.exports.updateEvent = async(_, args, { prisma, req, decodedToken }) => {
  const { data, where, images} = args; 
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
    const decoded = await decodedToken(req); 

    if(decoded['http://cc_id'] === creator.id ) {
      let forStemmer = '';

      if(data.title && data.description) {
        forStemmer += data.title + ' ' + data.description;
      } else if(data.title || data.description) {
        if(data.title) {
          forStemmer += data.title + ' ' + description;
        } else {
          forStemmer += title + ' ' + data.description; 
        }
      }
      if(forStemmer.length) {
        data['index'] = 
        ',' +
        Array.from(
          new Set(
            natural.LancasterStemmer.tokenizeAndStem(
              data['title'] + ' ' + data['description'],
            ),
          ),
        ).join(',') +
        ',';
      }

      const tagsInDb = await prisma.tags();
      const tags = await prisma.event({ id: where.id }).tags();
      const imagesInDb = await prisma.event({ id: where.id }).eventImages();

      if(data.tags && data.tags.length) {
        const disconnect = tags.length && tagsToRemove(tags, data.tags);
        data.tags = convertTags(data.tags, tagsInDb);

        if(disconnect && disconnect.length) {
          data.tags.disconnect = disconnect; 
        }
      } else if (data.tags && tags && tags.length) {
        data.tags.disconnect = tags.map(tag => ({ id: tag.id}));
      }

      if (eventImages && eventImages.length && imagesInDb.length) {
        const disconnect = imagesToRemove(imagesInDb, eventImages);
        if(disconnect.length) {
          data.eventImages.disconnect = disconnect
        }
      } else if(eventImages && imagesInDb.length) {
        data.eventImages.disconnect = imagesInDb.map(image => ({ id: image.id }));
      }
      if(images && images.length) {
        const promises = args.images.map(file => file.then(cloudinaryImage));
        const urls = await Promise.all(promises);
        const newImages = urls.map(url => ({ url }));
        eventImages = 
          eventImages && eventImages.length
            ? [...eventImages, ...newImages]
            : newImages;
      }

      if(eventImages) {
        data.eventImages = {
          disconnect: data.eventImages.disconnect, 
          ...convertImages(
            eventImages, 
            imagesInDb, 
            decoded['http://cc_id']
          ),
        };
      }
      data.tags = { ...data.tags };
      return await prisma.updateEvent({ where, data });
    } else {
      throw 'You do not have permission to update this event.';
    }
  } catch(err) {
    console.log(err);
    throw err; 
  }
}
module.exports.deleteEvent = async(_, args, { prisma, req, decodedToken }) => {
  const { where } = args; 
  try {
    const [{ creator }] = await prisma.events({ where }).creator();
    const decoded = await decodedToken(req);

    if(decoded['http://cc_id'] === creator.id) {
      return await prisma.deleteEvent(where);
    } else {
      throw 'You do not have permission to delete this event.';
    }
  } catch(err) {
    throw err; 
  }
}
module.exports.rsvpEvent = async(_, args, { prisma, req, decodedToken }) => {
  try {
    const decoded = await decodedToken(req);
    const {
      event: { id }, 
    } = args 

    const getRsvpFragment = `
      fragment getRsvpUser on Event {
        rsvps(where: { id: "${decoded['http://cc_id']}"}){ id }
      }
    `;
    const { rsvps } = await prisma.event({ id }).$fragment(getRsvpFragment);

    const action = rsvps.length ? { disconnect: { id }} : { connect: { id }};

    const userRsvpFragment = `
      fragment getUserEventRsvp on User {
        rsvps(where: { id: "${ id }"}){ id }
      }
    `;

    const { rsvps: userRsvp } = await prisma
      .updateUser({
        where: { id: decoded['http://cc_id']},
        data: { rsvps: action }, 
      })
      .$fragment(userRsvpFragment);

    return !!userRsvp.length; 
  } catch(err) {
    throw err; 
  }
}
module.exports.saveEvent = async(_, args, { prisma, req, decodedToken }) => {
  try {
    const decoded = await decodedToken(req);
    const {
      event: { id },
    } = args; 

    const getSavedFragment = `
      fragment getSavedUser on Event {
        saved(where: { id: "${decoded['http://cc_id']}"}){ id }
      }
    `;
    const { saved } = await prisma.event({ id }).$fragment(getSavedFragment);

    const action = saved.length ? { disconnect: { id }} : { connect: { id }};

    const useerSavedFragment = `
      fragment getUserEvent on User {
        saved(where: { id: ${id}"}){ id }
      }
    `;
    const { saved: userSaved } = await prisma 
      .updateUser({
        where: { id: decoded['http://cc_id']}, 
        data: { saved: action }, 
      })
      .$fragment(useerSavedFragment);

    return !!userSaved.length; 
  } catch (err) {
    throw err 
  }
}
