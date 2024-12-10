const User = require("../models/User");
const jwt = require("jsonwebtoken");
const imageUrls = require("../utils/Icons");
const bcrypt = require("bcryptjs");
const Chat = require("../models/Chat");

const signup = async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res
      .status(400)
      .json({ error: "Please provide name email and password" });
  }
  try {
    const randomIcon = imageUrls[Math.floor(Math.random() * imageUrls.length)];
    console.log("Random Icon:", randomIcon);
    const user = new User({
      username,
      email,
      password,
      profileImage: randomIcon,
      plan: "free",
      credits: 100,
    });
    await user.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    if (error.code === 11000) {
      res.status(409).json({ error: "Duplicate entry: User already exists" });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Please provide email and password" });
  }

  try {
    let gotuser = await User.findOne({ email: email });
    if (!gotuser) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    let matched = await gotuser.comparePass(password);
    if (!matched) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // res.clearCookie(process.env.COOKIE_NAME, {
    //   httpOnly: true,
    //   domain: process.env.FRONTEND_URL,
    //   signed: true,
    //   path: "/",
    // });

    // just chill, we can use it if we get any serious issues

    const token = jwt.sign(
      { id: gotuser._id, username: gotuser.username },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    const expires = new Date(Date.now() + 3600000); // 1 hour

    res.cookie(process.env.COOKIE_NAME, token, {
      path: "/",
      domain: process.env.FRONTEND_URL,
      expires,
      httpOnly: true,
      signed: true,
    });

    return res.status(200).json({
      message: "ok",
      username: gotuser.username,
      email: gotuser.email,
    });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const verifyuser = async (req, res) => {
  console.log("verifying user");
  try {
    // console.log("JWT Data:", res.locals.jwtData);

    const user = await User.findById(res.locals.jwtData.id);
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    // console.log("User found:", user);

    if (user._id.toString() !== res.locals.jwtData.id) {
      return res.status(400).json({ error: "Invalid token" });
    }

    console.log("Permissions matched");
    console.log("User:", user.username, user.email);
    return res
      .status(200)
      .json({ message: "Ok", username: user.username, email: user.email });
  } catch (error) {
    console.log("Error during verification:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const logout = async (req, res) => {
  try {
    res.clearCookie(process.env.COOKIE_NAME, {
      httpOnly: true,
      domain: process.env.FRONTEND_URL,
      signed: true,
      path: "/",
    });
    return res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error("Error during logout:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const get_response = async (req, res) => {
  try {
    // the main logic for the chatbot inka pettali
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const get_user = async (req, res) => {
  try {
    const user = await User.findById(res.locals.jwtData.id);
    console.log("User:", user);

    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    return res.status(200).json({ user: user });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return res
      .status(400)
      .json({ error: "Please provide current and new password" });
  }

  try {
    const user = await User.findById(res.locals.jwtData.id);
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    const matched = await user.comparePass(currentPassword);
    if (!matched) {
      return res.status(400).json({ error: "Current password is incorrect" });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    return res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Error during password change:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const get_user_chats = async (req, res) => {
  const userId = res.locals.jwtData.id;
  try {
    const chats = await Chat.find({ user_id: userId });
    if (!chats || chats.length === 0) {
      return res.status(200).json([]);
    }
    const productAsins = chats.map(chat => chat.product_asin);
    return res.status(200).json(productAsins);
  } catch (error) {
    console.error('Error in get_user_chats:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

module.exports = {
  signup,
  login,
  logout,
  verifyuser,
  get_response,
  get_user,
  changePassword,
  get_user_chats,
};
