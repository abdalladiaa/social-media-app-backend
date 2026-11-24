import { Router } from "express";
import authRouter from "./modules/auth/auth.routes.js";
import userRouter from "./modules/user/user.routes.js";
import postRouter from "./modules/post/post.routes.js";
import commentRouter from "./modules/comment/comment.routes.js";

export const router = Router();

router.use("/auth", authRouter);
router.use("/user", userRouter);
router.use("/post", postRouter);
router.use("/comment", commentRouter);