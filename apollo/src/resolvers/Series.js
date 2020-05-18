const Series = {
    events: (parent, args, { prisma }) => prisma.series({ id: parent.id }).events({ ...args })
}

module.exports = Series