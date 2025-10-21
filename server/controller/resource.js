const Resource = require("../models/resource");
const { cloudinary } = require("../config/cloudinary");

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Validate multer file object
 * @param {Object} file - Multer file object
 * @returns {boolean} - True if file is valid
 */
const validateFileObject = (file) => {
  if (!file) return false;

  // Check for Cloudinary-specific properties
  const hasCloudinaryProps = file.path && file.filename;

  // Check for standard multer properties
  const hasStandardProps = file.originalname && file.size && file.mimetype;

  return hasCloudinaryProps && hasStandardProps;
};

/**
 * Delete file from Cloudinary
 * @param {string} publicId - Cloudinary public ID
 * @returns {Promise<void>}
 */
const deleteFileFromCloudinary = async (publicId) => {
  if (!publicId) {
    console.warn('⚠️  No public ID provided for deletion');
    return;
  }

  try {
    const result = await cloudinary.uploader.destroy(publicId);
    console.log(`✓ File deleted from Cloudinary: ${publicId}`, result);
  } catch (error) {
    console.error(`✗ Error deleting file from Cloudinary (${publicId}):`, error.message);
    throw error;
  }
};

// ============================================
// RESOURCE CONTROLLERS
// ============================================

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
    // ✓ Validate file upload
    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded. Please upload a file.",
        code: 'NO_FILE_UPLOADED',
      });
    }

    // ✓ Validate file object structure
    if (!validateFileObject(req.file)) {
      // Clean up uploaded file if validation fails
      if (req.file.filename) {
        await deleteFileFromCloudinary(req.file.filename).catch(err =>
          console.error('Cleanup error:', err.message)
        );
      }

      return res.status(400).json({
        message: "Invalid file object. File upload may have failed.",
        code: 'INVALID_FILE_OBJECT',
      });
    }

    // ✓ Validate required fields
    const { title, type, branch, semester, subject, description } = req.body;
    if (!title || !type || !branch || !semester || !subject || !description) {
      // Clean up uploaded file if validation fails
      await deleteFileFromCloudinary(req.file.filename).catch(err =>
        console.error('Cleanup error:', err.message)
      );

      return res.status(400).json({
        message: "Missing required fields: title, type, branch, semester, subject, description",
        code: 'MISSING_FIELDS',
      });
    }

    // ✓ Get next resource ID
    const lastResource = await Resource.findOne().sort({ id: -1 });
    const newId = lastResource ? lastResource.id + 1 : 1;

    // ✓ Create new resource
    const newResource = new Resource({
      ...req.body,
      id: newId,
      user_id: req.user.id, // ✅ from JWT
      file_url: req.file.path,
      file_public_id: req.file.filename,
      file_name: req.file.originalname,
      file_size: req.file.size,
      file_type: req.file.mimetype,
    });

    // ✓ Save to database
    const savedResource = await newResource.save();

    console.log(`✓ Resource created successfully (ID: ${newId})`);
    res.status(201).json({
      message: "Resource created successfully",
      data: savedResource,
    });
  } catch (error) {
    // ✗ Clean up uploaded file on error
    if (req.file && req.file.filename) {
      await deleteFileFromCloudinary(req.file.filename).catch(err =>
        console.error('Cleanup error:', err.message)
      );
    }

    console.error('Create resource error:', error);
    res.status(400).json({
      message: "Error creating resource",
      error: error.message,
      code: 'CREATE_ERROR',
    });
  }
};

const updateResource = async (req, res) => {
  try {
    // ✓ Find existing resource
    const existingResource = await Resource.findOne({ id: req.params.id });
    if (!existingResource) {
      // Clean up uploaded file if resource not found
      if (req.file && req.file.filename) {
        await deleteFileFromCloudinary(req.file.filename).catch(err =>
          console.error('Cleanup error:', err.message)
        );
      }

      return res.status(404).json({
        message: "Resource not found",
        code: 'RESOURCE_NOT_FOUND',
      });
    }

    let updateData = { ...req.body };

    // ✓ If a new file is uploaded, delete the old file from Cloudinary and update file info
    if (req.file) {
      // Validate new file object
      if (!validateFileObject(req.file)) {
        await deleteFileFromCloudinary(req.file.filename).catch(err =>
          console.error('Cleanup error:', err.message)
        );

        return res.status(400).json({
          message: "Invalid file object. File upload may have failed.",
          code: 'INVALID_FILE_OBJECT',
        });
      }

      try {
        // Delete old file from Cloudinary
        await deleteFileFromCloudinary(existingResource.file_public_id);
      } catch (cloudinaryError) {
        console.error("Error deleting old file from Cloudinary:", cloudinaryError.message);
        // Continue with update even if old file deletion fails
      }

      // Update file information
      updateData.file_url = req.file.path;
      updateData.file_public_id = req.file.filename;
      updateData.file_name = req.file.originalname;
      updateData.file_size = req.file.size;
      updateData.file_type = req.file.mimetype;
    }

    // ✓ Update resource in database
    const updatedResource = await Resource.findOneAndUpdate(
      { id: req.params.id },
      updateData,
      { new: true, runValidators: true }
    );

    console.log(`✓ Resource updated successfully (ID: ${req.params.id})`);
    res.status(200).json({
      message: "Resource updated successfully",
      data: updatedResource,
    });
  } catch (error) {
    // ✗ Clean up uploaded file on error
    if (req.file && req.file.filename) {
      await deleteFileFromCloudinary(req.file.filename).catch(err =>
        console.error('Cleanup error:', err.message)
      );
    }

    console.error('Update resource error:', error);
    res.status(400).json({
      message: "Error updating resource",
      error: error.message,
      code: 'UPDATE_ERROR',
    });
  }
};

const deleteResource = async (req, res) => {
  try {
    // ✓ Find resource to delete
    const resourceToDelete = await Resource.findOne({ id: req.params.id });
    if (!resourceToDelete) {
      return res.status(404).json({
        message: "Resource not found",
        code: 'RESOURCE_NOT_FOUND',
      });
    }

    // ✓ Delete file from Cloudinary
    try {
      await deleteFileFromCloudinary(resourceToDelete.file_public_id);
    } catch (cloudinaryError) {
      console.error("Error deleting file from Cloudinary:", cloudinaryError.message);
      // Continue with deletion even if file deletion fails
    }

    // ✓ Delete resource from database
    await Resource.findOneAndDelete({ id: req.params.id });

    console.log(`✓ Resource deleted successfully (ID: ${req.params.id})`);
    res.status(200).json({
      message: "Resource deleted successfully",
      code: 'DELETE_SUCCESS',
    });
  } catch (error) {
    console.error('Delete resource error:', error);
    res.status(500).json({
      message: "Error deleting resource",
      error: error.message,
      code: 'DELETE_ERROR',
    });
  }
};

// ============================================
// DOWNLOAD RESOURCE
// ============================================

const downloadResource = async (req, res) => {
  try {
    const resource = await Resource.findOne({ id: req.params.id });

    if (!resource) {
      return res.status(404).json({
        message: "Resource not found",
        code: 'RESOURCE_NOT_FOUND',
      });
    }

    // Validate file URL exists
    if (!resource.file_url) {
      return res.status(400).json({
        message: "File URL not available",
        code: 'FILE_URL_NOT_FOUND',
      });
    }

    console.log(`✓ Download initiated: ${resource.file_name} (Resource ID: ${resource.id})`);
    console.log(`File URL: ${resource.file_url}`);

    // Add download parameter to Cloudinary URL
    const downloadUrl = resource.file_url.includes('?')
      ? resource.file_url + '&fl_attachment'
      : resource.file_url + '?fl_attachment';

    console.log(`✓ Download URL: ${downloadUrl}`);

    // Set headers to force download
    res.setHeader('Content-Disposition', `attachment; filename="${resource.file_name}"`);
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    // Redirect to Cloudinary URL with download flag
    res.redirect(downloadUrl);

    console.log(`✓ Redirected to Cloudinary with download flag`);
  } catch (error) {
    console.error('Download resource error:', error);
    res.status(500).json({
      message: "Error downloading resource",
      error: error.message,
      code: 'DOWNLOAD_ERROR',
    });
  }
};

module.exports = {
  getAllResources,
  getResourceById,
  createResource,
  updateResource,
  deleteResource,
  downloadResource,
};
