// Load third party dependencies
const express = require('express'); // Correctly instantiate Express
const http = require('http');
const socketIo = require('socket.io');
const app = express(); // Instantiate Express app
const server = http.createServer(app);
const io = socketIo(server);
const path = require('path'); // For handling file paths

const SERVICE_ACCOUNT = {

};

// Load our custom classes
const CustomerStore = require('./customerStore.js');
const MessageRouter = require('./messageRouter.js');

// Grab the service account credentials path from an environment variable
const keyPath = path.join(__dirname, 'credentials.json');
console.log(keyPath)
if (!keyPath) {
  console.log('You need to specify a path to a service account keypair in environment variable DF_SERVICE_ACCOUNT_PATH. See README.md for details.');
  process.exit(1);
}

// Load and instantiate the Dialogflow client library
const { SessionsClient } = require('dialogflow');
const dialogflowClient = new SessionsClient({
  keyFilename: keyPath
});

// Grab the Dialogflow project ID from an environment variable
const projectId = process.env.DF_PROJECT_ID || "";
if (!projectId) {
  console.log('You need to specify a project ID in the environment variable DF_PROJECT_ID. See README.md for details.');
  process.exit(1);
}

// Instantiate our app
const customerStore = new CustomerStore();
const messageRouter = new MessageRouter({
  customerStore: customerStore,
  dialogflowClient: dialogflowClient,
  projectId: projectId,
  customerRoom: io.of('/customer'),
  operatorRoom: io.of('/operator')
});

// Serve static html files for the customer and operator clients
app.get('/customer', (req, res) => {
  res.sendFile(path.join(__dirname, 'static', 'customer.html'));
});

app.get('/operator', (req, res) => {
  res.sendFile(path.join(__dirname, 'static', 'operator.html'));
});

// Begin responding to websocket and http requests
messageRouter.handleConnections();
server.listen(3000, () => {
  console.log('Listening on:3000');
});
