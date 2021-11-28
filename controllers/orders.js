const express = require("express");
const mysql = require("mysql");
const multer = require("multer");




const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 10 },
  fileFilter: fileFilter,
}).single("file");

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

exports.createOrder = (req, res, next) => {
  
  const { comment, name, fk_key } = req.body;
  db.query(
    "INSERT INTO user_orders SET ?",
    {
      picture_name: name,
      comment: comment,
      fk_key: fk_key,
    },
    (error, results) => {
      if (results) {
        console.log(results);
      } else {
        console.log(error);
      }
    }
  );
};



exports.getOrders = (req, res) => {
  try {
    db.query(
      "SELECT * FROM user_orders ",
      (error, results) => {
        if (results) {
          res.status(200).json(results);
        } else {
          res.status(500).json(error);
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
};

exports.getOrder = (req, res) => {
  let id = req.body.id;
  try {
    db.query(
      "SELECT * FROM user_orders WHERE picture_id = ?",
      [id],
      (error, results) => {
        if (results) {
          res.status(200).json(results);
        } else {
          res.status(500).json(error);
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
};

exports.updateOrder = (req, res) => {
  const { comment, id } = req.body;
  try {
    db.query(
      "UPDATE user_orders SET comment = ? WHERE picture_id = ?",
      [comment, id],
      (error, results) => {
        if (results) {
          res.status(200).json(results);
        } else {
          res.status(500).json(error);
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
};

exports.deleteOrder = (req, res) => {
  let id = req.body.id;
  try {
    db.query(
      "DELETE FROM user_orders WHERE order_id = ?",
      [id],
      (error, results) => {
        if (results) {
          res.status(200).json(results);
        } else {
          res.status(500).json(error);
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
};
/////////////





exports.createTest = (req, res, next) => {
  
  
  const { name} = req.body;
  db.query(
    "INSERT INTO test SET ?",
    {
      name:name
    },
    (error, results) => {
      if (results) {
        console.log(results);
      } else {
        console.log(error);
      }
    }
  );
};



exports.getTest = (req, res) => {
  try {
    db.query(
      "SELECT * FROM test ",
      (error, results) => {
        if (results) {
          res.status(200).json(results);
        } else {
          res.status(500).json(error);
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
};