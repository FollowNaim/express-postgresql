import dotenv from "dotenv";
import express, { Request, Response } from "express";
import path from "path";
import { Pool } from "pg";

const app = express();
const port = 5000;
dotenv.config({ path: path.join(process.cwd(), ".env") });
app.use(express.json());
const pool = new Pool({
  connectionString: `${process.env.CONNECTION_STRING}`,
});

const initDB = async () => {
  await pool.query(`
        CREATE TABLE IF NOT EXISTS users(
        id SERIAL PRIMARY KEY,
        name VARCHAR(80) NOT NULL,
        email VARCHAR(60) UNIQUE NOT NULL,
        age INT,
        phone VARCHAR(15),
        address TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        modified_at TIMESTAMP DEFAULT NOW()
        )
        
        `);

  await pool.query(
    `
        CREATE TABLE IF NOT EXISTS todos(
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(200) NOT NULL,
        description TEXT,
        completed BOOLEAN DEFAULT false,
        due_date DATE,
        created_at TIMESTAMP DEFAULT NOW(),
        modified_at TIMESTAMP DEFAULT NOW()
        )
        `
  );
};

initDB();

app.get("/", (req: Request, res: Response) => {
  res.send("i'm running with express");
});

app.post("/users", async (req: Request, res: Response) => {
  const { name, email } = req.body;
  try {
    const result = await pool.query(
      `
        INSERT INTO users(name, email) VALUES($1, $2) 
        RETURNING*`,
      [name, email]
    );
    res.status(200).json({
      success: true,
      message: "data inserted",
      result: result.rows[0],
    });
  } catch (err: any) {
    console.log(err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

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

app.get("/users", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      `
      SELECT * FROM users
      `
    );
    res.status(200).json({
      success: true,
      message: result.rows,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.get("/users/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `
      SELECT * FROM users WHERE id=$1
      `,
      [id]
    );
    res.status(200).json({
      success: true,
      message: result.rows,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.put("/users/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    const result = await pool.query(
      `
      UPDATE users SET name=$1 WHERE id=$2 RETURNING *
      `,
      [name, id]
    );
    res.status(200).json({
      success: true,
      message: "Data updated successfully!",
      data: result.rows,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.delete("/users/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await pool.query(
      `
      DELETE FROM users WHERE id=$1
      `,
      [id]
    );
    res.status(200).json({
      success: true,
      message: "user deleted successfully!",
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.listen(port, () => {
  console.log(`server running at port ${port}`);
});
