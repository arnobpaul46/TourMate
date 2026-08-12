require("dotenv").config();

if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL =
    "postgresql://build:build@127.0.0.1:5432/build?schema=public";
}

const { execSync } = require("child_process");

execSync("npx prisma generate", { stdio: "inherit", env: process.env });
