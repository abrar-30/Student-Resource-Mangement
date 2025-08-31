const express=require('express');
const { authRegister } = require('../controller/auth');
const authRouter=express.Router();

authRouter.post('/register',authRegister);

module.exports=authRouter;
