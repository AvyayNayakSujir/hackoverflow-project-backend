const mongoose = require("mongoose");

const { Schema } = mongoose;

const SalesSchema = new Schema({
  number: {
    type: Number,
    required: true,
  },
  type: {
    type: String, 
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  bedrooms: {
    type: Number,
    required: true,
  },
  bathrooms: {
    type: Number,
    required: true,
  },
  squareFeet: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  agent: {
    name: {
      type: String,
      required: true,
    },
    contact: {
      type: Number,
    },
  },
  images: [
    {
      url: String,
      filename: String,
    },
  ],
});

const Room = mongoose.model.Room || mongoose.model("Room", SalesSchema);

module.exports = Room;