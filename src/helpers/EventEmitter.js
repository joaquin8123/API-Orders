class EventEmitter {
  constructor(io) {
    this.io = io;
  }

  emitOrderUpdated(order) {
    this.io.emit("order-updated", order);
  }
}

module.exports = EventEmitter;
