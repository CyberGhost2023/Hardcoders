const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { ObjectId } = mongoose.Schema.Types;
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  handle: {
    type: String,
    unique: true,
  },
  active: Boolean,
  description: {
    type: String,
  },
  skills: [
    {
      title: String,
      precent: Number,
    },
  ],
  goal: [
    {
      title: String,
      finished: Number,
      exam: String,
    },
  ],
  friends: [
    {
      type: ObjectId,
      ref: "User",
    },
  ],
  tracks: [
    {
      type: ObjectId,
      ref: "Tracks",
    },
  ],
  questions: [
    {
      type: ObjectId,
      ref: "Question",
    },
  ],
  notes: [
    {
      type: ObjectId,
      ref: "Note",
    },
  ],
  likes: [
    {
      type: ObjectId,
      ref: "Question",
    },
  ],
  resourcelikes: [
    {
      type: ObjectId,
      ref: "Resource",
    },
  ],
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

const User = new mongoose.model("User", userSchema);
module.exports = User;
