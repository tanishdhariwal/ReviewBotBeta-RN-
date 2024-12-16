const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
  title: {
    type: String,
    default: "No Title",
  },
  title_embeddings: {
    type: [Number], // Array of numbers for embeddings
    default: [],
  },
  review: {
    type: String,
    default: "No Review",
  },
  review_embeddings: {
    type: [Number], // Array of numbers for embeddings
    default: [],
  },
  star: {
    type: Number,
    default: 0,
  },
  date: {
    type: String,
    default: "No Date",
  },
});

const ProductSchema = new mongoose.Schema({
  product_asin_no: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    default: "No Title",
  },
  brand: {
    type: String,
    default: "No Brand",
  },
  price: {
    type: String,
    default: "No Price",
  },
  description: {
    type: String,
    default: "No Description",
  },
  image_url: {
    type: [String],
    default: [],
  },
  features: {
    type: [String],
    default: [],
  },
  average_rating: {
    type: String,
    default: "No Rating",
  },
  customer_sentiments: {
    type: Map,
    of: String,
    default: {},
  },
  amazon_review_summary: {
    type: String,
    default: "No Summary",
  },
  ratings_distribution: {
    type: Map,
    of: Number,
    default: {},
  },
  reviews: {
    type: [ReviewSchema], // Nested schema for reviews
    default: [],
  },
});

module.exports = mongoose.model("products", ProductSchema);
