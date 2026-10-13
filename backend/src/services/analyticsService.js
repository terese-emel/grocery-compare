const { Pool } = require("pg");

const analyticsDatabaseUrl = process.env.ANALYTICS_DATABASE_URL;
const pool = analyticsDatabaseUrl
  ? new Pool({ connectionString: analyticsDatabaseUrl })
  : null;

async function initializeAnalytics() {
  if (!pool) return;

  await pool.query(`
    CREATE TABLE IF NOT EXISTS product_search_events (
      id BIGSERIAL PRIMARY KEY,
      user_id VARCHAR(100) NOT NULL,
      product_name VARCHAR(100),
      shop VARCHAR(100),
      searched_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

async function recordProductSearch({ userId, name, shop }) {
  if (!pool) return;

  try {
    await pool.query(
      `INSERT INTO product_search_events (user_id, product_name, shop)
       VALUES ($1, $2, $3)`,
      [userId, name || null, shop || null],
    );
  } catch (error) {
    console.error("Analytics event could not be recorded:", error.message);
  }
}

module.exports = {
  initializeAnalytics,
  recordProductSearch,
};
