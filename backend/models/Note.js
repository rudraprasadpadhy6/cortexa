const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        default: 'Generated Notes'
    },
    content: {
        type: String, /* Markdown formatted notes or HTML string */
        required: true
    },
    type: {
        type: String,
        enum: ['short', 'detailed'],
        default: 'detailed'
    },
    isBookmarked: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

module.exports = mongoose.model('Note', noteSchema);
