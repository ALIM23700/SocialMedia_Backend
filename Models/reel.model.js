const mongoose = require('mongoose');

const reelSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  mediaType: {
    type: String,
    enum: ["image", "video"],
    required: true,
  },
  mediaUrl: {
    type: String,
    required: true,
  },
  caption: {
    type: String,
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }
  ],
  comments: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      text: String,
      createdAt: {
        type: Date,
        default: Date.now
      }
    }
  ],
  views: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }
  ]
}, { timestamps: true });

const Reel = mongoose.model('Reel', reelSchema);
module.exports = Reel;
