const { BaseModel } = require('./db');

class User extends BaseModel {
    static modelName = 'User';
    static defaults = {
        badges: [],
        role: 'user'
    };
}

module.exports = User;
