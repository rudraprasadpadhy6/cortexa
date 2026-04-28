const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const feedbackController = require('../controllers/feedback.controller');

router.post('/', auth, feedbackController.submitFeedback);
router.get('/', auth, feedbackController.getAllFeedbacks);

module.exports = router;
