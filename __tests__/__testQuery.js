const gql = require('graphql-tag');

const EVENT_DETAIL_DATA = gql`
  fragment EventDetail on Event {
    id
    title
    description
    start
    end
  }
`

const ADDRESS_DETAIL_DATA = gql`
  fragment AddressDetail on Location {
    street_address
    street_address_2
    city
    zipcode
    state
  }
`
const GET_EVENTS = gql`
  query EventsByRange($start: DateTime, $end: DateTime) {
    events(
      where: {
        OR: [
          {AND: [{start_lte: $start}, {end_gte: $end}]}
          {AND: [{start_gte: $start}, {end_lte: $end}]}
          {
            AND: [
              {AND: [{start_gte: $start}, {start_lte: $end}]}
              {end_gte: $end}
            ]
          }
          {
            AND: [
              {start_lte: $start}
              {AND: [{end_lte: $end}, {end_gte: $start}]}
            ]
          }
        ]
      }
    ) {
      ...EventDetail
      creator {
        id
      }
      locations {
        id
        name
        ...AddressDetail
      }
      event_images {
        url
      }
      tags {
        title
      }
    }
  }
  ${EVENT_DETAIL_DATA}
  ${ADDRESS_DETAIL_DATA}
`

const GET_EVENT_BY_ID = gql`
  query GetEventsById($id: ID){
      events(where: {id: $id}){
      ...EventDetail
      creator {
        id
      }
      locations {
        id
        name
        ...AddressDetail
      }
      event_images {
        url
      }
      tags{
        title
      }
    }
  }
  ${EVENT_DETAIL_DATA}
  ${ADDRESS_DETAIL_DATA}
`

module.exports = {
    GET_EVENTS,
    GET_EVENT_BY_ID,
    EVENT_DETAIL_DATA,
    ADDRESS_DETAIL_DATA
}