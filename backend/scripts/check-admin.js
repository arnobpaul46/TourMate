require("dotenv").config();
const { Client } = require("pg");
const bcrypt = require("bcrypt");

async function main() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();

  const result = await client.query(
    'SELECT id, email, role, password, "isDeleted" FROM "User" WHERE email = $1',
    ["admin@tourmate.com"]
  );

  console.log("rows:", result.rows.length);
  if (result.rows.length === 0) {
    console.log("Admin user not found");
    await client.end();
    return;
  }

  const user = result.rows[0];
  console.log("email:", user.email, "role:", user.role, "isDeleted:", user.isDeleted);
  console.log("hash prefix:", user.password.slice(0, 20));

  const valid = await bcrypt.compare("admin123", user.password);
  console.log("bcrypt.compare(admin123):", valid);

  const newHash = await bcrypt.hash("admin123", 12);
  console.log("new hash:", newHash);

  await client.end();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
