const bcrypt = require('bcryptjs');
const httpError = require('../models/http-error');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const {validationResult} = require('express-validator');

//Todo: Add errors handling

const getUser = async (req, res, next) => {
    const {userId} = req.body;

    let user;
    try {
        user = await User.findById(userId);
    } catch (error) {
        return next(new httpError('Something went wrong could not find the user with provoided id.', 500));
    }

    res.status(200).json({user: user.toObject({getters: true})});
}

const logInUser = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new httpError('Invalid inputs passed, please check your data.', 422));
    }
    const {email, password} = req.body;
    let existingUser;
    try {
        existingUser = await User.findOne({email: email});
        console.log(existingUser);
    } catch (error) {
        return next(new httpError('Logging in failed, please try again later.', 500));
    }
    if (!existingUser) {
        return next(new httpError('Invalid credentials, could not log you in.', 401));
    }
    let isPasswordValid;
    try {
        isPasswordValid = await bcrypt.compare(password, existingUser.password);
    } catch (error) {
        return next(new httpError('Something went wrong, could not log you in.', 500));
    }
    if (!isPasswordValid) {
        return next(new httpError('Invalid credentials, could not log you in.', 401));
    }
    let token;
    try {
        token = jwt.sign({userId: existingUser.id, email: existingUser.email}, process.env.JWT_KEY, {expiresIn: '1h'});
    } catch (error) {
        return next(new httpError('Something went wrong, could not create a user.', 500));
    }

    res.status(200).json({userId: existingUser.id, email: existingUser.email,
        balance: existingUser.accountBalance, name: existingUser.name, earnings: existingUser.earnings, spending: existingUser.spending, token: token
    });
}

const signUpUser = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new httpError('Invalid inputs passed, please check your data.', 422));
    }
    const {name, email, password} = req.body;
    let hashedPassword;
    try {
        hashedPassword = await bcrypt.hash(password, 12);
    } catch (error) {
        console.log(error);
        return next(new httpError('Something went wrong, could not hash the password.', 500));

    }
    const createdUser = new User({
        name, email, password: hashedPassword, accountBalance: 0,
    });
    try {
        await createdUser.save();
    } catch (error) {
        return next(new httpError('Something went wrong, could not create a user.', 500));
    }
    let token;
    try {
        token = jwt.sign({userId: createdUser.id, email: createdUser.email}, process.env.JWT_KEY, {expiresIn: '1h'});
    } catch (error) {
        return next(new httpError('Something went wrong, could not create a user.', 500));
    }
    res.status(201).json({userId: createdUser.id, email: createdUser.email, balance: createdUser.accountBalance, name: createdUser.name,
        earnings: createdUser.earnings,
        spending: createdUser.spending,
        token: token
    });
}

const deleteUser = async (req, res, next) => {
    const userId = req.params.uid;

    let user;
    try {
        user = await User.findById(userId);
    } catch (error) {
        return next(new httpError('Something went wrong could not find the user.', 500));
    }
    if (!user) {
        return next(new httpError('Could not find user for this id.', 404));
    }
    try {
        await user.remove();
    } catch (error) {
        return next(new httpError('Something went wrong, could not delete user.', 500));
    }

    res.status(200).json({message: 'Deleted user.', user: user.toObject({getters: true})});
}

const updatePassword = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new httpError('Invalid inputs passed, please check your data.', 422));
    }
    const {email, newpassword} = req.body;

    let user;
    try {
        user = await User.findOne({email});
    } catch (error) {
        return next(new httpError('Something went wrong could not find the user.', 500));
    }
    if (!user) {
        return next(new httpError('Could not reset your password.', 404));
    }

    let hashedPassword;
    try {
        hashedPassword = await bcrypt.hash(newpassword, 12);
    } catch (error) {
        console.log(error);
        return next(new httpError('Something went wrong, could not change the password.', 500));
    }

    user.password = hashedPassword;

    try {
        await user.save();
    } catch (error) {
        return next(new httpError('Something went wrong, could not update user password.', 500));
    }

    res.status(200).json({message: 'Updated user.', user: user.toObject({getters: true})});
}

const updateName = async (req, res, next) => {
    const {userId, newName} = req.body;

    let user;
    try {
        user = await User.findById(userId);
    } catch (error) {
        return next(new httpError('Something went wrong could not find the user.', 500));
    }
    if (!user) {
        return next(new httpError('Could not update your name.', 404));
    }
    user.name = newName;

    try {
        await user.save();
    } catch (error) {
        return next(new httpError('Something went wrong, could not update user name.', 500));
    }

    res.status(200).json({message: 'Updated user.', user: user.toObject({getters: true})});
}

const updateBalance = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new httpError('Invalid inputs passed, please check your data.', 422));
    }
    const {newBalance} = req.body;
    let user;
    try {
        user = await User.findById(req.userData.userId);
    } catch (error) {
        return next(new httpError('Something went wrong could not find the user.', 500));
    }
    try {
        user.accountBalance = parseFloat(parseFloat(user.accountBalance + newBalance).toFixed(4));
        await user.save();
    } catch (error) {
        return next(new httpError('Something went wrong could not update the user.', 500));
    }
    res.status(200).json({message: 'Updated user.', user: user.accountBalance});
}


exports.getUser = getUser;
exports.signUpUser = signUpUser;
exports.logInUser = logInUser;
exports.deleteUser = deleteUser;
exports.updatePassword = updatePassword;
exports.updateBalance = updateBalance;
exports.updateName = updateName;