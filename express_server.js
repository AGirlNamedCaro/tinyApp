const express = require('express');
const app = express();
const PORT = 8080;
const bodyParser = require('body-parser');
const { generateRandomString } = require('./functions/generateRandomString')
const cookieParser = require('cookie-parser')

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser())

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

//ROUTES
  //Main URLS page
app.get("/urls", (req, res) => {
  let templateVars = { 
    urls: urlDatabase,
    username: req.cookies["username"]
   };
  res.render("urls_index", templateVars);
});
  //Post from urls_new's form onto /urls
  app.post('/urls', (req, res) => {
    const longURL = req.body.longURL;
    const shortURL = generateRandomString();

    urlDatabase[shortURL] = longURL;
    res.redirect(`urls/${shortURL}`);
  })
//Displays form where the user will submit their long url in order to create a new tiny one
app.get("/urls/new", (req,res) => {
  let templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
    username: req.cookies["username"]
  };
  res.render('urls_new', templateVars);
})

//This route will take you to the longURL website upon shortURL click
app.get("/u/:shortURL", (req,res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
})

//This route removes a URL resource from the database
app.post("/urls/:shortURL/delete", (req,res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect('/urls');
})

//This route takes the user from url to url/:id through the edit button
app.post("/urls/:shortURL/", (req,res) => {
  res.redirect(`/urls/${req.params.shortURL}`)
})

//This route edits/updates the longURL & redirects to /urls
app.post('/urls/:shortURL/edit', (req,res) => {
  urlDatabase[req.params.shortURL] = req.body.longURL;
  res.redirect('/urls');
})
//This route logs the user and sets the cookie
app.post('/login', (req,res) => {
  const username = req.body.username;
  res.cookie('username', username);
  
  res.redirect('/urls');
})

//This route clears the cookie and logs the user out
app.post('/logout', (req,res) => {
  res.clearCookie('username');
  res.redirect('/urls');
})

//Template rendering
  //Displays the long url and the short url
app.get("/urls/:shortURL", (req,res) => {
  let templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
    username: req.cookies["username"]
  };

  res.render('urls_show', templateVars);
})

//Displays Registration page
app.get('/register', (req,res) => {
  let templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
    username: req.cookies["username"]
  };

  res.render('registration', templateVars);
})















app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
})

