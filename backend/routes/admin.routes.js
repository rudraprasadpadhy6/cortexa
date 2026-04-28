const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');

const adminAuth = (req, res, next) => {
    if (req.headers['x-admin-key'] === 'admin123') {
        next();
    } else {
        res.status(403).json({ message: "Admin access denied" });
    }
};

router.get('/users', adminAuth, adminController.getAllUsers);
router.get('/feedback', adminAuth, adminController.getAllFeedback);

module.exports = router;
