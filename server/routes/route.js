const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const ticketController = require('../controllers/ticketController');

router.post('/signup', userController.signup);

router.post('/login', userController.login);

// router.get('/user/:userId', userController.allowIfLoggedin, userController.getUser);

router.get('/user/:userId',  userController.getUser);


// router.get('/users', userController.allowIfLoggedin, userController.grantAccess('readAny', 'profile'), userController.getUsers);

router.get('/users',  userController.getUsers);

router.put('/user/:userId', userController.allowIfLoggedin, userController.grantAccess('updateAny', 'profile'), userController.updateUser);

router.delete('/user/:userId', userController.allowIfLoggedin, userController.grantAccess('deleteAny', 'profile'), userController.deleteUser);


router.post('/newticket',ticketController.createTicket); //work

// router.get('/getAllTickets',ticketController.getAllTickets); 

router.get('/searchTicket',ticketController.getTicketsBySearchName); //works

router.post('/assignTicketToAgent',ticketController.assignTicketToAgent); //work

router.put('/update-ticket', ticketController.updateTicketStatusAndComment); //work - atleast change status

router.get('/allTickets', ticketController.getAllTickets); //work

// router.get('/allTicketsByUser/:userId', ticketController.getAllTicketCreatedByUser);

router.get('/allTicketsByUser', ticketController.getAllTicketCreatedByUser);

router.get('/ticketById', ticketController.getTicketById);

router.get('/ticketDetailsById/:ticketId', ticketController.getTicketDetailsById);

//get alll ticket assigned to agent
router.get('/assignedTickets',ticketController.getAssignedAgentTickets);

module.exports = router;