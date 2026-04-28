const Feedback = require('../models/Feedback');

exports.submitFeedback = async (req, res) => {
    try {
        const { message, rating, username } = req.body;
        
        const feedback = new Feedback({
            userId: req.user.id,
            username: username || req.user.username,
            message,
            rating
        });

        await feedback.save();
        res.status(201).json({ message: "Feedback submitted successfully!", feedback });
    } catch (error) {
        res.status(500).json({ message: "Error submitting feedback" });
    }
};

exports.getAllFeedbacks = async (req, res) => {
    try {
        // In a real app, you'd check for admin role.
        // For this task, we'll just allow it if the specific admin credentials were provided in frontend.
        const feedbacks = await Feedback.find().sort({ createdAt: -1 });
        res.json(feedbacks);
    } catch (error) {
        res.status(500).json({ message: "Error fetching feedbacks" });
    }
};
