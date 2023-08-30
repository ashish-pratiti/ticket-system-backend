const Ticket = require('../models/ticketModel'); // Adjust the path as needed
const User = require('../models/userModel');
const Comment = require('../models/commentModel');

const ticketController = {
  createTicket: async (req, res) => {
    try {
      const ticketCount = await Ticket.countDocuments();
      const ticketId = `Tic${String(ticketCount + 1).padStart(6, '0')}`;

      const newTicketData = {
        ...req.body,
        ticketId: ticketId
      };
      const newTicket = new Ticket(newTicketData);
      const savedTicket = await newTicket.save();
      res.status(201).json(savedTicket);
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while creating the ticket.' });
    }
  },

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

  getTicketsBySearchName: async (req, res) => {
    try {
      const searchQuery = req.query.name; 
      const regex = new RegExp(searchQuery, 'i');
      const tickets = await Ticket.find({ title: regex }).limit(10); 

      res.status(200).json(tickets);
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while fetching tickets.' });
    }
  },

  assignTicketToAgent: async (req, res) => {
    try {
      const ticketId = req.body.ticketId;
      const agentId = req.body.agentId;
      const agentemail = req.body.agentemail;
      const requestingUserId = req.body.id; 
      const agent = await User.findOne({ _id: agentId, role: "agent" });
      
      if (!agent) {
        return res.status(404).json({ error: 'Agent not found.' });
      }
      const requestingUser = await User.findOne({ _id: requestingUserId, role: "admin" });

      if (!requestingUser || requestingUser.role !== "admin") {
        return res.status(403).json({ error: 'Only admin users are allowed to assign tickets.' });
      }

      const updatedTicket = await Ticket.findByIdAndUpdate(
        ticketId,
        { agent: agentId, agentemail: agentemail },
        { new: true }
      );
      if (!updatedTicket) {
        return res.status(404).json({ error: 'Ticket not found.' });
      }
      res.status(200).json(updatedTicket);
    } catch (error) {
    }
  },

  updateTicketStatusAndComment: async (req, res, next) => {
    try {
      const { ticketId, newStatus, comment } = req.body;
      if (!['open', 'pending', 'closed'].includes(newStatus)) {
        return res.status(400).json({ message: 'Invalid status' });
      }
      const userId = req.body.id;
      const ticket = await Ticket.findById(ticketId);
      if (!ticket) {
        return res.status(404).json({ message: 'Ticket not found' });
      }
      ticket.status = newStatus;
      const newComment = new Comment({ comment: comment, ticketId: ticketId, userId: userId });
      await newComment.save();
      const commentId = newComment._id;
      ticket.comments.push(commentId);
      await ticket.save();
      res.status(200).json(ticket);
    } catch (error) {
      next(error);
    }
  },

  getTicketById: async (req, res) => {
    try {
      const ticketId = req.body.ticketId;
      const ticket = await Ticket.findById(ticketId);
      res.status(200).json(ticket);

    } catch (error) {
      res.status(500).json({ error: 'An error occurred while fetching tickets.' });
    }
  },

  getTicketDetailsById: async (req, res) => {
    try {
      const ticketId = req.params.ticketId;
      const ticket = await Ticket.findById(ticketId);
      res.status(200).json(ticket);
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while fetching tickets.' });
    }
  },

  getAllTicketCreatedByUser: async (req, res) => {
    try {
      const userId = req.query.userId;
      const tickets = await Ticket.find({ user: userId });
      res.status(200).json(tickets);
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while fetching tickets.' });
    }
  },

  getTickets: async (req, res) => {
    const userId = req.query.userId;
    const role = req.query.role;

    if (role === 'admin') {
      try {
        const tickets = await Ticket.find();
        res.status(200).json(tickets);
      } catch (error) {
        throw error;
      }
    }
    else if (role === 'agent') {
      try {
        const tickets = await Ticket.find({ agent: userId });
        res.status(200).json(tickets);
      } catch (error) {
        throw error;
      }
    } else {
      try {
        const tickets = await Ticket.find({ user: userId });
        res.status(200).json(tickets);

      } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching tickets.' });
      }

    }

  },

  getAssignedAgentTickets: async (req, res) => {
    try {
      const agentId = req.query.agentId;
      if (agentId == null || agentId == undefined) {
        return res.status(404).json({ error: 'Agent not found.' });
      }
      const tickets = await Ticket.find({ agent: agentId });
      res.status(200).json(tickets);
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while fetching tickets.' });
    }
  },

  getAllTickets: async (req, res) => {
    try {
      const tickets = await Ticket.find();
      res.status(200).json(tickets);
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while fetching tickets.' });
    }
  },

  getTicketsTodayByTwoHourIntervals: async (req, res) => {
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

  getTicketMonthBySpecificMonth: async (req, res) => {
    try {
      const selectedYear = parseInt(req.query.year);
      const selectedMonth = parseInt(req.query.month);
      const startDate = new Date(selectedYear, selectedMonth - 1, 1);
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
      return res.status(500).json({ message: 'Internal server error' });
    }
  },


};

module.exports = ticketController;
