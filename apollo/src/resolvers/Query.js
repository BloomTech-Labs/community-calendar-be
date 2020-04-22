// @ts-check
 'use strict'

 const circle = require('@turf/circle').default
 const transformRotate = require('@turf/transform-rotate').default
 const inPolygon = require('@turf/boolean-point-in-polygon').default
 const natural = require('natural')

/**
 * @param {{ where: import('../generated/prisma-client').UserWhereUniqueInput }} args
 * @param {{ prisma: import('../generated/prisma-client').Prisma }} context
 * @returns { Promise }
 */
module.exports.user = async (_parent, args, context) => {
  console.log('Query.user.args: %j', args)

  const user = await context.prisma.user(args.where)

  console.log('Query.user: %j', user)

  return user
}

/**
 * @param {{ where: import('../generated/prisma-client').UserWhereInput }} args
 * @param {{ prisma: import('../generated/prisma-client').Prisma }} context
 * @returns { Promise }
 */
module.exports.users = async (_parent, args, context) => {
  console.log('Query.user.args: %j', args)

  const user = await context.prisma.users(args)

  console.log('Query.user: %j', user)

  return user
}

// /**
//  * @param {{ where: import( '../generated/prisma-client').TagWhereInput }} args 
//  * @returns { Promise }
//  */

module.exports.tags = async (_, args, { prisma }) => {
  return prisma.tags({ ...args })
}

module.exports.events = async (_, { searchFilters = { dateRange: null, index: null, ticketPrice: null, location: null, tags: null }, ...args }, { prisma }) => {
  const searchArray = []
  const {
    dateRange: dateRangeSearch,
    index: indexSearch,
    ticketPrice: ticketPriceSearch,
    location: locationSearch,
    tags: tagsSearch
  } = searchFilters
  if (dateRangeSearch) {
    const { start, end } = dateRangeSearch
    searchArray.push({
      OR: [
        { AND: [{ start_lte: start }, { end_gte: end }] },
        { AND: [{ start_gte: start }, { end_lte: end }] },
        {
          AND: [
            { AND: [{ start_gte: start }, { start_lte: end }] },
            { end_gte: end }
          ]
        },
        {
          AND: [
            { start_lte: start },
            { AND: [{ end_lte: end }, { end_gte: start }] }
          ]
        }
      ]
    })
  }

  if (ticketPriceSearch) {
    const result = ticketPriceSearch.map(({ minPrice, maxPrice }) =>
      minPrice !== undefined && maxPrice !== undefined
        ? {
          AND: [{ ticketPrice_gte: minPrice }, { ticketPrice_lte: maxPrice }]
        }
        : maxPrice !== undefined
          ? { ticketPrice_lte: maxPrice }
          : { ticketPrice_gte: minPrice }
    )
    searchArray.push({ OR: result })
  }

  if (indexSearch) {
    searchArray.push({
      OR: Array.from(
        new Set(natural.LancasterStemmer.tokenizeAndStem(indexSearch))
      ).map(token => ({ index_contains: ',' + token + ',' }))
    })
  }

  if (tagsSearch) {
    searchArray.push({ tags_some: { title_in: tagsSearch } })
  }

  if (locationSearch) {
    const { userLatitude, userLongitude, radius } = locationSearch
    const center = [userLongitude, userLatitude]
    // calculate coordinates using calculated diagonal from radius
    // rSC is rotated square coordinates
    const {
      geometry: {
        coordinates: [rSC]
      }
    } = transformRotate(
      circle(center, Math.sqrt(2) * radius, {
        steps: 4,
        units: 'miles'
      }),
      45
    )

    // square min/max longitude/latitude values
    const sMinLongitude = Math.min(
      ...[rSC[0][0], rSC[1][0], rSC[2][0], rSC[3][0]]
    )
    const sMaxLongitude = Math.max(
      ...[rSC[0][0], rSC[1][0], rSC[2][0], rSC[3][0]]
    )
    const sMinLatitude = Math.min(
      ...[rSC[0][1], rSC[1][1], rSC[2][1], rSC[3][1]]
    )
    const sMaxLatitude = Math.max(
      ...[rSC[0][1], rSC[1][1], rSC[2][1], rSC[3][1]]
    )

    const eventsLocationsFragment = `
      fragment eventsWithLocations on Event {
        id
        locations {
          latitude
          longitude
        }
      }
    `

    const whereArgs = args.where
      ? [...searchArray, args.where]
      : [...searchArray]

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
                      { longitude_gte: sMinLongitude },
                      { longitude_lte: sMaxLongitude }
                    ]
                  },
                  {
                    AND: [
                      { latitude_gte: sMinLatitude },
                      { latitude_lte: sMaxLatitude }
                    ]
                  }
                ]
              }
            }
          ]
        }
      })

      .$fragment(eventsLocationsFragment)

    const userCircle = circle(center, radius, { steps: 10, units: 'miles' })

    return prisma.events({
      ...args,
      where: {
        id_in: eventsInSquare
          .filter(event =>
            inPolygon(
              [event.locations[0].longitude, event.locations[0].latitude],
              userCircle
            )
          )
          .map(event => event.id)
      }
    })
  } else {
    const whereArgs = args.where
      ? [...searchArray, args.where]
      : [...searchArray]

    return prisma.events({
      ...args,
      where: { AND: whereArgs }
    })
  }
}
