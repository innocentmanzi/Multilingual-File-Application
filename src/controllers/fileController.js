const File = require('../models/File');
const { fileQueue } = require('../config/redis');

// Upload a file
const uploadFile = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized: No user information found' });
    }

    const { file } = req;
    if (!file) {
      return res.status(400).json({ message: 'Invalid file data' });
    }

    const fileData = {
      name: file.originalname,
      path: file.path,
      size: file.size,
      user: req.user.id, // User ID from the middleware
    };

    const uploadedFile = await File.create(fileData);

    // Add file to Redis queue for processing (e.g., thumbnail generation)
    fileQueue.add({ fileName: file.originalname, userId: req.user.id });

    res.status(201).json({ message: 'File uploaded successfully', file: uploadedFile });
  } catch (err) {
    res.status(500).json({ message: 'File upload failed', error: err.message });
  }
};

// Get files for the logged-in user
const getFiles = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized: No user information found' });
    }

    const files = await File.find({ user: req.user.id });
    res.status(200).json({ files });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch files', error: err.message });
  }
};

// Delete a file
const deleteFile = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized: No user information found' });
    }

    const file = await File.findById(req.params.id);

    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    if (file.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden: You are not authorized to delete this file' });
    }

    await file.deleteOne();
    res.status(200).json({ message: 'File deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete file', error: err.message });
  }
};

// Update file details
const updateFile = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized: No user information found' });
    }

    const { id } = req.params;
    const { name, path, size } = req.body;

    const file = await File.findById(id);

    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    if (file.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden: You are not authorized to update this file' });
    }

    if (name) file.name = name;
    if (path) file.path = path;
    if (size) file.size = size;

    const updatedFile = await file.save();
    res.status(200).json({ message: 'File updated successfully', file: updatedFile });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update file', error: err.message });
  }
};

module.exports = { uploadFile, getFiles, deleteFile, updateFile };
