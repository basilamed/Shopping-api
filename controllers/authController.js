const bcrypt = require('bcrypt');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
require('dotenv').config();

const transporter = nodemailer.createTransport(sendgridTransport({
    auth: {
        api_key: process.env.SENDGRID_API_KEY
    }
}))

const handleRegister = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password)
    return res.status(400).json({'message': 'Email and password are required'});
    
    const duplicate = await User.findOne({ email: email }).exec();
    if (duplicate)
        return res.status(400).json({'message': 'Email already exists'});
    try {
        const { firstName, lastName, email, password } = req.body;
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);
        const verificationCode = Math.floor(10000 + Math.random() * 90000);
        const newUser = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            verificationCode,
            verified: false,
            role: 'user',
        });
        console.log(newUser);
        await newUser.save();
        res.status(201).json({ message: 'User created successfully' });
        return transporter.sendMail({
            to: email,
            from: process.env.SENDER_EMAIL,
            subject: 'Verify your email',
            html: `<h1>Verification code: ${verificationCode}</h1>`
        })
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

const handleLogin = async (req, res) => {
    const { email, password } = req.body;
    console.log('handleLogin:', email, password);

    let existingUser = null;
    try {
        existingUser = await User.findOne({ email })
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }

    if (!existingUser)
        return res.status(404).json({ message: 'User does not exist' });

    if (!existingUser.verified) {
        return res.status(403).json({ message: 'User is not verified' });
    }
    
    const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);

    if (!isPasswordCorrect)
        return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
        { email: existingUser.email, id: existingUser._id },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '1h' }
    );

    // Send the token to the client
    res.status(200).json({ result: existingUser, token });
}

const handleVerify = async (req, res) => {
    const { verificationCode } = req.body;
    
    try {
      const user = await User.findOne({ verificationCode });
  
      if (!user) {
        return res.status(404).json({ message: 'Verification code not found' });
      }
  
      // Update the 'verified' field to true
      user.verified = true;
      await user.save();
  
      res.status(200).json({ message: 'Verification successful' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

const getUserById = async (req, res) => {
    try {
        const userId = req.params.userId;
        console.log('getUserById:', userId);
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (err) {
        res.status(500).json({
            message: 'Error fetching product',
            error: err
        });
    }
}

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({
            message: 'Error fetching users',
            error: err
        });
    }
}

const updateUser = async (req, res) => {
    try {
      const userId = req.params.userId;
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        req.body,
        { new: true }
      );
  
      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.json({ message: 'User updated successfully', updatedUser });
    } catch (err) {
      res.status(500).json({
        message: 'Error updating user',
        error: err
      });
    }
  };

  const deleteUser = async (req, res) => {
    try {
      const userId = req.params.userId;
      const deletedUser = await User.findByIdAndDelete(userId);
  
      if (!deletedUser) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.json({ message: 'User deleted successfully', deletedUser });
    } catch (err) {
      res.status(500).json({
        message: 'Error deleting user',
        error: err
      });
    }
  }

  const changePassword = async (req, res) => {
    try {
        const userId = req.params.userId;
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid old password' });
    }

    const passwordChanged = await user.changePassword(newPassword);

    if (passwordChanged) {
      return res.json({ message: 'Password changed successfully' });
    } else {
      return res.status(500).json({ message: 'Error changing password' });
    }
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Error deleting user',
            error: err
        });
    }
  }

  const sendVerificationCode = async (req, res) => {
    try {
      const { email } = req.body;
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      const verificationCode = Math.floor(10000 + Math.random() * 90000);
      user.verificationCode = verificationCode;
      await user.save();
  
      // Slanje koda za verifikaciju putem e-pošte
      await transporter.sendMail({
        to: email,
        from: process.env.SENDER_EMAIL,
        subject: 'Reset Password Verification Code',
        html: `<h1>Your verification code: ${verificationCode}</h1>`
      });
  
      res.json({ message: 'Verification code sent successfully' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

  const resetPassword = async (req, res) => {
    try {
      const { email, verificationCode, newPassword } = req.body;
      const user = await User.findOne({ email });
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      console.log(user.verificationCode);
  
      if (user.verificationCode !== verificationCode) {
        return res.status(401).json({ message: 'Invalid verification code' });
      }
  
      // Promeni lozinku i sačuvaj korisnika
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
      user.password = hashedPassword;
      user.verificationCode = undefined; // Očisti kod za verifikaciju
      await user.save();
  
      res.json({ message: 'Password reset successful' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  
module.exports = {
    handleRegister,
    handleLogin,
    handleVerify,
    getUserById,
    updateUser,
    deleteUser,
    changePassword,
    sendVerificationCode,
    resetPassword,
    getAllUsers
}





