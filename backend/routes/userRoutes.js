const express = require("express");
// const dotenv = require("dotenv").config();
const userRouter = express.Router();
const {
  logout,
  verifyuser,
//   get_user,
  get_user_chats
} = require("../Controllers/userControllers");
const { verifyToken } = require("../utils/tokenManager");
userRouter.get("/logout", verifyToken, logout);
userRouter.get("/authstatus", verifyToken, verifyuser);
// userRouter.get("/get_user", verifyToken, get_user); 
userRouter.get("/get_user_chats", verifyToken, get_user_chats);
userRouter.get("/", (req, res) => {
  res.status(200).send("Hello from the server");
});

module.exports = userRouter;
