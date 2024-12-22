const express = require("express");
const chatRouter = express.Router();
const verifyToken = require("../utils/tokenManager").verifyToken;
const {
  generateChatResponse,
  productUrlCheck,
  scrapeURL,
  getUserChat,
  getProduct,
  deleteUserChat
} = require("../Controllers/chatControllers"); // Import controller

// Chat routes are Protected API's

chatRouter.get("/new", (req, res) => {
  res.status(200).send("Hello from the chat server");
});

chatRouter.post("/chat_response", verifyToken, generateChatResponse);
chatRouter.post("/product_url_validation", productUrlCheck, scrapeURL);
chatRouter.post('/get_user_chat', verifyToken, getUserChat); // Changed to POST
chatRouter.get('/get_product/:asin', getProduct); // Updated to handle asin parameter
chatRouter.delete('/delete_user_chat/:asin', verifyToken, deleteUserChat);
module.exports = chatRouter;
