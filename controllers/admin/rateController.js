const Rate = require("../../models/rate");

exports.getAllRates = (req, res) => {
  Rate.getAllRates((err, rates) => {
    if (err) {
      console.error("Lỗi khi lấy dữ liệu đánh giá:", err);
      return res.status(500).send("Lỗi khi lấy dữ liệu đánh giá");
    }
    res.render("admin/rates/index", { rates });
  });
};

exports.deleteRate = (req, res) => {
  Rate.deleteRate(req.params.id, (err, rate) => {
    if (err) {
      return res.status(500).send("Lỗi khi xóa đánh giá");
    }
    res.redirect("/admin/manageRate");
  });
};
