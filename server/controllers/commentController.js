const Comment= require('../models/commentModel');

// Controller methods

const commentController={
    getAllCommentsByTicket: async (req, res) => {
        try {
            const ticketId = req.params.ticketId;
            const comments = await Comment.find({ ticketId }).sort({ date: -1 });
            res.status(200).json(comments);
        } catch (error) {
            res.status(500).json({ error: 'An error occurred while fetching comments.' });
        }
    }
    
};

module.exports=commentController;