const Product = require("../../models/product");

exports.getAllProducts = (req, res) => {
  Product.getAllProducts((err, products) => {
    if (err) {
      return res.status(500).send("Lỗi khi lấy danh sách sản phẩm");
    }
    res.render("admin/books/index", { products: products });
  });
};

// Thêm sản phẩm
exports.showAddProduct = (req, res) => {
  res.render("admin/books/create");
};

// Xử lý thêm sách
exports.createProduct = (req, res) => {
  const myFile = req.file;
  const product = {
    title: req.body.title,
    author: req.body.author,
    price: req.body.price,
    stock: req.body.stock,
    image: myFile.filename,
    description: req.body.description,
  };

  Product.createProduct(product, (err, product) => {
    if (err) {
      return res.status(500).send("Lỗi khi thêm sách");
    }
    res.redirect("/admin/manageProd");
  });
};

exports.showUpdateProduct = (req, res) => {
  Product.getProductById(req.params.id, (err, product) => {
    if (err) {
      return res.status(500).send("Lỗi khi lấy sách");
    }
    res.render("admin/books/update", { book: product });
  });
};

exports.updateProduct = (req, res) => {
  const id = req.params.id;
  const myFile = req.file;
  const product = {
    title: req.body.title,
    author: req.body.author,
    price: req.body.price,
    stock: req.body.stock,
    image: myFile ? myFile.filename : req.body.oldImage,
    description: req.body.description,
  };
  console.log(id);
  console.log(product);
  Product.updateProduct(id, product, (err, product) => {
    if (err) {
      return res.status(500).send("Lỗi khi cập nhật sách");
    }
    res.redirect("/admin/manageProd");
  });
};

exports.deleteProduct = (req, res) => {
  Product.deleteProduct(req.params.id, (err, product) => {
    if (err) {
      return res.status(500).send("Lỗi khi xóa sách");
    }
    res.redirect("/admin/manageProd");
  });
};
