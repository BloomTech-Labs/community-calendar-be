// @ts-check
'use strict'

// All resolvers must be imported here and declared in the resolvers
// object in order to be received by the client. If you are logging
// your resolvers but not seeing anything print to stdout, this is
// the most likely culprit

const Query = require('./Query')
const Mutation = require('./Mutation')
const User = require('./User')
const Event = require('./Event')
const Tag = require('./Tag')
const Series = require('./Series')

const resolvers = {
  Query,
  Mutation,
  User,
  Event,
  Tag,
  Series
}

module.exports = resolvers
