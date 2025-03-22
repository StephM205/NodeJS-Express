const db = require("./database");

const getAllProducts = (callback) => {
  db.query("SELECT * FROM books", (err, results) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, results);
    }
  });
};

const getBestSaleProduct = (callback) => {
  db.query("SELECT * FROM books ORDER BY stock ASC;", (err, results) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, results);
    }
  });
};

const getProductById = (id, callback) => {
  db.query("SELECT * FROM books WHERE id = ?", [id], (err, results) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, results[0]); // Trả về một object thay vì một mảng
    }
  });
};

const getRelatedProduct = (author, callback) => {
  db.query(
    "SELECT * FROM books WHERE author = ?",
    [author], // Thay thế giá trị author một cách đúng
    (err, results) => {
      if (err) {
        callback(err, null);
      } else {
        callback(null, results.length > 0 ? results : []); // Trả về mảng rỗng nếu không có dữ liệu
      }
    }
  );
};

const createProduct = (product, callback) => {
  db.query("INSERT INTO books SET ?", product, (err, results) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, results);
    }
  });
};

const updateProduct = (id, product, callback) => {
  db.query("UPDATE books SET ? WHERE id = ?", [product, id], (err, results) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, results);
    }
  });
};

const deleteProduct = (id, callback) => {
  db.query("DELETE FROM books WHERE id = ?", [id], (err, results) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, results);
    }
  });
};

module.exports = {
  getBestSaleProduct,
  getAllProducts,
  getProductById,
  getRelatedProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};
