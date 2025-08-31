const express=require('express');
const { userRegister,userLogin,userLogout} = require('../controller/auth');
const authRouter=express.Router();
//auth test
authRouter.post('/register',userRegister);
authRouter.post('/login',userLogin);
authRouter.post('/logout',userLogout);

module.exports=authRouter;
