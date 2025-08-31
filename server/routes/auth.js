const express=require('express');
const { userRegister } = require('../controller/auth');
const authRouter=express.Router();

authRouter.post('/register',userRegister);

module.exports=authRouter;
