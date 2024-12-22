// const User = require("../models/User");
const Chat = require("../models/Chat");
const dbconnection = require("../DB/dbconnection"); // Correct import for dbconnection
const axios = require("axios");
const dotenv = require("dotenv").config();

const generateChatResponse = async (req, res) => {
  const { currentMessage, productASIN } = req.body;
  const userId = res.locals.jwtData.id;
  console.log("User ID:", userId);
  try {
    // Generate a response using the NLP model
    const userChat = await Chat.findOne({ user_id: userId, product_asin: productASIN });
    const exchanges = userChat ? userChat.exchanges : [];
    const llmResponse = await axios.post(
      `http://${process.env.FRONTEND_URL}:8000/get_LLM_response`,
      { asin: productASIN, query: currentMessage, exchanges: exchanges }
    );
    const botResponse = llmResponse.data.response;

    // Update the chat document with the new exchange
    const newExchange = {
      bot_response: botResponse,
      user_query: currentMessage,
      timestamp: new Date(),
    };

    await Chat.updateOne(
      { user_id: userId, product_asin: productASIN },
      { $push: { exchanges: newExchange } },
      { upsert: true }
    );

    res.status(200).json({ response: botResponse });
  } catch (error) {
    console.error("Error in generateChatResponse:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

const productUrlCheck = async (req, res, next) => {
  const { asin } = req.body;
  try {
    const db = await dbconnection();
    const productsCollection = db.collection("products");
    // console.log("I just got the products collection", await productsCollection.find().limit(1).toArray());
    console.log("ASIN:", asin);
    const product = await productsCollection.findOne({ product_asin_no: asin });
    if (product) {
      return res.status(200).json({ isValid: true, existsInDB: true });
    } else {
      req.asin = asin;
      console.log("Product not found in DB. Proceeding to scrape URL.");
      next();
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ isValid: false, error: "Database error." });
  }
};

const scrapeURL = async (req, res) => {
  const asin = req.asin;

  try {
    const response = await axios.post(`http://${process.env.FRONTEND_URL}:8000/scrape_url`, {
      asin,
    });

    if (response.data.isScraped) {
      return res.status(200).json({
        isValid: true,
        existsInDB: true,
        message: "Scraping successful.",
      });
    } else {
      return res
        .status(500)
        .json({ isValid: false, error: "Scraping failed." });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ isValid: false, error: "Error during scraping." });
  }
};

const getUserChat = async (req, res) => {
  const userId = res.locals.jwtData.id;
  const product_asin = req.body.product_asin;
  console.log("User ID:", userId);
  console.log("Product ASIN:", product_asin);

  if (!product_asin) {
    return res.status(400).json({ error: 'Product ASIN is required.' });
  }

  try {
    const chat = await Chat.findOne({
      "user_id": userId,
      "product_asin": product_asin,
    });
    if (!chat) {
      // Create a new chat with predefined message
      const predefinedMessage = {
        bot_response: "Hello! How can I assist you today?",
        user_query: "",
        timestamp: new Date(),
      };

      const newChat = new Chat({
        user_id: userId,
        product_asin: product_asin,
        exchanges: [predefinedMessage],
        created_at: new Date(),
      });
      await newChat.save();
      return res.status(200).json(newChat); // Return the new chat
    }
    return res.status(200).json(chat);
  } catch (error) {
    console.error('Error in getUserChat:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

const getProduct = async (req, res) => {
  const { asin } = req.params;
  try {
    const db = await dbconnection();
    const productsCollection = db.collection('products');
    const product = await productsCollection.findOne({ product_asin_no: asin });
    if (product) {
      const { reviews, ...productDetails } = product; // Exclude reviews

      // Ensure media.images exists
      if (!productDetails.media || !productDetails.media.images) {
        productDetails.media = { images: [] };
      }

      res.status(200).json(productDetails);
    } else {
      res.status(404).json({ error: 'Product not found.' });
    }
  } catch (error) {
    console.error('Error in getProduct:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

const deleteUserChat = async (req, res) => {
  const userId = res.locals.jwtData.id;
  const { asin } = req.params;
  try {
    const result = await Chat.deleteOne({ user_id: userId, product_asin: asin });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Chat not found.' });
    }
    res.status(200).json({ message: 'Chat deleted successfully.' });
  } catch (error) {
    console.error('Error in deleteUserChat:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

module.exports = {
  deleteUserChat,
  generateChatResponse,
  productUrlCheck,
  scrapeURL,
  getUserChat,
  getProduct,
};
