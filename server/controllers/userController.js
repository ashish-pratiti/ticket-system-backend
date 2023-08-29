const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const { roles } = require('../roles')

async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
}

async function validatePassword(plainPassword, hashedPassword) {
  const isValid = await bcrypt.compare(plainPassword, hashedPassword);
  return isValid;
}


exports.allowIfLoggedin = async (req, res, next) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({
        error: "You need to be logged in to access this route"
      });fetchedUser
    }

    req.user = token; // Attach the token to the request object
    next();
  } catch (error) {
    next(error);
  }
};

// Tested with Postman and it works
exports.signup = async (req, res, next) => {
  try {
    const { email, password, role, firstname, lastname } = req.body

    console.log(role, email, password, firstname, lastname);
    //if email already exists
    const alreadyExist = await User.findOne({ email });

    console.log(alreadyExist);
    if (alreadyExist) return res.status(250).json({ message: "Email already exists..." });

    const hashedPassword = await hashPassword(password);
    const newUser = new User({ email, password: hashedPassword, firstname, lastname, role: role || "basic" });
    const accessToken = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "365d"
    });
    newUser.accessToken = accessToken;
    await newUser.save();
    res.status(200).json({
      data: newUser,
      message: "You have signed up successfully"
    })
  } catch (error) {
    next(error)
  }
}

// Tested with Postman and it works
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });

    // If user is not found, return an error
    if (!user) {
      return res.status(250).json({ message: 'email or password is incorrect!' });
    }

    // Validate the password
    const validPassword = await validatePassword(password, user.password);
    if (!validPassword) {
      return res.status(250).json({ message: 'email or password is incorrect!' });
    }

    // Generate a new JWT token
    const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '365d'
    });

    // Update user's accessToken in the database
    await User.findByIdAndUpdate(user._id, { accessToken });

    // Return user information and token
    res.status(200).json({
      data: { id: user._id, email: user.email, role: user.role },
      accessToken
    });
  } catch (error) {
    // Handle any unexpected errors
    next(error);
  }
};




exports.getUsers = async (req, res, next) => {
  const users = await User.find({});
  res.status(200).json({
    data: users
  });
}

// get agents
exports.getAgents = async (req, res, next) => {
  const users = await User.find({ role: 'agent' });
  res.status(200).json({
    data: users
  });
}

exports.getUser = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);
    if (!user) return next(new Error('User does not exist'));
    res.status(200).json({
      data: user
    });
  } catch (error) {
    next(error)
  }
}


exports.updateUserDetails = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const { firstname, lastname } = req.body;

    // Update user document with the provided firstname and lastname
    await User.findByIdAndUpdate(userId, { firstname, lastname });

    // Fetch the updated user document
    const updatedUser = await User.findById(userId);

    res.status(200).json({
      data: updatedUser
    });
  } catch (error) {
    next(error);
  }
};




