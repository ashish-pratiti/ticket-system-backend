const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const ticketController = require('../controllers/ticketController');
const commentController = require('../controllers/commentController');

router.get('', (req, res) => {
    res.send('Hello World');
});

router.post('/signup', userController.signup);

router.post('/login', userController.login);

// router.get('/user/:userId', userController.allowIfLoggedin, userController.getUser);

router.get('/user/:userId', userController.getUser);


// router.get('/users', userController.allowIfLoggedin, userController.grantAccess('readAny', 'profile'), userController.getUsers);

router.get('/users', userController.getUsers);

router.get('/getAgents', userController.getAgents);

router.put('/user/details/:userId',
    userController.allowIfLoggedin,
    userController.updateUserDetails
);

router.put('/user/role/:userId', userController.allowIfLoggedin, userController.updateUser);

router.delete('/user/:userId', userController.allowIfLoggedin, userController.deleteUser);


router.post('/newticket', ticketController.createTicket); //work

// router.get('/getAllTickets',ticketController.getAllTickets); 

router.get('/searchTicket', ticketController.getTicketsBySearchName); //works

router.post('/assignTicketToAgent', ticketController.assignTicketToAgent); //work

router.put('/update-ticket', ticketController.updateTicketStatusAndComment); //work - atleast change status

router.get('/allTickets', ticketController.getAllTickets); //work

// router.get('/allTicketsByUser/:userId', ticketController.getAllTicketCreatedByUser);

router.get('/allTicketsByUser', ticketController.getAllTicketCreatedByUser);

router.get('/ticketById', ticketController.getTicketById);

router.get('/ticketDetailsById/:ticketId', ticketController.getTicketDetailsById);

//get alll ticket assigned to agent
router.get('/assignedTickets', ticketController.getAssignedAgentTickets);

//get tickets based on roles

router.get('/tickets', ticketController.getTickets);

router.get('/tickets/today', ticketController.getTicketsTodayByTwoHourIntervals);

router.get('/tickets/by-date/:date', ticketController.getTicketTodayBySpecificDay);

router.get('/tickets/by-month', ticketController.getTicketMonthBySpecificMonth);

//comment routes

router.get('/commentsInTicket/:ticketId', commentController.getAllCommentsByTicket);



//update tickets status
router.put('/tickets/status', ticketController.updateStatus);



module.exports = router;