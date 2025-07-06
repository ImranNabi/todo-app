const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
    task: {
        type: String,
        required: true,
    },
    done: {
      type: Boolean,
      default: false,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
}, 
{
  timestamps: true,
}
);

const TodoModel = mongoose.model('tasks', todoSchema);

module.exports = TodoModel;