const Ticket = require('../models/ticketModel'); // Adjust the path as needed
const User = require('../models/userModel'); 
const Comment = require('../models/commentModel');

// Controller methods
const ticketController = {
  // Create a new ticket
  createTicket: async (req, res) => {
    try {
      const newTicket = new Ticket(req.body);
      const savedTicket = await newTicket.save();
      res.status(201).json(savedTicket);
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while creating the ticket.' });
    }
  },

 
  // Get a specific ticket by ID
  getTicketById: async (req, res) => {
    try {
      const ticket = await Ticket.findById(req.params.id);
      if (!ticket) {
        return res.status(404).json({ error: 'Ticket not found.' });
      }
      res.status(200).json(ticket);
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while fetching the ticket.' });
    }
  },

  // Update a ticket by ID
  updateTicket: async (req, res) => {
    try {
      const updatedTicket = await Ticket.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!updatedTicket) {
        return res.status(404).json({ error: 'Ticket not found.' });
      }
      res.status(200).json(updatedTicket);
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while updating the ticket.' });
    }
  },

  // Delete a ticket by ID
  deleteTicket: async (req, res) => {
    try {
      const deletedTicket = await Ticket.findByIdAndRemove(req.params.id);
      if (!deletedTicket) {
        return res.status(404).json({ error: 'Ticket not found.' });
      }
      res.status(200).json({ message: 'Ticket deleted successfully.' });
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while deleting the ticket.' });
    }
  },
    // Get tickets by search name (autocomplete) 
    //Enable only admin and supervisor to access this route
    getTicketsBySearchName: async (req, res) => {
        try {
          const searchQuery = req.query.name; // Assuming you pass the search query as a query parameter
    
          const regex = new RegExp(searchQuery, 'i'); // Case-insensitive regular expression
          
          const tickets = await Ticket.find({ title: regex }).limit(10); // Limit the number of results
          
          res.status(200).json(tickets);
        } catch (error) {
          res.status(500).json({ error: 'An error occurred while fetching tickets.' });
        }
      },

      // Assign a ticket to an agent by admin
      assignTicketToAgent: async (req, res) => {
        try {
          const ticketId = req.body.ticketId;
          const agentId = req.body.agentId;

          
          // Check if the requesting user is an admin
          //const requestingUserId = req.user.id;//original // Assuming you have user information stored in req.user
          const requestingUserId = req.body.id; // Assuming you have user information stored in req.user
          
                // Check if the agent exists and is an agent role
                const agent = await User.findOne({ _id: agentId, role: "agent" });
                console.log('agent: ', agent);
                if (!agent) {
                  return res.status(404).json({ error: 'Agent not found.' });
                }
          console.log('requestingUserId: ', requestingUserId);
          const requestingUser = await User.findOne({ _id: requestingUserId , role: "admin" });

          if (!requestingUser || requestingUser.role !== "admin") {
            return res.status(403).json({ error: 'Only admin users are allowed to assign tickets.' });
          }
          

          // Update the ticket's agent field
          const updatedTicket = await Ticket.findByIdAndUpdate(
            ticketId,
            { agent: agentId },
            { new: true }
          );
          
          console.log('updatedTicket: ', updatedTicket);

          if (!updatedTicket) {
            return res.status(404).json({ error: 'Ticket not found.' });
          }
          
          res.status(200).json(updatedTicket);
        } catch (error) {
          // res.status(500).json({ error: 'An error occurred while assigning the ticket.' });
          console.log(error);
        }
      },


  //Successfully update the ticket status and add a comment -after a lot of struggle :(
  updateTicketStatusAndComment : async (req, res, next) => {
  try {
    const { ticketId, newStatus, comment } = req.body;
   // const agentId = req.user.userId; // Assuming you have extracted the agent's userId from the JWT

    //checked if req status is invalid 
    if (!['open', 'pending', 'closed'].includes(newStatus)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const userId = req.body.id; 

    // Find the ticket by its ID
    const ticket = await Ticket.findById(ticketId);

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    // Only allow agents to update 
    //comment because we want to allow user to update the ticket status 
    // if (ticket.agent.toString() !== userId) {
    //   return res.status(403).json({ message: 'You do not have permission to update this ticket' });
    // }

    // Update the ticket's status and add a comment
    ticket.status = newStatus;

    //create a new comment using the comment model
    const newComment = new Comment({ comment:comment , ticketId:ticketId ,userId: userId });

    //save the comment in the database
    await newComment.save();


    //get the comment id
    const commentId = newComment._id;

    //push the comment id in the ticket comments array
    ticket.comments.push(commentId);


    // Update the ticket in the database
    await ticket.save();

   // res.status(200).json({ message: 'Ticket status and comment updated successfully' });
    res.status(200).json(ticket);

  } catch (error) {
    next(error);
  }
},

//get ticket by id 
getTicketById:async(req,res)=>{
  try{
    const ticketId=req.body.ticketId;
    console.log(ticketId);
    const ticket=await Ticket.findById(ticketId);
        res.status(200).json(ticket);
        
      }catch(error){
        console.log(error);
        res.status(500).json({ error: 'An error occurred while fetching tickets.' });
      }
    },
    
    //get ticket details by id 
    //localhost:3002/ticket/${ticketId}
    getTicketDetailsById:async(req,res)=>{
      try{
        const ticketId=req.params.ticketId;
        console.log(ticketId);
        const ticket=await Ticket.findById(ticketId);
        res.status(200).json(ticket);
      }catch(error){
        console.log(error);
        res.status(500).json({ error: 'An error occurred while fetching tickets.' });
      }
    },
    
    
    // get all ticket Created By user
      getAllTicketCreatedByUser:async(req,res)=>{
        try{
            const userId=req.query.userId;
            console.log(userId);
            const tickets=await Ticket.find({user:userId});
            console.log(tickets);
            res.status(200).json(tickets);
        }catch(error){
          console.log(error);
          res.status(500).json({ error: 'An error occurred while fetching tickets.' });
        }
      },

    //get all tickets assigned to agent

    getTickets:async(req,res)=>{
      const userId=req.query.userId;
      const role =req.query.role;

      if(role==='admin'){
        // get all tickets
        try{
          const tickets = await Ticket.find();
          res.status(200).json(tickets);
        }catch(error){
          console.log('error occured',error);
        }
      }
      else if (role === 'agent'){
        //assigned tickets
        try{
          const tickets=await Ticket.find({agent:userId});
          res.status(200).json(tickets);
        }catch(error){
          console.log('error',error);
        }
      }else{
        //ticket created by user
        try{  
          const tickets=await Ticket.find({user:userId});
          res.status(200).json(tickets);

        }catch(error){
          console.log('error',error);
        }

      }

    },


  getAssignedAgentTickets:async(req,res)=>{
    try{
        const agentId=req.query.agentId;
        console.log(agentId);
        if(agentId==null || agentId==undefined){
          return res.status(404).json({ error: 'Agent not found.' });
        }
        const tickets=await Ticket.find({agent:agentId});
        res.status(200).json(tickets);
    }catch(error){
      console.log(error);
    }
    },

   // Get all tickets
   getAllTickets: async (req, res) => {
    try {
      const tickets = await Ticket.find();
      res.status(200).json(tickets);
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while fetching tickets.' });
    }
  },



getTicketsTodayByTwoHourIntervals : async (req, res) => {
      try {
          const indiaTimeOffset = 5.5 * 60 * 60 * 1000; // UTC offset for India (UTC+5:30) in milliseconds
  
          const now = new Date();
          const today = new Date(now - indiaTimeOffset); // Adjusted for India timezone
          today.setHours(0, 0, 0, 0); // Set the time to midnight
  
          const tomorrow = new Date(today);
          tomorrow.setDate(tomorrow.getDate() + 1); // Set to the next day
  
          const tickets = await Ticket.aggregate([
              {
                  $match: {
                      date: { $gte: today, $lt: tomorrow }
                  }
              },
              {
                  $group: {
                      _id: { $hour: { $add: ['$date', indiaTimeOffset] } },
                      count: { $sum: 1 }
                  }
              },
              {
                  $project: {
                      _id: 0,
                      hour: {
                          $concat: [
                              {
                                  $cond: [
                                      { $lt: ['$_id', 12] },
                                      { $toString: '$_id' },
                                      { $toString: { $subtract: ['$_id', 12] } }
                                  ]
                              },
                              {
                                  $cond: [
                                      { $lt: ['$_id', 12] },
                                      'am',
                                      'pm'
                                  ]
                              }
                          ]
                      },
                      count: 1
                  }
              },
              {
                  $sort: {
                      hour: 1
                  }
              }
          ]);
  
          res.status(200).json(tickets);
      } catch (error) {
          res.status(500).json({ error: 'An error occurred while fetching tickets.' });
      }
  },


  // ('/by-date/:date',
// Fetch ticket data for a specific date
//EXPERIMENTING IT..
 getTicketTodayBySpecificDay: async (req, res) => {
  try {
    const selectedDate = new Date(req.params.date);
    const nextDay = new Date(selectedDate);
    nextDay.setDate(nextDay.getDate() + 1);

    const tickets = await Ticket.aggregate([
      {
        $match: {
          date: { $gte: selectedDate, $lt: nextDay },
        },
      },
      {
        $group: {
          _id: { $hour: { $add: ['$date', 5.5 * 60 * 60 * 1000] } },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          hour: {
            $concat: [
              {
                $cond: [
                  { $lt: ['$_id', 12] },
                  { $toString: '$_id' },
                  { $toString: { $subtract: ['$_id', 12] } },
                ],
              },
              {
                $cond: [{ $lt: ['$_id', 12] }, 'am', 'pm'],
              },
            ],
          },
          count: 1,
        },
      },
      {
        $sort: {
          hour: 1,
        },
      },
    ]);

    res.status(200).json(tickets);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching tickets.' });
  }
},




// Fetch ticket data for a selected month
//'/by-month/:year/:month'

getTicketMonthBySpecificMonth: async (req, res) => {
  try {
    const selectedYear = parseInt(req.query.year);
    const selectedMonth = parseInt(req.query.month);

    console.log('selectemonth',selectedMonth);
    console.log('selectedYear',selectedYear);

    const startDate = new Date(selectedYear, selectedMonth - 1, 1); // Month is 0-indexed
    const endDate = new Date(selectedYear, selectedMonth, 0);

    const tickets = await Ticket.aggregate([
      {
        $match: {
          date: { $gte: startDate, $lt: endDate },
        },
      },
      {
        $group: {
          _id: { $dayOfMonth: '$date' },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          day: '$_id',
          count: 1,
        },
      },
      {
        $sort: {
          day: 1,
        },
      },
    ]);

    res.status(200).json(tickets);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching tickets.' });
  }
},

  



updateStatus: async (req, res) => {
  const { ticketIds, newStatus } = req.query;

  try {
    const updatedTickets = await Ticket.updateMany(
      { _id: { $in: ticketIds.split(',') } },
      { $set: { status: newStatus } }
    );

    return res.status(200).json({ message: 'Ticket statuses updated successfully', updatedTickets });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
},



//changing status
updateStatus: async (req, res) => {
  const { ticketIds, newStatus } = req.query;

  try {
    const updatedTickets = await Ticket.updateMany(
      { _id: { $in: ticketIds.split(',') } },
      { $set: { status: newStatus } }
    );

    return res.status(200).json({ message: 'Ticket statuses updated successfully', updatedTickets });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
},

    
};

module.exports = ticketController;
