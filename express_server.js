////GLOBAL VARS /////////

const express = require('express');
const app = express();
const PORT = 8080;
const bodyParser = require('body-parser');
const { generateRandomString } = require('./functions/generateRandomString');
const { emailLookUp } = require('./functions/emailLookUp');
const { getKeyByValue } = require('./functions/getKeyByValue');
const { getUserPassword } = require('./functions/getUserPassword');
const { urlsForUser } = require('./functions/urlsForUser');
const bcrypt = require('bcrypt');
const cookieSession = require('cookie-session');

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

app.use(cookieSession({
  name: 'session',
  keys: ["user_id"],

}));
////////DATABASES
const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "aJ48lW" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "aJ48lW" }
};

const users = {
  "aJ48lW": {
    id: "aJ48lW",
    email: "user@example.com",
    password: bcrypt.hashSync("purple-monkey-dinosaur",10)
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: bcrypt.hashSync("dishwasher-funk",10)
  }
};

////////ROUTES////////////////
///GET REQUESTS /////////////
//Main / page
app.get('/', (req,res) => {
  const user_id = req.session.user_id;
  if (user_id) {
    res.redirect('/urls');
  } else {

    res.redirect('/login');
  }
});
//Main URLS page
app.get("/urls", (req, res) => {
 
  const user_id = req.session.user_id;
 
  
  let templateVars = {
    urls: urlsForUser(user_id,urlDatabase),
    user: users[user_id]
    
  };
  res.render("urls_index", templateVars);
});

//Displays form where the user will submit their long url in order to create a new tiny one
app.get("/urls/new", (req,res) => {
  const user_id = req.session.user_id;

  let templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
    user: users[user_id]

  };

  if (!templateVars['user']) {
    res.redirect('/login');
  } else {

    res.render('urls_new', templateVars);
  }
});
//Template rendering
//Displays the long url and the short url
app.get("/urls/:shortURL", (req,res) => {
  const user_id = req.session.user_id;
  const shortURL = req.params.shortURL;

  if (user_id) {
    if (user_id === urlDatabase[shortURL]['userID']) {

      for (const key in urlDatabase) {
      
        if (key === shortURL) {
          let templateVars = {
            shortURL: req.params.shortURL,
            longURL: urlsForUser(user_id, urlDatabase)[shortURL],
            user: users[user_id]
          };
          return res.render('urls_show', templateVars);
       
        }
  
      }
      return res.status(403).send('shortURL id is invalid');
    }
    return res.status(403).send('URL not associated with userID');
 

  }

  res.redirect('/login');

      
});


//This route will take you to the longURL website upon shortURL click
app.get("/u/:shortURL", (req,res) => {

  const longURL = urlDatabase[req.params.shortURL]['longURL'];
  res.redirect(longURL);
});


//This route takes the user to the log in page
app.get('/login', (req,res) => {
  const user_id = req.session.user_id;

  let templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
    user: users[user_id]
   
  };

  res.render('login', templateVars);
});



//Displays Registration page
app.get('/register', (req,res) => {
  
  const user_id = req.session.user_id;

  if (user_id) {
    return res.redirect('/urls');
  } else {

    let templateVars = {
      shortURL: req.params.shortURL,
      longURL: urlDatabase[req.params.shortURL],
      user: users[user_id]
     
    };
    return res.render('registration', templateVars);
  }
  
});

////// POST REQUEST //////
//Post from urls_new's form onto /urls
app.post('/urls', (req, res) => {
  const longURL = req.body.longURL;
  const shortURL = generateRandomString();
  const user_id = req.session.user_id;
    
    

  urlDatabase[shortURL] = {
    "longURL": longURL,
    'userID': user_id
  };
  res.redirect(`urls/${shortURL}`);
});




//This route removes a URL resource from the database
app.post("/urls/:shortURL/delete", (req,res) => {
  const user_id = req.session.user_id;

  if (user_id) {

    delete urlDatabase[req.params.shortURL];
  }

  
  res.redirect('/urls');
});

//This route takes the user from url to url/:id through the edit button
app.post("/urls/:shortURL/", (req,res) => {
 
  res.redirect(`/urls/${req.params.shortURL}`);
    
  

  
  

});

//This route edits/updates the longURL & redirects to /urls
app.post('/urls/:shortURL/edit', (req,res) => {
  urlDatabase[req.params.shortURL]["longURL"] = req.body.longURL;
  
  
  res.redirect('/urls');
});
//This route logs the user and sets the cookie
app.post('/login', (req,res) => {
  const email = req.body.email;
  const password = req.body.password;
  const user_id = getKeyByValue(users,email);
  const currentIdPassword = getUserPassword(user_id,users);

  if (!user_id) {
    return res.status(403).send('Email cannot be found, please register');
  }

  if (bcrypt.compareSync(password,currentIdPassword)) {
    req.session.user_id = user_id;
    return res.redirect('/urls');
  } else {
    
    return res.status(403).send('Password is wrong, please try again');

  }
  
});


//This route clears the cookie and logs the user out
app.post('/logout', (req,res) => {
  res.clearCookie('session');
  
  res.redirect('/urls');
});


//This route handles the registration form data
app.post('/register', (req,res) => {
  
  const user_id = generateRandomString();
  const email = req.body.email;
  const password = req.body.password;
  //Error Handling
  if (email !== '' || password !== '') {
      
    if (emailLookUp(email,users)) {
      res.status(400).send('Email is already in the database. Please log in instead');
    } else {
      const hashedPassword = bcrypt.hashSync(password,10);
      users[user_id] = {
        id: user_id,
        email: email,
        password: hashedPassword
      };
      req.session.user_id = user_id;
      res.redirect('/urls');
    }
    
  }
}
);


app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});

