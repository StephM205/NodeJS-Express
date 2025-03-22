// controllers/productController.js
const Product = require("../models/product");
const Rate = require("../models/rate");
const LocalStorage = require("node-localstorage").LocalStorage;
const localStorage = new LocalStorage("./scratch");

exports.getAllProducts = (req, res) => {
  const name = localStorage.getItem("name");
  const role = localStorage.getItem("role");
  Product.getAllProducts((err, products) => {
    if (err) {
      return res.status(500).send("Lỗi khi lấy danh sách sản phẩm");
    }
    res.render("product", { products, name, role });
  });
};

exports.getBestSaleProduct = (req, res) => {
  const name = localStorage.getItem("name");
  const role = localStorage.getItem("role");
  Product.getBestSaleProduct((err, products) => {
    if (err) {
      return res.status(500).send("Lỗi khi lấy danh sách sản phẩm");
    }

    Rate.getRateByRating((err, rates) => {
      if (err) {
        console.error("Lỗi khi lấy dữ liệu đánh giá:", err);
        return res.status(500).send("Lỗi khi lấy dữ liệu đánh giá");
      }
      res.render("index", { products, rates, name, role });
    });
  });
};

exports.getByAuthor = (req, res) => {
  const name = localStorage.getItem("name");
  const role = localStorage.getItem("role");
  Product.getByAuthor(author, (err, data) => {
    if (err) {
      return res.status(500).send("Lỗi khi lấy danh sách sách phẩm");
    }
    res.render("index", { authorProd: data, name, role });
  });
};

exports.getProductById = (req, res) => {
  const name = localStorage.getItem("name");
  const role = localStorage.getItem("role");
  const productId = req.params.id;
  Product.getProductById(productId, (err, product) => {
    if (err) {
      return res.status(500).send("Lỗi khi lấy sản phẩm");
    }
    res.render("detail", { product, name, role });
  });
};

exports.getProductDetail = (req, res) => {
  const name = localStorage.getItem("name");
  const role = localStorage.getItem("role");
  Product.getRelatedProduct((err, data) => {
    if (err) {
      return res.status(500).send("Lỗi khi lấy danh sách sản phẩm");
    }
    res.render("detail", { products: data, name, role });
  });
};
