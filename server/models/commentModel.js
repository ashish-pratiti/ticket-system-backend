const mangoose = require('mongoose');
const Schema = mangoose.Schema;

const CommentSchema = new Schema({
    comment: {
        type: String,
        required: true,
        trim: true
    },
    ticketId: {
        type: mangoose.Schema.Types.ObjectId,
        ref: 'ticket'
    },
    userId: {
        type: mangoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    date: {
        type: Date,
        default: Date.now
    },
    useremail:{
        type: String,
    }
});

const Comment = mangoose.model('comment', CommentSchema);

module.exports=Comment;