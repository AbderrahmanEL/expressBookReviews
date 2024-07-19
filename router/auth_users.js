const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const JWT_SECRET = "1889c985aec82754070cabf8f8b5e66ddd60599ffd0b03d3ef8e8202c6d94471";

const isValid = (username) => {
  // Placeholder function for username validation, replace with your logic if needed
  return true; // Example: Always return true for simplicity
};

const authenticatedUser = (username, password) => {
  const user = users.find(user => user.username === username && user.password === password);
  return user; // Returns the user object or null if not found
};

// Login endpoint to authenticate users
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Validate username (optional step based on your requirements)
  if (!isValid(username)) {
    return res.status(400).json({ message: "Invalid username" });
  }

  // Authenticate user
  const user = authenticatedUser(username, password);
  if (!user) {
    return res.status(400).json({ message: "Logging failed" });
  }

  // Generate JWT token
  const token = jwt.sign(
    { username: user.username },
    JWT_SECRET,
    { expiresIn: '1h' }
  );

  req.session.user = user

  return res.status(200).json({ message: "Login successful", token });
});

// Add a book review endpoint (example placeholder)
regd_users.put("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const { review } = req.query

  const username = req.session.user.username; // Retrieve username from session

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  // Check if user has already reviewed the book
  const existingReview = books[isbn].reviews.find(r => r.username === username);

  if (existingReview) {
    // Modify the existing review
    existingReview.review = review;
  } else {
    // Add a new review
    books[isbn].reviews.push({ username, review });
  }

  return res.status(200).json({ message: "Review added/modified successfully" });
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const username = req.session.user.username; // Retrieve username from session

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  const initialLength = books[isbn].reviews.length;
  // Filter out the review by the username
  books[isbn].reviews = books[isbn].reviews.filter(review => review.username !== username);

  if (books[isbn].reviews.length === initialLength) {
    return res.status(404).json({ message: "Review not found" });
  }

  return res.status(200).json({ message: "Review deleted successfully" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
