// @ts-check
 "use strict";

 const { prisma } = require("../apollo/src/generated/prisma-client");


async function main() {

  const user = await prisma.createUser({
    oktaId: 'testId1',
      firstName: "Detroit Experience Factory", 
      profileImage: "https://res.cloudinary.com/communitycalendar/image/upload/v1580757435/wierq7pulh1irmhsfygd.jpg"
  })
  const user1 = await prisma.createUser({
    oktaId: 'testId2',
      firstName: "Ray", 
      lastName: "Batra", 
      profileImage: "https://res.cloudinary.com/communitycalendar/image/upload/v1580754066/srqisgiplumij6jzkzc1.jpg"
  })
  const user3 = await prisma.createUser({
    oktaId: 'testId3',
      firstName: "Historic North End Alliance", 
      profileImage: "https://res.cloudinary.com/communitycalendar/image/upload/v1580757510/u5eukn21j7ebkbs0len6.png"
  })

  const tag1 = await prisma.createTag({
    title: "art"
})
const tag2 = await prisma.createTag({
    title: "beer"
})
const tag3 = await prisma.createTag({
    title: "block club"
})
const tag4 = await prisma.createTag({
    title: "code"
})
const tag5 = await prisma.createTag({
    title: "community"
})
const tag6 = await prisma.createTag({
    title: "history"
})
const tag7 = await prisma.createTag({
    title: "downtown"
})
const tag8 = await prisma.createTag({
    title: "architecture"
})

const event1 =  await prisma.createEvent({
 index: ",art,architect,downtown,walk,tour,detroit,city,rich,hist,grand,build,vibr,surround,publ,spac,expery,fact,are,expl,gre,contribut,prol,emerg,",
  title: "Art & Architecture - Downtown Walking Tour",
  description: "Detroit is a city rich in history, grand buildings, and vibrant art surrounding public spaces. Walk with Detroit Experience Factory through the downtown area as we explore some of the great contributions of both prolific architects and emerging artists.",
  start: "2020-02-23T12:00:00-0500",
  end: "2020-02-23T14:30:00-0500",
  ticketPrice: 0.00,
 creator: { connect: { id: "ck9k36f63000w0895p3p515yb" } }, 
  eventImages: {
    create: [
      {
        url: "https://img.evbuc.com/https%3A%2F%2Fcdn.evbuc.com%2Fimages%2F69917729%2F89373299245%2F1%2Foriginal.jpg?w=800&auto=format%2Ccompress&q=75&sharp=10&rect=0%2C693%2C4000%2C2000&s=94184073d91c25306d22d1b0401cfea9",
         creator: { connect: { id: "ck9k36f63000w0895p3p515yb" } }
      }
    ]
  },
  urls: {
    create: [
      {
        url: "https://www.eventbrite.com/e/art-architecture-downtown-walking-tour-tickets-70525424443"
      }
    ]
  },
   admins: {connect: [{ id: "ck9k36f63000w0895p3p515yb" }]},
  locations: {
    create: [
      {
        name: "Roasting Plant",
        streetAddress: "600 Woodward Avenue",
        city: "Detroit",
        zipcode: 48202,
        state: "MI",
        latitude: 42.330511,
        longitude: -83.045427,
      }
    ]
  },
  tags: {connect: [{title: "art"}, {title: "history"}, {title: "downtown"}, {title: "architecture"}]},
}
)
const event2 = await prisma.createEvent({
index: ",art,architect,downtown,walk,tour,detroit,city,rich,hist,grand,build,vibr,surround,publ,spac,expery,fact,are,expl,gre,contribut,prol,emerg,",
title: "Art & Architecture - Downtown Walking Tour",
description: "Detroit is a city rich in history, grand buildings, and vibrant art surrounding public spaces. Walk with Detroit Experience Factory through the downtown area as we explore some of the great contributions of both prolific architects and emerging artists.",
start: "2020-03-29T12:00:00-0500",
end: "2020-03-29T14:30:00-0500",
ticketPrice: 0.00,
 creator: {connect: {id: 'ck9k36gbb001108953g35d9vi' }},
eventImages: {
  create: [
    {
      url: "https://img.evbuc.com/https%3A%2F%2Fcdn.evbuc.com%2Fimages%2F69917729%2F89373299245%2F1%2Foriginal.jpg?w=800&auto=format%2Ccompress&q=75&sharp=10&rect=0%2C693%2C4000%2C2000&s=94184073d91c25306d22d1b0401cfea9",
      creator: {connect: {id: 'ck9k36gbb001108953g35d9vi' }},
    }
  ]
},
urls: {
  create: [
    {
      url: "https://www.eventbrite.com/e/art-architecture-downtown-walking-tour-tickets-70525424443"
    }
  ]
},
 admins: {connect: [{id: 'ck9k36gbb001108953g35d9vi' }]},
locations: {
  create: [
    {
      name: "Roasting Plant",
      streetAddress: "600 Woodward Avenue",
      city: "Detroit",
      zipcode: 48202,
      state: "MI",
      latitude: 42.330511,
      longitude: -83.045427,
    }
  ]
},
tags: {connect: [{title: "art"}, {title: "history"}, {title: "downtown"}, {title: "architecture"}]}
} ) 

}

main().catch((e) => console.error(e));
