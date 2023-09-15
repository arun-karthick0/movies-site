import express from "express";
const app = express();
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const PORT = process.env.PORT;
import cors from "cors";
const connection = process.env.CONNECTION_URL;
import Router from "./router/UserRouter.js";

// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.json("welcome");
});

app.use("/", Router);

mongoose
  .connect(connection, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(
    app.listen(PORT, () => {
      console.log(`http://localhost: ${PORT}`);
    })
  )
  .catch((err) => console.log(err));
