//-----------------Import section -------------------------------------------------
const express = require("express");
const app = express();
const PORT = 8080;
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');

//---------------Active librairy section -----------------------------------------
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser())
app.set("view engine", "ejs");
app.use(express.static("public"));


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

//----------------------------Helper functions-------------------------------------

const emailChecker = (sourceEmail, bdEmail) => {
  for (let record in bdEmail) {
    if(sourceEmail === bdEmail[record].email) {
      return true    
    }
  }
};

const generateRandomString = () => {
  const prefix = "id"
  return prefix + Math.random().toString(36).substring(7)
};


//---------------------------Route for home -------------------------------------------

app.get("/", (req, res) => {
  res.send("Hello !");
});


//-------------------------Router authentification mecanism-----------------------------

app.get("/register", (req, res) => {
  templateVars = {user_id: req.cookies.user_id, users}
  res.render("urls_register", templateVars)
});

app.post("/register", (req, res) => {
  const index = generateRandomString();
  if(req.body.email === "" || req.body.password === "") {
    res.status(400).send("One of the required fields is empty !!!");
   
    return;
  }
  if (emailChecker(req.body.email, users)) {
    res.status(400).send("email already registered !!!")
    return;
  }
 
  users[index] = {
    email: req.body.email,
    password: req.body.password
  }
  res.cookie("user_id", index)
    
  res.redirect("urls")
});



app.post("/login", (req, res) => {

  const incomingEmail = req.body.email;
  const incomingPassword = req.body.password;

  if(emailChecker(incomingEmail, users)) {
    for(let user in users ) {
      if(incomingPassword === users[user].password && incomingEmail === users[user].email) {
       
        res.cookie("user_id", user)
        res.redirect("/urls")  
      }
    } 
  } else {
    res.status(403).send("Wrong credentials")
    return;
  }
  
})

app.get("/login", (req, res) => {
  const templateVars = {user_id:undefined, users};
  res.render("urls_login", templateVars)
})

app.post("/logout", (req, res) => {
  res.cookie("username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;");
  res.cookie("user_id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;");
  res.redirect("/urls")
})
//---------------------------Basic routing --------------------------------------------------

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
  if(req.cookies.user_id === undefined) {
    res.redirect("/login")
  }
  const templateVars = {urls: urlDatabase, user_id: req.cookies.user_id, email: users[req.cookies.user_id].email};
  res.render("urls_new", templateVars);
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

  res.redirect("/urls/");
});

app.get("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL];
  if(req.cookies.user_id === undefined) {
    res.redirect("/login")
  }
  
  const templateVars = { shortURL, longURL, user_id: req.cookies.user_id, email: users[req.cookies.user_id].email};

  res.render("urls_show", templateVars);
});

app.get("/urls", (req, res) => {
  if(req.cookies.user_id === undefined) {
    res.redirect("/login")
  }
  const cookie = {}
  const templateVars = {urls: urlDatabase, user_id: req.cookies.user_id, email: users[req.cookies.user_id].email};
  
  res.render("urls_index", templateVars);
});

app.get("/hello", (req, res) => {
  const templateVars = { greeting: "Hello World", user_id: req.cookies.user_id, email: users[req.cookies.user_id].email};

  res.render("hello_world", templateVars);
})

app.get("*", (req, res) => {
  res.send("404 page not found");
})

//-------------------------End of router section---------------------------------
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});