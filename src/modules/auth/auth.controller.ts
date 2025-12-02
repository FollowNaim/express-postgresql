import { Request, Response } from "express";
import { authServices } from "./auth.service";

const loginUser = async (req: Request, res: Response) => {
  try {
    const result = await authServices.loginUer(req.body);
    if (!result) {
      return res
        .status(301)
        .json({ success: false, message: "unauthorized access" });
    }
    res.status(200).json({
      success: true,
      message: "Login successfull",
      data: result,
    });
  } catch (err: any) {
    console.log(err.message);
    res.status(500).json({ success: false, error: err.message });
  }
};

export const authController = {
  loginUser,
};
