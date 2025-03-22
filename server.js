const express = require("express");
const app = express();

const body = require("body-parser");
app.use(body.urlencoded());

const LocalStorage = require("node-localstorage").LocalStorage;
const localStorage = new LocalStorage("./scratch");

app.set("view engine", "ejs");
app.set("views", "./views");

app.use(express.static("public"));

app.listen(1111, (req, res) => {
  console.log("Đã chạy!");
});

const adminRouter = require("./routes/admin");
const userRouter = require("./routes/user");

app.use("/admin", adminRouter);
app.use("/", userRouter);
