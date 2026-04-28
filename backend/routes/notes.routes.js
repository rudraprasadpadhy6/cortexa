const express = require('express');
const router = express.Router();
const multer = require('multer');
const auth = require('../middleware/auth');
const notesController = require('../controllers/notes.controller');

const upload = multer({ storage: multer.memoryStorage() });

router.post('/generate', auth, upload.single('document'), notesController.generateNote);
router.get('/', auth, notesController.getNotes);
router.get('/:id', auth, notesController.getNoteById);
router.patch('/:id/bookmark', auth, notesController.toggleBookmarkNote);

module.exports = router;
