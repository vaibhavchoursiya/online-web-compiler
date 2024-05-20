const express = require("express");
const path = require("path");
const { errorHandler } = require("./middleware/errorhandler");
const { logger } = require("./middleware/logEvent");
const app = express();
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const connectDB = require("./config/connectdb.js");
const dotenv = require("dotenv");
dotenv.config();
const PORT = process.env.PORT;
const DATABASE_URL = process.env.DATABASE_URL;

/** Middlewares */
/* 
1) logger x
2) cors
3) express.urlencoded()
4) express.json()
5) express.static
6) error handler
*/
app.use(logger);
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

// DataBase
connectDB(DATABASE_URL);

/* Routes Handler */
app.use("/", require(path.join(__dirname, "routes", "router.js")));
app.use("/auth/user", require(path.join(__dirname, "routes", "userroutes.js")));
app.use("/api", require(path.join(__dirname, "routes", "api", "runapi.js")));

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server Running at ${PORT}`);
});
