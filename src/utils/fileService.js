const fs = require('fs');

exports.deleteFile = (filePath) => {
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error('Failed to delete file:', filePath, err);
    } else {
      console.log('Deleted file:', filePath);
    }
  });
};
