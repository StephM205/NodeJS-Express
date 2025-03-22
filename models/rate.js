const db = require("./database");

const getAllRates = (callback) => {
  const sql = `
      SELECT rates.id, users.name AS user_name, books.title AS book_title, 
             rates.rating, rates.comment, rates.create_at
      FROM rates
      JOIN users ON rates.user_id = users.id
      JOIN books ON rates.book_id = books.id
      ORDER BY rates.create_at DESC;
  `;

  db.query(sql, (err, results) => {
    if (err) {
      return callback(err, null);
    }
    callback(null, results);
  });
};

const getRateByRating = (callback) => {
  const sql = `
      SELECT rates.id, users.name AS user_name, books.title AS book_title, 
             rates.rating, rates.comment, rates.create_at
      FROM rates
      JOIN users ON rates.user_id = users.id
      JOIN books ON rates.book_id = books.id
      ORDER BY rates.rating DESC;
  `;

  db.query(sql, (err, results) => {
    if (err) {
      return callback(err, null);
    }
    callback(null, results);
  });
};

const getRatesByBookId = (bookId, callback) => {
  const sql = `
      SELECT rates.id, users.name AS user_name, books.title AS book_title, 
             rates.rating, rates.comment, rates.create_at
      FROM rates
      JOIN users ON rates.user_id = users.id
      JOIN books ON rates.book_id = books.id
      WHERE rates.book_id = ?
      ORDER BY rates.create_at DESC;
  `;

  db.query(sql, [bookId], (err, results) => {
    if (err) {
      return callback(err, null);
    }
    callback(null, results);
  });
};

const createRate = (rate, callback) => {
  const { user_name, book_title, rating, comment } = rate;

  const sql = `
      INSERT INTO rates (user_id, book_id, rating, comment, create_at)
      VALUES (
          (SELECT id FROM users WHERE name = ? LIMIT 1),
          ?,
          ?, ?, NOW()
      )
  `;

  db.query(sql, [user_name, book_title, rating, comment], (err, results) => {
    if (err) {
      console.error("Lỗi SQL:", err);
      return callback(err, null);
    }
    console.log("Thêm đánh giá thành công!", results);
    callback(null, results);
  });
};

const deleteRate = (id, callback) => {
  db.query("DELETE FROM rates WHERE id = ?", [id], (err, results) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, results);
    }
  });
};

module.exports = {
  getAllRates,
  getRateByRating,
  getRatesByBookId,
  createRate,
  deleteRate,
};
