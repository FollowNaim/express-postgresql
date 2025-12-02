import { Request, Response } from "express";
import { TodoServices } from "./todo.service";

const getTodos = async (req: Request, res: Response) => {
  try {
    const result = await TodoServices.getTodos();
    res.status(200).json({
      success: true,
      message: "data fetched successfully!",
      result: result.rows,
    });
  } catch (err: any) {
    console.log(err.message);
    res.status(500).json({ success: false, error: err.message });
  }
};

const createTodo = async (req: Request, res: Response) => {
  try {
    const result = await TodoServices.createTodo(req.body);
    res.status(200).json({
      success: true,
      message: "todo has been inserted successfully!",
      data: result.rows[0],
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const TodoController = {
  getTodos,
  createTodo,
};
