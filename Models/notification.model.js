const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    sender: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User",
      required: true
    },
    receiver: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User",
      required: true
    },
    type: { 
      type: String, 
      enum: ["like", "comment", "follow"], 
      required: true 
    },
    post: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Post",
      default: null 
    },
    reel: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Reel",
      default: null 
    },
    story: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Story",
      default: null 
    },
    message: { 
      type: String,
      required: true
    },
    isRead: { 
      type: Boolean, 
      default: false 
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);