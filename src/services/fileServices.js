// src/services/fileServices.js
const fs = require('fs');
const path = require('path');
const File = require('./models/file'); // Ensure correct path

const uploadFile = async (userId, file) => {
  try {
    // Define upload path (ensure 'uploads' folder exists)
    const uploadPath = path.join(__dirname, '../uploads', file.originalname);

    // Create the 'uploads' directory if it doesn't exist
    if (!fs.existsSync(path.join(__dirname, '../uploads'))) {
      fs.mkdirSync(path.join(__dirname, '../uploads'));
    }

    // Write file buffer to the specified path
    fs.writeFileSync(uploadPath, file.buffer);

    // Save file metadata to the database
    const newFile = new File({
      name: file.originalname,
      path: uploadPath,
      size: file.size,
      user: userId,
    });

    await newFile.save();
    return newFile;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

module.exports = {
  uploadFile,
};
