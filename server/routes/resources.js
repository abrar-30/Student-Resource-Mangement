const express = require("express");
const resourceRouter = express.Router();
const {
  getAllResources,
  getResourceById,
  createResource,
  updateResource,
  deleteResource,
  downloadResource
} = require("../controller/resource");
const meMiddleware = require('../middleware/meMiddleware');
const { upload, handleMulterError } = require('../config/cloudinary');

// ============================================
// GET ROUTES
// ============================================

resourceRouter.get("/resources", getAllResources);

resourceRouter.get("/resource/:id", getResourceById);

resourceRouter.get("/resource/:id/download", downloadResource);

// ============================================
// POST ROUTES
// ============================================

resourceRouter.post(
  "/resources",
  meMiddleware,
  upload.single('file'),
  handleMulterError,
  createResource
);

// ============================================
// PUT ROUTES
// ============================================

resourceRouter.put(
  "/resource/:id",
  meMiddleware,
  upload.single('file'),
  handleMulterError,
  updateResource
);

// ============================================
// DELETE ROUTES
// ============================================

resourceRouter.delete(
  "/resource/:id",
  meMiddleware,
  deleteResource
);

module.exports = resourceRouter;
