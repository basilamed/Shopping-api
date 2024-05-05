const express = require("express");
const UserController = require("../controllers/authController");
const router = express.Router();

router.post("/register", UserController.handleRegister);
router.post("/login", UserController.handleLogin);
router.get("/verify", UserController.handleVerify);
router.get("/getUserById/:userId", UserController.getUserById);
router.put('/update/:userId', UserController.updateUser);
router.delete('/delete/:userId', UserController.deleteUser);
router.put('/change-password/:userId', UserController.changePassword);
router.post('/send-verification-code', UserController.sendVerificationCode);
router.get('/get-all-users', UserController.getAllUsers);
router.post('/reset-password', UserController.resetPassword);

module.exports = router;
