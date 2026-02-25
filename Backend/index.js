import express from "express";
import pool from "./db.js";
import jwt from "jsonwebtoken";

const app = express();
app.use(express.json());

const JWT_SECRET = "tu_clave_secreta_provisional";

app.get("/", async (req, res) => {
  try {
    // Una consulta simple para verificar la conexión
    const result = await pool.query("SELECT NOW()");
    res.json({
      message: "Welcome back",
      database_time: result.rows[0].now,
    });
  } catch (error) {
    console.error("Error en la base de datos:", error);
    res.status(500).send("Error al conectar con la base de datos");
  }
});

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});

app.get("/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");

    res.json({
      status: "Conexión exitosa",
      db_time: result.rows[0].now,
      message: "¡Tu API y PostgreSQL están hablando perfectamente!",
    });
  } catch (error) {
    console.error("Error conectando a la DB:", error);
    res.status(500).json({
      status: "Error",
      error: error.message,
    });
  }
});

app.get("/check-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT version()");
    res.json({
      status: "¡Conectado!",
      info: result.rows[0].version,
    });
  } catch (error) {
    console.error("Error de conexión:", error);
    res.status(500).json({ error: "No se pudo conectar a la DB" });
  }
});

app.post("/register", async (req, res) => {
  const { email, password } = req.body;

  try {
    const queryText = `
      INSERT INTO users (email, password_hash) 
      VALUES ($1, $2) 
      RETURNING user_id, email, created_at
    `;

    const result = await pool.query(queryText, [email, password]);

    res.status(201).json({
      message: "Usuario creado exitosamente",
      user: result.rows[0],
    });
  } catch (error) {
    console.error(error);
    if (error.code === "23505") {
      return res.status(400).json({ error: "El email ya está registrado" });
    }
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

app.post("/auth/register", async (req, res) => {
  const { email, password } = req.body;

  try {
    const queryText = `
      INSERT INTO users (email, password_hash) 
      VALUES ($1, $2) 
      RETURNING user_id, email, created_at
    `;

    const result = await pool.query(queryText, [email, password]);

    res.status(201).json({
      message: "Usuario creado exitosamente",
      user: result.rows[0],
    });
  } catch (error) {
    if (error.code === "23505") {
      return res.status(400).json({ error: "El email ya existe" });
    }
    res.status(500).json({ error: "Error en el servidor" });
  }
});

app.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Buscamos al usuario comparando el hash de la clave
    const queryText = `
      SELECT user_id, email 
      FROM users 
      WHERE email = $1 AND password_hash = crypt($2, password_hash)
    `;
    const result = await pool.query(queryText, [email, password]);

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Credenciales incorrectas" });
    }

    const user = result.rows[0];

    const token = jwt.sign(
      { userId: user.user_id, email: user.email },
      JWT_SECRET,
      { expiresIn: "1h" },
    );

    res.json({
      message: "Login exitoso",
      token: token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error en el proceso de login" });
  }
});

// Este middleware verifica que el token sea válido
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  const token = authHeader && authHeader.split(" ")[1];

  if (!token)
    return res.status(401).json({ error: "No se proporcionó un token" });

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err)
      return res.status(403).json({ error: "Token inválido o expirado" });

    req.user = decoded;
    next();
  });
};

app.post("/credentials", authenticateToken, async (req, res) => {
  const { service_name, account_username, password_plain, url, notes } =
    req.body;
  const userId = req.user.userId; // Obtenido del token automáticamente

  try {
    const queryText = `
      INSERT INTO credentials (user_id, service_name, account_username, password_encrypted, url, notes)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;

    const result = await pool.query(queryText, [
      userId,
      service_name,
      account_username,
      password_plain,
      url,
      notes,
    ]);

    res.status(201).json({
      message: "Credencial guardada",
      credential: result.rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al guardar la credencial" });
  }
});

app.get("/credentials", authenticateToken, async (req, res) => {
  const userId = req.user.userId;

  try {
    const result = await pool.query(
      "SELECT * FROM credentials WHERE user_id = $1 ORDER BY created_at DESC",
      [userId],
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener las credenciales" });
  }
});

app.get("/credentials/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId;

  try {
    const result = await pool.query(
      "SELECT * FROM credentials WHERE credential_id = $1 AND user_id = $2",
      [id, userId],
    );

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ error: "Credencial no encontrada o no autorizada" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener la credencial" });
  }
});

app.put("/credentials/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { service_name, account_username, password_plain, url, notes } =
    req.body;
  const userId = req.user.userId;

  try {
    const queryText = `
      UPDATE credentials 
      SET service_name = $1, account_username = $2, password_encrypted = $3::bytea, 
          url = $4, notes = $5, updated_at = NOW()
      WHERE credential_id = $6 AND user_id = $7
      RETURNING *
    `;

    const result = await pool.query(queryText, [
      service_name,
      account_username,
      password_plain,
      url,
      notes,
      id,
      userId,
    ]);

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ error: "Credencial no encontrada o no autorizada" });
    }

    res.json({ message: "Credencial actualizada", credential: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar la credencial" });
  }
});

app.delete("/credentials/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId;

  try {
    const result = await pool.query(
      "DELETE FROM credentials WHERE credential_id = $1 AND user_id = $2 RETURNING *",
      [id, userId],
    );

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ error: "Credencial no encontrada o no autorizada" });
    }

    res.json({ message: "Credencial eliminada exitosamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar la credencial" });
  }
});
