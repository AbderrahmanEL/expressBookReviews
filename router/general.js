const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  if(username && password){
    users.push({username: username , password: password})
    return res.status(300).json({message: "Customer sucessifully registered "});
  }
  return res.status(400).json({message: "Thank to provide username and password"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.status(300).json({books : books});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  if(books[isbn])  return res.status(300).json(books[isbn]);
  return res.status(400).json({message: "this ISBN desn't exist"});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  for(key in books){

     if(books[key].author === author) 
      return res.status(300).json(books[key]);
  }
  return res.status(400).json({message: "No book has that author"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  for(key in books){
 
     if(books[key].title === title) 
      return res.status(300).json(books[key]);
  }
  return res.status(400).json({message: "No book has that title "});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  if(books[isbn])  return res.status(300).json(books[isbn].reviews);
  return res.status(400).json({message: "this ISBN desn't exist"});
});

module.exports.general = public_users;
