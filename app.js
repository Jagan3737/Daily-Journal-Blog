//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

const app = express();

app.use(express.static("public"));

app.use(bodyParser.urlencoded({
  extended: true
}));

app.set('view engine', 'ejs');

mongoose.connect("mongodb+srv://admin-jagan:"+ process.env.MONGOPASSWORD +"@cluster0.holfo.mongodb.net/blogpostsDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const blogSchema = new mongoose.Schema({
  title: String,
  post: String
});

const Blog = mongoose.model("Blog", blogSchema);

const homeStartingContent = "Don’t focus on having a great blog. Focus on producing a blog that’s great for your readers.";
const aboutContent = "Hi, I am Jagan. I am an enthusiastic guy studying Civil Engineering in National Institute of Technology, Tiruchirappalli (NITT). I am proficient in C,C++ programming languages. My area of interest is web development. I am currently learning Front-End Development tools like HTML, CSS, Javascript and Bootstrap framework. My hobbies are to play cricket and surfing through YouTube. ";

app.get("/", function(req, res) {
  Blog.find({}, function(err, blogs){
    res.render("home", {
      homeStartingContent: homeStartingContent,
      posts: blogs
    });
  });
});

app.get("/about", function(req, res) {
  res.render("about", {
    aboutContent: aboutContent
  });
});


app.get("/compose", function(req, res) {
  res.render("compose");
});

app.get("/posts/:topic", function(req, res) {
  const topicName = req.params.topic;
  Blog.findOne({title: topicName}, function(err, element){
    res.render("post", {
      titleName: element.title,
      content: element.post
    });
  });
});

app.post("/", function(req, res) {
  var title = req.body.title;
  title = title.trim();
  const postInput = new Blog({
    title: title,
    post: req.body.post
  });
  postInput.save();
  res.redirect("/");
});

app.post("/compose", function(req, res) {
  res.redirect("/compose");
});


app.listen(process.env.PORT||3000, function() {
  console.log("Server started on port 3000");
});
