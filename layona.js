/* Required */
const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const cookieParser = require("cookie-parser");
const app = express();
let port = 3000;
app.use(cookieParser());
const dotenv = require("dotenv");
dotenv.config();
const conn = require("./mongoose.js");
conn();
const morgan = require("morgan");
const User = require("./models/user.js");
app.set("view engine", "ejs");
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));
app.listen(port, () => {
  console.log("mongoDB Bağlantı kuruldu");
});
app.use(bodyParser.json()).use(
  bodyParser.urlencoded({
    extended: true,
  })
);

/* Servers */

app.get("/", async function (req, res) {
  let id = req.params.id;
  User.findById(id).then((result) => {
    if (result) {
      res.redirect("/login");
    } else {
      res.render("register");
    }
  });
});
app.get('/register',async function(req,res){
  res.render("register")
})
app.get("/login", async function (req, res) {
  res.render("login");
});

app.post("/register", async function (req, res) {
  User.findOne(
    { username: req.body.username, password: req.body.password },
    (user, err) => {
      if (user) {
        res.send("Böyle Bir Kullanıcı Zaten Bulunuyordu");
      } else {
        let user = new User({
          username: req.body.username,
          password: req.body.password,
        });
        user.save().then((result) => {
          res.redirect(`/user/${result._id}`);
        });
      }
    }
  );
});

app.post('/login',async function(req,res){
  User.findOne({ username:req.body.username , password:req.body.password }).then((result)=>{
    if(result){
      res.redirect(`/user/${result._id}`)
    }else{
      res.send(`Böyle Bir Kullanıcı Yok Kayıt Bölümüne Gitmek İçin <a href="/register">Tıkla</a>`)
    }
  })
})


app.get('/user/:id',(req,res)=>{
  let id = req.params.id
  User.findOne({ _id:id }).then((result)=>{
    let isim =  result.username
     res.send(`Admin Sayfasına Hoşgeldiniz ${isim}`)
  })
})