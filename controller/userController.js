import bcrypt from "bcrypt";
import crypto from "crypto";
import User from "../model/userModel.js";
import nodemailer from "nodemailer";
import generateToken from "../utils/token.js";
import getUserByEmail from "../utils/getUserByEmail.js";
import fs from "fs";

const createAUser = async (req, res) => {
  try {
    // GET USER DATA
    const { email, password, name } = req.body;

    const isEmail = await getUserByEmail(email);

    if (isEmail) {
      return res.status(400).json({
        status: "fail",
        error: "email alredy in use",
      });
    }

    // ENCRYPT PASSWORD
    const hashPassword = (password) => {
      const solt = 10;
      const hashPassword = bcrypt.hash(password, solt);
      return hashPassword;
    };

    const newPassword = await hashPassword(password);

    // USER DATA FOR DATABASE
    const userData = {
      name,
      email,
      password: newPassword,
    };

    // save user to database
    const user = new User(userData);
    const result = await user.save();

    // send response to client
    res.status(200).json({
      status: "success",
      result,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      error: error.message,
    });
  }
};

const getUser = async (req, res) => {
  try {
    // GET USER DATA
    const user = req.user;

    // USER DATA
    const userData = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    res.status(200).json({
      status: "success",
      userData,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      error: error.message,
    });
  }
};

const userLogIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    // GET  CREDENTIALS
    if (!email || !password) {
      return res.status(400).json({
        status: "fail",
        error: "Please provide your credentials",
      });
    }

    // FIND USER
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).json({
        status: "fail",
        error: "No user found",
      });
    }

    // CHECK PASSWORD
    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword) {
      return res.status(400).json({
        status: "fail",
        error: "password don't match",
      });
    }

    // GENERATE TOKEN
    const token = generateToken(user);

    // CLIENT DATA
    const userData = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token,
    };

    res.status(200).json({
      status: "success",
      message: "User sign in successfully",
      userData,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      error: error.message,
      
    });
  }
};

const updateAdminProfile = async (req, res) => {
  try {
    // get admin
    const adminEmail = req.admin.email;

    // get update data
    const { email, password, name, oldPassword } = req.body;

    // check admin
    const admin = await User.findOne({ email: adminEmail });
    if (!admin) {
      return res.status(400).json({
        status: "fail",
        error: "admin not found",
      });
    }

    // check password
    const adminPassword = admin.password;
    const isPasswordMatch = await bcrypt.compare(oldPassword, adminPassword);
    if (!isPasswordMatch) {
      return res.status(400).json({
        status: "fail",
        error: "password don't match",
      });
    }

    // ENCRYPT PASSWORD
    const hashPassword = (password) => {
      const solt = 10;
      const hashPassword = bcrypt.hash(password, solt);
      return hashPassword;
    };

    const newPassword = await hashPassword(password);

    // update admin data
    admin.name = name;
    admin.email = email;
    admin.password = newPassword;

    // GENERATE TOKEN
    const token = generateToken(admin);

    // update admin
    const result = await User.updateOne({ email: adminEmail }, { $set: admin });

    res.status(200).json({
      status: "success",
      message: "admin update successfully",
      result,
      token,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      error: error.message,
    });
  }
};

const getAllUser = async (req, res) => {
  try {
    const allUser = await User.find({});

    res.json({
      allUser,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      error: error.message,
    });
  }
};

export { createAUser, getUser, userLogIn, getAllUser, updateAdminProfile };
