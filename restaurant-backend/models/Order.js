const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  tableNumber: {
    type: String,
    required: true,
    trim: true
  },
  items: [{
    // ✅ FIX: changed from ObjectId → String
    itemId: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    price: {
      type: Number,
      required: true,
      min: 0
    }
  }],
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['Preparing', 'Ready', 'Served'],
    default: 'Preparing'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Order', orderSchema);