// Netlify serverless function entry point — wraps Express app with serverless-http.
// Handler kept clean; all logic is in the Express app.

const serverless = require('serverless-http');
const app = require('../server');

module.exports.handler = serverless(app);
