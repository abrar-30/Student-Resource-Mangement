const express = require("express");
const resourceRouter = express.Router();
const {getAllResources, getResourceById,createResource,updateResource,deleteResource}=require("../controller/resource");
const meMiddleware=require('../middleware/meMiddleware');
resourceRouter.get("/resources", getAllResources);

resourceRouter.get("/resource/:id", getResourceById);

resourceRouter.post("/resources",meMiddleware, createResource);

resourceRouter.put("/resource/:id",meMiddleware, updateResource);

resourceRouter.delete("/resource/:id",meMiddleware, deleteResource);

module.exports = resourceRouter;
