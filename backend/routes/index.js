const express = require('express');
const userRouter = require('./userRoutes');
const chatRouter = require('./chatRoutes');
const router = express.Router();


router.use(userRouter);
router.use(chatRouter);


module.exports = router;