import express from "express";
import http from "http";
import dotenv from 'dotenv';
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import compression from "compression";
import router from "./router";
import connectDB from "./config/dataBase";


dotenv.config();
const app = express();
app.use(express.urlencoded({ extended: true }));


app.use(cors({
  credentials: true,
}));

app.use(compression());

app.use(bodyParser.json());

app.use(cookieParser());

const server = http.createServer(app);
const port = process.env.PORT || 8080;

connectDB();
server.listen(port, () => {
  console.log(`Server started on port ${port}`);
});




app.use('/', router());

export default app;