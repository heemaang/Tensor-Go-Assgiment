const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
  recipient: String,
  recipientEmail: String,
  amount: Number,
  dueDate: String,
  formattedDueDate: String,
  status: String,
  userEmail: {
    type: String,
  required: true 

  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Invoice', invoiceSchema);
