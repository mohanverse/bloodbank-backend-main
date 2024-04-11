const mongoose = require('mongoose');

const { Schema } = mongoose;

const DonationSchema = new Schema({
  name: String,
  email: String,
  number: String,
  bloodg: String,
  hospital: String,
  city: String,
  state: String,
  diseases: String,
  birth: String,
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  }
});

const DonationModel = mongoose.model('Donation', DonationSchema);

module.exports = DonationModel;
