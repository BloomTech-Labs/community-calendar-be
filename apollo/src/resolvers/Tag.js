
const Tag = {
  events: (parent, args, { prisma }) =>
    prisma.tag({ id: parent.id }).events({ ...args })
}

module.exports = Tag
