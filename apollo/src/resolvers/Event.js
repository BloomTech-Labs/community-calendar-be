const { point } = require('@turf/helpers')
const distance = require('@turf/distance').default
const Event = {
  creator: (parent, args, { prisma }) => prisma.event({ id: parent.id }).creator({ ...args }),
  eventImages: (parent, args, { prisma }) => prisma.event({ id: parent.id }).eventImages({ ...args }),
  rsvps: (parent, args, { prisma }) =>
    prisma.event({ id: parent.id }).rsvps({ ...args }),
  saved: (parent, args, { prisma }) =>
    prisma.event({ id: parent.id }).saved({ ...args }),
  urls: (parent, args, { prisma }) =>
    prisma.event({ id: parent.id }).urls({ ...args }),
  admins: (parent, args, { prisma }) =>
    prisma.event({ id: parent.id }).admins({ ...args }),
  locations: async (
    parent,
    { userLatitude, userLongitude, distanceUnit = 'miles', ...args },
    { prisma }
  ) => {
    // find the locations for the current event
    const eventLocations = await prisma
      .event({ id: parent.id })
      .locations({ ...args })

    // if userLatitude and userLongitude are passed as arguments for location
    if (userLatitude && userLongitude) {
      eventLocations.forEach(location => {
        if (location.latitude && location.longitude) {
          const userLocation = point([userLongitude, userLatitude])
          const eventLocation = point([location.longitude, location.latitude])
          const options = { units: distanceUnit } // default miles

          // calculate and add distanceFromUser property to each location object
          location.distanceFromUser = distance(
            userLocation,
            eventLocation,
            options
          )

          // add distanceUnit to each location object, which will default to miles
          location.distanceUnit = distanceUnit
        } else {
          location.distanceFromUser = null
          location.distanceUnit = null
        }
      })
    }

    return eventLocations
  },
  tags: (parent, args, { prisma }) => prisma.event({ id: parent.id }).tags({ ...args }),
  series: (parent, args, { prisma }) => prisma.event({ id: parent.id }).series({ ...args })

}
module.exports = Event
