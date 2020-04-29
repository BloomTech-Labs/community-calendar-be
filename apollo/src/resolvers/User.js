// @ts-check
'use strict'

const User = {
  organizations: (parent, args, { prisma }) => prisma.user({ id: parent.id }).organizations({ ...args }),
  rsvps: (parent, args, { prisma }) => prisma.user({ id: parent.id }).rsvps({ ...args }),
  saved: (parent, args, { prisma }) => prisma.user({ id: parent.id }).saved({ ...args }),
  adminFor: (parent, args, { prisma }) => prisma.user({ id: parent.id }).adminFor({ ...args }),
  createdEvents: (parent, args, { prisma }) => prisma.user({ id: parent.id }).createdEvents({ ...args }),
  createdImages: (parent, args, { prisma }) => prisma.user({ id: parent.id }).createdImages({ ...args })
}

module.exports = User
