const express=require('express');
const userRouter=express.Router();
const {getAllUsers,getUserById}=require("../controller/users");

userRouter.get("/",getAllUsers);
userRouter.get("/:id",getUserById);
module.exports=userRouter;