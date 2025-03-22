const multer = require("multer");
let myStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/images");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
let upload = multer({ storage: myStorage });

const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/admin/dashboardController");
const productController = require("../controllers/admin/productController");
const userController = require("../controllers/admin/userController");
const rateController = require("../controllers/admin/rateController");

router.get("/", dashboardController.index);

// Product
router.get("/manageProd", productController.getAllProducts);

router.get("/manageProd/createProd", productController.showAddProduct);
router.post(
  "/manageProd/createProd",
  upload.single("image"),
  productController.createProduct
);

router.get("/manageProd/updateProd/:id", productController.showUpdateProduct);
router.post(
  "/manageProd/updateProd/:id",
  upload.single("image"),
  productController.updateProduct
);

router.get("/manageProd/deleteProd/:id", productController.deleteProduct);

// Rate
router.get("/manageRate", rateController.getAllRates);

router.get("/manageRate/deleteRate/:id", rateController.deleteRate);

// User
router.get("/manageUser", userController.getUsers);

router.get("/manageUser/createUser", userController.showAddUser);
router.post("/manageUser/createUser", userController.addUser);

router.get("/manageUser/updateUser/:id", userController.showUpdateUser);
router.post("/manageUser/updateUser/:id", userController.updateUser);

router.get("/manageUser/deleteUser/:id", userController.deleteUser);

router.get("/logout", userController.logout);

module.exports = router;
