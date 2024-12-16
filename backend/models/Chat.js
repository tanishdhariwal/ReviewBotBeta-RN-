const mongoose = require("mongoose");

const ExchangeSchema = new mongoose.Schema({
  bot_response: { type: String,  },
  user_query: { type: String,  },
  timestamp: { type: Date, default: Date.now },
});

const ChatSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  product_asin: { type: String, required: true },
  exchanges: [ExchangeSchema],
  created_at: { type: Date, default: Date.now },
});

ChatSchema.index({ user_id: 1, product_asin: 1 }, { unique: true });

const Chat = mongoose.model('Chat', ChatSchema);

module.exports = Chat;