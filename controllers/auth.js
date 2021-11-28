const express = require("express");
const mysql = require("mysql");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

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

exports.createUser = (req, res, next) => {
  const { name, email, password, role } = req.body;

  let hashedPassword;
  // register

  db.query(
    // selecting email from the user table
    "SELECT email FROM users WHERE email = ?",
    [email],
    // async so it doesn't load the rest before registering the user
    async (error, results) => {
      if (error) {
        return console.log(error);
      }
      // checking if the results on the db contain anything (entered email for registration)
      if (results.length > 0) {
        return res.json({
          message: "user already exists with that email",
        });
      } else {
        //hashing the password
        hashedPassword = await bcrypt.hash(password, 8);

        //sending new user data to the db
        db.query(
          "INSERT INTO users SET ?",
          { name: name, email: email, role: role, password: hashedPassword },
          (error, results) => {
            if (error) {
              console.log(error);
            } else {
              res.json({
                message: "User registered successfully",
              });
            }
          }
        );
      }
    }
  );
};














exports.login = (req, res, next) => {
  const { email, password } = req.body;

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "please enter login details",
      });
    }

    db.query(
      "SELECT * FROM users WHERE email = ?",
      [email],
      async (error, results) => {
        if (
          results.length <= 0 ||
          !(await bcrypt.compare(password, results[0].password))
        ) {
          res.status(401).json({
            message: "Email or Password is incorrect",
          });
        } else {
          const id = results[0].user_id;

          const token = jwt.sign({ id }, process.env.JWT_PASS, {
            expiresIn: process.env.JWT_EXPIRES_IN,
          });

          console.log("The token is: " + token);

          const cookieOptions = {
            expires: new Date(
              Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
            ),
            httpOnly: true,
          };

          res.cookie("jwt", token, cookieOptions);
          res.status(200)
          //.redirect("/");
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
};


exports.logout = (req, res) => {
  res.cookie("jwt", "logout", {
    expires: new Date(Date.now() + 2 * 1000),
    httpOnly: true,
  });
};
