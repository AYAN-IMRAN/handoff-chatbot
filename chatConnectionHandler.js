
class ChatConnectionHandler {
  constructor (socket, messageRouter, onDisconnect) {
    // A socket.io socket corresponding to this connection
    this.socket = socket;
    // A MessageRouter used by this application
    this.router = messageRouter;
    // Callback that performs any cleanup work after this client disconnects
    this.onDisconnect = onDisconnect;
  }

  // Perform any initialization in the implementation of this function
  init () {
    throw new Error('init function was not implemented');
  }

  // Attach any connection event handlers in the implementation of this function
  attachHandlers () {
    throw new Error('attachHandlers function was not implemented');
  }
}

module.exports = ChatConnectionHandler;
