const express=require('express');
const { userRegister } = require('../controller/user');
const userRouter=express.Router();

userRouter.post('/register',userRegister);

module.exports=userRouter;
