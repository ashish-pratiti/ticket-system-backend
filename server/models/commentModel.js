//comment model 

const mangoose = require('mongoose');
const Schema = mangoose.Schema;

const CommentSchema = new Schema({
    comment: {
        type: String,
        required: true,
        trim: true
    },
    ticketId: {
        type: mangoose.Schema.Types.ObjectId,//this is the id of the ticket
        ref: 'ticket'//this is the ticket model
    },
    userId: {
        type: mangoose.Schema.Types.ObjectId,//this is the id of the user who created the comment
        ref: 'user'//this is the user model
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const Comment = mangoose.model('comment', CommentSchema);

module.exports=Comment;