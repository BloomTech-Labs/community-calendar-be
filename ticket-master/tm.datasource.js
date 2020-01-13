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

  async getEvents({radius = 20, unit = 'miles', size = 5, ...rest}) {
    let options = {radius, unit, size, ...rest};

    const data = await this.get('/discovery/v2/events.json', options);
    return data;
  }
}

module.exports = TicketMasterAPI;
