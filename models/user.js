const db = require("./database");

const getAllUsers = (callback) => {
  db.query("SELECT * FROM users", (err, results) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, results);
    }
  });
};

const getUserById = (id, callback) => {
  db.query("SELECT * FROM users WHERE id = ?", [id], (err, results) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, results[0]); // Trả về một object thay vì một mảng
    }
  });
};

const forgetPassword = (email, callback) => {
  db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, results);
    }
  });
};

// Người dùng
const createUser = (
  username,
  email,
  hashedPassword,
  phone,
  address,
  vaitro,
  callback
) => {
  const sql =
    "INSERT INTO users (name, email, password, phone, address, role, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())";
  db.query(
    sql,
    [username, email, hashedPassword, phone, address, vaitro],
    callback
  );
};

const loginUser = (email, callback) => {
  const sql = "SELECT * FROM users WHERE email = ?";
  db.query(sql, [email], callback);
};

const updateUser = (id, user, callback) => {
  db.query("UPDATE users SET ? WHERE id = ?", [user, id], (err, results) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, results);
    }
  });
};

const updatePassword = (email, password, callback) => {
  db.query(
    "UPDATE users SET password = ? WHERE email = ?",
    [password, email],
    (err, results) => {
      if (err) {
        callback(err, null);
      } else {
        callback(null, results);
      }
    }
  );
};

const deleteUser = (id, callback) => {
  db.query("DELETE FROM users WHERE id = ?", [id], (err, results) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, results);
    }
  });
};
module.exports = {
  getAllUsers,
  getUserById,
  forgetPassword,
  createUser,
  loginUser,
  updateUser,
  updatePassword,
  deleteUser,
};
