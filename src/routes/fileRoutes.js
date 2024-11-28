const express = require('express');
const multer = require('multer');
const { protect } = require('../middlewares/auth');
const { uploadFile, getFiles, deleteFile, updateFile } = require('../controllers/fileController');
const { setLanguage } = require('../middlewares/language');
const { createQueue } = require('../config/redis'); // Function to create a Redis queue

const router = express.Router();

// Middleware for language handling
router.use(setLanguage);

// Configure Multer for file uploads (uses memory storage)
const upload = multer({ storage: multer.memoryStorage() });

// Initialize the Redis queue
const fileQueue = createQueue('file-upload');

/**
 * @swagger
 * /api/files/upload:
 *   post:
 *     summary: Upload a file
 *     tags: [Files]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: File uploaded successfully
 *       400:
 *         description: Invalid file data
 *       500:
 *         description: Internal server error
 */
router.post('/upload', protect, upload.single('file'), async (req, res) => {
  try {
    const userId = req.user.id; // User ID from the `protect` middleware
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Add the file upload task to the Redis queue
    await fileQueue.add({ userId, file: file.buffer.toString('base64'), originalName: file.originalname });

    res.status(201).json({ message: 'File upload task queued successfully' });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ message: 'Error uploading file', error: error.message });
  }
});

/**
 * @swagger
 * /api/files:
 *   get:
 *     summary: Get all files for the logged-in user
 *     tags: [Files]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of files
 *       500:
 *         description: Failed to fetch files
 */
router.get('/', protect, getFiles);

/**
 * @swagger
 * /api/files/{id}:
 *   delete:
 *     summary: Delete a file
 *     tags: [Files]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: File deleted successfully
 *       404:
 *         description: File not found or not authorized
 *       500:
 *         description: Failed to delete file
 */
router.delete('/:id', protect, deleteFile);

/**
 * @swagger
 * /api/files/{id}:
 *   put:
 *     summary: Update file details
 *     tags: [Files]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: File updated successfully
 *       404:
 *         description: File not found or not authorized
 *       500:
 *         description: Failed to update file
 */
router.put('/:id', protect, async (req, res) => {
  try {
    const { id } = req.params; // File ID from the path
    const userId = req.user.id; // User ID from the `protect` middleware
    const updateData = req.body;

    // Add the file update task to the Redis queue
    await fileQueue.add('file-update', { id, userId, updateData });

    res.status(200).json({ message: 'File update task queued successfully' });
  } catch (error) {
    console.error('Error updating file:', error);
    res.status(500).json({ message: 'Error updating file', error: error.message });
  }
});

module.exports = router;
