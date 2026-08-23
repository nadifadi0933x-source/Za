const multer = require('multer');
const path = require('path');
const fs = require('fs');
const config = require('../config/environment');
const constants = require('../config/constants');

const uploadDir = config.uploadPath;

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const imageDir = path.join(uploadDir, 'images');
const videoDir = path.join(uploadDir, 'videos');
const thumbnailDir = path.join(uploadDir, 'thumbnails');

if (!fs.existsSync(imageDir)) fs.mkdirSync(imageDir, { recursive: true });
if (!fs.existsSync(videoDir)) fs.mkdirSync(videoDir, { recursive: true });
if (!fs.existsSync(thumbnailDir)) fs.mkdirSync(thumbnailDir, { recursive: true });

const storage = multer.diskStorage({
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
  destination: (req, file, cb) => {
    if (constants.MIME_TYPES.IMAGE.includes(file.mimetype)) {
      cb(null, imageDir);
    } else if (constants.MIME_TYPES.VIDEO.includes(file.mimetype)) {
      cb(null, videoDir);
    } else {
      cb(new Error('Invalid file type'));
    }
  },
});

const fileFilter = (req, file, cb) => {
  if (constants.MIME_TYPES.IMAGE.includes(file.mimetype) || constants.MIME_TYPES.VIDEO.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Unsupported file type'));
  }
};

const upload = multer({
  storage,
  limits: { fileSize: config.maxFileSize },
  fileFilter,
});

const uploadImage = upload.single('image');
const uploadVideo = upload.single('video');
const uploadThumbnail = upload.single('thumbnail');

const handleUpload = (type) => {
  return (req, res, next) => {
    switch (type) {
      case 'image':
        return uploadImage(req, res, next);
      case 'video':
        return uploadVideo(req, res, next);
      case 'thumbnail':
        return uploadThumbnail(req, res, next);
      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid upload type',
        });
    }
  };
};

module.exports = {
  upload,
  uploadImage,
  uploadVideo,
  uploadThumbnail,
  handleUpload,
};
