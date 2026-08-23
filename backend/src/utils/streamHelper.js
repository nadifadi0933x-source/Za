const fs = require('fs');
const path = require('path');

const streamVideo = (res, videoPath) => {
  const stat = fs.statSync(videoPath);
  const fileSize = stat.size;
  const range = res.headers.range;

  if (range) {
    const parts = range.replace(/bytes=/, '').split('-');
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    const chunksize = end - start + 1;
    const file = fs.createReadStream(videoPath, { start, end });

    const head = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': 'video/mp4',
    };

    res.writeHead(206, head);
    file.pipe(res);
  } else {
    const head = {
      'Content-Length': fileSize,
      'Content-Type': 'video/mp4',
    };
    res.writeHead(200, head);
    fs.createReadStream(videoPath).pipe(res);
  }
};

const getVideoDuration = async (videoPath) => {
  try {
    const ffmpeg = require('fluent-ffmpeg');
    return new Promise((resolve, reject) => {
      ffmpeg.ffprobe(videoPath, (err, metadata) => {
        if (err) {
          reject(err);
        } else {
          resolve(metadata.format.duration);
        }
      });
    });
  } catch (error) {
    return null;
  }
};

const getVideoMetadata = async (videoPath) => {
  try {
    const ffmpeg = require('fluent-ffmpeg');
    return new Promise((resolve, reject) => {
      ffmpeg.ffprobe(videoPath, (err, metadata) => {
        if (err) {
          reject(err);
        } else {
          resolve(metadata);
        }
      });
    });
  } catch (error) {
    return null;
  }
};

module.exports = {
  streamVideo,
  getVideoDuration,
  getVideoMetadata,
};
