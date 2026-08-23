const path = require('path');
const fs = require('fs');
const config = require('../config/environment');

const deleteFile = (filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error deleting file:', error);
    return false;
  }
};

const moveFile = (source, destination) => {
  try {
    const dir = path.dirname(destination);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.renameSync(source, destination);
    return true;
  } catch (error) {
    console.error('Error moving file:', error);
    return false;
  }
};

const copyFile = (source, destination) => {
  try {
    const dir = path.dirname(destination);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.copyFileSync(source, destination);
    return true;
  } catch (error) {
    console.error('Error copying file:', error);
    return false;
  }
};

const getFileInfo = (filePath) => {
  try {
    if (!fs.existsSync(filePath)) {
      return null;
    }
    const stats = fs.statSync(filePath);
    return {
      size: stats.size,
      created: stats.birthtime,
      modified: stats.mtime,
      isFile: stats.isFile(),
      extension: path.extname(filePath),
    };
  } catch (error) {
    console.error('Error getting file info:', error);
    return null;
  }
};

const ensureDirectory = (dirPath) => {
  try {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    return true;
  } catch (error) {
    console.error('Error creating directory:', error);
    return false;
  }
};

module.exports = {
  deleteFile,
  moveFile,
  copyFile,
  getFileInfo,
  ensureDirectory,
};
