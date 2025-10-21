const express=require('express');
const { userRegister,userLogin,userLogout,userProfile} = require('../controller/auth');
const authRouter=express.Router();
const {authenticateJWT}=require('../middleware/authenticateJWT');
//auth test
authRouter.post('/register',userRegister);
authRouter.post('/login',userLogin);
authRouter.post('/logout',userLogout);
authRouter.get('/profile',authenticateJWT,userProfile);

module.exports=authRouter;
