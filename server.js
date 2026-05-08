const mongoose = require("mongoose");
const dotenv = require("dotenv");

// Handle Uncaught Exceptions (Must be at the very top)
process.on('uncaughtException', err => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: "./config.env" });

const app = require("./app");

if (!process.env.DATABASE) {
  throw new Error("DATABASE environment variable is required.");
}

if (process.env.DATABASE.includes("<db_password>") && !process.env.DATABASE_PASSWORD) {
  throw new Error("DATABASE_PASSWORD environment variable is required when DATABASE contains <db_password>.");
}

const DB = process.env.DATABASE.replace(
  "<db_password>",
  process.env.DATABASE_PASSWORD || "",
);
mongoose
  .connect(DB)
  .then(() => {
    console.log("DB connected successfully!");
  })
  .catch(err => {
    console.log("DATABASE CONNECTION FAILED! Shutting down...");
    console.log(err.name, err.message);
    process.exit(1);
  });

const port = process.env.PORT || 3000;
const host = process.env.HOST || "0.0.0.0";

const server = app.listen(port, host, () => {
  console.log(`App running on ${host}:${port}...`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
});

process.on('unhandledRejection', err => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
