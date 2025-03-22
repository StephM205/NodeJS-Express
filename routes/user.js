const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const userController = require("../controllers/userController");
const rateController = require("../controllers/rateController");
const LocalStorage = require("node-localstorage").LocalStorage;
const localStorage = new LocalStorage("./scratch");
require("dotenv").config();

router.get("/", productController.getBestSaleProduct);

router.get("/product", productController.getAllProducts);

router.get("/product/:id", rateController.getRatesByBookId);
router.post("/product/:id/reviews", rateController.createRate);

router.get("/contact", (req, res) => {
  const name = localStorage.getItem("name");
  const role = localStorage.getItem("role");
  res.render("contact", { name, role });
});

router.get("/login", (req, res) => {
  const name = localStorage.getItem("name");
  const role = localStorage.getItem("role");
  res.render("login", { errors: null, name, role });
});

router.post("/register", userController.register);

router.post("/login", userController.login);

router.get("/forget-password", (req, res) => {
  const name = localStorage.getItem("name");
  const role = localStorage.getItem("role");
  res.render("forgetpw", { errors: null, name, role });
});
router.post("/forget-password", userController.forgetPassword);

router.get("/reset-password", userController.resetPassword);
router.post("/reset-password", userController.updatePassword);

router.get("/logout", userController.logout);

module.exports = router;
