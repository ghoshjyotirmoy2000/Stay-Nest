import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser"

const app = express();

app.use(cors({
  origin: process.env.ALLOWED_ORIGIN,
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());


app.get("/" , (req , res) => {
    res.send("server is running")
})

export default app;
