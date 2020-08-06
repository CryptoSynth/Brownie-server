const mongoose = require('mongoose');

//Construct Order Model & Schema
const orderSchema = new mongoose.Schema({
  invoiceId: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50
  },
  shipping_id: {
    type: String,
    required: true
  },
  tracking_url: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255
  },
  items: [Object],
  isFullfilled: {
    type: Boolean,
    required: true,
    default: false
  }
});

const Order = mongoose.model('Order', orderSchema);

module.exports.orderSchema = orderSchema;
module.exports.Order = Order;
