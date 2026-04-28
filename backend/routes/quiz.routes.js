const express = require('express');
const router = express.Router();
const multer = require('multer');
const auth = require('../middleware/auth');
const quizController = require('../controllers/quiz.controller');

const upload = multer({ storage: multer.memoryStorage() });

router.post('/generate', auth, upload.single('document'), quizController.generateQuiz);
router.get('/', auth, quizController.getQuizHistory);
router.get('/:id', auth, quizController.getQuizById);
router.post('/:id/submit', auth, quizController.submitQuizResult);
router.patch('/:id/bookmark', auth, quizController.toggleBookmarkQuiz);

module.exports = router;
