import { Router } from "express";
import { UserController } from "./user.controller";

const router = Router();

router.post("/create", UserController.createUser);

router.get("/", UserController.getUser);

router.get("/:id", UserController.getSpecifiedUser);

router.put("/:id", UserController.updateUser);

router.delete("/:id", UserController.deleteUser);

export const UserRoutes = { router };
