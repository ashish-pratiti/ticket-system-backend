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
        type:mangoose.Schema.Types.ObjectId,
        ref:'user'
    },      
    useremail:{
        type:String,
        required:true,   
    },
    agent:{
        type:mangoose.Schema.Types.ObjectId, 
        ref:'user'
    },
    agentemail:{
        type:String,
    },  
    comments:[{
        type:mangoose.Schema.Types.ObjectId,
        ref:'comment'
    }],
    history:[{
        agent:{
            type:mangoose.Schema.Types.ObjectId,
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