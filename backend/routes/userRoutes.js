const express = require("express");
// const dotenv = require("dotenv").config();
const userRouter = express.Router();
const {
  login,
  signup,
  logout,
  verifyuser,
  get_user,
  changePassword,
  get_user_chats
} = require("../Controllers/userControllers");
const { verifyToken } = require("../utils/tokenManager");

userRouter.post("/signup", signup);
userRouter.post("/login", login);
userRouter.post("/change_password", verifyToken, changePassword);
userRouter.get("/logout", verifyToken, logout);
userRouter.get("/authstatus", verifyToken, verifyuser);
userRouter.get("/get_user", verifyToken, get_user); 
userRouter.get("/get_user_chats", verifyToken, get_user_chats);
userRouter.get("/", (req, res) => {
  res.status(200).send("Hello from the server");
});

module.exports = userRouter;
