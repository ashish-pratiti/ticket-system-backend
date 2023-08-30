const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

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
      });
    }
    req.user = token; 
    next();
  } catch (error) {
    next(error);
  }
};

exports.signup = async (req, res, next) => {
  try {
    const { email, password, role, firstname, lastname } = req.body
    const alreadyExist = await User.findOne({ email });
    
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

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(250).json({ message: 'email or password is incorrect!' });
    }
    const validPassword = await validatePassword(password, user.password);
    if (!validPassword) {
      return res.status(250).json({ message: 'email or password is incorrect!' });
    }

    // Generate a new JWT token
    const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '365d'
    });

    await User.findByIdAndUpdate(user._id, { accessToken });

    res.status(200).json({
      data: { id: user._id, email: user.email, role: user.role },
      accessToken
    });
  } catch (error) {
    next(error);
  }
};

exports.getUsers = async (req, res, next) => {
  const users = await User.find({});
  res.status(200).json({
    data: users
  });
}

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

exports.updateUser = async (req, res, next) => {
  try {
    const { role } = req.body
    const userId = req.params.userId;
    await User.findByIdAndUpdate(userId, { role });
    const user = await User.findById(userId)
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

    await User.findByIdAndUpdate(userId, { firstname, lastname });
    const updatedUser = await User.findById(userId);
    res.status(200).json({
      data: updatedUser
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteUser = async (req, res, next) => {
    try {
      const userId = req.params.userId;
      await User.findByIdAndDelete(userId);
      res.status(200).json({
        data: null,
        message: 'User has been deleted'
      });
    } catch (error) {
      next(error)
    }
  }
