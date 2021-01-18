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
    "b2xVn2": "http://www.lighthouselabs.ca",
    "Fsm5xK": "http://www.google.com",
};

app.get("/", (req, res) => {
  res.send("Hello !");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.post("/urls", (req, res) => {
  let newIndex = generateRandomString();
  urlDatabase[newIndex] = req.body.longURL

  //console.log(req.body);  // Log the POST request body to the console
  res.redirect(`/urls/${newIndex}`)       // Respond with 'Ok' (we will replace this)
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL]
 // console.log(req.params)
  
  res.redirect(`http://${longURL}`);
});

app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
  res.render("urls_show", templateVars);
});

app.get("/urls", (req, res) => {
  const templateVars = {urls: urlDatabase};
  res.render("urls_index", templateVars);
});

app.get("/hello", (req, res) => {
  const templateVars = { greeting: "Hello World"}
  res.render("hello_world", templateVars)
})

app.get("*", (req, res) => {
  res.send("404 page not found")
})

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});