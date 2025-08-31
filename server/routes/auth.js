const express=require('express');
const { userRegister } = require('../controller/auth');
const authRouter=express.Router();
//hello from jay12
authRouter.post('/register',userRegister);

module.exports=authRouter;
