const Resource = require("../models/resource");

const getAllResources = async (req, res) => {
  try {
    const resources = await Resource.find();
    res.status(200).json(resources);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching resources",
      error: error.message,
    });
  }
};

const getResourceById = async (req, res) => {
  try {
    const resource = await Resource.findOne({ id: req.params.id });
    if (!resource) {
      return res.status(404).json({ message: "Resource not found" });
    }
    res.status(200).json(resource);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching resource",
      error: error.message,
    });
  }
};

const createResource = async (req, res) => {
  try {
    const lastResource = await Resource.findOne().sort({ id: -1 });
    const newId = lastResource ? lastResource.id + 1 : 1;

    const newResource = new Resource({
      ...req.body,
      id: newId,
      user_id: req.user.id, // ✅ from JWT
    });

    const savedResource = await newResource.save();
    res.status(201).json(savedResource);
  } catch (error) {
    res.status(400).json({
      message: "Error creating resource",
      error: error.message,
    });
  }
};

const updateResource = async (req, res) => {
  try {
    const updatedResource = await Resource.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedResource) {
      return res.status(404).json({ message: "Resource not found" });
    }
    res.status(200).json(updatedResource);
  } catch (error) {
    res.status(400).json({
      message: "Error updating resource",
      error: error.message,
    });
  }
};

const deleteResource = async (req, res) => {
  try {
    const deletedResource = await Resource.findOneAndDelete({ id: req.params.id });
    if (!deletedResource) {
      return res.status(404).json({ message: "Resource not found" });
    }
    res.status(200).json({ message: "Resource deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting resource",
      error: error.message,
    });
  }
};

module.exports = {
  getAllResources,
  getResourceById,
  createResource,
  updateResource,
  deleteResource,
};
