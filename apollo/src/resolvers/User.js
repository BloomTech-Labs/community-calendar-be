 // @ts-check
 'use strict'

 /**
  * @param { import('../generated/prisma-client').User } parent
  */

  module.exports.user = (parent, args, { prisma }) => {
      const organizations = prisma.user({ id: parent.id }).organizations({ ...args })
      const rsvps = prisma.user({ id: parent.id }).rsvps({ ...args })
      const saved = prisma.user({ id: parent.id  }).saved({ ...args })
      const adminFor = prisma.user({ id: parent.id }).adminFor({ ...args })
      const createdEvents = prisma.user({ id: parent.id }).createdEvents({ ...args })
      const createdImages = prisma.user({ id: parent.id }).createdImages({ ...args })

      return {
          organizations, 
          rsvps, 
          saved, 
          adminFor, 
          createdEvents, 
          createdImages
      }
  }

