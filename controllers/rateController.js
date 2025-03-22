const Rate = require("../models/rate");
const User = require("../models/user");
const Product = require("../models/product");
const LocalStorage = require("node-localstorage").LocalStorage;
const localStorage = new LocalStorage("./scratch");

exports.getRatesByBookId = (req, res) => {
  const name = localStorage.getItem("name");
  const email = localStorage.getItem("email");
  const role = localStorage.getItem("role");
  Product.getProductById(req.params.id, (err, product) => {
    if (err) {
      return res.status(500).send("Lỗi khi lấy sách");
    }

    Rate.getRatesByBookId(req.params.id, (err, rates) => {
      if (err) {
        return res.status(500).send("Lỗi khi lấy sách");
      }
      res.render("detail", { rates, product, name, email, role });
    });
  });
};

exports.createRate = (req, res) => {
  const { user_name, book_title, rating, comment } = req.body;

  const user = User.getUserById(user_name, (err, user) => {
    if (err) {
      return res.status(500).send("Lỗi khi lấy sách");
    }
  });

  if (user === null) {
    return res.status(500).send("Lỗi khi lấy sách");
  } else if (!user_name || !book_title || !rating || !comment) {
    return res.status(400).send("Thiếu thông tin đánh giá");
  }

  const newRate = { user_name, book_title, rating, comment };

  Rate.createRate(newRate, (err, result) => {
    if (err) {
      return res.status(500).send("Lỗi khi tạo đánh giá");
    }
    res.redirect("/product/" + book_title);
  });
};
