module.exports = (parent, args, { prisma }) => {
    return prisma.tag({ id: parent.id}).events({ ...args })
}