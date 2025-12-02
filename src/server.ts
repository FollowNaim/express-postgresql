import express, { Request, Response } from "express";
import { initDB, pool } from "./config/db";
import { UserRoutes } from "./modules/user/user.routes";

const app = express();
const port = 5000;

app.use(express.json());

initDB();

app.get("/", (req: Request, res: Response) => {
  res.send("i'm running with express");
});

app.use("/users", UserRoutes.router);

app.get("/todos", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      `
        SELECT * FROM todos
        `
    );
    res.status(200).json({
      success: true,
      message: "data fetched successfully!",
      result: result.rows,
    });
  } catch (err: any) {
    console.log(err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post("/todos", async (req: Request, res: Response) => {
  const { user_id, title } = req.body;
  try {
    const result = await pool.query(
      `
      INSERT INTO todos(user_id, title) VALUES($1, $2) RETURNING *
      `,
      [user_id, title]
    );
    res.status(200).json({
      success: true,
      message: "todo has been inserted successfully!",
      data: result.rows[0],
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.listen(port, () => {
  console.log(`server running at port ${port}`);
});
