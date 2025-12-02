import express, { Request, Response } from "express";
import { initDB } from "./config/db";
import { authRoutes } from "./modules/auth/auth.routes";
import { TodoRouter } from "./modules/todo/todo.routes";
import { UserRoutes } from "./modules/user/user.routes";

const app = express();
const port = 5000;

app.use(express.json());

initDB();

app.get("/", (req: Request, res: Response) => {
  res.send("i'm running with express");
});

app.use("/users", UserRoutes.router);

app.use("/todos", TodoRouter.router);

app.use("/auth", authRoutes.router);

app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.path,
  });
});

app.listen(port, () => {
  console.log(`server running at port ${port}`);
});
