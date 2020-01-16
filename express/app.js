const express = require('express');

const app = express();

app.use(express.json());

const eventsRouter = require('./events/eventsRouter');

app.use('/api/events', eventsRouter);

module.exports = app;