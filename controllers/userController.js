const bcrypt = require("bcryptjs");
const User = require("../models/user");
const LocalStorage = require("node-localstorage").LocalStorage;
const localStorage = new LocalStorage("./scratch");
const validate = require("validator");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
require("dotenv").config();

exports.register = (req, res) => {
  const name = localStorage.getItem("name");
  const role = localStorage.getItem("role");
  const { username, email, password, phone, address, vaitro } = req.body;

  // Kiểm tra dữ liệu đầu vào (có thể thêm validate)
  const errors = {};
  if (validate.isEmpty(username)) {
    errors.username = "* Vui lòng nhập tên khách hàng!";
  }

  if (validate.isEmpty(email)) {
    errors.email = "* Vui lòng nhập địa chỉ email!";
  } else if (!validate.isEmail(email)) {
    errors.email = "* Vui lòng nhập địa chỉ email hợp lệ!";
  }

  if (validate.isEmpty(password)) {
    errors.password = "* Vui lòng nhập mật khẩu!";
  } else if (password.length < 6) {
    errors.password = "* Mật khẩu phải nhất 6 ký tự!";
  }

  if (validate.isEmpty(phone)) {
    errors.phone = "* Vui lòng nhập sđt khách hàng!";
  } else if (!validate.isMobilePhone(phone)) {
    errors.phone = "* Vui lòng nhập sđt hợp lệ!";
  }

  if (validate.isEmpty(address)) {
    errors.address = "* Vui lòng nhập địa chỉ khách hàng!";
  }

  if (Object.keys(errors).length === 0) {
    bcrypt.hash(password, 12, (err, hashedPassword) => {
      if (err) {
        console.error("Lỗi mã hóa mật khẩu:", err);
        return res.status(500).json({ error: "Lỗi server" });
      }

      // Gọi model để lưu vào database
      User.createUser(
        username,
        email,
        hashedPassword,
        phone,
        address,
        vaitro || "customer",
        (err, result) => {
          if (err) {
            console.error("Lỗi database:", err);
            return res.status(500).json({ error: "Lỗi server" });
          }
          res.redirect("/login");
        }
      );
    });
  } else {
    res.render("login", { errors: errors, name, role });
  }
};

exports.login = (req, res) => {
  const name = localStorage.getItem("name");
  const role = localStorage.getItem("role");

  let email = req.body.email;
  let password = req.body.password;

  const errors = {};

  if (validate.isEmpty(email)) {
    errors.email = "* Vui lòng nhập email!";
  } else if (!validate.isEmail(email)) {
    errors.email = "* Vui lòng nhập email hợp lệ!";
  }

  if (validate.isEmpty(password)) {
    errors.password = "* Vui lòng nhập mật khẩu!";
  }

  if (Object.keys(errors).length === 0) {
    User.loginUser(email, (err, data) => {
      if (err) throw err;
      if (data.length > 0) {
        const user = data[0];
        bcrypt.compare(password, user.password, (err, result) => {
          if (err) throw err;
          if (result) {
            localStorage.setItem("name", user.name);
            localStorage.setItem("email", user.email);
            localStorage.setItem("role", user.role);
            res.redirect("/");
          } else {
            errors.password = "* Mật khẩu không đúng!";
            res.render("login", { errors: errors, name, role });
          }
        });
      } else {
        errors.email = "* Email này chưa được đăng ký!";
        res.render("login", { errors: errors, name, role });
      }
    });
  } else {
    res.render("login", { errors: errors, name, role });
  }
};

exports.forgetPassword = (req, res) => {
  const name = localStorage.getItem("name");
  const role = localStorage.getItem("role");
  const email = req.body.email;
  const errors = {};

  if (validate.isEmpty(email)) {
    errors.email = "* Vui lòng nhập email!";
  } else if (!validate.isEmail(email)) {
    errors.email = "* Vui lòng nhập email hợp lệ!";
  }

  if (Object.keys(errors).length === 0) {
    User.forgetPassword(email, (err, data) => {
      if (err) throw err;
      if (data.length > 0) {
        const user = data[0];
        const token = jwt.sign(
          { email: user.email },
          process.env.JWT_SECRET_KEY,
          {
            expiresIn: "5m",
          }
        );

        const link = `http://localhost:1111/reset-password?token=${token}`;
        const transporter = nodemailer.createTransport({
          host: "smtp.gmail.com",
          port: 587,
          secure: false,
          auth: {
            user: process.env.MY_GMAIL,
            pass: process.env.MY_PASSWORD,
          },
        });

        const mailOptions = {
          from: "webbooksharrypotter@gmail.com",
          to: user.email,
          subject: "Reset Password",
          html: `<p>Nhấn <a href="${link}">vào đây</a> để cài lại mật khẩu.</p>`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error("Lỗi gửi email:", error);
          } else {
            console.log("Email gửi thành công:", info.response);
          }
        });
        res.send(
          "<script>alert('Vui lòng kiểm tra email!');window.location.href='/login';</script>"
        );
      } else {
        errors.email = "* Email này chưa được đăng ký!";
        res.render("forgetpw", { errors: errors, name, role });
      }
    });
  } else {
    res.render("forgetpw", { errors: errors, name, role });
  }
};

exports.resetPassword = (req, res) => {
  const name = localStorage.getItem("name");
  const role = localStorage.getItem("role");

  const token = req.query.token;
  const email = jwt.verify(token, process.env.JWT_SECRET_KEY).email;
  res.render("resetpw", { email, name, role });
};

exports.updatePassword = (req, res) => {
  // Lấy dữ liệu từ request body
  const { email, password, confirmPassword } = req.body;

  // Kiểm tra dữ liệu đầu vào
  if (!email || !password || !confirmPassword) {
    return res
      .status(400)
      .json({ message: "Vui lòng nhập email và mật khẩu mới." });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Mật khẩu không khớp." });
  }

  bcrypt.hash(password, 12, function (err, result) {
    if (err) {
      return res
        .status(500)
        .json({ message: "Lỗi khi cập nhật mật khẩu", error: err });
    }

    User.updatePassword(email, result, (err, result) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Lỗi khi cập nhật mật khẩu", error: err });
      }

      return res.send(
        "<script>alert('Đã cập nhật mật khẩu thành công!');window.location.href='/login';</script>"
      );
    });
  });
};

exports.logout = (req, res) => {
  localStorage.clear();
  res.redirect("/login");
};
