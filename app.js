const express = require("express");
const mysql = require("mysql");
const dotenv = require("dotenv");
const path = require("path");
const morgan = require("morgan");
const port = 4020;

// setting up express as "app"
const app = express();

app.use(morgan("dev"));



// Parse URL encoded bodies (making sure it's possible to grabdata from any forms)
app.use(express.urlencoded({ extended: false }));
app.use(express.json());


// setting up .env file path, so the app knows where it is
dotenv.config({ path: "./.env" });

// setting up public directory for files and etc.
const publicDirectory = path.join(__dirname, "./public");
app.use(express.static(publicDirectory));

// preventing CORS errors
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  next();
});



// creating a databse connection with hidden login information
const db = mysql.createConnection({
  // host: "localhost",
  //   user: "justas",
  //   password: "pass",
  //   database: "test",
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE,
  port: process.env.DATABASE_PORT,
});


//importing routes
const authRoutes = require("./api/routes/auth");
app.use("/api/auth", authRoutes);

const ordersRoutes = require("./api/routes/orders");
app.use("/api/orders", ordersRoutes);




// connecting to the db and logging out any error if they apear
db.connect((error) => {
  if (error) {
    console.log(error);
  } else {
    console.log("MySQL running");
  }
});

// setting up on which port the server will run
app.listen(port, () => {
  console.log(`Listening to ${port}`);
});
