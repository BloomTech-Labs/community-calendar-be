const gql = require('graphql-tag');

const ADD_EVENT = gql`
    mutation AddEvent(
      $title: String!,
      $description: String!,
      $start: DateTime!
      $end: DateTime!,
      $eventImages: [EventCreateImageInput!],
      $placeName: String!,
      $streetAddress: String!,
      $streetAddress2: String = null,
      $city: String!,
      $state: String!,
      $zipcode: Int!,
      $latitude: Float = null,
      $longitude: Float = null,
      $tags: [EventCreateTagInput!],
      $ticketType: TicketType!
      $images: [Upload!]
    ){
      addEvent(
        data: {
          title: $title
          description: $description
          start: $start
          end: $end
          eventImages: $eventImages
          locations: {
            create: [
              {
                name: $placeName
                streetAddress: $streetAddress
                streetAddress2: $streetAddress2
                city: $city
                zipcode: $zipcode
                state: $state
                latitude: $latitude
                longitude: $longitude
              }
            ]
          }
          tags: $tags
          ticketType: $ticketType
        },
        images: $images
      ) {
        id
      }
    }
  `;

const UPDATE_EVENT = gql`
    mutation UpdateEvent(
      # need ID to update a specific event
      $id: ID!,
      # same variables as AddEvent
      $title: String!,
      $description: String!,
      $start: DateTime!
      $end: DateTime!,
      $eventImages: [EventCreateImageInput!],
      $placeName: String!,
      $streetAddress: String!,
      $streetAddress2: String = null,
      $city: String!,
      $state: String!,
      $zipcode: Int!,
      $latitude: Float = null,
      $longitude: Float = null,
      $tags: [EventCreateTagInput!],
      $ticketType: TicketType!,
      $images: [Upload!]
    ){
      updateEvent(
        where: { id: $id },
        data: {
          title: $title
          description: $description
          start: $start
          end: $end
          eventImages: $eventImages
          locations: {
            create: [
              {
                name: $placeName
                streetAddress: $streetAddress
                streetAddress2: $streetAddress2
                city: $city
                zipcode: $zipcode
                state: $state
                latitude: $latitude
                longitude: $longitude
              }
            ]
          }
          tags: $tags
          ticketType: $ticketType
        },
        images: $images
      ) {
        id
      }
    }
  `;

  const DELETE_EVENT = gql`
    mutation DeleteEvent($id: ID!){
      deleteEvent(where: {id: $id}){
        id
      }
    }
  `

module.exports = {
  ADD_EVENT,
  UPDATE_EVENT,
  DELETE_EVENT
}