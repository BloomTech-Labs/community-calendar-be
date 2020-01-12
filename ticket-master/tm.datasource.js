const {RESTDataSource} = require('apollo-datasource-rest');

class TicketMasterAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = 'https://app.ticketmaster.com';
  }

  willSendRequest(req) {
    req.params.set('apikey', this.context.ticketMasterKey);
  }

  async getEvents(radius = 20, unit = 'miles', size = 5, latlong) {
    const data = await this.get('/discovery/v2/events', {
      radius,
      unit,
      size,
      latlong,
    });
    return data.results;
  }
}

module.exports = TicketMasterAPI;
