import Router from "express";
import { TodoController } from "./todo.controller";

const router = Router();

router.get("/", TodoController.getTodos);

router.post("/", TodoController.createTodo);

export const TodoRouter = { router };
