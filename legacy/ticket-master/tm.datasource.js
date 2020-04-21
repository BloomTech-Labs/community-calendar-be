const {RESTDataSource} = require('apollo-datasource-rest');

class TicketMasterAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = 'https://app.ticketmaster.com';
  }

  // Add ticket master API key to params of every request from all instances of this class
  willSendRequest(req) {
    req.params.set('apikey', this.context.tm_key);
  }

  // return events with TM default data structure
  async getEvents({radius = 20, unit = 'miles', ...rest}) {
    let options = {radius, unit, ...rest};

    console.log('getEvents called');
    const data = await this.get('/discovery/v2/events.json', options);
    return data;
  }

  // return events with modified data structure
  async getEventsAlt({radius = 20, unit = 'miles', ...rest}) {
    let options = {radius, unit, ...rest};
    console.log('getEventsAlt called');
    const data = await this.get('/discovery/v2/events.json', options);

    const ccFormatData = {};
    const dataCopy = {...data};

    // add page object to ccFormatData
    ccFormatData.page = {...dataCopy.page};

    // array to hold events
    ccFormatData.events = [];
    if (dataCopy._embedded) {
      // loop over events from TM and add to ccFormatData.events in alt format
      dataCopy._embedded.events.forEach(event => {
        let newEvent = {};
        newEvent.title = event.name;
        newEvent.id = event.id;
        newEvent.description = event.description;
        newEvent.info = event.info;
        newEvent.start = event.dates.start.dateTime;
        newEvent.end = event.dates.end ? event.dates.end.dateTime : null;
        newEvent.eventImages = [...event.images];
        newEvent.urls = [{url: event.url}];
        // determine location
        let eventPlace;
        if (event.place) {
          eventPlace = {
            name: event.place.name,
            neighborhood: event.place.area ? event.place.area.name : null,
            streetAddress: event.place.address.line1,
            streetAddress2: event.place.address.line2,
            city: event.place.city.name,
            zipcode: event.place.postalCode,
            state: event.place.state.stateCode,
            latitude: event.place.location.latitude,
            longitude: event.place.location.longitude,
            distance: event.place.distance,
          };
        } else {
          eventPlace = {
            neighborhood: null,
            name: event._embedded.venues[0].name,
            streetAddress: event._embedded.venues[0].address.line1,
            streetAddress2: event._embedded.venues[0].address.line2,
            city: event._embedded.venues[0].city.name,
            zipcode: event._embedded.venues[0].postalCode,
            state: event._embedded.venues[0].state.stateCode,
            latitude: event._embedded.venues[0].location.latitude,
            longitude: event._embedded.venues[0].location.longitude,
            distance: event._embedded.venues[0].distance,
          };

          newEvent.locations = [{...eventPlace}];
        } // end if
        ccFormatData.events.push(newEvent);
      }); // end forEach
    }
    return ccFormatData;
  }
}

module.exports = TicketMasterAPI;
