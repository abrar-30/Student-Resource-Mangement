const express = require("express");
const resourceRouter = express.Router();
const {getAllResources, getResourceById,createResource,updateResource,deleteResource}=require("../controllers/resourceController");
resourceRouter.get("/resources", getAllResources);

resourceRouter.get("/resource/:id", getResourceById);

resourceRouter.post("/resources", createResource);

resourceRouter.put("/resource/:id", updateResource);

resourceRouter.delete("/resource/:id", deleteResource);

module.exports = resourceRouter;
