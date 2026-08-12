require("dotenv").config();
const { Client } = require("pg");
const bcrypt = require("bcrypt");

async function main() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();

  const adminPass = await bcrypt.hash("admin123", 12);
  const userPass = await bcrypt.hash("user123", 12);

  await client.query(
    `INSERT INTO "User" (id, name, email, password, role, "isDeleted", "createdAt", "updatedAt")
     VALUES (gen_random_uuid(), $1, $2, $3, 'ADMIN', false, NOW(), NOW())
     ON CONFLICT (email) DO UPDATE SET
       password = EXCLUDED.password,
       role = 'ADMIN',
       "isDeleted" = false,
       "updatedAt" = NOW()`,
    ["Admin", "admin@tourmate.com", adminPass]
  );

  await client.query(
    `INSERT INTO "User" (id, name, email, password, role, "isDeleted", "createdAt", "updatedAt")
     VALUES (gen_random_uuid(), $1, $2, $3, 'USER', false, NOW(), NOW())
     ON CONFLICT (email) DO UPDATE SET
       password = EXCLUDED.password,
       role = 'USER',
       "isDeleted" = false,
       "updatedAt" = NOW()`,
    ["Arnob", "user@gmail.com", userPass]
  );

  const verify = await client.query(
    'SELECT email, role FROM "User" WHERE email IN ($1, $2)',
    ["admin@tourmate.com", "user@gmail.com"]
  );

  console.log("Seeded users:", verify.rows);

  const admin = await client.query(
    'SELECT password FROM "User" WHERE email = $1',
    ["admin@tourmate.com"]
  );
  const ok = await bcrypt.compare("admin123", admin.rows[0].password);
  console.log("admin123 verify:", ok);

  await client.end();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
