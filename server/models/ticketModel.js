const mangoose=require('mongoose');
const Schema=mangoose.Schema;

const TicketSchema=new Schema({
    ticketId: {
        type: String,
        unique: true,
        
    },
    title:{
        type:String,
        required:true,
        trim:true
    },
    category:{
        type:String,
        
    },
    description:{
        type:String,
        required:true
    },
    status:{
        type:String,
        default:'pending',
        enum:["pending","open","closed"]
    },
    date:{
        type:Date,
        default:Date.now
    },
    user:{
        type:mangoose.Schema.Types.ObjectId,//this is the id of the user who created the ticket
        ref:'user'//this is the user model
    },      
    useremail:{
        type:String,
        required:true,   
    },

    agent:{
        type:mangoose.Schema.Types.ObjectId, //this is the id of the agent who is assigned to the ticket
        ref:'user'
    },
    comments:[{
        type:mangoose.Schema.Types.ObjectId,//this is the id of the comment
        ref:'comment'//this is the comment model
    }],
    // what is does - it stores the history of the ticket
    //format - [{agent:agentId, action:'status changed to open', date:Date.now}]
    history:[{
        agent:{
            type:mangoose.Schema.Types.ObjectId,//this is the id of the agent who is assigned to the ticket
            ref:'user'
        },
        action:{
            type:String,
            required:true
        },
        date:{
            type:Date,
            default:Date.now
        }
    }]
});


const Ticket=mangoose.model('ticket',TicketSchema);

module.exports=Ticket;