const { point } = require('@turf/helpers');

module.exports.creator = (parent, args, { prisma, user }) => {
    prisma.event({ id: parent.id }).creator()
}
module.exports.eventImages = (parent, args, { prisma }) => {
    prisma.event({ id: parent.id }).eventImages({ ...args })
}
module.exports.rsvps = (parent, args, { prisma }) => {
    prisma.event({ id: parent.id }).rsvps({ ...args })
}
module.exports.saved = (parent, args, { prisma }) => {
    prisma.event({ id: parent.id }).saved({ ...args })
}
module.exports.urls = (parent, args, { prisma }) => {
    prisma.event({ id: parent.id }).urls({ ...args })
}
module.exports.admins = (parent, args, { prisma }) => {
    prisma.event({ id: parent.id }).admins({ ...args })
}

module.exports.locations = async (parent, { userLatitude, userLongitude, distanceUnit = 'miles', ...args}, { prisma }) => {
    const eventLoacations = await prisma 
        .event({ id: parent.id})
        .locations({ ...args }); 

        if (userLatitude && userLongitude) {
            eventLoacations.forEach(location => {
                if (location.latitude && location.longitude) {
                    let userLocation = point([userLongitude, userLatitude]);
                    let eventLocation = point([location.longitude, location.latitude]);
                    let options = {units: distanceUnit}; //default miles

                    location.distanceFromUser = distance(
                        userLocation,
                        eventLocation,
                        options,
                      );

                      location.distanceUnit = distanceUnit;
                    } else {
                      location.distanceFromUser = null;
                      location.distanceUnit = null;
                }
            })
        }
        return eventLocations; 
}