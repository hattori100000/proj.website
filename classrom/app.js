const express = require("express");
const session = require('express-session');
const flash = require("connect-flash");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
}));

app.use(flash());

app.get('/flash', function(req, res){
  req.flash('info', 'Flash is back!');
  res.redirect('/');
});
 
app.get('/', function(req, res){
  res.render('index', { messages: req.flash('info') });
});

app.get("/test", (req,res)=>{
  res.send("test successful");
});

app.listen(3000, ()=> {
  console.log("connection on 3000");
});
