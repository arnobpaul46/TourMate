import express from "express";
import cors from "cors";
import { globalErrorHandler } from "./middlewares/globalErrorHandler";
import { notFound } from "./middlewares/notFound";
import routes from "./routes";

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL ?? "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use("/api", routes);
app.use(notFound);
app.use(globalErrorHandler);

export default app;
