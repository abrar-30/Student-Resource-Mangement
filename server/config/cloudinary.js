const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// ============================================
// CLOUDINARY CONFIGURATION
// ============================================

const validateCloudinaryConfig = () => {
  const required = ['CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET'];
  const missing = required.filter(key => !process.env[key]);

  if (missing.length > 0) {
    console.warn(`⚠️  Missing Cloudinary environment variables: ${missing.join(', ')}`);
  }
};

validateCloudinaryConfig();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ============================================
// FILE TYPES CONFIGURATION
// ============================================

const ALLOWED_FILE_TYPES = {
  images: {
    extensions: ['jpg', 'jpeg', 'png', 'gif'],
    mimeTypes: ['image/jpeg', 'image/png', 'image/gif'],
  },
  documents: {
    extensions: ['pdf', 'doc', 'docx', 'txt'],
    mimeTypes: [
      'application/pdf',
      'application/x-pdf',
      'application/octet-stream',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
    ],
  },
  presentations: {
    extensions: ['ppt', 'pptx'],
    mimeTypes: [
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'application/x-mspowerpoint',
      'application/zip',
    ],
  },
};

const allowedFormats = Object.values(ALLOWED_FILE_TYPES)
  .flatMap(type => type.extensions);

// ============================================
// CLOUDINARY STORAGE CONFIGURATION
// ============================================

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (_, file) => {
    const fileExtension = file.originalname.split('.').pop().toLowerCase();
    const isImage = ['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension);

    // Determine resource type based on file extension
    let resourceType = 'raw'; // Default to raw for documents
    if (isImage) {
      resourceType = 'image';
    }

    const params = {
      folder: 'student-resources',
      allowed_formats: allowedFormats,
      resource_type: resourceType,
      public_id: `${Date.now()}-${file.originalname.split('.')[0]}`,
    };

    // Only apply transformations to images
    if (isImage) {
      params.transformation = [
        {
          width: 1000,
          height: 1000,
          crop: 'limit',
          quality: 'auto',
        },
      ];
    }

    return params;
  },
});

// ============================================
// FILE FILTER
// ============================================

const fileFilter = (_, file, cb) => {
  try {
    const fileExtension = file.originalname.split('.').pop().toLowerCase();
    const isExtensionAllowed = allowedFormats.includes(fileExtension);

    if (!isExtensionAllowed) {
      const error = new Error(
        `Invalid file extension: .${fileExtension}. Allowed types: ${allowedFormats.join(', ')}`
      );
      error.code = 'INVALID_FILE_TYPE';
      return cb(error);
    }

    console.log(`✓ File accepted: ${file.originalname} (extension: .${fileExtension}, MIME: ${file.mimetype})`);
    cb(null, true);
  } catch (error) {
    cb(error);
  }
};

// ============================================
// MULTER CONFIGURATION - 20MB LIMIT
// ============================================

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 20 * 1024 * 1024, // 20MB limit
  },
  fileFilter: fileFilter,
});

// ============================================
// ERROR HANDLING MIDDLEWARE
// ============================================

const handleMulterError = (err, _, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        message: 'File size exceeds 20MB limit',
        error: err.message,
      });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        message: 'Too many files uploaded',
        error: err.message,
      });
    }
  }

  if (err && err.code === 'INVALID_FILE_TYPE') {
    return res.status(400).json({
      message: err.message,
      error: 'Invalid file type',
    });
  }

  if (err) {
    console.error('Multer/Cloudinary error:', err);

    // Check if it's a Cloudinary security restriction error
    if (err.message && err.message.includes('restricted')) {
      return res.status(400).json({
        message: 'File type is restricted by Cloudinary security settings',
        error: err.message,
        solution: 'Enable "Raw Files" in Cloudinary Security Settings: https://cloudinary.com/console/settings/security',
      });
    }

    return res.status(400).json({
      message: 'File upload error',
      error: err.message,
      details: err.http_code ? `HTTP ${err.http_code}` : 'Unknown error',
    });
  }

  next();
};

module.exports = {
  cloudinary,
  upload,
  handleMulterError,
  ALLOWED_FILE_TYPES,
  allowedFormats,
};
