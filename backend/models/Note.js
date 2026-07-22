const { BaseModel } = require('./db');

class Note extends BaseModel {
    static modelName = 'Note';
    static defaults = {
        title: 'Generated Notes',
        type: 'detailed',
        isBookmarked: false
    };
}

module.exports = Note;
