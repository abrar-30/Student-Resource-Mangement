const express=require('express');
const { userRegister } = require('../controller/auth');
const authRouter=express.Router();
//auth test
authRouter.post('/register',userRegister);

module.exports=authRouter;
