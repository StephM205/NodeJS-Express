const LocalStorage = require("node-localstorage").LocalStorage;
const localStorage = new LocalStorage("./scratch");

exports.index = (req, res) => {
  const email = localStorage.getItem("email");
  const password = localStorage.getItem("password");
  const role = localStorage.getItem("role");
  if (email) {
    if (role === "admin") {
      res.render("admin/dashboard");
    } else {
      localStorage.clear();
      res.redirect("/login");
    }
  } else {
    res.redirect("/login");
  }
};
