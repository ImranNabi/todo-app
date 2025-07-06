const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true,
    },
}, 
{
    timestamps: true,
});

userSchema.methods.generateAuthToken = function () {
    return jwt.sign({ userId: this._id }, 'X7k9P2vQ8mL5jR3wY6zA1xC4bN0eT8hU', { expiresIn: '1h' });
};

const UserModel = mongoose.model('users', userSchema);

module.exports = UserModel;