const express = require('express');
const app = express();
const PORT = 8080;
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: true}));

//EJS is a template engine
app.set('view engine', 'ejs');
//Adding a route for this data
app.get("/urls", (req,res) => {
  let templateVars = {urls: urlDatabase};
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.post("/urls", (req,res) => {
  console.log(req.body);
  const request = req.body.longURL;
  const randomString = generateRandomString();
  urlDatabase[randomString] = request;
  res.redirect(302, `/urls/${randomString}`);
})

app.get("/urls/:shortURL", (req,res) => {
  let templateVars = {shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL]};

  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  // const longURL = ...
  
  const longURL = urlDatabase[req.params.shortURL];
  console.log(longURL);
  res.redirect(longURL);
});




const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
}

app.get("/", (req,res) => {
  res.send('Hello!');
});

app.get("/urls.json", (req,res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req,res) => {
  res.send("<html><body>Hello <b>World</b></body></html>")
})

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
})


function generateRandomString () {
  //Create a function that generates a string made of random characters
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const characterLength = 6;
  for(let i = 0; i < characterLength; i++) {
    result += characters.charAt(Math.floor(Math.random()* characterLength));
  }
  return result;
}