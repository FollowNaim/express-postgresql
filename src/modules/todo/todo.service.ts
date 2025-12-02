import { pool } from "../../config/db";

const getTodos = async () => {
  const result = await pool.query(
    `
            SELECT * FROM todos
            `
  );
  return result;
};
// record means {key will be string but the value will be unknown}
const createTodo = async (payload: Record<string, unknown>) => {
  const { user_id, title } = payload;
  const result = await pool.query(
    `
      INSERT INTO todos(user_id, title) VALUES($1, $2) RETURNING *
      `,
    [user_id, title]
  );

  return result;
};

export const TodoServices = { getTodos, createTodo };
