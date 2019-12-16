"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var prisma_lib_1 = require("prisma-client-lib");
var typeDefs = require("./prisma-schema").typeDefs;

var models = [
  {
    name: "User",
    embedded: false
  },
  {
    name: "Event",
    embedded: false
  },
  {
    name: "Event_Image",
    embedded: false
  },
  {
    name: "Event_Url",
    embedded: false
  },
  {
    name: "Location",
    embedded: false
  },
  {
    name: "Organization",
    embedded: false
  },
  {
    name: "Neighborhood",
    embedded: false
  },
  {
    name: "Geo_Json",
    embedded: false
  }
];
exports.Prisma = prisma_lib_1.makePrismaClientClass({
  typeDefs,
  models,
  endpoint: `${process.env["PRISMA"]}`,
  secret: `${process.env["SECRET"]}`
});
exports.prisma = new exports.Prisma();
