const express = require("express");
const ordersController = require("/Users/Justas/Desktop/finalapi/controllers/orders");
const router = express.Router();

router.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin",
      "X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method === "OPTIONS") {
      res.header("Access-Control-Alow-Methods", "PUT,POST,PATCH,DELETE,GET");
      return res.status(200).json({});
    }
    next();
  });

router.post("/createOrder", ordersController.createOrder);
router.delete('/deleteOrder', ordersController.deleteOrder);
router.put('/updateOrder', ordersController.updateOrder);
router.get("/getOrders", ordersController.getOrders);
router.get("/getOrder", ordersController.getOrder);



router.post("/createTest", ordersController.createTest);
router.get("/getTest", ordersController.getTest);


module.exports = router;
