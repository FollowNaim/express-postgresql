import { Request, Response } from "express";
import { UserServices } from "./user.service";

const createUser = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  try {
    const result = await UserServices.createUser(name, email, password);
    res.status(200).json({
      success: true,
      message: "data inserted",
      result: result.rows[0],
    });
  } catch (err: any) {
    console.log(err.message);
    res.status(500).json({ success: false, error: err.message });
  }
};

const getUser = async (req: Request, res: Response) => {
  try {
    const result = await UserServices.getUsers();
    res.status(200).json({
      success: true,
      message: result.rows,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getSpecifiedUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await UserServices.getSpecifiedUser(id);
    res.status(200).json({
      success: true,
      message: result.rows,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    const result = await UserServices.updateUser(name, id);
    res.status(200).json({
      success: true,
      message: "Data updated successfully!",
      data: result.rows,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await UserServices.deleteUser(id);
    res.status(200).json({
      success: true,
      message: "user deleted successfully!",
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const UserController = {
  createUser,
  getUser,
  getSpecifiedUser,
  updateUser,
  deleteUser,
};
