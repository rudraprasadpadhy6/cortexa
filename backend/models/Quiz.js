const { BaseModel } = require('./db');

class Quiz extends BaseModel {
    static modelName = 'Quiz';
    static defaults = {
        topic: 'Auto-generated Quiz',
        difficulty: 'medium',
        score: 0,
        totalQuestions: 0,
        isBookmarked: false,
        questions: []
    };

    constructor(data = {}) {
        super(data);
        if (!this.completedDate) {
            this.completedDate = new Date().toISOString();
        }
    }
}

module.exports = Quiz;
