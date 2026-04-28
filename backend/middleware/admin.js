const User = require('../models/User');

module.exports = async function (req, res, next) {
    try {
        const user = await User.findById(req.user.id);
        if (user && user.role === 'admin') {
            next();
        } else {
            res.status(403).json({ message: "Access Denied: Admin privileges required" });
        }
    } catch (err) {
        res.status(500).json({ message: "Server error during authorization" });
    }
};
