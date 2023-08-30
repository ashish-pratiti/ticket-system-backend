const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const ticketController = require('../controllers/ticketController');
const commentController = require('../controllers/commentController');


router.post('/signup', userController.signup);

router.post('/login', userController.login);

router.get('/user/:userId', userController.getUser);

router.get('/users', userController.getUsers);

router.get('/getAgents', userController.getAgents);

router.put('/user/details/:userId',
    userController.allowIfLoggedin,
    userController.updateUserDetails
);

router.put('/user/role/:userId', userController.allowIfLoggedin, userController.updateUser);

router.delete('/user/:userId', userController.allowIfLoggedin, userController.deleteUser);

//ticket routes
router.post('/newticket', ticketController.createTicket); 

router.get('/searchTicket', ticketController.getTicketsBySearchName); 

router.post('/assignTicketToAgent', ticketController.assignTicketToAgent); 

router.put('/update-ticket', ticketController.updateTicketStatusAndComment); 

router.get('/allTickets', ticketController.getAllTickets); 

router.get('/allTicketsByUser', ticketController.getAllTicketCreatedByUser);

router.get('/ticketById', ticketController.getTicketById);

router.get('/ticketDetailsById/:ticketId', ticketController.getTicketDetailsById);

router.get('/assignedTickets', ticketController.getAssignedAgentTickets);

router.get('/tickets', ticketController.getTickets);

router.get('/tickets/today', ticketController.getTicketsTodayByTwoHourIntervals);

router.get('/tickets/by-date/:date', ticketController.getTicketTodayBySpecificDay);

router.get('/tickets/by-month', ticketController.getTicketMonthBySpecificMonth);

router.put('/tickets/status', ticketController.updateStatus);

//comment routes
router.get('/commentsInTicket/:ticketId', commentController.getAllCommentsByTicket);






module.exports = router;