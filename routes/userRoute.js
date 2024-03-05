import express from "express";
import {
  createAUser,
  getUser,
  userLogIn,
  getAllUser,
  updateAdminProfile,
} from "../controller/userController.js";
import verifyUser from "../utils/verifyUser.js";
import isAdmin from "../utils/isAdmin.js";

const userRouter = express.Router();

userRouter.post("/signup", createAUser);
userRouter.post("/signin", userLogIn);
userRouter.get("/allUser", getAllUser);
userRouter.get("/getUser", verifyUser, getUser);
userRouter.patch("/update", isAdmin, updateAdminProfile);

export default userRouter;
