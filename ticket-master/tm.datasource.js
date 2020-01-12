import {RESTDataSource} from 'apollo-datasource-rest';

export default class TicketMasterAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = 'https://app.ticketmaster.com';
  }

  willSendRequest(req) {
    req.params.set('apikey', this.context.ticketMasterKey);
  }

  async getEvents(radius = 20, unit = 'miles', size = 5) {
    const data = await this.get('/discovery/v2/events', {
      radius,
      unit,
      size,
    });
    return data.results;
  }
}
