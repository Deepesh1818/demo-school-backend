const mongoose = require('mongoose');

const TransportRouteSchema = new mongoose.Schema({
  routeName: {
    type: String,
    required: [true, 'Please add a route name (e.g. Route A - North Sector)'],
    trim: true
  },
  busNumber: {
    type: String,
    required: [true, 'Please add a bus license plate/number'],
    trim: true
  },
  driverName: {
    type: String,
    required: [true, 'Please add a driver name'],
    trim: true
  },
  driverPhone: {
    type: String,
    required: [true, 'Please add driver contact details']
  },
  stops: [{
    type: String,
    trim: true
  }],
  cost: {
    type: Number,
    required: true,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('TransportRoute', TransportRouteSchema);
