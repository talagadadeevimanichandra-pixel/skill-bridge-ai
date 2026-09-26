const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Storage engine with sanitized filenames to prevent path traversal
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Sanitize original file name: keep only alphanumeric and safe dots
    const sanitizedBase = path.basename(file.originalname).replace(/[^a-zA-Z0-9._-]/g, '_');
    const ext = path.extname(sanitizedBase).toLowerCase() || '.pdf';
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `resume-${uniqueSuffix}${ext}`);
  },
});

// Allowed MIME types & extensions for resumes (PDF and plain text)
const ALLOWED_MIME_TYPES = new Set([
  'application/pdf',
  'text/plain',
  'application/x-pdf',
]);

const ALLOWED_EXTENSIONS = new Set(['.pdf', '.txt']);

// Strict file filter
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const mime = (file.mimetype || '').toLowerCase();

  // Reject dangerous file types immediately
  const dangerousExts = ['.exe', '.sh', '.bat', '.js', '.vbs', '.py', '.php', '.html', '.svg', '.jar'];
  if (dangerousExts.includes(ext)) {
    return cb(new Error('Invalid file format. Executables and scripts are strictly prohibited.'), false);
  }

  const isExtAllowed = ALLOWED_EXTENSIONS.has(ext);
  const isMimeAllowed = ALLOWED_MIME_TYPES.has(mime) || mime.includes('pdf') || mime.includes('text');

  if (isExtAllowed && isMimeAllowed) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file format. Only PDF and plain text documents are permitted.'), false);
  }
};

const multerInstance = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB strict limit
    files: 1,
  },
  fileFilter,
});

// Error-handling wrapper middleware for clean HTTP 400 responses
const handleUpload = (fieldName) => {
  return (req, res, next) => {
    multerInstance.single(fieldName)(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({
            success: false,
            message: 'File too large. Maximum permitted resume size is 5MB.',
          });
        }
        return res.status(400).json({
          success: false,
          message: `Upload error: ${err.message}`,
        });
      } else if (err) {
        return res.status(400).json({
          success: false,
          message: err.message || 'File upload failed validation.',
        });
      }
      next();
    });
  };
};

module.exports = {
  handleUpload,
  multerInstance,
};
