const express = require("express");
const app = express();
const PORT = 8080;
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");

const generateRandomString = () => {
 return Math.random().toString(36).substring(7)
}

const urlDatabase = {
    "b2xVn2": "www.lighthouselabs.ca",
    "Fsm5xK": "www.google.com",
};
//----------------------------Router section---------------------------------------

app.get("/", (req, res) => {
  res.send("Hello !");
});

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
  res.render("urls_new");
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
  const templateVars = { shortURL, longURL };

  res.redirect("/urls/");
});

app.get("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL];

  const templateVars = { shortURL, longURL};

  res.render("urls_show", templateVars);
});

app.get("/urls", (req, res) => {
  const templateVars = {urls: urlDatabase};

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