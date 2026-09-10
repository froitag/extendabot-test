import { Pool } from "pg";

let pool: Pool | undefined;

function getPool() {
  if (pool) {
    return pool;
  }

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set");
  }

  pool = new Pool({ connectionString });
  return pool;
}

async function ensureSchema() {
  const db = getPool();
  await db.query(`
    CREATE TABLE IF NOT EXISTS counters (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      value INTEGER NOT NULL DEFAULT 0
    )
  `);
  await db.query(`
    INSERT INTO counters (id, value)
    VALUES (1, 0)
    ON CONFLICT (id) DO NOTHING
  `);
}

export async function getCounter(): Promise<number> {
  await ensureSchema();
  const result = await getPool().query<{ value: number }>(
    "SELECT value FROM counters WHERE id = 1",
  );
  return result.rows[0]?.value ?? 0;
}

export async function incrementCounter(): Promise<number> {
  await ensureSchema();
  const result = await getPool().query<{ value: number }>(`
    INSERT INTO counters (id, value)
    VALUES (1, 1)
    ON CONFLICT (id) DO UPDATE
    SET value = counters.value + 1
    RETURNING value
  `);
  return result.rows[0].value;
}

export async function resetCounter(value = 0): Promise<number> {
  await ensureSchema();
  const result = await getPool().query<{ value: number }>(
    `
      INSERT INTO counters (id, value)
      VALUES (1, $1)
      ON CONFLICT (id) DO UPDATE
      SET value = EXCLUDED.value
      RETURNING value
    `,
    [value],
  );
  return result.rows[0].value;
}

export async function closePool() {
  if (!pool) {
    return;
  }
  await pool.end();
  pool = undefined;
}
