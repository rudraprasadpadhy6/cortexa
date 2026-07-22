const { BaseModel } = require('./db');

class Feedback extends BaseModel {
    static modelName = 'Feedback';
    static defaults = {};
}

module.exports = Feedback;
