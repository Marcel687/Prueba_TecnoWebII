import pg from "pg";

// El Pool es mejor que Client porque gestiona múltiples conexiones automáticamente
const { Pool } = pg;

const pool = new Pool({
  user: "postgres", // Por defecto es 'postgres'
  host: "localhost",
  database: "AgendaPass",
  password: "LuisRuben2018",
  port: 5432, // Puerto por defecto de Postgres
});

export default pool;
