const bcrypt = require("bcryptjs");
const User = require("../../models/user");
const LocalStorage = require("node-localstorage").LocalStorage;
const localStorage = new LocalStorage("./scratch");
const validate = require("validator");

exports.getUsers = (req, res) => {
  User.getAllUsers((err, users) => {
    if (err) {
      console.error("Lỗi database:", err);
      return res.status(500).json({ error: "Lỗi server" });
    }
    res.render("admin/users/index", { users });
  });
};

exports.showAddUser = (req, res) => {
  res.render("admin/users/create");
};

exports.addUser = (req, res) => {
  const { name, email, password, phone, address, role } = req.body;

  bcrypt.hash(password, 12, (err, hashedPassword) => {
    if (err) {
      console.error("Lỗi database:", err);
      return res.status(500).json({ error: "Lỗi server!" });
    }

    User.createUser(
      name,
      email,
      hashedPassword,
      phone,
      address,
      role,
      (err, result) => {
        if (err) {
          console.error("Lỗi database:", err);
          return res.status(500).json({ error: "Lỗi server" });
        }
        res.redirect("/admin/manageUser");
      }
    );
  });
};

exports.showUpdateUser = (req, res) => {
  User.getUserById(req.params.id, (err, user) => {
    if (err) {
      return res.status(500).send("Lỗi khi lấy sách");
    }
    res.render("admin/users/update", { users: user });
  });
};

exports.updateUser = (req, res) => {
  const id = req.params.id;
  const user = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    phone: req.body.phone,
    address: req.body.address,
    role: req.body.role,
  };
  User.updateUser(id, user, (err, result) => {
    if (err) {
      return res.status(500).send("Lỗi khi cập nhật tài khoản");
    }
    res.redirect("/admin/manageUser");
  });
};

exports.deleteUser = (req, res) => {
  User.deleteUser(req.params.id, (err, user) => {
    if (err) {
      return res.status(500).send("Lỗi khi xóa sách");
    }
    res.redirect("/admin/manageUser");
  });
};

exports.logout = (req, res) => {
  localStorage.clear();
  res.redirect("/login");
};
