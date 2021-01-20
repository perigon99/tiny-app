const express = require("express");
const app = express();
const PORT = 8080;
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
const cookieParser = require('cookie-parser');
app.use(cookieParser())
app.set("view engine", "ejs");

const generateRandomString = () => {
 return Math.random().toString(36).substring(7)
}
//---------------------------Fake data--------------------------------------------
const urlDatabase = {
    "b2xVn2": "www.lighthouselabs.ca",
    "Fsm5xK": "www.google.com",
};
const users = { 
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};
//----------------------------Router section---------------------------------------

app.get("/", (req, res) => {
  res.send("Hello !");
});

app.get("/register", (req, res) => {
  templateVars = {username: req.cookies.username}
  res.render("urls_register", templateVars)
});

app.post("/register", (req, res) => {
  const index = generateRandomString();
  
  for (let record in users) {
    console.log(users[record].email)
    if(req.body.email === users[record].email) {
      res.send("email already exist");
      
    }
  }
  users[index] = {
    email: req.body.email,
    password: req.body.password
  }
  res.cookie("username", users[index].email)
    
  res.redirect("urls")
});

app.post("/login", (req, res) => {
  const name = req.body.username
  res.cookie("username", name)
  res.redirect("/urls")
})

app.post("/logout", (req, res) => {
  res.cookie("username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;");
  res.redirect("/urls")
})

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.post("/urls", (req, res) => {
  let newIndex = generateRandomString();
  urlDatabase[newIndex] = req.body.longURL

  res.redirect(`/urls/${newIndex}`);      
});

app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];
  
  res.redirect(`/urls/`);  
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new", users);
});

app.get("/u/:shortURL", (req, res) => {
  let longURL = urlDatabase[req.params.shortURL];

  longURL = "http://" + longURL;
  
  res.redirect(longURL);
});

app.post("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = req.body.longURL;

  urlDatabase[shortURL] = longURL;
  const templateVars = { shortURL, longURL, username: req.cookies.username };

  res.redirect("/urls/");
});

app.get("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL];
  
  const templateVars = { shortURL, longURL, username: req.cookies.username, users};

  res.render("urls_show", templateVars);
});

app.get("/urls", (req, res) => {
  const templateVars = {urls: urlDatabase, username: req.cookies.username, users};

  res.render("urls_index", templateVars);
});

app.get("/hello", (req, res) => {
  const templateVars = { greeting: "Hello World"};

  res.render("hello_world", templateVars);
})

app.get("*", (req, res) => {
  res.send("404 page not found");
})

//-------------------------End of router section---------------------------------
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});